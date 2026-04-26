-- Test queries to verify database setup
-- Run these in Supabase SQL Editor after creating tables

-- Check all tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Test inserting a test user (you'll need to create auth.users first)
-- This will be handled by Supabase Auth automatically

-- Check indexes were created
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'jobs', 'matches', 'applications')
ORDER BY tablename, indexname;

-- Check RLS policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Sample data structure check (don't run these until you have real users)
-- SELECT * FROM profiles LIMIT 1;
-- SELECT * FROM jobs LIMIT 1;
-- SELECT * FROM matches LIMIT 1;
