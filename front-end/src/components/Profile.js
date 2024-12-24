import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import '../App.css';

const Profile = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-4xl text-indigo-600">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-grow space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900 font-medium">{user?.name || 'Not set'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{user?.email || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Created
                </label>
                <p className="text-gray-900">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <p className="text-gray-900">
                  {new Date().toLocaleDateString()} {/* Replace with actual last login date */}
                </p>
              </div>
            </div>

            {/* Security Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
              <div className="space-y-4">
                <button className="text-indigo-600 hover:text-indigo-700 transition-colors">
                  Change Password
                </button>
                <div className="block">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700">Two-factor authentication</span>
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      Not enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    id="emailNotifications"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                    Receive email notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                    id="marketingEmails"
                  />
                  <label htmlFor="marketingEmails" className="ml-2 text-sm text-gray-700">
                    Receive marketing emails
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
