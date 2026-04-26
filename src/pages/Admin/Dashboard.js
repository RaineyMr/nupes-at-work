import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  UserGroupIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeMentorships: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Mock stats for now - in production, these would come from database
      const mockStats = {
        totalUsers: 156,
        totalJobs: 42,
        totalApplications: 318,
        activeMentorships: 24,
        recentRegistrations: 12,
        avgTimeToHire: 28,
        matchAccuracy: 87,
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage the entire platform and monitor performance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Platform Overview
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalJobs}</div>
              <div className="text-sm text-gray-500">Jobs Posted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalApplications}</div>
              <div className="text-sm text-gray-500">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.activeMentorships}</div>
              <div className="text-sm text-gray-500">Active Mentorships</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-900">User Management</h4>
                <p className="text-sm text-gray-500">Manage user accounts and roles</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-900">Job Moderation</h4>
                <p className="text-sm text-gray-500">Review and moderate job postings</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                <TrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-900">Mentor Matching</h4>
                <p className="text-sm text-gray-500">Match mentors with mentees</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-500">View platform analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No recent activity
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Platform activity will appear here as users interact with the system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.matchAccuracy}%</div>
              <div className="text-sm text-gray-500">Match Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.avgTimeToHire} days</div>
              <div className="text-sm text-gray-500">Avg. Time to Hire</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.recentRegistrations}</div>
              <div className="text-sm text-gray-500">New Signups (7 days)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
