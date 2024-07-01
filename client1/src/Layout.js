import React from 'react';
import Dashboard from './components/Dashboard';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className='w-64'>
        <Dashboard />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Layout;
