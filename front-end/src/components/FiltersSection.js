// FiltersSection.js
import React from 'react';

const FiltersSection = ({ filters, setFilters }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="space-y-6">
        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({
              ...filters,
              priceRange: [filters.priceRange[0], parseInt(e.target.value)]
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Duration (hours)</label>
          <input
            type="range"
            min="0"
            max="24"
            value={filters.duration[1]}
            onChange={(e) => setFilters({
              ...filters,
              duration: [filters.duration[0], parseInt(e.target.value)]
            })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.duration[0]}h</span>
            <span>{filters.duration[1]}h</span>
          </div>
        </div>

        {/* Trip Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Trip Type</label>
          {['Adventure', 'Cultural', 'Relaxation', 'Urban'].map(type => (
            <div key={type} className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={filters.type.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.type, type]
                    : filters.type.filter(t => t !== type);
                  setFilters({ ...filters, type: newTypes });
                }}
                className="mr-2"
              />
              <span className="text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;