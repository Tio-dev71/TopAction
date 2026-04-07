-- ==============================================================================
-- 003. Strava Leaderboard Trigger
-- ==============================================================================

-- Function to update tournament_results when a valid activity is added
CREATE OR REPLACE FUNCTION update_tournament_result_on_activity()
RETURNS TRIGGER AS $$
DECLARE
    reg RECORD;
BEGIN
    -- Only evaluate if it's a valid INSERT
    IF TG_OP = 'INSERT' AND NEW.is_valid = true THEN
        -- Find all tournaments the user is registered in that overlap this activity
        FOR reg IN 
            SELECT r.tournament_id, r.category_id, t.start_date, t.end_date, t.valid_activity_types, t.min_pace, t.max_pace
            FROM registrations r
            JOIN tournaments t ON t.id = r.tournament_id
            WHERE r.user_id = NEW.user_id
              AND (t.start_date IS NULL OR NEW.start_date >= t.start_date)
              AND (t.end_date IS NULL OR NEW.start_date <= t.end_date)
        LOOP
            -- Check if activity type is allowed
            IF NEW.activity_type = ANY(reg.valid_activity_types) THEN
                -- Check pace (seconds per km). Pace = moving_time (s) / (distance (m) / 1000)
                -- Avoid div by 0
                IF NEW.distance > 0 THEN
                    DECLARE
                        pace_s numeric := NEW.moving_time / (NEW.distance / 1000);
                    BEGIN
                        -- If pace falls in allowed range (min_pace to max_pace)
                        -- Note: lower number = faster (e.g. 240 = 4:00/km)
                        IF pace_s >= COALESCE(reg.min_pace, 0) AND pace_s <= COALESCE(reg.max_pace, 9999) THEN
                            -- Upsert tournament_results
                            INSERT INTO tournament_results (tournament_id, category_id, user_id, total_distance, total_moving_time, activity_count, last_activity_at)
                            VALUES (reg.tournament_id, reg.category_id, NEW.user_id, NEW.distance, NEW.moving_time, 1, NEW.start_date)
                            ON CONFLICT (tournament_id, user_id, category_id) 
                            DO UPDATE SET 
                                total_distance = tournament_results.total_distance + NEW.distance,
                                total_moving_time = tournament_results.total_moving_time + NEW.moving_time,
                                activity_count = tournament_results.activity_count + 1,
                                last_activity_at = GREATEST(tournament_results.last_activity_at, NEW.start_date),
                                updated_at = now();
                        END IF;
                    END;
                END IF;
            END IF;
        END LOOP;
    END IF;

    -- Note: for DELETE/UPDATE, we might need to decrement. 
    -- For simplicity, a delete trigger could clear results and re-summarize, 
    -- but usually runs are append-only.
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on activities
DROP TRIGGER IF EXISTS trigger_activity_tournament_sync ON activities;
CREATE TRIGGER trigger_activity_tournament_sync
AFTER INSERT ON activities
FOR EACH ROW
EXECUTE FUNCTION update_tournament_result_on_activity();
