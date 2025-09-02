import React, { useEffect, useState } from "react";
import { fetchProfessors } from "../../../services/professor.service";
import "./ProfessorsListPage.css";
import { fetchUserBookedDates } from "../../../services/user.Service";
import { getUserBadgesService } from "../../../services/badge.service";

const ProfessorsListPage = () => {
  const [professors, setProfessors] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarData, setCalendarData] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [userBadges, setUserBadges] = useState(null);
  const [loadingBadges, setLoadingBadges] = useState(false);

  useEffect(() => {
    loadProfessors(page);
  }, [page]);

  const loadProfessors = async (pg) => {
    const data = await fetchProfessors(pg);
    setProfessors(data.users || []);
    setPagination(data.pagination || {});
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
      <h2 className="professors-title">All Professors</h2>

      <table className="professors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
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
              onClick={async () => {
                setSelectedProfessor(prof);
                setIsModalOpen(true);

                // fetch calendar when modal opens
                setLoadingCalendar(true);
                try {
                  const data = await fetchUserBookedDates(prof.id, 1, 10);
                  setCalendarData(data);
                } catch (err) {
                  console.error("Failed to load calendar", err);
                  setCalendarData(null);
                }
                setLoadingCalendar(false);
              }}
            >
              <td>{prof.id}</td>
              <td>{prof.name}</td>
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
            {/* Modal Header */}
            <div className="modal-header">
              <h2>Professor Details</h2>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="modal-body">
              {/* Basic Information Section */}
              <div className="modal-section">
                <h3>Basic Information</h3>
                {renderInfoGrid([
                  { label: "ID", value: selectedProfessor.id },
                  { label: "Name", value: selectedProfessor.name || "N/A" },
                  { label: "Email", value: selectedProfessor.email },
                  {
                    label: "Location",
                    value: selectedProfessor.location || "N/A",
                  },
                  {
                    label: "Skill Level",
                    value: selectedProfessor.skill_level || "N/A",
                  },
                  {
                    label: "Profile User Type",
                    value: selectedProfessor.profile_user_type || "N/A",
                  },
                  {
                    label: "Provider",
                    value: selectedProfessor.provider || "N/A",
                  },
                  {
                    label: "Created At",
                    value: new Date(
                      selectedProfessor.created_at
                    ).toLocaleString(),
                  },
                  {
                    label: "Roles",
                    value: selectedProfessor.roles?.join(", ") || "N/A",
                  },
                ])}
              </div>

              {/* Active Subscription Section */}
              <div className="modal-section">
                <h3>Active Subscription</h3>
                {selectedProfessor.active_subscription ? (
                  renderInfoGrid([
                    {
                      label: "Subscription Name",
                      value:
                        selectedProfessor.active_subscription.subscription_name,
                    },
                    {
                      label: "Status",
                      value:
                        selectedProfessor.active_subscription.payment_status,
                      status: selectedProfessor.active_subscription.is_active
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "Is Active",
                      value: selectedProfessor.active_subscription.is_active
                        ? "Yes"
                        : "No",
                      status: selectedProfessor.active_subscription.is_active
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "ID",
                      value: selectedProfessor.active_subscription.id,
                    },
                    {
                      label: "Stripe Subscription ID",
                      value:
                        selectedProfessor.active_subscription
                          .stripe_subscription_id,
                    },
                    {
                      label: "Stripe Customer ID",
                      value:
                        selectedProfessor.active_subscription
                          .stripe_customer_id,
                    },
                    {
                      label: "Price ID",
                      value: selectedProfessor.active_subscription.price_id,
                    },
                    {
                      label: "Start Date",
                      value: new Date(
                        selectedProfessor.active_subscription.start_date
                      ).toLocaleString(),
                    },
                    {
                      label: "End Date",
                      value: new Date(
                        selectedProfessor.active_subscription.end_date
                      ).toLocaleString(),
                    },
                    {
                      label: "Billing Interval",
                      value:
                        selectedProfessor.active_subscription.billing_interval,
                    },
                    {
                      label: "Payment Reference",
                      value:
                        selectedProfessor.active_subscription.payment_reference,
                    },
                    {
                      label: "Created At",
                      value: new Date(
                        selectedProfessor.active_subscription.created_at
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
                {selectedProfessor.subscription_history?.length > 0 ? (
                  selectedProfessor.subscription_history.map((sub, idx) => (
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
                {selectedProfessor.subscription_summary ? (
                  renderInfoGrid([
                    {
                      label: "Total Subscriptions",
                      value:
                        selectedProfessor.subscription_summary
                          .subscription_count,
                    },
                    {
                      label: "Active Subscriptions",
                      value:
                        selectedProfessor.subscription_summary
                          .active_subscriptions,
                    },
                    {
                      label: "Has Paid Subscription",
                      value: selectedProfessor.subscription_summary
                        .has_paid_subscription
                        ? "Yes"
                        : "No",
                      status: selectedProfessor.subscription_summary
                        .has_paid_subscription
                        ? "status-active"
                        : "status-inactive",
                    },
                    {
                      label: "Latest Subscription Date",
                      value: selectedProfessor.subscription_summary
                        .latest_subscription_date
                        ? new Date(
                            selectedProfessor.subscription_summary.latest_subscription_date
                          ).toLocaleString()
                        : "N/A",
                    },
                  ])
                ) : (
                  <div className="empty-state">
                    No Subscription Summary Available
                  </div>
                )}
              </div>
              {/* Calendar Section */}
              <div className="modal-section">
                <h3>Booked Dates & Slots</h3>
                {loadingCalendar ? (
                  <div>Loading calendar...</div>
                ) : calendarData && calendarData.booked_dates?.length > 0 ? (
                  calendarData.booked_dates.map((dateEntry) => (
                    <div key={dateEntry.date} className="calendar-date-block">
                      <strong>{dateEntry.date}</strong> ({dateEntry.total_slots}{" "}
                      slot
                      {dateEntry.total_slots > 1 ? "s" : ""})
                      <ul>
                        {dateEntry.slots.map((slot, idx) => (
                          <li key={idx}>
                            {slot.start_time} - {slot.end_time} (
                            {slot.duration_minutes} mins) • Role:{" "}
                            {slot.user_role} • Other User: {slot.other_user_id}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No booked dates available</div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
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

export default ProfessorsListPage;
