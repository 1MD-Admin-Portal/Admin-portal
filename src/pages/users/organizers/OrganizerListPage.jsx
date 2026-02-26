import React, { useEffect, useState } from "react";
import { fetchOrganizers } from "../../../services/organizer.service";
import "../Dancers/DancersList.css"; // Import the dancer CSS for organizer styling
import { maskEmail } from "../../../components/maskEmail";
import GlobalLoader from "../../../components/common/GlobalLoader";
const OrganizerListPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrganizers(page);
  }, [page]);

  const loadOrganizers = async (pageNum) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render info items in grid
  const renderOrganizerInfoGrid = (items) => {
    return (
      <div className="dancer-info-grid">
        {items.map((item, index) => (
          <div key={index} className={`dancer-info-item ${item.status || ""}`}>
            <div className="dancer-info-label">{item.label}</div>
            <div className="dancer-info-value">{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <GlobalLoader text="Loading organizers..." />;

  return (
    <div className="dancers-main-container">
      <h2 className="dancers-page-title">🎪 Organizer List</h2>

      <table className="dancers-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            {/* <th>Location</th> */}
            <th>Create Date</th>
            <th>Skill Level</th>
            <th>Roles</th>
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((user) => (
            <tr key={user.id} onClick={() => setSelectedUser(user)}>
              <td>{user.id}</td>
              <td>{maskEmail(user.email)}</td>
              <td>{user.name || "N/A"}</td>
              <td>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("fr-FR")
                  : "N/A"}
              </td>
              {/* <td>{user.location || "N/A"}</td> */}
              <td>{user.skill_level || "N/A"}</td>
              <td>{user.roles?.join(", ") || "N/A"}</td>
              <td>{user.active_subscription?.subscription_name || "None"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dancers-pagination-controls">
        <button
          className="dancers-pagination-btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="dancers-page-indicator">
          Page {pagination.page || page} of {pagination.totalPages || 1}
        </span>
        <button
          className="dancers-pagination-btn"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <div
          className="dancer-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="dancer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="dancer-modal-header">
              <h3>🎪 Organizer Profile Details</h3>
              <button
                className="dancer-modal-close-x"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Organized in Columns */}
            <div className="dancer-modal-body">
              {/* Left Column */}
              <div className="dancer-modal-column dancer-modal-left">
                {/* Basic Information Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">👤 Basic Information</h4>
                  {renderOrganizerInfoGrid([
                    { label: "ID", value: selectedUser.id },
                    { label: "Name", value: selectedUser.name || "N/A" },
                    { label: "Email", value: maskEmail(selectedUser.email) },
                    {
                      label: "Location",
                      value: selectedUser.location || "N/A",
                    },
                    {
                      label: "Skill Level",
                      value: selectedUser.skill_level || "N/A",
                    },
                    {
                      label: "User Type",
                      value: selectedUser.profile_user_type || "N/A",
                    },
                    {
                      label: "Provider",
                      value: selectedUser.provider || "N/A",
                    },
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
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    💳 Active Subscription
                  </h4>
                  {selectedUser.active_subscription ? (
                    <div className="dancer-subscription-card">
                      {renderOrganizerInfoGrid([
                        {
                          label: "Subscription Name",
                          value:
                            selectedUser.active_subscription.subscription_name,
                        },
                        {
                          label: "Status",
                          value:
                            selectedUser.active_subscription.payment_status,
                          status: selectedUser.active_subscription.is_active
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
                        },
                        {
                          label: "Is Active",
                          value: selectedUser.active_subscription.is_active
                            ? "Yes"
                            : "No",
                          status: selectedUser.active_subscription.is_active
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
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
                          value:
                            selectedUser.active_subscription.billing_interval,
                        },
                      ])}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No Active Subscription
                    </div>
                  )}
                </div>

                {/* Subscription History Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    📈 Subscription History
                  </h4>
                  {selectedUser.subscription_history?.length > 0 ? (
                    <div className="dancer-history-container">
                      {selectedUser.subscription_history.map((sub, idx) => (
                        <div
                          key={sub.id || idx}
                          className="dancer-history-card"
                        >
                          <div className="dancer-history-header">
                            <span className="dancer-history-name">
                              {sub.subscription_name}
                            </span>
                            <span
                              className={`dancer-history-status ${
                                sub.is_active
                                  ? "dancer-status-active"
                                  : "dancer-status-inactive"
                              }`}
                            >
                              {sub.payment_status}
                            </span>
                          </div>
                          <div className="dancer-history-details">
                            <div className="dancer-history-item">
                              <span>Period:</span>{" "}
                              {new Date(sub.start_date).toLocaleDateString()} -{" "}
                              {new Date(sub.end_date).toLocaleDateString()}
                            </div>
                            <div className="dancer-history-item">
                              <span>Billing:</span> {sub.billing_interval}
                            </div>
                            <div className="dancer-history-item">
                              <span>ID:</span> {sub.id}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No Subscription History
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="dancer-modal-column dancer-modal-right">
                {/* Organizer Specific Information Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">🎯 Organizer Details</h4>
                  {renderOrganizerInfoGrid([
                    {
                      label: "Organizer ID",
                      value: selectedUser.active_subscription?.id || "N/A",
                    },
                    {
                      label: "Stripe Subscription ID",
                      value:
                        selectedUser.active_subscription
                          ?.stripe_subscription_id || "N/A",
                    },
                    {
                      label: "Stripe Customer ID",
                      value:
                        selectedUser.active_subscription?.stripe_customer_id ||
                        "N/A",
                    },
                    {
                      label: "Price ID",
                      value:
                        selectedUser.active_subscription?.price_id || "N/A",
                    },
                    {
                      label: "Payment Reference",
                      value:
                        selectedUser.active_subscription?.payment_reference ||
                        "N/A",
                    },
                  ])}
                </div>

                {/* Current Badges Section (if available) */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">🏆 Current Badges</h4>
                  {selectedUser.current_badges &&
                  Object.values(selectedUser.current_badges).some(
                    (badge) => badge !== null
                  ) ? (
                    <div className="dancer-badges-grid">
                      {renderOrganizerInfoGrid([
                        {
                          label: "Dancer Badge",
                          value: selectedUser.current_badges.dancer || "None",
                        },
                        {
                          label: "Instructor Badge",
                          value:
                            selectedUser.current_badges.instructor || "None",
                        },
                        {
                          label: "DJ Badge",
                          value: selectedUser.current_badges.dj || "None",
                        },
                        {
                          label: "Organizer Badge",
                          value:
                            selectedUser.current_badges.organizer || "None",
                        },
                      ])}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No Badges Available
                    </div>
                  )}
                </div>

                {/* Badge Summary Section (if available) */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">📊 Badge Summary</h4>
                  {selectedUser.badge_summary ? (
                    <div className="dancer-summary-card">
                      {renderOrganizerInfoGrid([
                        {
                          label: "Total Badges",
                          value: selectedUser.badge_summary.total_badges,
                        },
                        {
                          label: "Highest Level",
                          value: selectedUser.badge_summary.highest_level,
                        },
                        {
                          label: "Best Commission Rate",
                          value:
                            selectedUser.badge_summary.best_commission_rate,
                        },
                      ])}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No Badge summary available
                    </div>
                  )}
                </div>

                {/* Subscription Summary Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    📋 Subscription Summary
                  </h4>
                  {selectedUser.subscription_summary ? (
                    <div className="dancer-summary-card">
                      {renderOrganizerInfoGrid([
                        {
                          label: "Total Subscriptions",
                          value:
                            selectedUser.subscription_summary
                              .subscription_count,
                        },
                        {
                          label: "Active Subscriptions",
                          value:
                            selectedUser.subscription_summary
                              .active_subscriptions,
                        },
                        {
                          label: "Has Paid Subscription",
                          value: selectedUser.subscription_summary
                            .has_paid_subscription
                            ? "Yes"
                            : "No",
                          status: selectedUser.subscription_summary
                            .has_paid_subscription
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
                        },
                        {
                          label: "Latest Subscription Date",
                          value: new Date(
                            selectedUser.subscription_summary.latest_subscription_date
                          ).toLocaleString(),
                        },
                      ])}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No Subscription Summary Available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="dancer-modal-footer">
              <button
                className="dancer-modal-close-btn"
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