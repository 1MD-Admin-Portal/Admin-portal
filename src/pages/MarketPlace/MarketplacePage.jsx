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
import "./MarketplacePage.css";
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
    <div className="mktplace-main-wrapper">
      <div className="mktplace-top-header">
        <h2 className="mktplace-main-title">Marketplace</h2>
        {/* <button
          className="mktplace-create-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Create Listing
        </button> */}
      </div>

      <div className="mktplace-control-panel">
        <div className="mktplace-filter-group">
          {["Program", "Event"].map((item) => (
            <button
              key={item}
              className={`mktplace-filter-option ${
                filter === item ? "selected" : ""
              }`}
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

        <div className="mktplace-search-wrapper">
          <Search size={18} className="mktplace-search-icon" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mktplace-search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="mktplace-loading-container">
          <div className="mktplace-loading-spinner"></div>
          <span className="mktplace-loading-label">Loading marketplace...</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="mktplace-empty-container">
          <span className="mktplace-empty-icon">🛒</span>
          <span className="mktplace-empty-label">
            No {filter.toLowerCase()}s found.
          </span>
        </div>
      ) : (
        <div className="mktplace-data-table-wrapper">
          <table className="mktplace-data-table">
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
                <tr key={index} className="mktplace-data-row">
                  <td className="mktplace-id-column">
                    #{filter === "Program" ? item.program_id : item.event_id}
                  </td>
                  <td
                    className="mktplace-title-column clickable-title"
                    onClick={() =>
                      filter === "Program"
                        ? openProgramDetails(item)
                        : (setSelectedEvent(item), setShowEventModal(true))
                    }
                  >
                    <div className="mktplace-title-wrapper">
                      <span className="mktplace-title-text">
                        {filter === "Program" ? item.title : item.event_title}
                      </span>
                      <Eye size={14} className="mktplace-view-icon" />
                    </div>
                  </td>
                  <td className="mktplace-instructor-column">
                    <div className="mktplace-instructor-data">
                      <User size={14} />
                      {filter === "Program"
                        ? item.instructor_name
                        : item.organizer?.name}
                    </div>
                  </td>
                  <td className="mktplace-price-column">
                    <div className="mktplace-price-display">
                      <DollarSign size={14} />
                      {filter === "Program" ? item.price : item.price || "Free"}
                    </div>
                  </td>
                  <td className="mktplace-status-column">
                    <span
                      className={`mktplace-status-indicator ${
                        filter === "Program"
                          ? "approved"
                          : item.status?.toLowerCase()
                      }`}
                    >
                      {filter === "Program" ? "Approved" : item.status}
                    </span>
                  </td>
                  <td className="mktplace-type-column">
                    <span
                      className={`mktplace-type-indicator type-${filter.toLowerCase()}`}
                    >
                      {filter}
                    </span>
                  </td>
                  <td className="mktplace-actions-column">
                    <button className="mktplace-action-button">
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
        <div
          className="mktplace-modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="mktplace-modal-container mktplace-create-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mktplace-modal-header">
              <h2 className="mktplace-modal-heading">Create New Listing</h2>
              <button
                className="mktplace-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>
            </div>

            <div className="mktplace-modal-content">
              <p className="mktplace-modal-desc">What do you want to list?</p>

              <div className="mktplace-modal-choices">
                <button
                  className={`mktplace-modal-choice ${
                    selectedType === "Program" ? "active" : ""
                  }`}
                  onClick={() => setSelectedType("Program")}
                >
                  <ShoppingBag size={20} />
                  <span>Program</span>
                </button>
                <button
                  className={`mktplace-modal-choice ${
                    selectedType === "Event" ? "active" : ""
                  }`}
                  onClick={() => setSelectedType("Event")}
                >
                  <Calendar size={20} />
                  <span>Event</span>
                </button>
              </div>

              {selectedType && (
                <div className="mktplace-modal-select">
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

            <div className="mktplace-modal-footer">
              <button
                className="mktplace-cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              {selectedType && (
                <button
                  className="mktplace-apply-button"
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
        <div
          className="mktplace-modal-backdrop"
          onClick={() => setShowEventModal(false)}
        >
          <div
            className="mktplace-modal-container mktplace-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mktplace-modal-header">
              <h2 className="mktplace-modal-heading">
                {selectedEvent.event_title}
              </h2>
              <button
                className="mktplace-modal-close"
                onClick={() => setShowEventModal(false)}
              >
                <X />
              </button>
            </div>

            <div className="mktplace-modal-content">
              <div className="mktplace-detail-section">
                <h3 className="mktplace-section-heading">Event Details</h3>
                <div className="mktplace-info-layout">
                  <div className="mktplace-info-block">
                    <div className="mktplace-info-title">Organizer</div>
                    <div className="mktplace-info-data">
                      <User size={16} />
                      {selectedEvent.organizer?.name}
                    </div>
                  </div>
                  <div className="mktplace-info-block">
                    <div className="mktplace-info-title">Price</div>
                    <div className="mktplace-info-data">
                      <DollarSign size={16} />
                      {selectedEvent.price || "Free"}
                    </div>
                  </div>
                  <div className="mktplace-info-block">
                    <div className="mktplace-info-title">Status</div>
                    <div className="mktplace-info-data">
                      <span
                        className={`mktplace-status-indicator ${selectedEvent.status?.toLowerCase()}`}
                      >
                        {selectedEvent.status}
                      </span>
                    </div>
                  </div>
                  <div className="mktplace-info-block">
                    <div className="mktplace-info-title">Date</div>
                    <div className="mktplace-info-data">
                      <Calendar size={16} />
                      {new Date(selectedEvent.event_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div className="mktplace-desc-section">
                    <div className="mktplace-info-title">Description</div>
                    <p className="mktplace-desc-text">
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
        <div
          className="mktplace-modal-backdrop"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="mktplace-modal-container mktplace-purchases-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mktplace-modal-header">
              <h2 className="mktplace-modal-heading">
                {selectedProgram.title}
              </h2>
              <button
                className="mktplace-modal-close"
                onClick={() => setShowDetails(false)}
              >
                <X />
              </button>
            </div>

            <div className="mktplace-modal-content">
              <div className="mktplace-detail-section">
                <div className="mktplace-program-overview">
                  <div className="mktplace-program-detail">
                    <User size={16} />
                    <span>{selectedProgram.instructor_name}</span>
                  </div>
                  <div className="mktplace-program-detail">
                    <DollarSign size={16} />
                    <span>{selectedProgram.price}</span>
                  </div>
                </div>
              </div>

              {loadingPurchases ? (
                <div className="mktplace-loading-container compact">
                  <div className="mktplace-loading-spinner compact"></div>
                  <span className="mktplace-loading-label">
                    Loading purchases...
                  </span>
                </div>
              ) : purchases.length === 0 ? (
                <div className="mktplace-empty-container compact">
                  <span className="mktplace-empty-icon">💔</span>
                  <span className="mktplace-empty-label">
                    No purchases found.
                  </span>
                </div>
              ) : (
                <>
                  {/* Statistics */}
                  {stats && (
                    <div className="mktplace-detail-section">
                      <h3 className="mktplace-section-heading">Analytics</h3>
                      <div className="mktplace-analytics-grid">
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">📊</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              {stats.total_purchases || purchases.length}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Total Purchases
                            </div>
                          </div>
                        </div>
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">💰</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              ${stats.total_revenue || 0}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Total Revenue
                            </div>
                          </div>
                        </div>
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">✅</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              ${stats.successful_purchases || 0}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Successful Purchases
                            </div>
                          </div>
                        </div>
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">🛒</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              ${stats.pending_purchases || 0}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Pending Purchases
                            </div>
                          </div>
                        </div>
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">🚫</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              ${stats.failed_purchases || 0}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Failed Purchases
                            </div>
                          </div>
                        </div>
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">€</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              ${stats.active_purchases || 0}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Active Purchases
                            </div>
                          </div>
                        </div>
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">💵</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              ${stats.average_purchase_amount || 0}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Average Purchase Amount
                            </div>
                          </div>
                        </div>
                        <div className="mktplace-analytics-card">
                          <div className="mktplace-analytics-icon">📈</div>
                          <div className="mktplace-analytics-details">
                            <div className="mktplace-analytics-number">
                              ${stats.success_rate || 0}
                            </div>
                            <div className="mktplace-analytics-caption">
                              Success Rate
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mktplace-detail-section">
                    <h3 className="mktplace-section-heading">
                      Purchase History
                    </h3>
                    <div className="mktplace-purchase-table-wrapper">
                      <table className="mktplace-purchase-table">
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
