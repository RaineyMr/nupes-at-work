import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import {
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  TrendingUpIcon,
  ClockIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const EmployerDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    postedJobs: 0,
    activeApplications: 0,
    candidatesHired: 0,
    avgTimeToHire: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load posted jobs
      const { data: jobs } = await supabase.getJobs({ employer_id: profile.id });
      
      // Load applications for employer's jobs
      const { data: applications } = await supabase
        .from('applications')
        .select('*')
        .eq('employer_id', profile.id);

      // Calculate stats
      const activeApplications = applications?.filter(app => 
        ['applied', 'interviewed', 'offer_extended'].includes(app.status)
      ) || [];

      const hiredApplications = applications?.filter(app => app.status === 'hired') || [];

      setStats({
        postedJobs: jobs?.length || 0,
        activeApplications: activeApplications.length,
        candidatesHired: hiredApplications.length,
        avgTimeToHire: calculateAvgTimeToHire(hiredApplications),
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgTimeToHire = (hiredApplications) => {
    if (hiredApplications.length === 0) return 0;
    
    const totalTime = hiredApplications.reduce((total, app) => {
      if (app.applied_at && app.hired_at) {
        const timeDiff = new Date(app.hired_at) - new Date(app.applied_at);
        return total + timeDiff;
      }
      return total;
    }, 0);

    return Math.round(totalTime / hiredApplications.length / (1000 * 60 * 60 * 24)); // days
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
          Employer Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your job postings and track candidate progress.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Hiring Overview
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.postedJobs}</div>
              <div className="text-sm text-gray-500">Jobs Posted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeApplications}</div>
              <div className="text-sm text-gray-500">Active Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.candidatesHired}</div>
              <div className="text-sm text-gray-500">Candidates Hired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.avgTimeToHire}</div>
              <div className="text-sm text-gray-500">Avg. Days to Hire</div>
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
              to="/post-job"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Post New Job</span>
              <div className="flex items-center">
                <PlusCircleIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">Post New Job</span>
              </div>
            </Link>

            <Link
              to="/pipeline"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">View Pipeline</span>
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">View Pipeline</span>
              </div>
            </Link>

            <Link
              to="/employer-profile"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Edit Company Profile</span>
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">Edit Profile</span>
              </div>
            </Link>

            <Link
              to="/jobs"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Browse Candidates</span>
              <div className="flex items-center">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                <span className="ml-3 text-base font-medium text-gray-900">Browse Candidates</span>
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
          <div className="flow-root">
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No recent activity
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start posting jobs to see candidate activity here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
