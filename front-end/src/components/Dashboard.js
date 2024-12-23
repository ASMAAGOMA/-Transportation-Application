import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from './HeroSection';
import TopDestinations from './TopDestinations';
import UpcomingRides from './UpcomingRides';
import SearchResults from './SearchResults';
import SearchForm from './SearchForm';

const Dashboard = () => {
  const [searchCriteria, setSearchCriteria] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard container with responsive padding */}
      <div className="dashboard w-full">
        {/* Hero section with full width and responsive height */}
        <div className="relative w-full">
          <HeroSection>
            {/* Search form container with responsive positioning and width */}
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative -bottom-8 sm:-bottom-12 lg:-bottom-16">
                <SearchForm onSearch={setSearchCriteria} />
              </div>
            </div>
          </HeroSection>
        </div>

        {/* Main content area with responsive spacing */}
        <div className="mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Search results section */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-12">
              <SearchResults searchCriteria={searchCriteria} />
            </div>

            {/* Optional: Additional sections with responsive grid layouts */}
            <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <TopDestinations />
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                <UpcomingRides />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;