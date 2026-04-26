import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const MentorProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expertiseAreas, setExpertiseAreas] = useState([]);
  const [newExpertise, setNewExpertise] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: profile || {},
  });

  const expertiseOptions = [
    'career_planning',
    'skill_development',
    'interview_prep',
    'resume_review',
    'networking',
    'industry_insights',
    'leadership',
    'work_life_balance',
    'entrepreneurship',
    'technical_skills'
  ];

  useEffect(() => {
    if (profile) {
      // Set form values from existing profile
      Object.keys(profile).forEach(key => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          setValue(key, profile[key]);
        }
      });
      
      // Load expertise areas
      if (profile.expertise_areas) {
        setExpertiseAreas(profile.expertise_areas);
      }
    }
  }, [profile, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      await updateProfile({
        ...data,
        expertise_areas: expertiseAreas,
      });
      toast.success('Mentor profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addExpertiseArea = () => {
    if (newExpertise.trim() && !expertiseAreas.includes(newExpertise.trim())) {
      setExpertiseAreas([...expertiseAreas, newExpertise.trim()]);
      setNewExpertise('');
      toast.success('Expertise area added!');
    }
  };

  const removeExpertiseArea = (areaToRemove) => {
    setExpertiseAreas(expertiseAreas.filter(area => area !== areaToRemove));
    toast.success('Expertise area removed!');
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/mentor_photo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('mentor-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mentor-photos')
        .getPublicUrl(fileName);

      await updateProfile({ profile_photo_url: publicUrl });
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Mentor Profile
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Complete your mentor profile to help guide fraternity members.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Profile Photo */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Photo
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {profile?.profile_photo_url ? (
                    <img
                      className="h-20 w-20 object-cover rounded-full"
                      src={profile.profile_photo_url}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <AcademicCapIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      onChange={handlePhotoUpload}
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={uploading}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register('first_name', { required: 'First name is required' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register('last_name', { required: 'Last name is required' })}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                Professional Headline
              </label>
              <input
                {...register('headline')}
                type="text"
                placeholder="e.g., Senior Software Engineer at Tech Company"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                placeholder="Share your background, expertise, and mentoring philosophy..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="current_role" className="block text-sm font-medium text-gray-700">
                  Current Role
                </label>
                <input
                  {...register('current_role')}
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  {...register('company')}
                  type="text"
                  placeholder="e.g., Tech Company Inc."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                {...register('years_experience', { valueAsNumber: true })}
                type="number"
                placeholder="e.g., 10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  {...register('linkedin_url', {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.linkedin_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedin_url.message}</p>
                )}
              </div>
            </div>

            {/* Expertise Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Areas of Expertise
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Add an expertise area..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={addExpertiseArea}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {expertiseAreas.map((area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => removeExpertiseArea(area)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mentoring Preferences */}
            <div>
              <label htmlFor="mentoring_style" className="block text-sm font-medium text-gray-700">
                Mentoring Style
              </label>
              <select
                {...register('mentoring_style')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select mentoring style...</option>
                <option value="one_on_one">One-on-One</option>
                <option value="group">Group Sessions</option>
                <option value="hybrid">Hybrid</option>
                <option value="asynchronous">Asynchronous</option>
              </select>
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <textarea
                {...register('availability')}
                rows={2}
                placeholder="Describe your availability for mentoring sessions..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
};

export default MentorProfile;
