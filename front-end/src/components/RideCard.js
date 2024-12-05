import React from 'react';

const RideCard = ({ destination, date, duration, image, action, origin, price }) => (
  <div className="relative rounded-lg overflow-hidden shadow-lg">
    <img src={image} alt={destination} className="w-full h-64 object-cover" />
    <div className="p-4 bg-white">
      <h3 className="font-bold text-xl mb-2">Upcoming Trip</h3>
      <div className="space-y-2">
        <p className="text-gray-600">From: {origin}</p>
        <p className="text-gray-600">To: {destination}</p>
        <p className="text-gray-600">Date: {date}</p>
        <p className="text-gray-600">Duration: {duration} days</p>
        <p className="text-gray-600 font-semibold">Price: ${price.toLocaleString()}</p>
      </div>
      <button 
        className="mt-4 w-full py-2 text-indigo-600 border border-indigo-600 rounded-lg
          hover:bg-indigo-600 hover:text-white transition-all duration-200"
      >
        {action}
      </button>
    </div>
  </div>
);

export default RideCard;