import React, { useEffect, useState } from "react";
import { fetchOrganizers } from "../../../services/organizer.service";
import "../Professors/ProfessorsListPage.css";

const OrganizerListPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrganizers(page);
  }, [page]);

  const loadOrganizers = async (pageNum) => {
    try {
      const data = await fetchOrganizers(pageNum);
      console.log("Fetched data:", data);

      // ✅ Safe defaults in case API response is malformed or fails
      setOrganizers(Array.isArray(data?.users) ? data.users : []);
      setPagination(data?.pagination || {});
    } catch (error) {
      console.error("Failed to load organizers:", error);
      setOrganizers([]); // fallback to empty list
      setPagination({});
    }
  };

  return (
    <div className="professors-container">
      <h2 className="professors-title">Organizer List</h2>

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
          {organizers.map((user) => (
            <tr
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{ cursor: "pointer" }}
            >
              <td>{user.email}</td>
              <td>{user.location}</td>
              <td>{user.skill_level}</td>
              <td>{user.active_subscription?.subscription_name || "None"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
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
              <strong>Location:</strong> {selectedUser.location}
            </p>
            <p>
              <strong>Skill Level:</strong> {selectedUser.skill_level}
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

export default OrganizerListPage;
