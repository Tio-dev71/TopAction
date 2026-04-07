-- ============================================================
-- TopAction Platform — Complete Production Schema Migration
-- Run this in Supabase SQL Editor as a single transaction
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  avatar_url TEXT,
  city TEXT,
  club_name TEXT,
  emergency_contact TEXT,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================================
-- 2. ROLES & USER_ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);

-- Seed default roles
INSERT INTO roles (code, name, description) VALUES
  ('super_admin', 'Super Admin', 'Toàn quyền hệ thống'),
  ('admin', 'Admin', 'Quản lý giải đấu, bài viết, đăng ký, ủng hộ'),
  ('editor', 'Editor', 'Tạo/sửa nội dung giải đấu, không duyệt thanh toán'),
  ('finance', 'Finance', 'Xem và xử lý giao dịch, đối soát'),
  ('support', 'Support', 'Hỗ trợ người dùng'),
  ('user', 'User', 'Người dùng thông thường')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 3. TOURNAMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  cover_image TEXT,
  banner_image TEXT,
  category TEXT,
  start_date DATE,
  end_date DATE,
  registration_open_at TIMESTAMPTZ,
  registration_close_at TIMESTAMPTZ,
  location TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  max_participants INTEGER,
  participant_count INTEGER NOT NULL DEFAULT 0,
  donation_total BIGINT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournaments_slug ON tournaments(slug);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_featured ON tournaments(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_tournaments_created_by ON tournaments(created_by);

-- ============================================================
-- 4. TOURNAMENT_CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS tournament_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  distance TEXT,
  price BIGINT NOT NULL DEFAULT 0,
  capacity INTEGER,
  registered_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournament_categories_tournament ON tournament_categories(tournament_id);

-- ============================================================
-- 5. TOURNAMENT_RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS tournament_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  rule_type TEXT,
  title TEXT,
  content TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournament_rules_tournament ON tournament_rules(tournament_id);

-- ============================================================
-- 6. TOURNAMENT_SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS tournament_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  section_key TEXT,
  title TEXT,
  content TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tournament_sections_tournament ON tournament_sections(tournament_id);

-- ============================================================
-- 7. ORGANIZERS
-- ============================================================
CREATE TABLE IF NOT EXISTS organizers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'organizer' CHECK (type IN ('organizer', 'partner', 'sponsor')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizers_tournament ON organizers(tournament_id);

-- ============================================================
-- 8. REGISTRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES tournament_categories(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  gender TEXT,
  birth_date DATE,
  city TEXT,
  club_name TEXT,
  team_name TEXT,
  emergency_contact TEXT,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'registered', 'confirmed', 'cancelled', 'rejected')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  payment_required BOOLEAN NOT NULL DEFAULT FALSE,
  amount_due BIGINT NOT NULL DEFAULT 0,
  amount_paid BIGINT NOT NULL DEFAULT 0,
  registration_code TEXT NOT NULL UNIQUE DEFAULT UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 10)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_category ON registrations(category_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_code ON registrations(registration_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_user_tournament_category 
  ON registrations(user_id, tournament_id, category_id) 
  WHERE status NOT IN ('cancelled', 'rejected');

-- ============================================================
-- 9. REGISTRATION_STATUS_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS registration_status_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reg_status_logs_registration ON registration_status_logs(registration_id);

-- ============================================================
-- 10. DONATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  amount BIGINT NOT NULL CHECK (amount > 0),
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending',
  donation_code TEXT NOT NULL UNIQUE DEFAULT UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 10)),
  provider TEXT,
  provider_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_tournament ON donations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_code ON donations(donation_code);

-- ============================================================
-- 11. PAYMENT_TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('registration', 'donation')),
  registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL,
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  provider_order_id TEXT,
  provider_transaction_id TEXT,
  amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'VND',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'success', 'failed', 'cancelled', 'refunded')),
  raw_request JSONB,
  raw_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_tx_registration ON payment_transactions(registration_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_donation ON payment_transactions(donation_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_provider_order ON payment_transactions(provider, provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_status ON payment_transactions(status);

-- ============================================================
-- 12. WEBHOOK_EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  event_type TEXT,
  external_event_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, external_event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON webhook_events(provider, external_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed) WHERE processed = FALSE;

-- ============================================================
-- 13. POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_tournament ON posts(tournament_id);

-- ============================================================
-- 14. AUDIT_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_role TEXT,
  action TEXT NOT NULL,
  target_table TEXT,
  target_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_table, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- 15. MEDIA_ASSETS
-- ============================================================
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  alt_text TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON media_assets(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_assets_active ON media_assets(is_deleted) WHERE is_deleted = FALSE;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'profiles', 'tournaments', 'registrations', 'donations',
    'payment_transactions', 'posts'
  ]) LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trigger_update_%I_updated_at ON %I; 
       CREATE TRIGGER trigger_update_%I_updated_at 
       BEFORE UPDATE ON %I 
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END;
$$;

-- Function to update tournament participant_count
CREATE OR REPLACE FUNCTION update_tournament_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE tournaments SET participant_count = (
      SELECT COUNT(*) FROM registrations
      WHERE tournament_id = NEW.tournament_id
      AND status IN ('registered', 'confirmed')
    ) WHERE id = NEW.tournament_id;
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.tournament_id != NEW.tournament_id) THEN
    UPDATE tournaments SET participant_count = (
      SELECT COUNT(*) FROM registrations
      WHERE tournament_id = OLD.tournament_id
      AND status IN ('registered', 'confirmed')
    ) WHERE id = OLD.tournament_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_participant_count ON registrations;
CREATE TRIGGER trigger_update_participant_count
AFTER INSERT OR UPDATE OF status, tournament_id OR DELETE ON registrations
FOR EACH ROW EXECUTE FUNCTION update_tournament_participant_count();

-- Function to update tournament donation_total
CREATE OR REPLACE FUNCTION update_tournament_donation_total()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE tournaments SET donation_total = COALESCE((
      SELECT SUM(amount) FROM donations
      WHERE tournament_id = NEW.tournament_id
      AND status = 'paid'
    ), 0) WHERE id = NEW.tournament_id;
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.tournament_id != NEW.tournament_id) THEN
    UPDATE tournaments SET donation_total = COALESCE((
      SELECT SUM(amount) FROM donations
      WHERE tournament_id = OLD.tournament_id
      AND status = 'paid'
    ), 0) WHERE id = OLD.tournament_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_donation_total ON donations;
