// NavLink.jsx
import React from 'react';

const NavLink = ({ href, children, active }) => (
    <a 
      href={href} 
      className={`${active ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}
    >
      {children}
    </a>
  );
export default NavLink;