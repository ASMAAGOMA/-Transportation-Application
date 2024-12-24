import React from 'react';

const Button = ({ variant = 'primary', children, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base rounded-lg transition-all duration-200 hover:bg-indigo-600 ${
      variant === 'primary' 
        ? 'bg-indigo-600 text-white hover:text-white' 
        : 'text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export default Button;
