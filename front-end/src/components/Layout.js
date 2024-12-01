import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import TopDestinations from './TopDestinations';
import UpcomingRides from './UpcomingRides';
import Sidebar from './Sidebar';
const Layout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 ml-20">
      <Header />
      <HeroSection />
      <TopDestinations />
      <UpcomingRides />
    </main>
  </div>
);

export default Layout;