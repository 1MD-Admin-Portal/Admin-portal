import React, { useState } from "react";
import "./DisputesPage.css";

const mockDisputes = [
  {
    id: 1,
    userType: "Dancer",
    userName: "Alice Johnson",
    issue: "Subscription charged twice",
    amount: "$30",
    status: "Pending",
    date: "2025-07-15",
  },
  {
    id: 2,
    userType: "DJ",
    userName: "Mike Beats",
    issue: "Plan downgraded without refund",
    amount: "$50",
    status: "Resolved",
    date: "2025-07-10",
  },
  {
    id: 3,
    userType: "Professor",
    userName: "Dr. Emma Lane",
    issue: "No access after payment",
    amount: "$20",
    status: "Pending",
    date: "2025-07-08",
  },
  {
    id: 4,
    userType: "Organizer",
    userName: "Tony Robbins",
    issue: "Promo code not applied",
    amount: "$40",
    status: "Resolved",
    date: "2025-07-04",
  },
  {
    id: 5,
    userType: "Dancer",
    userName: "Linda Perez",
    issue: "Auto-renewal without notice",
    amount: "$25",
    status: "In Review",
    date: "2025-07-02",
  },
  {
    id: 6,
    userType: "DJ",
    userName: "DJ Storm",
    issue: "Refund not processed",
    amount: "$35",
    status: "Pending",
    date: "2025-06-30",
  },
  {
    id: 7,
    userType: "Professor",
    userName: "Prof. Henry Wu",
    issue: "Charged for inactive account",
    amount: "$18",
    status: "Resolved",
    date: "2025-06-25",
  },
  {
    id: 8,
    userType: "Organizer",
    userName: "Elena Gilbert",
    issue: "Event not approved but charged",
    amount: "$45",
    status: "In Review",
    date: "2025-06-20",
  },
  {
    id: 9,
    userType: "Dancer",
    userName: "Chris Miles",
    issue: "Wrong plan charged",
    amount: "$28",
    status: "Pending",
    date: "2025-06-18",
  },
  {
    id: 10,
    userType: "DJ",
    userName: "DJ Echo",
    issue: "Card charged after cancellation",
    amount: "$60",
    status: "Resolved",
    date: "2025-06-15",
  },
];

const DisputesPage = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch =
      dispute.userName.toLowerCase().includes(search.toLowerCase()) ||
      dispute.issue.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === "All" || dispute.userType === filterType;

    const matchesStatus =
      filterStatus === "All" || dispute.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="disputes-container">
      <h1>Dispute Management</h1>

      <div className="dispute-filters">
        <input
          type="text"
          placeholder="Search by name or issue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All User Types</option>
          <option value="Dancer">Dancer</option>
          <option value="DJ">DJ</option>
          <option value="Professor">Professor</option>
          <option value="Organizer">Organizer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="In Review">In Review</option>
        </select>
      </div>

      <table className="dispute-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Type</th>
            <th>User Name</th>
            <th>Issue</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredDisputes.length > 0 ? (
            filteredDisputes.map((dispute) => (
              <tr key={dispute.id}>
                <td>{dispute.id}</td>
                <td>{dispute.userType}</td>
                <td>{dispute.userName}</td>
                <td>{dispute.issue}</td>
                <td>{dispute.amount}</td>
                <td>
                  <span
                    className={`status-badge ${dispute.status
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {dispute.status}
                  </span>
                </td>

                <td>{dispute.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-results">
                No disputes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DisputesPage;
