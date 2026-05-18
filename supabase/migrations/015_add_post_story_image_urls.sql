-- Add vertical story images for posts (for mobile-style scroll reading)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS story_image_urls JSONB DEFAULT '[]'::jsonb;
