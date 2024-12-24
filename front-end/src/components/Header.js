// Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollToElement } from '../hooks/useScrollToElement'; // Add this import
import Button from './Button';
import NavLink from './NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const location = useLocation();

  return (
    <header className="p-4 sm:p-6 flex justify-between items-center bg-white shadow-sm">
      <nav className="flex gap-4 sm:gap-6">
        <NavLink 
          to="/booked-trips" 
          active={location.pathname === '/booked-trips'}
        >
          Booking
        </NavLink>
        <NavLink 
          to="/" 
          active={location.pathname === '/'}
        >
          All Trips
        </NavLink>
        <NavLink 
          to="/pending" 
          active={location.pathname === '/pending'}
        >
          Pending trips
        </NavLink>
        <NavLink 
          to="/profile" 
          active={location.pathname === '/profile'}
        >
          Profile
        </NavLink>
      </nav>
      <div className="flex gap-3 sm:gap-4 items-center">
        <Link to="/login">
          <Button variant="secondary">Login</Button>
        </Link>
        <Link to="/signup">
          <Button>Sign up</Button>
        </Link>
        <div className="flex gap-3 sm:gap-4">
          <FontAwesomeIcon icon={faGear} className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
          <FontAwesomeIcon icon={faBell} className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
        </div>
      </div>
    </header>
  );
};

export default Header;
