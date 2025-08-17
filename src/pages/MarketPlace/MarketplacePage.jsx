import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  ShoppingBag,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  Eye,
} from "lucide-react";
import "./Marketplacepage.css";
import {
  getMarketplacePrograms,
  getPublishedEvents,
  getProgramPurchases,
} from "../../services/marketplace.service.js";

const MarketplacePage = () => {
  const [filter, setFilter] = useState("Program");
  const [search, setSearch] = useState("");

  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Program details modal
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  // Event details modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch programs or events
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (filter === "Program") {
          const res = await getMarketplacePrograms(1, 20);
          setPrograms(res.programs || []);
        } else if (filter === "Event") {
          const res = await getPublishedEvents(1, 20);
          setEvents(res.events || []);
        }
      } catch (err) {
        console.error("❌ Error loading marketplace:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  // Filter + search
  const filteredData =
    filter === "Program"
      ? programs.filter((p) =>
          p.title.toLowerCase().includes(search.toLowerCase())
        )
      : events.filter((e) =>
          e.event_title.toLowerCase().includes(search.toLowerCase())
        );

  // Open program details (fetch purchases)
  const openProgramDetails = async (program) => {
    setSelectedProgram(program);
    setShowDetails(true);
    setLoadingPurchases(true);
    try {
      const res = await getProgramPurchases(program.program_id, 1, 20);
      setPurchases(res.purchases || []);
      setStats(res.statistics || {});
    } catch (err) {
      console.error("❌ Error fetching purchases:", err);
    } finally {
      setLoadingPurchases(false);
    }
  };

  return (
    <div className="marketplace-page-container">
      <div className="marketplace-page-header">
        <h2 className="marketplace-page-title">Marketplace</h2>
        <button
          className="create-listing-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Create Listing
        </button>
      </div>

      <div className="marketplace-controls">
        <div className="filter-buttons">
          {["Program", "Event"].map((item) => (
            <button
              key={item}
              className={`filter-btn ${filter === item ? "active" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item === "Program" ? (
                <ShoppingBag size={16} />
              ) : (
                <Calendar size={16} />
              )}
              {item}
            </button>
          ))}
        </div>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="marketplace-search"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading marketplace...</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <span className="empty-text">No {filter.toLowerCase()}s found.</span>
        </div>
      ) : (
        <div className="marketplace-table-container">
          <table className="marketplace-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name / Title</th>
                <th>Instructor / Organizer</th>
                <th>Price</th>
                <th>Status</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="marketplace-row">
                  <td className="id-cell">
                    #{filter === "Program" ? item.program_id : item.event_id}
                  </td>
                  <td
                    className="title-cell clickable"
                    onClick={() =>
                      filter === "Program"
                        ? openProgramDetails(item)
                        : (setSelectedEvent(item), setShowEventModal(true))
                    }
                  >
                    <div className="title-content">
                      <span className="title-text">
                        {filter === "Program" ? item.title : item.event_title}
                      </span>
                      <Eye size={14} className="view-icon" />
                    </div>
                  </td>
                  <td className="instructor-cell">
                    <div className="instructor-info">
                      <User size={14} />
                      {filter === "Program"
                        ? item.instructor_name
                        : item.organizer?.name}
                    </div>
                  </td>
                  <td className="price-cell">
                    <div className="price-tag">
                      <DollarSign size={14} />
                      {filter === "Program" ? item.price : item.price || "Free"}
                    </div>
                  </td>
                  <td className="status-cell">
                    <span
                      className={`status-badge ${
                        filter === "Program"
                          ? "approved"
                          : item.status?.toLowerCase()
                      }`}
                    >
                      {filter === "Program" ? "Approved" : item.status}
                    </span>
                  </td>
                  <td className="type-cell">
                    <span className={`type-badge type-${filter.toLowerCase()}`}>
                      {filter}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn">
                      <TrendingUp size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Listing Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content create-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">Create New Listing</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">What do you want to list?</p>

              <div className="modal-options">
                <button
                  className={`modal-option ${
                    selectedType === "Program" ? "active" : ""
                  }`}
                  onClick={() => setSelectedType("Program")}
                >
                  <ShoppingBag size={20} />
                  <span>Program</span>
                </button>
                <button
                  className={`modal-option ${
                    selectedType === "Event" ? "active" : ""
                  }`}
                  onClick={() => setSelectedType("Event")}
                >
                  <Calendar size={20} />
                  <span>Event</span>
                </button>
              </div>

              {selectedType && (
                <div className="modal-dropdown">
                  <label>
                    Choose from existing{" "}
                    {selectedType === "Program" ? "Programs" : "Events"}
                  </label>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select...
                    </option>
                    {(selectedType === "Program" ? programs : events).map(
                      (item) => (
                        <option
                          key={
                            selectedType === "Program"
                              ? item.program_id
                              : item.event_id
                          }
                        >
                          {selectedType === "Program"
                            ? item.title
                            : item.event_title}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              {selectedType && (
                <button
                  className="apply-btn"
                  onClick={() => {
                    alert(`Applied for ${selectedType}`);
                    setShowModal(false);
                  }}
                >
                  <Plus size={16} />
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div
            className="modal-content details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">{selectedEvent.event_title}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowEventModal(false)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3 className="section-title">Event Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Organizer</div>
                    <div className="info-value">
                      <User size={16} />
                      {selectedEvent.organizer?.name}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Price</div>
                    <div className="info-value">
                      <DollarSign size={16} />
                      {selectedEvent.price || "Free"}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Status</div>
                    <div className="info-value">
                      <span
                        className={`status-badge ${selectedEvent.status?.toLowerCase()}`}
                      >
                        {selectedEvent.status}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Duration</div>
                    <div className="info-value">
                      <Calendar size={16} />
                      {new Date(
                        selectedEvent.start_date
                      ).toLocaleDateString()}{" "}
                      - {new Date(selectedEvent.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="description-section">
                    <div className="info-label">Description</div>
                    <p className="description-text">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Purchases Modal */}
      {showDetails && selectedProgram && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div
            className="modal-content purchases-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">{selectedProgram.title}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowDetails(false)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="program-info">
                  <div className="program-meta">
                    <User size={16} />
                    <span>{selectedProgram.instructor_name}</span>
                  </div>
                  <div className="program-meta">
                    <DollarSign size={16} />
                    <span>{selectedProgram.price}</span>
                  </div>
                </div>
              </div>

              {loadingPurchases ? (
                <div className="loading-state small">
                  <div className="loading-spinner small"></div>
                  <span className="loading-text">Loading purchases...</span>
                </div>
              ) : purchases.length === 0 ? (
                <div className="empty-state small">
                  <span className="empty-icon">💔</span>
                  <span className="empty-text">No purchases found.</span>
                </div>
              ) : (
                <>
                  <div className="modal-section">
                    <h3 className="section-title">Purchase History</h3>
                    <div className="purchases-table-container">
                      <table className="purchases-table">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchases.map((p, idx) => (
                            <tr key={idx}>
                              <td>{p.user?.name}</td>
                              <td>{p.user?.email}</td>
                              <td>{p.user?.location}</td>
                              <td>
                                {new Date(
                                  p.purchase_details?.created_at
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Statistics */}
                  {stats && (
                    <div className="modal-section">
                      <h3 className="section-title">Analytics</h3>
                      <div className="stats-grid">
                        <div className="stats-card">
                          <div className="stats-icon">📊</div>
                          <div className="stats-content">
                            <div className="stats-value">
                              {stats.total_purchases || purchases.length}
                            </div>
                            <div className="stats-label">Total Purchases</div>
                          </div>
                        </div>
                        <div className="stats-card">
                          <div className="stats-icon">💰</div>
                          <div className="stats-content">
                            <div className="stats-value">
                              ${stats.total_revenue || 0}
                            </div>
                            <div className="stats-label">Total Revenue</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
