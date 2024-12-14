import React from 'react';

const TripCard = ({ trip, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src={trip.image || '/images/default-trip.jpg'}
        alt={trip.destination}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = '/images/default-trip.jpg';
          e.target.onerror = null;
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-medium mb-2">{trip.destination}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
        <button
          onClick={onSelect}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TripCard;