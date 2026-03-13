import React, { useState, useEffect,useCallback } from "react";
import GlobalLoader from "../../components/common/GlobalLoader";
import Pagination from "../../components/common/Pagination";
import "./ReferralsPage.css";
import {
  getReferralLeaderboardService,
  getReferralStatsService,
  getUserReferralsService,
} from "../../services/referrals.service";

const ReferralsPage = () => {
  const [activeTab, setActiveTab] = useState("leaderboard"); // leaderboard | stats | user
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardPagination, setLeaderboardPagination] = useState({});
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState(""); // Input user ID for user referrals
  const [userReferrals, setUserReferrals] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 20;
  const [tableLoading, setTableLoading] = useState(false); // separate loader for search/filter
  // useEffect(() => {
  //   if (activeTab === "leaderboard") fetchLeaderboard(leaderboardPage);
  //   if (activeTab === "stats") fetchStats();
  //   if (activeTab === "user" && userId) fetchUserReferrals(userId, page);
  // }, [activeTab, leaderboardPage, page]);
  useEffect(() => {
  if (activeTab === "leaderboard") fetchLeaderboard(leaderboardPage);
  if (activeTab === "stats") fetchStats();
  if (activeTab === "user" && userId) fetchUserReferrals(userId, page);
}, [activeTab, leaderboardPage, page]);


  // Add this useEffect after your existing ones
useEffect(() => {
  if (activeTab !== "leaderboard") return;
  const debounceTimer = setTimeout(() => {
    fetchLeaderboard(1);
  }, 400);
  return () => clearTimeout(debounceTimer);
}, [searchTerm, dateFrom, activeTab]);

  // const fetchLeaderboard = async (pageNum = 1) => {
  //   setLoading(true);
  //   try {
  //     const data = await getReferralLeaderboardService({
  //       date_from: dateFrom,
  //       search: searchTerm,
  //       page: pageNum,
  //       limit: limit,
  //     });
     
      
  //     // Handle different response structures
  //     let leaderboardData = [];
  //     let paginationData = {};
      
  //     if (Array.isArray(data)) {
  //       // If response is directly an array
  //       leaderboardData = data;
  //     } else if (data?.data && Array.isArray(data.data)) {
  //       // If response has data property
  //       leaderboardData = data.data;
  //       paginationData = data.pagination || {};
  //     } else if (Array.isArray(data?.leaderboard)) {
  //       // If response has leaderboard array
  //       leaderboardData = data.leaderboard;
  //       paginationData = data.pagination || {};
  //     }
      
  //     setLeaderboard(leaderboardData);
  //     setLeaderboardPagination(paginationData);
  //   } catch (err) {
  //     console.error("❌ Error fetching leaderboard:", err);
  //     setLeaderboard([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchLeaderboard = useCallback(async (pageNum = 1) => {
  setTableLoading(true); 
  try {
    const data = await getReferralLeaderboardService({
      date_from: dateFrom,
      search: searchTerm,
      page: pageNum,
      limit: limit,
    });

    let leaderboardData = [];
    let paginationData = {};

    if (Array.isArray(data)) {
      leaderboardData = data;
    } else if (data?.data && Array.isArray(data.data)) {
      leaderboardData = data.data;
      paginationData = data.pagination || {};
    } else if (Array.isArray(data?.leaderboard)) {
      leaderboardData = data.leaderboard;
      paginationData = data.pagination || {};
    }

    setLeaderboard(leaderboardData);
    setLeaderboardPagination(paginationData);
  } catch (err) {
    console.error("❌ Error fetching leaderboard:", err);
    setLeaderboard([]);
  } finally {
    setTableLoading(false);
  }
}, [dateFrom, searchTerm]); // <-- dependencies here

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

      {/* {loading && <GlobalLoader text="Loading referral data..." />} */}
      {/* Add this inside the leaderboard table section */}
{tableLoading && (
  <div style={{ textAlign: "center", padding: "10px", color: "#888" }}>
    Loading...
  </div>
)}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && !loading && (
        <div className="referral-content-section">
          <div className="referral-date-filter" style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label htmlFor="leaderboard-search" style={{ fontWeight: "600" }}>Search:</label>
              <input
                id="leaderboard-search"
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setLeaderboardPage(1);
                }}
                className="referral-search-input"
                style={{ maxWidth: "250px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label htmlFor="leaderboard-date" style={{ fontWeight: "600" }}>From Date:</label>
              <input
                id="leaderboard-date"
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setLeaderboardPage(1);
                }}
                className="referral-search-input"
                style={{ maxWidth: "200px" }}
              />
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setDateFrom("");
                setLeaderboardPage(1);
              }}
              className="referral-search-button"
              style={{ padding: "8px 16px" }}
            >
              Clear
            </button>
          </div>

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

          <Pagination
            currentPage={leaderboardPagination.current_page || leaderboardPage}
            totalPages={leaderboardPagination.last_page || 1}
            onPageChange={setLeaderboardPage}
            isLoading={loading}
          />
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

          {(
            <Pagination
              currentPage={pagination.current_page || page}
              totalPages={pagination.last_page || 1}
              onPageChange={setPage}
              isLoading={loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;