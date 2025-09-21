import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  fetchUserBookedDates,
} from "../../../services/user.Service";
import "../Dancers/DancersList.css"; // Assuming you have a CSS file for styling

const DancersList = () => {
  const [dancers, setDancers] = useState([]);
  const [selectedDancer, setSelectedDancer] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [skillLevelFilter, setSkillLevelFilter] = useState("");
  const [calendarData, setCalendarData] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

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
  const renderDancerInfoGrid = (items) => {
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
      <h2 className="dancers-page-title">Dancers List</h2>
      <div className="dancers-filters-container">
        {/* <input
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={subscriptionFilter}
          onChange={(e) => setSubscriptionFilter(e.target.value)}
        >
          <option value="">All Subscriptions</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={skillLevelFilter}
          onChange={(e) => setSkillLevelFilter(e.target.value)}
        >
          <option value="">All Skill Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort by Date: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </button> */}
      </div>

      <table className="dancers-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            {/* <th>Location</th> */}
            <th>Skill Level</th>
            {/* <th>User Type</th> */}
            <th>Created At</th>
            {/* <th>Roles</th> */}
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {dancers
            .filter((dancer) => {
              const matchesSearch =
                (dancer.name?.toLowerCase() || "").includes(
                  searchTerm.toLowerCase()
                ) ||
                (dancer.location?.toLowerCase() || "").includes(
                  searchTerm.toLowerCase()
                );

              const matchesSubscription =
                subscriptionFilter === "" ||
                (subscriptionFilter === "Active"
                  ? dancer.active_subscription?.is_active
                  : !dancer.active_subscription?.is_active);

              const matchesSkill =
                skillLevelFilter === "" ||
                (dancer.skill_level?.toLowerCase() || "") ===
                  skillLevelFilter.toLowerCase();

              return matchesSearch && matchesSubscription && matchesSkill;
            })

            .sort((a, b) => {
              const dateA = new Date(a.created_at);
              const dateB = new Date(b.created_at);
              return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            })
            .map((dancer) => (
              <tr
                key={dancer.id}
                onClick={async () => {
                  setSelectedDancer(dancer);

                  // Reset states immediately
                  setCalendarData(null);

                  // Fetch Booked Dates
                  setLoadingCalendar(true);
                  try {
                    const data = await fetchUserBookedDates(dancer.id, 1, 10);
                    setCalendarData(data);
                  } finally {
                    setLoadingCalendar(false);
                  }
                }}
              >
                <td>{dancer.id}</td>
                <td>{dancer.email}</td>
                <td>{dancer.name}</td>
                {/* <td>{dancer.location}</td> */}
                <td>{dancer.skill_level}</td>
                {/* <td>{dancer.profile_user_type}</td> */}
                <td>{new Date(dancer.created_at).toLocaleString()}</td>
                {/* <td>{dancer.roles?.join(", ")}</td> */}
                <td>
                  {dancer.active_subscription?.subscription_name || "N/A"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="dancers-pagination-controls">
        <button
          className="dancers-pagination-btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="dancers-page-indicator">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="dancers-pagination-btn"
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, pagination.totalPages))
          }
          disabled={page >= pagination.totalPages}
        >
          Next
        </button>
      </div>

      {selectedDancer && (
        <div
          className="dancer-modal-overlay"
          onClick={() => setSelectedDancer(null)}
        >
          <div
            className="dancer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="dancer-modal-header">
              <h3>Dancer Profile Details</h3>
              <button
                className="dancer-modal-close-x"
                onClick={() => setSelectedDancer(null)}
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
                  {renderDancerInfoGrid([
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
                      value: new Date(
                        selectedDancer.created_at
                      ).toLocaleString(),
                    },
                    {
                      label: "Roles",
                      value: selectedDancer.roles?.join(", ") || "None",
                    },
                  ])}
                </div>

                {/* Active Subscription Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    💳 Active Subscription
                  </h4>
                  {selectedDancer.active_subscription ? (
                    <div className="dancer-subscription-card">
                      {renderDancerInfoGrid([
                        {
                          label: "Subscription Name",
                          value:
                            selectedDancer.active_subscription
                              .subscription_name,
                        },
                        {
                          label: "Status",
                          value:
                            selectedDancer.active_subscription.payment_status,
                          status: selectedDancer.active_subscription.is_active
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
                        },
                        {
                          label: "Is Active",
                          value: selectedDancer.active_subscription.is_active
                            ? "Yes"
                            : "No",
                          status: selectedDancer.active_subscription.is_active
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
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
                  {selectedDancer.subscription_history?.length > 0 ? (
                    <div className="dancer-history-container">
                      {selectedDancer.subscription_history.map((sub, idx) => (
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
                                  User ID: {slot.other_user_id}
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

                {/* Badges Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">🏆 Current Badges</h4>
                  {selectedDancer.current_badges &&
                  Object.values(selectedDancer.current_badges).some(
                    (badge) => badge !== null
                  ) ? (
                    <div className="dancer-badges-grid">
                      {renderDancerInfoGrid([
                        {
                          label: "Dancer Badge",
                          value: selectedDancer.current_badges.dancer || "None",
                        },
                        {
                          label: "Instructor Badge",
                          value:
                            selectedDancer.current_badges.instructor || "None",
                        },
                        {
                          label: "DJ Badge",
                          value: selectedDancer.current_badges.dj || "None",
                        },
                        {
                          label: "Organizer Badge",
                          value:
                            selectedDancer.current_badges.organizer || "None",
                        },
                      ])}
                    </div>
                  ) : (
                    <div className="dancer-empty-state">
                      No Badges Available
                    </div>
                  )}
                </div>

                {/* Badge Summary Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">📊 Badge Summary</h4>
                  {selectedDancer.badge_summary ? (
                    <div className="dancer-summary-card">
                      {renderDancerInfoGrid([
                        {
                          label: "Total Badges",
                          value: selectedDancer.badge_summary.total_badges,
                        },
                        {
                          label: "Highest Level",
                          value: selectedDancer.badge_summary.highest_level,
                        },
                        {
                          label: "Best Commission Rate",
                          value:
                            selectedDancer.badge_summary.best_commission_rate,
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
                  {selectedDancer.subscription_summary ? (
                    <div className="dancer-summary-card">
                      {renderDancerInfoGrid([
                        {
                          label: "Total Subscriptions",
                          value:
                            selectedDancer.subscription_summary
                              .subscription_count,
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
                            ? "dancer-status-active"
                            : "dancer-status-inactive",
                        },
                        {
                          label: "Latest Subscription Date",
                          value: new Date(
                            selectedDancer.subscription_summary.latest_subscription_date
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
