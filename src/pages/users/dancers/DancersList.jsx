import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  fetchUserBookedDates,
  fetchUserBadges,
  assignUserBadge,
} from "../../../services/user.service";
import "../Dancers/DancersList.css";

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

  // Badge-related state
  const [badgeDetails, setBadgeDetails] = useState(null);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const [badgeError, setBadgeError] = useState(null);
  const [savingBadge, setSavingBadge] = useState(false);

  const [badgeForm, setBadgeForm] = useState({
    user_type: "",
    badge_level: "",
    custom_commission_rate: "",
    reason: "",
  });

  useEffect(() => {
    const loadDancers = async () => {
      try {
        const data = await fetchUsers(page, 10);
        if (data && data.users) {
          console.log("Fetched users:", data.users);
          console.log("Pagination info:", data.pagination);
          setDancers(data.users);
          setPagination(data.pagination || { page, totalPages: 1 });
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error("Error loading dancers:", error);
        setDancers([]);
      }
    };
    loadDancers();
  }, [page]);

  const formatValueForDisplay = (value) => {
    if (value === null || value === undefined) return "N/A";

    const t = typeof value;

    // Primitive values are safe
    if (t === "string" || t === "number" || t === "boolean") {
      return String(value);
    }

    // Arrays -> comma separated
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    // Badge-like object (from your API)
    if (value && typeof value === "object") {
      if (value.badge_name) {
        const emoji = value.badge_emoji || "";
        const level = value.level != null ? ` (Level ${value.level})` : "";
        return `${emoji} ${value.badge_name}${level}`;
      }
    }

    // Fallback: stringify object
    try {
      return JSON.stringify(value);
    } catch (e) {
      return "N/A";
    }
  };

  // Helper function to render info items in grid
  const renderDancerInfoGrid = (items) => {
    return (
      <div className="dancer-info-grid">
        {items.map((item, index) => (
          <div key={index} className={`dancer-info-item ${item.status || ""}`}>
            <div className="dancer-info-label">{item.label}</div>
            <div className="dancer-info-value">
              {formatValueForDisplay(item.value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const loadUserBadges = async (user) => {
    setLoadingBadges(true);
    setBadgeError(null);
    setBadgeDetails(null);

    try {
      const data = await fetchUserBadges(user.id);
      if (!data) {
        setBadgeError("Unable to load badge details.");
        return;
      }

      // ✅ Only allow these values
      const ALLOWED_PERSONAS = ["dancer", "instructor", "dj", "organizer"];

      // Filter what backend sent
      const personasFromApi = Array.isArray(data.user_personas)
        ? data.user_personas.filter((p) => ALLOWED_PERSONAS.includes(p))
        : [];

      // If backend sent nothing / bad stuff, fallback to all valid personas
      const finalPersonas =
        personasFromApi.length > 0 ? personasFromApi : ALLOWED_PERSONAS;

      // Store sanitized personas in state
      setBadgeDetails({
        ...data,
        user_personas: finalPersonas,
      });

      const defaultPersona = finalPersonas[0]; // always valid now

      const nextForPersona =
        data.next_badges && data.next_badges[defaultPersona];

      setBadgeForm({
        user_type: defaultPersona,
        badge_level:
          nextForPersona && nextForPersona.level
            ? String(nextForPersona.level)
            : "",
        custom_commission_rate:
          nextForPersona && nextForPersona.commission_rate
            ? String(nextForPersona.commission_rate)
            : "",
        reason: "",
      });
    } catch (err) {
      console.error("Error loading user badges:", err);
      setBadgeError("Failed to load badge details.");
    } finally {
      setLoadingBadges(false);
    }
  };

  const handleAssignBadge = async (e) => {
    e.preventDefault();
    if (!selectedDancer) return;

    if (!badgeForm.user_type || !badgeForm.badge_level) {
      setBadgeError("User type and badge level are required.");
      return;
    }

    // 👇 Try to choose the same id that your backend uses everywhere
    const targetUserId =
      selectedDancer.user_id != null
        ? selectedDancer.user_id
        : selectedDancer.id;

    setSavingBadge(true);
    setBadgeError(null);

    try {
      await assignUserBadge({
        target_user_id: targetUserId,
        user_type: badgeForm.user_type, // already guaranteed one of dancer/instructor/dj/organizer
        badge_level: badgeForm.badge_level,
        custom_commission_rate: badgeForm.custom_commission_rate,
        reason:
          badgeForm.reason ||
          "Exceptional performance and contribution to platform",
      });

      await loadUserBadges(selectedDancer);
    } catch (err) {
      console.error("Error assigning badge:", err);
      const backendMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to assign badge. Please try again.";

      setBadgeError(backendMsg);
    } finally {
      setSavingBadge(false);
    }
  };

  return (
    <div className="dancers-main-container">
      <h2 className="dancers-page-title">Dancers List</h2>
      <div className="dancers-filters-container">
        {/* filters currently commented-out */}
      </div>

      <table className="dancers-data-table">
        <thead>
          <tr>
            <th>ID</th>
            
            <th>Name</th>
            <th>Email</th>
            <th>Created Date</th>
            <th>Skill Level</th>
        
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
              const dateA = new Date(a.created_at).getTime();
              const dateB = new Date(b.created_at).getTime();
              return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            })
            .map((dancer) => (
              <tr
                key={dancer.id}
                onClick={async () => {
                  setSelectedDancer(dancer);

                  // Reset calendar & badge states
                  setCalendarData(null);
                  setLoadingCalendar(true);

                  setBadgeDetails(null);
                  setBadgeError(null);

                  try {
                    const data = await fetchUserBookedDates(dancer.id, 1, 10);
                    setCalendarData(data);
                  } finally {
                    setLoadingCalendar(false);
                  }

                  // Load badge details
                  loadUserBadges(dancer);
                }}
              >
                <td>{dancer.id}</td>
                <td>{dancer.name}</td>
                <td>{dancer.email}</td>
                <td>{new Date(dancer.created_at).toLocaleDateString("fr-FR")}</td>
                <td>{dancer.skill_level}</td>  
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
          onClick={() => {
            setSelectedDancer(null);
            setBadgeDetails(null);
            setBadgeError(null);
          }}
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
                onClick={() => {
                  setSelectedDancer(null);
                  setBadgeDetails(null);
                  setBadgeError(null);
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
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
                  {selectedDancer.subscription_history &&
                  selectedDancer.subscription_history.length > 0 ? (
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
                  ) : calendarData &&
                    calendarData.booked_dates &&
                    calendarData.booked_dates.length > 0 ? (
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

                {/* Current Badges Section (from list data) */}
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

                {/* 🔥 New: Admin Badge Details / Edit Section */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    🏅 Badge Details (Admin)
                  </h4>

                  {loadingBadges && (
                    <div className="dancer-loading-state">
                      Loading badge details...
                    </div>
                  )}

                  {badgeError && (
                    <div className="dancer-error-state">{badgeError}</div>
                  )}

                  {!loadingBadges && badgeDetails && (
                    <>
                      {/* Show personas & next badges */}
                      <div className="dancer-badge-personas">
                        <strong>User Personas:</strong>{" "}
                        {badgeDetails.user_personas &&
                        badgeDetails.user_personas.length > 0
                          ? badgeDetails.user_personas.join(", ")
                          : "N/A"}
                      </div>

                      {badgeDetails.next_badges && (
                        <div className="dancer-next-badges">
                          {Object.entries(badgeDetails.next_badges).map(
                            ([persona, badge]) =>
                              badge && (
                                <div
                                  key={persona}
                                  className="dancer-next-badge-card"
                                >
                                  <div className="dancer-next-badge-header">
                                    <span className="dancer-next-badge-name">
                                      {badge.badge_emoji} {badge.badge_name}
                                    </span>
                                    <span className="dancer-next-badge-persona">
                                      Persona: {persona}
                                    </span>
                                  </div>
                                  <div className="dancer-next-badge-body">
                                    <div>Level: {badge.level}</div>
                                    <div>
                                      Commission rate: {badge.commission_rate}
                                    </div>
                                    <div>Description: {badge.description}</div>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      )}

                      {/* Assign / Update badge form */}
                      <form
                        className="dancer-badge-form"
                        onSubmit={handleAssignBadge}
                      >
                        <div className="dancer-badge-form-row">
                          <label>
                            Persona / User Type
                            <select
                              value={badgeForm.user_type}
                              onChange={(e) =>
                                setBadgeForm((prev) => ({
                                  ...prev,
                                  user_type: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select persona</option>
                              {badgeDetails.user_personas &&
                                badgeDetails.user_personas.map((p) => (
                                  <option key={p} value={p}>
                                    {p}
                                  </option>
                                ))}
                            </select>
                          </label>
                        </div>

                        <div className="dancer-badge-form-row">
                          <label>
                            Badge Level
                            <input
                              type="number"
                              min="1"
                              value={badgeForm.badge_level}
                              onChange={(e) =>
                                setBadgeForm((prev) => ({
                                  ...prev,
                                  badge_level: e.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>

                        <div className="dancer-badge-form-row">
                          <label>
                            Custom Commission Rate
                            <input
                              type="number"
                              step="0.01"
                              value={badgeForm.custom_commission_rate}
                              onChange={(e) =>
                                setBadgeForm((prev) => ({
                                  ...prev,
                                  custom_commission_rate: e.target.value,
                                }))
                              }
                              placeholder="Optional (e.g., 0.92)"
                            />
                          </label>
                        </div>

                        <div className="dancer-badge-form-row">
                          <label>
                            Reason
                            <textarea
                              value={badgeForm.reason}
                              onChange={(e) =>
                                setBadgeForm((prev) => ({
                                  ...prev,
                                  reason: e.target.value,
                                }))
                              }
                              placeholder="Reason for assigning/updating this badge"
                            />
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="dancer-badge-save-btn"
                          disabled={savingBadge}
                        >
                          {savingBadge ? "Saving..." : "Assign / Update Badge"}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {/* <div className="dancer-modal-footer">
              <button
                className="dancer-modal-close-btn"
                onClick={() => {
                  setSelectedDancer(null);
                  setBadgeDetails(null);
                  setBadgeError(null);
                }}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DancersList;
