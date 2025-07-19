import React, { useState } from "react";
import "./TicketRaisePage.css";

const mockTickets = [
  {
    id: 1,
    raisedBy: "DJ Sonic",
    issueType: "Payment Failed",
    description: "Amount deducted but subscription not activated.",
    category: "Money",
    date: "2025-07-18",
    status: "Open",
  },
  {
    id: 2,
    raisedBy: "Prof. Maya",
    issueType: "Class Earnings Mismatch",
    description: "Earnings for last 1:1 class not reflected.",
    category: "Money",
    date: "2025-07-17",
    status: "Under Review",
  },
  {
    id: 3,
    raisedBy: "John (Student)",
    issueType: "Technical Error",
    description: "Live class stopped midway due to audio glitch.",
    category: "Technical",
    date: "2025-07-16",
    status: "Resolved",
  },
  {
    id: 4,
    raisedBy: "Organizer A",
    issueType: "Event Earnings Missing",
    description: "Sold tickets, but no earning reflected.",
    category: "Money",
    date: "2025-07-15",
    status: "Open",
  },
  {
    id: 5,
    raisedBy: "Prof. Alan",
    issueType: "Content Violation Warning",
    description: "Received warning without uploading anything wrong.",
    category: "Other",
    date: "2025-07-14",
    status: "Under Review",
  },
  {
    id: 6,
    raisedBy: "DJ Pulse",
    issueType: "Commission Error",
    description: "Platform deducted wrong commission from payout.",
    category: "Money",
    date: "2025-07-13",
    status: "Resolved",
  },
  {
    id: 7,
    raisedBy: "Student Nina",
    issueType: "Booking Not Confirmed",
    description: "Joined a class but didn’t get confirmation.",
    category: "General",
    date: "2025-07-12",
    status: "Open",
  },
  {
    id: 8,
    raisedBy: "Organizer Zed",
    issueType: "Referral Reward Missing",
    description: "Referred a DJ but didn’t receive bonus.",
    category: "Money",
    date: "2025-07-11",
    status: "Open",
  },
  {
    id: 9,
    raisedBy: "Prof. Leo",
    issueType: "App Crash",
    description: "App crashes when trying to start a class.",
    category: "Technical",
    date: "2025-07-10",
    status: "Resolved",
  },
  {
    id: 10,
    raisedBy: "DJ Aura",
    issueType: "Profile Update Failed",
    description: "Unable to update contact details.",
    category: "General",
    date: "2025-07-09",
    status: "Under Review",
  },
];

const TicketRaisePage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.raisedBy.toLowerCase().includes(search.toLowerCase()) ||
      ticket.issueType.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || ticket.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="tickets-container">
      <h1>Ticket Raise Section</h1>

      <div className="ticket-filters">
        <input
          type="text"
          placeholder="Search by user, issue or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Money">Money</option>
          <option value="Technical">Technical</option>
          <option value="General">General</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Raised By</th>
            <th>Issue Type</th>
            <th>Description</th>
            <th>Category</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.raisedBy}</td>
                <td>{ticket.issueType}</td>
                <td>{ticket.description}</td>
                <td>{ticket.category}</td>
                <td>{ticket.date}</td>
                <td>
                  <span
                    className={`status-badge ${ticket.status
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {ticket.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-results">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketRaisePage;
