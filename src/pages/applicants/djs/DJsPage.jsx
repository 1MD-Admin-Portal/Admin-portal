import React, { useEffect, useState } from "react";
import {
  getDJApplications,
  approveDJApplication,
  rejectDJApplication,
} from "../../../services/dj.service";
import GlobalLoader from "../../../components/common/GlobalLoader";
import "./DJsPage.css";
import { CheckCircle, XCircle } from "lucide-react";
import { maskEmail } from "../../../components/maskEmail";

const DJsPage = () => {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [bulkRejectComment, setBulkRejectComment] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput,     setSearchInput]     = useState("");
  const [statusInput,     setStatusInput]     = useState("");
  const [dateFromInput,   setDateFromInput]   = useState("");
  const [dateToInput,     setDateToInput]     = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
    page: 1,
  });
  const limit = 10;

  // Debounce filter changes - input updates immediately, fetch waits 300ms
  useEffect(() => {
    const isInitial = !searchInput && !statusInput && !dateFromInput && !dateToInput && filters.page === 1;
    fetchApplications(isInitial);
  }, [filters]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput,
        page: 1,
      }));
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const fetchApplications = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setTableLoading(true);
    try {
      const data = await getDJApplications({
        search: filters.search,
        page: filters.page,
        limit,
        status: filters.status,
        date_from: filters.date_from,
        date_to: filters.date_to,
      });



      // Handle the API response structure
      let applicationsData = [];
      let paginationData = {};

      if (data?.applications && Array.isArray(data.applications)) {
        applicationsData = data.applications;
        paginationData = data.pagination || {};
      } else if (Array.isArray(data)) {
        applicationsData = data;
      } else if (data?.data && Array.isArray(data.data)) {
        applicationsData = data.data;
        paginationData = data.pagination || {};
      }

      setApplications(applicationsData);
      setPagination(paginationData);
    } catch (error) {
      console.error("Error fetching DJ applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveDJApplication(id);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "accepted" } : app
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectDJApplication(selectedRejectId, rejectComment);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedRejectId
            ? { ...app, status: "rejected", comment: rejectComment }
            : app
        )
      );
      setSelectedRejectId(null);
      setRejectComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const formatField = (field) => {
    if (Array.isArray(field)) return field.join(", ");
    if (typeof field === "string" && field.startsWith("[")) {
      try {
        return JSON.parse(field).join(", ");
      } catch {
        return field;
      }
    }
    return field;
  };

  const handleApplyFilters = () => {
    setFilters({
      search: searchInput,
      status: statusInput,
      date_from: dateFromInput,
      date_to: dateToInput,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setStatusInput("");
    setDateFromInput("");
    setDateToInput("");
    setFilters({
      search: "",
      status: "",
      date_from: "",
      date_to: "",
      page: 1,
    });
  };

  const pendingApps = applications.filter((a) => a.status === "pending");

  return (
    <div className="professors-container">
      {loading && <GlobalLoader text="Loading DJ applications..." />}
      <h2 className="professors-title">DJ Applications</h2>


      <div className="pagination-controls">
          {selectedIds.length === 0 ? (
            <>
              <button
                className="pagination-btn"
                onClick={() => setShowConfirm("approve")}
              >
                ✅ Approve All({pendingApps.length})
              </button>
              <button
                className="pagination-btn"
                onClick={() => setShowConfirm("reject")}
              >
                ❌ Reject All({pendingApps.length})
              </button>
            </>
          ) : (
            <>
              <button
                className="pagination-btn"
                onClick={() => setShowConfirm("approve-selected")}
              >
                ✅ Approve Selected
              </button>
              <button
                className="pagination-btn"
                onClick={() => setShowConfirm("reject-selected")}
              >
                ❌ Reject Selected
              </button>
            </>
          )}
        </div>
      {/* Filters Section */}
      <div style={{
        background: "#f8f9ff", padding: "16px", borderRadius: "10px",
        marginBottom: "20px", border: "1px solid rgba(142,92,246,0.15)",
        display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
      }}>
        {/* Search */}
        <div style={{ flex: "1 1 200px" }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: "6px",
              border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ flex: "1 1 150px" }}>
          <select
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: "6px",
              border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
              boxSizing: "border-box", cursor: "pointer",
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Date From */}
        <label style={{ fontSize: "18px", color: "black",fontWeight: "600" }}>From:</label>
        <div style={{ flex: "1 1 150px" }}>
          <input
            type="date"
            value={dateFromInput}
            onChange={(e) => setDateFromInput(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: "6px",
              border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <label style={{ fontSize: "18px", color: "black",fontWeight: "600" }}>To:</label>
        {/* Date To */}
        <div style={{ flex: "1 1 150px" }}>
          <input
            type="date"
            value={dateToInput}
            onChange={(e) => setDateToInput(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: "6px",
              border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Apply & Clear Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleApplyFilters}
            style={{
              padding: "8px 16px", borderRadius: "6px",
              background: "linear-gradient(135deg, #6c3de8, #ec4899)",
              color: "white", border: "none", cursor: "pointer",
              fontWeight: "600", fontSize: "13px",
            }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            style={{
              padding: "8px 16px", borderRadius: "6px",
              background: "#f0f0f0", color: "#333", border: "1px solid #ddd",
              cursor: "pointer", fontWeight: "600", fontSize: "13px",
            }}
          >
            Clear
          </button>
        </div>
      </div>


      {tableLoading && (
        <div style={{
          padding: "12px 16px", background: "rgba(108, 61, 232, 0.05)",
          borderRadius: "8px", marginBottom: "16px", fontSize: "13px",
          color: "#666", textAlign: "center",
        }}>Loading...</div>
      )}

        

      <table className="professors-table">
        <thead>
          <tr>
            {/* <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(pendingApps.map((app) => app.id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
                checked={
                  selectedIds.length === pendingApps.length &&
                  pendingApps.length > 0
                }
              />
            </th> */}
            <th>ID</th>
            <th>Email</th>
            {/* <th>Genres</th> */}
            {/* <th>DJ Type</th> */}
            <th>Experience</th>
            <th>Frequency</th>
            <th>Document</th>
            {/* <th>Status</th> */}
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>

              {/* <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(app.id)}
                  disabled={app.status !== "pending"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds((prev) => [...prev, app.id]);
                    } else {
                      setSelectedIds((prev) =>
                        prev.filter((id) => id !== app.id)
                      );
                    }
                  }}
                />
              </td> */}
              <td
  onClick={() => setSelectedApplication(app)}
  style={{ cursor: "pointer" }}
>
  {app.id}
</td>

              <td
  onClick={() => setSelectedApplication(app)}
  style={{ cursor: "pointer" }}
>
  {maskEmail(app.email)}
</td>

              {/* <td>{formatField(app.genres)}</td> */}
              {/* <td>{app.dj_type}</td> */}
              <td
  onClick={() => setSelectedApplication(app)}
  style={{ cursor: "pointer" }}
>
  {app.dj_experience}
</td>

              <td>{formatField(app.performance_frequency)}</td>
              <td>
                {app.document_url ? (
                  <a
                    href={app.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "No document"
                )}
              </td>
              {/* <td className={`status ${app.status}`}>{app.status}</td> */}
              <td>{app.comment || "-"}</td>
              
              {/* <td>
                <CheckCircle className={`action-icon ${app.status !== "pending" ? "disabled" : ""}`} onClick={() => app.status === "pending" && handleApprove(app.id) } />

                <XCircle className={`action-icon reject ${app.status !== "pending" ? "disabled" : ""}`} onClick={() => app.status === "pending" && setSelectedRejectId(app.id) } />

              </td> */}
              <td>
              <div className="icon-actions">
                                <CheckCircle
                                  className={`action-icon ${app.status !== "pending" ? "disabled" : ""
                                    }`}
                                  onClick={() =>
                                    app.status === "pending" && handleApprove(app.id)
                                  }
                                />
                                <XCircle
                                  className={`action-icon reject ${app.status !== "pending" ? "disabled" : ""
                                    }`}
                                  onClick={() =>
                                    app.status === "pending" && setSelectedRejectId(app.id)
                                  }
                                />
                              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {applications.length > 0 && (
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "10px", marginTop: "20px", padding: "16px",
        }}>
          <button
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
            disabled={filters.page === 1}
            style={{
              padding: "8px 12px", borderRadius: "6px", border: "1px solid #e0e0e0",
              background: filters.page === 1 ? "#f0f0f0" : "white",
              cursor: filters.page === 1 ? "not-allowed" : "pointer",
              opacity: filters.page === 1 ? 0.6 : 1,
            }}
          >
            ← Previous
          </button>

          <span style={{ fontSize: "14px", fontWeight: "600" }}>
            Page {pagination.page || filters.page} of {pagination.total_pages || 1}
          </span>

          <button
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={(pagination.page || filters.page) >= (pagination.total_pages || 1)}
            style={{
              padding: "8px 12px", borderRadius: "6px", border: "1px solid #e0e0e0",
              background: (pagination.page || filters.page) >= (pagination.total_pages || 1) ? "#f0f0f0" : "white",
              cursor: (pagination.page || filters.page) >= (pagination.total_pages || 1) ? "not-allowed" : "pointer",
              opacity: (pagination.page || filters.page) >= (pagination.total_pages || 1) ? 0.6 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Approve All */}
      {showConfirm === "approve" && (
        <div className="dj-modal-overlay" onClick={() => setShowConfirm(null)}>
          <div
            className="dj-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Approve all pending applications?</h3>
            <button
              className="dj-close-btn"
              onClick={async () => {
                for (const { id } of pendingApps) {
                  await approveDJApplication(id);
                }
                setApplications((prev) =>
                  prev.map((a) =>
                    a.status === "pending" ? { ...a, status: "accepted" } : a
                  )
                );
                setShowConfirm(null);
              }}
            >
              Yes, Approve All
            </button>
            <button
              className="dj-close-btn"
              onClick={() => setShowConfirm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reject All */}
      {showConfirm === "reject" && (
        <div className="dj-modal-overlay" onClick={() => setShowConfirm(null)}>
          <div
            className="dj-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Reject all pending applications</h3>
            <textarea
              rows="4"
              placeholder="Reason for rejection"
              value={bulkRejectComment}
              onChange={(e) => setBulkRejectComment(e.target.value)}
            />
            <button
              className="dj-close-btn"
              disabled={!bulkRejectComment.trim()}
              onClick={async () => {
                for (const { id } of pendingApps) {
                  await rejectDJApplication(id, bulkRejectComment);
                }
                setApplications((prev) =>
                  prev.map((a) =>
                    a.status === "pending"
                      ? { ...a, status: "rejected", comment: bulkRejectComment }
                      : a
                  )
                );
                setShowConfirm(null);
                setBulkRejectComment("");
              }}
            >
              Yes, Reject All
            </button>
            <button
              className="dj-close-btn"
              onClick={() => setShowConfirm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Approve Selected */}
      {showConfirm === "approve-selected" && (
        <div className="dj-modal-overlay" onClick={() => setShowConfirm(null)}>
          <div
            className="dj-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Approve {selectedIds.length} selected applications?</h3>
            <button
              className="dj-close-btn"
              onClick={async () => {
                for (const id of selectedIds) {
                  await approveDJApplication(id);
                }
                setApplications((prev) =>
                  prev.map((a) =>
                    selectedIds.includes(a.id)
                      ? { ...a, status: "accepted" }
                      : a
                  )
                );
                setSelectedIds([]);
                setShowConfirm(null);
              }}
            >
              Yes, Approve Selected
            </button>
            <button
              className="dj-close-btn"
              onClick={() => setShowConfirm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reject Selected */}
      {showConfirm === "reject-selected" && (
        <div className="dj-modal-overlay" onClick={() => setShowConfirm(null)}>
          <div
            className="dj-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Reject {selectedIds.length} selected applications</h3>
            <textarea
              rows="4"
              placeholder="Reason for rejection"
              value={bulkRejectComment}
              onChange={(e) => setBulkRejectComment(e.target.value)}
            />
            <button
              className="dj-close-btn"
              disabled={!bulkRejectComment.trim()}
              onClick={async () => {
                for (const id of selectedIds) {
                  await rejectDJApplication(id, bulkRejectComment);
                }
                setApplications((prev) =>
                  prev.map((a) =>
                    selectedIds.includes(a.id)
                      ? { ...a, status: "rejected", comment: bulkRejectComment }
                      : a
                  )
                );
                setSelectedIds([]);
                setShowConfirm(null);
                setBulkRejectComment("");
              }}
            >
              Yes, Reject Selected
            </button>
            <button
              className="dj-close-btn"
              onClick={() => setShowConfirm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Single reject modal */}
      {selectedRejectId && (
        <div
          className="dj-modal-overlay"
          onClick={() => setSelectedRejectId(null)}
        >
          <div
            className="dj-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Reject Application</h3>
            <textarea
              rows="4"
              placeholder="Add a comment (required)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            <button
              onClick={handleReject}
              className="dj-close-btn"
              disabled={!rejectComment.trim()}
            >
              Submit Rejection
            </button>
            <button
              onClick={() => {
                setSelectedRejectId(null);
                setRejectComment("");
              }}
              className="dj-close-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Application details modal */}
      {selectedApplication && (
        <div
          className="dj-modal-overlay"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="dj-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-icon"
              onClick={() => setSelectedApplication(null)}
            >
              ×
            </button>
            <h3>DJ Application Details</h3>
            <p>
              <strong>ID:</strong> {selectedApplication.id}
            </p>
            <p>
              <strong>Email:</strong> {maskEmail(selectedApplication.email)}
            </p>
            <p>
              <strong>Experience:</strong> {selectedApplication.dj_experience}
            </p>
            <p>
              <strong>Genres:</strong> {formatField(selectedApplication.genres)}
            </p>
            <p>
              <strong>DJ Type:</strong> {selectedApplication.dj_type}
            </p>
            <p>
              <strong>Performance Frequency:</strong>{" "}
              {formatField(selectedApplication.performance_frequency)}
            </p>
            <p>
              <strong>Document Type:</strong>{" "}
              {selectedApplication.document_type}
            </p>
            <p>
              <strong>Document:</strong>{" "}
              {selectedApplication.document_url ? (
                <a
                  href={selectedApplication.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              ) : (
                "No document"
              )}
            </p>
            <p>
              <strong>Status:</strong> {selectedApplication.status}
            </p>
            <p>
              <strong>User ID:</strong> {selectedApplication.user_id}
            </p>
            <p>
              <strong>Main Goal:</strong> {selectedApplication.main_goal}
            </p>
            <p>
              <strong>Comment:</strong> {selectedApplication.comment || "-"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DJsPage;
