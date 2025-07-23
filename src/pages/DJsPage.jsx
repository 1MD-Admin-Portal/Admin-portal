import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/DJsPage.css";
import { X } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import UserCalendar from "../components/DjCalendar";

const djsData = [
  {
    id: 401,
    name: "DJ Sonic",
    email: "sonic@example.com",
    status: "Pending",
    avatar: "https://i.pravatar.cc/40?img=19",
    uploadedTracks: 6,
    plays: 520,
    followers: 210,
    avgRating: 4.6,
    bio: "A sonic architect spinning vibes around the globe.",
    classes: [
      { date: new Date(2025, 6, 18), title: "House Party Mix" },
      { date: new Date(2025, 6, 20), title: "Live Set" },
    ],
  },
  {
    id: 402,
    name: "DJ Moonlight",
    email: "moon@example.com",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=13",
    uploadedTracks: 10,
    plays: 75,
    followers: 65,
    avgRating: 4.2,
    bio: "Smooth mixes and nighttime energy.",
    classes: [
      { date: new Date(2025, 6, 19), title: "Midnight Groove" },
      { date: new Date(2025, 6, 21), title: "Evening Beats" },
    ],
  },
];

const DJsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [djs, setDJs] = useState(djsData);
  const [dropdownId, setDropdownId] = useState(null);
  const [profileModal, setProfileModal] = useState(null);
  const [calendarModal, setCalendarModal] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [actionReason, setActionReason] = useState("");
  const [activeAction, setActiveAction] = useState("");

  const dropdownRef = useRef(null);

  const approveDJ = (id) => {
    setDJs((prev) =>
      prev.map((dj) => (dj.id === id ? { ...dj, status: "Active" } : dj))
    );
    setDropdownId(null);
  };

  const getDJLevel = (dj) => {
    if (dj.plays >= 500 && dj.followers >= 200 && dj.avgRating >= 4.5)
      return "🎧 Vibe Maker";
    if (dj.plays >= 50 && dj.avgRating >= 4.0) return "🎵 Beat Player";
    if (dj.uploadedTracks >= 5) return "🥁 Beat Rookie";
    return "🕶️ Newbie";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isDropdownTrigger = e.target.closest(".dropdown span");
      const isDropdownMenu = e.target.closest(".dropdown-menu");
      if (!isDropdownTrigger && !isDropdownMenu) {
        setDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDjs = djs.filter((dj) =>
    dj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="organizers-container">
      <div className="header">
        <h2>DJs</h2>
      </div>

      <div className="top-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search DJs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="organizers-table-container">
        <table className="organizers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Tracks</th>
              <th>Plays</th>
              <th>Followers</th>
              <th>Rating</th>
              <th>Level</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredDjs.map((dj, index) => {
              const isLastThree = index >= filteredDjs.length - 3;
              const level = getDJLevel(dj);

              return (
                <tr key={dj.id}>
                  <td>{dj.id}</td>
                  <td
                    className="user-info clickable"
                    onClick={() => {
                      setProfileModal(dj);
                      setActionReason("");
                      setActiveAction("");
                    }}
                  >
                    <img src={dj.avatar} alt="avatar" /> {dj.name}
                  </td>
                  <td>{dj.email}</td>
                  <td>{dj.uploadedTracks}</td>
                  <td>{dj.plays}</td>
                  <td>{dj.followers}</td>
                  <td>{dj.avgRating}</td>
                  <td>
                    <span className="badge-display">{level}</span>
                  </td>
                  <td>{dj.status}</td>
                  <td className="menu">
                    <div className="dropdown" ref={dropdownRef}>
                      <span
                        onClick={() =>
                          setDropdownId(dropdownId === dj.id ? null : dj.id)
                        }
                      >
                        ⋮
                      </span>
                      {dropdownId === dj.id && (
                        <>
                          <div
                            className={`dropdown-menu ${
                              isLastThree ? "upwards" : ""
                            }`}
                          >
                            {dj.status === "Pending" ? (
                              <div onClick={() => approveDJ(dj.id)}>
                                ✅ Approve
                              </div>
                            ) : (
                              <>
                                <div onClick={() => setCalendarModal(dj)}>
                                  📅 Calendar
                                </div>
                                <div onClick={() => setResetModal(dj)}>
                                  🔐 Reset Password
                                </div>
                              </>
                            )}
                          </div>
                          <div className="dropdown-overlay"></div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {profileModal && (
        <div className="modal-overlay" onClick={() => setProfileModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{profileModal.name}</h2>
              <X
                onClick={() => setProfileModal(null)}
                className="modal-close"
              />
            </div>
            <img
              src={profileModal.avatar}
              alt="DJ avatar"
              className="modal-avatar"
            />
            <p>
              <strong>Email:</strong> {profileModal.email}
            </p>
            <p>
              <strong>Status:</strong> {profileModal.status}
            </p>
            <p>
              <strong>Tracks:</strong> {profileModal.uploadedTracks}
            </p>
            <p>
              <strong>Plays:</strong> {profileModal.plays}
            </p>
            <p>
              <strong>Followers:</strong> {profileModal.followers}
            </p>
            <p>
              <strong>Rating:</strong> {profileModal.avgRating}
            </p>
            <p>
              <strong>Level:</strong> {getDJLevel(profileModal)}
            </p>
            <p>
              <strong>Bio:</strong> {profileModal.bio}
            </p>

            <div className="action-buttons">
              {["Delete", "Flag", "Suspend"].map((action) => (
                <button
                  key={action}
                  onClick={() => setActiveAction(action)}
                  className={`action-btn ${
                    activeAction === action ? "active" : ""
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
            {activeAction && (
              <div className="reason-box">
                <label>
                  Reason for {activeAction}:
                  <textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder={`Write reason to ${activeAction.toLowerCase()}...`}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {calendarModal && (
        <UserCalendar
          user={calendarModal}
          onClose={() => setCalendarModal(null)}
        />
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div className="modal-overlay" onClick={() => setResetModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password for {resetModal.name}</h2>
              <X onClick={() => setResetModal(null)} className="modal-close" />
            </div>
            <label>Enter New Password:</label>
            <input type="password" placeholder="New password" />
            <label>Confirm Password:</label>
            <input type="password" placeholder="Confirm password" />
            <button className="primary-btn">Reset Password</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DJsPage;
