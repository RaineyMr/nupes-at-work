import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  UserGroupIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ViewCandidates = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);

  useEffect(() => {
    loadJob();
    loadCandidates();
  }, [id]);

  const loadJob = async () => {
    try {
      const { data, error } = await supabaseHelpers.getJob(id);
      if (error) throw error;
      setJob(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load job details');
    }
  };

  const loadCandidates = async () => {
    try {
      const { data, error } = await supabaseHelpers.getJobMatches(id);
      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
          Candidates for {job?.title}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Top 10 matched candidates based on skills, interests, and preferences.
        </p>
      </div>

      {/* Job Details */}
      {job && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Job Details</h3>
                <dl className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Company</dt>
                    <dd className="text-sm text-gray-900">{job.employer?.company_name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm text-gray-900">{job.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{job.job_type?.replace('_', ' ')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                    <dd className="text-sm text-gray-900 capitalize">{job.experience_level}</dd>
                  </div>
                  {job.salary_min && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Salary Range</dt>
                      <dd className="text-sm text-gray-900">
                        ${job.salary_min.toLocaleString()}
                        {job.salary_max && ` - ${job.salary_max.toLocaleString()}`}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Required Skills</h3>
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
            </div>
          </div>
        </div>
      )}

      {/* Candidates List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Matched Candidates ({candidates.length})
          </h3>
          
          {candidates.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <li key={candidate.id} className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {candidate.profile?.profile_photo_url ? (
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={candidate.profile.profile_photo_url}
                            alt={candidate.profile.first_name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/member/${candidate.profile_id}`}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600"
                            >
                              {candidate.profile.first_name} {candidate.profile.last_name}
                            </Link>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <AcademicCapIcon className="h-4 w-4 mr-1" />
                                {candidate.profile.current_stage}
                              </div>
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {candidate.profile.headline}
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                Graduates {new Date(candidate.profile.graduation_date).getFullYear()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(candidate.match_score)}`}>
                              <StarIconSolid className="h-4 w-4 mr-1" />
                              {candidate.match_score}% Match
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Skills Match</h4>
                            <div className="text-2xl font-bold text-gray-900">
                              {candidate.skills_score}%
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Interests Match</h4>
                            <div className="text-2xl font-bold text-gray-900">
                              {candidate.interests_score}%
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Location Match</h4>
                            <div className="text-2xl font-bold text-gray-900">
                              {candidate.location_score}%
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Salary Match</h4>
                            <div className="text-2xl font-bold text-gray-900">
                              {candidate.salary_score}%
                            </div>
                          </div>
                        </div>

                        {candidate.match_reason && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Match Details</h4>
                            <p className="text-sm text-gray-600">
                              {candidate.match_reason}
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
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No candidates found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No candidates have been matched to this job yet. Check back later as more members join the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCandidates;
