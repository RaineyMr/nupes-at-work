import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const MentorDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    assignedMentees: 0,
    activeMentorships: 0,
    completedMentorships: 0,
    avgMenteeProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load mentorships for this mentor
      const { data: mentorships } = await supabase
        .from('mentorships')
        .select('*')
        .eq('mentor_id', profile.id);

      // Calculate stats
      const activeMentorships = mentorships?.filter(m => m.status === 'active') || [];
      const completedMentorships = mentorships?.filter(m => m.status === 'completed') || [];
      
      setStats({
        assignedMentees: mentorships?.length || 0,
        activeMentorships: activeMentorships.length,
        completedMentorships: completedMentorships.length,
        avgMenteeProgress: calculateAvgProgress(activeMentorships),
      });
    } catch (error) {
      console.error('Error loading mentor dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgProgress = (activeMentorships) => {
    if (activeMentorships.length === 0) return 0;
    
    // This would normally come from mentee progress tracking
    // For now, return a mock progress value
    return Math.floor(Math.random() * 30) + 40; // Mock 40-70% progress
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
          Mentor Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Guide and support fraternity members in their career development.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Mentor Overview
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.assignedMentees}</div>
              <div className="text-sm text-gray-500">Assigned Mentees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeMentorships}</div>
              <div className="text-sm text-gray-500">Active Mentorships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.completedMentorships}</div>
              <div className="text-sm text-gray-500">Completed Mentorships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.avgMenteeProgress}%</div>
              <div className="text-sm text-gray-500">Avg. Mentee Progress</div>
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
            <Link
              to="/mentor-profile"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Edit Mentor Profile</span>
              <div className="flex items-center">
                <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">Edit Profile</span>
              </div>
            </Link>

            <Link
              to="/mentee-management"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Manage Mentees</span>
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">Manage Mentees</span>
              </div>
            </Link>

            <Link
              to="/messages"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Messages</span>
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">Messages</span>
              </div>
            </Link>

            <Link
              to="/help"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Help Resources</span>
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">Help Resources</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No recent activity
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your mentorship activity will appear here as you engage with mentees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
