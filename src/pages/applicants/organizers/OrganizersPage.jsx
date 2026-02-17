import React, { useEffect, useState, useRef } from "react";
import {
  approveOrganizerApplication,
  getOrganizerApplications,
  rejectOrganizerApplication,
} from "../../../services/organizer.service";
import GlobalLoader from "../../../components/common/GlobalLoader";
import "../professors/ProfessorsPage.css";
import { CheckCircle, XCircle } from "lucide-react";

const OrganizersPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // single-reject modal state
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");

  // bulk states & selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkRejectComment, setBulkRejectComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(null); // "approve-all", "reject-all", "approve-selected", "reject-selected"
  const [selectedApp, setSelectedApp] = useState(null);

  const modalRef = useRef(null);
  const selectAllRef = useRef(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getOrganizerApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching organizer applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

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

  const handleApprove = async (id) => {
    try {
      await approveOrganizerApplication(id);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "approved" } : app
        )
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
            : app
        )
      );
      setSelectedRejectId(null);
      setRejectComment("");
    } catch (error) {
      console.error(error);
    }
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
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
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
        pendingApps.map((a) => approveOrganizerApplication(a.id))
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.status === "pending" ? { ...a, status: "approved" } : a
        )
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
        pendingApps.map((a) => rejectOrganizerApplication(a.id, comment))
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.status === "pending" ? { ...a, status: "rejected", comment } : a
        )
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
        selectedIds.map((id) => approveOrganizerApplication(id))
      );
      setApplications((prev) =>
        prev.map((a) =>
          selectedIds.includes(a.id) ? { ...a, status: "approved" } : a
        )
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
        selectedIds.map((id) => rejectOrganizerApplication(id, comment))
      );
      setApplications((prev) =>
        prev.map((a) =>
          selectedIds.includes(a.id) ? { ...a, status: "rejected", comment } : a
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(null);
      setBulkRejectComment("");
      setSelectedIds([]);
    }
  };

  if (loading) return <GlobalLoader text="Loading organizer applications..." />;

  return (
    <div className="professors-container">
      <h1 className="professors-title">Organizer Applications</h1>

      {/* Bulk actions bar:
          - If nothing selected -> show Approve All / Reject All
          - If something selected -> show Approve Selected / Reject Selected (only)
      */}
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
  {app.email}
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
              <td>{app.comment || "-"}</td>
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
              <strong>Email:</strong> {selectedApp.email}
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
            <button onClick={() => setSelectedApp(null)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizersPage;
