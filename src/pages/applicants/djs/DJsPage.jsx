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
  const [selectedApplication, setSelectedApplication] = useState(null);

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

  if (loading) return <div className="professors-container">Loading...</div>;

  return (
    <div className="professors-container">
      <h2 className="professors-title">DJ Applications</h2>

      {pendingApps.length > 0 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setShowConfirm("approve")}
          >
            ✅ Approve All
          </button>
          <button
            className="pagination-btn"
            onClick={() => setShowConfirm("reject")}
          >
            ❌ Reject All
          </button>
        </div>
      )}

      <table className="professors-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Email</th>
            <th>Genres</th>
            <th>DJ Type</th>
            <th>Experience</th>
            <th>Frequency</th>
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
              <td>
                <button
                  onClick={() => setSelectedApplication(app)}
                  className="link-button"
                >
                  {app.email}
                </button>
              </td>
              <td>{formatField(app.genres)}</td>
              <td>{app.dj_type}</td>
              <td>{app.dj_experience}</td>
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
                    a.status === "pending" ? { ...a, status: "approved" } : a
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
              className="dj-close-btn"
              onClick={() => setShowConfirm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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

      {selectedApplication && (
        <div
          className="dj-modal-overlay"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="dj-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>DJ Application Details</h3>
            <p>
              <strong>ID:</strong> {selectedApplication.id}
            </p>
            <p>
              <strong>Email:</strong> {selectedApplication.email}
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
            <button
              className="dj-close-btn"
              onClick={() => setSelectedApplication(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DJsPage;
