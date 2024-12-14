import React from 'react';

const FiltersSection = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-6">Filters</h2>
    
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
          className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Trip Duration</h3>
        <input
          type="range"
          min="0"
          max="24"
          value={filters.duration[1]}
          onChange={(e) => setFilters({...filters, duration: [0, parseInt(e.target.value)]})}
          className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Trip Type</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-red-500 focus:ring-red-500"
              checked={filters.type.includes('Adventure')}
              onChange={(e) => {
                const newTypes = e.target.checked
                  ? [...filters.type, 'Adventure']
                  : filters.type.filter(t => t !== 'Adventure');
                setFilters({...filters, type: newTypes});
              }}
            />
            <span className="ml-2">Adventure</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-red-500 focus:ring-red-500"
              checked={filters.type.includes('Relaxation')}
              onChange={(e) => {
                const newTypes = e.target.checked
                  ? [...filters.type, 'Relaxation']
                  : filters.type.filter(t => t !== 'Relaxation');
                setFilters({...filters, type: newTypes});
              }}
            />
            <span className="ml-2">Relaxation</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

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
          <FiltersSection />
        </div>

        <div className="col-span-3">
          {selectedTrip ? (
            <BookingForm trip={selectedTrip} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
export default FiltersSection;