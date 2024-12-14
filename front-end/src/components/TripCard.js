import React, { useState } from 'react';

const TripCard = ({ trip, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  // Use placeholder API instead of local image
  const fallbackImage = "/api/placeholder/400/320";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full h-48">
        <img
          src={imageError ? fallbackImage : (trip.image || fallbackImage)}
          alt={trip.destination}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
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