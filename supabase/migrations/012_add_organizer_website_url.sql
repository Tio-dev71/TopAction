-- Add website_url column to organizers table
ALTER TABLE organizers ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT NULL;
