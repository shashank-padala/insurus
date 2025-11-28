-- Migration: Update blockchain_transactions table to support property registrations
-- Make task_id nullable and add event_type column

-- Make task_id nullable (property registrations won't have task_id)
ALTER TABLE public.blockchain_transactions
ALTER COLUMN task_id DROP NOT NULL;

-- Add event_type column to distinguish between property registrations and task completions
ALTER TABLE public.blockchain_transactions
ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'task_completion' 
CHECK (event_type IN ('property_registration', 'task_completion'));

-- Update existing records to have event_type
UPDATE public.blockchain_transactions
SET event_type = 'task_completion'
WHERE event_type IS NULL OR event_type = '';

-- Add index on event_type for better query performance
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_event_type 
ON public.blockchain_transactions(event_type);

-- Add index on property_id for better query performance
CREATE INDEX IF NOT EXISTS idx_blockchain_transactions_property_id 
ON public.blockchain_transactions(property_id);

