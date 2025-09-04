import React, { useState, useEffect } from "react";
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
    priority: "normal",
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
      const fileURL = await uploadMediaFile(file); // ✅ directly get the URL
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

    // ✅ Conditionally add fields based on target_audience
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
      completed: { color: "status-completed", icon: CheckCircle },
      failed: { color: "status-failed", icon: XCircle },
      pending: { color: "status-pending", icon: Clock },
      cancelled: { color: "status-cancelled", icon: XCircle },
      scheduled: { color: "status-scheduled", icon: Calendar },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`status-badge ${config.color}`}>
        <Icon className="status-icon" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="notification-management">
      <div className="header-section">
        <div className="header-content">
          <h1 className="header-title">
            <Bell className="header-icon" />
            Notification Management
          </h1>
          <p className="header-subtitle">
            Send and manage push notifications to your users
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          <Send className="btn-icon" />
          Create Notification
        </button>
      </div>

      {/* Create Notification Form */}
      {showCreateForm && (
        <div className="form-container">
          <h2 className="form-title">Create New Notification</h2>
          <form onSubmit={handleSubmit} className="notification-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {NOTIFICATION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message Body *</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                rows="3"
                className="form-textarea"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {TARGET_AUDIENCE_OPTIONS.map((target) => (
                    <option key={target.value} value={target.value}>
                      {target.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ Conditionally render audience-specific fields */}
            {formData.target_audience === "user_types" && (
              <div className="form-group">
                <label className="form-label">User Types *</label>
                <div className="multi-select-container">
                  <div className="selected-tags">
                    {formData.user_types.map((selectedType) => {
                      const typeLabel = USER_TYPES_OPTIONS.find(
                        (t) => t.value === selectedType
                      )?.label;
                      return (
                        <span key={selectedType} className="tag tag-blue">
                          {typeLabel}
                          <button
                            type="button"
                            onClick={() =>
                              handleMultiSelectChange(
                                "user_types",
                                selectedType
                              )
                            }
                            className="tag-remove"
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
                    className="form-select"
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
              <div className="form-group">
                <label className="form-label">Subscription Types *</label>
                <div className="multi-select-container">
                  <div className="selected-tags">
                    {formData.subscription_types.map((selectedType) => {
                      const typeLabel = SUBSCRIPTION_TYPES_OPTIONS.find(
                        (t) => t.value === selectedType
                      )?.label;
                      return (
                        <span key={selectedType} className="tag tag-green">
                          {typeLabel}
                          <button
                            type="button"
                            onClick={() =>
                              handleMultiSelectChange(
                                "subscription_types",
                                selectedType
                              )
                            }
                            className="tag-remove"
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
                    className="form-select"
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
              <div className="form-group">
                <label className="form-label">Specific User IDs *</label>
                <div className="multi-select-container">
                  <div className="selected-tags">
                    {formData.specific_user_ids.map((userId, index) => (
                      <span key={index} className="tag tag-purple">
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
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter user IDs separated by commas (e.g., 1,2,3)"
                    className="form-input"
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
                  <p className="form-help">Press Enter to add user IDs</p>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {PRIORITY_LEVELS_OPTIONS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Action URL</label>
                <input
                  type="text"
                  name="action_url"
                  value={formData.action_url}
                  onChange={handleInputChange}
                  placeholder="dancewithme://home"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Image</label>
              <div className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="upload-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <Upload className="upload-icon" />
                  {uploading ? "Uploading..." : "Choose Image"}
                </label>
                {formData.image_url && (
                  <span className="upload-success">
                    Image uploaded successfully
                  </span>
                )}
              </div>
            </div>

            <div className="schedule-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="send_immediately"
                  checked={formData.send_immediately}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                Send Immediately
              </label>
              {!formData.send_immediately && (
                <div className="form-group">
                  <label className="form-label">Schedule For</label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading || uploading}
                className="btn btn-primary btn-submit"
              >
                {loading ? "Sending..." : "Send Notification"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications List */}
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Notifications History</h2>
        </div>

        {loading && !showModal ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading notifications...</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="notifications-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Sent At</th>
                    <th>Stats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td>
                        <div className="notification-info">
                          <p className="notification-title">
                            {notification.title}
                          </p>
                          <p className="notification-body">
                            {notification.body}
                          </p>
                        </div>
                      </td>
                      <td className="table-cell">{notification.type}</td>
                      <td>{getStatusBadge(notification.status)}</td>
                      <td>
                        <span
                          className={`priority-badge priority-${notification.priority}`}
                        >
                          {notification.priority}
                        </span>
                      </td>
                      <td className="table-cell">
                        {notification.sent_at
                          ? new Date(notification.sent_at).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <div className="stats-cell">
                          <div className="stat-success">
                            ✓ {notification.sent_count}
                          </div>
                          <div className="stat-error">
                            ✗ {notification.failed_count}
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleViewDetails(notification.id)}
                          className="btn-icon-only"
                          title="View Details"
                        >
                          <Eye className="icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} results
              </div>
              <div className="pagination-controls">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="btn btn-pagination"
                >
                  Previous
                </button>
                <span className="pagination-current">
                  {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="btn btn-pagination"
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
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Notification Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                <X className="icon" />
              </button>
            </div>

            <div className="modal-content">
              {/* Basic Info */}
              <div className="modal-section">
                <div className="modal-row">
                  <div className="modal-column">
                    <h4 className="section-title">Basic Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Title:</span>
                        <p className="info-value">
                          {selectedNotification.notification.title}
                        </p>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Message:</span>
                        <p className="info-value">
                          {selectedNotification.notification.body}
                        </p>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Type:</span>
                        <p className="info-value">
                          {selectedNotification.notification.type}
                        </p>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Priority:</span>
                        <p className="info-value">
                          {selectedNotification.notification.priority}
                        </p>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Status:</span>
                        <div className="info-value">
                          {getStatusBadge(
                            selectedNotification.notification.status
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-column">
                    <h4 className="section-title">Delivery Statistics</h4>
                    <div className="stats-grid">
                      <div className="stat-item stat-delivered">
                        <span className="stat-label">Delivered:</span>
                        <span className="stat-value">
                          {selectedNotification.delivery_stats.delivered}
                        </span>
                      </div>
                      <div className="stat-item stat-failed">
                        <span className="stat-label">Failed:</span>
                        <span className="stat-value">
                          {selectedNotification.delivery_stats.failed}
                        </span>
                      </div>
                      <div className="stat-item stat-pending">
                        <span className="stat-label">Pending:</span>
                        <span className="stat-value">
                          {selectedNotification.delivery_stats.pending}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Created By:</span>
                        <span className="info-value">
                          {selectedNotification.notification.created_by_name}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Created At:</span>
                        <span className="info-value">
                          {new Date(
                            selectedNotification.notification.created_at
                          ).toLocaleString()}
                        </span>
                      </div>
                      {selectedNotification.notification.sent_at && (
                        <div className="info-item">
                          <span className="info-label">Sent At:</span>
                          <span className="info-value">
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
              <div className="modal-section">
                <h4 className="section-title">Target Audience</h4>
                <div className="audience-grid">
                  <div className="info-item">
                    <span className="info-label">Audience Type:</span>
                    <p className="info-value">
                      {selectedNotification.notification.target_audience}
                    </p>
                  </div>
                  {selectedNotification.notification.user_types.length > 0 && (
                    <div className="info-item">
                      <span className="info-label">User Types:</span>
                      <p className="info-value">
                        {selectedNotification.notification.user_types.join(
                          ", "
                        )}
                      </p>
                    </div>
                  )}
                  {selectedNotification.notification.subscription_types.length >
                    0 && (
                    <div className="info-item">
                      <span className="info-label">Subscription Types:</span>
                      <p className="info-value">
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
                <div className="modal-section">
                  <h4 className="section-title">Notification Image</h4>
                  <img
                    src={selectedNotification.notification.image_url}
                    alt="Notification"
                    className="notification-image"
                  />
                </div>
              )}

              {/* Action URL */}
              {selectedNotification.notification.action_url && (
                <div className="modal-section">
                  <h4 className="section-title">Action URL</h4>
                  <p className="action-url">
                    {selectedNotification.notification.action_url}
                  </p>
                </div>
              )}

              {/* Recent Deliveries */}
              {selectedNotification.recent_deliveries &&
                selectedNotification.recent_deliveries.length > 0 && (
                  <div className="modal-section">
                    <h4 className="section-title">Recent Deliveries</h4>
                    <div className="deliveries-table-wrapper">
                      <table className="deliveries-table">
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
                                  <div className="user-info">
                                    <p className="user-name">{delivery.name}</p>
                                    <p className="user-email">
                                      {delivery.email}
                                    </p>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`delivery-status delivery-${delivery.status}`}
                                  >
                                    {delivery.status}
                                  </span>
                                </td>
                                <td>
                                  {delivery.error_message ? (
                                    <span className="error-message">
                                      {delivery.error_message}
                                    </span>
                                  ) : (
                                    <span className="no-error">-</span>
                                  )}
                                </td>
                                <td className="delivery-date">
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
                <div className="modal-section">
                  <h4 className="section-title">Error Details</h4>
                  <div className="error-container">
                    <div className="error-content">
                      <AlertCircle className="error-icon" />
                      <p className="error-text">
                        {selectedNotification.notification.error_message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="modal-footer">
              <div className="modal-actions-left">
                {(selectedNotification.notification.status === "pending" ||
                  selectedNotification.notification.status === "scheduled") && (
                  <button
                    onClick={() =>
                      handleCancelNotification(
                        selectedNotification.notification.id
                      )
                    }
                    className="btn btn-danger"
                  >
                    <Trash2 className="btn-icon" />
                    Cancel Notification
                  </button>
                )}
              </div>
              <div className="modal-actions-right">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
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
