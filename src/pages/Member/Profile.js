import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { supabaseHelpers } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  UserIcon,
  PhotoIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const MemberProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [newSkill, setNewSkill] = useState({ skill_name: '', proficiency_level: 'beginner' });
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

  const currentStage = watch('current_stage');
  const remotePreference = watch('remote_preference');

  const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const stages = ['freshman', 'sophomore', 'junior', 'senior', 'alumni'];
  const remoteOptions = ['fully_remote', 'hybrid', 'on_site'];
  const jobTypes = ['internship', 'full_time', 'part_time', 'freelance', 'gig', 'volunteer'];
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Sales', 'Consulting', 'Engineering', 'Design', 'Media',
    'Non-profit', 'Government', 'Retail', 'Manufacturing', 'Other'
  ];

  useEffect(() => {
    if (profile) {
      // Set form values
      Object.keys(profile).forEach(key => {
        setValue(key, profile[key]);
      });
      
      // Load skills and preferences
      loadUserSkills();
      loadUserPreferences();
    }
  }, [profile, setValue]);

  const loadUserSkills = async () => {
    const { data, error } = await supabaseHelpers.getUserSkills(user.id);
    if (error) {
      console.error('Error loading skills:', error);
    } else {
      setSkills(data || []);
    }
  };

  const loadUserPreferences = async () => {
    const { data, error } = await supabaseHelpers.getUserPreferences(user.id);
    if (error) {
      console.error('Error loading preferences:', error);
    } else {
      setPreferences(data);
      if (data) {
        // Set preference form values
        Object.keys(data).forEach(key => {
          if (key !== 'profile_id' && key !== 'id') {
            setValue(key, data[key]);
          }
        });
      }
    }
  };

  const handleProfileSubmit = async (data) => {
    setLoading(true);
    
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (data) => {
    setLoading(true);
    
    try {
      await supabaseHelpers.updateUserPreferences(user.id, data);
      setPreferences(data);
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.skill_name.trim()) return;

    try {
      const { data, error } = await supabaseHelpers.addSkill({
        profile_id: user.id,
        skill_name: newSkill.skill_name,
        proficiency_level: newSkill.proficiency_level,
      });

      if (error) throw error;

      setSkills([...skills, data]);
      setNewSkill({ skill_name: '', proficiency_level: 'beginner' });
      toast.success('Skill added!');
    } catch (error) {
      toast.error(error.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      const { error } = await supabaseHelpers.removeSkill(skillId);
      if (error) throw error;

      setSkills(skills.filter(skill => skill.id !== skillId));
      toast.success('Skill removed!');
    } catch (error) {
      toast.error(error.message || 'Failed to remove skill');
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile_photo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      await updateProfile({ profile_photo_url: publicUrl });
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/resume.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      await updateProfile({ resume_url: publicUrl });
      toast.success('Resume uploaded!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Complete your profile to unlock job opportunities and get better matches.
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleProfileSubmit)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  {...register('first_name', { required: true })}
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
                  {...register('last_name', { required: true })}
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
                placeholder="e.g., Computer Science Student seeking Software Engineering Internship"
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
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="current_stage" className="block text-sm font-medium text-gray-700">
                  Academic Stage
                </label>
                <select
                  {...register('current_stage')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select stage...</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="graduation_date" className="block text-sm font-medium text-gray-700">
                  Graduation Date
                </label>
                <input
                  {...register('graduation_date')}
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  {...register('linkedin_url')}
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700">
                Portfolio URL
              </label>
              <input
                {...register('portfolio_url')}
                type="url"
                placeholder="https://yourportfolio.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                {...register('allow_employer_contact')}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="allow_employer_contact" className="ml-2 block text-sm text-gray-700">
                Allow employers to contact me directly
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Photo & Resume */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Documents</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Photo
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {profile?.profile_photo_url ? (
                    <img
                      className="h-16 w-16 object-cover rounded-full"
                      src={profile.profile_photo_url}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-400" />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Resume
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {profile?.resume_url ? (
                    <DocumentTextIcon className="h-16 w-16 text-gray-400" />
                  ) : (
                    <DocumentTextIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block">
                    <span className="sr-only">Choose resume</span>
                    <input
                      onChange={handleResumeUpload}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={uploading}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">PDF, DOC up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Skills</h3>
          <div className="mt-6">
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                value={newSkill.skill_name}
                onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                placeholder="Add a skill..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <select
                value={newSkill.proficiency_level}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency_level: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="relative flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{skill.skill_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{skill.proficiency_level}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Preferences */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Job Preferences</h3>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit(handlePreferencesSubmit)}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700">
                  Minimum Salary
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('salary_min')}
                    type="number"
                    placeholder="50000"
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700">
                  Maximum Salary
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('salary_max')}
                    type="number"
                    placeholder="100000"
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="remote_preference" className="block text-sm font-medium text-gray-700">
                Work Preference
              </label>
              <select
                {...register('remote_preference')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select preference...</option>
                {remoteOptions.map(option => (
                  <option key={option} value={option}>
                    {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Types Interested
              </label>
              <div className="space-y-2">
                {jobTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      {...register('job_types_interested')}
                      type="checkbox"
                      value={type}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industries Interested
              </label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map(industry => (
                  <label key={industry} className="flex items-center">
                    <input
                      {...register('industries_interested')}
                      type="checkbox"
                      value={industry}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('willing_to_relocate')}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="willing_to_relocate" className="ml-2 block text-sm text-gray-700">
                Willing to relocate for the right opportunity
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
