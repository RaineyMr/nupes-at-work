import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  TrendingUpIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const MenteeManagement = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusAreas, setFocusAreas] = useState([]);
  const [newFocusArea, setNewFocusArea] = useState('');
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState('');

  useEffect(() => {
    loadMentee();
  }, [id]);

  const loadMentee = async () => {
    try {
      // Load mentee profile
      const { data: profile } = await supabaseHelpers.getProfile(id);
      if (profile) setMentee(profile);
      
      // Load mentorship data
      const { data: mentorship } = await supabase
        .from('mentorships')
        .select('*')
        .eq('mentor_id', user.id)
        .eq('mentee_id', id)
        .single();

      if (mentorship) {
        setFocusAreas(mentorship.focus_areas || []);
        setNotes(mentorship.notes || '');
        setProgress(mentorship.status);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load mentee data');
    } finally {
      setLoading(false);
    }
  };

  const updateMentorship = async (updates) => {
    try {
      const { error } = await supabase
        .from('mentorships')
        .update(updates)
        .eq('mentor_id', user.id)
        .eq('mentee_id', id);

      if (error) throw error;
      toast.success('Mentorship updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update mentorship');
    }
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && !focusAreas.includes(newFocusArea.trim())) {
      setFocusAreas([...focusAreas, newFocusArea.trim()]);
      setNewFocusArea('');
      toast.success('Focus area added!');
    }
  };

  const removeFocusArea = (areaToRemove) => {
    setFocusAreas(focusAreas.filter(area => area !== areaToRemove));
    toast.success('Focus area removed!');
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
          Mentee Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Guide and support your mentee in their career development.
        </p>
      </div>

      {mentee ? (
        <>
          {/* Mentee Profile */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Mentee Profile
              </h3>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  {mentee.profile_photo_url ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={mentee.profile_photo_url}
                      alt={mentee.first_name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <UserGroupIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {mentee.first_name} {mentee.last_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {mentee.headline}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {mentee.current_stage}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Graduates {new Date(mentee.graduation_date).getFullYear()}
                      </div>
                    </div>
                  </div>
                  {mentee.bio && (
                    <p className="mt-2 text-sm text-gray-600">
                      {mentee.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mentorship Management */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Mentorship Management
              </h3>
              
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mentorship Status
                  </label>
                  <select
                    value={progress}
                    onChange={(e) => {
                      setProgress(e.target.value);
                      updateMentorship({ status: e.target.value });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                {/* Focus Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Focus Areas
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newFocusArea}
                        onChange={(e) => setNewFocusArea(e.target.value)}
                        placeholder="Add a focus area..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={addFocusArea}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                    <div className="flex flex-wrap gap-2">
                      {focusAreas.map((area, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => removeFocusArea(area)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Mentorship Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about mentee progress, goals, and achievements..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="mt-2">
                    <button
                      onClick={() => updateMentorship({ notes })}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Progress Tracking
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Mentorship Started</h4>
                    <p className="text-sm text-gray-600">
                      {mentee.matched_at ? formatDate(mentee.matched_at) : 'Not started yet'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Last Activity</h4>
                    <p className="text-sm text-gray-600">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUpIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="text-lg font-medium text-blue-900">Keep up the great work!</h4>
                      <p className="text-sm text-blue-700">
                        Your guidance is helping shape the future of fraternity members.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Mentee not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This mentee may not exist or you may not have access to their profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default MenteeManagement;
