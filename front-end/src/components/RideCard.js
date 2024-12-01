import React from 'react';

const RideCard = ({ destination, date, duration, image, action }) => (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <img src={image} alt={destination} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Upcoming Ride</h3>
        <p className="text-gray-600">Destination: {destination}</p>
        <p className="text-gray-600">Date: {date}, Duration: {duration} hours</p>
        <button className="w-full mt-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg">
          {action}
        </button>
      </div>
    </div>
  );
export default RideCard;