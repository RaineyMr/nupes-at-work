# Fraternity Job Board - System Architecture & Data Flow

## SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐ │
│  │   WEB APPLICATION   │  │    MOBILE APPLICATION             │ │
│  │   (React.js)        │  │  (React Native/Flutter)           │ │
│  │                     │  │                                   │ │
│  │ • Member Dashboard  │  │ • Profile Management              │ │
│  │ • Job Search        │  │ • Job Browsing                    │ │
│  │ • Apply to Jobs     │  │ • Quick Apply                     │ │
│  │ • Messaging         │  │ • Messages                        │ │
│  │ • Profile Mgmt      │  │ • Recommendations                 │ │
│  │                     │  │                                   │ │
│  │ • Employer Portal   │  │ • Candidate Search                │ │
│  │ • Post Jobs         │  │ • Hiring Pipeline                 │ │
│  │ • View Candidates   │  │ • Messaging                       │ │
│  │ • Manage Pipeline   │  │                                   │ │
│  │                     │  │ • Mentor Dashboard                │ │
│  │ • Admin Console     │  │ • Track Mentees                   │ │
│  │ • Moderation        │  │                                   │ │
│  └─────────────────────┘  └──────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │  HTTPS / WebSocket      │
                    │
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  • Load Balancing                                               │
│  • Rate Limiting                                                │
│  • Authentication Middleware                                    │
│  • Request/Response Transformation                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
┌───────────────────────┐  ┌──────────────┐  ┌──────────────────┐
│   APPLICATION LAYER   │  │ CACHE LAYER  │  │  SEARCH ENGINE   │
│   (Node.js + Express) │  │   (Redis)    │  │  (Elasticsearch) │
├───────────────────────┤  └──────────────┘  └──────────────────┘
│                       │                                        │
│ Auth Service          │  Caches:                              │
│ ├─ Register           │  • Job listings                       │
│ ├─ Login              │  • Member profiles                    │
│ ├─ Token management   │  • Matches                           │
│                       │  • Recommendations                    │
│ User Service          │  • Session data                       │
│ ├─ Profile CRUD       │                                        │
│ ├─ Resume upload      │  Search Indexes:                     │
│ ├─ Skills management  │  • Jobs by keyword, skill, location  │
│                       │  • Members by name, skill            │
│ Job Service           │  • Companies                         │
│ ├─ Post job           │                                        │
│ ├─ List jobs          │                                        │
│ ├─ Get job details    │                                        │
│ ├─ Update job status  │                                        │
│                       │                                        │
│ Matching Service      │                                        │
│ ├─ Calculate scores   │                                        │
│ ├─ Generate matches   │                                        │
│ ├─ Rank candidates    │                                        │
│                       │                                        │
│ Application Service   │                                        │
│ ├─ Apply to job       │                                        │
│ ├─ Manage pipeline    │                                        │
│ ├─ Track outcomes     │                                        │
│                       │                                        │
│ Messaging Service     │                                        │
│ ├─ Send messages      │                                        │
│ ├─ Retrieve messages  │                                        │
│ ├─ Real-time updates  │                                        │
│                       │                                        │
│ Recommendation Svc    │                                        │
│ ├─ Job recommends     │                                        │
│ ├─ Skill recommends   │                                        │
│ ├─ Mentor matches     │                                        │
│                       │                                        │
│ Analytics Service     │                                        │
│ ├─ Event tracking     │                                        │
│ ├─ Dashboard data     │                                        │
│ ├─ Reports            │                                        │
│                       │                                        │
│ Mentor Service        │                                        │
│ ├─ Mentor matching    │                                        │
│ ├─ Track mentees      │                                        │
│ ├─ Store guidance     │                                        │
│                       │                                        │
│ Notification Service  │                                        │
│ ├─ Send emails        │                                        │
│ ├─ Push notifications │                                        │
│ ├─ SMS (optional)     │                                        │
│                       │                                        │
└───────────────────────┘                                        │
         │                                                       │
         └───────────────────────────────────────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────────────────────┐│
