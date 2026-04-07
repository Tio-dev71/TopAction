-- ==============================================================================
-- 002. Strava Tracking Integration
-- ==============================================================================

-- 1. Add tracking rules to tournaments table
ALTER TABLE tournaments 
  ADD COLUMN valid_activity_types text[] DEFAULT '{"Run"}',
  ADD COLUMN min_pace integer DEFAULT 240,  -- minimum seconds per km (e.g. 4:00/km)
  ADD COLUMN max_pace integer DEFAULT 900;  -- maximum seconds per km (e.g. 15:00/km)

-- ==============================================================================
-- Table: user_connections
-- ==============================================================================
CREATE TABLE user_connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL, -- 'strava', 'garmin'
  provider_athlete_id text NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, provider),
  UNIQUE(provider, provider_athlete_id)
);

CREATE INDEX idx_user_connections_user_id ON user_connections(user_id);

-- ==============================================================================
-- Table: activities
-- ==============================================================================
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL, -- 'strava'
  external_id text NOT NULL, -- strava activity id
  name text NOT NULL,
  activity_type text NOT NULL, -- 'Run', 'Ride', 'Walk', etc.
  distance numeric(10,2) NOT NULL DEFAULT 0, -- in meters
  moving_time integer NOT NULL DEFAULT 0, -- in seconds
  elapsed_time integer NOT NULL DEFAULT 0,
  start_date timestamp with time zone NOT NULL,
  average_speed numeric(6,2), -- meters per second
  average_heartrate numeric(5,1),
  polyline text,
  is_valid boolean DEFAULT true,
  invalid_reason text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(provider, external_id)
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_date ON activities(start_date);

-- ==============================================================================
-- Table: tournament_results
-- ==============================================================================
-- Cache table to quickly display leaderboards
CREATE TABLE tournament_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES tournament_categories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_distance numeric(12,2) DEFAULT 0, -- in meters
  total_moving_time integer DEFAULT 0, -- in seconds
  activity_count integer DEFAULT 0,
  last_activity_at timestamp with time zone,
  rank integer,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(tournament_id, user_id, category_id)
);

CREATE INDEX idx_tournament_results_board ON tournament_results(tournament_id, category_id, total_distance DESC);

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================

-- user_connections
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON user_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own connections" ON user_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all connections" ON user_connections FOR SELECT USING (is_staff(auth.uid()));

-- activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Users can manage own activities" ON activities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all activities" ON activities FOR ALL USING (is_staff(auth.uid()));

-- tournament_results
ALTER TABLE tournament_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view results" ON tournament_results FOR SELECT USING (true);
CREATE POLICY "System can manage results" ON tournament_results FOR ALL USING (auth.uid() = user_id OR is_staff(auth.uid())); -- Note: Service role bypasses RLS
