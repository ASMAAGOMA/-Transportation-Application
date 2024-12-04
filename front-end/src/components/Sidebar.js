import React from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollToElement } from '../hooks/useScrollToElement'; // Add this import
import { 
  faCalendarDays, 
  faCar, 
  faClock, 
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import SidebarItem from './SidebarItem';
import Logo from './Logo';

const Sidebar = () => {
  const location = useLocation();
  const scrollToUpcoming = useScrollToElement('upcoming-rides');

  return (
    <aside className="w-20 bg-indigo-100 flex flex-col items-center py-4 fixed h-full">
      <div className="mb-4">
        <Logo image="/images/file.png" altText="Custom Logo" />
      </div>
      <nav className="flex flex-col gap-4">
        <SidebarItem 
          to="/booking" 
          icon={faCalendarDays} 
          label="Booking" 
          active={location.pathname === '/booking'} 
        />
        <SidebarItem 
          to="/" 
          icon={faCar} 
          label="All Rides" 
          active={location.pathname === '/'} 
          onClick={(e) => {
            e.preventDefault();
            scrollToUpcoming();
          }}
        />
        <SidebarItem 
          to="/upcoming" 
          icon={faClock} 
          label="Upcoming" 
          active={location.pathname === '/upcoming'} 
        />
        <SidebarItem 
          to="/profile" 
          icon={faUser} 
          label="My Profile" 
          active={location.pathname === '/profile'} 
        />
      </nav>
    </aside>
  );
};

export default Sidebar;