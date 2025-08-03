import React, { useEffect, useState, useRef } from "react";
import {
  approveOrganizerApplication,
  getOrganizerApplications,
  rejectOrganizerApplication,
} from "../../../services/organizer.service";
import "../professors/ProfessorsPage.css";
import { CheckCircle, XCircle } from "lucide-react";

const OrganizersPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [bulkRejectComment, setBulkRejectComment] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const modalRef = useRef(null);

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

  if (loading) return <div className="professors-container">Loading...</div>;

  const pendingApps = applications.filter((a) => a.status === "pending");

  return (
    <div className="professors-container">
      <h1 className="professors-title">Organizer Applications</h1>

      {pendingApps.length > 0 && (
        <div className="bulk-actions-bar">
          <button
            className="bulk-approve-btn"
            onClick={() => setShowConfirm("approve")}
          >
            ✅ Approve All ({pendingApps.length})
          </button>
          <button
            className="bulk-reject-btn"
            onClick={() => setShowConfirm("reject")}
          >
            ❌ Reject All ({pendingApps.length})
          </button>
        </div>
      )}

      <table className="professors-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Email</th>
            <th>Event Types</th>
            <th>Expected Size</th>
            <th>Total Events</th>
            <th>Document</th>
            <th>Status</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td
                className="clickable-email"
                onClick={() => setSelectedApp(app)}
              >
                {app.email}
              </td>
              <td>{formatField(app.event_types)}</td>
              <td>{app.expected_event_size}</td>
              <td>{app.total_organized_event}</td>
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

      {showConfirm === "approve" && (
        <div className="reject-modal">
          <div className="modal-card">
            <h3>Approve all pending applications?</h3>
            <div className="modal-button-group">
              <button
                className="modal-btn submit-approve-btn"
                onClick={async () => {
                  for (const { id } of pendingApps) {
                    await approveOrganizerApplication(id);
                  }
                  setApplications((prev) =>
                    prev.map((a) =>
                      a.status === "pending" ? { ...a, status: "approved" } : a
                    )
                  );
                  setShowConfirm(null);
                }}
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

      {showConfirm === "reject" && (
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
                onClick={async () => {
                  for (const { id } of pendingApps) {
                    await rejectOrganizerApplication(id, bulkRejectComment);
                  }
                  setApplications((prev) =>
                    prev.map((a) =>
                      a.status === "pending"
                        ? {
                            ...a,
                            status: "rejected",
                            comment: bulkRejectComment,
                          }
                        : a
                    )
                  );
                  setBulkRejectComment("");
                  setShowConfirm(null);
                }}
              >
                Yes, Reject All
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
