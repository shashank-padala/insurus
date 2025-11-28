-- Add RLS policies for verifications table
-- Allow users to insert verifications for their own tasks

-- Policy to allow users to insert verifications for their own tasks
CREATE POLICY "Users can insert verifications for own tasks" ON public.verifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.task_checklists ON task_checklists.id = tasks.checklist_id
      JOIN public.properties ON properties.id = task_checklists.property_id
      WHERE tasks.id = verifications.task_id
      AND properties.user_id = auth.uid()
    )
  );

-- Policy to allow users to view their own verifications
CREATE POLICY "Users can view own verifications" ON public.verifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.task_checklists ON task_checklists.id = tasks.checklist_id
      JOIN public.properties ON properties.id = task_checklists.property_id
      WHERE tasks.id = verifications.task_id
      AND properties.user_id = auth.uid()
    )
  );

-- Policy to allow users to update their own verifications
CREATE POLICY "Users can update own verifications" ON public.verifications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.task_checklists ON task_checklists.id = tasks.checklist_id
      JOIN public.properties ON properties.id = task_checklists.property_id
      WHERE tasks.id = verifications.task_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.task_checklists ON task_checklists.id = tasks.checklist_id
      JOIN public.properties ON properties.id = task_checklists.property_id
      WHERE tasks.id = verifications.task_id
      AND properties.user_id = auth.uid()
    )
  );


