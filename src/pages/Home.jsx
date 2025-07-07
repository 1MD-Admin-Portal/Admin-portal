import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Flag, UserPlus } from "lucide-react";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);

  const handleMouseEnter = () => setShowProfileCard(true);
  const handleMouseLeave = () => setShowProfileCard(false);

  return (
    <div className="main-content">
      <header className="main-header">
        <h1>Dashboard</h1>

        <div
          className="admin-profile-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="admin-profile" onClick={() => navigate("/admin-profile")}>
            <span>Admin</span>
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Admin" />
          </div>

          {showProfileCard && (
            <div className="profile-card">
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Admin" />
              <h3>Mark</h3>
              <p>Username - admin@local.com</p>
              <p>Role - Super Admin</p>
            </div>
          )}
        </div>
      </header>

      {/* KPI Cards */}
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

      {/* Charts */}
      <section className="charts">
        <div className="chart">
          <h3>User Growth</h3>
          <img src="https://static.vecteezy.com/system/resources/thumbnails/014/030/664/small/trading-graph-chart-of-growth-or-fall-in-flat-design-free-vector.jpg" alt="User Growth" />
        </div>
        <div className="chart">
          <h3>Subscription Growth</h3>
          <img src="https://static.vecteezy.com/system/resources/thumbnails/014/030/664/small/trading-graph-chart-of-growth-or-fall-in-flat-design-free-vector.jpg" alt="Subscription Growth" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="buttons">
          <button onClick={() => navigate("/VideoPrograms")}>
            <Plus size={16} /> Add New Program
          </button>
          <button onClick={() => navigate("/CreateChallenge")}>
            <Flag size={16} /> Create New Challenge
          </button>
          <button onClick={() => navigate("/EventsPage")}>
            <UserPlus size={16} /> Create New Event
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
