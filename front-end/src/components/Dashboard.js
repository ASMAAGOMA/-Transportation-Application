import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from './HeroSection';
import TopDestinations from './TopDestinations';
import UpcomingRides from './UpcomingRides';

const Dashboard = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById('upcoming-rides');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          console.warn("Element with id 'upcoming-rides' not found.");
        }
      }, 200);
  
      return () => clearTimeout(timeoutId);
    }
  }, [location]);  

  return (
    <div className="dashboard">
      <HeroSection />
      <TopDestinations />
      <UpcomingRides />
    </div>
  );
};

export default Dashboard;
