import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import NavLink from './NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center bg-white shadow-sm">
      <nav className="flex gap-6">
        <NavLink href="#" active>Booking</NavLink>
        <NavLink href="#">All trips</NavLink>
        <NavLink href="#">Pending trips</NavLink>
        <NavLink href="#">Profile</NavLink>
      </nav>
      <div className="flex gap-4 items-center">
        <Link to="/login">
          <Button variant="secondary">Login</Button>
        </Link>
        <Link to="/signup">
          <Button>Sign up</Button>
        </Link>
        <FontAwesomeIcon icon={faGear} className="w-6 h-6 text-gray-900" />
        <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-gray-900" />
      </div>
    </header>
  );
};

export default Header;