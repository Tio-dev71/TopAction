-- Add canva_embed_url column to posts table
-- When this field is set, the post renders as a full-screen Canva presentation (landing page mode)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canva_embed_url TEXT DEFAULT NULL;
