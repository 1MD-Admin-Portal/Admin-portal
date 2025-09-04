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
    <div className="reports-page">
      <h2>Reports Management</h2>

      {/* Filters */}
      <div className="filters">
        <label>Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="table-container">
        <h3>Reports</h3>
        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reason</th>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Status</th>
                <th>Reported At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.report_id}>
                    <td>{report.report_id}</td>
                    <td>{report.reason}</td>
                    <td>
                      <img
                        src={report.reporter.profile_image}
                        alt={report.reporter.name}
                        className="avatar"
                      />
                      {report.reporter.name}
                    </td>
                    <td>
                      <img
                        src={report.reported_user.profile_image}
                        alt={report.reported_user.name}
                        className="avatar"
                      />
                      {report.reported_user.name}
                    </td>
                    <td>{report.status}</td>
                    <td>{new Date(report.reported_at).toLocaleString()}</td>
                    <td>
                      {report.status === "pending" && (
                        <button
                          className="resolve-btn"
                          onClick={() => handleResolve(report.report_id)}
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        className="view-btn"
                        onClick={() => {
                          setSelectedReport(report);
                          setModalOpen(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.perPage)}
          </span>
          <button
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
      <div className="table-container">
        <h3>Blocks</h3>
        <table className="blocks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reason</th>
              <th>Blocker</th>
              <th>Blocked User</th>
              <th>Blocked At</th>
            </tr>
          </thead>
          <tbody>
            {blocks.length > 0 ? (
              blocks.map((block) => (
                <tr key={block.block_id}>
                  <td>{block.block_id}</td>
                  <td>{block.reason}</td>
                  <td>
                    <img
                      src={block.blocker.profile_image}
                      alt={block.blocker.name}
                      className="avatar"
                    />
                    {block.blocker.name}
                  </td>
                  <td>
                    <img
                      src={block.blocked_user.profile_image}
                      alt={block.blocked_user.name}
                      className="avatar"
                    />
                    {block.blocked_user.name}
                  </td>
                  <td>{new Date(block.blocked_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No blocks found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={blockPagination.page === 1}
            onClick={() =>
              setBlockPagination((p) => ({ ...p, page: p.page - 1 }))
            }
          >
            Prev
          </button>
          <span>
            Page {blockPagination.page} of{" "}
            {Math.ceil(blockPagination.total / blockPagination.perPage)}
          </span>
          <button
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
        <div className="modal">
          <div className="modal-content">
            <h3>Report Details</h3>
            <p>
              <strong>ID:</strong> {selectedReport.report_id}
            </p>
            <p>
              <strong>Reason:</strong> {selectedReport.reason}
            </p>
            <p>
              <strong>Details:</strong> {selectedReport.details}
            </p>
            <p>
              <strong>Status:</strong> {selectedReport.status}
            </p>
            <p>
              <strong>Reported At:</strong>{" "}
              {new Date(selectedReport.reported_at).toLocaleString()}
            </p>

            <h4>Reporter</h4>
            <div className="user-info">
              <img
                src={selectedReport.reporter.profile_image}
                alt={selectedReport.reporter.name}
              />
              <span>
                {selectedReport.reporter.name} ({selectedReport.reporter.email})
              </span>
            </div>

            <h4>Reported User</h4>
            <div className="user-info">
              <img
                src={selectedReport.reported_user.profile_image}
                alt={selectedReport.reported_user.name}
              />
              <span>
                {selectedReport.reported_user.name} (
                {selectedReport.reported_user.email})
              </span>
            </div>

            <button onClick={() => setModalOpen(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
