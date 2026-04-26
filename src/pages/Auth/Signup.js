import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          }
        }
      });

      if (authError) throw authError;

      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          created_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      setUser(authData.user);
      toast.success('Account created successfully!');
      
      // Navigate to role-specific profile creation
      switch (data.role) {
        case 'member':
          navigate('/profile');
          break;
        case 'employer':
          navigate('/employer-profile');
          break;
        case 'mentor':
          navigate('/mentor-profile');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'member', label: 'Member', icon: UserIcon, description: 'Looking for jobs and career opportunities' },
    { value: 'employer', label: 'Employer', icon: BuildingOfficeIcon, description: 'Hiring fraternity members' },
    { value: 'mentor', label: 'Mentor', icon: AcademicCapIcon, description: 'Guiding members in their careers' },
  ];

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Create your account
      </h2>
      
      <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
              First Name
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                {...register('first_name', {
                  required: 'First name is required',
                })}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="First name"
              />
            </div>
            {errors.first_name && (
              <p className="mt-2 text-sm text-red-600">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
              Last Name
            </label>
            <input
              {...register('last_name', {
                required: 'Last name is required',
              })}
              type="text"
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Last name"
            />
            {errors.last_name && (
              <p className="mt-2 text-sm text-red-600">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email address
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                type="password"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Create password"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match',
                })}
                type="password"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Confirm password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-4">
            I am a...
          </label>
          <div className="space-y-3">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className="relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50 focus:outline-none"
              >
                <input
                  type="radio"
                  {...register('role', { required: 'Please select a role' })}
                  value={option.value}
                  className="sr-only"
                />
                <div className="flex w-full">
                  <div className="flex items-center">
                    <option.icon className="h-5 w-5 text-gray-400" />
                    <div className="ml-3 text-sm">
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-gray-500">{option.description}</p>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.role && (
            <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
