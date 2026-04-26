import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-md bg-crimson flex items-center justify-center">
            <span className="text-on-crimson font-bold text-lg font-display">NW</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-crimson font-display">
          Nupes at Work
        </h2>
        <p className="mt-2 text-center text-sm text-charcoal">
          Fraternity Job Board & Career Platform
        </p>
        
        {/* Auth form */}
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
