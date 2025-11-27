-- Database functions for safety score calculation and tier updates

-- Function to calculate safety score change
CREATE OR REPLACE FUNCTION calculate_safety_score_change(
  task_points INTEGER,
  is_completed BOOLEAN,
  days_overdue INTEGER DEFAULT 0,
  is_missed BOOLEAN DEFAULT false
) RETURNS NUMERIC AS $$
DECLARE
  score_change NUMERIC := 0;
BEGIN
  IF is_completed THEN
    -- Add points based on task importance (1.5x multiplier)
    score_change := task_points * 1.5;
  ELSIF is_missed THEN
    -- Deduct 5 points for missed tasks
    score_change := -5;
  ELSIF days_overdue > 0 THEN
    -- Deduct points based on how overdue
    IF days_overdue > 30 THEN
      score_change := -10;
    ELSIF days_overdue > 14 THEN
      score_change := -5;
    ELSIF days_overdue > 7 THEN
      score_change := -3;
    END IF;
  END IF;
  
  RETURN score_change;
END;
$$ LANGUAGE plpgsql;

-- Function to update user tier based on total points
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
DECLARE
  new_tier TEXT;
BEGIN
  SELECT tier_name INTO new_tier
  FROM public.points_tiers
  WHERE NEW.total_points_earned >= min_points
    AND (max_points IS NULL OR NEW.total_points_earned <= max_points)
    AND is_active = true
  ORDER BY display_order DESC
  LIMIT 1;
  
  IF new_tier IS NOT NULL AND new_tier != NEW.current_tier THEN
    NEW.current_tier := new_tier;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update tier when points change
CREATE TRIGGER update_tier_on_points_change
  BEFORE UPDATE OF total_points_earned ON public.users
  FOR EACH ROW
  WHEN (OLD.total_points_earned IS DISTINCT FROM NEW.total_points_earned)
  EXECUTE FUNCTION update_user_tier();

-- Function to log safety score changes
CREATE OR REPLACE FUNCTION log_safety_score_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.safety_score IS DISTINCT FROM NEW.safety_score THEN
    INSERT INTO public.safety_score_history (
      user_id,
      previous_score,
      new_score,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.safety_score,
      NEW.safety_score,
      'score_update'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log safety score changes
CREATE TRIGGER log_safety_score_changes
  AFTER UPDATE OF safety_score ON public.users
  FOR EACH ROW
  WHEN (OLD.safety_score IS DISTINCT FROM NEW.safety_score)
  EXECUTE FUNCTION log_safety_score_change();

