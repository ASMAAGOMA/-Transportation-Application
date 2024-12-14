// BookingFilters.jsx
import React from 'react';
import { Slider } from '@/components/ui/slider';

const BookingFilters = ({ filters, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Price Range</h3>
          <Slider
            defaultValue={filters.priceRange}
            max={1000}
            step={10}
            onValueChange={(value) => 
              onChange({ ...filters, priceRange: value })}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Trip Duration</h3>
          <Slider
            defaultValue={filters.duration}
            max={24}
            step={1}
            onValueChange={(value) => 
              onChange({ ...filters, duration: value })}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{filters.duration[0]}h</span>
            <span>{filters.duration[1]}h</span>
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