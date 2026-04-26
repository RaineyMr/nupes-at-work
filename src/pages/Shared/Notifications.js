import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Mock notifications data - in production this would come from database
      const mockNotifications = [
        {
          id: '1',
          type: 'job_match',
          title: 'New Job Match',
          message: 'You have 3 new job matches based on your profile',
          created_at: '2024-03-20T10:00:00Z',
          read: false,
        },
        {
          id: '2',
          type: 'application_update',
          title: 'Application Status Update',
          message: 'Your application for Software Engineer has been viewed',
          created_at: '2024-03-19T14:30:00Z',
          read: true,
        },
        {
          id: '3',
          type: 'mentorship_request',
          title: 'Mentorship Request',
          message: 'Dr. Sarah Johnson has requested to be your mentor',
          created_at: '2024-03-18T09:15:00Z',
          read: false,
        },
        {
          id: '4',
          type: 'system_update',
          title: 'Platform Update',
          message: 'New features have been added to the job search',
          created_at: '2024-03-17T16:45:00Z',
          read: true,
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job_match':
        return CheckCircleIcon;
      case 'application_update':
        return BellIcon;
      case 'mentorship_request':
        return ExclamationTriangleIcon;
      case 'system_update':
        return ClockIcon;
      default:
        return BellIcon;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'job_match':
        return 'text-green-600 bg-green-100';
      case 'application_update':
        return 'text-blue-600 bg-blue-100';
      case 'mentorship_request':
        return 'text-yellow-600 bg-yellow-100';
      case 'system_update':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = async (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

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
          Notifications
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Stay updated with your job matches, applications, and platform updates.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Notifications' },
                { key: 'unread', label: 'Unread' },
                { key: 'job_match', label: 'Job Matches' },
                { key: 'application_update', label: 'Applications' },
                { key: 'mentorship_request', label: 'Mentorship' },
                { key: 'system_update', label: 'System Updates' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {filter === 'all' ? 'All Notifications' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
          </h3>
          
          {filteredNotifications.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <li key={notification.id} className="py-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          {React.createElement(getTypeIcon(notification.type), {
                            className: "h-5 w-5",
                            "aria-hidden": "true"
                          })}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {formatDate(notification.created_at)}
                              </div>
                              {!notification.read && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-500 text-sm"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' ? 'You have no notifications yet.' : `No ${filter} notifications.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Email Notifications</div>
                  <div className="text-sm text-gray-500">Receive updates via email</div>
                </div>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                <span className="sr-only">Toggle email notifications</span>
                <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out pointer-events-none"></span>
                <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-blue-600 transition duration-200 ease-in-out"></span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Push Notifications</div>
                  <div className="text-sm text-gray-500">Browser push notifications</div>
                </div>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                <span className="sr-only">Toggle push notifications</span>
                <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out pointer-events-none"></span>
                <span className="translate-x-0 inline-block h-5 w-5 rounded-full bg-blue-600 transition duration-200 ease-in-out"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
