import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Member Pages
import MemberDashboard from './pages/Member/Dashboard';
import MemberProfile from './pages/Member/Profile';
import JobSearch from './pages/Member/JobSearch';
import JobDetails from './pages/Member/JobDetails';
import Applications from './pages/Member/Applications';
import Messages from './pages/Member/Messages';
import CareerProgress from './pages/Member/CareerProgress';

// Employer Pages
import EmployerDashboard from './pages/Employer/Dashboard';
import EmployerProfile from './pages/Employer/Profile';
import PostJob from './pages/Employer/PostJob';
import ViewCandidates from './pages/Employer/ViewCandidates';
import HiringPipeline from './pages/Employer/HiringPipeline';

// Mentor Pages
import MentorDashboard from './pages/Mentor/Dashboard';
import MentorProfile from './pages/Mentor/Profile';
import MenteeManagement from './pages/Mentor/MenteeManagement';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import JobModeration from './pages/Admin/JobModeration';
import MentorMatching from './pages/Admin/MentorMatching';

// Shared Pages
import Settings from './pages/Shared/Settings';
import Notifications from './pages/Shared/Notifications';
import Help from './pages/Shared/Help';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Member Routes */}
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="jobs" element={<JobSearch />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="career-progress" element={<CareerProgress />} />
          
          {/* Employer Routes */}
          <Route path="employer-dashboard" element={<EmployerDashboard />} />
          <Route path="employer-profile" element={<EmployerProfile />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="job/:id/candidates" element={<ViewCandidates />} />
          <Route path="pipeline" element={<HiringPipeline />} />
          
          {/* Mentor Routes */}
          <Route path="mentor-dashboard" element={<MentorDashboard />} />
          <Route path="mentor-profile" element={<MentorProfile />} />
          <Route path="mentee/:id" element={<MenteeManagement />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/jobs" element={<JobModeration />} />
          <Route path="admin/mentor-matching" element={<MentorMatching />} />
          
          {/* Shared Routes */}
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="help" element={<Help />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
