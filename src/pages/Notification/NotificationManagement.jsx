import React, { useState, useEffect } from "react";
import GlobalLoader from "../../components/common/GlobalLoader";
import {
  Bell,
  Send,
  Eye,
  X,
  Upload,
  Calendar,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  TrendingUp,
  Mail,
} from "lucide-react";
import {
  getNotificationsService,
  createNotificationService,
  getNotificationDetailsService,
  cancelNotificationService,
  uploadNotificationImageService,
} from "../../services/notification.service";
import "./NotificationManagement.css";
import { uploadMediaFile } from "../../services/upload.service";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "general",
    target_audience: "all",
    user_types: [],
    subscription_types: [],
    specific_user_ids: [],
    image_url: "",
    action_url: "",
    data: {},
    send_immediately: true,
    scheduled_at: "",
    priority: "low",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Dropdown options
  const NOTIFICATION_TYPES = [
    { value: "general", label: "General" },
    { value: "promotion", label: "Promotional" },
    { value: "announcement", label: "Announcement" },
    { value: "alert", label: "Reminder" },
    { value: "update", label: "Update" },
  ];

  const TARGET_AUDIENCE_OPTIONS = [
    { value: "all", label: "All Users" },
    { value: "specific", label: "Specific Users" },
    { value: "user_types", label: "User Types" },
    { value: "subscription_types", label: "Subscription Types" },
  ];

  const USER_TYPES_OPTIONS = [
    { value: "all", label: "All User Types" },
    { value: "dancer", label: "Dancer" },
    { value: "instructor", label: "Instructor" },
    { value: "dj", label: "DJ" },
    { value: "organizer", label: "Organizer" },
  ];

  const SUBSCRIPTION_TYPES_OPTIONS = [
    { value: "all", label: "All Plans" },
    { value: "douceur", label: "Free Plan/Douceur" },
    { value: "fiver", label: "Fiver Plan" },
    { value: "ginga", label: "Ginga Plan" },
  ];

  const PRIORITY_LEVELS_OPTIONS = [
    { value: "low", label: "Low Priority" },
    { value: "high", label: "High Priority" },
  ];

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [pagination.page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotificationsService(
        pagination.page,
        pagination.limit
      );
      setNotifications(response.notifications);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      }));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    if (value === "all") {
      setFormData((prev) => ({
        ...prev,
        [name]: [value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: prev[name].includes(value)
          ? prev[name].filter((item) => item !== value)
          : [...prev[name].filter((item) => item !== "all"), value],
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fileURL = await uploadMediaFile(file);
      setFormData((prev) => ({ ...prev, image_url: fileURL }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let submitData = {
      title: formData.title,
      body: formData.body,
      type: formData.type,
      target_audience: formData.target_audience,
      image_url: formData.image_url || null,
      action_url: formData.action_url || null,
      data:
        formData.data && Object.keys(formData.data).length > 0
          ? formData.data
          : null,
      send_immediately: formData.send_immediately,
      scheduled_at: formData.scheduled_at
        ? new Date(formData.scheduled_at).toISOString()
        : null,
      priority: formData.priority,
    };

    if (formData.target_audience === "user_types") {
      submitData.user_types = formData.user_types || [];
    } else if (formData.target_audience === "subscription_types") {
      submitData.subscription_types = formData.subscription_types || [];
    } else if (formData.target_audience === "specific_users") {
      submitData.specific_user_ids = Array.isArray(formData.specific_user_ids)
        ? formData.specific_user_ids.map((id) => Number(id))
        : [];
    }

    console.log("📤 Final Payload sending:", submitData);

    try {
      await createNotificationService(submitData);
      fetchNotifications();
      setShowCreateForm(false);
      setFormData({
        title: "",
        body: "",
        type: "general",
        target_audience: "all",
        user_types: [],
        subscription_types: [],
        specific_user_ids: [],
        image_url: "",
        action_url: "",
        data: {},
        send_immediately: true,
        scheduled_at: "",
        priority: "normal",
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  const handleViewDetails = async (notificationId) => {
    try {
      setLoading(true);
      const response = await getNotificationDetailsService(notificationId);
      setSelectedNotification(response);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch notification details:", error);
      alert("Failed to fetch notification details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelNotification = async (notificationId) => {
    if (!window.confirm("Are you sure you want to cancel this notification?"))
      return;

    try {
      await cancelNotificationService(notificationId);
      fetchNotifications();
      setShowModal(false);
      alert("Notification cancelled successfully!");
    } catch (error) {
      console.error("Failed to cancel notification:", error);
      alert("Failed to cancel notification.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        color: "notification-mgmt-status-completed",
        icon: CheckCircle,
      },
      failed: { color: "notification-mgmt-status-failed", icon: XCircle },
      pending: { color: "notification-mgmt-status-pending", icon: Clock },
      cancelled: { color: "notification-mgmt-status-cancelled", icon: XCircle },
      scheduled: {
        color: "notification-mgmt-status-scheduled",
        icon: Calendar,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`notification-mgmt-status-badge ${config.color}`}>
        <Icon className="notification-mgmt-status-icon" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="notification-mgmt-container">
      <div className="notification-mgmt-header-section">
        <div className="notification-mgmt-header-content">
          <h1 className="notification-mgmt-header-title">
            <Bell className="notification-mgmt-header-icon" />
            Notification Management
          </h1>
          <p className="notification-mgmt-header-subtitle">
            Send and manage push notifications to your users
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="notification-mgmt-btn notification-mgmt-btn-primary"
        >
          <Send className="notification-mgmt-btn-icon" />
          Create Notification
        </button>
      </div>

      {/* Create Notification Form */}
      {showCreateForm && (
        <div className="notification-mgmt-form-container">
          <div className="notification-mgmt-form-header">
            <h2 className="notification-mgmt-form-title">
              Create New Notification
            </h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="notification-mgmt-form-close"
            >
              <X className="notification-mgmt-icon" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="notification-mgmt-form">
            <div className="notification-mgmt-form-row">
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="notification-mgmt-form-input"
                  placeholder="Enter notification title"
                  required
                />
              </div>
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="notification-mgmt-form-select"
                >
                  {NOTIFICATION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="notification-mgmt-form-group">
              <label className="notification-mgmt-form-label">
                Message Body *
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                rows="3"
                className="notification-mgmt-form-textarea"
                placeholder="Enter your notification message"
                required
              />
            </div>

            <div className="notification-mgmt-form-row">
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">
                  Target Audience
                </label>
                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleInputChange}
                  className="notification-mgmt-form-select"
                >
                  {TARGET_AUDIENCE_OPTIONS.map((target) => (
                    <option key={target.value} value={target.value}>
                      {target.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.target_audience === "user_types" && (
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">
                  User Types *
                </label>
                <div className="notification-mgmt-multi-select-container">
                  <div className="notification-mgmt-selected-tags">
                    {formData.user_types.map((selectedType) => {
                      const typeLabel = USER_TYPES_OPTIONS.find(
                        (t) => t.value === selectedType
                      )?.label;
                      return (
                        <span
                          key={selectedType}
                          className="notification-mgmt-tag notification-mgmt-tag-blue"
                        >
                          {typeLabel}
                          <button
                            type="button"
                            onClick={() =>
                              handleMultiSelectChange(
                                "user_types",
                                selectedType
                              )
                            }
                            className="notification-mgmt-tag-remove"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <select
                    onChange={(e) => {
                      if (
                        e.target.value &&
                        !formData.user_types.includes(e.target.value)
                      ) {
                        handleMultiSelectChange("user_types", e.target.value);
                      }
                      e.target.value = "";
                    }}
                    className="notification-mgmt-form-select"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select user types...
                    </option>
                    {USER_TYPES_OPTIONS.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {formData.target_audience === "subscription_types" && (
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">
                  Subscription Types *
                </label>
                <div className="notification-mgmt-multi-select-container">
                  <div className="notification-mgmt-selected-tags">
                    {formData.subscription_types.map((selectedType) => {
                      const typeLabel = SUBSCRIPTION_TYPES_OPTIONS.find(
                        (t) => t.value === selectedType
                      )?.label;
                      return (
                        <span
                          key={selectedType}
                          className="notification-mgmt-tag notification-mgmt-tag-green"
                        >
                          {typeLabel}
                          <button
                            type="button"
                            onClick={() =>
                              handleMultiSelectChange(
                                "subscription_types",
                                selectedType
                              )
                            }
                            className="notification-mgmt-tag-remove"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <select
                    onChange={(e) => {
                      if (
                        e.target.value &&
                        !formData.subscription_types.includes(e.target.value)
                      ) {
                        handleMultiSelectChange(
                          "subscription_types",
                          e.target.value
                        );
                      }
                      e.target.value = "";
                    }}
                    className="notification-mgmt-form-select"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select subscription types...
                    </option>
                    {SUBSCRIPTION_TYPES_OPTIONS.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {formData.target_audience === "specific" && (
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">
                  Specific User IDs *
                </label>
                <div className="notification-mgmt-multi-select-container">
                  <div className="notification-mgmt-selected-tags">
                    {formData.specific_user_ids.map((userId, index) => (
                      <span
                        key={index}
                        className="notification-mgmt-tag notification-mgmt-tag-purple"
                      >
                        User ID: {userId}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              specific_user_ids: prev.specific_user_ids.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                          className="notification-mgmt-tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter user IDs separated by commas (e.g., 1,2,3)"
                    className="notification-mgmt-form-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const value = e.target.value.trim();
                        if (value) {
                          const userIds = value
                            .split(",")
                            .map((id) => parseInt(id.trim()))
                            .filter((id) => !isNaN(id));
                          setFormData((prev) => ({
                            ...prev,
                            specific_user_ids: [
                              ...new Set([
                                ...prev.specific_user_ids,
                                ...userIds,
                              ]),
                            ],
                          }));
                          e.target.value = "";
                        }
                      }
                    }}
                  />
                  <p className="notification-mgmt-form-help">
                    Press Enter to add user IDs
                  </p>
                </div>
              </div>
            )}

            <div className="notification-mgmt-form-row">
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="notification-mgmt-form-select"
                >
                  {PRIORITY_LEVELS_OPTIONS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="notification-mgmt-form-group">
                <label className="notification-mgmt-form-label">
                  Action URL
                </label>
                <input
                  type="text"
                  name="action_url"
                  value={formData.action_url}
                  onChange={handleInputChange}
                  placeholder="dancewithme://home"
                  className="notification-mgmt-form-input"
                />
              </div>
            </div>

            <div className="notification-mgmt-form-group">
              <label className="notification-mgmt-form-label">
                Upload Image
              </label>
              <div className="notification-mgmt-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="notification-mgmt-upload-input"
                  id="notification-mgmt-image-upload"
                />
                <label
                  htmlFor="notification-mgmt-image-upload"
                  className="notification-mgmt-upload-label"
                >
                  <Upload className="notification-mgmt-upload-icon" />
                  {uploading ? "Uploading..." : "Choose Image"}
                </label>
                {formData.image_url && (
                  <span className="notification-mgmt-upload-success">
                    Image uploaded successfully
                  </span>
                )}
              </div>
            </div>

            <div className="notification-mgmt-schedule-section">
              <label className="notification-mgmt-checkbox-label">
                <input
                  type="checkbox"
                  name="send_immediately"
                  checked={formData.send_immediately}
                  onChange={handleInputChange}
                  className="notification-mgmt-checkbox-input"
                />
                Send Immediately
              </label>
              {!formData.send_immediately && (
                <div className="notification-mgmt-form-group">
                  <label className="notification-mgmt-form-label">
                    Schedule For
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleInputChange}
                    className="notification-mgmt-form-input"
                  />
                </div>
              )}
            </div>

            <div className="notification-mgmt-form-actions">
              <button
                type="submit"
                disabled={loading || uploading}
                className="notification-mgmt-btn notification-mgmt-btn-primary notification-mgmt-btn-submit"
              >
                {loading ? "Sending..." : "Send Notification"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="notification-mgmt-btn notification-mgmt-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="notification-mgmt-table-container">
        <div className="notification-mgmt-table-header">
          <h2 className="notification-mgmt-table-title">
            Notifications History
          </h2>
        </div>

        {loading && !showModal ? (
          <GlobalLoader text="Loading notifications..." />
        ) : (
          <>
            <div className="notification-mgmt-table-wrapper">
              <table className="notification-mgmt-notifications-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Sent At</th>
                    <th>Stats</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td
                        onClick={() => handleViewDetails(notification.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="notification-mgmt-notification-info">
                          <p className="notification-mgmt-notification-title">
                            {notification.title}
                          </p>
                          <p className="notification-mgmt-notification-body">
                            {notification.body}
                          </p>
                        </div>
                      </td>
                      <td className="notification-mgmt-table-cell">
                        {notification.type}
                      </td>
                      <td>{getStatusBadge(notification.status)}</td>
                      <td>
                        <span
                          className={`notification-mgmt-priority-badge notification-mgmt-priority-${notification.priority}`}
                        >
                          {notification.priority}
                        </span>
                      </td>
                      <td className="notification-mgmt-table-cell">
                        {notification.sent_at
                          ? new Date(notification.sent_at).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <div className="notification-mgmt-stats-cell">
                          <div className="notification-mgmt-stat-success">
                            ✓ {notification.sent_count}
                          </div>
                          <div className="notification-mgmt-stat-error">
                            ✗ {notification.failed_count}
                          </div>
                        </div>
                      </td>
                      <td>
                        {/* Action column removed - click on title to view details */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="notification-mgmt-pagination-container">
              <div className="notification-mgmt-pagination-info">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>
              <div className="notification-mgmt-pagination-controls">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="notification-mgmt-btn notification-mgmt-btn-pagination"
                >
                  Previous
                </button>
                <span className="notification-mgmt-pagination-current">
                  {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="notification-mgmt-btn notification-mgmt-btn-pagination"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Notification Details Modal */}
      {showModal && selectedNotification && (
        <div
          className="notification-mgmt-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="notification-mgmt-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notification-mgmt-modal-header">
              <h3 className="notification-mgmt-modal-title">
                Notification Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="notification-mgmt-modal-close"
              >
                <X className="notification-mgmt-icon" />
              </button>
            </div>

            <div className="notification-mgmt-modal-content">
              {/* Basic Info */}
              <div className="notification-mgmt-modal-section">
                <div className="notification-mgmt-modal-row">
                  <div className="notification-mgmt-modal-column">
                    <h4 className="notification-mgmt-section-title">
                      Basic Information
                    </h4>
                    <div className="notification-mgmt-info-grid">
                      <div className="notification-mgmt-info-item">
                        <span className="notification-mgmt-info-label">
                          Title:
                        </span>
                        <p className="notification-mgmt-info-value">
                          {selectedNotification.notification.title}
                        </p>
                      </div>
                      <div className="notification-mgmt-info-item">
                        <span className="notification-mgmt-info-label">
                          Message:
                        </span>
                        <p className="notification-mgmt-info-value">
                          {selectedNotification.notification.body}
                        </p>
                      </div>
                      <div className="notification-mgmt-info-item">
                        <span className="notification-mgmt-info-label">
                          Type:
                        </span>
                        <p className="notification-mgmt-info-value">
                          {selectedNotification.notification.type}
                        </p>
                      </div>
                      <div className="notification-mgmt-info-item">
                        <span className="notification-mgmt-info-label">
                          Priority:
                        </span>
                        <p className="notification-mgmt-info-value">
                          {selectedNotification.notification.priority}
                        </p>
                      </div>
                      <div className="notification-mgmt-info-item">
                        <span className="notification-mgmt-info-label">
                          Status:
                        </span>
                        <div className="notification-mgmt-info-value">
                          {getStatusBadge(
                            selectedNotification.notification.status
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="notification-mgmt-modal-column">
                    <h4 className="notification-mgmt-section-title">
                      Delivery Statistics
                    </h4>
                    <div className="notification-mgmt-stats-grid">
                      <div className="notification-mgmt-stat-item notification-mgmt-stat-delivered">
                        <span className="notification-mgmt-stat-label">
                          <TrendingUp className="notification-mgmt-icon" />{" "}
                          Delivered
                        </span>
                        <span className="notification-mgmt-stat-value">
                          {selectedNotification.delivery_stats.delivered}
                        </span>
                      </div>
                      <div className="notification-mgmt-stat-item notification-mgmt-stat-failed">
                        <span className="notification-mgmt-stat-label">
                          <XCircle className="notification-mgmt-icon" /> Failed
                        </span>
                        <span className="notification-mgmt-stat-value">
                          {selectedNotification.delivery_stats.failed}
                        </span>
                      </div>
                      <div className="notification-mgmt-stat-item notification-mgmt-stat-pending">
                        <span className="notification-mgmt-stat-label">
                          <Clock className="notification-mgmt-icon" /> Pending
                        </span>
                        <span className="notification-mgmt-stat-value">
                          {selectedNotification.delivery_stats.pending}
                        </span>
                      </div>
                      <div className="notification-mgmt-info-item">
                        <span className="notification-mgmt-info-label">
                          Created By:
                        </span>
                        <span className="notification-mgmt-info-value">
                          {selectedNotification.notification.created_by_name}
                        </span>
                      </div>
                      <div className="notification-mgmt-info-item">
                        <span className="notification-mgmt-info-label">
                          Created At:
                        </span>
                        <span className="notification-mgmt-info-value">
                          {new Date(
                            selectedNotification.notification.created_at
                          ).toLocaleString()}
                        </span>
                      </div>
                      {selectedNotification.notification.sent_at && (
                        <div className="notification-mgmt-info-item">
                          <span className="notification-mgmt-info-label">
                            Sent At:
                          </span>
                          <span className="notification-mgmt-info-value">
                            {new Date(
                              selectedNotification.notification.sent_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Audience Info */}
              <div className="notification-mgmt-modal-section">
                <h4 className="notification-mgmt-section-title">
                  Target Audience
                </h4>
                <div className="notification-mgmt-audience-grid">
                  <div className="notification-mgmt-info-item">
                    <span className="notification-mgmt-info-label">
                      Audience Type:
                    </span>
                    <p className="notification-mgmt-info-value">
                      {selectedNotification.notification.target_audience}
                    </p>
                  </div>
                  {selectedNotification.notification.user_types.length > 0 && (
                    <div className="notification-mgmt-info-item">
                      <span className="notification-mgmt-info-label">
                        User Types:
                      </span>
                      <p className="notification-mgmt-info-value">
                        {selectedNotification.notification.user_types.join(
                          ", "
                        )}
                      </p>
                    </div>
                  )}
                  {selectedNotification.notification.subscription_types.length >
                    0 && (
                    <div className="notification-mgmt-info-item">
                      <span className="notification-mgmt-info-label">
                        Subscription Types:
                      </span>
                      <p className="notification-mgmt-info-value">
                        {selectedNotification.notification.subscription_types.join(
                          ", "
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Image */}
              {selectedNotification.notification.image_url && (
                <div className="notification-mgmt-modal-section">
                  <h4 className="notification-mgmt-section-title">
                    Notification Image
                  </h4>
                  <img
                    src={selectedNotification.notification.image_url}
                    alt="Notification"
                    className="notification-mgmt-notification-image"
                  />
                </div>
              )}

              {/* Action URL */}
              {selectedNotification.notification.action_url && (
                <div className="notification-mgmt-modal-section">
                  <h4 className="notification-mgmt-section-title">
                    Action URL
                  </h4>
                  <p className="notification-mgmt-action-url">
                    {selectedNotification.notification.action_url}
                  </p>
                </div>
              )}

              {/* Recent Deliveries */}
              {selectedNotification.recent_deliveries &&
                selectedNotification.recent_deliveries.length > 0 && (
                  <div className="notification-mgmt-modal-section">
                    <h4 className="notification-mgmt-section-title">
                      Recent Deliveries
                    </h4>
                    <div className="notification-mgmt-deliveries-table-wrapper">
                      <table className="notification-mgmt-deliveries-table">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Status</th>
                            <th>Error Message</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedNotification.recent_deliveries.map(
                            (delivery) => (
                              <tr key={delivery.id}>
                                <td>
                                  <div className="notification-mgmt-user-info">
                                    <p className="notification-mgmt-user-name">
                                      {delivery.name}
                                    </p>
                                    <p className="notification-mgmt-user-email">
                                      {delivery.email}
                                    </p>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`notification-mgmt-delivery-status notification-mgmt-delivery-${delivery.status}`}
                                  >
                                    {delivery.status}
                                  </span>
                                </td>
                                <td>
                                  {delivery.error_message ? (
                                    <span className="notification-mgmt-error-message">
                                      {delivery.error_message}
                                    </span>
                                  ) : (
                                    <span className="notification-mgmt-no-error">
                                      -
                                    </span>
                                  )}
                                </td>
                                <td className="notification-mgmt-delivery-date">
                                  {delivery.delivered_at
                                    ? new Date(
                                        delivery.delivered_at
                                      ).toLocaleString()
                                    : new Date(
                                        delivery.created_at
                                      ).toLocaleString()}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Error Message */}
              {selectedNotification.notification.error_message && (
                <div className="notification-mgmt-modal-section">
                  <h4 className="notification-mgmt-section-title">
                    Error Details
                  </h4>
                  <div className="notification-mgmt-error-container">
                    <div className="notification-mgmt-error-content">
                      <AlertCircle className="notification-mgmt-error-icon" />
                      <p className="notification-mgmt-error-text">
                        {selectedNotification.notification.error_message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="notification-mgmt-modal-footer">
              <div className="notification-mgmt-modal-actions-left">
                {(selectedNotification.notification.status === "pending" ||
                  selectedNotification.notification.status === "scheduled") && (
                  <button
                    onClick={() =>
                      handleCancelNotification(
                        selectedNotification.notification.id
                      )
                    }
                    className="notification-mgmt-btn notification-mgmt-btn-danger"
                  >
                    <Trash2 className="notification-mgmt-btn-icon" />
                    Cancel Notification
                  </button>
                )}
              </div>
              <div className="notification-mgmt-modal-actions-right">
                <button
                  onClick={() => setShowModal(false)}
                  className="notification-mgmt-btn notification-mgmt-btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;