│  │  PRIMARY DATABASE  │  │  FILE STORAGE                      ││
│  │  (PostgreSQL)      │  │  (AWS S3 / Cloud Storage)          ││
│  │                    │  │                                    ││
│  │ • Users            │  │ • Resume PDFs                      ││
│  │ • Profiles         │  │ • Profile photos                   ││
│  │ • Skills           │  │ • Company logos                    ││
│  │ • Jobs             │  │ • Attachments                      ││
│  │ • Matches          │  │                                    ││
│  │ • Applications     │  │                                    ││
│  │ • Messages         │  │                                    ││
│  │ • Interviews       │  │                                    ││
│  │ • Offers           │  │                                    ││
│  │ • Hires            │  │                                    ││
│  │ • Mentorships      │  │                                    ││
│  │ • Analytics Events │  │                                    ││
│  └────────────────────┘  └────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  BACKUP & REPLICATION                                      ││
│  │  • Daily snapshots                                         ││
│  │  • Cross-region replication                                ││
│  │  • Point-in-time recovery                                  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Email Service   │  │  SMS Service     │  │  Analytics   │  │
│  │  (SendGrid)      │  │  (Twilio)        │  │  (Mixpanel/  │  │
│  │                  │  │                  │  │   Segment)   │  │
│  │ • Notifications  │  │ • SMS alerts     │  │ • Event      │  │
│  │ • Digests        │  │ • Reminders      │  │   tracking   │  │
│  │ • Invitations    │  │                  │  │ • Funnel     │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## DATA FLOW DIAGRAMS

### FLOW 1: Member Profile Creation & Job Discovery

```
Member Signs Up
      │
      ▼
Create Account (email, password)
      │
      ▼
Complete Profile
├─ Basic Info (name, phone, class)
├─ Resume Upload
├─ Add Skills + Proficiency
├─ Career Interests
├─ Location Preferences
├─ Salary Expectations
└─ Privacy Settings (allow contact?)
      │
      ▼
Profile Stored in Database
      │
      ▼
System Generates Initial Recommendations
├─ Query matching jobs from database
├─ Calculate match scores
├─ Rank by score
└─ Cache results in Redis
      │
      ▼
Member Dashboard
├─ "Recommended Jobs for You" (top 10)
├─ All Open Jobs (searchable)
├─ Application Status
├─ Mentor Recommendations
└─ Career Progress
```

### FLOW 2: Employer Posts Job & Matching

```
Employer Logs In
      │
      ▼
Create/Post Job
├─ Job details (title, description)
├─ Required/preferred skills
├─ Salary range, location
└─ Auto-approve (no moderation delay)
      │
      ▼
Job Stored in Database
      │
      ▼
MATCHING ENGINE TRIGGERED
├─ Query all member profiles
├─ For each member profile:
│  ├─ Calculate skills match score
│  ├─ Calculate interests match score
│  ├─ Calculate location match score
│  ├─ Calculate salary alignment score
│  └─ Calculate availability score
├─ Weight all scores (40/25/15/15/5)
└─ Generate overall match score (0-100)
      │
      ▼
Store Matches in Database
      │
      ▼
Rank Matches (highest to lowest)
      │
      ▼
Show Top 10 to Employer
├─ Match score
├─ Match explanation
├─ Candidate name & headline
├─ Skills match highlighted
└─ "Contact Candidate" button
      │
      ▼
Notify Matched Members
├─ Generate "New Job Match" recommendation
├─ Email: "A job matching your skills posted"
├─ In-app: Recommendation notification
└─ Optional: Personalized job digest (daily/weekly)
```

### FLOW 3: Dual Application Flow

```
SCENARIO A: Member Applies Directly
├─ Member sees job
├─ Clicks "Apply"
├─ Optional: Add cover note
├─ Application submitted
├─ Stored in Applications table
├─ Employer notified
├─ Employer receives application
├─ Can message member or request info
└─ Conversation opens

SCENARIO B: Employer Reaches Out
├─ Employer sees top 10 candidates
├─ Clicks "Contact Candidate"
├─ System checks: Does member allow contact?
│  ├─ YES: Send message to member
│  └─ NO: Candidate not shown to this employer
├─ Member receives message
├─ Member can:
│  ├─ Reply (start conversation)
│  ├─ Formally Apply (convert to application)
│  └─ Decline (never show me this job)
├─ If member replies/applies:
│  └─ Application created in database
└─ Interview/offer pipeline continues
```

### FLOW 4: Hiring Funnel & Outcomes Tracking

