import React, { useEffect, useState } from "react";
import GlobalLoader from "../../components/common/GlobalLoader";
import { getAllBadgesService } from "../../services/badge.service";
import "./BadgesPage.css";

const BadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [activeTab, setActiveTab] = useState("dancer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      try {
        const data = await getAllBadgesService();
        console.log("🔹 All badges raw response:", data);

        let list = [];

        // Case 1: API already returns an array
        if (Array.isArray(data)) {
          list = data;
        }
        // Case 2: { badges: [...] }
        else if (data && Array.isArray(data.badges)) {
          list = data.badges;
        }
        // Case 3: { badges: { dancer: [...], instructor: [...], ... } }
        else if (data && data.badges && typeof data.badges === "object") {
          list = Object.values(data.badges)
            .filter((v) => Array.isArray(v))
            .flat();
        }
        // Case 4: top-level persona keys: { dancer: [...], instructor: [...], ... }
        else if (data && typeof data === "object") {
          const personaKeys = ["dancer", "instructor", "dj", "organizer"];
          list = personaKeys
            .filter((k) => Array.isArray(data[k]))
            .flatMap((k) => data[k]);
        }

        setBadges(list || []);
      } catch (err) {
        console.error("Error fetching badges:", err);
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const filteredBadges = (badges || []).filter(
    (badge) => badge.user_type === activeTab
  );

  return (
    <div className="badge-management-container">
      <div className="badge-header-section">
        <h2 className="badge-main-title">🎖️ Badge Levels</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="badge-nav-tabs">
        {["dancer", "instructor", "dj", "organizer"].map((tab) => (
          <button
            key={tab}
            className={`badge-nav-button ${
              activeTab === tab ? "badge-nav-active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <GlobalLoader text="Loading badges..." />
      ) : filteredBadges.length === 0 ? (
        <div className="badge-empty-state">
          <p>No badges found for {activeTab}</p>
        </div>
      ) : (
        <div className="badge-table-wrapper">
          <table className="badge-data-table">
            <thead className="badge-table-header">
              <tr>
                <th>Emoji</th>
                <th>Name</th>
                <th>Level</th>
                <th>Commission</th>
                <th>Description</th>
                <th>Requirements</th>
                <th>Special</th>
              </tr>
            </thead>
            <tbody className="badge-table-body">
              {filteredBadges.map((badge) => (
                <tr key={badge.id} className="badge-table-row">
                  <td className="badge-emoji-cell">{badge.badge_emoji}</td>
                  <td className="badge-name-cell">{badge.badge_name}</td>
                  <td className="badge-level-cell">
                    <span className="badge-level-indicator">{badge.level}</span>
                  </td>
                  <td className="badge-commission-cell">
                    <span className="badge-commission-value">
                      {(parseFloat(badge.commission_rate) * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="badge-description-cell">
                    {badge.description}
                  </td>
                  <td className="badge-requirements-cell">
                    <div className="badge-requirements-list">
                      {badge.videos_required > 0 && (
                        <span className="badge-requirement-item">
                          🎥 {badge.videos_required} videos
                        </span>
                      )}
                      {badge.followers_required > 0 && (
                        <span className="badge-requirement-item">
                          👥 {badge.followers_required} followers
                        </span>
                      )}
                      {badge.reviews_required > 0 && (
                        <span className="badge-requirement-item">
                          ⭐ {badge.reviews_required} reviews
                        </span>
                      )}
                      {badge.referrals_required > 0 && (
                        <span className="badge-requirement-item">
                          🤝 {badge.referrals_required} referrals
                        </span>
                      )}
                      {badge.classes_taken > 0 && (
                        <span className="badge-requirement-item">
                          📚 {badge.classes_taken} classes
                        </span>
                      )}
                      {badge.programs_bought > 0 && (
                        <span className="badge-requirement-item">
                          🛒 {badge.programs_bought} programs
                        </span>
                      )}
                      {badge.classes_taught > 0 && (
                        <span className="badge-requirement-item">
                          🎓 {badge.classes_taught} taught
                        </span>
                      )}
                      {badge.tracks_sold > 0 && (
                        <span className="badge-requirement-item">
                          🎶 {badge.tracks_sold} tracks
                        </span>
                      )}
                      {badge.tickets_sold > 0 && (
                        <span className="badge-requirement-item">
                          🎟️ {badge.tickets_sold} tickets
                        </span>
                      )}
                      {badge.events_hosted > 0 && (
                        <span className="badge-requirement-item">
                          🎤 {badge.events_hosted} events
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="badge-special-cell">
                    {badge.special_requirements ? (
                      <span className="badge-special-text">
                        {badge.special_requirements}
                      </span>
                    ) : (
                      <span className="badge-no-special">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
