// BookingPage.jsx
import React, { useState } from 'react';
import { useGetTripsQuery } from '../features/trips/tripsApiSlice';
import TripCard from './TripCard';
import BookingForm from './BookingForm';

const BookingPage = () => {
  const { data: trips, isLoading } = useGetTripsQuery();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: 1000,
    duration: 24,
    type: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips?.ids
    ?.map(id => trips.entities[id])
    ?.filter(trip => {
      const matchesSearch = trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = trip.price <= filters.priceRange;
      const matchesDuration = trip.duration <= filters.duration;
      const matchesType = filters.type.length === 0 || filters.type.includes(trip.type);
      return matchesSearch && matchesPrice && matchesDuration && matchesType;
    }) || [];

  return (
    <div className="p-8">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Destination or Trip Name"
          className="w-full p-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-8">
        {/* Filters Section */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={filters.priceRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600">Up to ${filters.priceRange}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trip Duration</label>
                <input
                  type="range"
                  min="0"
                  max="72"
                  value={filters.duration}
                  onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600">Up to {filters.duration} hours</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trip Type</label>
                <div className="space-y-2">
                  {['Adventure', 'Relaxation'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            type: e.target.checked
                              ? [...prev.type, type]
                              : prev.type.filter(t => t !== type)
                          }));
                        }}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Cards Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div>Loading...</div>
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

      {/* Booking Form Modal */}
      {selectedTrip && (
        <BookingForm
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  );
};

export default BookingPage;

// TripCard.jsx
const TripCard = ({ trip, onSelect }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={trip.image ? `http://localhost:3500/uploads/${trip.image}` : '/images/default-trip.jpg'}
        alt={trip.destination}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{trip.destination}</h3>
        <p className="text-gray-600 text-sm mb-4">{trip.description}</p>
        <button
          onClick={() => onSelect(trip)}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// BookingForm.jsx
const BookingForm = ({ trip, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your booking logic here
    console.log('Booking submitted:', { trip, formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Booking Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 border rounded"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-2 border rounded"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
            >
              Confirm Booking
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BookingPage