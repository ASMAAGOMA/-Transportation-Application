import React from 'react';

const BookingFilters = ({ filters, onChange }) => {
  const handleRangeChange = (field, value) => {
    // Convert string value to number for range inputs
    const numValue = Number(value);
    // Keep the array structure but update the changed value
    const newRange = field === 'priceRange' 
      ? [numValue, filters.priceRange[1]]
      : [numValue, filters.duration[1]];
    
    onChange({ ...filters, [field]: newRange });
  };

  const handleMaxRangeChange = (field, value) => {
    // Convert string value to number for range inputs
    const numValue = Number(value);
    // Keep the array structure but update the changed value
    const newRange = field === 'priceRange' 
      ? [filters.priceRange[0], numValue]
      : [filters.duration[0], numValue];
    
    onChange({ ...filters, [field]: newRange });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Price Range</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.priceRange[0]}
                onChange={(e) => handleRangeChange('priceRange', e.target.value)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.priceRange[1]}
                onChange={(e) => handleMaxRangeChange('priceRange', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Trip Duration</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={filters.duration[0]}
                onChange={(e) => handleRangeChange('duration', e.target.value)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={filters.duration[1]}
                onChange={(e) => handleMaxRangeChange('duration', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{filters.duration[0]}h</span>
              <span>{filters.duration[1]}h</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Trip Type</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-indigo-600"
                checked={filters.type.includes('Adventure')}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.type, 'Adventure']
                    : filters.type.filter(t => t !== 'Adventure');
                  onChange({ ...filters, type: newTypes });
                }}
              />
              <span className="ml-2">Adventure</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-indigo-600"
                checked={filters.type.includes('Relaxation')}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.type, 'Relaxation']
                    : filters.type.filter(t => t !== 'Relaxation');
                  onChange({ ...filters, type: newTypes });
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

export default BookingFilters;