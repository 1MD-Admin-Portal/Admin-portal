import React, { useEffect, useState } from "react";
import { getStudioStatistics } from "../../services/studio.service";
import { Users, Building, TrendingUp, Award } from "lucide-react";
import "./StudioStatisticsSection.css";

const StudioStatisticsSection = ({ studios = [] }) => {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

const loadStatistics = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await getStudioStatistics();

    const stats = response?.statistics || {};

    const totalStudios =
      stats?.studios_by_country?.reduce((sum, c) => sum + c.count, 0) || 0;

    const activeStudios =
      stats?.studios_by_status?.find(s => s.status === "active")?.count || 0;

    const totalInstructors =
      stats?.instructor_stats?.total_instructors_linked || 0;

    // ✅ DEFINE THIS FIRST
    const totalCapacity = studios.reduce(
      (sum, s) => sum + (Number(s.capacity) || 0),
      0
    );

    const formattedStats = {
      total_studios: totalStudios,
      active_studios: activeStudios,
      total_instructors: totalInstructors,
    };

    setStats(formattedStats);

  } catch (err) {
    console.error("Error loading statistics:", err);
    setError("Failed to load statistics");
  } finally {
    setLoading(false);
  }
};



  if (loading) {
    return (
      <div className="statistics-section loading">
        <div className="spinner-small"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-section error">
        <p>{error}</p>
        <button onClick={loadStatistics} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const defaultStats = {
    total_studios: 0,
    active_studios: 0,
    total_instructors: 0,
    ...stats,
  };
  const totalCapacity = studios.reduce(
  (sum, s) =>
    sum +
    (Number(
      s.capacity ||
      s.studio_capacity ||
      s.max_capacity ||
      s.total_capacity
    ) || 0),
  0
);


  return (
    <div className="statistics-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Studios</p>
            <p className="stat-value">{defaultStats.total_studios || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(46, 204, 113, 0.1)", color: "#27ae60" }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Studios</p>
            <p className="stat-value" style={{ color: "#27ae60" }}>
              {defaultStats.active_studios || 0}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(52, 152, 219, 0.1)", color: "#2980b9" }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Instructors</p>
            <p className="stat-value" style={{ color: "#2980b9" }}>
              {defaultStats.total_instructors || 0}
            </p>
          </div>
        </div>

        {/* <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(155, 89, 182, 0.1)", color: "#8e44ad" }}>
            <Award size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Capacity</p>
            <p className="stat-value" style={{ color: "#8e44ad" }}>
              {totalCapacity}
            </p>
          </div>
        </div> */}
      </div>

      {stats && Object.keys(stats).length > 4 && (
        <div className="additional-stats">
          <h4>Additional Metrics</h4>
          <div className="metrics-list">
            {Object.entries(stats).map(([key, value]) => {
              if (["total_studios", "active_studios", "total_instructors", "total_capacity"].includes(key)) {
                return null;
              }
              return (
                <div key={key} className="metric-item">
                  <span className="metric-label">{key.replace(/_/g, " ").toUpperCase()}</span>
                  <span className="metric-value">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioStatisticsSection;
