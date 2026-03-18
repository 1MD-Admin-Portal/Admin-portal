import React, { useEffect, useState, useRef } from "react";
import {
  approveOrganizerApplication,
  getOrganizerApplications,
  rejectOrganizerApplication,
} from "../../../services/organizer.service";
import GlobalLoader from "../../../components/common/GlobalLoader";
import "../professors/ProfessorsPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../../../components/common/Pagination";
import { CheckCircle, XCircle, Search, Calendar, Filter } from "lucide-react";
import { maskEmail } from "../../../components/maskEmail";
const OrganizersPage = () => {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // single-reject modal state
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");

  // bulk states & selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkRejectComment, setBulkRejectComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(null); // "approve-all", "reject-all", "approve-selected", "reject-selected"
  const [selectedApp, setSelectedApp] = useState(null);

  // Filter states
  const [searchInput, setSearchInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [dateFromInput, setDateFromInput] = useState("");
  const [dateToInput, setDateToInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
    page: 1,
  });
  const limit = 10;

  const modalRef = useRef(null);
  const selectAllRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Debounce filter changes - input updates immediately, fetch waits 300ms
  useEffect(() => {
    const isInitial =
      isInitialLoadRef.current &&
      !filters.search &&
      !filters.status &&
      filters.page === 1;
    if (isInitial) isInitialLoadRef.current = false;
    fetchApplications(isInitial);
  }, [filters]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters((prev) => ({
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
      const data = await getOrganizerApplications({
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
      setPagination({
        ...paginationData,
        totalPages: paginationData.total_pages ?? paginationData.totalPages,
      });
    } catch (error) {
      console.error("Error fetching organizer applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  // click outside detail modal to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setSelectedApp(null);
      }
    };
    if (selectedApp) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedApp]);

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
      date_from: dateFromInput
        ? dateFromInput.toLocaleDateString("en-CA")
        : undefined,
      date_to: dateToInput
        ? dateToInput.toLocaleDateString("en-CA")
        : undefined,
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

  const handleApprove = async (id) => {
    try {
      await approveOrganizerApplication(id);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "accepted" } : app,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrganizerApplication(selectedRejectId, rejectComment);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedRejectId
            ? { ...app, status: "rejected", comment: rejectComment }
            : app,
        ),
      );
      setSelectedRejectId(null);
      setRejectComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMainPaginationChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  // selection helpers
  const pendingApps = applications.filter((a) => a.status === "pending");

  useEffect(() => {
    // update header checkbox indeterminate state
    if (!selectAllRef.current) return;
    const totalPending = pendingApps.length;
    if (totalPending === 0) {
      selectAllRef.current.indeterminate = false;
      selectAllRef.current.checked = false;
    } else {
      selectAllRef.current.indeterminate =
        selectedIds.length > 0 && selectedIds.length < totalPending;
      selectAllRef.current.checked = selectedIds.length === totalPending;
    }
  }, [selectedIds, pendingApps]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const selectable = pendingApps.map((app) => app.id);
    if (selectedIds.length === selectable.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable);
    }
  };

  // Bulk operations
  const performApproveAll = async () => {
    try {
      await Promise.all(
        pendingApps.map((a) => approveOrganizerApplication(a.id)),
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.status === "pending" ? { ...a, status: "accepted" } : a,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(null);
      setSelectedIds([]);
    }
  };

  const performRejectAll = async (comment) => {
    try {
      await Promise.all(
        pendingApps.map((a) => rejectOrganizerApplication(a.id, comment)),
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.status === "pending" ? { ...a, status: "rejected", comment } : a,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(null);
      setBulkRejectComment("");
      setSelectedIds([]);
    }
  };

  const performApproveSelected = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => approveOrganizerApplication(id)),
      );
      setApplications((prev) =>
        prev.map((a) =>
          selectedIds.includes(a.id) ? { ...a, status: "accepted" } : a,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(null);
      setSelectedIds([]);
    }
  };

  const performRejectSelected = async (comment) => {
    try {
      await Promise.all(
        selectedIds.map((id) => rejectOrganizerApplication(id, comment)),
      );
      setApplications((prev) =>
        prev.map((a) =>
          selectedIds.includes(a.id)
            ? { ...a, status: "rejected", comment }
            : a,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(null);
      setBulkRejectComment("");
      setSelectedIds([]);
    }
  };

  return (
    <div className="professors-container">
      {loading && <GlobalLoader text="Loading organizer applications..." />}
      <h1 className="professors-title">🎪 Organizer Applications</h1>

      <div className="bulk-actions-bar">
        {selectedIds.length === 0 ? (
          <>
            <button
              className="bulk-approve-btn"
              onClick={() => setShowConfirm("approve-all")}
            >
              ✅ Approve All ({pendingApps.length})
            </button>
            <button
              className="bulk-reject-btn"
              onClick={() => setShowConfirm("reject-all")}
            >
              ❌ Reject All ({pendingApps.length})
            </button>
          </>
        ) : (
          <>
            <button
              className="bulk-approve-btn"
              onClick={() => setShowConfirm("approve-selected")}
            >
              ✅ Approve Selected ({selectedIds.length})
            </button>
            <button
              className="bulk-reject-btn"
              onClick={() => setShowConfirm("reject-selected")}
            >
              ❌ Reject Selected ({selectedIds.length})
            </button>
          </>
        )}
      </div>

      {/* Modern SaaS-style filter toolbar */}
      <div className="professors-filter-toolbar">
        <div className="professors-filter-search">
          <Search className="professors-filter-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="professors-filter-input"
          />
        </div>
        <div className="professors-filter-status">
          <Filter className="professors-filter-icon" />
          <select
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
            className="professors-filter-input professors-filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="professors-filter-date">
          <Calendar className="professors-filter-icon" />
          <DatePicker
            selected={dateFromInput}
            onChange={(date) => setDateFromInput(date)}
            onChangeRaw={(e) => e.preventDefault()}
            placeholderText="From"
            className="class-mod-filter-input"
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
        <div className="professors-filter-date">
          <Calendar className="class-mod-filter-icon" />
          <DatePicker
            selected={dateToInput}
            onChange={(date) => setDateToInput(date)}
            minDate={dateFromInput}
            onChangeRaw={(e) => e.preventDefault()}
            placeholderText="To"
            className="class-mod-filter-input"
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
        <button
          onClick={handleApplyFilters}
          className="professors-filter-apply"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="professors-filter-clear"
        >
          Clear
        </button>
      </div>

      {tableLoading && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(108, 61, 232, 0.05)",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#666",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      )}

      {/* Bulk actions bar:
          - If nothing selected -> show Approve All / Reject All
          - If something selected -> show Approve Selected / Reject Selected (only)
      */}

      <table className="professors-table">
        <thead>
          <tr>
            {/* <th> */}
            {/* header checkbox only for pending items */}
            {/* <input
                ref={selectAllRef}
                type="checkbox"
                onChange={toggleSelectAll} */}
            {/* // checked/indeterminate handled via useEffect */}
            {/* disabled={pendingApps.length === 0} */}
            {/* /> */}
            {/* </th> */}
            <th>ID</th>
            <th>Email</th>
            {/* <th>Event Types</th> */}
            <th>Expected Size</th>
            <th>Total Events</th>
            <th>Document</th>
            <th>Created at </th>
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
                  onChange={() => toggleSelect(app.id)}
                  checked={selectedIds.includes(app.id)}
                  disabled={app.status !== "pending"}
                />
              </td> */}

              <td
                onClick={() => setSelectedApp(app)}
                style={{ cursor: "pointer" }}
              >
                {app.id}
              </td>

              <td
                onClick={() => setSelectedApp(app)}
                style={{ cursor: "pointer" }}
              >
                {maskEmail(app.email)}
              </td>

              {/* <td>{formatField(app.event_types)}</td> */}
              <td
                onClick={() => setSelectedApp(app)}
                style={{ cursor: "pointer" }}
              >
                {app.expected_event_size}
              </td>

              <td
                onClick={() => setSelectedApp(app)}
                style={{ cursor: "pointer" }}
              >
                {app.total_organized_event}
              </td>

              <td>
                {app.document_url ? (
                  <a
                    href={app.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    View
                  </a>
                ) : (
                  "No document"
                )}
              </td>
              {/* <td className={`status ${app.status}`}>{app.status}</td> */}
              <td>{new Date(app.created_at).toLocaleDateString("en-GB")}</td>
              <td>{app.comment || "-"}</td>
              <td>
                <div className="icon-actions">
                  <CheckCircle
                    className={`action-icon ${
                      app.status !== "pending" ? "disabled" : ""
                    }`}
                    onClick={() =>
                      app.status === "pending" && handleApprove(app.id)
                    }
                  />
                  <XCircle
                    className={`action-icon reject ${
                      app.status !== "pending" ? "disabled" : ""
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
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handleMainPaginationChange}
          isLoading={loading || tableLoading}
        />
      )}

      {/* Confirm modals */}
      {showConfirm === "approve-all" && (
        <div className="reject-modal">
          <div className="modal-card">
            <h3>Approve all pending applications?</h3>
            <div className="modal-button-group">
              <button
                className="modal-btn submit-approve-btn"
                onClick={performApproveAll}
              >
                Yes, Approve All
              </button>
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm === "reject-all" && (
        <div className="reject-modal">
          <div className="modal-card">
            <h3>Reject all pending applications</h3>
            <textarea
              rows="4"
              placeholder="Enter reason for rejection"
              value={bulkRejectComment}
              onChange={(e) => setBulkRejectComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button
                className="modal-btn submit-reject-btn"
                disabled={!bulkRejectComment.trim()}
                onClick={() => performRejectAll(bulkRejectComment)}
              >
                Yes, Reject All
              </button>
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setShowConfirm(null);
                  setBulkRejectComment("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm === "approve-selected" && (
        <div className="reject-modal">
          <div className="modal-card">
            <h3>Approve selected applications?</h3>
            <div className="modal-button-group">
              <button
                className="modal-btn submit-approve-btn"
                onClick={performApproveSelected}
              >
                Yes, Approve Selected
              </button>
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm === "reject-selected" && (
        <div className="reject-modal">
          <div className="modal-card">
            <h3>Reject selected applications</h3>
            <textarea
              rows="4"
              placeholder="Enter reason for rejection"
              value={bulkRejectComment}
              onChange={(e) => setBulkRejectComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button
                className="modal-btn submit-reject-btn"
                disabled={!bulkRejectComment.trim()}
                onClick={() => performRejectSelected(bulkRejectComment)}
              >
                Yes, Reject Selected
              </button>
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setShowConfirm(null);
                  setBulkRejectComment("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single-reject modal for a single selectedRejectId */}
      {selectedRejectId && (
        <div className="reject-modal">
          <div className="modal-card">
            <h2>Reject Application</h2>
            <textarea
              rows="4"
              placeholder="Add a comment (required)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button
                onClick={handleReject}
                className="modal-btn submit-reject-btn"
                disabled={!rejectComment.trim()}
              >
                Submit Rejection
              </button>
              <button
                onClick={() => {
                  setSelectedRejectId(null);
                  setRejectComment("");
                }}
                className="modal-btn cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="detail-modal" ref={modalRef}>
            <button
              className="modal-close-icon"
              onClick={() => setSelectedApp(null)}
            >
              ×
            </button>
            <h3>Application Details</h3>
            <p>
              <strong>ID:</strong> {selectedApp.id}
            </p>
            <p>
              <strong>Email:</strong> {maskEmail(selectedApp.email)}
            </p>
            <p>
              <strong>Event Types:</strong>{" "}
              {formatField(selectedApp.event_types)}
            </p>
            <p>
              <strong>Expected Size:</strong> {selectedApp.expected_event_size}
            </p>
            <p>
              <strong>Total Organized Events:</strong>{" "}
              {selectedApp.total_organized_event}
            </p>
            <p>
              <strong>Document Type:</strong> {selectedApp.document_type}
            </p>
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
            <p>
              <strong>Status:</strong> {selectedApp.status}
            </p>
            <p>
              <strong>Comment:</strong> {selectedApp.comment || "-"}
            </p>
            {/* <button onClick={() => setSelectedApp(null)} className="close-btn">
              Close
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizersPage;
