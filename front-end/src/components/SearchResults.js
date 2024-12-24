import React from 'react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import RideCard from './RideCard';
import TripModal from './TripModal';
import NewTripForm from './NewTripForm';
import { useState, useEffect } from 'react';

const SearchResults = ({ searchCriteria }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { data: trips, isLoading, isError, error } = useGetTripsQuery();
  const [isFiltering, setIsFiltering] = useState(false);

  const handleAddToPending = (trip) => {
    // Add your logic here to handle adding trip to pending
    console.log('Adding to pending:', trip);
  };

  const handleBook = (trip) => {
    // Add your booking logic here
    console.log('Booking trip:', trip);
  };

  const getFilteredTrips = () => {
    if (!trips?.ids) return [];

    const allTrips = trips.ids.map(id => trips.entities[id]);
    
    if (!searchCriteria) {
      return allTrips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    return allTrips
      .filter(trip => {
        const matchOrigin = !searchCriteria.origin || 
          trip.origin.toLowerCase().includes(searchCriteria.origin.toLowerCase());
        
        const matchDestination = !searchCriteria.destination || 
          trip.destination.toLowerCase().includes(searchCriteria.destination.toLowerCase());
        
        const tripStart = new Date(trip.startDate);
        const searchStart = searchCriteria.startDate ? new Date(searchCriteria.startDate) : null;
        const searchEnd = searchCriteria.endDate ? new Date(searchCriteria.endDate) : null;
        
        if (searchStart) searchStart.setHours(0, 0, 0, 0);
        if (searchEnd) searchEnd.setHours(23, 59, 59, 999);
        tripStart.setHours(0, 0, 0, 0);
        
        const matchStartDate = !searchStart || tripStart >= searchStart;
        const matchEndDate = !searchEnd || tripStart <= searchEnd;

        return matchOrigin && matchDestination && matchStartDate && matchEndDate;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  useEffect(() => {
    if (searchCriteria) {
      setIsFiltering(true);
      const timer = setTimeout(() => setIsFiltering(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchCriteria]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.data?.message}</div>;
  }

  const filteredTrips = getFilteredTrips();

  return (
    <div className="px-8 space-y-8">
      {/* Add the NewTripForm at the top */}
      <NewTripForm />
      
      <TripModal 
        trip={selectedTrip} 
        onClose={() => setSelectedTrip(null)}
        onAddToPending={handleAddToPending}
        onBook={handleBook}
      />
      
      {filteredTrips.length === 0 ? (
        <div className="text-center text-gray-600">No trips found matching your criteria.</div>
      ) : (
        <div className={`grid grid-cols-2 gap-6 transition-opacity duration-300 ${isFiltering ? 'opacity-0' : 'opacity-100'}`}>
          {filteredTrips.map(trip => (
            <RideCard
              key={trip.id}
              trip={trip}
              onClick={() => setSelectedTrip(trip)}
              onAddToPending={handleAddToPending}
              onBook={handleBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;