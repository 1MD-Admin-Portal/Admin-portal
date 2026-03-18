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
import GlobalLoader from "../../components/common/GlobalLoader";
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
      <div className="home-page-main-content">
        <GlobalLoader text="Loading dashboard data..." />
      </div>
    );
  }

  // Render error state
  if (loadingState === LOADING_STATES.ERROR) {
    return (
      <div className="home-page-main-content">
        <div className="home-page-error-container">
          <div className="home-page-error-message">
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button onClick={handleRefresh} className="home-page-retry-button">
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
    <div className="home-page-main-content">
      {/* Header */}
      <header className="home-page-header">
        <div className="home-page-header-left">
          <h1 className="home-page-dashboard-title">
            <TrendingUp size={28} />
            Dashboard
          </h1>
          <p className="home-page-dashboard-subtitle">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>

        <div
          className="home-page-admin-profile-wrapper"
          onMouseEnter={() => setShowProfileCard(true)}
          onMouseLeave={() => setShowProfileCard(false)}
        >
          <div
            className="home-page-admin-profile"
            onClick={() => navigate("/admin-profile")}
          >
            <div className="home-page-admin-info">
              <span className="home-page-admin-name">Admin</span>
              <span className="home-page-admin-status">Online</span>
            </div>
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Admin"
              className="home-page-admin-avatar"
            />
          </div>

          {showProfileCard && (
            <div className="home-page-profile-card">
              <div className="home-page-profile-header">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Admin"
                />
                <div className="home-page-profile-info">
                  <h3>Admin</h3>
                  <span className="home-page-profile-role">Admin</span>
                </div>
              </div>
              <div className="home-page-profile-details">
                <p>
                  <strong>Email:</strong> Admin
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Filters */}
      <section className="home-page-filters-section">
        <div className="home-page-filters-header">
          <div className="home-page-filters-title">
            <Filter size={20} />
            <span>Filters</span>
          </div>
          <button onClick={handleRefresh} className="home-page-refresh-button">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="home-page-filters-container">
          <div className="home-page-filter-group">
            <label htmlFor="home-page-year-filter">
              <Calendar size={16} />
              Year
            </label>
            <select
              id="home-page-year-filter"
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="home-page-filter-select"
            >
              {YEAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="home-page-filter-group">
            <label htmlFor="home-page-month-filter">
              <Calendar size={16} />
              Month
            </label>
            <select
              id="home-page-month-filter"
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="home-page-filter-select"
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
            <div className="home-page-active-filters">
              <span className="home-page-active-filters-label">Applied:</span>
              {appliedFilters.year !== "all" && (
                <span className="home-page-filter-badge">
                  Year: {appliedFilters.year}
                </span>
              )}
              {appliedFilters.month !== "all" && (
                <span className="home-page-filter-badge">
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
      <section className="home-page-kpi-section">
        <div className="home-page-kpi-grid">
          {KPI_CARDS.map((card) => {
            const value = metrics[card.key];
            const formattedValue = dashboardService.formatMetric(
              value,
              card.format,
            );

            return (
              <div
                key={card.key}
                className={`home-page-kpi-card ${card.color}`}
              >
                <div className="home-page-kpi-header">
                  <div className="home-page-kpi-icon">
                    <span>{card.icon}</span>
                  </div>
                  <div className="home-page-kpi-trend">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="home-page-kpi-content">
                  <h2 className="home-page-kpi-value">
                    {formattedValue || "0"}
                  </h2>
                  <p className="home-page-kpi-title">{card.title}</p>
                </div>
                <div className="home-page-kpi-footer">
                  <div className="home-page-kpi-status active">
                    <div className="home-page-status-dot"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="home-page-quick-actions-section">
        <div className="home-page-section-header">
          <h3>Quick Actions</h3>
          <p>Manage your platform efficiently</p>
        </div>

        <div className="home-page-quick-actions-grid">
          <div
            className="home-page-action-card programs"
            onClick={() => navigate("/VideoPrograms")}
          >
            <div className="home-page-action-icon programs">
              <Plus size={24} />
            </div>
            <div className="home-page-action-content">
              <h4>Add New Program</h4>
              <p>Create engaging video programs</p>
            </div>
          </div>

          <div
            className="home-page-action-card challenges"
            onClick={() => navigate("/CreateChallenge")}
          >
            <div className="home-page-action-icon challenges">
              <Flag size={24} />
            </div>
            <div className="home-page-action-content">
              <h4>Create Challenge</h4>
              <p>Launch exciting challenges</p>
            </div>
          </div>

          <div
            className="home-page-action-card events"
            onClick={() => navigate("/EventsPage")}
          >
            <div className="home-page-action-icon events">
              <UserPlus size={24} />
            </div>
            <div className="home-page-action-content">
              <h4>Create Event</h4>
              <p>Organize community events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Insights */}
      <section className="home-page-insights-section">
        <div className="home-page-section-header">
          <h3>Platform Insights</h3>
          <p>Key metrics overview</p>
        </div>

        <div className="home-page-insights-grid">
          <div className="home-page-insight-card">
            <div className="home-page-insight-header">
              <h4>User Engagement</h4>
            </div>
            <div className="home-page-insight-content">
              <div className="home-page-insight-metric">
                <span className="home-page-metric-label">
                  Subscription Rate
                </span>
                <span className="home-page-metric-value">
                  {metrics.total_users > 0
                    ? Math.round(
                        (metrics.active_subscriptions / metrics.total_users) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="home-page-insight-progress">
                <div
                  className="home-page-progress-bar"
                  style={{
                    width: `${
                      metrics.total_users > 0
                        ? Math.round(
                            (metrics.active_subscriptions /
                              metrics.total_users) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="home-page-insight-card">
            <div className="home-page-insight-header">
              <h4>Revenue per User</h4>
            </div>
            <div className="home-page-insight-content">
              <div className="home-page-insight-metric">
                <span className="home-page-metric-label">Average RPU</span>
                <span className="home-page-metric-value">
                  {dashboardService.formatMetric(
                    metrics.total_users > 0
                      ? parseFloat(metrics.total_revenue) / metrics.total_users
                      : 0,
                    "currency",
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="home-page-insight-card">
            <div className="home-page-insight-header">
              <h4>Content Activity</h4>
            </div>
            <div className="home-page-insight-content">
              <div className="home-page-insight-metric">
                <span className="home-page-metric-label">
                  Total Active Content
                </span>
                <span className="home-page-metric-value">
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
