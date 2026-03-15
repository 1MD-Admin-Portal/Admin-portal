import React, { useEffect, useState } from "react";
import { fetchOrganizers } from "../../../services/organizer.service";
import "../Dancers/DancersList.css"; // Import the dancer CSS for organizer styling
import {
  fetchUserBadges,
  assignUserBadge,
} from "../../../services/badge.service";
import { maskEmail } from "../../../components/maskEmail";
import GlobalLoader from "../../../components/common/GlobalLoader";
import Pagination from "../../../components/common/Pagination";

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
      const level =
        value.level !== undefined && value.level !== null
          ? ` (Level ${value.level})`
          : "";
      const emoji = value.badge_emoji || "";
      if (emoji && emoji.startsWith("http")) {
        return <><img src={emoji} alt={value.badge_name} className="badge-emoji-img" onError={(e) => { e.target.style.display = 'none'; }} /> {value.badge_name}{level}</>;
      }
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
const renderOrganizerInfoGridWithFormatter = (items) => {
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

const OrganizerListPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);

  // 🔹 Badge-related state
  const [badgeDetails, setBadgeDetails] = useState(null);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const [badgeError, setBadgeError] = useState(null);
  const [savingBadge, setSavingBadge] = useState(false);

  const [badgeForm, setBadgeForm] = useState({
    user_type: "organizer", // default persona for organizers
    badge_level: "",
    custom_commission_rate: "",
    reason: "",
  });

  useEffect(() => {
    loadOrganizers(page);
  }, [page]);

  const loadOrganizers = async (pageNum) => {
    setLoading(true);
    try {
      const data = await fetchOrganizers(pageNum);
      

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

  const loadOrganizerBadges = async (user) => {
    setLoadingBadges(true);
    setBadgeError(null);
    setBadgeDetails(null);

    try {
      const data = await fetchUserBadges(user.id);
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

      // For organizers, default to "organizer" if available
      const defaultPersona = "organizer";

      const nextForPersona =
        data.next_badges && data.next_badges[defaultPersona];

      setBadgeForm({
  user_type: "organizer",
  badge_level: nextForPersona?.level
    ? String(nextForPersona.level)
    : "",
  custom_commission_rate: nextForPersona?.commission_rate
    ? String(nextForPersona.commission_rate)
    : "",
  reason: "",
});
    } catch (err) {
      console.error("Error loading organizer badges:", err);
      setBadgeError("Failed to load badge details.");
    } finally {
      setLoadingBadges(false);
    }
  };

  const handleAssignBadge = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!badgeForm.user_type || !badgeForm.badge_level) {
      setBadgeError("User type and badge level are required.");
      return;
    }

    const targetUserId =
      selectedUser.user_id != null ? selectedUser.user_id : selectedUser.id;

    setSavingBadge(true);
    setBadgeError(null);

    try {
      await assignUserBadge({
        target_user_id: targetUserId,
        user_type: badgeForm.user_type, // "organizer" or other persona
        badge_level: badgeForm.badge_level,
        custom_commission_rate: badgeForm.custom_commission_rate,
        reason: badgeForm.reason || "Badge updated for organizer via admin dashboard",
      });

      // Reload badge details
      await loadOrganizerBadges(selectedUser);

      // Update organizers list to refresh current_badges and badge_summary
      const updatedOrgData = await fetchOrganizers(page);
      const updatedOrganizers = Array.isArray(updatedOrgData?.users) ? updatedOrgData.users : [];
      const updatedUser = updatedOrganizers.find(org => org.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
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
    setSelectedUser(null);
    setBadgeDetails(null);
    setBadgeError(null);
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
            <tr key={user.id} onClick={() => {
              setSelectedUser(user);
              loadOrganizerBadges(user);
            }}>
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

      <Pagination
        currentPage={pagination.page || page}
        totalPages={pagination.totalPages || 1}
        onPageChange={setPage}
        isLoading={loading}
      />

      {selectedUser && (
        <div
          className="dancer-modal-overlay"
          onClick={closeModal}
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
                onClick={closeModal}
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
                      {renderOrganizerInfoGridWithFormatter([
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
                          {Object.entries(badgeDetails.next_badges)
  .filter(([persona]) => persona === "organizer")
  .map(([persona, badge]) => (
                                <div
                                  key={persona}
                                  className="dancer-next-badge-card"
                                >
                                  <div className="dancer-next-badge-header">
                                    <span className="dancer-next-badge-name">
                                      {badge.badge_emoji && badge.badge_emoji.startsWith("http") ? (
                                        <img src={badge.badge_emoji} alt={badge.badge_name} className="badge-emoji-img" onError={(e) => { e.target.style.display = 'none'; }} />
                                      ) : (
                                        badge.badge_emoji
                                      )}{" "}{badge.badge_name}
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
                            <select value="organizer" disabled>
  <option value="organizer">organizer</option>
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
            <div className="dancer-modal-footer">
              {/* <button
                className="dancer-modal-close-btn"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerListPage;