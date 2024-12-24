// SidebarItem.jsx
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import '../App.css';

const SidebarItem = ({ icon, label, active, to, onClick }) => (
  <Link to={to} onClick={onClick} className="block">
    <div 
      className={`p-2 rounded-lg text-center transition-all duration-200 w-16 ${
        active ? 'bg-white' : 'hover:bg-white'
      }`}
    >
      <FontAwesomeIcon 
        icon={icon} 
        className={`text-xl mb-1 transition-colors duration-200 ${
          active ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
        }`}
      />
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  </Link>
);

export default SidebarItem;