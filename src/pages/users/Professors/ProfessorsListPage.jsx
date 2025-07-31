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
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              <strong>Location:</strong> {selectedProfessor.location || "N/A"}
            </p>
            <p>
              <strong>Skill Level:</strong>{" "}
              {selectedProfessor.skill_level || "N/A"}
            </p>
            <p>
              <strong>Profile User Type:</strong>{" "}
              {selectedProfessor.profile_user_type || "N/A"}
            </p>
            <p>
              <strong>Provider:</strong> {selectedProfessor.provider || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedProfessor.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Roles:</strong>{" "}
              {selectedProfessor.roles?.join(", ") || "N/A"}
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
                  <strong>ID:</strong>{" "}
                  {selectedProfessor.active_subscription.id}
                </p>
                <p>
                  <strong>Stripe Subscription ID:</strong>{" "}
                  {selectedProfessor.active_subscription.stripe_subscription_id}
                </p>
                <p>
                  <strong>Stripe Customer ID:</strong>{" "}
                  {selectedProfessor.active_subscription.stripe_customer_id}
                </p>
                <p>
                  <strong>Price ID:</strong>{" "}
                  {selectedProfessor.active_subscription.price_id}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(
                    selectedProfessor.active_subscription.start_date
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(
                    selectedProfessor.active_subscription.end_date
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Billing:</strong>{" "}
                  {selectedProfessor.active_subscription.billing_interval}
                </p>
                <p>
                  <strong>Payment Ref:</strong>{" "}
                  {selectedProfessor.active_subscription.payment_reference}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(
                    selectedProfessor.active_subscription.created_at
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Is Active:</strong>{" "}
                  {selectedProfessor.active_subscription.is_active
                    ? "Yes"
                    : "No"}
                </p>
              </>
            ) : (
              <p>No Active Subscription</p>
            )}

            <h3>Subscription History</h3>
            {selectedProfessor.subscription_history?.length > 0 ? (
              selectedProfessor.subscription_history.map((sub, idx) => (
                <div key={sub.id || idx} className="subscription-history-block">
                  <p>
                    <strong>Name:</strong> {sub.subscription_name}
                  </p>
                  <p>
                    <strong>Status:</strong> {sub.payment_status}
                  </p>
                  <p>
                    <strong>ID:</strong> {sub.id}
                  </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(sub.start_date).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(sub.end_date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Billing:</strong> {sub.billing_interval}
                  </p>
                  <p>
                    <strong>Stripe Customer ID:</strong>{" "}
                    {sub.stripe_customer_id}
                  </p>
                  <p>
                    <strong>Stripe Subscription ID:</strong>{" "}
                    {sub.stripe_subscription_id}
                  </p>
                  <p>
                    <strong>Price ID:</strong> {sub.price_id}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(sub.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Is Active:</strong> {sub.is_active ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Payment Ref:</strong> {sub.payment_reference}
                  </p>
                </div>
              ))
            ) : (
              <p>No Subscription History</p>
            )}

            <h3>Subscription Summary</h3>
            {selectedProfessor.subscription_summary ? (
              <>
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
                  <strong>Latest Subscription Date:</strong>
                  {selectedProfessor.subscription_summary
                    .latest_subscription_date
                    ? new Date(
                        selectedProfessor.subscription_summary.latest_subscription_date
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </>
            ) : (
              <p>No Subscription Summary</p>
            )}

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
