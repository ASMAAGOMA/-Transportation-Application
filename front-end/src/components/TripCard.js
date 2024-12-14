import React from 'react';
import { format } from 'date-fns';

const TripCard = ({ trip, onSelect }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <img
        src={trip.image || '/images/default-trip.jpg'}
        alt={trip.destination}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{trip.destination}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-indigo-600">
            ${trip.price}
          </span>
          <span className="text-sm text-gray-500">
            {trip.duration} hours
          </span>
        </div>
        
        <button
          onClick={onSelect}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TripCard;