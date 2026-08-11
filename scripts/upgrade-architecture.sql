-- 1. Add Gender and Assigned Tracks to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT; -- 'MALE' | 'FEMALE' | 'OTHER'
ALTER TABLE users ADD COLUMN IF NOT EXISTS assigned_tracks TEXT[] DEFAULT '{}'; -- e.g. ['PYTHON', 'MERN']

-- 2. Create Track Tasks Table
CREATE TABLE IF NOT EXISTS track_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id TEXT NOT NULL, -- e.g. 'PYTHON', 'REACT'
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    scope TEXT NOT NULL,
    criteria TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: RLS policies can be enabled later. For now, assuming server-side API access via Service Role.