CREATE TRIGGER trigger_update_donation_total
AFTER INSERT OR UPDATE OF status, amount, tournament_id OR DELETE ON donations
FOR EACH ROW EXECUTE FUNCTION update_tournament_donation_total();

-- Function to update category registered_count
CREATE OR REPLACE FUNCTION update_category_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.category_id IS NOT NULL THEN
    UPDATE tournament_categories SET registered_count = (
      SELECT COUNT(*) FROM registrations
      WHERE category_id = NEW.category_id
      AND status IN ('registered', 'confirmed')
    ) WHERE id = NEW.category_id;
  END IF;
  
  IF TG_OP != 'INSERT' AND OLD.category_id IS NOT NULL AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    UPDATE tournament_categories SET registered_count = (
      SELECT COUNT(*) FROM registrations
      WHERE category_id = OLD.category_id
      AND status IN ('registered', 'confirmed')
    ) WHERE id = OLD.category_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_category_count ON registrations;
CREATE TRIGGER trigger_update_category_count
AFTER INSERT OR UPDATE OF status, category_id OR DELETE ON registrations
FOR EACH ROW EXECUTE FUNCTION update_category_registered_count();

-- Function to auto-create profile on signup (via auth trigger)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Auto-assign 'user' role
  INSERT INTO user_roles (user_id, role_id)
  SELECT NEW.id, r.id FROM roles r WHERE r.code = 'user'
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper function: check if user has specific role
CREATE OR REPLACE FUNCTION has_role(check_user_id UUID, check_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = check_user_id
    AND r.code = check_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: check if user is admin (admin or super_admin)
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = check_user_id
    AND r.code IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: check if user is staff (any elevated role)
CREATE OR REPLACE FUNCTION is_staff(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = check_user_id
    AND r.code IN ('super_admin', 'admin', 'editor', 'finance', 'support')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES ----
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT
  USING (is_staff(auth.uid()));
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_admin_update" ON profiles FOR UPDATE
  USING (is_admin(auth.uid()));

-- ---- ROLES ----
CREATE POLICY "roles_select_all" ON roles FOR SELECT
  USING (TRUE);
CREATE POLICY "roles_admin_all" ON roles FOR ALL
  USING (has_role(auth.uid(), 'super_admin'));

-- ---- USER_ROLES ----
CREATE POLICY "user_roles_select_own" ON user_roles FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "user_roles_select_admin" ON user_roles FOR SELECT
  USING (is_admin(auth.uid()));
CREATE POLICY "user_roles_admin_manage" ON user_roles FOR ALL
  USING (has_role(auth.uid(), 'super_admin'));

-- ---- TOURNAMENTS ----
CREATE POLICY "tournaments_select_published" ON tournaments FOR SELECT
  USING (status = 'published' OR is_staff(auth.uid()));
CREATE POLICY "tournaments_admin_all" ON tournaments FOR ALL
  USING (is_staff(auth.uid()));

-- ---- TOURNAMENT_CATEGORIES ----
CREATE POLICY "categories_select_public" ON tournament_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tournaments t 
      WHERE t.id = tournament_id 
      AND (t.status = 'published' OR is_staff(auth.uid()))
    )
  );
CREATE POLICY "categories_admin_all" ON tournament_categories FOR ALL
  USING (is_staff(auth.uid()));

