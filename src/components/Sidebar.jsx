import React from "react";
import {
  Home as HomeIcon,
  Users,
  Video,
  Flag,
  Activity,
  DollarSign,
  Bell,
  Cog,
  LogOut,
} from "lucide-react";
import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Dance with me</h2>
      </div>
      <nav className="menu">
        <div className="menu-section">
          <p className="menu-section-title">MAIN</p>
          <ul>
            <li><NavLink to="/"><HomeIcon size={18} /> Dashboard</NavLink></li>
            <li><NavLink to="/users"><Users size={18} /> Users</NavLink></li>
            <li><NavLink to="/content"><Video size={18} /> Community Content</NavLink></li>
            <li><NavLink to="/programs"><Flag size={18} /> Program Management</NavLink></li>
            <li><NavLink to="/challenges"><Activity size={18} /> Challenges</NavLink></li>
            <li><NavLink to="/moderation"><Video size={18} /> Class Moderation</NavLink></li>
            <li><NavLink to="/events"><Video size={18} /> Events</NavLink></li>
            <li><NavLink to="/marketplace"><DollarSign size={18} /> Marketplace</NavLink></li>
            <li><NavLink to="/earnings"><DollarSign size={18} /> Earnings & Payouts</NavLink></li>
            <li><NavLink to="/logs"><Activity size={18} /> Access Logs</NavLink></li>
            <li><NavLink to="/ads"><Video size={18} /> Ads Management</NavLink></li>
          </ul>
        </div>
        <div className="menu-section">
          <p className="menu-section-title">SETTINGS</p>
          <ul>
            <li><NavLink to="/notifications"><Bell size={18} /> Notification</NavLink></li>
            <li><NavLink to="/settings"><Cog size={18} /> Settings</NavLink></li>
          </ul>
        </div>
        <div className="logout">
          <NavLink to="/logout"><LogOut size={18} /> Logout</NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
