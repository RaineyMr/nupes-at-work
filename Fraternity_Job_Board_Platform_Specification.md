# Fraternity Job Board & Career Platform - Complete Specification

**Status:** Planning Phase  
**Date:** April 2026  
**Version:** 1.0

---

## 1. EXECUTIVE SUMMARY

A comprehensive job board and career development platform exclusively for fraternity members that intelligently connects candidates with opportunities while tracking career outcomes and professional growth. The platform features automated matching, dual application/outreach flows, mentor relationships, and detailed analytics.

**Key Stats:**
- **3 User Types:** Members, Employers, Mentors/Advisors
- **5 Core Features:** Profiles, Job Matching, Applications, Mentorship, Analytics
- **Scope:** Full-featured from day 1, built for scale

---

## 2. USER ROLES & PERMISSIONS

### 2.1 Members (Fraternity)
**Primary Goal:** Find jobs/internships, develop career skills, get mentorship

**Capabilities:**
- Create comprehensive profile with resume, skills, experience
- Set availability status (implied by member stage: senior, junior, etc.)
- Set location preferences (remote vs. in-office + relocation willingness)
- Set salary expectations
- Search for jobs with advanced filters
- Receive job recommendations (automated + from recommendations engine)
- Apply directly to jobs
- Receive messages from matched employers
- Request/connect with mentors
- Track application history and outcomes
- Access personalized career development tracking
- Export profile data
- View anonymized aggregate career trends
- Have skills endorsed by other members
- Can also serve as mentors/advisors (multi-role)

**Permissions:**
- View own profile only (editable)
- View all open job postings
- Search employer database
- Cannot view other members' full profiles
- Cannot view other members' application history

### 2.2 Employers
**Primary Goal:** Find and hire qualified candidates

**Capabilities:**
- Register account (auto-approved)
- Create company profile
- Post jobs/internships/freelance/gig/volunteer opportunities
- View top 10 matched candidates per job (ranked by match score)
- Send messages directly to matched candidates (if member allows)
- Search member database with advanced filters
- Track application pipeline (view applications, interviews, offers, hires)
- View hiring funnel analytics
- Receive candidate recommendations
- Close job postings

**Permissions:**
- Cannot message members who haven't opted in
- Can only see candidates who allow employer contact
- View only members in candidate pool, not full directory

### 2.3 Mentors/Advisors (Alumni)
**Primary Goal:** Guide members' career development

**Capabilities:**
- View member profiles (for recommended mentees)
- Receive mentor match recommendations
- Send guidance messages to mentees
- Track mentorship relationships and progress
- View aggregated success metrics
- Can also be employers or members (multi-role)

**Permissions:**
- Only see assigned mentees
- View career development data for mentees
- Cannot access member application history

### 2.4 Admins
**Primary Goal:** Manage platform, moderate content, match mentors

**Capabilities:**
- All member/employer/mentor capabilities
- Moderate job postings (flag/remove if needed)
- Recommend mentor-mentee pairings
- View full analytics dashboard
- Manage user accounts
- Access system settings
- View all hiring funnel data (anonymized)

---

## 3. CORE DATA MODEL

### 3.1 User Accounts
```
Users Table:
- user_id (PK)
- email
- password_hash
- first_name
- last_name
- profile_photo_url
- roles (array: member | employer | mentor | admin)
- created_at
- updated_at
- is_active
- privacy_settings (allow_employer_contact: boolean)
```

### 3.2 Member Profiles
```
Member_Profiles Table:
- profile_id (PK)
- user_id (FK)
- bio
- headline
- current_stage (freshman | sophomore | junior | senior | alumni)
- graduation_date
- phone
- linkedin_url
- portfolio_url
- resume_url
- years_experience
- created_at
- updated_at

Member_Skills Table:
- skill_id (PK)
- profile_id (FK)
- skill_name
- category (technical | soft_skills | industry | language | etc)
- proficiency_level (beginner | intermediate | advanced | expert)
- endorsement_count
- last_updated

Member_Preferences Table:
- preference_id (PK)
- profile_id (FK)
- salary_min
- salary_max
- salary_currency
- career_interests (array of job types)
- location_preferences:
  - remote_preference (fully_remote | hybrid | on_site)
  - preferred_locations (array)
  - willing_to_relocate (boolean)
- job_types_interested (internship | full_time | part_time | freelance | gig | volunteer)
- industries_interested (array)
- company_preferences (array)
```