```
Application Created
      │
      ├─ Status: "Applied"
      │
      ▼
Employer Reviews & Schedules Interview
      │
      ├─ Status: "Scheduled"
      │
      ▼
Interview Occurs
      │
      ├─ Status: "Interviewed"
      ├─ Interview notes added
      ├─ Interview rating stored
      │
      ├─ Rejection Path:
      │  ├─ Status: "Rejected"
      │  ├─ Rejection feedback recorded
      │  └─ Member can see anonymized feedback
      │
      ▼ (If Advanced)
Employer Makes Decision
      │
      ├─ Status: "Offer Extended" OR "Rejected"
      │
      ▼ (If Offer)
Member Receives Offer
      │
      ├─ Offer Details Stored:
      │  ├─ Salary
      │  ├─ Start date
      │  ├─ Position title
      │  └─ Other terms
      │
      ├─ Member Accepts/Declines
      │  ├─ Status: "Offer Accepted" OR "Offer Declined"
      │  │
      │  ▼ (If Accepted)
      │  Hire Confirmed
      │  ├─ Status: "Hired"
      │  ├─ Member's profile marked as hired
      │  ├─ Job marked as filled
      │  ├─ Career milestone recorded
      │  │
      │  ▼ (After time on job)
      │  Feedback Collected
      │  ├─ Employer rates member (1-5)
      │  ├─ Member rates job/employer (1-5)
      │  ├─ Feedback text stored
      │  └─ Success metrics updated
      │
      └─ Data flows to dashboards
         ├─ Member's career journey
         ├─ Employer's hiring metrics
         ├─ Skill effectiveness data
         ├─ Match accuracy validation
         └─ Platform success metrics
```

### FLOW 5: Mentor Matching & Guidance

```
Member or Mentor Joins
      │
      ▼
Mentor Profile Created/Updated
      │
      ▼
ADMIN INITIATES MENTOR MATCHING
├─ Query mentors with relevant background
├─ Query members who requested mentorship
├─ Match based on:
│  ├─ Shared career path/interests
│  ├─ Geographic proximity
│  ├─ Availability
│  └─ Mentor expertise areas
├─ Generate match recommendations
└─ Present to admin
      │
      ▼
Admin Sends Match Recommendations
├─ To mentor: "You're recommended to mentor [Member]"
├─ To member: "We matched you with mentor [Mentor]"
      │
      ▼
Both Accept Mentorship
      │
      ├─ Mentorship Record Created
      ├─ Focus Areas Set (career planning, interview prep, etc)
      │
      ▼
Mentee Dashboard Shows:
├─ Mentor name & background
├─ Focus areas for this mentorship
├─ Message history
└─ Progress notes
      │
      ▼
Mentor Provides Guidance
├─ Sends resources/advice
├─ Takes meeting notes
├─ Tracks mentee progress
├─ Updates focus areas
      │
      ▼
Member Gets Hired (or career milestone)
      │
      ├─ Career development record updated
      ├─ Mentor notified of outcome
      └─ Success metric recorded in platform
```

### FLOW 6: Analytics & Dashboards

```
All Platform Events Recorded
├─ Application created → event logged
├─ Interview scheduled → event logged
├─ Job posted → event logged
├─ Message sent → event logged
├─ Match viewed → event logged
├─ Skill endorsed → event logged
├─ Mentor connected → event logged
└─ Hire recorded → event logged
      │
      ▼
Events Aggregated
├─ By user role (member, employer, mentor)
├─ By time period (daily, weekly, monthly)
├─ By entity (job, skill, employer, location)
└─ Computed metrics calculated
      │
      ├─ Member Level Metrics:
      │  ├─ # of matched jobs
      │  ├─ Applications submitted
      │  ├─ Interview-to-application ratio
      │  ├─ Offer rate
      │  ├─ Skills endorsed count
      │  └─ Mentor connections
      │
      ├─ Employer Level Metrics:
      │  ├─ Jobs posted
      │  ├─ Time to fill
      │  ├─ Candidate quality (feedback scores)
      │  ├─ Offer acceptance rate
      │  └─ Repeat hiring rate
      │
      ├─ System Level Metrics:
      │  ├─ Match accuracy (% → interviews)
      │  ├─ Total hires
      │  ├─ Member base growth
      │  ├─ Employer growth
      │  └─ Platform engagement
      │
      └─ Skill Analytics:
         ├─ Most in-demand skills
         ├─ Skills with highest hire rate
         ├─ Skill proficiency distribution
         └─ Endorsement patterns
      │
      ▼
Dashboards Generated
├─ Member Dashboard
│  ├─ Profile stats
│  ├─ Recommendations
│  ├─ Application status
│  └─ Career progress
├─ Employer Dashboard
│  ├─ Job performance
│  ├─ Hiring pipeline
│  ├─ Candidate quality
│  └─ Metrics
├─ Mentor Dashboard
│  ├─ Mentee list
│  ├─ Progress tracking
│  └─ Success metrics
└─ Admin Dashboard
   ├─ Platform health
   ├─ Growth trends
   ├─ Quality metrics
   └─ System performance
      │
      ▼
Real-time Updates (via Redis cache)
├─ New matches displayed to members
├─ Job posts visible to employers
├─ Candidate lists updated
└─ Dashboard numbers refreshed
```

