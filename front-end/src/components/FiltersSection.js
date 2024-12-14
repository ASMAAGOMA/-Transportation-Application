import React from 'react';

const FiltersSection = ({ filters, setFilters }) => {
  return (
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
};

export default FiltersSection;