-- ---- TOURNAMENT_RULES ----
CREATE POLICY "rules_select_public" ON tournament_rules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tournaments t 
      WHERE t.id = tournament_id 
      AND (t.status = 'published' OR is_staff(auth.uid()))
    )
  );
CREATE POLICY "rules_admin_all" ON tournament_rules FOR ALL
  USING (is_staff(auth.uid()));

-- ---- TOURNAMENT_SECTIONS ----
CREATE POLICY "sections_select_public" ON tournament_sections FOR SELECT
  USING (
    is_visible = TRUE AND EXISTS (
      SELECT 1 FROM tournaments t 
      WHERE t.id = tournament_id 
      AND (t.status = 'published' OR is_staff(auth.uid()))
    )
  );
CREATE POLICY "sections_admin_all" ON tournament_sections FOR ALL
  USING (is_staff(auth.uid()));

-- ---- ORGANIZERS ----
CREATE POLICY "organizers_select_public" ON organizers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tournaments t 
      WHERE t.id = tournament_id 
      AND (t.status = 'published' OR is_staff(auth.uid()))
    )
  );
CREATE POLICY "organizers_admin_all" ON organizers FOR ALL
  USING (is_staff(auth.uid()));

-- ---- REGISTRATIONS ----
CREATE POLICY "registrations_select_own" ON registrations FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "registrations_select_admin" ON registrations FOR SELECT
  USING (is_staff(auth.uid()));
CREATE POLICY "registrations_insert_own" ON registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "registrations_update_admin" ON registrations FOR UPDATE
  USING (is_admin(auth.uid()));
CREATE POLICY "registrations_update_own_draft" ON registrations FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft')
  WITH CHECK (auth.uid() = user_id);

-- ---- REGISTRATION_STATUS_LOGS ----
CREATE POLICY "reg_logs_select_own" ON registration_status_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM registrations r 
      WHERE r.id = registration_id 
      AND r.user_id = auth.uid()
    )
  );
CREATE POLICY "reg_logs_select_admin" ON registration_status_logs FOR SELECT
  USING (is_staff(auth.uid()));
CREATE POLICY "reg_logs_insert_admin" ON registration_status_logs FOR INSERT
  WITH CHECK (is_staff(auth.uid()) OR auth.uid() = changed_by);

-- ---- DONATIONS ----
CREATE POLICY "donations_select_public_paid" ON donations FOR SELECT
  USING (status = 'paid' AND is_anonymous = FALSE);
CREATE POLICY "donations_select_own" ON donations FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "donations_select_admin" ON donations FOR SELECT
  USING (is_staff(auth.uid()));
CREATE POLICY "donations_insert_auth" ON donations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL OR user_id IS NULL);
CREATE POLICY "donations_update_admin" ON donations FOR UPDATE
  USING (is_admin(auth.uid()));

-- ---- PAYMENT_TRANSACTIONS ----
CREATE POLICY "payment_tx_select_own" ON payment_transactions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "payment_tx_select_admin" ON payment_transactions FOR SELECT
  USING (is_staff(auth.uid()));
CREATE POLICY "payment_tx_admin_all" ON payment_transactions FOR ALL
  USING (is_admin(auth.uid()));

-- ---- WEBHOOK_EVENTS ----
CREATE POLICY "webhook_events_admin_all" ON webhook_events FOR ALL
  USING (is_admin(auth.uid()));

-- ---- POSTS ----
CREATE POLICY "posts_select_published" ON posts FOR SELECT
  USING (status = 'published' OR is_staff(auth.uid()));
CREATE POLICY "posts_admin_all" ON posts FOR ALL
  USING (is_staff(auth.uid()));

-- ---- AUDIT_LOGS ----
CREATE POLICY "audit_logs_select_admin" ON audit_logs FOR SELECT
  USING (is_admin(auth.uid()));
CREATE POLICY "audit_logs_insert_staff" ON audit_logs FOR INSERT
  WITH CHECK (is_staff(auth.uid()) OR auth.uid() = actor_user_id);

-- ---- MEDIA_ASSETS ----
CREATE POLICY "media_select_staff" ON media_assets FOR SELECT
  USING (is_staff(auth.uid()) OR uploaded_by = auth.uid());
CREATE POLICY "media_insert_staff" ON media_assets FOR INSERT
  WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "media_update_staff" ON media_assets FOR UPDATE
  USING (is_staff(auth.uid()));

-- ============================================================
-- STORAGE SETUP
-- ============================================================

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  TRUE,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "media_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "media_staff_upload" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media' 
    AND (is_staff(auth.uid()) OR auth.uid() IS NOT NULL)
  );

CREATE POLICY "media_staff_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND is_staff(auth.uid()));

CREATE POLICY "media_staff_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND is_staff(auth.uid()));

-- ============================================================
-- SEED DATA (Development)
-- ============================================================

-- NOTE: To make a user super_admin, run:
-- INSERT INTO user_roles (user_id, role_id)
-- SELECT '<YOUR_USER_UUID>', r.id FROM roles r WHERE r.code = 'super_admin';
