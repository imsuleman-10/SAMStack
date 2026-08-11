-- =========================================================
-- FIX: intern_profiles table — add missing columns
-- Run this in your Supabase SQL Editor
-- =========================================================

-- 1. Add enrolled_at column if it doesn't exist
ALTER TABLE intern_profiles
  ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Add email column if it doesn't exist
ALTER TABLE intern_profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 3. Backfill enrolled_at from created_at for existing rows that have a track
UPDATE intern_profiles
SET enrolled_at = created_at
WHERE enrolled_at IS NULL AND track_selected IS NOT NULL;

-- 4. Verify columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'intern_profiles'
ORDER BY ordinal_position;
