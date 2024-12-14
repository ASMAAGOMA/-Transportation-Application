import React, { useState } from 'react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import RideCard from './RideCard';
import SearchForm from './SearchForm';
import TripModal from './TripModal';

const UpcomingRides = () => {
  const { data: trips, isLoading, isError, error } = useGetTripsQuery();
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);

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

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleCloseModal = () => {
    setSelectedTrip(null);
  };

  const handleBook = (trip) => {
    // Implement booking logic here
    console.log('Booking trip:', trip);
  };

  if (isLoading) {
    return <div className="p-4">Loading trips...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error: {error?.data?.message}</div>;
  }

  const filteredTrips = getFilteredTrips();

  return (
    <section className="space-y-8">
      <SearchForm onSearch={setSearchCriteria} />
      
      <div className="px-8 py-12">
        {filteredTrips.length === 0 ? (
          <div className="text-center text-gray-600">No trips found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => (
              <RideCard
                key={trip.id}
                trip={trip}
                onClick={() => handleTripClick(trip)}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>

      {selectedTrip && (
        <TripModal
          trip={selectedTrip}
          onClose={handleCloseModal}
          onBook={handleBook}
        />
      )}
    </section>
  );
};

export default UpcomingRides;