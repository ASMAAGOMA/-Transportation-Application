import React from 'react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import RideCard from './RideCard';

const UpcomingTrips = () => {
  const { data: trips, isLoading, isSuccess, isError, error } = useGetTripsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.data?.message}</div>;
  }

  if (!trips?.ids?.length) {
    return <div>No upcoming trips found.</div>;
  }

  // Sort trips by start date
  const sortedTrips = trips.ids
    .map(id => trips.entities[id])
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <section id="upcoming-trips" className="px-8 py-12">
      <div className="grid grid-cols-2 gap-6">
        {sortedTrips.map(trip => (
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
    </section>
  );
};

export default UpcomingTrips;