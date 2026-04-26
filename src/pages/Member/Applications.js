import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  DocumentTextIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabaseHelpers.getUserApplications(user.id);
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return 'text-green-600 bg-green-100';
      case 'offer_extended':
        return 'text-yellow-600 bg-yellow-100';
      case 'interviewed':
        return 'text-blue-600 bg-blue-100';
      case 'applied':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hired':
        return CheckCircleIcon;
      case 'offer_extended':
        return StarIcon;
      case 'interviewed':
        return ClockIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      offer_extended: applications.filter(app => app.status === 'offer_extended').length,
      hired: applications.filter(app => app.status === 'hired').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
    return stats;
  };

  const stats = getStatusStats();

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
          My Applications
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your job applications and interview progress.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Application Overview
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
              <div className="text-sm text-gray-500">Applied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.interviewed}</div>
              <div className="text-sm text-gray-500">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.offer_extended}</div>
              <div className="text-sm text-gray-500">Offers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
              <div className="text-sm text-gray-500">Hired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Applications', count: stats.total },
                { key: 'applied', label: 'Applied', count: stats.applied },
                { key: 'interviewed', label: 'Interviews', count: stats.interviewed },
                { key: 'offer_extended', label: 'Offers', count: stats.offer_extended },
                { key: 'hired', label: 'Hired', count: stats.hired },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {filter === 'all' ? 'All Applications' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Applications`}
          </h3>
          
          {filteredApplications.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <li key={application.id} className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(application.status)}`}>
                          {React.createElement(getStatusIcon(application.status), {
                            className: "h-5 w-5",
                            "aria-hidden": "true"
                          })}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/jobs/${application.job_id}`}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600"
                            >
                              {application.job?.title}
                            </Link>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                                {application.job?.company_name}
                              </div>
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {application.job?.location}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                Applied {formatDate(application.applied_at)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {application.status.replace('_', ' ')}
                            </span>
                            
                            <Link
                              to={`/applications/${application.id}`}
                              className="text-blue-600 hover:text-blue-500 text-sm"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>

                        {application.cover_note && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                              <strong>Cover Note:</strong> {application.cover_note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No {filter === 'all' ? '' : `${filter.toLowerCase()} `}applications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Start applying to jobs to see your applications here.'
                  : `No ${filter.toLowerCase()} applications yet.`
                }
              </p>
              <div className="mt-6">
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Success Metrics
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.hired / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Application Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.interviewed > 0 ? Math.round((stats.interviewed / stats.applied) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Interview Rate</div>
            </div>
          </div>
          
          {stats.hired > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h4 className="text-lg font-medium text-green-900">Congratulations!</h4>
                  <p className="text-sm text-green-700">
                    You've secured {stats.hired} position{stats.hired > 1 ? 's' : ''} through the platform.
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
