# Nupes at Work - Complete FlutterFlow Structure

## PAGES TO CREATE

### AUTH PAGES
1. **Login Page** (`/login`)
   - Email input
   - Password input
   - Login button
   - "Forgot Password?" link
   - "Sign Up" link
   - Error message display

2. **Sign Up Page** (`/signup`)
   - Email input
   - Password input
   - Confirm password input
   - First name input
   - Last name input
   - Role dropdown (Member, Employer, Mentor)
   - Sign up button
   - "Already have account? Login" link

3. **Forgot Password Page** (`/forgot-password`)
   - Email input
   - Reset button
   - Back to login link

### MEMBER PAGES
4. **Member Profile Creation** (`/member-profile`)
   - Profile photo upload
   - Headline input
   - Bio textarea
   - Current stage dropdown (freshman, sophomore, junior, senior, alumni)
   - Graduation date picker
   - Phone input
   - LinkedIn URL input
   - Portfolio URL input
   - Resume upload
   - Skills section (add multiple skills with proficiency)
   - Job preferences section:
     - Salary range (min/max)
     - Remote preference (fully_remote, hybrid, on_site)
     - Preferred locations (multi-select)
     - Willing to relocate checkbox
     - Job types interested (multi-select)
     - Industries interested (multi-select)
     - Company preferences (multi-select)
   - Privacy settings (allow employer contact)
   - Save profile button

5. **Member Dashboard** (`/member-dashboard`)
   - Profile completion status
   - Matched jobs count
   - Active applications
   - Messages count
   - Recent recommendations
   - Quick actions: View Jobs, Edit Profile, Messages

6. **Job Search** (`/jobs`)
   - Search bar
   - Filters: job type, industry, location, salary range, skills
   - Job listings with match scores
   - Save search option
   - Sort options

7. **Job Details** (`/job/[id]`)
   - Job title, company, location
   - Job description
   - Requirements
   - Match score breakdown
   - Apply button
   - Save job button

8. **Applications** (`/applications`)
   - List of applications
   - Status tracking (applied, interviewed, offer, etc)
   - Application details
   - Withdraw option

9. **Messages** (`/messages`)
   - Conversation list
   - Message thread view
   - Compose new message
   - Search messages

10. **Career Progress** (`/career-progress`)
    - Skills growth chart
    - Career timeline
    - Mentor connections
    - Endorsements received

### EMPLOYER PAGES
11. **Employer Profile Creation** (`/employer-profile`)
    - Company logo upload
    - Company name input
    - Industry dropdown
    - Company size dropdown
    - Website input
    - Location input
    - Company description textarea
    - Save profile button

12. **Employer Dashboard** (`/employer-dashboard`)
    - Posted jobs list
    - Application pipeline
    - Candidate quality metrics
    - Time to hire metrics
    - Post new job button

13. **Post Job** (`/post-job`)
    - Job title input
    - Job description textarea
    - Job type dropdown
    - Industry dropdown
    - Location input
    - Salary range (min/max)
    - Required skills (multi-select with proficiency)
    - Preferred skills (multi-select)
    - Experience level dropdown
    - Deadline picker
    - Post job button

14. **View Candidates** (`/job/[id]/candidates`)
    - Top 10 matched candidates
    - Match scores and breakdown
    - "Contact Candidate" button
    - Candidate profile preview

15. **Hiring Pipeline** (`/pipeline`)
    - Funnel view (applications → interviews → offers → hires)
    - Stage management
    - Interview scheduling
    - Offer management

### MENTOR PAGES
16. **Mentor Profile Creation** (`/mentor-profile`)
    - Profile photo upload
    - Bio textarea
    - Expertise areas (multi-select)
    - Years experience
    - Current company/role
    - Availability preferences
    - Save profile button

17. **Mentor Dashboard** (`/mentor-dashboard`)
    - Assigned mentees list
    - Mentee progress tracking
    - Upcoming meetings
    - Success metrics

