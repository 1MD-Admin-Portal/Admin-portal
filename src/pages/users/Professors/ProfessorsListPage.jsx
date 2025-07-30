import React, { useEffect, useState } from "react";
import { fetchProfessors } from "../../../services/professor.service";
import "./ProfessorsListPage.css";

const ProfessorsListPage = () => {
  const [professors, setProfessors] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProfessors(page);
  }, [page]);

  const loadProfessors = async (pg) => {
    const data = await fetchProfessors(pg);
    setProfessors(data.users || []);
    setPagination(data.pagination || {});
  };

  return (
    <div className="professors-container">
      <h2 className="professors-title">All Professors</h2>

      <table className="professors-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Location</th>
            <th>Skill Level</th>
            <th>Roles</th>
            <th>Active Subscription</th>
            <th>Subscription Name</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((prof) => (
            <tr
              key={prof.id}
              onClick={() => {
                setSelectedProfessor(prof);
                setIsModalOpen(true);
              }}
            >
              <td>{prof.email}</td>
              <td>{prof.location}</td>
              <td>{prof.skill_level}</td>
              <td>{prof.roles.join(", ")}</td>
              <td>
                {prof.active_subscription?.payment_status === "paid"
                  ? "Yes"
                  : "No"}
              </td>
              <td>{prof.active_subscription?.subscription_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="page-indicator">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          className="pagination-btn"
          disabled={page === pagination.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      {isModalOpen && selectedProfessor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Professor Details</h2>

            <p>
              <strong>ID:</strong> {selectedProfessor.id}
            </p>
            <p>
              <strong>Email:</strong> {selectedProfessor.email}
            </p>
            <p>
              <strong>Name:</strong> {selectedProfessor.name || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {selectedProfessor.location}
            </p>
            <p>
              <strong>Skill Level:</strong> {selectedProfessor.skill_level}
            </p>
            <p>
              <strong>Profile User Type:</strong>{" "}
              {selectedProfessor.profile_user_type}
            </p>
            <p>
              <strong>Provider:</strong> {selectedProfessor.provider}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedProfessor.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Roles:</strong> {selectedProfessor.roles?.join(", ")}
            </p>

            <h3>Active Subscription</h3>
            {selectedProfessor.active_subscription ? (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedProfessor.active_subscription.subscription_name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedProfessor.active_subscription.payment_status}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(
                    selectedProfessor.active_subscription.start_date
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(
                    selectedProfessor.active_subscription.end_date
                  ).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p>No active subscription</p>
            )}

            <h3>Subscription Summary</h3>
            <p>
              <strong>Total Subscriptions:</strong>{" "}
              {selectedProfessor.subscription_summary.subscription_count}
            </p>
            <p>
              <strong>Active Subscriptions:</strong>{" "}
              {selectedProfessor.subscription_summary.active_subscriptions}
            </p>
            <p>
              <strong>Has Paid Subscription:</strong>{" "}
              {selectedProfessor.subscription_summary.has_paid_subscription
                ? "Yes"
                : "No"}
            </p>
            <p>
              <strong>Latest Subscription Date:</strong>{" "}
              {selectedProfessor.subscription_summary.latest_subscription_date
                ? new Date(
                    selectedProfessor.subscription_summary.latest_subscription_date
                  ).toLocaleString()
                : "N/A"}
            </p>

            <button
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorsListPage;
