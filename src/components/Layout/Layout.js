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
    <div className="min-h-screen bg-paper">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-fog bg-cream">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-fog">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-crimson flex items-center justify-center">
                <span className="text-on-crimson font-bold text-sm font-display">NW</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-crimson font-display">Nupes at Work</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'bg-crimson text-on-crimson'
                      : 'text-charcoal hover:bg-fog'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-sm`}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-on-crimson' : 'text-steel group-hover:text-charcoal'
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
                  className="text-charcoal hover:bg-fog group flex items-center px-3 py-2 text-sm font-medium rounded-sm"
                >
                  <item.icon
                    className="text-steel group-hover:text-charcoal mr-3 h-5 w-5"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User menu */}
            <div className="flex-shrink-0 border-t border-fog p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gold flex items-center justify-center text-crimson font-semibold">
                  {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-charcoal">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs font-medium text-steel capitalize">
                    {profile?.role}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-3 py-2 text-sm font-medium text-charcoal rounded-sm hover:bg-fog"
                  >
                    <item.icon className="text-steel group-hover:text-charcoal mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={signOut}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-charcoal rounded-sm hover:bg-fog w-full text-left"
                >
                  <ArrowRightOnRectangleIcon className="text-steel group-hover:text-charcoal mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:pl-60">
        {/* Mobile header */}
        <div className="nupes-topnav md:hidden">
          <div className="flex flex-1 justify-between px-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-crimson flex items-center justify-center">
                <span className="text-on-crimson font-bold text-sm font-display">NW</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-on-crimson font-display">Nupes at Work</span>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gold flex items-center justify-center text-crimson font-semibold">
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
