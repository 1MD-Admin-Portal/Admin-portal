import React, { useEffect, useState } from "react";
import { fetchProfessors } from "../../../services/professor.service";
import "../Dancers/DancersList.css"; // Import the dancer CSS for professor styling
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
  const renderProfessorInfoGrid = (items) => {
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

  return (
    <div className="dancers-main-container">
      <h2 className="dancers-page-title">👨‍🏫 All Professors</h2>

      <table className="dancers-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Skill Level</th>
            <th>Roles</th>
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
              <td>{prof.active_subscription?.subscription_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dancers-pagination-controls">
        <button
          className="dancers-pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="dancers-page-indicator">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          className="dancers-pagination-btn"
          disabled={page === pagination.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedProfessor && (
        <div
          className="dancer-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="dancer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="dancer-modal-header">
              <h3>👨‍🏫 Professor Profile Details</h3>
              <button
                className="dancer-modal-close-x"
                onClick={() => setIsModalOpen(false)}
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
                  {renderProfessorInfoGrid([
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
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    💳 Active Subscription
                  </h4>
                  {selectedProfessor.active_subscription ? (
                    <div className="dancer-subscription-card">
                      {renderProfessorInfoGrid([
                        {
                          label: "Subscription Name",
                          value:
                            selectedProfessor.active_subscription
                              .subscription_name,
                        },
                        {
                          label: "Status",
                          value:
                            selectedProfessor.active_subscription
                              .payment_status,
                          status: selectedProfessor.active_subscription
                            .is_active
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
                        },
                        {
                          label: "Is Active",
                          value: selectedProfessor.active_subscription.is_active
                            ? "Yes"
                            : "No",
                          status: selectedProfessor.active_subscription
                            .is_active
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
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
                            selectedProfessor.active_subscription
                              .billing_interval,
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
                  {selectedProfessor.subscription_history?.length > 0 ? (
                    <div className="dancer-history-container">
                      {selectedProfessor.subscription_history.map(
                        (sub, idx) => (
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
                                {new Date(sub.start_date).toLocaleDateString()}{" "}
                                - {new Date(sub.end_date).toLocaleDateString()}
                              </div>
                              <div className="dancer-history-item">
                                <span>Billing:</span> {sub.billing_interval}
                              </div>
                              <div className="dancer-history-item">
                                <span>ID:</span> {sub.id}
                              </div>
                            </div>
                          </div>
                        )
                      )}
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
                {/* Calendar Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    📅 Booked Dates & Slots
                  </h4>
                  {loadingCalendar ? (
                    <div className="dancer-loading-state">
                      Loading calendar...
                    </div>
                  ) : calendarData && calendarData.booked_dates?.length > 0 ? (
                    <div className="dancer-calendar-list">
                      {calendarData.booked_dates.map((dateEntry) => (
                        <div
                          key={dateEntry.date}
                          className="dancer-calendar-card"
                        >
                          <div className="dancer-calendar-date">
                            {dateEntry.date} ({dateEntry.total_slots} slot
                            {dateEntry.total_slots > 1 ? "s" : ""})
                          </div>
                          <div className="dancer-calendar-slots">
                            {dateEntry.slots.map((slot, idx) => (
                              <div key={idx} className="dancer-slot-item">
                                <span className="dancer-slot-time">
                                  {slot.start_time} - {slot.end_time}
                                </span>
                                <span className="dancer-slot-duration">
                                  ({slot.duration_minutes} mins)
                                </span>
                                <span className="dancer-slot-role">
                                  Role: {slot.user_role}
                                </span>
                                <span className="dancer-slot-user">
                                  Other User: {slot.other_user_id}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No booked dates available
                    </div>
                  )}
                </div>

                {/* Professor Specific Information Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">🎓 Professor Details</h4>
                  {renderProfessorInfoGrid([
                    {
                      label: "Professor ID",
                      value: selectedProfessor.active_subscription?.id || "N/A",
                    },
                    {
                      label: "Stripe Subscription ID",
                      value:
                        selectedProfessor.active_subscription
                          ?.stripe_subscription_id || "N/A",
                    },
                    {
                      label: "Stripe Customer ID",
                      value:
                        selectedProfessor.active_subscription
                          ?.stripe_customer_id || "N/A",
                    },
                    {
                      label: "Price ID",
                      value:
                        selectedProfessor.active_subscription?.price_id ||
                        "N/A",
                    },
                    {
                      label: "Payment Reference",
                      value:
                        selectedProfessor.active_subscription
                          ?.payment_reference || "N/A",
                    },
                  ])}
                </div>

                {/* Current Badges Section (if available) */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">🏆 Current Badges</h4>
                  {selectedProfessor.current_badges &&
                  Object.values(selectedProfessor.current_badges).some(
                    (badge) => badge !== null
                  ) ? (
                    <div className="dancer-badges-grid">
                      {renderProfessorInfoGrid([
                        {
                          label: "Dancer Badge",
                          value:
                            selectedProfessor.current_badges.dancer || "None",
                        },
                        {
                          label: "Instructor Badge",
                          value:
                            selectedProfessor.current_badges.instructor ||
                            "None",
                        },
                        {
                          label: "DJ Badge",
                          value: selectedProfessor.current_badges.dj || "None",
                        },
                        {
                          label: "Organizer Badge",
                          value:
                            selectedProfessor.current_badges.organizer ||
                            "None",
                        },
                      ])}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No Badges Available
                    </div>
                  )}
                </div>

                {/* Subscription Summary Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    📋 Subscription Summary
                  </h4>
                  {selectedProfessor.subscription_summary ? (
                    <div className="dancer-summary-card">
                      {renderProfessorInfoGrid([
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
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
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
