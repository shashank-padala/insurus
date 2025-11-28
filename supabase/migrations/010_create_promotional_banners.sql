-- Migration: Create promotional_banners table for admin-managed promotional banners
-- These banners appear at the top of authenticated pages

CREATE TABLE IF NOT EXISTS public.promotional_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_promotional_banners_is_active 
ON public.promotional_banners(is_active);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_promotional_banners_created_at 
ON public.promotional_banners(created_at DESC);

-- Enable RLS
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active banners (for display on pages)
CREATE POLICY "Anyone can view active promotional banners"
ON public.promotional_banners
FOR SELECT
USING (is_active = true);

-- Note: Admin operations (INSERT, UPDATE, DELETE) will be handled via service role
-- or through API routes with admin authentication


