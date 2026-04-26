-- Fraternity Job Board Database Schema
-- Run this in Supabase SQL Editor

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  role TEXT, -- 'member', 'employer', 'mentor', 'admin'
  headline TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  resume_url TEXT,
  current_stage TEXT, -- 'freshman', 'sophomore', 'junior', 'senior', 'alumni'
  graduation_date DATE,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  company_name TEXT, -- for employers
  industry TEXT, -- for employers
  company_size TEXT, -- for employers
  website TEXT, -- for employers
  logo_url TEXT, -- for employers
  location TEXT, -- for employers
  allow_employer_contact BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE member_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT, -- 'technical', 'soft_skills', 'industry', 'language', 'certification'
  proficiency_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'expert'
  endorsement_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Preferences
CREATE TABLE member_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  remote_preference TEXT, -- 'fully_remote', 'hybrid', 'on_site'
  preferred_locations TEXT[], -- array
  willing_to_relocate BOOLEAN,
  job_types_interested TEXT[], -- 'internship', 'full_time', 'part_time', 'freelance', 'gig', 'volunteer'
  industries_interested TEXT[],
  company_preferences TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  job_type TEXT, -- 'internship', 'full_time', 'part_time', 'freelance', 'gig', 'volunteer'
  industry TEXT,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  required_skills TEXT[],
  preferred_skills TEXT[],
  experience_level TEXT, -- 'entry', 'mid', 'senior'
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  deadline DATE,
  status TEXT DEFAULT 'open', -- 'open', 'filled', 'closed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Requirements (detailed skill requirements)
CREATE TABLE job_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  required BOOLEAN DEFAULT true,
  proficiency_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'expert'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  match_score INTEGER,
  skills_score INTEGER,
  interests_score INTEGER,
  location_score INTEGER,
  salary_score INTEGER,
  availability_score INTEGER,
  match_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'potential' -- 'potential', 'shown', 'applied', 'rejected'
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  profile_id UUID REFERENCES profiles(id),
  employer_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'applied', -- 'applied', 'interviewed', 'offer_extended', 'hired', 'rejected'
  application_type TEXT, -- 'direct_apply', 'employer_request', 'system_match'
  cover_note TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Records
CREATE TABLE interview_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  interview_date TIMESTAMPTZ,
  interview_type TEXT, -- 'phone', 'video', 'in_person'
  notes TEXT,
  interviewer_name TEXT,
  rating INTEGER, -- 1-5
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offer Records
CREATE TABLE offer_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  salary_offered INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  position_title TEXT,
  start_date DATE,
  offer_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hiring Record
CREATE TABLE hiring_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offer_records(id) ON DELETE CASCADE,
  start_date DATE,
  end_date, -- if known
  feedback_score INTEGER, -- 1-5
  feedback_text TEXT,
  member_rating INTEGER, -- 1-5
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id),
  to_user_id UUID REFERENCES profiles(id),
  subject TEXT,
  body TEXT,
  context_type TEXT, -- 'job_application', 'mentorship', 'inquiry'
  context_id UUID, -- references job or application
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  channel TEXT DEFAULT 'in_app' -- 'in_app', 'email'
);

-- Mentorships
CREATE TABLE mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES profiles(id),
  mentee_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
  focus_areas TEXT[], -- array: 'career_planning', 'skill_development', 'interview_prep', etc
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Development Records
CREATE TABLE skill_development_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES member_skills(id) ON DELETE CASCADE,
  proficiency_previous TEXT,
  proficiency_current TEXT,
  improved_date TIMESTAMPTZ DEFAULT NOW(),
  evidence TEXT, -- learning path completed, project, endorsement
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career Journey
CREATE TABLE career_journey (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  milestone TEXT, -- 'profile_completed', 'first_match', 'first_application', etc
  milestone_date TIMESTAMPTZ DEFAULT NOW(),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT, -- 'profile_view', 'job_search', 'application', 'message', etc
  entity_type TEXT, -- 'job', 'profile', etc
  entity_id UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Metrics
CREATE TABLE platform_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT,
  metric_value NUMERIC,
  metric_date DATE,
  breakdown JSONB, -- by role, by skill, by employer, etc
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recommendations
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity_type TEXT, -- 'job', 'mentor', 'system'
  from_entity_id UUID,
  to_user_id UUID REFERENCES profiles(id),
  recommendation_type TEXT, -- 'job', 'skill_development', 'mentor'
  entity_id UUID, -- FK to job, skill path, or mentor
  created_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,
  acted_on BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_current_stage ON profiles(current_stage);
CREATE INDEX idx_member_skills_profile_id ON member_skills(profile_id);
CREATE INDEX idx_member_skills_skill_name ON member_skills(skill_name);
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_industry ON jobs(industry);
CREATE INDEX idx_matches_job_id ON matches(job_id);
CREATE INDEX idx_matches_profile_id ON matches(profile_id);
CREATE INDEX idx_matches_score ON matches(match_score);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_profile_id ON applications(profile_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_messages_from_user ON messages(from_user_id);
CREATE INDEX idx_messages_to_user ON messages(to_user_id);
CREATE INDEX idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX idx_mentorships_mentee_id ON mentorships(mentee_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (you'll expand these later)
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (triggered by signup)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can view all jobs (public)
CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (true);

-- Only employers can update their own jobs
CREATE POLICY "Employers can update own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = employer_id);

-- Only employers can insert jobs
CREATE POLICY "Employers can insert jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = employer_id);

-- Users can view matches involving them
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (auth.uid() = profile_id);

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = profile_id);

-- Users can view messages sent to them or by them
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Users can insert messages they send
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Users can view their own skills
CREATE POLICY "Users can view own skills" ON member_skills
  FOR SELECT USING (auth.uid() = profile_id);

-- Users can manage their own skills
CREATE POLICY "Users can manage own skills" ON member_skills
  FOR ALL USING (auth.uid() = profile_id);

-- Users can view own preferences
CREATE POLICY "Users can view own preferences" ON member_preferences
  FOR SELECT USING (auth.uid() = profile_id);

-- Users can manage own preferences
CREATE POLICY "Users can manage own preferences" ON member_preferences
  FOR ALL USING (auth.uid() = profile_id);
