import React, { useEffect, useState } from "react";
import { getAllBadgesService } from "../../services/badge.service";
import "./BadgesPage.css";

const BadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [filteredBadges, setFilteredBadges] = useState([]);
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const pageSize = 8;

  // Fetch badges
  useEffect(() => {
    const fetchBadges = async () => {
      const data = await getAllBadgesService();
      setBadges(data.badges || []);
      setFilteredBadges(data.badges || []);
    };
    fetchBadges();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = badges;
    if (userTypeFilter !== "all") {
      result = result.filter((badge) => badge.user_type === userTypeFilter);
    }
    setFilteredBadges(result);
    setCurrentPage(1);
  }, [userTypeFilter, badges]);

  // Pagination
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentBadges = filteredBadges.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBadges.length / pageSize);

  return (
    <div className="badges-page">
      <h2>All Badges</h2>

      {/* Filters */}
      <div className="filters">
        <select
          value={userTypeFilter}
          onChange={(e) => setUserTypeFilter(e.target.value)}
        >
          <option value="all">All User Types</option>
          <option value="dancer">Dancer</option>
          <option value="instructor">Instructor</option>
          <option value="dj">DJ</option>
          <option value="organizer">Organizer</option>
        </select>
      </div>

      {/* Badge grid */}
      <div className="badge-grid">
        {currentBadges.map((badge) => (
          <div
            key={badge.id}
            className="badge-card"
            onClick={() => setSelectedBadge(badge)}
          >
            <div className="badge-emoji">{badge.badge_emoji}</div>
            <h4>{badge.badge_name}</h4>
            <p>
              {badge.user_type} - Level {badge.level}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={currentPage === idx + 1 ? "active" : ""}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedBadge && (
        <div className="modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {selectedBadge.badge_name} {selectedBadge.badge_emoji}
            </h3>
            <p>
              <b>User Type:</b> {selectedBadge.user_type}
            </p>
            <p>
              <b>Level:</b> {selectedBadge.level}
            </p>
            <p>
              <b>Commission Rate:</b> {selectedBadge.commission_rate}
            </p>
            <p>
              <b>Description:</b> {selectedBadge.description}
            </p>
            {selectedBadge.special_requirements && (
              <p>
                <b>Special:</b> {selectedBadge.special_requirements}
              </p>
            )}
            <button onClick={() => setSelectedBadge(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