18. **Mentee Management** (`/mentee/[id]`)
    - Mentee profile view
    - Focus areas tracking
    - Meeting notes
    - Progress updates
    - Send guidance/resources

### ADMIN PAGES
19. **Admin Dashboard** (`/admin`)
    - Platform health metrics
    - User statistics
    - Job posting stats
    - Match accuracy metrics
    - Growth trends

20. **User Management** (`/admin/users`)
    - User list with roles
    - Account status management
    - Manual role assignment

21. **Job Moderation** (`/admin/jobs`)
    - All job postings list
    - Flagged jobs review
    - Remove/edit jobs

22. **Mentor Matching** (`/admin/mentor-matching`)
    - Mentor recommendations
    - Match mentor-mentee pairs
    - Track mentorship success

### SHARED PAGES
23. **Settings** (`/settings`)
    - Profile settings
    - Notification preferences
    - Privacy settings
    - Account management

24. **Notifications** (`/notifications`)
    - List of notifications
    - Mark as read/unread
    - Notification preferences

25. **Help/Support** (`/help`)
    - FAQ
    - Contact support
    - Platform guides

## NAVIGATION STRUCTURE

### Bottom Navigation (Mobile)
- Home (Dashboard)
- Jobs
- Applications/Messages
- Profile

### Side Navigation (Desktop)
- Dashboard
- Jobs/Applications
- Messages
- Profile/Settings
- Help

## AUTHENTICATION FLOW

### Login Flow
1. User enters email/password
2. Validate with Supabase Auth
3. On success: Get user profile from profiles table
4. Navigate to role-specific dashboard
5. On error: Show error message

### Sign Up Flow
1. User enters details + role
2. Create auth account in Supabase
3. Create profile record in profiles table
4. Navigate to role-specific profile creation
5. Complete profile creation
6. Navigate to dashboard

### Profile Completion Required
- If profile incomplete: Show profile creation wizard
- Block access to main features until profile complete
- Show progress indicator

## DATA BINDING INSTRUCTIONS

### For Each Page
1. Connect to Supabase tables
2. Set up real-time subscriptions where needed
3. Add loading states
4. Add error handling
5. Implement pagination for lists
6. Add search/filter functionality

### Key Integrations
- **Auth**: Supabase Authentication
- **Database**: All tables via Supabase
- **Storage**: Profile photos, resumes, company logos
- **Real-time**: Messages, notifications, matches
- **Functions**: Matching algorithm calls

## STYLING GUIDELINES

### Color Scheme
- Primary: Fraternity colors (update with actual colors)
- Secondary: Professional blue/gray
- Success: Green
- Warning: Orange
- Error: Red

### Typography
- Headers: Bold, large
- Body: Clean, readable
- Buttons: Clear CTAs

### Layout
- Mobile-first responsive design
- Clean, professional interface
- Consistent spacing
- Clear visual hierarchy

## TESTING CHECKLIST

### Authentication
- [ ] Login works with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Sign up creates account
- [ ] Password reset works
- [ ] Role-based navigation works

### Member Features
- [ ] Profile creation saves all fields
- [ ] Job search returns results
- [ ] Job applications work
- [ ] Messages send/receive
- [ ] Dashboard shows correct data

### Employer Features
- [ ] Job posting works
- [ ] Candidate matching shows
- [ ] Pipeline tracking works
- [ ] Dashboard metrics accurate

### Mentor Features
- [ ] Profile creation works
- [ ] Mentee tracking works
- [ ] Guidance sending works

### Cross-Features
- [ ] Real-time updates work
- [ ] Data persistence works
- [ ] Error handling works
- [ ] Loading states work

## DEPLOYMENT STEPS

1. Test all features in FlutterFlow simulator
2. Test on actual devices
3. Set up custom domain (if desired)
4. Publish to web
5. Publish to app stores (if desired)
6. Set up monitoring
