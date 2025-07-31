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
  const [rejectAllOpen, setRejectAllOpen] = useState(false);
  const [bulkComment, setBulkComment] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const modalRef = useRef(null);

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

  const handleApproveSelected = async () => {
    try {
      for (let id of selectedIds) {
        await approveInstructorApplication(id);
      }
      fetchApplications();
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk approval failed:", error);
    }
  };

  const handleRejectSelected = async () => {
    try {
      for (let id of selectedIds) {
        await rejectInstructorApplication(id, bulkComment);
      }
      fetchApplications();
      setSelectedIds([]);
      setBulkComment("");
      setRejectAllOpen(false);
    } catch (error) {
      console.error("Bulk rejection failed:", error);
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

  const pendingApps = applications.filter((a) => a.status === "pending");

  return (
    <div className="professors-container">
      <h1 className="professors-title">Professor Applications</h1>

      {selectedIds.length > 0 && (
        <div className="bulk-actions-bar">
          <button onClick={handleApproveSelected}>Approve Selected</button>
          <button onClick={() => setRejectAllOpen(true)}>
            Reject Selected
          </button>
        </div>
      )}

      <table className="professors-table">
        <thead>
          <tr>
            <th></th>
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

      {/* Bulk Reject Modal */}
      {rejectAllOpen && (
        <div className="reject-modal" onClick={() => setRejectAllOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Selected Applications</h3>
            <textarea
              rows="4"
              placeholder="Add a comment for rejection (optional)"
              value={bulkComment}
              onChange={(e) => setBulkComment(e.target.value)}
            />
            <div className="modal-button-group">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setRejectAllOpen(false)}
              >
                Cancel
              </button>
              <button className="modal-btn" onClick={handleRejectSelected}>
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
