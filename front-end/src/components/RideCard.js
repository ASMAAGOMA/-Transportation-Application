import React from 'react';

const RideCard = ({ destination, date, duration, image, action }) => (
  <div className="relative rounded-lg overflow-hidden">
    <img src={image} alt={destination} className="w-full h-64 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-xl">Upcoming Ride</h3>
      <p className="text-gray-600">Destination: {destination}</p>
      <p className="text-gray-600">Date: {date}, Duration: {duration} hours</p>
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