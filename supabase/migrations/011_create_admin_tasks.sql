-- Migration: Create admin_tasks and user_admin_tasks tables
-- Admin tasks are created by admins and pushed to all users

-- Create admin_tasks table
CREATE TABLE IF NOT EXISTS public.admin_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_name TEXT NOT NULL,
  description TEXT NOT NULL,
  task_category_id UUID NOT NULL REFERENCES public.task_categories(id) ON DELETE RESTRICT,
  risk_category_id UUID NOT NULL REFERENCES public.risk_categories(id) ON DELETE RESTRICT,
  base_points_value INTEGER NOT NULL CHECK (base_points_value >= 1 AND base_points_value <= 10),
  verification_type TEXT NOT NULL CHECK (verification_type IN ('photo', 'receipt', 'document', 'both')),
  deadline DATE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create user_admin_tasks junction table
CREATE TABLE IF NOT EXISTS public.user_admin_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_task_id UUID NOT NULL REFERENCES public.admin_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(admin_task_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_tasks_is_active 
ON public.admin_tasks(is_active);

CREATE INDEX IF NOT EXISTS idx_admin_tasks_created_at 
ON public.admin_tasks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_admin_tasks_admin_task_id 
ON public.user_admin_tasks(admin_task_id);

CREATE INDEX IF NOT EXISTS idx_user_admin_tasks_user_id 
ON public.user_admin_tasks(user_id);

CREATE INDEX IF NOT EXISTS idx_user_admin_tasks_task_id 
ON public.user_admin_tasks(task_id);

CREATE INDEX IF NOT EXISTS idx_user_admin_tasks_status 
ON public.user_admin_tasks(status);

-- Enable RLS
ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_admin_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view active admin tasks
CREATE POLICY "Users can view active admin tasks"
ON public.admin_tasks
FOR SELECT
USING (is_active = true);

-- Policy: Users can view their own admin task assignments
CREATE POLICY "Users can view their own admin task assignments"
ON public.user_admin_tasks
FOR SELECT
USING (auth.uid() = user_id);

-- Note: Admin operations (INSERT, UPDATE, DELETE) will be handled via service role
-- or through API routes with admin authentication


