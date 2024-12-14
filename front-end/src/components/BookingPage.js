import React, { useState } from 'react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import TripCard from './TripCard';
import BookingForm from './BookingForm';
import FiltersSection from './FiltersSection';

const BookingPage = () => {
  const { data: trips, isLoading } = useGetTripsQuery();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    duration: [0, 24],
    type: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips?.ids
    .map(id => trips.entities[id])
    .filter(trip => {
      const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = trip.price >= filters.priceRange[0] && trip.price <= filters.priceRange[1];
      const matchesDuration = trip.duration >= filters.duration[0] && trip.duration <= filters.duration[1];
      const matchesType = filters.type.length === 0 || filters.type.includes(trip.type);
      
      return matchesSearch && matchesPrice && matchesDuration && matchesType;
    }) || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Book Your Trip</h1>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-800">Back to Home</button>
            <button className="text-gray-600 hover:text-gray-800">View Trip Details</button>
          </div>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Destination or Trip Name"
          className="w-full mb-8 p-3 rounded-lg border border-gray-200"
        />

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <FiltersSection filters={filters} setFilters={setFilters} />
          </div>

          <div className="col-span-3">
            {selectedTrip ? (
              <BookingForm 
                trip={selectedTrip} 
                onBack={() => setSelectedTrip(null)} 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map(trip => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onSelect={() => setSelectedTrip(trip)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;