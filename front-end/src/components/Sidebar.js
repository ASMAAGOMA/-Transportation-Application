import React from 'react';
import { useLocation } from 'react-router-dom';
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

  return (
    <aside className="w-20 bg-indigo-100 flex flex-col items-center py-4 fixed top-0 left-0 h-full z-50">
      <div className="mb-4">
        <Logo image="/images/file.png" altText="Custom Logo" />
      </div>
      <nav className="flex flex-col gap-4">
        <SidebarItem 
          to="/booked-trips" 
          icon={faCalendarDays} 
          label="Booking" 
          active={location.pathname === '/booked-trips'} 
        />
        <SidebarItem 
          to="/" 
          icon={faCar} 
          label="All Rides" 
          active={location.pathname === '/'} 
        />
        <SidebarItem 
          to="/pending" 
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
