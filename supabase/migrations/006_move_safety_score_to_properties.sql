-- Migration: Move safety_score from users to properties
-- This simplifies the safety score system by making it property-specific
-- Initial value is 0 (simpler than starting at 100)

-- Add safety_score column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS safety_score NUMERIC DEFAULT 0 NOT NULL;

-- Calculate and set initial safety_score for existing properties based on their completed tasks
-- This gives existing properties a safety score based on their task completion history
UPDATE public.properties
SET safety_score = COALESCE((
  SELECT 
    GREATEST(0, 
      SUM(
        CASE 
          WHEN t.status = 'verified' THEN t.base_points_value * 1.5
          WHEN t.status = 'rejected' THEN -5
          ELSE 0
        END
      )
    )
  FROM task_checklists tc
  JOIN tasks t ON t.checklist_id = tc.id
  WHERE tc.property_id = properties.id
), 0);

-- Drop the trigger that depends on safety_score column
DROP TRIGGER IF EXISTS log_safety_score_changes ON public.users;

-- Remove safety_score and last_safety_score_reset from users table
ALTER TABLE public.users 
DROP COLUMN IF EXISTS safety_score,
DROP COLUMN IF EXISTS last_safety_score_reset;

