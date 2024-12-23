import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollToElement } from '../hooks/useScrollToElement';
import Button from './Button';
import NavLink from './NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="relative bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo or Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Logo
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign up</Button>
            </Link>
            <FontAwesomeIcon icon={faGear} className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <FontAwesomeIcon 
              icon={faGear} 
              className="w-5 h-5 text-gray-600" 
            />
            <FontAwesomeIcon 
              icon={faBell} 
              className="w-5 h-5 text-gray-600" 
            />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <FontAwesomeIcon 
                icon={isMobileMenuOpen ? faXmark : faBars} 
                className="w-6 h-6" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/booked-trips"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/booked-trips' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Booking
          </Link>
          <Link 
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Trips
          </Link>
          <Link 
            to="/pending"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/pending' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pending trips
          </Link>
          <Link 
            to="/profile"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/profile' 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Profile
          </Link>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-4 flex flex-col gap-2 px-3">
            <Link to="/login" className="w-full">
              <Button variant="secondary" className="w-full justify-center">
                Login
              </Button>
            </Link>
            <Link to="/signup" className="w-full">
              <Button className="w-full justify-center">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;