-- ============================================================
-- TopAction — Tournament Extras Migration
-- Adds donation_goal, donation_description, facebook_page fields,
-- and registration_fee_description to tournaments table
-- ============================================================

ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS donation_goal BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS donation_description TEXT,
  ADD COLUMN IF NOT EXISTS facebook_page_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_page_name TEXT,
  ADD COLUMN IF NOT EXISTS registration_fee_description TEXT;
