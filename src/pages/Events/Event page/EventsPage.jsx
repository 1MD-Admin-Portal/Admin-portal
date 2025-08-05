import React, { useState } from "react";
import "./EventsPage.css";
import { FiSearch } from "react-icons/fi";
import CreateEventModal from "../Create Event Modal/CreateEventModal.jsx";
import { X } from "lucide-react";

const initialEvents = [
  {
    id: 101,
    title: "Kizomba Night",
    organizer: "DanceWorld",
    dateTime: "Jun 10, 2025 8:00 PM",
    location: "NYC, NY",
    ticketType: "Paid",
    approvalStatus: "Pending",
  },
  {
    id: 102,
    title: "Salsa Weekend",
    organizer: "LatinMoves",
    dateTime: "Jun 25, 2025 6:00 PM",
    location: "Miami, FL",
    ticketType: "Free",
    approvalStatus: "Pending",
  },
  {
    id: 103,
    title: "Urban Beats Jam",
    organizer: "StepUp Crew",
    dateTime: "Jul 5, 2025 7:30 PM",
    location: "Los Angeles",
    ticketType: "Paid",
    approvalStatus: "Pending",
  },
  {
    id: 104,
    title: "Urban Beats Jam",
    organizer: "Ste Angeles, CA",
    dateTime: "Jul 5, 2025 7:30 PM",
    location: "Miami, FL",
    ticketType: "Free",
    approvalStatus: "Pending",
  },
];

const EventsPage = () => {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketFilter, setTicketFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      ticketFilter === "All" ||
      event.ticketType.toLowerCase() === ticketFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleApproval = (id, status) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, approvalStatus: status } : event
    );
    setEvents(updatedEvents);
    setSelectedEvent(null);
  };

  return (
    <div className="events-container">
      <h2 className="events-header">Events</h2>

      <div className="events-actions">
        <div className="events-search">
          <FiSearch style={{ marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="events-filter"
          value={ticketFilter}
          onChange={(e) => setTicketFilter(e.target.value)}
        >
          <option value="All">All Tickets</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
        </select>
      </div>

      <table className="events-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Organizer</th>
            <th>Date & Time</th>
            <th>Location</th>
            <th>Ticket Type</th>
            <th>Status</th>
            <th>Acts.</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => (
            <tr
              key={event.id}
              className="clickable-row"
              onClick={() => setSelectedEvent(event)}
            >
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{event.organizer}</td>
              <td>{event.dateTime}</td>
              <td>{event.location}</td>
              <td>{event.ticketType}</td>
              <td>{event.approvalStatus}</td>
              <td>
                <span className="events-action-link">View</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="create-event-btn" onClick={() => setShowModal(true)}>
        Create Event
      </button>

      {showModal && <CreateEventModal onClose={() => setShowModal(false)} />}

      {/* Row-Click Popup Modal */}
      {selectedEvent && (
        <div
          className="event-popup-overlay"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="event-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h2>{selectedEvent.title}</h2>
              <X
                className="popup-close"
                onClick={() => setSelectedEvent(null)}
              />
            </div>
            <p>
              <strong>Organizer:</strong> {selectedEvent.organizer}
            </p>
            <p>
              <strong>Date & Time:</strong> {selectedEvent.dateTime}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Ticket Type:</strong> {selectedEvent.ticketType}
            </p>
            <p>
              <strong>Status:</strong> {selectedEvent.approvalStatus}
            </p>

            <div className="popup-actions">
              {selectedEvent.approvalStatus === "Pending" && (
                <>
                  <button
                    className="approve-btn"
                    onClick={() => handleApproval(selectedEvent.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleApproval(selectedEvent.id, "Rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
              {selectedEvent.approvalStatus === "Approved" && (
                <button
                  className="reject-btn"
                  onClick={() => handleApproval(selectedEvent.id, "Rejected")}
                >
                  Mark as Rejected
                </button>
              )}
              {selectedEvent.approvalStatus === "Rejected" && (
                <button
                  className="approve-btn"
                  onClick={() => handleApproval(selectedEvent.id, "Approved")}
                >
                  Mark as Approved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
