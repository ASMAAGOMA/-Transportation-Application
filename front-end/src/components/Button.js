// Button.jsx
import React from 'react';

const Button = ({ variant = 'primary', children }) => (
    <button 
      className={`px-6 py-2 rounded-lg ${
        variant === 'primary' 
          ? 'bg-indigo-600 text-white' 
          : 'text-indigo-600 border border-indigo-600'
      }`}
    >
      {children}
    </button>
  );

export default Button;