### 3.3 Employer Profiles
```
Employer_Profiles Table:
- employer_id (PK)
- user_id (FK)
- company_name
- industry
- company_size
- website
- description
- logo_url
- location (HQ)
- created_at
- updated_at
- total_hires_from_platform
```

### 3.4 Job Postings
```
Job_Postings Table:
- job_id (PK)
- employer_id (FK)
- title
- description
- job_type (internship | full_time | part_time | freelance | gig | volunteer)
- industry
- location (or remote indicator)
- salary_min
- salary_max
- salary_currency
- required_skills (array)
- preferred_skills (array)
- experience_level (entry | mid | senior)
- posted_date
- deadline
- status (open | filled | closed)
- match_score_threshold (min score to show member)
- created_at
- updated_at

Job_Requirements Table:
- requirement_id (PK)
- job_id (FK)
- skill_name
- required (boolean)
- proficiency_level
```

### 3.5 Matching & Recommendations
```
Matches Table:
- match_id (PK)
- job_id (FK)
- profile_id (FK)
- match_score (0-100)
- match_breakdown:
  - skills_score
  - interests_score
  - location_score
  - salary_score
  - availability_score
- match_reason (string explaining match)
- created_at
- status (potential | shown | applied | rejected)

Recommendations Table:
- recommendation_id (PK)
- from_entity (job_id | mentor_id | system)
- to_user_id (FK)
- recommendation_type (job | skill_development | mentor)
- entity_id (FK to job, skill path, or mentor)
- created_at
- viewed_at
- acted_on (boolean)
```

### 3.6 Applications & Pipeline
```
Applications Table:
- application_id (PK)
- job_id (FK)
- profile_id (FK)
- employer_id (FK)
- application_date
- application_type (direct_apply | employer_request | system_match)
- status (applied | interviewed | offer_extended | hired | rejected)
- cover_note (optional)

Interview_Records Table:
- interview_id (PK)
- application_id (FK)
- interview_date
- interview_type (phone | video | in_person)
- notes
- interviewer_name
- rating (1-5)

Offer_Records Table:
- offer_id (PK)
- application_id (FK)
- salary_offered
- salary_currency
- position_title
- start_date
- offer_date
- status (pending | accepted | declined)
- notes

Hiring_Record Table:
- hire_id (PK)
- offer_id (FK)
- start_date
- end_date (if known)
- feedback_score (1-5)
- feedback_text
- member_rating (1-5)
```

### 3.7 Messaging
```
Messages Table:
- message_id (PK)
- from_user_id (FK)
- to_user_id (FK)
- context (job_application | mentorship | inquiry)
- context_id (FK to relevant entity)
- subject
- body
- sent_at
- read_at
- channel (in_app | email)
```

### 3.8 Career Development Tracking
```
Skill_Development_Records Table:
- record_id (PK)
- profile_id (FK)
- skill_id (FK)
- proficiency_previous
- proficiency_current
- improved_date
- evidence (learning path completed, project, endorsement)

Mentorship_Records Table:
- mentorship_id (PK)
- mentor_id (FK - user)
- mentee_id (FK - profile)
- matched_date
- status (active | completed | paused)
- focus_areas (array: career planning | skill development | interview prep | etc)
- meeting_notes (array)
- progress_rating (1-5)

Career_Journey Table:
- journey_id (PK)
- profile_id (FK)
- milestones (array):
  - profile_completed
  - first_match
  - first_application
  - first_interview
  - first_offer
  - first_hire
  - skill_endorsed
  - mentor_matched
  - etc
- timestamps
```

### 3.9 Analytics & Audits
```
Analytics_Events Table:
- event_id (PK)
- user_id (FK, nullable)
- event_type (profile_view | job_search | application | message | etc)
- entity_type (job | profile | etc)
- entity_id (FK)
- timestamp

Platform_Metrics Table:
- metric_id (PK)
- metric_name
- metric_value
- metric_date
- breakdown (by role, by skill, by employer, etc)
```

---

## 4. CORE FEATURES

