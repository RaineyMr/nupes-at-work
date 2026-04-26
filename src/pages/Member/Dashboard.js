import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import {
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const MemberDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    matchedJobs: 0,
    activeApplications: 0,
    interviewsScheduled: 0,
    unreadMessages: 0,
    skillsEndorsed: 0,
    profileCompletion: 0,
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      loadDashboardData();
    }
  }, [user, profile]);

  const loadDashboardData = async () => {
    try {
      // Load user matches
      const { data: matches } = await supabaseHelpers.getUserMatches(user.id);
      
      // Load user applications
      const { data: applications } = await supabaseHelpers.getUserApplications(user.id);
      
      // Load messages
      const { data: messages } = await supabaseHelpers.getMessages(user.id);
      
      // Load skills
      const { data: skills } = await supabaseHelpers.getUserSkills(user.id);

      // Calculate stats
      const activeApplications = applications?.filter(app => 
        ['applied', 'interviewed', 'offer_extended'].includes(app.status)
      ) || [];

      const interviewsScheduled = applications?.filter(app => 
        app.status === 'interviewed'
      ) || [];

      const unreadMessages = messages?.filter(msg => 
        msg.to_user_id === user.id && !msg.read_at
      ) || [];

      const skillsEndorsed = skills?.reduce((total, skill) => 
        total + (skill.endorsement_count || 0), 0
      ) || 0;

      // Calculate profile completion
      const requiredFields = [
        'first_name', 'last_name', 'headline', 'bio', 'current_stage',
        'graduation_date', 'phone'
      ];
      const completedFields = requiredFields.filter(field => profile[field]);
      const profileCompletion = Math.round((completedFields.length / requiredFields.length) * 100);

      setStats({
        matchedJobs: matches?.length || 0,
        activeApplications: activeApplications.length,
        interviewsScheduled: interviewsScheduled.length,
        unreadMessages: unreadMessages.length,
        skillsEndorsed,
        profileCompletion,
      });

      setRecentMatches(matches?.slice(0, 5) || []);
      setRecentApplications(applications?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome back, {profile?.first_name}! 👋
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Here's what's happening with your job search and career development.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Matched Jobs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.matchedJobs}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/jobs"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                View all jobs →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Applications
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activeApplications}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/applications"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Track applications →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Unread Messages
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.unreadMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/messages"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Check messages →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Profile Complete
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.profileCompletion}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              {stats.profileCompletion < 100 ? (
                <Link
                  to="/profile"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Complete profile →
                </Link>
              ) : (
                <span className="text-green-600 font-medium">✓ Complete</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Job Matches
            </h3>
            <Link
              to="/jobs"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="mt-6">
            {recentMatches.length > 0 ? (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentMatches.map((match) => (
                    <li key={match.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {match.job?.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {match.job?.company_name} • {match.job?.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <StarIconSolid className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-900 ml-1">
                              {match.match_score}%
                            </span>
                          </div>
                          <Link
                            to={`/jobs/${match.job_id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8">
                <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No job matches yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete your profile to start getting matched with opportunities.
                </p>
                <div className="mt-6">
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Applications
            </h3>
            <Link
              to="/applications"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="mt-6">
            {recentApplications.length > 0 ? (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentApplications.map((application) => (
                    <li key={application.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            application.status === 'hired' ? 'bg-green-100' :
                            application.status === 'offer_extended' ? 'bg-yellow-100' :
                            application.status === 'interviewed' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {application.status === 'hired' ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            ) : application.status === 'offer_extended' ? (
                              <StarIcon className="h-4 w-4 text-yellow-600" />
                            ) : application.status === 'interviewed' ? (
                              <ClockIcon className="h-4 w-4 text-blue-600" />
                            ) : (
                              <DocumentTextIcon className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {application.job?.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'hired' ? 'bg-green-100 text-green-800' :
                            application.status === 'offer_extended' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'interviewed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {application.status.replace('_', ' ')}
                          </span>
                          <Link
                            to={`/applications/${application.id}`}
                            className="text-blue-600 hover:text-blue-500 text-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No applications yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start applying to jobs that match your skills and interests.
                </p>
                <div className="mt-6">
                  <Link
                    to="/jobs"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Browse Jobs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Quick Actions
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/jobs"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Browse Jobs</span>
              <div className="flex items-center">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                <span className="ml-3 text-base font-medium text-gray-900">
                  Browse Jobs
                </span>
              </div>
            </Link>

            <Link
              to="/profile"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Edit Profile</span>
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                <span className="ml-3 text-base font-medium text-gray-900">
                  Edit Profile
                </span>
              </div>
            </Link>

            <Link
              to="/messages"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Messages</span>
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                <span className="ml-3 text-base font-medium text-gray-900">
                  Messages
                </span>
              </div>
            </Link>

            <Link
              to="/career-progress"
              className="relative block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Career Progress</span>
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                <span className="ml-3 text-base font-medium text-gray-900">
                  Career Progress
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
