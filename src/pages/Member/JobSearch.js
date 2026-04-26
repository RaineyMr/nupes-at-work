import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  StarIcon,
  HeartIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const JobSearch = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    job_type: '',
    industry: '',
    location: '',
    salary_min: '',
    salary_max: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const jobTypes = ['internship', 'full_time', 'part_time', 'freelance', 'gig', 'volunteer'];
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Sales', 'Consulting', 'Engineering', 'Design', 'Media',
    'Non-profit', 'Government', 'Retail', 'Manufacturing', 'Other'
  ];

  useEffect(() => {
    loadJobs();
    loadSavedJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseHelpers.getJobs(filters);
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    // Load user's saved jobs from local storage or database
    const saved = localStorage.getItem(`saved_jobs_${user.id}`);
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadJobs();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      job_type: '',
      industry: '',
      location: '',
      salary_min: '',
      salary_max: '',
    });
    setTimeout(loadJobs, 100);
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
      toast.success('Job removed from saved');
    } else {
      newSavedJobs.add(jobId);
      toast.success('Job saved!');
    }
    setSavedJobs(newSavedJobs);
    localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify([...newSavedJobs]));
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.employer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Job Opportunities
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Find opportunities that match your skills and career goals.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search jobs, companies, or keywords..."
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Jobs</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      value={filters.job_type}
                      onChange={(e) => handleFilterChange('job_type', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">All Types</option>
                      {jobTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      value={filters.industry}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">All Industries</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="City, State, or Remote"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Salary
                    </label>
                    <input
                      type="number"
                      value={filters.salary_min}
                      onChange={(e) => handleFilterChange('salary_min', e.target.value)}
                      placeholder="50000"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Salary
                    </label>
                    <input
                      type="number"
                      value={filters.salary_max}
                      onChange={(e) => handleFilterChange('salary_max', e.target.value)}
                      placeholder="150000"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-end space-x-2">
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Apply Filters
                    </button>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {filteredJobs.length} Jobs Found
            </h3>
            <div className="text-sm text-gray-500">
              {searchTerm && `Searching for "${searchTerm}"`}
            </div>
          </div>
          
          {filteredJobs.length > 0 ? (
            <div className="mt-6 flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <li key={job.id} className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {job.employer?.logo_url ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={job.employer.logo_url}
                            alt={job.employer.company_name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/jobs/${job.id}`}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600"
                            >
                              {job.title}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {job.employer?.company_name}
                            </p>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <BriefcaseIcon className="h-4 w-4 mr-1" />
                                {job.job_type.replace('_', ' ')}
                              </div>
                              {job.salary_min && (
                                <div className="flex items-center">
                                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                  {job.salary_min.toLocaleString()}
                                  {job.salary_max && ` - ${job.salary_max.toLocaleString()}`}
                                </div>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {job.required_skills?.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.required_skills?.length > 3 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{job.required_skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <button
                              onClick={() => toggleSaveJob(job.id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              {savedJobs.has(job.id) ? (
                                <HeartIconSolid className="h-5 w-5 text-red-500" />
                              ) : (
                                <HeartIcon className="h-5 w-5" />
                              )}
                            </button>
                            
                            <div className="text-xs text-gray-500">
                              <ClockIcon className="h-3 w-3 inline mr-1" />
                              {formatDate(job.posted_at)}
                            </div>
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
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No jobs found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters to find more opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
