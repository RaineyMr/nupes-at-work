import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const CareerProgress = () => {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCareerProgress();
  }, []);

  const loadCareerProgress = async () => {
    try {
      // Load user's career journey records
      const { data: journey } = await supabase.getCareerJourney(user.id);
      
      // Load skill development records
      const { data: skillDevelopment } = await supabase.getSkillDevelopment(user.id);
      
      // Load analytics events
      const { data: analytics } = await supabase.getAnalyticsEvents(user.id);

      setProgress({
        journey: journey || [],
        skillDevelopment: skillDevelopment || [],
        analytics: analytics || [],
      });
    } catch (error) {
      console.error('Error loading career progress:', error);
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Career Progress
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your skills development and career milestones.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Your Progress Overview
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {progress?.skillDevelopment?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Skills Developed</div>
            </div>
            <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>{progress?.journey?.length || 0}</div>
              <div className="text-sm text-gray-500">Milestones Reached</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {progress?.analytics?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Activities Tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Milestones */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Recent Milestones
          </h3>
          {progress?.journey?.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {progress.journey.slice(0, 5).map((milestone) => (
                  <li key={milestone.id} className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <AcademicCapIcon className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {milestone.milestone}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(milestone.milestone_date).toLocaleDateString()}
                          </p>
                        </div>
                        {milestone.details && (
                          <p className="mt-2 text-sm text-gray-600">
                            {milestone.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No milestones yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start applying to jobs and building your profile to track your progress.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Skills Development */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Skills Development
          </h3>
          {progress?.skillDevelopment?.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {progress.skillDevelopment.slice(0, 5).map((skill) => (
                  <li key={skill.id} className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <TrendingUpIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {skill.skill_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {skill.proficiency_previous} → {skill.proficiency_current}
                          </p>
                        </div>
                        {skill.evidence && (
                          <p className="mt-2 text-sm text-gray-600">
                            <strong>Evidence:</strong> {skill.evidence}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No skill development tracked yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add skills to your profile and get endorsements to track your growth.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerProgress;
