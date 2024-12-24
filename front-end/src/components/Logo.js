import React from 'react';

const Logo = ({ image, altText = "Logo" }) => (
  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full overflow-hidden">
    {image ? (
      <img src={image} alt={altText} className="w-full h-full object-cover" />
    ) : (
      <span className="text-white text-lg sm:text-xl md:text-2xl">A</span>
    )}
  </div>
);

export default Logo;
