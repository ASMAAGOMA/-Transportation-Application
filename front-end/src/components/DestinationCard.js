import React from 'react';

const DestinationCard = ({ city, price, image }) => (
  <div className="relative rounded-lg overflow-hidden h-48 sm:h-64 md:h-80 lg:h-96 group hover:shadow-xl transition-shadow duration-300">
    {/* Responsive image container */}
    <img 
      src={image} 
      alt={city} 
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
    />
    
    {/* Overlay with responsive padding and text sizes */}
    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 bg-gradient-to-t from-black/60 via-black/40 to-transparent text-white">
      <h3 className="font-bold text-sm sm:text-lg md:text-xl mb-0.5 sm:mb-1">{city}</h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-200">From ${price}</p>
    </div>
  </div>
);

export default DestinationCard;
