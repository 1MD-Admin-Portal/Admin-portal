import React, { useState, useEffect } from "react";
import GlobalLoader from "../../components/common/GlobalLoader";
import "./ReferralsPage.css";
import {
  getReferralLeaderboardService,
  getReferralStatsService,
  getUserReferralsService,
} from "../../services/referrals.service";

const ReferralsPage = () => {
  const [activeTab, setActiveTab] = useState("leaderboard"); // leaderboard | stats | user
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState(""); // Input user ID for user referrals
  const [userReferrals, setUserReferrals] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (activeTab === "leaderboard") fetchLeaderboard();
    if (activeTab === "stats") fetchStats();
    if (activeTab === "user" && userId) fetchUserReferrals(userId, page);
  }, [activeTab, page]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getReferralLeaderboardService();
      setLeaderboard(data || []);
    } catch (err) {
      console.error("❌ Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getReferralStatsService();
      setStats(data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReferrals = async (id, pageNum) => {
    setLoading(true);
    try {
      const res = await getUserReferralsService(id, pageNum, 10);
      // API response has { stats, pagination }
      setUserReferrals(res.stats?.data || []); // use correct user referral list
      setPagination(res.stats?.pagination || {});
    } catch (err) {
      console.error("❌ Error fetching user referrals:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="referral-management-container">
      <h2 className="referral-main-title">Referral Management</h2>

      {/* Tabs */}
      <div className="referral-tab-navigation">
        <button
          className={`referral-tab-button ${activeTab === "leaderboard" ? "referral-tab-active" : ""}`}
          onClick={() => setActiveTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={`referral-tab-button ${activeTab === "stats" ? "referral-tab-active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        {/* <button
          className={`referral-tab-button ${activeTab === "user" ? "referral-tab-active" : ""}`}
          onClick={() => setActiveTab("user")}
        >
          User Referrals
        </button> */}
      </div>

      {loading && <GlobalLoader text="Loading referral data..." />}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && !loading && (
        <div className="referral-content-section">
          <table className="referral-data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Referral Code</th>
                <th>Total Referrals</th>
                <th>Paid Referrals</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user.referral_code}>
                  <td className="referral-rank-cell">{user.rank}</td>
                  <td>{user.name}</td>
                  <td className="referral-code-cell">{user.referral_code}</td>
                  <td>{user.total_referrals}</td>
                  <td>{user.paid_referrals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && stats && !loading && (
        <div className="referral-content-section">
          <div className="referral-stats-overview">
            <h3 className="referral-section-title">Overall Stats</h3>
            <div className="referral-stats-grid">
              <div className="referral-stat-card">
                <div className="referral-stat-number">{stats.overall.total_referrals}</div>
                <div className="referral-stat-label">Total Referrals</div>
              </div>
              <div className="referral-stat-card">
                <div className="referral-stat-number">{stats.overall.paid_referrals}</div>
                <div className="referral-stat-label">Paid Referrals</div>
              </div>
              <div className="referral-stat-card">
                <div className="referral-stat-number">{stats.overall.unpaid_referrals}</div>
                <div className="referral-stat-label">Unpaid Referrals</div>
              </div>
              <div className="referral-stat-card">
                <div className="referral-stat-number">{stats.overall.active_referrers}</div>
                <div className="referral-stat-label">Active Referrers</div>
              </div>
              <div className="referral-stat-card">
                <div className="referral-stat-number">{stats.overall.conversion_rate.toFixed(2)}%</div>
                <div className="referral-stat-label">Conversion Rate</div>
              </div>
            </div>
          </div>

          <div className="referral-trends-section">
            <h3 className="referral-section-title">Monthly Trends</h3>
            <table className="referral-data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Referrals</th>
                  <th>Paid Referrals</th>
                  <th>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthly_trends.map((m, idx) => (
                  <tr key={idx}>
                    <td>{m.month}</td>
                    <td>{m.total_referrals}</td>
                    <td>{m.paid_referrals}</td>
                    <td>{m.conversion_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="referral-top-performer">
            <h3 className="referral-section-title">Top Referrer</h3>
            <div className="referral-performer-card">
              <div className="referral-performer-info">
                <div className="referral-performer-name">{stats.top_referrer.name}</div>
                <div className="referral-performer-email">{stats.top_referrer.email}</div>
              </div>
              <div className="referral-performer-stats">
                <span className="referral-performer-metric">
                  {stats.top_referrer.total_referrals} total referrals
                </span>
                <span className="referral-performer-metric">
                  ({stats.top_referrer.paid_referrals} paid)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Referrals Tab */}
      {activeTab === "user" && !loading && (
        <div className="referral-content-section">
          <div className="referral-user-search">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="referral-search-input"
            />
            <button 
              onClick={() => fetchUserReferrals(userId, 1)}
              className="referral-search-button"
            >
              Fetch Referrals
            </button>
          </div>

          {userReferrals.length > 0 && (
            <table className="referral-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {userReferrals.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pagination.total > 0 && (
            <div className="referral-pagination-controls">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="referral-pagination-button"
              >
                Prev
              </button>
              <span className="referral-pagination-info">
                Page {pagination.current_page || page} of{" "}
                {pagination.last_page || 1}
              </span>
              <button
                disabled={page >= (pagination.last_page || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="referral-pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;