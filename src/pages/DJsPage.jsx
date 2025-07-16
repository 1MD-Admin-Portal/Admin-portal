import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/DJsPage.css";

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
  },
  {
    id: 403,
    name: "DJ Nova",
    email: "nova@example.com",
    status: "Active",
    avatar: "https://i.pravatar.cc/40?img=17",
    uploadedTracks: 4,
    plays: 30,
    followers: 10,
    avgRating: 3.8,
  },
];

const DJsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [djs, setDJs] = useState(djsData);
  const [dropdownId, setDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const [tracksFilter, setTracksFilter] = useState("");
  const [playsFilter, setPlaysFilter] = useState("");
  const [followersFilter, setFollowersFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [badgeFilter, setBadgeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const getDJLevel = (dj) => {
    if (dj.plays >= 500 && dj.followers >= 200 && dj.avgRating >= 4.5)
      return "🎧 Vibe Maker";
    if (dj.plays >= 50 && dj.avgRating >= 4.0) return "🎵 Beat Player";
    if (dj.uploadedTracks >= 5) return "🥁 Beat Rookie";
    return "🕶️ Newbie";
  };

  const approveDJ = (id) => {
    setDJs((prev) =>
      prev.map((dj) => (dj.id === id ? { ...dj, status: "Active" } : dj))
    );
  };

  const filteredDjs = djs.filter((dj) => {
    const level = getDJLevel(dj);

    const tracksMatch =
      !tracksFilter ||
      (tracksFilter === "0-10" && dj.uploadedTracks <= 10) ||
      (tracksFilter === "10-20" &&
        dj.uploadedTracks > 10 &&
        dj.uploadedTracks <= 20) ||
      (tracksFilter === "20-50" &&
        dj.uploadedTracks > 20 &&
        dj.uploadedTracks <= 50) ||
      (tracksFilter === "50-100" &&
        dj.uploadedTracks > 50 &&
        dj.uploadedTracks <= 100) ||
      (tracksFilter === "100-500" &&
        dj.uploadedTracks > 100 &&
        dj.uploadedTracks <= 500) ||
      (tracksFilter === "500+" && dj.uploadedTracks > 500);

    const playsMatch = !playsFilter || dj.plays >= parseInt(playsFilter);
    const followersMatch =
      !followersFilter || dj.followers >= parseInt(followersFilter);
    const ratingMatch =
      !ratingFilter || dj.avgRating >= parseFloat(ratingFilter);
    const badgeMatch = !badgeFilter || level === badgeFilter;
    const statusMatch = !statusFilter || dj.status === statusFilter;
    const nameMatch = dj.name.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      nameMatch &&
      tracksMatch &&
      playsMatch &&
      followersMatch &&
      ratingMatch &&
      badgeMatch &&
      statusMatch
    );
  });

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

        <div className="filters-group">
          <select
            value={tracksFilter}
            onChange={(e) => setTracksFilter(e.target.value)}
          >
            <option value="">All Tracks</option>
            <option value="0-10">0–10</option>
            <option value="10-20">10–20</option>
            <option value="20-50">20–50</option>
            <option value="50-100">50–100</option>
            <option value="100-500">100–500</option>
            <option value="500+">500+</option>
          </select>

          <select
            value={playsFilter}
            onChange={(e) => setPlaysFilter(e.target.value)}
          >
            <option value="">Min Plays</option>
            <option value="50">50+</option>
            <option value="100">100+</option>
            <option value="500">500+</option>
            <option value="1000">1000+</option>
          </select>

          <select
            value={followersFilter}
            onChange={(e) => setFollowersFilter(e.target.value)}
          >
            <option value="">Min Followers</option>
            <option value="50">50+</option>
            <option value="100">100+</option>
            <option value="200">200+</option>
            <option value="500">500+</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">Min Rating</option>
            <option value="5">5</option>
            <option value="4.5">4.5+</option>
            <option value="4">4+</option>
            <option value="3.5">3.5+</option>
          </select>

          <select
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
          >
            <option value="">All Badges</option>
            <option value="🕶️ Newbie">Newbie</option>
            <option value="🥁 Beat Rookie">Beat Rookie</option>
            <option value="🎵 Beat Player">Beat Player</option>
            <option value="🎧 Vibe Maker">Vibe Maker</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
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
                  <td className="user-info">
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
                            {dj.status === "Pending" && (
                              <div onClick={() => approveDJ(dj.id)}>
                                ✅ Approve
                              </div>
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
    </div>
  );
};

export default DJsPage;
