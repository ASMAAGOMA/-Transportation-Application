// Header.js
import React from 'react';
import Button from './Button';
import NavLink from './NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faGear
} from '@fortawesome/free-solid-svg-icons';
const Header = () => (
    <header className="p-4 flex justify-between items-center">
      <nav className="flex gap-6">
        <NavLink href="#" active>Booking</NavLink>
        <NavLink href="#">All trips</NavLink>
        <NavLink href="#">Pending trips</NavLink>
        <NavLink href="#">Profile</NavLink>
      </nav>
      <div className="flex gap-4 items-center">
        <Button variant="secondary">Login</Button>
        <Button>Sign up</Button>
        <FontAwesomeIcon icon={faGear} className="w-6 h-6 text-gray-500" />
        <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-gray-500" />
      </div>
    </header>
  );

export default Header;