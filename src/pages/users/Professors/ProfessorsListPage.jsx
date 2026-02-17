import React, { useEffect, useState } from "react";
import { fetchProfessors } from "../../../services/professor.service";
import "../Dancers/DancersList.css";
import { fetchUserBookedDates } from "../../../services/user.Service";
import {
  fetchUserBadges,
  assignUserBadge,
} from "../../../services/badge.service";

// 🔹 Helper to safely display values (avoids object-as-child crash)
const formatValueForDisplay = (value) => {
  if (value === null || value === undefined) return "N/A";

  const t = typeof value;

  if (t === "string" || t === "number" || t === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  // Badge-like object
  if (value && typeof value === "object") {
    if (value.badge_name) {
      const emoji = value.badge_emoji || "";
      const level =
        value.level !== undefined && value.level !== null
          ? ` (Level ${value.level})`
          : "";
      return `${emoji} ${value.badge_name}${level}`;
    }
  }

  try {
    return JSON.stringify(value);
  } catch (e) {
    return "N/A";
  }
};

// 🔹 Grid renderer using formatter
const renderProfessorInfoGrid = (items) => {
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

const ProfessorsListPage = () => {
  const [professors, setProfessors] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [calendarData, setCalendarData] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  // 🔹 Badge-related state
  const [badgeDetails, setBadgeDetails] = useState(null);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const [badgeError, setBadgeError] = useState(null);
  const [savingBadge, setSavingBadge] = useState(false);

  const [badgeForm, setBadgeForm] = useState({
    user_type: "instructor", // default persona for professors
    badge_level: "",
    custom_commission_rate: "",
    reason: "",
  });

  useEffect(() => {
    loadProfessors(page);
  }, [page]);

  const loadProfessors = async (pg) => {
    const data = await fetchProfessors(pg);
    setProfessors(data.users || []);
    setPagination(data.pagination || {});
  };

  const loadProfessorBadges = async (prof) => {
    setLoadingBadges(true);
    setBadgeError(null);
    setBadgeDetails(null);

    try {
      const data = await fetchUserBadges(prof.id);
      if (!data) {
        setBadgeError("Unable to load badge details.");
        return;
      }

      const ALLOWED_PERSONAS = ["dancer", "instructor", "dj", "organizer"];

      const personasFromApi = Array.isArray(data.user_personas)
        ? data.user_personas.filter((p) => ALLOWED_PERSONAS.includes(p))
        : [];

      const finalPersonas =
        personasFromApi.length > 0 ? personasFromApi : ALLOWED_PERSONAS;

      setBadgeDetails({
        ...data,
        user_personas: finalPersonas,
      });

      // For professors, default to instructor if present, else first persona
      const defaultPersona = finalPersonas.includes("instructor")
        ? "instructor"
        : finalPersonas[0];

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
      console.error("Error loading professor badges:", err);
      setBadgeError("Failed to load badge details.");
    } finally {
      setLoadingBadges(false);
    }
  };

  const handleAssignBadge = async (e) => {
    e.preventDefault();
    if (!selectedProfessor) return;

    if (!badgeForm.user_type || !badgeForm.badge_level) {
      setBadgeError("User type and badge level are required.");
      return;
    }

    const targetUserId =
      selectedProfessor.user_id != null
        ? selectedProfessor.user_id
        : selectedProfessor.id;

    setSavingBadge(true);
    setBadgeError(null);

    try {
      await assignUserBadge({
        target_user_id: targetUserId,
        user_type: badgeForm.user_type, // e.g. "instructor"
        badge_level: badgeForm.badge_level,
        custom_commission_rate: badgeForm.custom_commission_rate,
        reason:
          badgeForm.reason ||
          "Badge updated for instructor via admin dashboard",
      });

      await loadProfessorBadges(selectedProfessor);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfessor(null);
    setCalendarData(null);
    setBadgeDetails(null);
    setBadgeError(null);
  };

  return (
    <div className="dancers-main-container">
      <h2 className="dancers-page-title">👨‍🏫 All Instructors</h2>

      <table className="dancers-data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
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

                // Calendar
                setLoadingCalendar(true);
                setCalendarData(null);
                try {
                  const data = await fetchUserBookedDates(prof.id, 1, 10);
                  setCalendarData(data);
                } catch (err) {
                  console.error("Failed to load calendar", err);
                  setCalendarData(null);
                } finally {
                  setLoadingCalendar(false);
                }

                // Badges
                loadProfessorBadges(prof);
              }}
            >
              <td>{prof.id}</td>
              <td>{prof.name}</td>
              <td>{prof.email}</td>
              <td>{prof.skill_level}</td>
              <td>{prof.roles?.join(", ")}</td>
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
        <div className="dancer-modal-overlay" onClick={closeModal}>
          <div
            className="dancer-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="dancer-modal-header">
              <h3>👨‍🏫 Instructor Profile Details</h3>
              <button className="dancer-modal-close-x" onClick={closeModal}>
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="dancer-modal-body">
              {/* Left column */}
              <div className="dancer-modal-column dancer-modal-left">
                {/* Basic Information */}
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

                {/* Active Subscription */}
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

                {/* Subscription History */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">
                    📈 Subscription History
                  </h4>
                  {selectedProfessor.subscription_history &&
                  selectedProfessor.subscription_history.length > 0 ? (
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

              {/* Right column */}
              <div className="dancer-modal-column dancer-modal-right">
                {/* Calendar */}
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

                {/* Professor Specific Information */}
                <div className="dancer-modal-section">
                  <h4 className="dancer-section-title">🎓 Instructor Details</h4>
                  {renderProfessorInfoGrid([
                    {
                      label: "Instructor ID",
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

                {/* Current Badges (from list object) */}
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

                {/* Subscription Summary */}
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

                {/* 🏅 Badge Details (Admin) */}
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

            {/* Footer */}
            {/* <div className="dancer-modal-footer">
              <button className="dancer-modal-close-btn" onClick={closeModal}>
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorsListPage;
