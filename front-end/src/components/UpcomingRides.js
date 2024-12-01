import React from 'react';
import RideCard from './RideCard';

const UpcomingRides = () => (
    <section className="px-8 py-12">
      <div className="grid grid-cols-2 gap-6">
        <RideCard 
          destination="Paris"
          date="15th November"
          duration={5}
          image="/api/placeholder/500/300"
          action="Change"
        />
        <RideCard 
          destination="New York"
          date="22nd November"
          duration={8}
          image="/api/placeholder/500/300"
          action="Get Ticket Photo"
        />
        <RideCard 
          destination="Sydney"
          date="28th November"
          duration={12}
          image="/api/placeholder/500/300"
          action="Change"
        />
        <RideCard 
          destination="Rome"
          date="5th December"
          duration={3}
          image="/api/placeholder/500/300"
          action="Get Ticket Photo"
        />
      </div>
    </section>
  );
  
export default UpcomingRides;
