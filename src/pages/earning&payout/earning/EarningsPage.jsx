import React, { useEffect, useState } from "react";
import "./EarningsPage.css";
import {
  getEarningsOverviewService,
  getAllEarningsService,
  getUserEarningsDetailService,
} from "../../../services/earning.service";

import {
  X,
  Eye,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";

const EarningsPage = () => {
  const [overview, setOverview] = useState({});
  const [earnings, setEarnings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    user_type: "all",
    source_type: "all",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userEarningsDetail, setUserEarningsDetail] = useState(null);

  // ✅ Fetch Overview
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await getEarningsOverviewService();
      setOverview(data);
    } catch (error) {
      console.error("Error fetching overview:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Earnings with filters
  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await getAllEarningsService(page, limit, filters);
      setEarnings(data?.earnings || []);
      setPagination(data?.pagination || {});
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch User Earnings Detail
  const fetchUserDetail = async (userId, userType) => {
    try {
      const data = await getUserEarningsDetailService(userId, userType);
      setUserEarningsDetail(data);
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [page, filters]);

  // ✅ Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // reset page on filter change
  };

  // ✅ Handle row click to show user detail
  const handleRowClick = async (earning) => {
    setSelectedUser(earning);
    await fetchUserDetail(earning.user.id, earning.user.type);
  };

  // ✅ Close modal
  const closeModal = () => {
    setSelectedUser(null);
    setUserEarningsDetail(null);
  };

  // ✅ Calculate totals from overview
  const getTotalRevenue = () => {
    return (
      overview?.overview_by_type?.reduce(
        (total, type) => total + (type.total_revenue || 0),
        0
      ) || 0
    );
  };

  const getTotalCreatorEarnings = () => {
    return (
      overview?.overview_by_type?.reduce(
        (total, type) => total + (type.total_creator_earnings || 0),
        0
      ) || 0
    );
  };

  const getTotalPendingPayouts = () => {
    return (
      overview?.overview_by_type?.reduce(
        (total, type) => total + (type.pending_payouts || 0),
        0
      ) || 0
    );
  };

  const getTotalCompletedPayouts = () => {
    return (
      overview?.overview_by_type?.reduce(
        (total, type) => total + (type.completed_payouts || 0),
        0
      ) || 0
    );
  };

  if (loading && earnings.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="earnings-page-container">
      <h2 className="earnings-title">Earnings Management</h2>

      {/* ✅ Overview Section */}
      <div className="earnings-overview">
        <div className="overview-card">
          <div className="overview-icon">
            <DollarSign size={24} />
          </div>
          <div className="overview-content">
            <h3>Total Revenue</h3>
            <p className="overview-amount">${getTotalRevenue().toFixed(2)}</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <TrendingUp size={24} />
          </div>
          <div className="overview-content">
            <h3>Creator Earnings</h3>
            <p className="overview-amount">
              ${getTotalCreatorEarnings().toFixed(2)}
            </p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <AlertCircle size={24} />
          </div>
          <div className="overview-content">
            <h3>Pending Payouts</h3>
            <p className="overview-amount pending">
              ${getTotalPendingPayouts().toFixed(2)}
            </p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">
            <Users size={24} />
          </div>
          <div className="overview-content">
            <h3>Completed Payouts</h3>
            <p className="overview-amount completed">
              ${getTotalCompletedPayouts().toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Top Earners Section */}
      {overview?.top_earners && overview.top_earners.length > 0 && (
        <div className="top-earners-section">
          <h3>Top Earners</h3>
          <div className="top-earners-grid">
            {overview.top_earners.map((earner, index) => (
              <div key={earner.user_id} className="top-earner-card">
                <div className="earner-rank">#{index + 1}</div>
                <div className="earner-info">
                  <h4>{earner.user_name}</h4>
                  <p className="earner-type">{earner.user_type}</p>
                  <p className="earner-stats">
                    ${earner.total_earnings} • {earner.transaction_count}{" "}
                    transactions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Overview by Type */}
      {overview?.overview_by_type && overview.overview_by_type.length > 0 && (
        <div className="overview-by-type">
          <h3>Earnings by User Type</h3>
          <div className="type-cards-grid">
            {overview.overview_by_type.map((type) => (
              <div key={type.user_type} className="type-card">
                <h4>{type.user_type.toUpperCase()}</h4>
                <div className="type-stats">
                  <p>
                    <strong>Revenue:</strong> ${type.total_revenue}
                  </p>
                  <p>
                    <strong>Creator Earnings:</strong> $
                    {type.total_creator_earnings}
                  </p>
                  <p>
                    <strong>Platform Fees:</strong> ${type.total_platform_fees}
                  </p>
                  <p>
                    <strong>Transactions:</strong> {type.total_transactions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Filters */}
      <div className="earnings-filters">
        <select
          name="user_type"
          value={filters.user_type}
          onChange={handleFilterChange}
        >
          <option value="all">All User Types</option>
          <option value="instructor">Instructor</option>
          <option value="dj">DJ</option>
          <option value="organiser">Organizer</option>
        </select>

        <select
          name="source_type"
          value={filters.source_type}
          onChange={handleFilterChange}
        >
          <option value="all">All Source Types</option>
          <option value="class_booking">Class Booking</option>
          <option value="event_ticket">Event Ticket</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* ✅ Earnings Table */}
      <div className="earnings-table-container">
        <table className="earnings-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Source</th>
              <th>Total Amount</th>
              <th>User Earnings</th>
              <th>Platform Fee</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {earnings.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No earnings found
                </td>
              </tr>
            ) : (
              earnings.map((earning) => (
                <tr key={earning.id} className="earnings-row">
                  <td>
                    <div className="user-info">
                      <strong>{earning.user.name}</strong>
                      <span className="user-type">{earning.user.type}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`user-type-badge ${earning.user.type}`}>
                      {earning.user.type}
                    </span>
                  </td>
                  <td>
                    <div className="source-info">
                      <span className="source-type">
                        {earning.source.type.replace("_", " ")}
                      </span>
                      <small>{earning.source.display}</small>
                    </div>
                  </td>
                  <td className="amount-cell">${earning.amount.total}</td>
                  <td className="amount-cell user-earnings">
                    ${earning.amount.user_earnings}
                  </td>
                  <td className="amount-cell platform-fee">
                    ${earning.amount.platform_fee}
                  </td>
                  <td>
                    <span className={`status-badge ${earning.status}`}>
                      {earning.status}
                    </span>
                  </td>
                  <td>{new Date(earning.earned_date).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      onClick={() => handleRowClick(earning)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page} of {pagination?.total_pages || 1}
          {pagination?.total && ` (${pagination.total} total)`}
        </span>
        <button
          disabled={page === pagination?.total_pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* ✅ User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Earnings Details</h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            {userEarningsDetail ? (
              <div className="modal-body">
                {/* User Info */}
                <div className="user-detail-section">
                  <h4>User Information</h4>
                  <div className="user-detail-grid">
                    <p>
                      <strong>Name:</strong> {userEarningsDetail.user?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {userEarningsDetail.user?.email}
                    </p>
                    <p>
                      <strong>Type:</strong> {userEarningsDetail.user?.type}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="summary-section">
                  <h4>Earnings Summary</h4>
                  <div className="summary-grid">
                    <div className="summary-card">
                      <span>Total Earnings</span>
                      <strong>
                        ${userEarningsDetail.summary?.total_earnings || 0}
                      </strong>
                    </div>
                    <div className="summary-card">
                      <span>Paid Earnings</span>
                      <strong>
                        ${userEarningsDetail.summary?.paid_earnings || 0}
                      </strong>
                    </div>
                    <div className="summary-card">
                      <span>Pending Earnings</span>
                      <strong>
                        ${userEarningsDetail.summary?.pending_earnings || 0}
                      </strong>
                    </div>
                    <div className="summary-card">
                      <span>Total Transactions</span>
                      <strong>
                        {userEarningsDetail.summary?.total_transactions || 0}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Earnings List */}
                {userEarningsDetail.earnings &&
                  userEarningsDetail.earnings.length > 0 && (
                    <div className="earnings-detail-section">
                      <h4>Recent Transactions</h4>
                      <div className="earnings-detail-list">
                        {userEarningsDetail.earnings.map((earning, index) => (
                          <div key={index} className="earning-detail-item">
                            <div className="earning-detail-info">
                              <span className="earning-detail-source">
                                {earning.source?.display}
                              </span>
                              <span className="earning-detail-date">
                                {new Date(
                                  earning.earned_date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="earning-detail-amount">
                              <span
                                className={`earning-detail-status ${earning.status}`}
                              >
                                {earning.status}
                              </span>
                              <strong>${earning.amount?.user_earnings}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="modal-loading">Loading user details...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsPage;
