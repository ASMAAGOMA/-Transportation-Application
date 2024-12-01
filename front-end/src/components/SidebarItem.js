import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const SidebarItem = ({ icon, label, active }) => (
    <div className={`p-2 rounded-lg text-center ${active ? 'bg-indigo-200' : ''}`}>
      <FontAwesomeIcon icon={icon} className="text-xl mb-1" />
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
export default SidebarItem  