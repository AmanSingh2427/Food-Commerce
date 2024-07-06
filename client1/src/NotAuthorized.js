import React from 'react';

const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Forbidden</h1>
        <p className="text-lg text-gray-700">You do not have permission to access this page.</p>
        <p className="text-gray-600 mt-2">Please contact your administrator if you believe this is an error.</p>
      </div>
    </div>
  );
};

export default NotAuthorized;
