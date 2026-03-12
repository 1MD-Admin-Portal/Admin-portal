import React, { useEffect, useState, useRef } from "react";
import {
  approveInstructorApplication,
  getInstructorApplications,
  rejectInstructorApplication,
} from "../../../services/professor.service";
import GlobalLoader from "../../../components/common/GlobalLoader";
import "./ProfessorsPage.css";
import { CheckCircle, XCircle } from "lucide-react";
import { maskEmail } from "../../../components/maskEmail";
// ─── Confirmation Popup ───────────────────────────────────────────────────────
const ConfirmPopup = ({ title, confirmLabel = "Confirm", onConfirm, onCancel, children }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "1rem",
  }} onClick={onCancel}>
    <div style={{
      background: "white", borderRadius: "20px", padding: "2rem 2.5rem",
      maxWidth: "420px", width: "100%",
      boxShadow: "0 20px 60px rgba(108,61,232,0.18)",
    }} onClick={e => e.stopPropagation()}>
      <h3 style={{
        fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1.25rem",
        background: "linear-gradient(135deg, #6c3de8, #ec4899)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>{title}</h3>

      {children}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button onClick={onConfirm} style={{
          padding: "0.65rem 1.5rem", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #6c3de8, #ec4899)",
          color: "white", fontWeight: 700, fontSize: "0.9rem",
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(236,72,153,0.35)",
        }}>
          {confirmLabel}
        </button>
        <button onClick={onCancel} style={{
          padding: "0.65rem 1.5rem", borderRadius: "10px",
          border: "none", background: "#6b7280",
          color: "white", fontWeight: 600, fontSize: "0.9rem",
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProfessorsPage = () => {
  const [applications,    setApplications]    = useState([]);
  const [pagination,      setPagination]      = useState({});
  const [loading,         setLoading]         = useState(true);
  const [tableLoading,    setTableLoading]    = useState(false);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment,   setRejectComment]   = useState("");
  const [bulkComment,     setBulkComment]     = useState("");
  const [selectedIds,     setSelectedIds]     = useState([]);
  const [selectedApp,     setSelectedApp]     = useState(null);
  const [showConfirm,     setShowConfirm]     = useState(null);
  const [searchInput,     setSearchInput]     = useState("");
  const [statusInput,     setStatusInput]     = useState("");
  const [dateFromInput,   setDateFromInput]   = useState("");
  const [dateToInput,     setDateToInput]     = useState("");
  const [filters,         setFilters]         = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
    page: 1,
  });
  const limit = 10;
  const modalRef    = useRef(null);
  const selectAllRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const pendingApps = applications.filter(a => a.status === "pending");

  useEffect(() => {
    const isInitial = isInitialLoadRef.current && !filters.search && !filters.status && filters.page === 1;
    if (isInitial) isInitialLoadRef.current = false;
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
      const data = await getInstructorApplications({
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

      if (data?.application && Array.isArray(data.application)) {
        applicationsData = data.application;
        paginationData = data.pagination || {};
      } else if (Array.isArray(data)) {
        applicationsData = data;
      } else if (data?.data && Array.isArray(data.data)) {
        applicationsData = data.data;
        paginationData = data.pagination || {};
      }

      setApplications(applicationsData);
      setPagination(paginationData);
    } catch (err) {
      console.error("Error fetching instructor applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setSelectedApp(null);
    };
    if (selectedApp) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedApp]);

  useEffect(() => {
    if (!selectAllRef.current) return;
    const total = pendingApps.length;
    selectAllRef.current.indeterminate = selectedIds.length > 0 && selectedIds.length < total;
    selectAllRef.current.checked = selectedIds.length === total;
  }, [selectedIds, pendingApps]);

  const handleApprove = async (id) => {
    try {
      await approveInstructorApplication(id);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "approved" } : a));
    } catch (err) { console.error(err); }
  };

  const handleReject = async () => {
    try {
      await rejectInstructorApplication(selectedRejectId, rejectComment);
      setApplications(prev => prev.map(a =>
        a.id === selectedRejectId ? { ...a, status: "rejected", comment: rejectComment } : a
      ));
      setSelectedRejectId(null);
      setRejectComment("");
    } catch (err) { console.error(err); }
  };

  const performApproveAll = async () => {
    try {
      await Promise.all(pendingApps.map(a => approveInstructorApplication(a.id)));
      setApplications(prev => prev.map(a => a.status === "pending" ? { ...a, status: "approved" } : a));
    } catch (err) { console.error(err); }
    finally { setShowConfirm(null); setSelectedIds([]); }
  };

  const performRejectAll = async () => {
    try {
      await Promise.all(pendingApps.map(a => rejectInstructorApplication(a.id, bulkComment)));
      setApplications(prev => prev.map(a =>
        a.status === "pending" ? { ...a, status: "rejected", comment: bulkComment } : a
      ));
    } catch (err) { console.error(err); }
    finally { setShowConfirm(null); setBulkComment(""); setSelectedIds([]); }
  };

  const performApproveSelected = async () => {
    try {
      await Promise.all(selectedIds.map(id => approveInstructorApplication(id)));
      setApplications(prev => prev.map(a =>
        selectedIds.includes(a.id) ? { ...a, status: "approved" } : a
      ));
    } catch (err) { console.error(err); }
    finally { setShowConfirm(null); setSelectedIds([]); }
  };

  const performRejectSelected = async () => {
    try {
      await Promise.all(selectedIds.map(id => rejectInstructorApplication(id, bulkComment)));
      setApplications(prev => prev.map(a =>
        selectedIds.includes(a.id) ? { ...a, status: "rejected", comment: bulkComment } : a
      ));
    } catch (err) { console.error(err); }
    finally { setShowConfirm(null); setBulkComment(""); setSelectedIds([]); }
  };

  const toggleSelectAll = () => {
    const selectable = pendingApps.map(a => a.id);
    setSelectedIds(selectedIds.length === selectable.length ? [] : selectable);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const formatField = (field) => {
    if (Array.isArray(field)) return field.join(", ");
    if (typeof field === "string" && field.startsWith("[")) {
      try { return JSON.parse(field).join(", "); } catch { return field; }
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

  return (
    <div className="professors-container">
      {loading && <GlobalLoader text="Loading instructor applications..." />}
      <h1 className="professors-title">Instructor Applications</h1>

      <div className="bulk-actions-bar">
        <button className="bulk-approve-btn" onClick={() => setShowConfirm("approve-all")}>
          ✅ Approve All ({pendingApps.length})
        </button>
        <button className="bulk-reject-btn" onClick={() => setShowConfirm("reject-all")}>
          ❌ Reject All ({pendingApps.length})
        </button>
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

        {/* Date To */}
        <label style={{ fontSize: "18px", color: "black",fontWeight: "600" }}>To:</label>
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

      {/* Action bar */}
      
      <table className="professors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Availability</th>
            <th>Experience</th>
            <th>Document</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td className="clickable-email" onClick={() => setSelectedApp(app)}>{maskEmail(app.email)}</td>
              <td>{formatField(app.availability)}</td>
              <td>{app.experience}</td>
              <td>
                {app.document_url
                  ? <a href={app.document_url} target="_blank" rel="noopener noreferrer">View</a>
                  : "No document"}
              </td>
              <td>{app.comment || "-"}</td>
              <td>
                <div className="icon-actions">
                  <CheckCircle
                    className={`action-icon ${app.status !== "pending" ? "disabled" : ""}`}
                    onClick={() => app.status === "pending" && setShowConfirm({ type: "approve-one", id: app.id })}
                  />
                  <XCircle
                    className={`action-icon reject ${app.status !== "pending" ? "disabled" : ""}`}
                    onClick={() => app.status === "pending" && setSelectedRejectId(app.id)}
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

      {/* ── Approve All Confirm ── */}
      {showConfirm === "approve-all" && (
        <ConfirmPopup
          title="Approve all pending applications?"
          confirmLabel="Yes, Approve All"
          onConfirm={performApproveAll}
          onCancel={() => setShowConfirm(null)}
        />
      )}

      {/* ── Approve Single Confirm ── */}
      {showConfirm?.type === "approve-one" && (
        <ConfirmPopup
          title="Approve this application?"
          confirmLabel="Yes, Approve"
          onConfirm={() => { handleApprove(showConfirm.id); setShowConfirm(null); }}
          onCancel={() => setShowConfirm(null)}
        />
      )}

      {/* ── Reject All Confirm (with comment) ── */}
      {showConfirm === "reject-all" && (
        <ConfirmPopup
          title="Reject all pending applications?"
          confirmLabel="Yes, Reject All"
          onConfirm={performRejectAll}
          onCancel={() => { setShowConfirm(null); setBulkComment(""); }}
        >
          <textarea
            rows={3}
            placeholder="Add a comment for rejection (optional)"
            value={bulkComment}
            onChange={e => setBulkComment(e.target.value)}
            style={{
              width: "100%", padding: "0.625rem 0.75rem",
              border: "1.5px solid #e2e8f0", borderRadius: "10px",
              fontSize: "0.875rem", fontFamily: "inherit",
              resize: "vertical", outline: "none", boxSizing: "border-box",
            }}
          />
        </ConfirmPopup>
      )}

      {/* ── Reject Selected Confirm ── */}
      {showConfirm === "reject-selected" && (
        <ConfirmPopup
          title="Reject selected applications?"
          confirmLabel="Yes, Reject Selected"
          onConfirm={performRejectSelected}
          onCancel={() => { setShowConfirm(null); setBulkComment(""); }}
        >
          <textarea
            rows={3}
            placeholder="Add a comment for rejection (optional)"
            value={bulkComment}
            onChange={e => setBulkComment(e.target.value)}
            style={{
              width: "100%", padding: "0.625rem 0.75rem",
              border: "1.5px solid #e2e8f0", borderRadius: "10px",
              fontSize: "0.875rem", fontFamily: "inherit",
              resize: "vertical", outline: "none", boxSizing: "border-box",
            }}
          />
        </ConfirmPopup>
      )}

      {/* ── Single Reject Modal ── */}
      {selectedRejectId && (
        <div className="reject-modal" onClick={() => setSelectedRejectId(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Reject Application</h3>
            <textarea
              rows="4"
              placeholder="Add a comment for rejection (optional)"
              value={rejectComment}
              onChange={e => setRejectComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button className="modal-btn cancel-btn" onClick={() => setSelectedRejectId(null)}>Cancel</button>
              <button className="modal-btn" onClick={handleReject}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="detail-modal" ref={modalRef}>
            <button className="modal-close-icon" onClick={() => setSelectedApp(null)}>×</button>
            <h3>Application Details</h3>
            <p><strong>ID:</strong> {selectedApp.id}</p>
            <p><strong>Email:</strong> {maskEmail(selectedApp.email)}</p>
            <p><strong>Dance Styles:</strong> {formatField(selectedApp.dance_style)}</p>
            <p><strong>Availability:</strong> {formatField(selectedApp.availability)}</p>
            <p><strong>Experience:</strong> {selectedApp.experience}</p>
            <p><strong>Document Type:</strong> {selectedApp.document_type}</p>
            <p>
              <strong>Document:</strong>{" "}
              {selectedApp.document_url ? (
                <a
                  href={selectedApp.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              ) : (
                "No document"
              )}
            </p>
            <p><strong>Status:</strong> {selectedApp.status}</p>
            <p><strong>Comment:</strong> {selectedApp.comment || "-"}</p>
            <p><strong>Goal:</strong> {selectedApp.goal}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorsPage;
