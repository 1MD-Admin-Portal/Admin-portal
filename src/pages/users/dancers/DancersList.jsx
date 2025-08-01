import React, { useEffect, useState } from "react";
import "../Professors/ProfessorsListPage.css"; // Assuming you have a CSS file for styling
import { fetchUsers } from "../../../services/user.Service";
import "../Dancers/DancersList.css"; // Assuming you have a CSS file for styling

const DancersList = () => {
  const [dancers, setDancers] = useState([]);
  const [selectedDancer, setSelectedDancer] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    const loadDancers = async () => {
      try {
        const data = await fetchUsers(page, 10);
        // ask backend for page
        if (data?.users) {
          console.log("Fetched users:", data.users); // ✅ log fetched entries
          console.log("Pagination info:", data.pagination); // ✅ log pagination too
          setDancers(data.users);
          setPagination(data.pagination); // save pagination info
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error("Error loading dancers:", error);
        setDancers([]);
      }
    };
    loadDancers();
  }, [page]);

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
      <h2 className="professors-title">Dancers List</h2>
      <table className="professors-table">
        <thead>
          <tr>
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
          {dancers.map((dancer) => (
            <tr key={dancer.id} onClick={() => setSelectedDancer(dancer)}>
              <td>{dancer.id}</td>
              <td>{dancer.email}</td>
              <td>{dancer.name}</td>
              <td>{dancer.location}</td>
              <td>{dancer.skill_level}</td>
              <td>{dancer.profile_user_type}</td>
              <td>{dancer.provider}</td>
              <td>{new Date(dancer.created_at).toLocaleString()}</td>
              <td>{dancer.roles?.join(", ")}</td>
              <td>{dancer.active_subscription?.subscription_name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, pagination.totalPages))
          }
          disabled={page >= pagination.totalPages}
        >
          Next
        </button>
      </div>

      {selectedDancer && (
        <div className="modal-overlay" onClick={() => setSelectedDancer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h3>Dancer Details</h3>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="modal-body">
              {/* Basic Information Section */}
              <div className="modal-section">
                <h4>Basic Information</h4>
                {renderInfoGrid([
                  { label: "ID", value: selectedDancer.id },
                  { label: "Name", value: selectedDancer.name },
                  { label: "Email", value: selectedDancer.email },
                  { label: "Location", value: selectedDancer.location },
                  { label: "Skill Level", value: selectedDancer.skill_level },
                  {
                    label: "User Type",
                    value: selectedDancer.profile_user_type,
                  },
                  { label: "Provider", value: selectedDancer.provider },
                  {
                    label: "Created At",
                    value: new Date(selectedDancer.created_at).toLocaleString(),
                  },
                  {
                    label: "Roles",
                    value: selectedDancer.roles?.join(", ") || "None",
                  },
                ])}
              </div>

              {/* Active Subscription Section */}
              <div className="modal-section">
                <h4>Active Subscription</h4>
                {selectedDancer.active_subscription ? (
                  renderInfoGrid([
                    {
                      label: "Subscription Name",
                      value:
                        selectedDancer.active_subscription.subscription_name,
                    },
                    {
                      label: "Status",
                      value: selectedDancer.active_subscription.payment_status,
                      status: selectedDancer.active_subscription.is_active
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "Is Active",
                      value: selectedDancer.active_subscription.is_active
                        ? "Yes"
                        : "No",
                      status: selectedDancer.active_subscription.is_active
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "ID",
                      value: selectedDancer.active_subscription.id,
                    },
                    {
                      label: "Stripe Subscription ID",
                      value:
                        selectedDancer.active_subscription
                          .stripe_subscription_id,
                    },
                    {
                      label: "Stripe Customer ID",
                      value:
                        selectedDancer.active_subscription.stripe_customer_id,
                    },
                    {
                      label: "Price ID",
                      value: selectedDancer.active_subscription.price_id,
                    },
                    {
                      label: "Start Date",
                      value: new Date(
                        selectedDancer.active_subscription.start_date
                      ).toLocaleString(),
                    },
                    {
                      label: "End Date",
                      value: new Date(
                        selectedDancer.active_subscription.end_date
                      ).toLocaleString(),
                    },
                    {
                      label: "Billing Interval",
                      value:
                        selectedDancer.active_subscription.billing_interval,
                    },
                    {
                      label: "Payment Reference",
                      value:
                        selectedDancer.active_subscription.payment_reference,
                    },
                    {
                      label: "Created At",
                      value: selectedDancer.active_subscription.created_at,
                    },
                  ])
                ) : (
                  <div className="empty-state">No Active Subscription</div>
                )}
              </div>

              {/* Subscription History Section */}
              <div className="modal-section">
                <h4>Subscription History</h4>
                {selectedDancer.subscription_history?.length > 0 ? (
                  selectedDancer.subscription_history.map((sub, idx) => (
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
                        { label: "Created At", value: sub.created_at },
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
                <h4>Subscription Summary</h4>
                {selectedDancer.subscription_summary ? (
                  renderInfoGrid([
                    {
                      label: "Total Subscriptions",
                      value:
                        selectedDancer.subscription_summary.subscription_count,
                    },
                    {
                      label: "Active Subscriptions",
                      value:
                        selectedDancer.subscription_summary
                          .active_subscriptions,
                    },
                    {
                      label: "Has Paid Subscription",
                      value: selectedDancer.subscription_summary
                        .has_paid_subscription
                        ? "Yes"
                        : "No",
                      status: selectedDancer.subscription_summary
                        .has_paid_subscription
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "Latest Subscription Date",
                      value: new Date(
                        selectedDancer.subscription_summary.latest_subscription_date
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
                onClick={() => setSelectedDancer(null)}
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

export default DancersList;
