import React, { useEffect, useState } from "react";
import {
  approveInstructorApplication,
  getInstructorApplications,
  rejectInstructorApplication,
} from "../services/professor.service";
import "./ProfessorsPage.css";
import { CheckCircle, XCircle } from "lucide-react";

const ProfessorsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(null); // 'approve' | 'reject' | null
  const [bulkRejectComment, setBulkRejectComment] = useState("");

  useEffect(() => {
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
    fetchApplications();
  }, []);

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
      <h1 className="professors-title">Professor Applications</h1>

      {/* Bulk Actions */}
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

      {/* Applications Table */}
      <table className="professors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Dance Styles</th>
            <th>Availability</th>
            <th>Goal</th>
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
              <td>{app.id}</td>
              <td>{app.email}</td>
              <td>{formatField(app.dance_style)}</td>
              <td>{formatField(app.availability)}</td>
              <td>{app.goal}</td>
              <td>{app.experience}</td>
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

      {/* Bulk Confirm Dialog */}
      {showConfirm === "approve" && (
        <div className="reject-modal">
          <div className="modal-card">
            <h3>Approve all pending applications?</h3>
            <div className="modal-button-group">
              <button
                className="modal-btn submit-approve-btn"
                onClick={async () => {
                  for (const { id } of pendingApps) {
                    await approveInstructorApplication(id);
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
                    await rejectInstructorApplication(id, bulkRejectComment);
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

      {/* Single Reject Modal */}
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
    </div>
  );
};

export default ProfessorsPage;
