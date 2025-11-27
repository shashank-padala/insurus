-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  safety_score NUMERIC DEFAULT 100 NOT NULL,
  total_points_earned INTEGER DEFAULT 0 NOT NULL,
  current_tier TEXT DEFAULT 'Starter' NOT NULL,
  last_safety_score_reset DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'USA' NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'rental')),
  safety_devices JSONB DEFAULT '[]'::jsonb,
  risk_assessment JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create risk_categories table
CREATE TABLE IF NOT EXISTS public.risk_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  examples JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create task_categories table
CREATE TABLE IF NOT EXISTS public.task_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  risk_category_id UUID NOT NULL REFERENCES public.risk_categories(id) ON DELETE RESTRICT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create task_templates table
CREATE TABLE IF NOT EXISTS public.task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  task_category_id UUID NOT NULL REFERENCES public.task_categories(id) ON DELETE RESTRICT,
  risk_category_id UUID NOT NULL REFERENCES public.risk_categories(id) ON DELETE RESTRICT,
  points_value INTEGER NOT NULL CHECK (points_value >= 1 AND points_value <= 10),
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'annually', 'as_needed')),
  verification_type TEXT NOT NULL CHECK (verification_type IN ('photo', 'receipt', 'document', 'both')),
  insurance_relevance TEXT NOT NULL,
  example_evidence JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create points_tiers table
CREATE TABLE IF NOT EXISTS public.points_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier_name TEXT UNIQUE NOT NULL,
  min_points INTEGER NOT NULL,
  max_points INTEGER,
  insurance_discount NUMERIC NOT NULL CHECK (insurance_discount >= 0 AND insurance_discount <= 100),
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create insurance_discounts table
CREATE TABLE IF NOT EXISTS public.insurance_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier_id UUID NOT NULL REFERENCES public.points_tiers(id) ON DELETE RESTRICT,
  discount_percentage NUMERIC NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  points_required INTEGER NOT NULL,
  benefits JSONB NOT NULL,
  partner_eligible BOOLEAN DEFAULT true NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create points_redemption_options table
CREATE TABLE IF NOT EXISTS public.points_redemption_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  redemption_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points_cost INTEGER DEFAULT 0 NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('insurance', 'services', 'products', 'cashback')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create task_checklists table
CREATE TABLE IF NOT EXISTS public.task_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  checklist_month DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE NOT NULL,
  ai_generation_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(property_id, checklist_month)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID NOT NULL REFERENCES public.task_checklists(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.task_templates(id) ON DELETE SET NULL,
  task_name TEXT NOT NULL,
  description TEXT NOT NULL,
  task_category_id UUID NOT NULL REFERENCES public.task_categories(id) ON DELETE RESTRICT,
  risk_category_id UUID NOT NULL REFERENCES public.risk_categories(id) ON DELETE RESTRICT,
  base_points_value INTEGER NOT NULL CHECK (base_points_value >= 1 AND base_points_value <= 10),
  frequency TEXT NOT NULL,
  verification_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'verified', 'rejected')),
  photo_url TEXT,
  receipt_url TEXT,
  verification_result JSONB,
  points_earned INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  due_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create task_completion_streaks table
CREATE TABLE IF NOT EXISTS public.task_completion_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.task_templates(id) ON DELETE CASCADE,
  consecutive_months INTEGER DEFAULT 1 NOT NULL,
  last_completed_month DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, property_id, template_id)
);

-- Create verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  photo_url TEXT,
  receipt_url TEXT,
  ai_analysis JSONB NOT NULL,
  is_verified BOOLEAN NOT NULL,
  verification_confidence NUMERIC CHECK (verification_confidence >= 0 AND verification_confidence <= 1),
  rejection_reason TEXT,
  verification_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create blockchain_transactions table
CREATE TABLE IF NOT EXISTS public.blockchain_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  vechain_tx_hash TEXT UNIQUE NOT NULL,
  metadata JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  base_points INTEGER NOT NULL,
  frequency_multiplier NUMERIC NOT NULL,
  verification_bonus INTEGER NOT NULL,
  streak_bonus INTEGER NOT NULL,
  early_completion_bonus INTEGER NOT NULL,
  blockchain_tx_id UUID REFERENCES public.blockchain_transactions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create safety_score_history table
CREATE TABLE IF NOT EXISTS public.safety_score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  previous_score NUMERIC NOT NULL,
  new_score NUMERIC NOT NULL,
  change_reason TEXT NOT NULL,
  related_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_task_checklists_property_id ON public.task_checklists(property_id);
CREATE INDEX IF NOT EXISTS idx_tasks_checklist_id ON public.tasks(checklist_id);
CREATE INDEX IF NOT EXISTS idx_tasks_template_id ON public.tasks(template_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_task_id ON public.rewards(task_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_user_id ON public.blockchain_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_task_id ON public.blockchain_transactions(task_id);
CREATE INDEX IF NOT EXISTS idx_safety_score_history_user_id ON public.safety_score_history(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completion_streaks_user_id ON public.task_completion_streaks(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_templates_updated_at BEFORE UPDATE ON public.task_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_checklists_updated_at BEFORE UPDATE ON public.task_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_completion_streaks_updated_at BEFORE UPDATE ON public.task_completion_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_redemption_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completion_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_score_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for properties
CREATE POLICY "Users can view own properties" ON public.properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reference tables (read-only for authenticated users)
CREATE POLICY "Authenticated users can view risk categories" ON public.risk_categories
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Authenticated users can view task categories" ON public.task_categories
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Authenticated users can view task templates" ON public.task_templates
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Authenticated users can view points tiers" ON public.points_tiers
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Authenticated users can view insurance discounts" ON public.insurance_discounts
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

CREATE POLICY "Authenticated users can view redemption options" ON public.points_redemption_options
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- RLS Policies for task_checklists
CREATE POLICY "Users can view own checklists" ON public.task_checklists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = task_checklists.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own checklists" ON public.task_checklists
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = task_checklists.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.task_checklists
      JOIN public.properties ON properties.id = task_checklists.property_id
      WHERE task_checklists.id = tasks.checklist_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.task_checklists
      JOIN public.properties ON properties.id = task_checklists.property_id
      WHERE task_checklists.id = tasks.checklist_id
      AND properties.user_id = auth.uid()
    )
  );

-- RLS Policies for rewards
CREATE POLICY "Users can view own rewards" ON public.rewards
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for blockchain_transactions
CREATE POLICY "Users can view own transactions" ON public.blockchain_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for safety_score_history
CREATE POLICY "Users can view own score history" ON public.safety_score_history
  FOR SELECT USING (auth.uid() = user_id);

