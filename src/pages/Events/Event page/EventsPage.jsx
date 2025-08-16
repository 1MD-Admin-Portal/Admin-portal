import React, { useEffect, useState } from "react";
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

  return (
    <div className="event-moderation">
      <h1>Event Moderation</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "requireApproval" ? "active" : ""}
          onClick={() => {
            setActiveTab("requireApproval");
            setPage(1);
          }}
        >
          Require Approval
        </button>
        <button
          className={activeTab === "approved" ? "active" : ""}
          onClick={() => {
            setActiveTab("approved");
            setPage(1);
          }}
        >
          Approved Events
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.event_id}>
                <td
                  className="clickable-title"
                  onClick={() => openEventModal(event)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                >
                  {event.event_title}
                </td>
                <td>{event.event_type}</td>
                <td>{new Date(event.event_date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  {activeTab === "requireApproval" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(event.event_id);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(event.event_id);
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {activeTab === "approved" && (
                    <button
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchInterestedUsers(event);
                      }}
                    >
                      View Interested
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedEvent && (
        <div className="modal" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent.event_title}</h2>
            <p>
              <strong>Type:</strong> {selectedEvent.event_type}
            </p>
            <p>
              <strong>Dance Style:</strong> {selectedEvent.dance_style}
            </p>
            <p>
              <strong>Skill Level:</strong> {selectedEvent.skill_level}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedEvent.event_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {selectedEvent.event_time}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Price:</strong> ${selectedEvent.price}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            {selectedEvent.images && (
              <div className="event-images">
                {JSON.parse(selectedEvent.images).map((img, i) => (
                  <img key={i} src={img} alt="Event" />
                ))}
              </div>
            )}
            {interestedUsers.length > 0 && (
              <>
                <h3>Interested Users</h3>
                <ul>
                  {interestedUsers.map((user) => (
                    <li key={user.interest_id}>
                      {user.user.name} ({user.user.email})
                    </li>
                  ))}
                </ul>
              </>
            )}
            {activeTab === "requireApproval" && (
              <div className="popup-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(selectedEvent.event_id)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(selectedEvent.event_id)}
                >
                  Reject
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
