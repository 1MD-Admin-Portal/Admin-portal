import React, { useEffect, useState } from "react";
import "./EarningsPage.css";
import {
  getEarningsOverviewService,
  getAllEarningsService,
  getUserEarningsDetailService,
  getOpenDisputesService,
  resolveDisputeService,
} from "../../../services/earning.service";

import { X, Eye, Euro, TrendingUp, Users, AlertCircle, ShieldAlert } from "lucide-react";
import GlobalLoader from "../../../components/common/GlobalLoader";
import Pagination from "../../../components/common/Pagination";

const EarningsPage = () => {
  // ── Original state (unchanged) ──────────────────────────────────────────
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
  const [userEarningsDetail, setUserEarningsDetail] = useState({});
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  // ── Tab state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("earnings");

  // ── Disputes state ───────────────────────────────────────────────────────
  const [disputes, setDisputes] = useState([]);
  const [disputesLoading, setDisputesLoading] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [disputeModal, setDisputeModal] = useState(false);
  const [disputeForm, setDisputeForm] = useState({
    admin_response: "",
    resolution_notes: "",
  });
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  const [disputeSearch, setDisputeSearch] = useState("");
  const [disputeAlert, setDisputeAlert] = useState(null); // { type, message }

  // ── Currency formatter (unchanged) ──────────────────────────────────────
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(amount || 0);

  // ── Alerts helper ────────────────────────────────────────────────────────
  const showDisputeAlert = (type, message) => {
    setDisputeAlert({ type, message });
    setTimeout(() => setDisputeAlert(null), 4000);
  };

  // ── Original fetch functions (unchanged) ─────────────────────────────────
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

  const fetchUserDetail = async (userId) => {
    try {
      setLoadingUserDetail(true);
      const userTypes = ["instructor", "dj"];
      const results = {};
      for (const type of userTypes) {
        try {
          const data = await getUserEarningsDetailService(userId, type);
          if (data && data.earnings && data.earnings.length > 0) {
            results[type] = data;
          }
        } catch (error) {
          console.log(`No ${type} earnings found for user ${userId}`);
        }
      }
      setUserEarningsDetail(results);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      setUserEarningsDetail({});
    } finally {
      setLoadingUserDetail(false);
    }
  };

  // ── Disputes fetch ────────────────────────────────────────────────────────
  const fetchDisputes = async () => {
    try {
      setDisputesLoading(true);
      const data = await getOpenDisputesService();
      setDisputes(data?.disputes || data?.data || []);
    } catch (error) {
      console.error("Error fetching disputes:", error);
    } finally {
      setDisputesLoading(false);
    }
  };

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { fetchOverview(); }, []);

  useEffect(() => {
    if (activeTab === "earnings") fetchEarnings();
  }, [page, filters, activeTab]);

  useEffect(() => {
    if (activeTab === "disputes") fetchDisputes();
  }, [activeTab]);

  // ── Original handlers (unchanged) ─────────────────────────────────────────
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleRowClick = async (earning) => {
    setSelectedUser(earning);
    await fetchUserDetail(earning.user.id);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserEarningsDetail({});
  };

  // ── Original computed totals (unchanged) ──────────────────────────────────
  const getTotalRevenue = () =>
    overview?.overview_by_type?.reduce((total, type) => total + (type.total_revenue || 0), 0) || 0;

  const getTotalCreatorEarnings = () =>
    overview?.overview_by_type?.reduce((total, type) => total + (type.total_creator_earnings || 0), 0) || 0;

  const getTotalPendingPayouts = () =>
    overview?.overview_by_type?.reduce((total, type) => total + (type.pending_payouts || 0), 0) || 0;

  const getTotalCompletedPayouts = () =>
    overview?.overview_by_type?.reduce((total, type) => total + (type.completed_payouts || 0), 0) || 0;

  // ── Disputes handlers ─────────────────────────────────────────────────────
  const openDisputeModal = (dispute) => {
    setSelectedDispute(dispute);
    setDisputeForm({ admin_response: "", resolution_notes: "" });
    setDisputeModal(true);
  };

  const closeDisputeModal = () => {
    setDisputeModal(false);
    setSelectedDispute(null);
  };

  const handleResolveDispute = async () => {
    if (!selectedDispute) return;
    if (!disputeForm.admin_response.trim()) {
      showDisputeAlert("error", "Admin response is required.");
      return;
    }
    try {
      setDisputeSubmitting(true);
      const disputeId = selectedDispute.id || selectedDispute.dispute_id;
      await resolveDisputeService(disputeId, {
        admin_response: disputeForm.admin_response,
        resolution_notes: disputeForm.resolution_notes,
      });
      showDisputeAlert("success", "Dispute resolved successfully.");
      closeDisputeModal();
      fetchDisputes();
    } catch {
      showDisputeAlert("error", "Failed to resolve dispute. Please try again.");
    } finally {
      setDisputeSubmitting(false);
    }
  };

  // ── Filtered disputes (client-side search) ────────────────────────────────
  const filteredDisputes = disputes.filter((d) => {
    const q = disputeSearch.toLowerCase();
    return (
      !q ||
      (d.user_name || d.user?.name || "").toLowerCase().includes(q) ||
      (d.reason || d.dispute_reason || "").toLowerCase().includes(q) ||
      String(d.id || d.dispute_id || "").includes(q)
    );
  });

  if (loading && earnings.length === 0) {
    return <GlobalLoader text="Loading earnings..." />;
  }

  return (
    <div className="earnings-mgmt-container">
      <h2 className="earnings-mgmt-title">Earnings Management</h2>

      {/* ── Overview Cards (unchanged) ── */}
      <div className="earnings-mgmt-overview">
        <div className="earnings-mgmt-overview-card">
          <div className="earnings-mgmt-overview-icon"><Euro size={24} /></div>
          <div className="earnings-mgmt-overview-content">
            <h3>Total Revenue</h3>
            <p className="earnings-mgmt-overview-amount">{formatCurrency(getTotalRevenue())}</p>
          </div>
        </div>
        <div className="earnings-mgmt-overview-card">
          <div className="earnings-mgmt-overview-icon"><TrendingUp size={24} /></div>
          <div className="earnings-mgmt-overview-content">
            <h3>Creator Earnings</h3>
            <p className="earnings-mgmt-overview-amount">{formatCurrency(getTotalCreatorEarnings())}</p>
          </div>
        </div>
        <div className="earnings-mgmt-overview-card">
          <div className="earnings-mgmt-overview-icon"><AlertCircle size={24} /></div>
          <div className="earnings-mgmt-overview-content">
            <h3>Pending Payouts</h3>
            <p className="earnings-mgmt-overview-amount earnings-mgmt-pending">
              {formatCurrency(getTotalPendingPayouts())}
            </p>
          </div>
        </div>
        <div className="earnings-mgmt-overview-card">
          <div className="earnings-mgmt-overview-icon"><Users size={24} /></div>
          <div className="earnings-mgmt-overview-content">
            <h3>Completed Payouts</h3>
            <p className="earnings-mgmt-overview-amount earnings-mgmt-completed">
              {formatCurrency(getTotalCompletedPayouts())}
            </p>
          </div>
        </div>
      </div>

      {/* ── Top Earners (unchanged) ── */}
      {overview?.top_earners && overview.top_earners.length > 0 && (
        <div className="earnings-mgmt-top-earners-section">
          <h3>Top Earners</h3>
          <div className="earnings-mgmt-top-earners-grid">
            {overview.top_earners.map((earner, index) => (
              <div key={`earner-${earner.user_id}-${index}`} className="earnings-mgmt-top-earner-card">
                <div className="earnings-mgmt-earner-rank">#{index + 1}</div>
                <div className="earnings-mgmt-earner-info">
                  <h4>{earner.user_name}</h4>
                  <p className="earnings-mgmt-earner-type">{earner.user_type}</p>
                  <p className="earnings-mgmt-earner-stats">
                    {formatCurrency(earner.total_earnings)} • {earner.transaction_count} transactions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Overview by Type (unchanged) ── */}
      {overview?.overview_by_type && overview.overview_by_type.length > 0 && (
        <div className="earnings-mgmt-overview-by-type">
          <h3>Earnings by User Type</h3>
          <div className="earnings-mgmt-type-cards-grid">
            {overview.overview_by_type.map((type, idx) => (
              <div key={`type-${type.user_type}-${idx}`} className="earnings-mgmt-type-card">
                <h4>{type.user_type.toUpperCase()}</h4>
                <div className="earnings-mgmt-type-stats">
                  <p><strong>Revenue:</strong> {formatCurrency(type.total_revenue)}</p>
                  <p><strong>Creator Earnings:</strong> {formatCurrency(type.total_creator_earnings)}</p>
                  <p><strong>Platform Fees:</strong> {formatCurrency(type.total_platform_fees)}</p>
                  <p><strong>Transactions:</strong> {type.total_transactions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB NAVIGATION ══ */}
      <div className="earnings-mgmt-tab-nav">
        <button
          className={`earnings-mgmt-tab-btn ${activeTab === "earnings" ? "active" : ""}`}
          onClick={() => setActiveTab("earnings")}
        >
          <Euro size={15} /> All Earnings
        </button>
        <button
          className={`earnings-mgmt-tab-btn ${activeTab === "disputes" ? "active" : ""}`}
          onClick={() => setActiveTab("disputes")}
        >
          <ShieldAlert size={15} />
          Open Disputes
          {disputes.length > 0 && (
            <span className="earnings-mgmt-tab-badge">{disputes.length}</span>
          )}
        </button>
      </div>

      {/* ══ EARNINGS TAB (original content, unchanged) ══ */}
      {activeTab === "earnings" && (
        <>
          {/* Filters */}
          <div className="earnings-mgmt-filters">
            <select name="user_type" value={filters.user_type} onChange={handleFilterChange} className="earnings-mgmt-filter-select">
              <option value="all">All User Types</option>
              <option value="instructor">Instructor</option>
              <option value="dj">DJ</option>
              <option value="organiser">Organizer</option>
            </select>
            <select name="source_type" value={filters.source_type} onChange={handleFilterChange} className="earnings-mgmt-filter-select">
              <option value="all">All Source Types</option>
              <option value="slot_booking">Slot Booking</option>
              <option value="program_purchase">Program Purchase</option>
              <option value="playlist_purchase">Playlist Purchase</option>
              <option value="package_enrollment">Package Enrollment</option>
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="earnings-mgmt-filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Table */}
          <div className="earnings-mgmt-table-container">
            <table className="earnings-mgmt-table">
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
                    <td colSpan="9" className="earnings-mgmt-no-data">No earnings found</td>
                  </tr>
                ) : (
                  earnings.map((earning, idx) => (
                    <tr key={`earning-${earning.id}-${idx}`} className="earnings-mgmt-table-row">
                      <td>
                        <div className="earnings-mgmt-user-info">
                          <strong>{earning.user.name}</strong>
                          <span className="earnings-mgmt-user-type-label">{earning.user.type}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`earnings-mgmt-user-type-badge earnings-mgmt-${earning.user.type}`}>
                          {earning.user.type}
                        </span>
                      </td>
                      <td>
                        <div className="earnings-mgmt-source-info">
                          <span className="earnings-mgmt-source-type">{earning.source.type.replace("_", " ")}</span>
                          <small>{earning.source.display}</small>
                        </div>
                      </td>
                      <td className="earnings-mgmt-amount-cell">{formatCurrency(earning.amount.total)}</td>
                      <td className="earnings-mgmt-amount-cell earnings-mgmt-user-earnings">{formatCurrency(earning.amount.user_earnings)}</td>
                      <td className="earnings-mgmt-amount-cell earnings-mgmt-platform-fee">{formatCurrency(earning.amount.platform_fee)}</td>
                      <td>
                        <span className={`earnings-mgmt-status-badge earnings-mgmt-${earning.status}`}>
                          {earning.status}
                        </span>
                      </td>
                      <td>{new Date(earning.earned_date).toLocaleDateString()}</td>
                      <td className="earnings-mgmt-actions">
                        <button className="earnings-mgmt-view-btn" onClick={() => handleRowClick(earning)} title="View Details">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={pagination?.total_pages || 1}
            onPageChange={setPage}
            isLoading={loading}
          />
        </>
      )}

      {/* ══ DISPUTES TAB ══ */}
      {activeTab === "disputes" && (
        <div className="earnings-mgmt-disputes-container">

          {/* Disputes header + search */}
          <div className="earnings-mgmt-disputes-header">
            <div className="earnings-mgmt-disputes-header-left">
              <ShieldAlert size={20} className="earnings-mgmt-disputes-icon" />
              <h3>Open Disputes</h3>
              {filteredDisputes.length > 0 && (
                <span className="earnings-mgmt-disputes-count">{filteredDisputes.length}</span>
              )}
            </div>
            <input
              type="text"
              className="earnings-mgmt-disputes-search"
              placeholder="Search by user, reason, or ID…"
              value={disputeSearch}
              onChange={(e) => setDisputeSearch(e.target.value)}
            />
          </div>

          {/* Inline alert inside disputes section */}
          {disputeAlert && (
            <div className={`earnings-mgmt-dispute-alert earnings-mgmt-dispute-alert--${disputeAlert.type}`}>
              <span>{disputeAlert.message}</span>
              <button onClick={() => setDisputeAlert(null)}><X size={14} /></button>
            </div>
          )}

          {/* Body */}
          {disputesLoading ? (
            <div className="earnings-mgmt-disputes-loading">
              <div className="earnings-mgmt-disputes-spinner" />
              <span>Loading disputes…</span>
            </div>
          ) : filteredDisputes.length === 0 ? (
            <div className="earnings-mgmt-disputes-empty">
              <ShieldAlert size={48} className="earnings-mgmt-disputes-empty-icon" />
              <p>{disputeSearch ? "No disputes match your search." : "No open disputes found."}</p>
            </div>
          ) : (
            <div className="earnings-mgmt-disputes-list">
              {filteredDisputes.map((dispute, idx) => {
                const disputeId   = dispute.id || dispute.dispute_id;
                const userName    = dispute.user_name || dispute.user?.name || "—";
                const userType    = dispute.user_type || dispute.user?.type || "";
                const amount      = dispute.amount || dispute.disputed_amount || 0;
                const reason      = dispute.reason || dispute.dispute_reason || "—";
                const status      = dispute.status || "open";
                const createdAt   = dispute.created_at || dispute.disputed_at;
                const description = dispute.description || dispute.details || "";
                const sourceTitle = dispute.source_title || dispute.transaction_title || "";

                return (
                  <div key={`${disputeId}-${idx}`} className="earnings-mgmt-dispute-card">
                    {/* Left accent bar */}
                    <div className="earnings-mgmt-dispute-accent" />

                    <div className="earnings-mgmt-dispute-body">
                      {/* Top row */}
                      <div className="earnings-mgmt-dispute-top">
                        <div className="earnings-mgmt-dispute-user">
                          <div className="earnings-mgmt-dispute-avatar">
                            {(userName).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="earnings-mgmt-dispute-username">{userName}</div>
                            {userType && (
                              <span className={`earnings-mgmt-user-type-badge earnings-mgmt-${userType}`} style={{ fontSize: "11px", padding: "2px 8px" }}>
                                {userType}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="earnings-mgmt-dispute-meta-right">
                          <span className="earnings-mgmt-dispute-status-pill">
                            {status}
                          </span>
                          <span className="earnings-mgmt-dispute-amount">
                            {formatCurrency(amount)}
                          </span>
                          {createdAt && (
                            <span className="earnings-mgmt-dispute-date">
                              {new Date(createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Reason + description */}
                      <div className="earnings-mgmt-dispute-reason-row">
                        <span className="earnings-mgmt-dispute-reason-label">Reason:</span>
                        <span className="earnings-mgmt-dispute-reason-text">{reason}</span>
                      </div>
                      {sourceTitle && (
                        <div className="earnings-mgmt-dispute-reason-row">
                          <span className="earnings-mgmt-dispute-reason-label">Source:</span>
                          <span className="earnings-mgmt-dispute-reason-text">{sourceTitle}</span>
                        </div>
                      )}
                      {description && (
                        <p className="earnings-mgmt-dispute-description">{description}</p>
                      )}

                      {/* Action */}
                      <div className="earnings-mgmt-dispute-actions">
                        <button
                          className="earnings-mgmt-dispute-resolve-btn"
                          onClick={() => openDisputeModal(dispute)}
                        >
                          <ShieldAlert size={14} /> Resolve Dispute
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══ ORIGINAL USER DETAIL MODAL (unchanged) ══ */}
      {selectedUser && (
        <div className="earnings-mgmt-modal-overlay" onClick={closeModal}>
          <div className="earnings-mgmt-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="earnings-mgmt-modal-header">
              <h3>User Earnings Details</h3>
              <button className="earnings-mgmt-modal-close" onClick={closeModal}><X size={20} /></button>
            </div>

            {loadingUserDetail ? (
              <div className="earnings-mgmt-modal-loading">Loading user details...</div>
            ) : (
              <div className="earnings-mgmt-modal-body">
                <div className="earnings-mgmt-user-detail-section">
                  <h4>User Information</h4>
                  <div className="earnings-mgmt-user-detail-grid">
                    <p><strong>Name:</strong> {selectedUser.user?.name}</p>
                    <p><strong>User ID:</strong> {selectedUser.user?.id}</p>
                    <p><strong>Primary Type:</strong> {selectedUser.user?.type}</p>
                  </div>
                </div>

                {Object.keys(userEarningsDetail).length > 0 ? (
                  <div className="earnings-mgmt-earnings-types-wrapper">
                    {Object.entries(userEarningsDetail).map(([userType, data]) => (
                      <div key={userType} className="earnings-mgmt-earnings-type-section">
                        <div className="earnings-mgmt-earnings-type-header">
                          <h4>{userType.charAt(0).toUpperCase() + userType.slice(1)} Earnings</h4>
                          <span className={`earnings-mgmt-user-type-badge earnings-mgmt-${userType}`}>{userType}</span>
                        </div>

                        <div className="earnings-mgmt-user-type-info">
                          <div className="earnings-mgmt-user-detail-grid">
                            <p><strong>Email:</strong> {data.user?.email}</p>
                            <p><strong>Account Type:</strong> {data.user?.type}</p>
                          </div>
                        </div>

                        <div className="earnings-mgmt-modal-summary-section">
                          <h5>Summary</h5>
                          <div className="earnings-mgmt-modal-summary-grid">
                            <div className="earnings-mgmt-modal-summary-card">
                              <span>Total Earnings</span>
                              <strong>{formatCurrency(data.summary?.total_earnings || 0)}</strong>
                            </div>
                            <div className="earnings-mgmt-modal-summary-card">
                              <span>Paid Earnings</span>
                              <strong>{formatCurrency(data.summary?.paid_earnings || 0)}</strong>
                            </div>
                            <div className="earnings-mgmt-modal-summary-card">
                              <span>Pending Earnings</span>
                              <strong>{formatCurrency(data.summary?.pending_earnings || 0)}</strong>
                            </div>
                            <div className="earnings-mgmt-modal-summary-card">
                              <span>Processing</span>
                              <strong>{formatCurrency(data.summary?.processing_earnings || 0)}</strong>
                            </div>
                            <div className="earnings-mgmt-modal-summary-card">
                              <span>Total Transactions</span>
                              <strong>{data.summary?.total_transactions || 0}</strong>
                            </div>
                          </div>
                        </div>

                        {data.earnings && data.earnings.length > 0 && (
                          <div className="earnings-mgmt-modal-earnings-detail-section">
                            <h5>All Transactions ({userType})</h5>
                            <div className="earnings-mgmt-modal-earnings-detail-list">
                              {data.earnings.map((earning, idx) => (
                                <div key={`modal-earning-${earning.id}-${idx}`} className="earnings-mgmt-modal-earning-detail-item">
                                  <div className="earnings-mgmt-modal-earning-detail-info">
                                    <span className="earnings-mgmt-modal-earning-detail-source">{earning.source_title}</span>
                                    <span className="earnings-mgmt-modal-earning-detail-type">
                                      {earning.source_type.replace("_", " ").toUpperCase()}
                                    </span>
                                    <span className="earnings-mgmt-modal-earning-detail-date">
                                      {new Date(earning.earned_at).toLocaleDateString()}
                                      {earning.payout_date && ` • Paid: ${new Date(earning.payout_date).toLocaleDateString()}`}
                                    </span>
                                  </div>
                                  <div className="earnings-mgmt-modal-earning-detail-amount">
                                    <span className={`earnings-mgmt-modal-earning-detail-status earnings-mgmt-${earning.status}`}>
                                      {earning.status}
                                    </span>
                                    <div className="earnings-mgmt-modal-amount-breakdown">
                                      <div className="earnings-mgmt-modal-user-earning">
                                        <small>Your Earning</small>
                                        <strong>{formatCurrency(earning.user_earnings)}</strong>
                                      </div>
                                      <div className="earnings-mgmt-modal-total-amount">
                                        <small>Total Amount</small>
                                        <span>{formatCurrency(earning.total_amount)}</span>
                                      </div>
                                      <div className="earnings-mgmt-modal-platform-fee">
                                        <small>Platform Fee</small>
                                        <span>{formatCurrency(earning.platform_fee)}</span>
                                      </div>
                                      <div className="earnings-mgmt-modal-commission-rate">
                                        <small>Commission Rate</small>
                                        <span>{earning.commission_rate * 100}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="earnings-mgmt-no-earnings-found">
                    <p>No earnings found for this user as instructor or DJ.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ DISPUTE RESOLVE MODAL ══ */}
      {disputeModal && selectedDispute && (
        <div className="earnings-mgmt-modal-overlay" onClick={closeDisputeModal}>
          <div
            className="earnings-mgmt-modal-content"
            style={{ maxWidth: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="earnings-mgmt-modal-header">
              <h3>Resolve Dispute</h3>
              <button className="earnings-mgmt-modal-close" onClick={closeDisputeModal}><X size={20} /></button>
            </div>

            <div className="earnings-mgmt-modal-body">
              {/* Dispute summary */}
              <div className="earnings-mgmt-dispute-modal-summary">
                <div className="earnings-mgmt-dispute-modal-summary-row">
                  <span>User</span>
                  <strong>{selectedDispute.user_name || selectedDispute.user?.name || "—"}</strong>
                </div>
                <div className="earnings-mgmt-dispute-modal-summary-row">
                  <span>Disputed Amount</span>
                  <strong style={{ color: "#dc2626" }}>
                    {formatCurrency(selectedDispute.amount || selectedDispute.disputed_amount || 0)}
                  </strong>
                </div>
                <div className="earnings-mgmt-dispute-modal-summary-row">
                  <span>Reason</span>
                  <strong>{selectedDispute.reason || selectedDispute.dispute_reason || "—"}</strong>
                </div>
                {(selectedDispute.description || selectedDispute.details) && (
                  <div className="earnings-mgmt-dispute-modal-summary-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                    <span>Details</span>
                    <p style={{ margin: 0, fontSize: "0.83rem", color: "#374151", lineHeight: 1.55 }}>
                      {selectedDispute.description || selectedDispute.details}
                    </p>
                  </div>
                )}
              </div>

              {/* Alert inside modal */}
              {disputeAlert && (
                <div className={`earnings-mgmt-dispute-alert earnings-mgmt-dispute-alert--${disputeAlert.type}`} style={{ marginBottom: "1rem" }}>
                  <span>{disputeAlert.message}</span>
                  <button onClick={() => setDisputeAlert(null)}><X size={14} /></button>
                </div>
              )}

              {/* Form fields */}
              <div className="earnings-mgmt-dispute-form">
                <div className="earnings-mgmt-dispute-form-field">
                  <label>Admin Response <span style={{ color: "#dc2626" }}>*</span></label>
                  <textarea
                    rows={3}
                    placeholder="Provide your official response to the dispute…"
                    value={disputeForm.admin_response}
                    onChange={(e) => setDisputeForm({ ...disputeForm, admin_response: e.target.value })}
                    className="earnings-mgmt-dispute-textarea"
                  />
                </div>
                <div className="earnings-mgmt-dispute-form-field">
                  <label>Resolution Notes <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                  <textarea
                    rows={2}
                    placeholder="Internal notes about how the dispute was resolved…"
                    value={disputeForm.resolution_notes}
                    onChange={(e) => setDisputeForm({ ...disputeForm, resolution_notes: e.target.value })}
                    className="earnings-mgmt-dispute-textarea"
                  />
                </div>
              </div>

              {/* Footer actions */}
              <div className="earnings-mgmt-dispute-modal-footer">
                <button className="earnings-mgmt-dispute-cancel-btn" onClick={closeDisputeModal} disabled={disputeSubmitting}>
                  Cancel
                </button>
                <button
                  className="earnings-mgmt-dispute-submit-btn"
                  onClick={handleResolveDispute}
                  disabled={disputeSubmitting}
                >
                  {disputeSubmitting ? "Resolving…" : "Mark as Resolved"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsPage;