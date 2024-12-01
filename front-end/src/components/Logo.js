import React from 'react';

const Logo = ({ image, altText = "Logo" }) => (
  <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full overflow-hidden">
    {image ? (
      <img src={image} alt={altText} className="w-full h-full object-cover" />
    ) : (
      <span className="text-white">A</span>
    )}
  </div>
);
export default Logo;
