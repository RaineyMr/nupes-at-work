# Demo Login Credentials

## Member Login
- **Email:** member@nupesatwork.com
- **Password:** Member123!

## Employer Login
- **Email:** employer@nupesatwork.com
- **Password:** Employer123!

## Mentor Login
- **Email:** mentor@nupesatwork.com
- **Password:** Mentor123!

## Admin Login
- **Email:** admin@nupesatwork.com
- **Password:** Admin123!

---

## Testing Instructions

1. **Start the application:**
   ```bash
   npm start
   ```

2. **Test each role:**
   - Member: Log in with member credentials to test member dashboard, job search, applications
   - Employer: Log in with employer credentials to test job posting, candidate viewing
   - Mentor: Log in with mentor credentials to test mentee management, profile
   - Admin: Log in with admin credentials to test user management, moderation

3. **Test key features:**
   - Authentication flow (signup, login, logout)
   - Member profile creation and editing
   - Job posting and application system
   - Mentorship matching and management
   - Admin dashboard and user management
   - Real-time messaging (if implemented)

4. **Verify data persistence:**
   - Check if profiles save correctly
   - Test job applications and status updates
   - Test mentor-mentee matching functionality

5. **Test responsive design:**
   - Test on different screen sizes
   - Verify mobile compatibility

## Notes
- These are demo accounts for testing purposes only
- In production, users will register with their own email/password
- All passwords use the pattern: [Role]123!
- All emails use the pattern: [role]@nupesatwork.com
