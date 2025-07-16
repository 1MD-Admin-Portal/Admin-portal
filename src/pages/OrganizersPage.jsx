import React, { useState, useEffect, useRef } from "react";
import "../styles/OrganizersPage.css";
import { FaSearch } from "react-icons/fa";

const organizersData = [
  {
    id: 301,
    name: "Lara Gomez",
    email: "lara@example.com",
    status: "Pending",
    eventsHosted: 0,
    totalAttendees: 0,
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    id: 302,
    name: "Carlos Mendez",
    email: "carlos@example.com",
    status: "Verified",
    eventsHosted: 1,
    totalAttendees: 12,
    avatar: "https://i.pravatar.cc/40?img=13",
  },
  {
    id: 303,
    name: "Emily Zhao",
    email: "emily@example.com",
    status: "Verified",
    eventsHosted: 3,
    totalAttendees: 110,
    avatar: "https://i.pravatar.cc/40?img=14",
  },
];

const getOrganizerBadge = (status, events, attendees) => {
  if (status !== "Verified") return "⏳ Not Verified";
  if (events >= 3 || attendees >= 100) return "🏙️ City Promoter";
  if (attendees >= 10) return "🚀 Starter Host";
  return "✅ Verified";
};

const OrganizersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("");
  const [attendeesFilter, setAttendeesFilter] = useState("");
  const [eventsFilter, setEventsFilter] = useState("");
  const [organizers, setOrganizers] = useState(organizersData);
  const [dropdownId, setDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const approveOrganizer = (orgId) => {
    setOrganizers((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, status: "Verified" } : o))
    );
  };

  const filtered = organizers.filter((org) => {
    const badge = getOrganizerBadge(
      org.status,
      org.eventsHosted,
      org.totalAttendees
    );
    return (
      (org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || org.status === statusFilter) &&
      (badgeFilter === "" || badge === badgeFilter) &&
      (attendeesFilter === "" ||
        org.totalAttendees >= parseInt(attendeesFilter)) &&
      (eventsFilter === "" || org.eventsHosted >= parseInt(eventsFilter))
    );
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) setDropdownId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="organizers-container">
      <div className="header">
        <h2>Organizers</h2>
      </div>

      <div className="top-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
          </select>

          <select
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
          >
            <option value="">All Badges</option>
            <option value="✅ Verified">Verified</option>
            <option value="🚀 Starter Host">Starter Host</option>
            <option value="🏙️ City Promoter">City Promoter</option>
            <option value="⏳ Not Verified">Not Verified</option>
          </select>

          <select
            value={attendeesFilter}
            onChange={(e) => setAttendeesFilter(e.target.value)}
          >
            <option value="">Min Attendees</option>
            <option value="10">10+</option>
            <option value="50">50+</option>
            <option value="100">100+</option>
          </select>

          <select
            value={eventsFilter}
            onChange={(e) => setEventsFilter(e.target.value)}
          >
            <option value="">Min Events</option>
            <option value="1">1+</option>
            <option value="3">3+</option>
          </select>
        </div>
      </div>

      <div className="organizers-table-container">
        <table className="organizers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Events</th>
              <th>Attendees</th>
              <th>Badge</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((org, index) => {
              const badge = getOrganizerBadge(
                org.status,
                org.eventsHosted,
                org.totalAttendees
              );
              const isLast = index >= filtered.length - 3;

              return (
                <tr key={org.id}>
                  <td>{org.id}</td>
                  <td className="user-info">
                    <img src={org.avatar} alt="avatar" /> {org.name}
                  </td>
                  <td>{org.email}</td>
                  <td>{org.status}</td>
                  <td>{org.eventsHosted}</td>
                  <td>{org.totalAttendees}</td>
                  <td>
                    <span className="badge-display">{badge}</span>
                  </td>
                  <td className="menu">
                    <div className="dropdown" ref={dropdownRef}>
                      <span
                        onClick={() =>
                          setDropdownId(dropdownId === org.id ? null : org.id)
                        }
                      >
                        ⋮
                      </span>
                      {dropdownId === org.id && (
                        <div
                          className={`dropdown-menu ${isLast ? "upwards" : ""}`}
                        >
                          {org.status === "Pending" && (
                            <div onClick={() => approveOrganizer(org.id)}>
                              ✅ Approve
                            </div>
                          )}
                          {/* Future actions like View Events, Edit, etc., can go here */}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizersPage;
