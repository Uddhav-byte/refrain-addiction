-- ==============================================================================
-- Refrain — Supabase PostgreSQL Database Schema
-- Production-grade schema with Row Level Security (RLS), Triggers & Realtime
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users or standalone UUIDs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT DEFAULT 'On my recovery journey with Refrain.',
  streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_relapse_date TIMESTAMPTZ DEFAULT NOW(),
  last_checkin_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ------------------------------------------------------------------------------
-- 2. ASSESSMENTS (Behavioral signal vectors & AI/engine insights)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  signal_vector JSONB NOT NULL DEFAULT '{
    "dopamine_sensitivity": 50,
    "stress_rating": 50,
    "trigger_frequency": 50,
    "relapse_risk_index": 50
  }'::jsonb,
  insights JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_created ON public.assessments(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. URGES (Craving intensity logs & urge surfing outcomes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.urges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
  triggers JSONB NOT NULL DEFAULT '[]'::jsonb,
  emotions JSONB NOT NULL DEFAULT '[]'::jsonb,
  coping_strategy_used TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 5,
  notes TEXT,
  resisted BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_urges_user_created ON public.urges(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. MOODS (Daily mood score, craving score, and energy tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  craving_score INTEGER NOT NULL CHECK (craving_score >= 1 AND craving_score <= 10),
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moods_user_created ON public.moods(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 5. CHAT ROOMS & REAL-TIME MESSAGING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  room_type TEXT NOT NULL DEFAULT 'general',
  icon TEXT DEFAULT '💬',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id TEXT NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON public.chat_messages(room_id, created_at ASC);

-- ------------------------------------------------------------------------------
-- 6. USER MILESTONES (Badges achieved)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_milestones_user ON public.user_milestones(user_id);

-- ------------------------------------------------------------------------------
-- 7. SEED DATA (Default Chat Rooms)
-- ------------------------------------------------------------------------------
INSERT INTO public.chat_rooms (id, name, description, room_type, icon)
VALUES 
  ('general', 'General Recovery', 'A safe, supportive place for general recovery conversations and daily reflections.', 'general', '🌱'),
  ('urge-surfing', 'Urge Surfing Station', 'Emergency check-ins and live support when cravings or urges strike.', 'emergency', '🌊'),
  ('mindfulness', 'Mindfulness & Meditation', 'Share breathing exercises, meditation practices, and calm moments.', 'support', '🧘'),
  ('milestones', 'Celebrations & Milestones', 'Share your streak victories and inspire others in the community.', 'celebration', '🏆')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  room_type = EXCLUDED.room_type,
  icon = EXCLUDED.icon;

-- ------------------------------------------------------------------------------
-- 8. TRIGGERS & AUTOMATION
-- ------------------------------------------------------------------------------

-- Function to handle new user sign-up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    username,
    full_name,
    avatar_url,
    streak_days,
    longest_streak,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    1,
    1,
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  -- Award initial First Step milestone
  INSERT INTO public.user_milestones (user_id, badge_id, earned_at)
  VALUES (NEW.id, 'first_step', NOW())
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.urges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Assessments policies
CREATE POLICY "Users can read own assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Urges policies
CREATE POLICY "Users can read own urges"
  ON public.urges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own urges"
  ON public.urges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Moods policies
CREATE POLICY "Users can read own moods"
  ON public.moods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own moods"
  ON public.moods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Chat rooms policies
CREATE POLICY "Anyone authenticated can view chat rooms"
  ON public.chat_rooms FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Chat messages policies
CREATE POLICY "Anyone authenticated can read chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert messages into chat"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Milestones policies
CREATE POLICY "Users can read own milestones"
  ON public.user_milestones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON public.user_milestones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 10. REALTIME CONFIGURATION
-- ------------------------------------------------------------------------------
-- Enable replication for Supabase Realtime on chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
