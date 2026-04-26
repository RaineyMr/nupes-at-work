-- Create test user for authentication testing
-- Run this in Supabase SQL Editor

-- First, check if test user already exists
SELECT id, email FROM profiles WHERE email = 'test@nupesatwork.com';

-- If no user exists, insert test user
INSERT INTO profiles (
  id,
  email,
  password,
  role,
  first_name,
  last_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test@nupesatwork.com',
  'TestPassword123!',
  'member',
  'Test',
  'User',
  NOW(),
  NOW()
);

-- Create sample profile data
INSERT INTO member_skills (
  id,
  profile_id,
  skill_name,
  category,
  proficiency_level,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'test@nupesatwork.com'),
  'React',
  'technical',
  'advanced',
  NOW()
);

-- Create sample preferences
INSERT INTO member_preferences (
  id,
  profile_id,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'test@nupesatwork.com'),
  NOW()
);

-- Create sample job posting
INSERT INTO jobs (
  id,
  employer_id,
  title,
  description,
  job_type,
  industry,
  location,
  salary_min,
  salary_max,
  posted_at,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'test@nupesatwork.com'),
  'Frontend Developer',
  'We are looking for talented frontend developers to join our team.',
  'full_time',
  'Remote',
  'Technology',
  'San Francisco, CA',
  75000,
  120000,
  NOW(),
  NOW()
);
