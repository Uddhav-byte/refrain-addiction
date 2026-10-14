# Supabase Setup for Refrain

This directory contains the database schema and seed data for setting up **Refrain** on Supabase.

## Quick Setup (Supabase Dashboard)

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the left sidebar of your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy its contents, paste them into the SQL Editor, and click **Run**.
4. Navigate to **Project Settings** -> **API**.
5. Copy your:
   - **Project URL**
   - **anon / public key**
6. In `frontend/.env` (or project root `.env`), set:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
7. That's it! Refrain will automatically connect to Supabase with full authentication, data persistence, and real-time chat subscriptions.

## Features Included in Schema
- **Profiles (`public.profiles`)**: Tracks user recovery metrics, streaks, and timestamps. Automatically linked to Supabase Auth via trigger.
- **Assessments (`public.assessments`)**: Stores behavioral assessment results, dopamine sensitivity vectors, and personalized recovery roadmaps.
- **Urges (`public.urges`)**: Tracks craving triggers, intensity (1-10), coping mechanisms, notes, and resistance outcomes.
- **Moods (`public.moods`)**: Daily emotional and craving check-in logs.
- **Chat Rooms & Realtime Messages (`public.chat_rooms`, `public.chat_messages`)**: Live community support with Supabase Realtime broadcast and history.
- **Row Level Security (RLS)**: Enforces zero-trust isolation so users only access their own private medical/behavioral logs while sharing supportive community chat.
