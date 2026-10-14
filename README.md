# Refrain — Adaptive Addiction Recovery & Habit Transformation Platform

Refrain is a production-grade, full-stack application designed to aid in addiction recovery and habit transformation. It utilizes behavioral assessments, progress tracking, and a supportive real-time community to help users build healthier habits and sustain lasting freedom.

---

## 🌟 Key Features

- **Supabase PostgreSQL Database & Auth:**
  - Production schema in `supabase/schema.sql` with Row Level Security (RLS) guaranteeing user privacy.
  - Automatic profile initialization upon signup with streak and milestone tracking.
  - Real-time peer messaging powered by Supabase Realtime Channels.
  - Zero-config Local Fallback Mode & 1-Click Demo Account for instant evaluation.

- **Dynamic Behavioral Assessment Engine:**
  - Multi-step onboarding and check-in quiz measuring triggers, severity, and emotional regulation.
  - Behavioral Signal Vector radar chart (Dopamine Sensitivity, Stress Rating, Trigger Frequency, Relapse Risk).
  - Generates personalized daily insights and actionable recovery recommendations.

- **Urge Surfing Station (Emergency SOS):**
  - Clinically grounded 4-7-8 breathing pacer with expanding/contracting visual rings.
  - Mindful recovery mantras to ride out peak cravings without giving in.
  - "I Surfed the Urge!" celebration with confetti and instant craving logger.

- **Daily Recovery & Mood Check-In:**
  - Daily mood, craving spike, and vitality tracking with intuitive emoji-graded sliders.
  - Tags for emotions (Grateful, Calm, Hopeful, Anxious, Restless, Overwhelmed).
  - Feeds into interactive Recharts area graphs and trigger heatmaps.

- **Real-Time Peer Support System:**
  - 4 specialized rooms: *General Recovery*, *Urge Surfing Station*, *Mindfulness & Meditation*, and *Celebrations & Milestones*.
  - Real-time message streaming with quick encouragement chips (💪, ❤️, 🌱, 🌊, 🙏).
  - Fully responsive with mobile room switching tabs.

- **Milestones & Streak Tracker:**
  - 9 unlockable recovery badges: *First Step* (1d), *Getting Started* (3d), *One Week Strong* (7d), *Two Weeks Clear* (14d), *Monthly Warrior* (30d), *Momentum Master* (60d), *Quarter Champion* (90d), *Half Year Hero* (180d), *One Year Legend* (365d).
  - Clean days ring counter with next milestone progress tracking.

- **Data Privacy & Portability:**
  - 1-click full JSON export of all personal urge logs, mood histories, and behavioral assessments.
  - Compassionate clean streak reset with relapse re-framing support.

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** with TypeScript & Vite
- **Supabase Client (`@supabase/supabase-js`)** for Auth, PostgreSQL CRUD, and Realtime
- **Tailwind CSS & Shadcn UI** for modern styling
- **Framer Motion** for smooth transitions and breathing animations
- **Recharts** for trend graphs and radar vectors
- **Canvas Confetti & React Hot Toast** for micro-interactions and celebration

### Backend & Cloud
- **Supabase** (PostgreSQL, Row Level Security, Auth, Realtime)
- **FastAPI / Python 3.11+** (Async REST API with aligned endpoints)
- **Cloudflare Pages / Workers** ready (`frontend/functions`)

---

## 🚀 Getting Started

### 1. Connect Supabase (Recommended)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. In `frontend/.env`, set:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
5. Run the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
> **Note:** If you haven't created a Supabase project yet, Refrain automatically boots in **Local Mode** with a 1-Click Demo Account so you can test all features immediately!

### 2. Running Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Running with Docker Compose
```bash
docker-compose up --build
```

---

## 🔒 Security & Privacy
- **Row Level Security (RLS):** Every user's medical and habit logs are strictly sandboxed; only the owner can read or write their logs.
- **Client Encryption:** Safe authentication tokens stored in encrypted browser storage with automatic session renewal.
- **Data Export:** Complete user data ownership with 1-click JSON download in Profile.

## 📄 License
MIT License
