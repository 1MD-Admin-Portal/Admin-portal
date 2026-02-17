// pages/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import GlobalLoader from "../../../components/common/GlobalLoader";
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

  const [reportModalOpen, setReportModalOpen] = useState(false);
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
    <div className="reports-page-dashboard">
      <div className="reports-dashboard-header">
        <div className="reports-header-content">
          <h1 className="reports-page-title">Reports Management</h1>
          <div className="reports-header-stats">
            <div className="reports-stat-card">
              <span className="reports-stat-number">
                {summary?.status_breakdown?.pending || 0}
              </span>
              <span className="reports-stat-label">Pending</span>
            </div>
            <div className="reports-stat-card">
              <span className="reports-stat-number">
                {summary?.status_breakdown?.resolved || 0}
              </span>
              <span className="reports-stat-label">Resolved</span>
            </div>
          </div>
        </div>

        {/* Enhanced Reason Breakdown Section */}
        <div className="reports-reason-breakdown-section">
          <h3 className="reports-reason-breakdown-title">
            <span className="reports-reason-icon">📊</span>
            Report Reason Analytics
          </h3>
          <div className="reports-reason-cards-grid">
            {summary?.reason_breakdown ? (
              Object.entries(summary.reason_breakdown)
                .sort(([, a], [, b]) => b - a) // Sort by count descending
                .map(([reason, count]) => (
                  <div key={reason} className="reports-reason-card">
                    <div className="reports-reason-card-header">
                      <span className="reports-reason-label">
                        {reason
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="reports-reason-count-container">
                      <span className="reports-reason-count">{count}</span>
                      <span className="reports-reason-count-text">
                        {count === 1 ? "report" : "reports"}
                      </span>
                    </div>
                    <div className="reports-reason-progress-bar">
                      <div
                        className="reports-reason-progress-fill"
                        style={{
                          width: `${Math.max(
                            (count /
                              Math.max(
                                ...Object.values(summary.reason_breakdown)
                              )) *
                              100,
                            10
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="reports-reason-empty">
                <span className="reports-reason-empty-icon">📈</span>
                <p className="reports-reason-empty-text">
                  No reason breakdown available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Filter Section */}
      <div className="reports-filter-section">
        <div className="reports-filter-group">
          <label className="reports-filter-label">Filter by Status:</label>
          <select
            className="reports-modern-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="pending">Pending Reports</option>
            <option value="resolved">Resolved Reports</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-data-card">
        <div className="reports-card-header">
          <h2 className="reports-card-title">User Reports</h2>
          <div className="reports-card-badge">{reports.length} items</div>
        </div>
        {loading ? (
          <GlobalLoader text="Loading reports..." />
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-modern-table">
              <thead className="reports-table-header">
                <tr>
                  <th className="reports-table-cell">ID</th>
                  <th className="reports-table-cell">Reason</th>
                  <th className="reports-table-cell">Reporter</th>
                  <th className="reports-table-cell">Reported User</th>
                  <th className="reports-table-cell">Status</th>
                  <th className="reports-table-cell">Date</th>
                  <th className="reports-table-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="reports-table-body">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.report_id} className="reports-table-row">
                      <td className="reports-table-cell">
                        #{report.report_id}
                      </td>
                      <td className="reports-table-cell">
                        <span className="reports-reason-tag">
                          {report.reason}
                        </span>
                      </td>
                      <td className="reports-table-cell">
                        <div className="reports-user-info-cell">
                          <img
                            src={report.reporter.profile_image}
                            alt={report.reporter.name}
                            className="reports-user-avatar"
                          />
                          <span className="reports-user-name">
                            {report.reporter.name}
                          </span>
                        </div>
                      </td>
                      <td className="reports-table-cell">
                        <div className="reports-user-info-cell">
                          <img
                            src={report.reported_user.profile_image}
                            alt={report.reported_user.name}
                            className="reports-user-avatar"
                          />
                          <span className="reports-user-name">
                            {report.reported_user.name}
                          </span>
                        </div>
                      </td>
                      <td className="reports-table-cell">
                        <span
                          className={`reports-status-badge reports-status-${report.status}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="reports-table-cell">
                        <span className="reports-date-text">
                          {new Date(report.reported_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="reports-table-cell">
                        <div className="reports-action-buttons">
                          {report.status === "pending" && (
                            <button
                              className="reports-action-btn reports-resolve-action"
                              onClick={() => handleResolve(report.report_id)}
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            className="reports-action-btn reports-view-action"
                            onClick={() => {
                              setSelectedReport(report);
                              setReportModalOpen(true);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="reports-empty-row">
                    <td colSpan="7" className="reports-empty-cell">
                      <div className="reports-empty-state">
                        <span className="reports-empty-icon">📋</span>
                        <p className="reports-empty-text">No reports found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Reports Pagination */}
        <div className="reports-pagination-controls">
          <button
            className="reports-pagination-btn"
            disabled={pagination.page === 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </button>
          <div className="reports-pagination-info">
            <span className="reports-page-indicator">
              Page {pagination.page} of{" "}
              {Math.ceil(pagination.total / pagination.perPage)}
            </span>
          </div>
          <button
            className="reports-pagination-btn"
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
      <div className="reports-data-card">
        <div className="reports-card-header">
          <h2 className="reports-card-title">User Blocks</h2>
          <div className="reports-card-badge">{blocks.length} items</div>
        </div>
        <div className="reports-table-wrapper">
          <table className="reports-modern-table">
            <thead className="reports-table-header">
              <tr>
                <th className="reports-table-cell">ID</th>
                <th className="reports-table-cell">Reason</th>
                <th className="reports-table-cell">Blocker</th>
                <th className="reports-table-cell">Blocked User</th>
                <th className="reports-table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="reports-table-body">
              {blocks.length > 0 ? (
                blocks.map((block) => (
                  <tr key={block.block_id} className="reports-table-row">
                    <td className="reports-table-cell">#{block.block_id}</td>
                    <td className="reports-table-cell">
                      <span className="reports-reason-tag">{block.reason}</span>
                    </td>
                    <td className="reports-table-cell">
                      <div className="reports-user-info-cell">
                        <img
                          src={block.blocker.profile_image}
                          alt={block.blocker.name}
                          className="reports-user-avatar"
                        />
                        <span className="reports-user-name">
                          {block.blocker.name}
                        </span>
                      </div>
                    </td>
                    <td className="reports-table-cell">
                      <div className="reports-user-info-cell">
                        <img
                          src={block.blocked_user.profile_image}
                          alt={block.blocked_user.name}
                          className="reports-user-avatar"
                        />
                        <span className="reports-user-name">
                          {block.blocked_user.name}
                        </span>
                      </div>
                    </td>
                    <td className="reports-table-cell">
                      <span className="reports-date-text">
                        {new Date(block.blocked_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="reports-empty-row">
                  <td colSpan="5" className="reports-empty-cell">
                    <div className="reports-empty-state">
                      <span className="reports-empty-icon">🚫</span>
                      <p className="reports-empty-text">No blocks found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Blocks Pagination */}
        <div className="reports-pagination-controls">
          <button
            className="reports-pagination-btn"
            disabled={blockPagination.page === 1}
            onClick={() =>
              setBlockPagination((p) => ({ ...p, page: p.page - 1 }))
            }
          >
            Previous
          </button>
          <div className="reports-pagination-info">
            <span className="reports-page-indicator">
              Page {blockPagination.page} of{" "}
              {Math.ceil(blockPagination.total / blockPagination.perPage)}
            </span>
          </div>
          <button
            className="reports-pagination-btn"
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
      {reportModalOpen && selectedReport && (
        <div className="reports-modal-overlay">
          <div className="reports-modal-container">
            <div className="reports-modal-header">
              <h2 className="reports-modal-title">Report Details</h2>
              <button
                onClick={() => setReportModalOpen(false)}
                className="reports-modal-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="reports-modal-body">
              <div className="reports-detail-grid">
                <div className="reports-detail-item">
                  <span className="reports-detail-label">Report ID:</span>
                  <span className="reports-detail-value">
                    #{selectedReport.report_id}
                  </span>
                </div>
                <div className="reports-detail-item">
                  <span className="reports-detail-label">Reason:</span>
                  <span className="reports-reason-tag">
                    {selectedReport.reason}
                  </span>
                </div>
                <div className="reports-detail-item">
                  <span className="reports-detail-label">Status:</span>
                  <span
                    className={`reports-status-badge reports-status-${selectedReport.status}`}
                  >
                    {selectedReport.status}
                  </span>
                </div>
                <div className="reports-detail-item">
                  <span className="reports-detail-label">Date:</span>
                  <span className="reports-detail-value">
                    {new Date(selectedReport.reported_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedReport.details && (
                <div className="reports-detail-section">
                  <h3 className="reports-section-title">Additional Details</h3>
                  <p className="reports-detail-description">
                    {selectedReport.details}
                  </p>
                </div>
              )}

              <div className="reports-users-section">
                <div className="reports-user-profile">
                  <h3 className="reports-section-title">Reporter</h3>
                  <div className="reports-profile-info">
                    <img
                      src={selectedReport.reporter.profile_image}
                      alt={selectedReport.reporter.name}
                      className="reports-profile-avatar"
                    />
                    <div className="reports-profile-details">
                      <span className="reports-profile-name">
                        {selectedReport.reporter.name}
                      </span>
                      <span className="reports-profile-email">
                        {selectedReport.reporter.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="reports-user-profile">
                  <h3 className="reports-section-title">Reported User</h3>
                  <div className="reports-profile-info">
                    <img
                      src={selectedReport.reported_user.profile_image}
                      alt={selectedReport.reported_user.name}
                      className="reports-profile-avatar"
                    />
                    <div className="reports-profile-details">
                      <span className="reports-profile-name">
                        {selectedReport.reported_user.name}
                      </span>
                      <span className="reports-profile-email">
                        {selectedReport.reported_user.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reports-modal-footer">
              <button
                onClick={() => setReportModalOpen(false)}
                className="reports-modal-action-btn reports-modal-secondary"
              >
                Close
              </button>
              {selectedReport.status === "pending" && (
                <button
                  className="reports-modal-action-btn reports-modal-primary"
                  onClick={() => {
                    handleResolve(selectedReport.report_id);
                    setReportModalOpen(false);
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
