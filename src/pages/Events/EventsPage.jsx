import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Euro,
  Eye,
  CheckCircle,
  XCircle,
  Users,
  Image as ImageIcon,
  X,
  Filter,
  User,
  Mail,
} from "lucide-react";
import GlobalLoader from "../../components/common/GlobalLoader";
import Pagination from "../../components/common/Pagination";
import {
  getAllDraftEventsService,
  getAllApprovedEventsService,
  getEventInterestsService,
  approveEventService,
  rejectEventService,
} from "../../services/event.service";
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
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [page, activeTab]);

  const fetchEvents = async () => {
  setLoading(true);
  try {
    let res;
    if (activeTab === "requireApproval") {
      res = await getAllDraftEventsService({ page, limit: 10 });
    } else {
      res = await getAllApprovedEventsService({ page, limit: 10 });
    }
    setEvents(res?.events || []);
    setTotalPages(res?.pagination?.totalPages ?? 1); // ✅ fix here
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    setEvents([]);        // ✅ clear on error too
    setTotalPages(1);
  }
  setLoading(false);
};

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("event-modal-open");
    } else {
      document.body.classList.remove("event-modal-open");
    }
    return () => {
      document.body.classList.remove("event-modal-open");
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
    return `${price}`;
  };

  // Helper function — add this inside your component
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date)) return "—";
  return date.toLocaleDateString("en-GB"); // gives dd/mm/yyyy
};

  return (
    <div className="event-moderation-wrapper">
      <div className="event-moderation-header">
        <h1 className="event-moderation-title">Event Moderation</h1>
        <p className="event-moderation-subtitle">Manage and review event submissions</p>
      </div>

      {/* Enhanced Tabs */}
      <div className="event-moderation-tabs">
        <button
          className={`event-tab-button ${activeTab === "requireApproval" ? "event-tab-active" : ""
            }`}
          onClick={() => {
            setActiveTab("requireApproval");
            setPage(1);
          }}
        >
          <Filter size={16} />
          Require Approval
          {activeTab === "requireApproval" && (
            <span className="event-tab-indicator"></span>
          )}
        </button>
        <button
          className={`event-tab-button ${activeTab === "approved" ? "event-tab-active" : ""
            }`}
          onClick={() => {
            setActiveTab("approved");
            setPage(1);
          }}
        >
          <CheckCircle size={16} />
          Approved Events
          {activeTab === "approved" && (
            <span className="event-tab-indicator"></span>
          )}
        </button>
      </div>

      {loading ? (
        <GlobalLoader text="Loading events..." />
      ) : events.length === 0 ? (
        <div className="event-empty-state">
          <span className="event-empty-icon">📅</span>
          <span className="event-empty-text">
            No events found in this category.
          </span>
        </div>
      ) : (
        <div className="event-table-wrapper">
          <table className="event-moderation-table">
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
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
                  <Euro size={16} />
                  Price
                </th>
                <th>Created at </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.event_id} className="event-table-row">
                  <td
                    className="event-title-column clickable"
                    onClick={() => openEventModal(event)}
                  >
                    <div className="event-title-wrapper">
                      <span className="event-title-label">
                        {event.event_title}
                      </span>
                    </div>
                  </td>
                  <td className="event-type-column">
                    <div className="event-type-badges">
                      <span
                        className={`event-type-badge event-type-${event.event_type
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {event.event_type}
                      </span>
                      {event.dance_style && (
                        <span
                          className={`event-dance-badge event-dance-${event.dance_style
                            ?.toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {event.dance_style}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="event-date-column">
                    <div className="event-datetime-info">
                      <div className="event-date-info">
                        <Calendar size={14} />
                        {formatDate(event.event_date)}
                      </div>
                      {event.event_time && (
                        <div className="event-time-info">
                          <Clock size={12} />
                          {event.event_time}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="event-location-column">
                    <div className="event-location-info">
                      <MapPin size={14}/>
                      {event.location}
                    </div>
                  </td>
                  <td className="event-price-column">
                    <div className="event-price-display">
                      <Euro size={14} />
                      {formatPrice(event.price)}
                    </div>
                  </td>
                  
                  <td>{new Date(event.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="event-actions-column">
                    {activeTab === "requireApproval" && (
                      <div className="event-action-buttons">
                        <button
                          className="event-approve-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(event.event_id);
                          }}
                          title="Approve Event"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className="event-reject-btn"
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
                        className="event-view-interested-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchInterestedUsers(event);
                        }}
                        title="View Interested Users"
                      >
                        <Eye size={16} />
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
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={loading}
        />
      )}

      {/* Enhanced Modal */}
      {modalOpen && selectedEvent && (
        <div
          className="event-modal-backdrop"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="event-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="event-modal-header">
              <h2 className="event-modal-title">{selectedEvent.event_title}</h2>
              <button
                className="event-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X />
              </button>
            </div>

            <div className="event-modal-content">
              <div className="event-modal-grid">
                {/* Left Column - Event Info */}
                <div className="event-modal-left">
                  <div className="event-info-section">
                    <h3 className="event-section-title">Event Information</h3>
                    <div className="event-info-cards">
                      <div className="event-info-card">
                        <div className="event-info-label">Event Type</div>
                        <div className="event-info-value">
                          <span
                            className={`event-type-badge event-type-${selectedEvent.event_type
                              ?.toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {selectedEvent.event_type}
                          </span>
                        </div>
                      </div>
                      <div className="event-info-card">
                        <div className="event-info-label">Dance Style</div>
                        <div className="event-info-value">
                          <span
                            className={`event-dance-badge event-dance-${selectedEvent.dance_style
                              ?.toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {selectedEvent.dance_style}
                          </span>
                        </div>
                      </div>
                      <div className="event-info-card">
                        <div className="event-info-label">Skill Level</div>
                        <div className="event-info-value">
                          <span
                            className={`event-level-badge event-level-${selectedEvent.skill_level?.toLowerCase()}`}
                          >
                            {selectedEvent.skill_level}
                          </span>
                        </div>
                      </div>
                      <div className="event-info-card">
                        <div className="event-info-label">Date & Time</div>
                        <div className="event-info-value">
                          <Calendar size={16} />
                          {new Date(
                            selectedEvent.event_date
                          ).toLocaleDateString("en-GB")}
                          {selectedEvent.event_time && (
                            <div className="event-time-info">
                              <Clock size={14} />
                              {selectedEvent.event_time}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="event-info-card">
                        <div className="event-info-label">Location</div>
                        <div className="event-info-value">
                          <MapPin size={16} />
                          {selectedEvent.location}
                        </div>
                      </div>
                      <div className="event-info-card">
                        <div className="event-info-label">Price</div>
                        <div className="event-info-value">
                          <Euro size={16} />
                          {formatPrice(selectedEvent.price)}
                        </div>
                      </div>
                    </div>

                    {selectedEvent.description && (
                      <div className="event-description-section">
                        <div className="event-info-label">Description</div>
                        <p className="event-description-text">
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Images & Users */}
                <div className="event-modal-right">
                  {selectedEvent.images && (
                    <div className="event-images-section">
                      <h3 className="event-section-title">
                        <ImageIcon size={20} />
                        Event Images
                      </h3>
                      <div className="event-images-grid">
                        {JSON.parse(selectedEvent.images).map((img, i) => (
                          <div key={i} className="event-image-wrapper">
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
                    <div className="event-users-section">
                      <h3 className="event-section-title">
                        <Users size={20} />
                        Interested Users ({interestedUsers.length})
                      </h3>
                      <div className="event-users-list">
                        {interestedUsers.map((user) => (
                          <div
                            key={user.interest_id}
                            className="event-user-card"
                          >
                            <div className="event-user-avatar">
                              <img
                                src={
                                  user.user.profile_image ||
                                  "https://via.placeholder.com/40?text=U"
                                }
                                alt={user.user.name}
                                className="event-avatar-image"
                              />
                            </div>
                            <div className="event-user-details">
                              <div className="event-user-name">
                                <User size={14} />
                                {user.user.name}
                              </div>
                              <div className="event-user-email">
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
              </div>
            </div>

            {activeTab === "requireApproval" && (
              <div className="event-modal-actions">
                <button
                  className="event-modal-approve-btn"
                  onClick={() => handleApprove(selectedEvent.event_id)}
                >
                  <CheckCircle size={16} />
                  Approve Event
                </button>
                <button
                  className="event-modal-reject-btn"
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

      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="event-lightbox-backdrop"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="event-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="event-lightbox-close"
              onClick={() => setLightboxImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImage}
              alt="Event Image"
              className="event-lightbox-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
