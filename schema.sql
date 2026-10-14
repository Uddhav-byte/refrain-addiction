CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  signal_vector_json TEXT NOT NULL,
  insights_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS urges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  intensity INTEGER NOT NULL,
  triggers_json TEXT NOT NULL,
  emotions_json TEXT NOT NULL,
  coping_strategy_used TEXT,
  duration_minutes INTEGER DEFAULT 0,
  notes TEXT,
  resisted INTEGER DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS moods (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mood_score INTEGER NOT NULL,
  craving_score INTEGER NOT NULL,
  energy_level INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_rooms (
  room_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  room_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at TEXT NOT NULL
);

-- Seed default chat rooms
INSERT OR IGNORE INTO chat_rooms (room_id, name, description, room_type) VALUES
('general', 'General Recovery', 'A safe, supportive place for general recovery conversations and daily reflections.', 'general'),
('urge-surfing', 'Urge Surfing Station', 'Emergency check-ins and live support when cravings or urges strike.', 'emergency'),
('mindfulness', 'Mindfulness & Meditation', 'Share breathing exercises, meditation practices, and calm moments.', 'support'),
('milestones', 'Celebrations & Milestones', 'Share your streak victories and inspire others in the community.', 'general');
