import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="pt-20 pb-10 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Smart Waste Management System
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Welcome to our smart waste management platform. Please select how you would like to proceed.
        </p>
      </div>

      {/* Options Cards */}
      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New User Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">New User</h3>
            <p className="text-gray-600 mb-4">
              First time here? Create a new account to get started.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
              Register
            </button>
          </div>
        </div>

        {/* Existing User Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Existing User</h3>
            <p className="text-gray-600 mb-4">
              Already have an account? Sign in to continue.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Admin Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Administrator</h3>
            <p className="text-gray-600 mb-4">
              Admin access only. Please login with your credentials.
            </p>
            <button
              onClick={() => navigate('/admin-login')}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-10 pb-8">
        <p className="text-gray-600">
          Need help? Contact our support team
        </p>
      </div>
    </div>
  );
};

export default AuthOptions;