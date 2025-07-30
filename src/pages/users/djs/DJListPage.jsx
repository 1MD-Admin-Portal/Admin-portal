import React, { useEffect, useState } from "react";
import { fetchDJs } from "../../../services/dj.service";
import "../Professors/ProfessorsListPage.css";

const DJListPage = () => {
  const [djs, setDJs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadDJs(page);
  }, [page]);

  const loadDJs = async (pageNum) => {
    const data = await fetchDJs(pageNum);
    setDJs(Array.isArray(data?.users) ? data.users : []);
    setPagination(data?.pagination || {});
  };

  return (
    <div className="professors-container">
      <h2 className="professors-title">DJ List</h2>

      <table className="professors-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Location</th>
            <th>Skill Level</th>
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {djs.length === 0 ? (
            <tr>
              <td colSpan="4">No DJs found.</td>
            </tr>
          ) : (
            djs.map((user) => (
              <tr
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{ cursor: "pointer" }}
              >
                <td>{user.email}</td>
                <td>{user.location || "N/A"}</td>
                <td>{user.skill_level || "N/A"}</td>
                <td>{user.active_subscription?.subscription_name || "None"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="bulk-actions-bar">
        <button
          className="bulk-approve-btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="bulk-reject-btn"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="reject-modal" onClick={() => setSelectedUser(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Location:</strong> {selectedUser.location || "N/A"}
            </p>
            <p>
              <strong>Skill Level:</strong> {selectedUser.skill_level || "N/A"}
            </p>
            <p>
              <strong>Provider:</strong> {selectedUser.provider}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedUser.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Roles:</strong> {selectedUser.roles.join(", ")}
            </p>

            <h4>Subscription Summary</h4>
            <p>
              <strong>Active Subscription:</strong>{" "}
              {selectedUser.active_subscription?.subscription_name || "None"}
            </p>
            <p>
              <strong>Subscription Count:</strong>{" "}
              {selectedUser.subscription_summary?.subscription_count || 0}
            </p>
            <p>
              <strong>Has Paid:</strong>{" "}
              {selectedUser.subscription_summary?.has_paid_subscription
                ? "Yes"
                : "No"}
            </p>
            <p>
              <strong>Latest Subscription Date:</strong>{" "}
              {selectedUser.subscription_summary?.latest_subscription_date ||
                "N/A"}
            </p>

            <div className="modal-button-group">
              <button
                className="cancel-btn"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DJListPage;
