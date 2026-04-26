import React, { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Help = () => {
  const [activeTab, setActiveTab] = useState('getting-started');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpenIcon,
      articles: [
        {
          title: 'How to Create Your Profile',
          content: 'Learn how to set up your member, employer, or mentor profile with all the essential information.',
          videoUrl: '#',
        },
        {
          title: 'Understanding the Matching Algorithm',
          content: 'Discover how our AI-powered matching system connects you with the perfect opportunities.',
          videoUrl: '#',
        },
        {
          title: 'Job Search Best Practices',
          content: 'Tips and tricks for finding and applying to jobs that match your skills and interests.',
          videoUrl: '#',
        },
      ],
    },
    {
      id: 'for-members',
      title: 'For Members',
      icon: UserGroupIcon,
      articles: [
        {
          title: 'Building Your Resume',
          content: 'Step-by-step guide to creating a professional resume that stands out.',
          videoUrl: '#',
        },
        {
          title: 'Interview Preparation',
          content: 'Common interview questions and how to prepare for technical and behavioral interviews.',
          videoUrl: '#',
        },
        {
          title: 'Career Development',
          content: 'How to leverage the platform for long-term career growth.',
          videoUrl: '#',
        },
      ],
    },
    {
      id: 'for-employers',
      title: 'For Employers',
      icon: AcademicCapIcon,
      articles: [
        {
          title: 'Writing Effective Job Descriptions',
          content: 'Best practices for creating job postings that attract qualified candidates.',
          videoUrl: '#',
        },
        {
          title: 'Candidate Evaluation',
          content: 'How to assess and select the best candidates for your open positions.',
          videoUrl: '#',
        },
        {
          title: 'Onboarding New Hires',
          content: 'Smooth transition process for bringing new team members on board.',
          videoUrl: '#',
        },
      ],
    },
    {
      id: 'for-mentors',
      title: 'For Mentors',
      icon: ChatBubbleLeftRightIcon,
      articles: [
        {
          title: 'Effective Mentoring Techniques',
          content: 'Strategies for providing valuable guidance and support to mentees.',
          videoUrl: '#',
        },
        {
          title: 'Building Mentee Relationships',
          content: 'How to establish trust and rapport with your mentees.',
          videoUrl: '#',
        },
        {
          title: 'Measuring Mentorship Success',
          content: 'Key metrics and indicators for tracking mentorship effectiveness.',
          videoUrl: '#',
        },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: DocumentTextIcon,
      articles: [
        {
          title: 'Common Technical Issues',
          content: 'Solutions for frequently encountered technical problems.',
          videoUrl: '#',
        },
        {
          title: 'Account and Login Issues',
          content: 'How to resolve problems accessing your account or logging in.',
          videoUrl: '#',
        },
        {
          title: 'Contact Support',
          content: 'How to reach our support team for additional help.',
          videoUrl: '#',
        },
      ],
    },
  ];

  const activeCategory = helpCategories.find(cat => cat.id === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Help & Support
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Find answers to common questions and learn how to make the most of the platform.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {helpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`${
                  activeTab === category.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {React.createElement(category.icon, {
                  className: "h-5 w-5 mr-2 inline-block",
                  "aria-hidden": "true"
                })}
                {category.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeCategory && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Articles List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {activeCategory.title}
                  </h3>
                  <div className="space-y-6">
                    {activeCategory.articles.map((article, index) => (
                      <div key={index} className="border-l-4 border-gray-200 pl-4">
                        <h4 className="text-base font-medium text-gray-900 mb-2">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {article.content}
                        </p>
                        {article.videoUrl && article.videoUrl !== '#' && (
                          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Watch Video
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <h4 className="text-lg font-medium text-blue-900">Need More Help?</h4>
                          <p className="text-sm text-blue-700">
                            Our support team is here to assist you with any questions or issues.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <h4 className="text-lg font-medium text-green-900">Browse Documentation</h4>
                          <p className="text-sm text-green-700">
                            Comprehensive guides and tutorials for all platform features.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600 mr-3" />
                        <div>
                          <h4 className="text-lg font-medium text-purple-900">Community Forum</h4>
                          <p className="text-sm text-purple-700">
                            Connect with other fraternity members and share experiences.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Contact Support
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Email Support</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Get help via email for detailed questions and technical support.
                </p>
                <div className="mt-2">
                  <a
                    href="mailto:support@nupesatwork.com"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    support@nupesatwork.com
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Live Chat</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Chat with our support team during business hours for immediate assistance.
                </p>
                <div className="mt-2">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <QuestionMarkCircleIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h4 className="text-lg font-medium text-yellow-900">Response Time</h4>
                  <p className="text-sm text-yellow-700">
                    We typically respond to support inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
