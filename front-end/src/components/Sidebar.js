import React from 'react';
import { 
  faCalendarDays, 
  faCar, 
  faClock, 
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import SidebarItem from './SidebarItem';
import Logo from './Logo';

const Sidebar = () => (
  <aside className="w-20 bg-indigo-100 flex flex-col items-center py-4 fixed h-full">
    <div className="mb-4">
      <Logo image="\images\file.png" altText="Custom Logo" />
    </div>
    <nav className="flex flex-col gap-4">
      <SidebarItem to="/booking" icon={faCalendarDays} label="Booking" active />
      <SidebarItem to="/" icon={faCar} label="All Rides" />
      <SidebarItem to="/upcoming" icon={faClock} label="Upcoming" />
      <SidebarItem to="/profile" icon={faUser} label="My Profile" />
    </nav>
  </aside>
);
export default Sidebar;