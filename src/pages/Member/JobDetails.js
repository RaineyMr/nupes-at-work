import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const { data, error } = await supabaseHelpers.getJob(id);
      if (error) throw error;
      setJob(data);
      
      // Check if job is saved
      const savedJobs = JSON.parse(localStorage.getItem(`saved_jobs_${user.id}`) || '[]');
      setSaved(savedJobs.includes(id));
    } catch (error) {
      toast.error(error.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please sign in to apply');
      return;
    }

    setApplying(true);
    
    try {
      const applicationData = {
        job_id: id,
        profile_id: user.id,
        employer_id: job.employer_id,
        application_type: 'direct_apply',
        cover_note: '',
      };

      const { data, error } = await supabaseHelpers.createApplication(applicationData);
      
      if (error) throw error;

      toast.success('Application submitted successfully!');
      
      // Update match status
      await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/calculate-matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ profile_id: user.id }),
      });
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const toggleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem(`saved_jobs_${user.id}`) || '[]');
    
    if (saved) {
      // Remove from saved
      const newSavedJobs = savedJobs.filter(jobId => jobId !== id);
      localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(newSavedJobs));
      setSaved(false);
      toast.success('Job removed from saved');
    } else {
      // Add to saved
      savedJobs.push(id);
      localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(savedJobs));
      setSaved(true);
      toast.success('Job saved!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
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

  if (!job) {
    return (
      <div className="text-center py-12">
        <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Job not found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          This job may have been removed or is no longer available.
        </p>
        <div className="mt-6">
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/jobs"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSaveJob}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            {saved ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Company Header */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="shrink-0">
              {job.employer?.logo_url ? (
                <img
                  className="h-16 w-16 rounded-lg object-cover"
                  src={job.employer.logo_url}
                  alt={job.employer.company_name}
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {job.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  {job.employer?.company_name}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Posted {formatDate(job.posted_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Job Description</h3>
                <div className="mt-2 prose prose-sm text-gray-600">
                  {job.description ? (
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                  ) : (
                    <p>No description provided</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Experience Level</h4>
                    <p className="mt-1 text-sm text-gray-600 capitalize">
                      {job.experience_level} level
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Job Type</h4>
                    <p className="mt-1 text-sm text-gray-600 capitalize">
                      {job.job_type.replace('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Industry</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {job.industry}
                    </p>
                  </div>

                  {job.deadline && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Application Deadline</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatDate(job.deadline)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Compensation</h3>
                <div className="mt-2 space-y-2">
                  {job.salary_min && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {job.salary_min.toLocaleString()}
                      {job.salary_max && ` - ${job.salary_max.toLocaleString()}`}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Skills Required</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.required_skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.preferred_skills && job.preferred_skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Preferred Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.preferred_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleApply}
            disabled={applying}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-lg font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
