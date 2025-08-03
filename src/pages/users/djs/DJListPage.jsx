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
            <th></th>
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
      {selectedUser && (
        <div className="reject-modal" onClick={() => setSelectedUser(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>

            <p>
              <strong>ID:</strong> {selectedUser.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedUser.name || "N/A"}
            </p>
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
              <strong>User Type:</strong>{" "}
              {selectedUser.profile_user_type || "N/A"}
            </p>
            <p>
              <strong>Provider:</strong> {selectedUser.provider || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedUser.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Roles:</strong> {selectedUser.roles?.join(", ") || "N/A"}
            </p>

            <h4>Active Subscription</h4>
            {selectedUser.active_subscription ? (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedUser.active_subscription.subscription_name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.active_subscription.payment_status}
                </p>
                <p>
                  <strong>ID:</strong> {selectedUser.active_subscription.id}
                </p>
                <p>
                  <strong>Stripe Subscription ID:</strong>{" "}
                  {selectedUser.active_subscription.stripe_subscription_id}
                </p>
                <p>
                  <strong>Stripe Customer ID:</strong>{" "}
                  {selectedUser.active_subscription.stripe_customer_id}
                </p>
                <p>
                  <strong>Price ID:</strong>{" "}
                  {selectedUser.active_subscription.price_id}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(
                    selectedUser.active_subscription.start_date
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(
                    selectedUser.active_subscription.end_date
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Billing:</strong>{" "}
                  {selectedUser.active_subscription.billing_interval}
                </p>
                <p>
                  <strong>Reference:</strong>{" "}
                  {selectedUser.active_subscription.payment_reference}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(
                    selectedUser.active_subscription.created_at
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Is Active:</strong>{" "}
                  {selectedUser.active_subscription.is_active ? "Yes" : "No"}
                </p>
              </>
            ) : (
              <p>No Active Subscription</p>
            )}

            <h4>Subscription History</h4>
            {selectedUser.subscription_history?.length > 0 ? (
              selectedUser.subscription_history.map((sub, idx) => (
                <div key={sub.id || idx} className="subscription-history-block">
                  <p>
                    <strong>Subscription Name:</strong> {sub.subscription_name}
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

            <h4>Subscription Summary</h4>
            {selectedUser.subscription_summary ? (
              <>
                <p>
                  <strong>Count:</strong>{" "}
                  {selectedUser.subscription_summary.subscription_count}
                </p>
                <p>
                  <strong>Active:</strong>{" "}
                  {selectedUser.subscription_summary.active_subscriptions}
                </p>
                <p>
                  <strong>Paid:</strong>{" "}
                  {selectedUser.subscription_summary.has_paid_subscription
                    ? "Yes"
                    : "No"}
                </p>
                <p>
                  <strong>Latest:</strong>{" "}
                  {new Date(
                    selectedUser.subscription_summary.latest_subscription_date
                  ).toLocaleString()}
                </p>
              </>
            ) : (
              <p>No Subscription Summary</p>
            )}

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
