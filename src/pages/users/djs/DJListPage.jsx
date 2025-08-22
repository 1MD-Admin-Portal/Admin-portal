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

  // Helper function to render info items in grid
  const renderInfoGrid = (items) => {
    return (
      <div className="info-grid">
        {items.map((item, index) => (
          <div key={index} className={`info-item ${item.status || ""}`}>
            <div className="info-label">{item.label}</div>
            <div className="info-value">{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="professors-container">
      <h2 className="professors-title">DJ List</h2>
      <table className="professors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
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
                <td>{user.id}</td>
                <td>{user.name}</td>
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
            {/* Modal Header */}
            <div className="modal-header">
              <h2>DJ Details</h2>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="modal-body">
              {/* Basic Information Section */}
              <div className="modal-section">
                <h3>Basic Information</h3>
                {renderInfoGrid([
                  { label: "ID", value: selectedUser.id },
                  { label: "Name", value: selectedUser.name || "N/A" },
                  { label: "Email", value: selectedUser.email },
                  { label: "Location", value: selectedUser.location || "N/A" },
                  {
                    label: "Skill Level",
                    value: selectedUser.skill_level || "N/A",
                  },
                  {
                    label: "User Type",
                    value: selectedUser.profile_user_type || "N/A",
                  },
                  { label: "Provider", value: selectedUser.provider || "N/A" },
                  {
                    label: "Created At",
                    value: new Date(selectedUser.created_at).toLocaleString(),
                  },
                  {
                    label: "Roles",
                    value: selectedUser.roles?.join(", ") || "N/A",
                  },
                ])}
              </div>

              {/* Active Subscription Section */}
              <div className="modal-section">
                <h3>Active Subscription</h3>
                {selectedUser.active_subscription ? (
                  renderInfoGrid([
                    {
                      label: "Subscription Name",
                      value: selectedUser.active_subscription.subscription_name,
                    },
                    {
                      label: "Status",
                      value: selectedUser.active_subscription.payment_status,
                      status: selectedUser.active_subscription.is_active
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "Is Active",
                      value: selectedUser.active_subscription.is_active
                        ? "Yes"
                        : "No",
                      status: selectedUser.active_subscription.is_active
                        ? "status-active"
                        : "status-inactive",
                    },
                    { label: "ID", value: selectedUser.active_subscription.id },
                    {
                      label: "Stripe Subscription ID",
                      value:
                        selectedUser.active_subscription.stripe_subscription_id,
                    },
                    {
                      label: "Stripe Customer ID",
                      value:
                        selectedUser.active_subscription.stripe_customer_id,
                    },
                    {
                      label: "Price ID",
                      value: selectedUser.active_subscription.price_id,
                    },
                    {
                      label: "Start Date",
                      value: new Date(
                        selectedUser.active_subscription.start_date
                      ).toLocaleString(),
                    },
                    {
                      label: "End Date",
                      value: new Date(
                        selectedUser.active_subscription.end_date
                      ).toLocaleString(),
                    },
                    {
                      label: "Billing Interval",
                      value: selectedUser.active_subscription.billing_interval,
                    },
                    {
                      label: "Payment Reference",
                      value: selectedUser.active_subscription.payment_reference,
                    },
                    {
                      label: "Created At",
                      value: new Date(
                        selectedUser.active_subscription.created_at
                      ).toLocaleString(),
                    },
                  ])
                ) : (
                  <div className="empty-state">No Active Subscription</div>
                )}
              </div>

              {/* Subscription History Section */}
              <div className="modal-section">
                <h3>Subscription History</h3>
                {selectedUser.subscription_history?.length > 0 ? (
                  selectedUser.subscription_history.map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      className="subscription-history-block"
                    >
                      {renderInfoGrid([
                        {
                          label: "Subscription Name",
                          value: sub.subscription_name,
                        },
                        {
                          label: "Status",
                          value: sub.payment_status,
                          status: sub.is_active
                            ? "status-active"
                            : "status-inactive",
                        },
                        { label: "ID", value: sub.id },
                        {
                          label: "Is Active",
                          value: sub.is_active ? "Yes" : "No",
                          status: sub.is_active
                            ? "status-active"
                            : "status-inactive",
                        },
                        {
                          label: "Start Date",
                          value: new Date(sub.start_date).toLocaleString(),
                        },
                        {
                          label: "End Date",
                          value: new Date(sub.end_date).toLocaleString(),
                        },
                        {
                          label: "Billing Interval",
                          value: sub.billing_interval,
                        },
                        {
                          label: "Stripe Customer ID",
                          value: sub.stripe_customer_id,
                        },
                        {
                          label: "Stripe Subscription ID",
                          value: sub.stripe_subscription_id,
                        },
                        { label: "Price ID", value: sub.price_id },
                        {
                          label: "Created At",
                          value: new Date(sub.created_at).toLocaleString(),
                        },
                        {
                          label: "Payment Reference",
                          value: sub.payment_reference,
                        },
                      ])}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No Subscription History</div>
                )}
              </div>

              {/* Subscription Summary Section */}
              <div className="modal-section">
                <h3>Subscription Summary</h3>
                {selectedUser.subscription_summary ? (
                  renderInfoGrid([
                    {
                      label: "Total Subscriptions",
                      value:
                        selectedUser.subscription_summary.subscription_count,
                    },
                    {
                      label: "Active Subscriptions",
                      value:
                        selectedUser.subscription_summary.active_subscriptions,
                    },
                    {
                      label: "Has Paid Subscription",
                      value: selectedUser.subscription_summary
                        .has_paid_subscription
                        ? "Yes"
                        : "No",
                      status: selectedUser.subscription_summary
                        .has_paid_subscription
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "Latest Subscription Date",
                      value: new Date(
                        selectedUser.subscription_summary.latest_subscription_date
                      ).toLocaleString(),
                    },
                  ])
                ) : (
                  <div className="empty-state">
                    No Subscription Summary Available
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="modal-close-btn"
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
