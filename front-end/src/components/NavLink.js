import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, children, active }) => (
  <Link 
    to={to}
    className={`relative group text-sm sm:text-base md:text-lg ${
      active ? 'text-indigo-600 font-medium' : 'text-gray-500'
    } hover:text-indigo-600 transition-colors duration-200`}
  >
    {children}
    <span 
      className={`absolute bottom-0 left-1/2 h-0.5 bg-indigo-600 transition-all duration-300 -translate-x-1/2 ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`} 
    />
  </Link>
);

export default NavLink;
