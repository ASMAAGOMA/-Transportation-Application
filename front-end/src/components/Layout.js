import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar className="hidden sm:block sm:w-1/4 lg:w-1/5" /> {/* Sidebar hidden on small screens */}
      <main className="flex-1 ml-0 sm:ml-20 lg:ml-24">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
