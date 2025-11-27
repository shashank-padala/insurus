-- Add INSERT policy for tasks table
-- This allows tasks to be created for checklists that belong to the user's properties
CREATE POLICY "Users can insert tasks for own checklists" ON public.tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.task_checklists
      JOIN public.properties ON properties.id = task_checklists.property_id
      WHERE task_checklists.id = tasks.checklist_id
      AND properties.user_id = auth.uid()
    )
  );

