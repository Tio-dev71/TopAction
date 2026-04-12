-- Add display_title to tournaments table
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS display_title TEXT;
