import React, { useState, useEffect } from "react";
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
    <div className="referrals-page">
      <h2>Referral Management</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "leaderboard" ? "active" : ""}
          onClick={() => setActiveTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        <button
          className={activeTab === "user" ? "active" : ""}
          onClick={() => setActiveTab("user")}
        >
          User Referrals
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && !loading && (
        <table className="custom-table">
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
                <td>{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.referral_code}</td>
                <td>{user.total_referrals}</td>
                <td>{user.paid_referrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && stats && !loading && (
        <div className="stats-container">
          <h3>Overall Stats</h3>
          <ul>
            <li>Total Referrals: {stats.overall.total_referrals}</li>
            <li>Paid Referrals: {stats.overall.paid_referrals}</li>
            <li>Unpaid Referrals: {stats.overall.unpaid_referrals}</li>
            <li>Active Referrers: {stats.overall.active_referrers}</li>
            <li>
              Conversion Rate: {stats.overall.conversion_rate.toFixed(2)}%
            </li>
          </ul>

          <h3>Monthly Trends</h3>
          <table className="custom-table">
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

          <h3>Top Referrer</h3>
          <p>
            {stats.top_referrer.name} ({stats.top_referrer.email}) -{" "}
            {stats.top_referrer.total_referrals} referrals (
            {stats.top_referrer.paid_referrals} paid)
          </p>
        </div>
      )}

      {/* User Referrals Tab */}
      {activeTab === "user" && !loading && (
        <div className="user-referrals">
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={() => fetchUserReferrals(userId, 1)}>
            Fetch Referrals
          </button>

          {userReferrals.length > 0 && (
            <table className="custom-table">
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
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {pagination.current_page || page} of{" "}
                {pagination.last_page || 1}
              </span>
              <button
                disabled={page >= (pagination.last_page || 1)}
                onClick={() => setPage((p) => p + 1)}
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
