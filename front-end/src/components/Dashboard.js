import React from 'react';
import HeroSection from './HeroSection';
import TopDestinations from './TopDestinations';
import UpcomingRides from './UpcomingRides';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <HeroSection />
      <TopDestinations />
      <UpcomingRides />
    </div>
  );
};

export default Dashboard;
