-- Update organizers type constraint to include 'press'
ALTER TABLE organizers DROP CONSTRAINT IF EXISTS organizers_type_check;
ALTER TABLE organizers ADD CONSTRAINT organizers_type_check CHECK (type IN ('organizer', 'partner', 'sponsor', 'press'));
