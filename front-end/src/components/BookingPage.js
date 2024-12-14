// BookingPage.jsx
import React, { useState } from 'react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import TripCard from './TripCard';
import BookingFilters from './BookingFilters';
import BookingForm from './BookingForm';
import SearchBar from './SearchBar';

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
        <h1 className="text-3xl font-bold mb-8">Book Your Trip</h1>
        
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Destination or Trip Name"
          className="mb-8"
        />

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <BookingFilters 
              filters={filters}
              onChange={setFilters}
            />
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