---

## KEY INTEGRATION POINTS

### 1. Matching Algorithm (Critical Path)
```
When job posted:
1. Trigger async matching job
2. Query member profiles from DB
3. For each member: calculate 5 match scores
4. Combine scores with weights
5. Filter > threshold
6. Sort by score
7. Store matches in DB
8. Cache top results in Redis
9. Notify relevant members
10. Show to employer
```

### 2. Real-time Messaging
```
Member sends message:
1. Message stored in DB
2. WebSocket event sent to recipient
3. Real-time notification displayed
4. Also sends email (if not recently messaged)
5. Read status tracked
6. Message thread maintained
```

### 3. Search & Discovery
```
Member searches for jobs:
1. Query Elasticsearch index
2. Apply filters (skills, location, salary, etc)
3. Return results with pagination
4. Cache popular searches
5. Track search for analytics
6. Use search history for recommendations
```

---

## DEPLOYMENT ARCHITECTURE

```
┌──────────────────────────────────────────────────┐
│              DNS / Domain Management              │
└──────────────────────────────────────────────────┘
                        │
┌──────────────────────────────────────────────────┐
│           CDN (Static Assets)                     │
│     (CloudFlare, AWS CloudFront)                  │
└──────────────────────────────────────────────────┘
                        │
┌──────────────────────────────────────────────────┐
│           Load Balancer                           │
│     (Distribute traffic across servers)           │
└──────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────────────┐ ┌──────────────┐ ┌──────────────┐
│ Web Server 1  │ │ Web Server 2 │ │ Web Server N │
│ (Node.js)     │ │ (Node.js)    │ │ (Node.js)    │
│ Docker        │ │ Docker       │ │ Docker       │
└───────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌──────────────┐ ┌────────────┐ ┌────────────┐
│ PostgreSQL   │ │   Redis    │ │ Elastic    │
│ (Primary)    │ │  (Cache)   │ │ Search     │
│              │ │            │ │            │
│ Replica 1    │ │ Replica    │ │ Replica    │
│ Replica 2    │ │            │ │            │
└──────────────┘ └────────────┘ └────────────┘
        │
        └────────────────┬────────────────┐
                         │                │
                    ┌─────────┐    ┌────────────┐
                    │ S3 / GCS│    │Backups     │
                    │         │    │Daily/cross │
                    │ Files   │    │region      │
                    └─────────┘    └────────────┘
```

---

## SECURITY LAYER

```
┌─────────────────────────────────────────┐
│         OAuth 2.0 / JWT Auth            │
│    All API requests authenticated       │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    HTTPS/TLS Encryption                 │
│    All data in transit encrypted        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    Database Encryption at Rest          │
│    Sensitive fields encrypted           │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    Input Validation & Sanitization      │
│    SQL injection prevention             │
│    XSS protection                       │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    Rate Limiting & DDoS Protection      │
│    API throttling per user/IP           │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    Privacy Controls & Data Handling      │
│    GDPR compliance                      │
│    User consent management              │
│    Data export/deletion support         │
└─────────────────────────────────────────┘
```

---

## MONITORING & ALERTING

```
Application Performance Monitoring
├─ API response times
├─ Error rates
├─ Database query performance
├─ Job queue health
└─ Real-time dashboards

Infrastructure Monitoring
├─ Server CPU/Memory
├─ Disk usage
├─ Network throughput
├─ Database replication lag
└─ Cache hit rates

Business Metrics Monitoring
├─ Member signups
├─ Job postings
├─ Applications per day
├─ Match quality metrics
└─ Conversion funnels

Alerting
├─ API downtime
├─ Error spike (>threshold)
├─ Database issues
├─ Low cache hit rates
└─ Business KPI deviations
```

---

**This architecture is designed for:**
- ✅ Horizontal scaling (add more servers)
- ✅ High availability (redundancy at each layer)
- ✅ Fast response times (caching, CDN)
- ✅ Reliable matching (async processing)
- ✅ Real-time features (WebSockets)
- ✅ Complex analytics (data aggregation)
- ✅ Millions of requests per day
