-- ============================================================
-- 16. SUBSCRIBERS (Newsletter)
-- ============================================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can subscribe
CREATE POLICY "subscribers_insert_public" ON subscribers FOR INSERT
  WITH CHECK (TRUE);

-- Only staff can view subscribers
CREATE POLICY "subscribers_select_staff" ON subscribers FOR SELECT
  USING (is_staff(auth.uid()));

-- Only admin can delete/update
CREATE POLICY "subscribers_admin_all" ON subscribers FOR ALL
  USING (is_admin(auth.uid()));
