import React, { useEffect, useState } from "react";
import "../Professors/ProfessorsListPage.css"; // Assuming you have a CSS file for styling
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
      <div className="filters-container">
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

      <table className="professors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Location</th>
            <th>Skill Level</th>
            {/* <th>User Type</th> */}
            {/* <th>Created At</th> */}
            <th>Roles</th>
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
                  setUserBadges(null);

                  // Fetch Booked Dates
                  setLoadingCalendar(true);
                  try {
                    const data = await fetchUserBookedDates(dancer.id, 1, 10);
                    setCalendarData(data);
                  } finally {
                    setLoadingCalendar(false);
                  }

                  // Fetch User Badges
                  setLoadingBadges(true);
                  try {
                    const badgesData = await getUserBadgesService(dancer.id);
                    setUserBadges(badgesData || {});
                  } finally {
                    setLoadingBadges(false);
                  }
                }}
              >
                <td>{dancer.id}</td>
                <td>{dancer.email}</td>
                <td>{dancer.name}</td>
                <td>{dancer.location}</td>
                <td>{dancer.skill_level}</td>
                <td>{dancer.profile_user_type}</td>
                {/* <td>{new Date(dancer.created_at).toLocaleString()}</td>
                <td>{dancer.roles?.join(", ")}</td> */}
                <td>
                  {dancer.active_subscription?.subscription_name || "N/A"}
                </td>
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
              {/* Calendar Section */}
              <div className="modal-section">
                <h4>Booked Dates & Slots</h4>
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
                            {slot.user_role} • Other User ID:{" "}
                            {slot.other_user_id}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No booked dates available</div>
                )}
              </div>
              {/* Badges Section */}
              <div className="modal-section">
                <h4>Badges</h4>
                {selectedDancer.current_badges &&
                Object.values(selectedDancer.current_badges).some(
                  (badge) => badge !== null
                ) ? (
                  renderInfoGrid([
                    {
                      label: "Dancer badge",
                      value: selectedDancer.current_badges.dancer || "None",
                    },
                    {
                      label: "Professor badge",
                      value: selectedDancer.current_badges.instructor || "None",
                    },
                    {
                      label: "DJ badge",
                      value: selectedDancer.current_badges.dj || "None",
                    },
                    {
                      label: "Organizer badge",
                      value: selectedDancer.current_badges.organizer || "None",
                    },
                  ])
                ) : (
                  <div className="empty-state">No Badge Available</div>
                )}
              </div>

              {/* Badge summary Section */}
              <div className="modal-section">
                <h4>Badge summary</h4>
                {selectedDancer.badge_summary ? (
                  renderInfoGrid([
                    {
                      label: "Total badges",
                      value: selectedDancer.badge_summary.total_badges,
                    },

                    {
                      label: "Highest Level",
                      value: selectedDancer.badge_summary.highest_level,
                    },

                    {
                      label: "Best Commission Rate",
                      value: selectedDancer.badge_summary.best_commission_rate,
                    },
                  ])
                ) : (
                  <div className="empty-state">No Badge summary available</div>
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
