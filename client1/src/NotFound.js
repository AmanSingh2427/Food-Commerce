// NotFound.jsx
import React from 'react';


const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-700">The page you are looking for does not exist.</p>
        <p className="text-gray-600 mt-2">Please check the URL or return to the home page.</p>
      </div>
    </div>
  );
};

export default NotFound;
