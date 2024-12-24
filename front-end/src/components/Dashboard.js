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
    <div className="dashboard">
      <HeroSection>
        <SearchForm onSearch={setSearchCriteria} />
      </HeroSection>
      <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24">
        <SearchResults searchCriteria={searchCriteria} />
      </div>
    </div>
  );
};

export default Dashboard;
