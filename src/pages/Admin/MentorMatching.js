import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  UserGroupIcon,
  HeartIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const MentorMatching = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      // Mock mentor-mentee matches - in production this would come from database
      const mockMatches = [
        {
          id: '1',
          mentor_name: 'Dr. Sarah Johnson',
          mentor_title: 'Senior Software Engineer at Tech Corp',
          mentee_name: 'Michael Chen',
          mentee_stage: 'junior',
          match_score: 92,
          match_reason: 'Strong industry alignment, complementary skills, similar career paths',
          created_at: '2024-03-15T10:00:00Z',
          status: 'active',
        },
        {
          id: '2',
          mentor_name: 'Prof. Robert Williams',
          mentor_title: 'Marketing Director at Brand Co',
          mentee_name: 'Emily Rodriguez',
          mentee_stage: 'sophomore',
          match_score: 88,
          match_reason: 'Marketing expertise matches career interests, strong communication skills',
          created_at: '2024-03-14T14:30:00Z',
          status: 'active',
        },
        {
          id: '3',
          mentor_name: 'Ms. Jennifer Davis',
          mentor_title: 'Product Manager at Startup Inc',
          mentee_name: 'David Kim',
          mentee_stage: 'senior',
          match_score: 85,
          match_reason: 'Product management experience, technical background, leadership skills',
          created_at: '2024-03-13T09:15:00Z',
          status: 'completed',
        },
      ];
      
      setMatches(mockMatches);
    } catch (error) {
      console.error('Error loading mentor matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match =>
    match.mentor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.mentee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.match_reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Mentor Matching
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Review and manage mentor-mentee pairings.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search matches..."
              className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Mentor-Mentee Matches ({filteredMatches.length})
          </h3>
          
          {filteredMatches.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-gray-300 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matched
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMatches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {match.mentor_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {match.mentor_title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserGroupIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {match.mentee_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {match.mentee_stage}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getScoreColor(match.match_score)}`}>
                            <span className="text-sm font-bold">
                              {match.match_score}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                          {match.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(match.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-500 text-sm">
                            View Details
                          </button>
                          <button className="text-red-600 hover:text-red-500 text-sm">
                            Remove Match
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No matches found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or check back later as new matches are made.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Match Details */}
      {filteredMatches.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Match Details
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Why This Match Works</h4>
                <p className="text-sm text-gray-600">
                  Our AI-powered matching algorithm analyzes skills, interests, career goals, and personality traits to create optimal mentor-mentee pairings. Each match includes a detailed explanation of why the pairing is likely to be successful.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredMatches.filter(m => m.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-500">Active Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredMatches.filter(m => m.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(filteredMatches.reduce((sum, m) => sum + m.match_score, 0) / filteredMatches.length)}
                  </div>
                  <div className="text-sm text-gray-500">Avg. Match Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorMatching;
