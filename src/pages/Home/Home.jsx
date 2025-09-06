import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Flag,
  UserPlus,
  RefreshCw,
  Filter,
  TrendingUp,
  Calendar,
} from "lucide-react";
import dashboardService from "../../services/dashboardService";
import {
  KPI_CARDS,
  YEAR_OPTIONS,
  MONTH_OPTIONS,
  LOADING_STATES,
} from "../../utils/constants";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: "all",
    month: "all",
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoadingState(LOADING_STATES.LOADING);
    setError(null);

    try {
      const response = await dashboardService.getDashboardMetrics(filters);

      if (response.success) {
        setDashboardData(response.data);
        setLoadingState(LOADING_STATES.SUCCESS);
      } else {
        setError(response.error);
        setLoadingState(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
      setLoadingState(LOADING_STATES.ERROR);
    }
  };

  // Effect to fetch data on component mount and filter change
  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Render loading state
  if (loadingState === LOADING_STATES.LOADING) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="loading-spinner">
            <RefreshCw className="animate-spin" size={32} />
          </div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (loadingState === LOADING_STATES.ERROR) {
    return (
      <div className="main-content">
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-button">
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.main_metrics || {};
  const appliedFilters = dashboardData?.filters_applied || {};

  return (
    <div className="main-content">
      {/* Header */}
      <header className="main-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            <TrendingUp size={28} />
            Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>

        <div
          className="admin-profile-wrapper"
          onMouseEnter={() => setShowProfileCard(true)}
          onMouseLeave={() => setShowProfileCard(false)}
        >
          <div
            className="admin-profile"
            onClick={() => navigate("/admin-profile")}
          >
            <div className="admin-info">
              <span className="admin-name">Admin</span>
              <span className="admin-status">Online</span>
            </div>
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Admin"
              className="admin-avatar"
            />
          </div>

          {showProfileCard && (
            <div className="profile-card">
              <div className="profile-header">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Admin"
                />
                <div className="profile-info">
                  <h3>Mark Johnson</h3>
                  <span className="profile-role">Super Admin</span>
                </div>
              </div>
              <div className="profile-details">
                <p>
                  <strong>Email:</strong> admin@local.com
                </p>
                <p>
                  <strong>Last Login:</strong> Today, 9:30 AM
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-header">
          <div className="filters-title">
            <Filter size={20} />
            <span>Filters</span>
          </div>
          <button onClick={handleRefresh} className="refresh-button">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="year-filter">
              <Calendar size={16} />
              Year
            </label>
            <select
              id="year-filter"
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="filter-select"
            >
              {YEAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="month-filter">
              <Calendar size={16} />
              Month
            </label>
            <select
              id="month-filter"
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="filter-select"
            >
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(appliedFilters.year !== "all" ||
            appliedFilters.month !== "all") && (
            <div className="active-filters">
              <span className="active-filters-label">Applied:</span>
              {appliedFilters.year !== "all" && (
                <span className="filter-badge">
                  Year: {appliedFilters.year}
                </span>
              )}
              {appliedFilters.month !== "all" && (
                <span className="filter-badge">
                  Month:{" "}
                  {
                    MONTH_OPTIONS.find((m) => m.value === appliedFilters.month)
                      ?.label
                  }
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* KPI Cards */}
      <section className="kpi-section">
        <div className="kpi-grid">
          {KPI_CARDS.map((card) => {
            const value = metrics[card.key];
            const formattedValue = dashboardService.formatMetric(
              value,
              card.format
            );

            return (
              <div key={card.key} className={`kpi-card ${card.color}`}>
                <div className="kpi-header">
                  <div className="kpi-icon">
                    <span>{card.icon}</span>
                  </div>
                  <div className="kpi-trend">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="kpi-content">
                  <h2 className="kpi-value">{formattedValue || "0"}</h2>
                  <p className="kpi-title">{card.title}</p>
                </div>
                <div className="kpi-footer">
                  <div className="kpi-status active">
                    <div className="status-dot"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="section-header">
          <h3>Quick Actions</h3>
          <p>Manage your platform efficiently</p>
        </div>

        <div className="quick-actions-grid">
          <div
            className="action-card"
            onClick={() => navigate("/VideoPrograms")}
          >
            <div className="action-icon programs">
              <Plus size={24} />
            </div>
            <div className="action-content">
              <h4>Add New Program</h4>
              <p>Create engaging video programs</p>
            </div>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/CreateChallenge")}
          >
            <div className="action-icon challenges">
              <Flag size={24} />
            </div>
            <div className="action-content">
              <h4>Create Challenge</h4>
              <p>Launch exciting challenges</p>
            </div>
          </div>

          <div className="action-card" onClick={() => navigate("/EventsPage")}>
            <div className="action-icon events">
              <UserPlus size={24} />
            </div>
            <div className="action-content">
              <h4>Create Event</h4>
              <p>Organize community events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Insights */}
      <section className="insights-section">
        <div className="section-header">
          <h3>Platform Insights</h3>
          <p>Key metrics overview</p>
        </div>

        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <h4>User Engagement</h4>
            </div>
            <div className="insight-content">
              <div className="insight-metric">
                <span className="metric-label">Subscription Rate</span>
                <span className="metric-value">
                  {metrics.total_users > 0
                    ? Math.round(
                        (metrics.active_subscriptions / metrics.total_users) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="insight-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      metrics.total_users > 0
                        ? Math.round(
                            (metrics.active_subscriptions /
                              metrics.total_users) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <h4>Revenue per User</h4>
            </div>
            <div className="insight-content">
              <div className="insight-metric">
                <span className="metric-label">Average RPU</span>
                <span className="metric-value">
                  {dashboardService.formatMetric(
                    metrics.total_users > 0
                      ? parseFloat(metrics.total_revenue) / metrics.total_users
                      : 0,
                    "currency"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <h4>Content Activity</h4>
            </div>
            <div className="insight-content">
              <div className="insight-metric">
                <span className="metric-label">Total Active Content</span>
                <span className="metric-value">
                  {(metrics.active_programs || 0) +
                    (metrics.active_events || 0) +
                    (metrics.active_challenges || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
