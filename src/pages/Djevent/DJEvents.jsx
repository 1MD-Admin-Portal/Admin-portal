import React, { useState, useEffect } from "react";
import {
  getAllDjEvents,
  getDjEventById,
  approveDjEvent,
  rejectDjEvent,
  getPendingDjEvents,
  getDjEventsStatistics,
} from "../../services/djEvents.service";
import "./DjEvents.css";

const DjEvents = () => {
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    playlist_type: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, pending, statistics

  useEffect(() => {
    if (activeTab === "all") {
      fetchEvents();
    } else if (activeTab === "pending") {
      fetchPendingEvents();
    } else if (activeTab === "statistics") {
      fetchStatistics();
    }
  }, [filters, activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDjEvents(
        filters.status,
        filters.playlist_type,
        filters.search,
        filters.page,
        filters.limit
      );
      setEvents(data.events || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError("Failed to fetch DJ events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingDjEvents(filters.page, filters.limit);
      setEvents(data.events || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError("Failed to fetch pending DJ events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDjEventsStatistics();
      setStatistics(data);
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (eventId) => {
    setLoading(true);
    try {
      const data = await getDjEventById(eventId);
      setSelectedEvent(data);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch event details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    if (!window.confirm("Are you sure you want to approve this event?")) {
      return;
    }

    try {
      await approveDjEvent(eventId);
      alert("Event approved successfully!");
      fetchEvents();
    } catch (err) {
      alert("Failed to approve event");
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!selectedEvent) return;

    try {
      await rejectDjEvent(selectedEvent.event.id, rejectNotes);
      alert("Event rejected successfully!");
      setShowRejectModal(false);
      setShowModal(false);
      setRejectNotes("");
      fetchEvents();
    } catch (err) {
      alert("Failed to reject event");
      console.error(err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending_approval: "status-badge pending",
      approved: "status-badge approved",
      in_progress: "status-badge in-progress",
      completed: "status-badge completed",
      cancelled: "status-badge cancelled",
      rejected: "status-badge rejected",
    };

    return (
      <span className={statusClasses[status] || "status-badge"}>
        {status?.replace(/_/g, " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div className="dj-events-container">
      <div className="dj-events-header">
        <h1>DJ Events Management</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Events
        </button>
        <button
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Approval
        </button>
        <button
          className={`tab ${activeTab === "statistics" ? "active" : ""}`}
          onClick={() => setActiveTab("statistics")}
        >
          Statistics
        </button>
      </div>

      {/* Filters - Show only on All Events tab */}
      {activeTab === "all" && (
        <div className="filters-section">
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="search-input"
          />

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.playlist_type}
            onChange={(e) =>
              handleFilterChange("playlist_type", e.target.value)
            }
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading...</div>}

      {/* Statistics View */}
      {activeTab === "statistics" && statistics && !loading && (
        <div className="statistics-view">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Events</h3>
              <p className="stat-value">
                {statistics.overall_statistics?.total_events || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Pending Events</h3>
              <p className="stat-value">
                {statistics.overall_statistics?.pending_events || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Approved Events</h3>
              <p className="stat-value">
                {statistics.overall_statistics?.approved_events || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">
                ${statistics.overall_statistics?.total_revenue || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Total Enrollments</h3>
              <p className="stat-value">
                {statistics.overall_statistics?.total_enrollments || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Avg Event Price</h3>
              <p className="stat-value">
                $
                {statistics.overall_statistics?.average_event_price?.toFixed(
                  2
                ) || 0}
              </p>
            </div>
          </div>

          <div className="stats-section">
            <h2>Events by Type</h2>
            <div className="stats-list">
              {statistics.events_by_type?.map((item) => (
                <div key={item.event_type} className="stat-item">
                  <span>{item.event_type}</span>
                  <span className="stat-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h2>Events by Genre</h2>
            <div className="stats-list">
              {statistics.events_by_genre?.map((item) => (
                <div key={item.music_genre} className="stat-item">
                  <span>{item.music_genre}</span>
                  <span className="stat-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h2>Top DJs</h2>
            <div className="top-djs-list">
              {statistics.top_djs?.map((dj) => (
                <div key={dj.dj_id} className="dj-item">
                  <div>
                    <h4>{dj.dj_name}</h4>
                    <p>
                      Events: {dj.events_created} | Approved:{" "}
                      {dj.approved_events}
                    </p>
                  </div>
                  <span className="avg-price">${dj.average_price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      {(activeTab === "all" || activeTab === "pending") && !loading && (
        <>
          <div className="events-table">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>DJ</th>
                  <th>Type/Genre</th>
                  <th>Date & Time</th>
                  <th>Price</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="event-info">
                        <strong>{event.event_title}</strong>
                        <small>{event.event_description}</small>
                      </div>
                    </td>
                    <td>
                      <div className="dj-info">
                        <img
                          src={event.dj_image}
                          alt={event.dj_name}
                          className="dj-avatar"
                        />
                        <span>{event.dj_name}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{event.event_type}</div>
                        <small>{event.music_genre}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{formatDate(event.scheduled_date)}</div>
                        <small>
                          {formatTime(event.start_time)} -{" "}
                          {formatTime(event.end_time)}
                        </small>
                      </div>
                    </td>
                    <td>${event.price}</td>
                    <td>
                      {event.current_participants || 0} /{" "}
                      {event.max_participants}
                    </td>
                    <td>{getStatusBadge(event.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleViewDetails(event.id)}
                          className="btn-view"
                        >
                          View
                        </button>
                        {event.status === "pending_approval" && (
                          <>
                            <button
                              onClick={() => handleApprove(event.id)}
                              className="btn-approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEvent({ event });
                                setShowRejectModal(true);
                              }}
                              className="btn-reject"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={!pagination.hasPreviousPage}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={!pagination.hasNextPage}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.event?.event_title}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="event-details-grid">
                <div className="detail-section">
                  <h3>Event Information</h3>
                  <p>
                    <strong>Description:</strong>{" "}
                    {selectedEvent.event?.event_description}
                  </p>
                  <p>
                    <strong>Genre:</strong> {selectedEvent.event?.music_genre}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedEvent.event?.event_type}
                  </p>
                  <p>
                    <strong>Price:</strong> ${selectedEvent.event?.price}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedEvent.event?.status)}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>DJ Information</h3>
                  <div className="dj-details">
                    <img
                      src={selectedEvent.event?.dj_image}
                      alt={selectedEvent.event?.dj_name}
                      className="dj-avatar-large"
                    />
                    <div>
                      <p>
                        <strong>Name:</strong> {selectedEvent.event?.dj_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedEvent.event?.dj_email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Statistics</h3>
                  <p>
                    <strong>Total Enrollments:</strong>{" "}
                    {selectedEvent.statistics?.total_enrollments || 0}
                  </p>
                  <p>
                    <strong>Paid Enrollments:</strong>{" "}
                    {selectedEvent.statistics?.paid_enrollments || 0}
                  </p>
                  <p>
                    <strong>Total Revenue:</strong> $
                    {selectedEvent.statistics?.total_revenue || 0}
                  </p>
                  <p>
                    <strong>Average Rating:</strong>{" "}
                    {selectedEvent.statistics?.average_rating || "N/A"}
                  </p>
                </div>

                {selectedEvent.enrollments?.length > 0 && (
                  <div className="detail-section full-width">
                    <h3>Enrollments</h3>
                    <table className="enrollments-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.enrollments.map((enrollment) => (
                          <tr key={enrollment.enrollment_id}>
                            <td>
                              <div className="user-info">
                                <img
                                  src={enrollment.user_image}
                                  alt={enrollment.user_name}
                                  className="user-avatar"
                                />
                                <span>{enrollment.user_name}</span>
                              </div>
                            </td>
                            <td>{enrollment.user_email}</td>
                            <td>{enrollment.status}</td>
                            <td>{enrollment.payment_status}</td>
                            <td>${enrollment.amount_paid}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="modal-content small"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Reject Event</h2>
              <button
                onClick={() => setShowRejectModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <label>Admin Notes (Reason for rejection):</label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
                className="reject-textarea"
              />
              <div className="modal-actions">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button onClick={handleReject} className="btn-reject">
                  Reject Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DjEvents;
