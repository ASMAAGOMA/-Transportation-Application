// NavLink.jsx
import React from 'react';

const NavLink = ({ href, children, active }) => (
  <a 
    href={href} 
    className={`relative group ${active ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-indigo-600'} transition-colors duration-200`}
  >
    {children}
    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300 -translate-x-1/2" />
  </a>
);
export default NavLink;