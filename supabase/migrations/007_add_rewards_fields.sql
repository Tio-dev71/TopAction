-- Add rewards_title and rewards_description to tournaments table
ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS rewards_title TEXT,
  ADD COLUMN IF NOT EXISTS rewards_description TEXT;
