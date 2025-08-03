import React, { useEffect, useState } from "react";
import { fetchOrganizers } from "../../../services/organizer.service";
// import "./OrganizerListPage.css";

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
            <th></th>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Location</th>
            <th>Skill Level</th>
            <th>User Type</th>
            <th>Provider</th>
            <th>Created At</th>
            <th>Roles</th>
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((user) => (
            <tr key={user.id} onClick={() => setSelectedUser(user)}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name || "N/A"}</td>
              <td>{user.location || "N/A"}</td>
              <td>{user.skill_level || "N/A"}</td>
              <td>{user.profile_user_type || "N/A"}</td>
              <td>{user.provider || "N/A"}</td>
              <td>{new Date(user.created_at).toLocaleString()}</td>
              <td>{user.roles?.join(", ") || "N/A"}</td>
              <td>{user.active_subscription?.subscription_name || "None"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {pagination.page || page} of {pagination.totalPages || 1}
        </span>
        <button
          className="pagination-btn"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Organizer Details</h3>
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

            <button
              className="modal-close-btn"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerListPage;
