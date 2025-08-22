import React, { useEffect, useState, useRef } from "react";
import {
  approveInstructorApplication,
  getInstructorApplications,
  rejectInstructorApplication,
} from "../../../services/professor.service";
import "./ProfessorsPage.css";
import { CheckCircle, XCircle } from "lucide-react";

const ProfessorsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [bulkComment, setBulkComment] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const modalRef = useRef(null);
  const selectAllRef = useRef(null);
  const [showConfirm, setShowConfirm] = useState(null); // "approve-all", "reject-all", "approve-selected", "reject-selected"

  const pendingApps = applications.filter((a) => a.status === "pending");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getInstructorApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching instructor applications:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!selectAllRef.current) return;
    const total = pendingApps.length;
    selectAllRef.current.indeterminate =
      selectedIds.length > 0 && selectedIds.length < total;
    selectAllRef.current.checked = selectedIds.length === total;
  }, [selectedIds, pendingApps]);

  const handleApprove = async (id) => {
    try {
      await approveInstructorApplication(id);
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
      await rejectInstructorApplication(selectedRejectId, rejectComment);
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

  const performApproveAll = async () => {
    try {
      await Promise.all(
        pendingApps.map((a) => approveInstructorApplication(a.id))
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

  const performRejectAll = async () => {
    try {
      await Promise.all(
        pendingApps.map((a) => rejectInstructorApplication(a.id, bulkComment))
      );
      setApplications((prev) =>
        prev.map((a) =>
          a.status === "pending"
            ? { ...a, status: "rejected", comment: bulkComment }
            : a
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(null);
      setBulkComment("");
      setSelectedIds([]);
    }
  };

  const performApproveSelected = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => approveInstructorApplication(id))
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

  const performRejectSelected = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => rejectInstructorApplication(id, bulkComment))
      );
      setApplications((prev) =>
        prev.map((a) =>
          selectedIds.includes(a.id)
            ? { ...a, status: "rejected", comment: bulkComment }
            : a
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(null);
      setBulkComment("");
      setSelectedIds([]);
    }
  };

  const toggleSelectAll = () => {
    const selectable = pendingApps.map((app) => app.id);
    if (selectedIds.length === selectable.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable);
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

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="professors-container">Loading...</div>;

  return (
    <div className="professors-container">
      <h1 className="professors-title">Professor Applications</h1>

      {/* Action bar */}
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
            <th>
              <input
                ref={selectAllRef}
                type="checkbox"
                onChange={toggleSelectAll}
                disabled={pendingApps.length === 0}
              />
            </th>
            <th>ID</th>
            <th>Email</th>
            <th>Dance Styles</th>
            <th>Availability</th>
            <th>Experience</th>
            <th>Document</th>
            <th>Status</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>
                {app.status === "pending" && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(app.id)}
                    onChange={() => toggleSelect(app.id)}
                  />
                )}
              </td>
              <td>{app.id}</td>
              <td
                className="clickable-email"
                onClick={() => setSelectedApp(app)}
              >
                {app.email}
              </td>
              <td>{formatField(app.dance_style)}</td>
              <td>{formatField(app.availability)}</td>
              <td>{app.experience}</td>
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
              <td className={`status ${app.status}`}>{app.status}</td>
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

      {/* Single Reject Modal */}
      {selectedRejectId && (
        <div className="reject-modal" onClick={() => setSelectedRejectId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Application</h3>
            <textarea
              rows="4"
              placeholder="Add a comment for rejection (optional)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setSelectedRejectId(null)}
              >
                Cancel
              </button>
              <button className="modal-btn" onClick={handleReject}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reject Modal (all or selected) */}
      {(showConfirm === "reject-all" || showConfirm === "reject-selected") && (
        <div className="reject-modal" onClick={() => setShowConfirm(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>
              Reject {showConfirm === "reject-all" ? "All Pending" : "Selected"}{" "}
              Applications
            </h3>
            <textarea
              rows="4"
              placeholder="Add a comment for rejection (optional)"
              value={bulkComment}
              onChange={(e) => setBulkComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn"
                onClick={
                  showConfirm === "reject-all"
                    ? performRejectAll
                    : performRejectSelected
                }
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="detail-modal" ref={modalRef}>
            <h3>Application Details</h3>
            <p>
              <strong>ID:</strong> {selectedApp.id}
            </p>
            <p>
              <strong>Email:</strong> {selectedApp.email}
            </p>
            <p>
              <strong>Dance Styles:</strong>{" "}
              {formatField(selectedApp.dance_style)}
            </p>
            <p>
              <strong>Availability:</strong>{" "}
              {formatField(selectedApp.availability)}
            </p>
            <p>
              <strong>Experience:</strong> {selectedApp.experience}
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
            <p>
              <strong>Goal:</strong> {selectedApp.goal}
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

export default ProfessorsPage;
