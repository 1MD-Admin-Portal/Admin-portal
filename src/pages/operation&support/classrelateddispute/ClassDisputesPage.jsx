import React, { useState } from "react";
import "./ClassDisputesPage.css";

const mockClassDisputes = [
  {
    id: 1,
    userType: "Student",
    otherParty: "Prof. Sarah",
    issue: "Teacher didn't show up",
    classType: "1:1",
    classTitle: "Private Salsa",
    date: "2025-07-15",
    status: "Open",
  },
  {
    id: 2,
    userType: "Professor",
    otherParty: "John Doe",
    issue: "Student didn't show up",
    classType: "1:1",
    classTitle: "Ballet Session",
    date: "2025-07-14",
    status: "Open",
  },
  {
    id: 3,
    userType: "Student",
    otherParty: "DJ Echo",
    issue: "Inappropriate language used",
    classType: "Group",
    classTitle: "Hip Hop Masterclass",
    date: "2025-07-13",
    status: "Under Review",
  },
  {
    id: 4,
    userType: "Professor",
    otherParty: "Mike Singh",
    issue: "Student used abusive language",
    classType: "Group",
    classTitle: "Modern Jazz Basics",
    date: "2025-07-12",
    status: "Resolved",
  },
  {
    id: 5,
    userType: "Student",
    otherParty: "DJ Pulse",
    issue: "Didn't like the class content",
    classType: "1:1",
    classTitle: "Beats Production",
    date: "2025-07-10",
    status: "Open",
  },
  {
    id: 6,
    userType: "Student",
    otherParty: "Prof. Alex",
    issue: "Class started 30 minutes late",
    classType: "Group",
    classTitle: "Contemporary Dance",
    date: "2025-07-09",
    status: "Resolved",
  },
  {
    id: 7,
    userType: "Professor",
    otherParty: "James Lee",
    issue: "Student entered wrong class",
    classType: "Group",
    classTitle: "Tap Dancing 101",
    date: "2025-07-08",
    status: "Open",
  },
  {
    id: 8,
    userType: "Student",
    otherParty: "Prof. Nina",
    issue: "Class was canceled without notice",
    classType: "1:1",
    classTitle: "Footwork Foundation",
    date: "2025-07-07",
    status: "Under Review",
  },
  {
    id: 9,
    userType: "Student",
    otherParty: "DJ Sonic",
    issue: "Technical issues, no audio",
    classType: "Group",
    classTitle: "Mixing Beats",
    date: "2025-07-06",
    status: "Resolved",
  },
  {
    id: 10,
    userType: "Professor",
    otherParty: "Chris",
    issue: "Student misbehaving during session",
    classType: "1:1",
    classTitle: "Locking & Popping",
    date: "2025-07-05",
    status: "Open",
  },
];

const ClassDisputesPage = () => {
  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("All");
  const [classTypeFilter, setClassTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockClassDisputes.filter((item) => {
    const matchesSearch =
      item.otherParty.toLowerCase().includes(search.toLowerCase()) ||
      item.issue.toLowerCase().includes(search.toLowerCase()) ||
      item.classTitle.toLowerCase().includes(search.toLowerCase());

    const matchesUserType =
      userTypeFilter === "All" || item.userType === userTypeFilter;

    const matchesClassType =
      classTypeFilter === "All" || item.classType === classTypeFilter;

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return (
      matchesSearch && matchesUserType && matchesClassType && matchesStatus
    );
  });

  return (
    <div className="disputes-container">
      <h1>Class Related Disputes</h1>

      <div className="dispute-filters">
        <input
          type="text"
          placeholder="Search by name, issue, or class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={userTypeFilter}
          onChange={(e) => setUserTypeFilter(e.target.value)}
        >
          <option value="All">All User Types</option>
          <option value="Student">Student</option>
          <option value="Professor">Professor</option>
          <option value="DJ">DJ</option>
        </select>
        <select
          value={classTypeFilter}
          onChange={(e) => setClassTypeFilter(e.target.value)}
        >
          <option value="All">All Class Types</option>
          <option value="1:1">1:1</option>
          <option value="Group">Group</option>
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

      <table className="dispute-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Type</th>
            <th>Other Party</th>
            <th>Issue</th>
            <th>Class Type</th>
            <th>Class Title</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.userType}</td>
                <td>{item.otherParty}</td>
                <td>{item.issue}</td>
                <td>{item.classType}</td>
                <td>{item.classTitle}</td>
                <td>{item.date}</td>
                <td>
                  <span
                    className={`status-badge ${item.status
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-results">
                No disputes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassDisputesPage;
