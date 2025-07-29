import React, { useEffect, useState } from "react";
import {
  getDJApplications,
  approveDJApplication,
  rejectDJApplication,
} from "../../../services/dj.service";
import "./DJsPage.css";
import { CheckCircle, XCircle } from "lucide-react";

const DJsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const [bulkRejectComment, setBulkRejectComment] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getDJApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching DJ applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveDJApplication(id);
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

  const pendingApps = applications.filter((a) => a.status === "pending");
  if (loading) return <div className="djs-container">Loading...</div>;

  return (
    <div className="djs-container">
      <h1 className="djs-title">DJ Applications</h1>

      {pendingApps.length > 0 && (
        <div className="bulk-actions-bar">
          <button onClick={() => setShowConfirm("approve")}>
            ✅ Approve All
          </button>
          <button onClick={() => setShowConfirm("reject")}>
            ❌ Reject All
          </button>
        </div>
      )}

      <table className="djs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Genres</th>
            <th>DJ Type</th>
            <th>Experience</th>
            <th>Frequency</th>
            <th>Goal</th>
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
              <td>{formatField(app.genres)}</td>
              <td>{app.dj_type}</td>
              <td>{app.dj_experience}</td>
              <td>{formatField(app.performance_frequency)}</td>
              <td>{app.mail_goal}</td>
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
                className="modal-btn"
                onClick={async () => {
                  for (const { id } of pendingApps) {
                    await approveDJApplication(id);
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
              placeholder="Reason for rejection"
              value={bulkRejectComment}
              onChange={(e) => setBulkRejectComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button
                className="modal-btn"
                disabled={!bulkRejectComment.trim()}
                onClick={async () => {
                  for (const { id } of pendingApps) {
                    await rejectDJApplication(id, bulkRejectComment);
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
                  setShowConfirm(null);
                  setBulkRejectComment("");
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
                className="modal-btn"
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

export default DJsPage;
