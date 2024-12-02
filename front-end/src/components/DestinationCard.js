// DestinationCard.js
import React from 'react';

const DestinationCard = ({ city, price, image }) => (
  <div className="relative rounded-lg overflow-hidden h-96">  {/* Increased height to h-96 */}
    <img src={image} alt={city} className="w-full h-full object-cover" />
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white">
      <h3 className="font-bold text-xl">{city}</h3>
      <p>From ${price}</p>
    </div>
  </div>
);
export default DestinationCard;