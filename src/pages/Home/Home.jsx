import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Plus, Flag, UserPlus } from "lucide-react";
import "./Home.css";

// ---------- MOCK DATA ---------- //
const monthlyData = [
  { name: "Aug '24", users: 540, subs: 120 },
  { name: "Sep '24", users: 620, subs: 140 },
  { name: "Oct '24", users: 710, subs: 170 },
  { name: "Nov '24", users: 830, subs: 200 },
  { name: "Dec '24", users: 920, subs: 230 },
  { name: "Jan '25", users: 1020, subs: 260 },
  { name: "Feb '25", users: 1090, subs: 280 },
  { name: "Mar '25", users: 1150, subs: 295 },
  { name: "Apr '25", users: 1190, subs: 305 },
  { name: "May '25", users: 1220, subs: 310 },
  { name: "Jun '25", users: 1240, subs: 315 },
  { name: "Jul '25", users: 1250, subs: 320 },
];

const yearlyData = [
  { name: "2021", users: 250, subs: 60 },
  { name: "2022", users: 550, subs: 140 },
  { name: "2023", users: 820, subs: 220 },
  { name: "2024", users: 920, subs: 230 },
  { name: "2025", users: 1250, subs: 320 },
];

const Home = () => {
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [view, setView] = useState("monthly"); // "monthly" or "yearly"
  const [selectedPeriod, setSelectedPeriod] = useState("Jul '25");

  const data = view === "monthly" ? monthlyData : yearlyData;

  const latest =
    data.find((item) => item.name === selectedPeriod) || data[data.length - 1];
  const previousIndex =
    data.findIndex((item) => item.name === selectedPeriod) - 1;
  const previous = data[previousIndex] ?? latest;

  const userGrowthPct = (
    ((latest.users - previous.users) / previous.users) *
    100
  ).toFixed(1);
  const subGrowthPct = (
    ((latest.subs - previous.subs) / previous.subs) *
    100
  ).toFixed(1);

  return (
    <div className="main-content">
      <header className="main-header">
        <h1>Dashboard</h1>
        <div
          className="admin-profile-wrapper"
          onMouseEnter={() => setShowProfileCard(true)}
          onMouseLeave={() => setShowProfileCard(false)}
        >
          <div
            className="admin-profile"
            onClick={() => navigate("/admin-profile")}
          >
            <span>Admin</span>
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Admin"
            />
          </div>

          {showProfileCard && (
            <div className="profile-card">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Admin"
              />
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
          <h2>{latest.users.toLocaleString()}</h2>
          <p>Total Users</p>
          <span>
            {userGrowthPct > 0 ? "+" : ""}
            {userGrowthPct}%
          </span>
        </div>
        <div className="kpi-card green">
          <h2>{latest.subs.toLocaleString()}</h2>
          <p>Active Subscriptions</p>
          <span>
            {subGrowthPct > 0 ? "+" : ""}
            {subGrowthPct}%
          </span>
        </div>
        <div className="kpi-card purple">
          <h2>8,500</h2>
          <p>Total Revenue</p>
          <span>+7%</span>
        </div>
        <div className="kpi-card red">
          <h2>12</h2>
          <p>Active Challenges</p>
        </div>
      </section>
      <section className="kpi-cards">
        <div className="kpi-card blue">
          <h2>29</h2>
          <p>Ongoing Ads</p>
          <span>+3%</span>
        </div>
        <div className="kpi-card green">
          <h2>20</h2>
          <p>Ongoing Classes</p>
          <span>+4%</span>
        </div>
        <div className="kpi-card purple">
          <h2>80</h2>
          <p>Active Events</p>
          <span>+7%</span>
        </div>
        <div className="kpi-card red">
          <h2>19</h2>
          <p>Active Programs</p>
          <span>+2%</span>
        </div>
      </section>

      {/* View Switch */}
      <div className="view-toggle">
        <button
          className={view === "monthly" ? "active" : ""}
          onClick={() => {
            setView("monthly");
            setSelectedPeriod(monthlyData[monthlyData.length - 1].name);
          }}
        >
          Monthly
        </button>
        <button
          className={view === "yearly" ? "active" : ""}
          onClick={() => {
            setView("yearly");
            setSelectedPeriod(yearlyData[yearlyData.length - 1].name);
          }}
        >
          Yearly
        </button>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="period-dropdown"
        >
          {(view === "monthly" ? monthlyData : yearlyData).map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Charts */}
      <section className="charts">
        <div className="chart">
          <h3>User Growth ({view})</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Subscription Growth ({view})</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="subs"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
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
