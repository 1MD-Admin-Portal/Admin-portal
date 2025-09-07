// pages/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import {
  getReportsService,
  updateReportStatusService,
  getBlocksService,
} from "../../../services/report.service";
import "./ReportsPage.css";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [summary, setSummary] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
  });
  const [blockPagination, setBlockPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // 🔹 Fetch Reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getReportsService({
        status: statusFilter,
        page: pagination.page,
        limit: pagination.perPage,
      });
      setReports(data.reports.data);
      setSummary(data.summary);
      setPagination((prev) => ({
        ...prev,
        total: data.reports.pagination.total,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Blocks
  const fetchBlocks = async () => {
    try {
      const data = await getBlocksService({
        page: blockPagination.page,
        limit: blockPagination.perPage,
      });
      setBlocks(data.blocks.data);
      setBlockPagination((prev) => ({
        ...prev,
        total: data.blocks.pagination.total,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch blocks:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, pagination.page]);

  useEffect(() => {
    fetchBlocks();
  }, [blockPagination.page]);

  // 🔹 Update Report Status
  const handleResolve = async (reportId) => {
    try {
      await updateReportStatusService(reportId, "resolved");
      fetchReports();
    } catch (err) {
      console.error("❌ Failed to resolve report:", err);
    }
  };

  return (
    <div className="reports-dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Reports Management</h1>
        <div className="header-stats">
          <div className="stat-card-r">
            <span className="stat-number">
              {summary?.status_breakdown?.pending || 0}
            </span>
            <span className="stat-label-r">Pending</span>
          </div>
          <div className="stat-card-r">
            <span className="stat-number">
              {summary?.status_breakdown?.resolved || 0}
            </span>
            <span className="stat-label-r">Resolved</span>
          </div>
        </div>
        {/* Reason Breakdown Section */}
        <div className="reason-breakdown">
          <h3 className="reason-breakdown-title">Reason Breakdown</h3>
          <div className="reason-cards">
            {summary?.reason_breakdown ? (
              Object.entries(summary.reason_breakdown).map(
                ([reason, count]) => (
                  <div key={reason} className="reason-card">
                    <span className="reason-label">
                      {reason.replace(/_/g, " ")}
                    </span>
                    <span className="reason-count">{count}</span>
                  </div>
                )
              )
            ) : (
              <p>No reason breakdown available</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-label">Filter by Status:</label>
          <select
            className="modern-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="pending">Pending Reports</option>
            <option value="resolved">Resolved Reports</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">User Reports</h2>
          <div className="card-badge">{reports.length} items</div>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading reports...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="modern-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Reason</th>
                  <th className="table-cell">Reporter</th>
                  <th className="table-cell">Reported User</th>
                  <th className="table-cell">Status</th>
                  <th className="table-cell">Date</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.report_id} className="table-row">
                      <td className="table-cell">#{report.report_id}</td>
                      <td className="table-cell">
                        <span className="reason-tag">{report.reason}</span>
                      </td>
                      <td className="table-cell">
                        <div className="user-info-cell">
                          <img
                            src={report.reporter.profile_image}
                            alt={report.reporter.name}
                            className="user-avatar"
                          />
                          <span className="user-name">
                            {report.reporter.name}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="user-info-cell">
                          <img
                            src={report.reported_user.profile_image}
                            alt={report.reported_user.name}
                            className="user-avatar"
                          />
                          <span className="user-name">
                            {report.reported_user.name}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`status-badge ${report.status}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="date-text">
                          {new Date(report.reported_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="action-buttons">
                          {report.status === "pending" && (
                            <button
                              className="action-btn resolve-action"
                              onClick={() => handleResolve(report.report_id)}
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            className="action-btn view-action"
                            onClick={() => {
                              setSelectedReport(report);
                              setModalOpen(true);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="empty-row">
                    <td colSpan="7" className="empty-cell">
                      <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <p className="empty-text">No reports found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={pagination.page === 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </button>
          <div className="pagination-info">
            <span className="page-indicator">
              Page {pagination.page} of{" "}
              {Math.ceil(pagination.total / pagination.perPage)}
            </span>
          </div>
          <button
            className="pagination-btn"
            disabled={
              pagination.page >=
              Math.ceil(pagination.total / pagination.perPage)
            }
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Blocks Table */}
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">User Blocks</h2>
          <div className="card-badge">{blocks.length} items</div>
        </div>
        <div className="table-wrapper">
          <table className="modern-table">
            <thead className="table-header">
              <tr>
                <th className="table-cell">ID</th>
                <th className="table-cell">Reason</th>
                <th className="table-cell">Blocker</th>
                <th className="table-cell">Blocked User</th>
                <th className="table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {blocks.length > 0 ? (
                blocks.map((block) => (
                  <tr key={block.block_id} className="table-row">
                    <td className="table-cell">#{block.block_id}</td>
                    <td className="table-cell">
                      <span className="reason-tag">{block.reason}</span>
                    </td>
                    <td className="table-cell">
                      <div className="user-info-cell">
                        <img
                          src={block.blocker.profile_image}
                          alt={block.blocker.name}
                          className="user-avatar"
                        />
                        <span className="user-name">{block.blocker.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="user-info-cell">
                        <img
                          src={block.blocked_user.profile_image}
                          alt={block.blocked_user.name}
                          className="user-avatar"
                        />
                        <span className="user-name">
                          {block.blocked_user.name}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="date-text">
                        {new Date(block.blocked_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="5" className="empty-cell">
                    <div className="empty-state">
                      <span className="empty-icon">🚫</span>
                      <p className="empty-text">No blocks found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={blockPagination.page === 1}
            onClick={() =>
              setBlockPagination((p) => ({ ...p, page: p.page - 1 }))
            }
          >
            Previous
          </button>
          <div className="pagination-info">
            <span className="page-indicator">
              Page {blockPagination.page} of{" "}
              {Math.ceil(blockPagination.total / blockPagination.perPage)}
            </span>
          </div>
          <button
            className="pagination-btn"
            disabled={
              blockPagination.page >=
              Math.ceil(blockPagination.total / blockPagination.perPage)
            }
            onClick={() =>
              setBlockPagination((p) => ({ ...p, page: p.page + 1 }))
            }
          >
            Next
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {modalOpen && selectedReport && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Report Details</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Report ID:</span>
                  <span className="detail-value">
                    #{selectedReport.report_id}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reason:</span>
                  <span className="reason-tag">{selectedReport.reason}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${selectedReport.status}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(selectedReport.reported_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedReport.details && (
                <div className="detail-section">
                  <h3 className="section-title">Additional Details</h3>
                  <p className="detail-description">{selectedReport.details}</p>
                </div>
              )}

              <div className="users-section">
                <div className="user-profile">
                  <h3 className="section-title">Reporter</h3>
                  <div className="profile-info">
                    <img
                      src={selectedReport.reporter.profile_image}
                      alt={selectedReport.reporter.name}
                      className="profile-avatar"
                    />
                    <div className="profile-details">
                      <span className="profile-name">
                        {selectedReport.reporter.name}
                      </span>
                      <span className="profile-email">
                        {selectedReport.reporter.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-profile">
                  <h3 className="section-title">Reported User</h3>
                  <div className="profile-info">
                    <img
                      src={selectedReport.reported_user.profile_image}
                      alt={selectedReport.reported_user.name}
                      className="profile-avatar"
                    />
                    <div className="profile-details">
                      <span className="profile-name">
                        {selectedReport.reported_user.name}
                      </span>
                      <span className="profile-email">
                        {selectedReport.reported_user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setModalOpen(false)}
                className="modal-action-btn secondary"
              >
                Close
              </button>
              {selectedReport.status === "pending" && (
                <button
                  className="modal-action-btn primary"
                  onClick={() => {
                    handleResolve(selectedReport.report_id);
                    setModalOpen(false);
                  }}
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
