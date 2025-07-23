import React, { useState, useEffect, useRef } from "react";
import "../styles/OrganizersPage.css";
import { FaSearch } from "react-icons/fa";
import { X } from "lucide-react";

const organizersData = [
  {
    id: 301,
    name: "Lara Gomez",
    email: "lara@example.com",
    status: "Pending",
    eventsHosted: 0,
    totalAttendees: 0,
    avatar: "https://i.pravatar.cc/40?img=12",
    events: [],
  },
  {
    id: 302,
    name: "Carlos Mendez",
    email: "carlos@example.com",
    status: "Verified",
    eventsHosted: 1,
    totalAttendees: 12,
    avatar: "https://i.pravatar.cc/40?img=13",
    events: [{ title: "Salsa Night", start: "2025-07-18", end: "2025-07-18" }],
  },
  {
    id: 303,
    name: "Emily Zhao",
    email: "emily@example.com",
    status: "Verified",
    eventsHosted: 3,
    totalAttendees: 110,
    avatar: "https://i.pravatar.cc/40?img=14",
    events: [
      { title: "Urban Workshop", start: "2025-07-20", end: "2025-07-21" },
      { title: "Heels Showcase", start: "2025-07-25", end: "2025-07-25" },
    ],
  },
];

const getBadge = (status, events, attendees) => {
  if (status !== "Verified") return "⏳ Not Verified";
  if (events >= 3 || attendees >= 100) return "🏙️ City Promoter";
  if (attendees >= 10) return "🚀 Starter Host";
  return "✅ Verified";
};

const OrganizersPage = () => {
  const [organizers, setOrganizers] = useState(organizersData);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    badge: "",
    events: "",
    attendees: "",
  });
  const [dropdownId, setDropdownId] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [modalType, setModalType] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const clickAway = (e) => {
      if (!e.target.closest(".dropdown")) setDropdownId(null);
    };
    document.addEventListener("mousedown", clickAway);
    return () => document.removeEventListener("mousedown", clickAway);
  }, []);

  const approve = (id) =>
    setOrganizers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Verified" } : o))
    );

  const filtered = organizers.filter((o) => {
    const badge = getBadge(o.status, o.eventsHosted, o.totalAttendees);
    return (
      (o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase())) &&
      (!filters.status || o.status === filters.status) &&
      (!filters.badge || badge === filters.badge) &&
      (!filters.events || o.eventsHosted >= +filters.events) &&
      (!filters.attendees || o.totalAttendees >= +filters.attendees)
    );
  });

  return (
    <div className="dj-container">
      <div className="header">
        <h2>Organizers</h2>
      </div>
      <div className="top-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters-group">
          <select
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
          </select>
          <select
            onChange={(e) =>
              setFilters((f) => ({ ...f, badge: e.target.value }))
            }
          >
            <option value="">All Badges</option>
            <option value="⏳ Not Verified">Not Verified</option>
            <option value="✅ Verified">Verified</option>
            <option value="🚀 Starter Host">Starter Host</option>
            <option value="🏙️ City Promoter">City Promoter</option>
          </select>
          <select
            onChange={(e) =>
              setFilters((f) => ({ ...f, events: e.target.value }))
            }
          >
            <option value="">Min Events</option>
            <option value="1">1+</option>
            <option value="3">3+</option>
          </select>
          <select
            onChange={(e) =>
              setFilters((f) => ({ ...f, attendees: e.target.value }))
            }
          >
            <option value="">Min Attendees</option>
            <option value="10">10+</option>
            <option value="50">50+</option>
            <option value="100">100+</option>
          </select>
        </div>
      </div>

      <table className="dj-table">
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
          {filtered.map((o, i) => {
            const badge = getBadge(o.status, o.eventsHosted, o.totalAttendees);
            const isLast = i >= filtered.length - 3;
            return (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td
                  className="user-info clickable"
                  onClick={() => {
                    setSelectedOrg(o);
                    setModalType("profile");
                  }}
                >
                  <img src={o.avatar} alt="" /> {o.name}
                </td>
                <td>{o.email}</td>
                <td>{o.status}</td>
                <td>{o.eventsHosted}</td>
                <td>{o.totalAttendees}</td>
                <td>
                  <span className="badge-display">{badge}</span>
                </td>
                <td className="menu">
                  <div className="dropdown" ref={dropdownRef}>
                    <span
                      onClick={() =>
                        setDropdownId(dropdownId === o.id ? null : o.id)
                      }
                    >
                      ⋮
                    </span>
                    {dropdownId === o.id && (
                      <div
                        className={`dropdown-menu ${isLast ? "upwards" : ""}`}
                      >
                        {o.status === "Pending" && (
                          <div onClick={() => approve(o.id)}>✅ Approve</div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ---------- Profile Modal ---------- */}
      {modalType === "profile" && selectedOrg && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedOrg.name}</h2>
              <X onClick={() => setModalType(null)} className="modal-close" />
            </div>
            <img
              src={selectedOrg.avatar}
              alt="avatar"
              className="modal-avatar"
            />
            <p>
              <strong>Email:</strong> {selectedOrg.email}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrg.status}
            </p>
            <p>
              <strong>Hosted:</strong> {selectedOrg.eventsHosted} events |{" "}
              {selectedOrg.totalAttendees} attendees
            </p>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="action-btn"
                onClick={() => alert("Flag action")}
              >
                🏴 Flag
              </button>
              <button
                className="action-btn"
                onClick={() => alert("Suspend action")}
              >
                ⛔ Suspend
              </button>
              <button
                className="action-btn"
                onClick={() => alert("Delete action")}
              >
                ❌ Delete
              </button>
            </div>

            <hr />
            <div className="action-buttons">
              <button
                className="action-btn"
                onClick={() => alert("Show Calendar")}
              >
                📅 Calendar
              </button>
              <button
                className="action-btn"
                onClick={() => alert("Send Reset Password")}
              >
                🔒 Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizersPage;
