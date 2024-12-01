// Sidebar.js
import React from 'react';
import { Calendar, Car, Clock, User } from 'lucide-react';
import SidebarItem from './SidebarItem';
import Logo from './Logo';
import { 
    faCalendarDays, 
    faCar, 
    faClock, 
    faUser,
  } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => (
    <aside className="w-20 bg-indigo-100 flex flex-col items-center py-4 fixed h-full">
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="flex flex-col gap-4">
        <SidebarItem icon={faCalendarDays} label="Booking" active />
        <SidebarItem icon={faCar} label="All Rides" />
        <SidebarItem icon={faClock} label="Upcoming" />
        <SidebarItem icon={faUser} label="My Profile" />
      </nav>
    </aside>
  );
  

export default Sidebar;