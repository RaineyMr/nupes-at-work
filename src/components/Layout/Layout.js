import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: location.pathname === '/dashboard' },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon, current: location.pathname.startsWith('/jobs') },
    { name: 'Applications', href: '/applications', icon: UserGroupIcon, current: location.pathname === '/applications' },
    { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon, current: location.pathname === '/messages' },
  ];

  const secondaryNavigation = [
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const getRoleBasedNav = () => {
    if (!profile) return [];

    switch (profile.role) {
      case 'member':
        return [
          { name: 'Career Progress', href: '/career-progress', icon: AcademicCapIcon },
        ];
      case 'employer':
        return [
          { name: 'Post Job', href: '/post-job', icon: PlusCircleIcon },
          { name: 'Candidates', href: '/pipeline', icon: UserGroupIcon },
          { name: 'Company Profile', href: '/employer-profile', icon: BuildingOfficeIcon },
        ];
      case 'mentor':
        return [
          { name: 'Mentees', href: '/mentor-dashboard', icon: AcademicCapIcon },
          { name: 'Mentor Profile', href: '/mentor-profile', icon: UserCircleIcon },
        ];
      case 'admin':
        return [
          { name: 'User Management', href: '/admin/users', icon: ShieldCheckIcon },
          { name: 'Job Moderation', href: '/admin/jobs', icon: BriefcaseIcon },
          { name: 'Mentor Matching', href: '/admin/mentor-matching', icon: UserGroupIcon },
        ];
      default:
        return [];
    }
  };

  const roleBasedNav = getRoleBasedNav();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NW</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Nupes at Work</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium border-l-4 rounded-md`}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}

              {/* Role-based navigation */}
              {roleBasedNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium border-l-4 rounded-md"
                >
                  <item.icon
                    className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User menu */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 capitalize">
                    {profile?.role}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={signOut}
                  className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 w-full text-left"
                >
                  <ArrowRightOnRectangleIcon className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200 md:hidden">
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NW</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Nupes at Work</span>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
