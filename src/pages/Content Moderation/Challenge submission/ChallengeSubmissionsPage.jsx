import React, { useEffect, useState } from "react";
import "./ChallengeSubmissionsPage.css";
import {
  getChallengeSubmissionsService,
  getPendingSubmissionsService,
  getSubmissionDetailsService,
  approveSubmissionService,
  rejectSubmissionService,
  deleteChallengeSubmissionService,
} from "../../../services/challengeSubmission.service";
import { X, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";

const ChallengeSubmissionsPage = ({ challengeId }) => {
  const [activeTab, setActiveTab] = useState("all"); // all | pending
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      let data;
      if (activeTab === "pending") {
        data = await getPendingSubmissionsService(page, limit);
      } else {
        data = await getChallengeSubmissionsService(challengeId, page, limit);
      }
      setSubmissions(data?.submissions || []);
      setPagination(data?.pagination || {});
    } catch (err) {
      console.error("❌ Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, page]);

  // View Details
  const handleView = async (id) => {
    try {
      const details = await getSubmissionDetailsService(id);
      setSelectedSubmission(details?.submission || null);
      setShowModal(true);
    } catch (err) {
      console.error("❌ Error fetching details:", err);
    }
  };

  // Approve
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this submission?")) return;
    try {
      await approveSubmissionService(id);
      fetchData();
    } catch (err) {
      console.error("❌ Error approving submission:", err);
    }
  };

  // Reject
  const handleReject = async (id) => {
    if (!window.confirm("Reject this submission?")) return;
    try {
      await rejectSubmissionService(id);
      fetchData();
    } catch (err) {
      console.error("❌ Error rejecting submission:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await deleteChallengeSubmissionService(id);
      fetchData();
    } catch (err) {
      console.error("❌ Error deleting submission:", err);
    }
  };

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <h2>Challenge Submissions</h2>
        <div className="tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => {
              setActiveTab("all");
              setPage(1);
            }}
          >
            All Submissions
          </button>
          <button
            className={activeTab === "pending" ? "active" : ""}
            onClick={() => {
              setActiveTab("pending");
              setPage(1);
            }}
          >
            Pending
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading submissions...</p>
      ) : (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Media</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td>{sub.username || "N/A"}</td>
                  <td>{sub.status || "pending"}</td>
                  <td>
                    {sub.video_url ? (
                      <a href={sub.video_url} target="_blank" rel="noreferrer">
                        Watch Video
                      </a>
                    ) : (
                      "No Media"
                    )}
                  </td>
                  <td className="actions">
                    <button onClick={() => handleView(sub.id)}>
                      <Eye size={16} /> View
                    </button>
                    <button
                      className="approve"
                      onClick={() => handleApprove(sub.id)}
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => handleReject(sub.id)}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(sub.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {pagination.pages || 1}
        </span>
        <button
          disabled={page === (pagination.pages || 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Submission Details</h3>
              <X className="close-icon" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <p>
                <strong>ID:</strong> {selectedSubmission.id}
              </p>
              <p>
                <strong>User:</strong> {selectedSubmission.username}
              </p>
              <p>
                <strong>Status:</strong> {selectedSubmission.status}
              </p>
              <div>
                <strong>Media:</strong>{" "}
                {selectedSubmission.video_url ? (
                  <a
                    href={selectedSubmission.video_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch Video
                  </a>
                ) : (
                  "No Media"
                )}
              </div>
              {selectedSubmission.admin_feedback && (
                <p>
                  <strong>Feedback:</strong> {selectedSubmission.admin_feedback}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeSubmissionsPage;
