import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Users,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Mail,
} from "lucide-react";
import {
  getAllDraftEventsService,
  getAllApprovedEventsService,
  getEventInterestsService,
  approveEventService,
  rejectEventService,
} from "../../../services/event.service";
import "./EventsPage.css";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("requireApproval");
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [page, activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "requireApproval") {
        res = await getAllDraftEventsService({ page, limit: 10 });
      } else if (activeTab === "approved") {
        res = await getAllApprovedEventsService({ page, limit: 10 });
      }
      setEvents(res?.events || []);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [modalOpen]);

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setInterestedUsers([]);
    setModalOpen(true);
  };

  const fetchInterestedUsers = async (event) => {
    setLoading(true);
    try {
      const res = await getEventInterestsService(event.event_id, {
        page: 1,
        limit: 10,
      });
      setSelectedEvent(res.event);
      setInterestedUsers(res.interested_users || []);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleApprove = async (eventId) => {
    await approveEventService(eventId, "");
    fetchEvents();
    setModalOpen(false);
  };

  const handleReject = async (eventId) => {
    await rejectEventService(eventId, "Rejected by Admin");
    fetchEvents();
    setModalOpen(false);
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "Free";
    return `$${price}`;
  };

  return (
    <div className="events-page-container">
      <div className="events-page-header">
        <h1 className="events-page-title">Event Moderation</h1>
      </div>

      {/* Enhanced Tabs */}
      <div className="events-tabs">
        <button
          className={`tab-btn ${
            activeTab === "requireApproval" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("requireApproval");
            setPage(1);
          }}
        >
          <Filter size={16} />
          Require Approval
          {activeTab === "requireApproval" && (
            <span className="tab-indicator"></span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("approved");
            setPage(1);
          }}
        >
          <CheckCircle size={16} />
          Approved Events
          {activeTab === "approved" && <span className="tab-indicator"></span>}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <span className="empty-text">No events found in this category.</span>
        </div>
      ) : (
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>
                  <Calendar size={16} />
                  Event Details
                </th>
                <th>
                  <Filter size={16} />
                  Type & Style
                </th>
                <th>
                  <Clock size={16} />
                  Date & Time
                </th>
                <th>
                  <MapPin size={16} />
                  Location
                </th>
                <th>
                  <DollarSign size={16} />
                  Price
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.event_id} className="events-row">
                  <td
                    className="event-title-cell clickable"
                    onClick={() => openEventModal(event)}
                  >
                    <div className="event-title-content">
                      <span className="event-title-text">
                        {event.event_title}
                      </span>
                      <Eye size={14} className="view-icon" />
                    </div>
                  </td>
                  <td className="event-type-cell">
                    <div className="type-badges">
                      <span
                        className={`type-badge type-${event.event_type
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {event.event_type}
                      </span>
                      {event.dance_style && (
                        <span
                          className={`dance-style-badge style-${event.dance_style
                            ?.toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {event.dance_style}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="event-date-cell">
                    <div className="date-time-info">
                      <div className="date-info">
                        <Calendar size={14} />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      {event.event_time && (
                        <div className="time-info">
                          <Clock size={12} />
                          {event.event_time}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="event-location-cell">
                    <div className="location-info">
                      <MapPin size={14} />
                      {event.location}
                    </div>
                  </td>
                  <td className="event-price-cell">
                    <div className="price-tag">
                      <DollarSign size={14} />
                      {formatPrice(event.price)}
                    </div>
                  </td>
                  <td className="actions-cell">
                    {activeTab === "requireApproval" && (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(event.event_id);
                          }}
                          title="Approve Event"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="reject-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(event.event_id);
                          }}
                          title="Reject Event"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                    {activeTab === "approved" && (
                      <button
                        className="view-interested-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchInterestedUsers(event);
                        }}
                        title="View Interested Users"
                      >
                        <Users size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          <span className="page-indicator">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Enhanced Modal */}
      {modalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">{selectedEvent.event_title}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3 className="section-title">Event Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Event Type</div>
                    <div className="info-value">
                      <span
                        className={`type-badge type-${selectedEvent.event_type
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {selectedEvent.event_type}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Dance Style</div>
                    <div className="info-value">
                      <span
                        className={`dance-style-badge style-${selectedEvent.dance_style
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {selectedEvent.dance_style}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Skill Level</div>
                    <div className="info-value">
                      <span
                        className={`level-badge level-${selectedEvent.skill_level?.toLowerCase()}`}
                      >
                        {selectedEvent.skill_level}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Date & Time</div>
                    <div className="info-value">
                      <Calendar size={16} />
                      {new Date(selectedEvent.event_date).toLocaleDateString()}
                      {selectedEvent.event_time && (
                        <div className="time-info">
                          <Clock size={14} />
                          {selectedEvent.event_time}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Location</div>
                    <div className="info-value">
                      <MapPin size={16} />
                      {selectedEvent.location}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Price</div>
                    <div className="info-value">
                      <DollarSign size={16} />
                      {formatPrice(selectedEvent.price)}
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="description-section">
                    <div className="info-label">Description</div>
                    <p className="description-text">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>

              {selectedEvent.images && (
                <div className="modal-section">
                  <h3 className="section-title">
                    <ImageIcon size={20} />
                    Event Images
                  </h3>
                  <div className="event-images-grid">
                    {JSON.parse(selectedEvent.images).map((img, i) => (
                      <div key={i} className="event-image-container">
                        <img
                          src={img}
                          alt={`Event ${i + 1}`}
                          className="event-image"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interestedUsers.length > 0 && (
                <div className="modal-section">
                  <h3 className="section-title">
                    <Users size={20} />
                    Interested Users ({interestedUsers.length})
                  </h3>
                  <div className="interested-users-list">
                    {interestedUsers.map((user) => (
                      <div
                        key={user.interest_id}
                        className="interested-user-item"
                      >
                        <div className="user-avatar">
                          <img
                            src={
                              user.user.profile_image ||
                              "https://via.placeholder.com/40?text=U"
                            }
                            alt={user.user.name}
                            className="avatar-image"
                          />
                        </div>
                        <div className="user-info">
                          <div className="user-name">
                            <User size={14} />
                            {user.user.name}
                          </div>
                          <div className="user-email">
                            <Mail size={12} />
                            {user.user.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {activeTab === "requireApproval" && (
              <div className="modal-actions">
                <button
                  className="approve-action-btn"
                  onClick={() => handleApprove(selectedEvent.event_id)}
                >
                  <CheckCircle size={16} />
                  Approve Event
                </button>
                <button
                  className="reject-action-btn"
                  onClick={() => handleReject(selectedEvent.event_id)}
                >
                  <XCircle size={16} />
                  Reject Event
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
