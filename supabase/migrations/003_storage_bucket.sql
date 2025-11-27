-- Create Storage Bucket for Task Photos
-- Run this script in your Supabase SQL Editor

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task_photos',
  'task_photos',
  true, -- Public bucket (photos are viewable by authenticated users)
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'] -- Allowed file types
)
ON CONFLICT (id) DO NOTHING;

-- Create the storage bucket for receipts if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task_receipts',
  'task_receipts',
  true,
  10485760, -- 10MB file size limit for receipts/documents
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for task_photos bucket

-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload task photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task_photos' 
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to view their own photos
CREATE POLICY "Allow users to view their own task photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'task_photos'
  AND (
    -- Users can view photos if they own the file
    owner = auth.uid()
    OR
    -- Users can view photos if they own a task that references this photo
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.photo_url = (storage.objects.name)
      AND EXISTS (
        SELECT 1 FROM public.task_checklists
        JOIN public.properties ON task_checklists.property_id = properties.id
        WHERE task_checklists.id = tasks.checklist_id
        AND properties.user_id = auth.uid()
      )
    )
  )
);

-- Allow users to update their own photos
CREATE POLICY "Allow users to update their own task photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'task_photos'
  AND owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'task_photos'
  AND owner = auth.uid()
);

-- Allow users to delete their own photos
CREATE POLICY "Allow users to delete their own task photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'task_photos'
  AND owner = auth.uid()
);

-- RLS Policies for task_receipts bucket

-- Allow authenticated users to upload receipts
CREATE POLICY "Allow authenticated users to upload task receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'task_receipts' 
  AND auth.uid() IS NOT NULL
);

-- Allow authenticated users to view their own receipts
CREATE POLICY "Allow users to view their own task receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'task_receipts'
  AND (
    owner = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.receipt_url = (storage.objects.name)
      AND EXISTS (
        SELECT 1 FROM public.task_checklists
        JOIN public.properties ON task_checklists.property_id = properties.id
        WHERE task_checklists.id = tasks.checklist_id
        AND properties.user_id = auth.uid()
      )
    )
  )
);

-- Allow users to update their own receipts
CREATE POLICY "Allow users to update their own task receipts"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'task_receipts'
  AND owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'task_receipts'
  AND owner = auth.uid()
);

-- Allow users to delete their own receipts
CREATE POLICY "Allow users to delete their own task receipts"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'task_receipts'
  AND owner = auth.uid()
);