### 4.1 Member Onboarding & Profiles
**Feature:** Complete professional profile creation (REQUIRED)

**Workflow:**
1. Email signup (fraternity email?)
2. Basic info (name, class year, phone)
3. Upload/write resume
4. Add skills with proficiency levels
5. Set career interests
6. Set location/availability preferences
7. Set salary expectations
8. Privacy settings (allow employer contact?)
9. Profile complete → can now see job opportunities

**UX Considerations:**
- Progressive disclosure (don't ask everything at once)
- Skill autocomplete with category suggestions
- Drag-and-drop resume upload
- Preview how profile will appear to employers

### 4.2 Employer Onboarding & Job Posting
**Feature:** Quick registration, job posting, candidate management

**Workflow:**
1. Register with company email or generic
2. Company name, industry, location
3. Company logo/description (optional)
4. Post job (auto-approved):
   - Title, description, type
   - Required/preferred skills
   - Salary range
   - Location/remote
   - Experience level
   - Deadline
5. System generates top 10 matches automatically
6. Employer views matched candidates

**UX Considerations:**
- Job posting template/wizard
- Skill suggestions from member pool
- Auto-match visualization
- Simple candidate browsing interface

### 4.3 Intelligent Matching Algorithm
**Feature:** Match members to jobs based on comprehensive criteria

**Matching Criteria & Weighting:**
```
Match Score = (Skills Match × 40%) + (Interests Match × 25%) + 
              (Location Match × 15%) + (Salary Alignment × 15%) + 
              (Availability Match × 5%)

Skills Match (40%):
- Required skills present in member profile
- Proficiency level alignment
- Bonus: preferred skills match

Interests Match (25%):
- Job type matches member interests
- Industry matches member interests
- Company matches member preferences (if specified)

Location Match (15%):
- Job location matches preference
- Remote requirement matches preference
- Relocation willingness considered

Salary Alignment (15%):
- Job salary range overlaps with member expectations
- Perfect alignment = higher score

Availability Match (5%):
- Member is in right stage for role (senior for grad roles, etc)
```

**Display Logic:**
- Only show jobs with match score > threshold (customizable)
- Show top 10 candidates per job to employers
- Include match explanation to both parties

### 4.4 Dual Connection Model
**Feature:** Members can apply OR employers can reach out

**Flow 1: Member Applies Directly**
1. Member sees matched job
2. Clicks "Apply"
3. Application goes to employer
4. Employer can request information
5. Conversation opens between them

**Flow 2: Employer Reaches Out**
1. System shows employer top 10 candidates
2. Employer clicks "Contact Candidate"
3. If member allows employer contact: message sent
4. If member doesn't allow: candidate is hidden
5. Member receives message
6. Member can reply/decline/apply

**UX Considerations:**
- Clear distinction between "applied" and "contacted"
- One-click application (don't require cover letter initially)
- Optional cover note for direct applications

### 4.5 Recommendations Engine
**Feature:** Proactive job, skill development, and mentor suggestions

**Job Recommendations:**
- Daily/weekly digest based on member preferences
- Ranked by match score
- Personalized based on search history
- "Similar to jobs you liked" feature

**Skill Development Recommendations:**
- Suggest skills to learn based on:
  - Skills that appear in matched jobs but member lacks
  - Industry trends
  - Mentor guidance
- Provide learning paths/resources

**Mentor Recommendations:**
- Admin-recommended mentors based on:
  - Shared career path
  - Shared skills/expertise
  - Shared alma mater year/interests
  - Geographic proximity

### 4.6 Messaging & Communication
**Feature:** In-app and email messaging between parties

**Channels:**
- In-app messaging (real-time-ish)
- Email notifications of messages
- Context (know which job/mentorship message relates to)

**Features:**
- Message history preserved
- Can attach documents
- Read receipts
- Optional: automatic follow-up reminders

**Privacy:**
- Members must opt-in to employer contact
- Can block employers/mentors
- Can unsubscribe from notifications

### 4.7 Career Development Tracking
**Feature:** Track member growth over time

**Tracked Elements:**
- Skill proficiency improvements
- Skill endorsements received
- Career milestones (first application, first interview, hire, etc)
- Mentor relationships and feedback
- Job transitions and outcomes

**Member View:**
- Timeline of career journey
- Skills graph showing growth
- Mentor connections
- Success metrics

**Mentor View:**
- Mentee progress on focus areas
- Skill improvements
- Job outcomes
- Guidance history

### 4.8 Hiring Funnel & Outcomes
**Feature:** Track entire hiring journey

**Stages Tracked:**
1. Match generated
2. Job shown to candidate
3. Application submitted / Employer reaches out
4. Interview conducted
5. Offer extended
6. Offer accepted/declined
7. Hire confirmed
8. Role feedback (post-hire)

**Data Captured:**
- Interview notes and ratings
- Offer details (salary, start date, role title)
- Feedback from both member and employer
- Rejection feedback (why candidate wasn't selected)
- Success rating (1-5) after hire

### 4.9 Mentor Relationship Management
**Feature:** Structured mentorship program

**Workflow:**
1. Admin suggests mentor-mentee pairs
2. Both parties accept/decline
3. Mentee sets focus areas (career planning, interview prep, skill development, etc)
4. Mentor sends guidance/resources
5. Meetings recorded/notes taken
6. Progress tracked over time

**Features:**
- Mentor dashboard showing mentee progress
- Member can request specific mentors
- Focus area tracking
- Success metrics
- Mentorship milestone tracking

### 4.10 Advanced Search & Filtering
**Feature:** Powerful search for both members and employers

**For Members (searching jobs):**
- Text search by title/company
- Filter by job type, industry, location, salary range
- Filter by skills required
- Sort by match score, salary, date posted
- Save searches
- Advanced search syntax

**For Employers (searching candidates):**
- Text search by name, skills, experience
- Filter by skill + proficiency level
- Filter by location, salary expectations, availability
- Filter by experience level
- Sort by match score, most recent profile update
- Saved searches/candidate lists

### 4.11 Customizable Dashboards
**Feature:** Role-specific analytics and insights

**Member Dashboard:**
- Profile completion status
- Matched opportunities (number, by type)
- Active applications (status)
- Messages from employers
- Mentor connections
- Career development progress
- Recommended jobs/skills
- Notification preferences

**Employer Dashboard:**
- Posted jobs (status, matches)
- Application pipeline (funnel by stage)
- Top performing skills (most hires)
- Time to hire metrics
- Offer acceptance rate
- Candidate quality metrics
- Job posting analytics

**Mentor Dashboard:**
- Assigned mentees
- Mentee progress on focus areas
- Upcoming mentee milestones
- Guidance history
- Success metrics

**Admin Dashboard:**
- Platform health metrics
- Member stats (profiles, applications, hires)
- Employer stats (postings, hires, quality)
- Matching performance (match accuracy, conversion)
- Mentor program stats
- Top skills, industries, employers
- Platform growth metrics

---

## 5. TECHNICAL ARCHITECTURE

### 5.1 Tech Stack (Recommended)
```
Frontend:
- React.js (web)
- React Native or Flutter (mobile)
- TypeScript
- Tailwind CSS or Material-UI
- Redux or Context API (state management)
- Socket.io (for real-time messaging)

Backend:
- Node.js + Express.js OR Python + FastAPI
- PostgreSQL (relational data)
- Redis (caching, sessions, real-time)
- Elasticsearch (search functionality)

Infrastructure:
- AWS or Google Cloud
- Docker for containerization
- CI/CD pipeline (GitHub Actions or Jenkins)
- Load balancing for scale

Other:
- SendGrid or Twilio (email/SMS)
- JWT for authentication
- S3 or Cloud Storage (file uploads)
```

### 5.2 Database Schema Priorities
1. Users and roles
2. Member and employer profiles
3. Job postings
4. Matches
5. Applications
6. Messages
7. Analytics events
8. Career development tracking

### 5.3 API Endpoints (High Level)
**Auth:** Register, login, logout, refresh token  
**Users:** Get profile, update profile, upload resume  
**Jobs:** List jobs, get job details, create job, update job, close job  
**Matches:** Get matches for job, get matches for member  
**Applications:** Create application, get application status, update status  
**Messages:** Send message, get messages, mark read  
**Search:** Advanced search for jobs/candidates  
**Recommendations:** Get job recommendations, skill recommendations, mentor matches  
**Analytics:** Dashboard data endpoints per role  

### 5.4 Scalability Considerations
- Horizontal scaling with load balancing
- Database indexing for fast queries
- Caching layer for frequent queries
- Asynchronous job processing (matching, recommendations, notifications)
- CDN for static assets
- Built to handle 1000s of members, 100s of employers

---

## 6. LAUNCH STRATEGY & SUPPORT

### 6.1 Phase 1: MVP Launch
**Timeline:** [To be determined with your timeline]

**Minimum Features:**
- Member profiles with basic skills/preferences
- Job postings
- Basic matching algorithm
- Direct applications
- Simple dashboard

**What to defer:**
- Employer outreach messaging
- Mentor program
- Career development tracking
- Advanced analytics
- Mobile app

### 6.2 Phase 2: Enhanced Matching & Messaging
- Employer can message matched candidates
- Improved matching algorithm
- Recommendations engine for jobs
- Enhanced notifications

### 6.3 Phase 3: Mentor Program & Analytics
- Mentor matching and management
- Full hiring funnel tracking
- Detailed dashboards per role
- Career development tracking

### 6.4 Phase 4: Mobile & Advanced Features
- Native mobile apps
- ML-based recommendations
- Skill development recommendations
- Advanced reporting

### 6.5 Launch Support
- Help recruit initial employer partners
- Help promote to fraternity members
- Setup guides and documentation
- Training for administrators
- Feedback collection and iteration

---

## 7. KEY SUCCESS METRICS

### Member Engagement
- Profile completion rate
- Job applications per member
- Application-to-interview conversion rate
- Application-to-hire conversion rate
- Mentor relationship formation rate

### Employer Effectiveness
- Time to hire
- Offer acceptance rate
- Quality of hires (feedback scores)
- Repeat hiring from platform
- Job posting fill rate

### Platform Health
- Member retention
- Employer repeat usage
- Matching accuracy (% of matches that lead to interviews)
- Active member base growth
- Employer registration growth

### Career Outcomes
- Members hired through platform
- Salary growth (before/after hire)
- Skill development (proficiency improvements)
- Alumni engagement (mentoring)

---

## 8. COMPETITIVE ADVANTAGES

1. **Fraternity-exclusive:** Trusted, curated community
2. **Dual flow:** Members apply + employers reach out
3. **Career tracking:** Not just matching, but development
4. **Mentor integration:** Professional guidance alongside jobs
5. **Comprehensive matching:** Skills, interests, salary, location all considered
6. **Full-featured Day 1:** All core features functional from launch

---

## 9. POTENTIAL CHALLENGES & MITIGATION

| Challenge | Mitigation |
|-----------|-----------|
| Cold start (no jobs/members) | Launch marketing to employers early, incentivize initial postings |
| Members not completing profiles | Gamification, benefits tied to profile completion |
| Poor match quality | Start with manual verification, refine algorithm over time |
| Employer spam/low quality | Community flagging, manual moderation initially |
| Scale with growth | Built on scalable architecture from day 1 |
| Maintaining member privacy | Clear privacy controls, anonymized analytics |

---

## 10. NEXT STEPS

1. **Validate this spec** - Does this match your vision?
2. **Determine timeline** - When do you want to launch?
3. **Choose tech stack** - Pick your preferred tools/partners
4. **Design database** - Create detailed schema
5. **Build MVP** - Start with core features
6. **Design UI/UX** - Wireframes and mockups
7. **Develop** - Build the platform
8. **Recruit employers** - Get initial job postings
9. **Launch to fraternity** - Soft launch with members
10. **Iterate & expand** - Add features based on feedback

---

## APPENDIX: Feature Prioritization Matrix

**High Priority (Must Have):**
- User accounts (member, employer, mentor)
- Profile creation (required to proceed)
- Job posting
- Basic matching
- Applications
- Messaging
- Admin moderation

**Medium Priority (Should Have):**
- Job recommendations
- Skill tracking with endorsements
- Career development tracking
- Mentor matching
- Advanced search filters
- Basic dashboards

**Lower Priority (Nice to Have):**
- ML-based recommendations
- Mobile app
- Skill development resources
- Integration with external job boards
- SMS notifications
- Automated follow-ups

---

**Version Control:**
- v1.0 - Initial comprehensive specification (April 2026)
