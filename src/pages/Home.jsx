import React from "react";
import {
  Home as HomeIcon,
  Users,
  Video,
  DollarSign,
  Activity,
  Bell,
  Cog,
  LogOut,
  Plus,
  Flag,
  UserPlus
} from "lucide-react";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dance with me</h2>
        </div>
        <nav className="menu">
          <div className="menu-section">
            <p className="menu-section-title">MAIN</p>
            <ul>
              <li><HomeIcon size={18} /> Dashboard</li>
              <li><Users size={18} /> Users</li>
              <li><Video size={18} /> Community Content</li>
              <li><Flag size={18} /> Program Management</li>
              <li><Activity size={18} /> Challenges</li>
              <li><Video size={18} /> Class Moderation</li>
              <li><Video size={18} /> Events</li>
              <li><DollarSign size={18} /> Marketplace</li>
              <li><DollarSign size={18} /> Earnings & Payouts</li>
              <li><Activity size={18} /> Access Logs</li>
              <li><Video size={18} /> Ads Management</li>
            </ul>
          </div>
          <div className="menu-section">
            <p className="menu-section-title">SETTINGS</p>
            <ul>
              <li><Bell size={18} /> Notification</li>
              <li><Cog size={18} /> Settings</li>
            </ul>
          </div>
          <div className="logout">
            <LogOut size={18} /> Logout
          </div>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Dashboard</h1>
          <div className="admin-profile">
            <span>Admin</span>
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Admin" />
          </div>
        </header>
        <section className="kpi-cards">
          <div className="kpi-card blue">
            <h2>1250</h2>
            <p>Total Users</p>
            <span>+5%</span>
          </div>
          <div className="kpi-card green">
            <h2>320</h2>
            <p>Active Subscriptions</p>
            <span>+7%</span>
          </div>
          <div className="kpi-card purple">
            <h2>8500</h2>
            <p>Total Revenue</p>
            <span>+7%</span>
          </div>
          <div className="kpi-card red">
            <h2>12</h2>
            <p>Active Challenges</p>
          </div>
        </section>

        <section className="charts">
          <div className="chart">
            <h3>User Growth</h3>
            <img src="https://dummyimage.com/400x200/eee/000&text=User+Growth+Chart" alt="User Growth" />
          </div>
          <div className="chart">
            <h3>Subscription Growth</h3>
            <img src="https://dummyimage.com/400x200/eee/000&text=Subscription+Growth+Chart" alt="Subscription Growth" />
          </div>
        </section>

        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="buttons">
            <button><Plus size={16} /> Add New Program</button>
            <button><Flag size={16} /> Create New Challenge</button>
            <button><UserPlus size={16} /> Create New Event</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
