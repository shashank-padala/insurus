-- Create Storage Bucket for Task Evidence (Photos and Receipts)
-- This bucket is used by the upload API route

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task-evidence',
  'task-evidence',
  true, -- Public bucket (evidence is viewable by authenticated users)
  10485760, -- 10MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'] -- Allowed file types
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for task-evidence bucket

-- Allow authenticated users to upload evidence
CREATE POLICY "Allow authenticated users to upload task evidence"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task-evidence' 
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to view their own evidence
CREATE POLICY "Allow users to view their own task evidence"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'task-evidence'
  AND (
    -- Users can view evidence if they own the file
    owner = auth.uid()
    OR
    -- Users can view evidence if they own a task that references this file
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE (
        tasks.photo_url LIKE '%' || (storage.objects.name) || '%'
        OR tasks.receipt_url LIKE '%' || (storage.objects.name) || '%'
      )
      AND EXISTS (
        SELECT 1 FROM public.task_checklists
        JOIN public.properties ON task_checklists.property_id = properties.id
        WHERE task_checklists.id = tasks.checklist_id
        AND properties.user_id = auth.uid()
      )
    )
  )
);

-- Allow users to update their own evidence
CREATE POLICY "Allow users to update their own task evidence"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'task-evidence'
  AND owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'task-evidence'
  AND owner = auth.uid()
);

-- Allow users to delete their own evidence
CREATE POLICY "Allow users to delete their own task evidence"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'task-evidence'
  AND owner = auth.uid()
);


