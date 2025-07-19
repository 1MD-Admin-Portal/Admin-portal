import React, { useState } from "react";
import "./EarningsPage.css";

const mockEarnings = [
  {
    id: 1,
    name: "Prof. Sarah Lee",
    userType: "Professor",
    source: "1:1 Class",
    classTitle: "Advanced Ballet",
    amount: 80,
    date: "2025-07-10",
  },
  {
    id: 2,
    name: "DJ Pulse",
    userType: "DJ",
    source: "Exclusive Content",
    classTitle: "Club Beats Vol. 1",
    amount: 120,
    date: "2025-07-12",
  },
  {
    id: 3,
    name: "Prof. Mark Newton",
    userType: "Professor",
    source: "Referral",
    classTitle: "—",
    amount: 25,
    date: "2025-07-09",
  },
  {
    id: 4,
    name: "DJ Echo",
    userType: "DJ",
    source: "Group Class",
    classTitle: "Remix Masterclass",
    amount: 60,
    date: "2025-07-11",
  },
  {
    id: 5,
    name: "Prof. Emily Chen",
    userType: "Professor",
    source: "Group Class",
    classTitle: "Creative Choreography",
    amount: 75,
    date: "2025-07-08",
  },
  {
    id: 6,
    name: "DJ Sonic",
    userType: "DJ",
    source: "Referral",
    classTitle: "—",
    amount: 30,
    date: "2025-07-06",
  },
  {
    id: 7,
    name: "Organizer John Max",
    userType: "Organizer",
    source: "Event Ticket Sale",
    classTitle: "Dance Night 2025",
    amount: 300,
    date: "2025-07-05",
  },
  {
    id: 8,
    name: "Prof. Olivia Wright",
    userType: "Professor",
    source: "Exclusive Content",
    classTitle: "Stretching Techniques",
    amount: 50,
    date: "2025-07-03",
  },
  {
    id: 9,
    name: "Organizer Lisa Moore",
    userType: "Organizer",
    source: "Event Ticket Sale",
    classTitle: "Urban Moves Festival",
    amount: 220,
    date: "2025-07-02",
  },
  {
    id: 10,
    name: "DJ Blaze",
    userType: "DJ",
    source: "1:1 Class",
    classTitle: "DJ Setup Basics",
    amount: 90,
    date: "2025-07-01",
  },
];

const EarningsPage = () => {
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  const filtered = mockEarnings.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.classTitle.toLowerCase().includes(search.toLowerCase());

    const matchesUser = userFilter === "All" || entry.userType === userFilter;

    const matchesSource =
      sourceFilter === "All" || entry.source === sourceFilter;

    return matchesSearch && matchesUser && matchesSource;
  });

  return (
    <div className="earnings-container">
      <h1>Earnings Overview</h1>

      <div className="earnings-filters">
        <input
          type="text"
          placeholder="Search by name or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Professor">Professor</option>
          <option value="DJ">DJ</option>
          <option value="Organizer">Organizer</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="All">All Sources</option>
          <option value="1:1 Class">1:1 Class</option>
          <option value="Group Class">Group Class</option>
          <option value="Exclusive Content">Exclusive Content</option>
          <option value="Referral">Referral</option>
          <option value="Event Ticket Sale">Event Ticket Sale</option>
        </select>
      </div>

      <table className="earnings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>User Type</th>
            <th>Source</th>
            <th>Class/Event</th>
            <th>Amount ($)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.name}</td>
                <td>{entry.userType}</td>
                <td>{entry.source}</td>
                <td>{entry.classTitle}</td>
                <td>{entry.amount}</td>
                <td>{entry.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-results">
                No earnings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EarningsPage;
