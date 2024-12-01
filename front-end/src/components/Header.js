// Header.js
import React from 'react';
import Button from './Button';
import NavLink from './NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { 
  faBell,
  faGear
} from '@fortawesome/free-solid-svg-icons';
const Header = () => (
  <header className="p-4 flex justify-between items-center bg-white">
    <nav className="flex gap-6">
      <NavLink href="#" active>Booking</NavLink>
      <NavLink href="#">All trips</NavLink>
      <NavLink href="#">Pending trips</NavLink>
      <NavLink href="#">Profile</NavLink>
    </nav>
    <div className="flex gap-4 items-center">
      <Link to="/login"><Button variant="secondary">Login</Button></Link>
      <Link to="/signup"><Button>Sign up</Button></Link>
      <FontAwesomeIcon icon={faGear} className="w-6 h-6 text-gray-900" />
      <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-gray-900" />
    </div>
  </header>
);
export default Header;