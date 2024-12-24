import React, { useState } from 'react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import RideCard from './RideCard';
import SearchForm from './SearchForm';

const UpcomingRides = () => {
  const { data: trips, isLoading, isError, error } = useGetTripsQuery();
  const [searchCriteria, setSearchCriteria] = useState(null);

  const getFilteredTrips = () => {
    if (!trips?.ids || !searchCriteria) {
      return trips?.ids?.map(id => trips.entities[id]) || [];
    }

    return trips.ids
      .map(id => trips.entities[id])
      .filter(trip => {
        const matchOrigin = !searchCriteria.origin || 
          trip.origin.toLowerCase().includes(searchCriteria.origin.toLowerCase());
        
        const matchDestination = !searchCriteria.destination || 
          trip.destination.toLowerCase().includes(searchCriteria.destination.toLowerCase());
        
        const tripStart = new Date(trip.startDate);
        const searchStart = searchCriteria.startDate ? new Date(searchCriteria.startDate) : null;
        const searchEnd = searchCriteria.endDate ? new Date(searchCriteria.endDate) : null;
        
        const matchStartDate = !searchStart || tripStart >= searchStart;
        const matchEndDate = !searchEnd || tripStart <= searchEnd;

        return matchOrigin && matchDestination && matchStartDate && matchEndDate;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.data?.message}</div>;
  }

  const filteredTrips = getFilteredTrips();

  return (
    <section className="space-y-8">
      <SearchForm onSearch={setSearchCriteria} />

      <div className="px-4 sm:px-8 py-12">
        {filteredTrips.length === 0 ? (
          <div className="text-center text-gray-600">No trips found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredTrips.map(trip => (
              <RideCard
                key={trip.id}
                destination={trip.destination}
                date={new Date(trip.startDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long'
                })}
                duration={trip.duration}
                image={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
                action="Book"
                origin={trip.origin}
                price={trip.price}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingRides;
