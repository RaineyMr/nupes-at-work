import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const HiringPipeline = () => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    try {
      // Load all applications for employer's jobs
      const { data: jobs } = await supabaseHelpers.getJobs({
        employer_id: user?.id,
        status: 'open'
      });
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            title,
            employer:employers!employer_id_fkey(
              company_name
            )
          ),
          profile:profiles!profile_id_fkey(
            first_name,
            last_name,
            profile_photo_url
          )
        `)
        .eq('employer_id', profile.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load pipeline');
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

  const getStageCount = (stage) => {
    return applications.filter(app => app.status === stage).length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
        <Link
          to="/employer-dashboard"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Hiring Pipeline
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track candidates through your entire hiring process.
        </p>
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Pipeline Overview
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{getStageCount('applied')}</div>
              <div className="text-sm text-gray-500">Applied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{getStageCount('interviewed')}</div>
              <div className="text-sm text-gray-500">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{getStageCount('offer_extended')}</div>
              <div className="text-sm text-gray-500">Offers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getStageCount('hired')}</div>
              <div className="text-sm text-gray-500">Hired</div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            All Applications
          </h3>
          
          {applications.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {applications.map((application) => (
                  <li key={application.id} className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(application.status)}`}>
                          {React.createElement(
                            application.status === 'hired' ? CheckCircleIcon :
                            application.status === 'offer_extended' ? StarIcon :
                            application.status === 'interviewed' ? ClockIcon :
                            DocumentTextIcon,
                            {
                              className: "h-5 w-5",
                              "aria-hidden": "true"
                            }
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/job/${application.job_id}`}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600"
                            >
                              {application.job?.title}
                            </Link>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <UserGroupIcon className="h-4 w-4 mr-1" />
                                {application.profile?.first_name} {application.profile?.last_name}
                              </div>
                              <div className="flex items-center">
                                <BriefcaseIcon className="h-4 w-4 mr-1" />
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
                              View Details
                            </Link>
                          </div>
                        </div>
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
                No applications yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start posting jobs to see applications in your pipeline.
              </p>
              <div className="mt-6">
                <Link
                  to="/post-job"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  Post a Job
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Conversion Metrics
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.length > 0 ? Math.round((getStageCount('hired') / applications.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Application to Hire Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getStageCount('applied') > 0 ? Math.round((getStageCount('interviewed') / getStageCount('applied')) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Application to Interview Rate</div>
            </div>
          </div>
          
          {getStageCount('hired') > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h4 className="text-lg font-medium text-green-900">Great Progress!</h4>
                  <p className="text-sm text-green-700">
                    You've secured {getStageCount('hired')} candidate{getStageCount('hired') > 1 ? 's' : ''} through the platform.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HiringPipeline;
