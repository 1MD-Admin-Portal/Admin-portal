import React, { useEffect, useState } from "react";
import {
  Bug as BugIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Eye,
  X,
  ExternalLink,
  ImageOff,
  Percent,
  User as UserIcon,
  Calendar,
} from "lucide-react";
import {
  getBetaTesterBugsService,
  resolveBetaTesterBugService,
  getBetaTesterDashboardService,
} from "../../../services/betaTesters.service";
import "./BetaTesterBugsPage.css";

const BetaTesterBugsPage = () => {
  const [bugs, setBugs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    startDate: "",
    endDate: "",
    userId: "",
  });

  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState({});
  const [dashboardStats, setDashboardStats] = useState(null);
  const [refreshingDashboard, setRefreshingDashboard] = useState(false);

  const [selectedBug, setSelectedBug] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const pageSize = 10;

  const fetchBugs = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getBetaTesterBugsService(page, pageSize);
      setBugs(data.bugs || []);
      setPagination({
        total: data.pagination?.total || 0,
        page: data.pagination?.page || page,
        limit: data.pagination?.limit || pageSize,
        totalPages: data.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error("Error fetching beta tester bugs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      setRefreshingDashboard(true);
      const data = await getBetaTesterDashboardService(
        filters.startDate || null,
        filters.endDate || null,
        filters.userId || null
      );
      setDashboardStats(data);
    } catch (error) {
      console.error("Error fetching beta tester dashboard:", error);
      setDashboardStats(null);
    } finally {
      setRefreshingDashboard(false);
    }
  };

  useEffect(() => {
    fetchBugs(1);
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.startDate, filters.endDate, filters.userId]);

  const handlePageChange = (direction) => {
    const newPage =
      direction === "next" ? pagination.page + 1 : pagination.page - 1;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchBugs(newPage);
  };

  const filteredBugs = bugs.filter((bug) => {
    if (filters.status !== "all" && bug.status !== filters.status) return false;
    if (!filters.search) return true;
    const text = filters.search.toLowerCase();
    return (
      bug.title?.toLowerCase().includes(text) ||
      bug.description?.toLowerCase().includes(text) ||
      bug.creator_first_name?.toLowerCase().includes(text) ||
      bug.creator_email?.toLowerCase().includes(text)
    );
  });

  const handleResolve = async (bugId) => {
    const confirmResolve = window.confirm(
      "Mark this bug as resolved? This action cannot be undone."
    );
    if (!confirmResolve) return;

    setResolving((prev) => ({ ...prev, [bugId]: true }));

    try {
      await resolveBetaTesterBugService(bugId);
      setBugs((prev) =>
        prev.map((bug) =>
          bug.id === bugId
            ? {
                ...bug,
                status: "resolved",
                resolved_at: new Date().toISOString(),
              }
            : bug
        )
      );
      if (selectedBug?.id === bugId) {
        setSelectedBug((prev) => ({
          ...prev,
          status: "resolved",
          resolved_at: new Date().toISOString(),
        }));
      }
      fetchDashboard();
    } catch (error) {
      console.error("Error resolving bug:", error);
      alert("Failed to resolve bug. Please try again.");
    } finally {
      setResolving((prev) => ({ ...prev, [bugId]: false }));
    }
  };

  const openModal = (bug) => setSelectedBug(bug);
  const closeModal = () => {
    setSelectedBug(null);
    setLightboxOpen(false);
  };

  const totalBugs =
    dashboardStats?.statistics?.total_bugs ?? pagination.total ?? bugs.length;
  const openBugs =
    dashboardStats?.statistics?.open_bugs ??
    bugs.filter((b) => b.status === "open").length;
  const resolvedBugs =
    dashboardStats?.statistics?.resolved_bugs ??
    bugs.filter((b) => b.status === "resolved").length;
  const resolutionRate = dashboardStats?.statistics?.resolution_rate ?? "0%";

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const dashFilters = dashboardStats?.filters || {};

  return (
    <div className="btb-page">
      {/* Header */}
      <div className="btb-header">
        <div className="btb-header__content">
          <h1 className="btb-header__title">
            <BugIcon size={26} className="btb-header__icon" />
            Beta Tester Bugs
          </h1>
          <p className="btb-header__subtitle">
            Track and resolve issues reported by beta testers.
          </p>
        </div>
        <button
          className="btb-header__refresh-btn"
          onClick={() => {
            fetchBugs(pagination.page);
            fetchDashboard();
          }}
          disabled={loading || refreshingDashboard}
        >
          <RefreshCw
            size={16}
            className={loading || refreshingDashboard ? "btb-spinning" : ""}
          />
          <span>
            {loading || refreshingDashboard ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {/* Dashboard Filters (request) */}
      <div className="btb-dashboard-filters">
        <div className="btb-dashboard-filters__group">
          <label className="btb-dashboard-filters__label">
            <Calendar size={14} /> Start Date
          </label>
          <input
            type="date"
            className="btb-dashboard-filters__input"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </div>
        <div className="btb-dashboard-filters__group">
          <label className="btb-dashboard-filters__label">
            <Calendar size={14} /> End Date
          </label>
          <input
            type="date"
            className="btb-dashboard-filters__input"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>
        <div className="btb-dashboard-filters__group">
          <label className="btb-dashboard-filters__label">
            <UserIcon size={14} /> User ID
          </label>
          <input
            type="number"
            className="btb-dashboard-filters__input"
            placeholder="e.g. 3"
            value={filters.userId}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, userId: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Applied Dashboard Filters (from API response) */}
      {dashboardStats && (
        <div className="btb-dashboard-applied">
          <span className="btb-dashboard-applied__label">
            Applied dashboard filters:
          </span>
          <div className="btb-dashboard-applied__chips">
            <span className="btb-chip">
              Date:{" "}
              {dashFilters.start_date || dashFilters.end_date
                ? `${dashFilters.start_date || "—"} → ${
                    dashFilters.end_date || "—"
                  }`
                : "All time"}
            </span>
            <span className="btb-chip">
              User: {dashFilters.user_id ?? "All users"}
            </span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="btb-stats-grid">
        <div className="btb-stats-card btb-stats-card--total">
          <div className="btb-stats-card__icon-wrap">
            <BugIcon size={20} />
          </div>
          <div className="btb-stats-card__content">
            <span className="btb-stats-card__label">Total Bugs</span>
            <span className="btb-stats-card__value">{totalBugs}</span>
          </div>
        </div>
        <div className="btb-stats-card btb-stats-card--open">
          <div className="btb-stats-card__icon-wrap">
            <AlertTriangle size={20} />
          </div>
          <div className="btb-stats-card__content">
            <span className="btb-stats-card__label">Open</span>
            <span className="btb-stats-card__value">{openBugs}</span>
          </div>
        </div>
        <div className="btb-stats-card btb-stats-card--resolved">
          <div className="btb-stats-card__icon-wrap">
            <CheckCircle2 size={20} />
          </div>
          <div className="btb-stats-card__content">
            <span className="btb-stats-card__label">Resolved</span>
            <span className="btb-stats-card__value">{resolvedBugs}</span>
          </div>
        </div>
        <div className="btb-stats-card btb-stats-card--rate">
          <div className="btb-stats-card__icon-wrap">
            <Percent size={20} />
          </div>
          <div className="btb-stats-card__content">
            <span className="btb-stats-card__label">Resolution Rate</span>
            <span className="btb-stats-card__value">{resolutionRate}</span>
          </div>
        </div>
      </div>

      {/* 🔸 Dashboard Breakdown Sections – show EVERYTHING from API */}
      {dashboardStats && (
        <div className="btb-dashboard-sections">
          {/* Bugs by Type + Status */}
          <div className="btb-dashboard-row">
            <section className="btb-panel">
              <h3 className="btb-panel__title">Bugs by Type</h3>
              {dashboardStats.bugs_by_type?.length ? (
                <div className="btb-chips-grid">
                  {dashboardStats.bugs_by_type.map((item) => (
                    <div key={item.type} className="btb-chip-card">
                      <span className="btb-chip-card__label">{item.type}</span>
                      <span className="btb-chip-card__value">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="btb-panel__empty">No type data.</p>
              )}
            </section>

            <section className="btb-panel">
              <h3 className="btb-panel__title">Bugs by Status</h3>
              {dashboardStats.bugs_by_status?.length ? (
                <div className="btb-chips-grid">
                  {dashboardStats.bugs_by_status.map((item) => (
                    <div
                      key={item.status}
                      className={`btb-chip-card btb-chip-card--status-${item.status}`}
                    >
                      <span className="btb-chip-card__label">
                        {item.status}
                      </span>
                      <span className="btb-chip-card__value">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="btb-panel__empty">No status data.</p>
              )}
            </section>
          </div>

          {/* Bugs by Subtype */}
          <div className="btb-dashboard-row">
            <section className="btb-panel">
              <h3 className="btb-panel__title">Bugs by Subtype</h3>
              {dashboardStats.bugs_by_subtype?.length ? (
                <div className="btb-panel__table-wrapper">
                  <table className="btb-mini-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Subtype</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.bugs_by_subtype.map((item, idx) => (
                        <tr key={`${item.type}-${item.subtype}-${idx}`}>
                          <td>{item.type}</td>
                          <td>{item.subtype}</td>
                          <td>{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="btb-panel__empty">No subtype data.</p>
              )}
            </section>
          </div>

          {/* Bugs by User + Month */}
          <div className="btb-dashboard-row">
            <section className="btb-panel">
              <h3 className="btb-panel__title">Bugs by User</h3>
              {dashboardStats.bugs_by_user?.length ? (
                <div className="btb-panel__table-wrapper">
                  <table className="btb-mini-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>User ID</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.bugs_by_user.map((u) => (
                        <tr key={u.created_by}>
                          <td>{u.user_name}</td>
                          <td>{u.user_email}</td>
                          <td>{u.created_by}</td>
                          <td>{u.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="btb-panel__empty">No user data.</p>
              )}
            </section>

            <section className="btb-panel">
              <h3 className="btb-panel__title">Bugs by Month</h3>
              {dashboardStats.bugs_by_month?.length ? (
                <div className="btb-panel__table-wrapper">
                  <table className="btb-mini-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.bugs_by_month.map((m, idx) => (
                        <tr key={`${m.month_year}-${idx}`}>
                          <td>{m.month_year}</td>
                          <td>{m.year}</td>
                          <td>{m.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="btb-panel__empty">No monthly data.</p>
              )}
            </section>
          </div>

          {/* Recent Bugs */}
          <section className="btb-panel">
            <h3 className="btb-panel__title">Recent Bugs</h3>
            {dashboardStats.recent_bugs?.length ? (
              <div className="btb-recent-list">
                {dashboardStats.recent_bugs.map((bug) => (
                  <div key={bug.id} className="btb-recent-card">
                    <div className="btb-recent-card__main">
                      <div className="btb-recent-card__title-row">
                        <span className="btb-recent-card__id">#{bug.id}</span>
                        <span className="btb-recent-card__title">
                          {bug.title}
                        </span>
                      </div>
                      <div className="btb-recent-card__meta">
                        <span className="btb-chip">
                          {bug.type}
                          {bug.subtype ? ` / ${bug.subtype}` : ""}
                        </span>
                        <span
                          className={`btb-status-pill btb-status-pill--${bug.status}`}
                        >
                          {bug.status}
                        </span>
                      </div>
                      <div className="btb-recent-card__footer">
                        <span className="btb-recent-card__user">
                          {bug.creator_name} • {bug.creator_email}
                        </span>
                        <span className="btb-recent-card__date">
                          {formatDateTime(bug.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="btb-recent-card__actions">
                      {bug.attachment_url && (
                        <a
                          className="btb-recent-card__thumb-link"
                          href={bug.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={bug.attachment_url}
                            alt="Attachment"
                            className="btb-recent-card__thumb"
                          />
                        </a>
                      )}
                      <button
                        className="btb-view-btn"
                        onClick={() =>
                          openModal({
                            ...bug,
                            // normalise field name so modal works
                            creator_first_name:
                              bug.creator_first_name || bug.creator_name,
                          })
                        }
                      >
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="btb-panel__empty">No recent bugs.</p>
            )}
          </section>
        </div>
      )}

      {/* List Filters */}
      <div className="btb-list-filters">
        <div className="btb-list-filters__group">
          <label className="btb-list-filters__label">Status</label>
          <select
            className="btb-list-filters__select"
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        {/* <div className="btb-list-filters__group btb-list-filters__group--search">
          <label className="btb-list-filters__label">Search</label>
          <div className="btb-list-filters__search-wrap">
            <Search size={16} className="btb-list-filters__search-icon" />
            <input
              type="text"
              className="btb-list-filters__search-input"
              placeholder="Search by title, user, email..."
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
            />
          </div>
        </div> */}
      </div>

      {/* Table */}
      <div className="btb-table-wrapper">
        {loading && bugs.length === 0 ? (
          <div className="btb-loading">
            <div className="btb-loading__spinner" />
            <span>Loading bugs...</span>
          </div>
        ) : filteredBugs.length === 0 ? (
          <div className="btb-empty">
            <BugIcon size={32} />
            <p>No bugs found for the current filters.</p>
          </div>
        ) : (
          <table className="btb-table">
            <thead className="btb-table__head">
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Title</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Created</th>
                <th>Resolved At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="btb-table__body">
              {filteredBugs.map((bug) => (
                <tr key={bug.id}>
                  <td>#{bug.id}</td>
                  <td>
                    <div className="btb-table__type">
                      <span className="btb-table__type-main">{bug.type}</span>
                      {bug.subtype && (
                        <span className="btb-table__type-sub">
                          {bug.subtype}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="btb-table__title">{bug.title}</span>
                  </td>
                  <td>
                    <div className="btb-table__reporter">
                      <span className="btb-table__reporter-name">
                        {bug.creator_first_name}
                      </span>
                      <span className="btb-table__reporter-email">
                        {bug.creator_email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`btb-status-pill btb-status-pill--${bug.status}`}
                    >
                      {bug.status}
                    </span>
                  </td>
                  <td>{formatDateTime(bug.created_at)}</td>
                  <td>
                    {bug.resolved_at ? formatDateTime(bug.resolved_at) : "—"}
                  </td>
                  <td>
                    <button
                      className="btb-view-btn"
                      onClick={() => openModal(bug)}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="btb-pagination">
        <button
          className="btb-pagination__btn"
          onClick={() => handlePageChange("prev")}
          disabled={pagination.page <= 1 || loading}
        >
          Previous
        </button>
        <span className="btb-pagination__info">
          Page {pagination.page} of {pagination.totalPages}
          {pagination.total ? ` • ${pagination.total} total` : ""}
        </span>
        <button
          className="btb-pagination__btn"
          onClick={() => handlePageChange("next")}
          disabled={pagination.page >= pagination.totalPages || loading}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedBug && (
        <div className="btb-modal-overlay" onClick={closeModal}>
          <div className="btb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="btb-modal__header">
              <div className="btb-modal__header-content">
                <div className="btb-modal__id">
                  <BugIcon size={14} /> Bug #{selectedBug.id}
                </div>
                <h2 className="btb-modal__title">
                  {selectedBug.title || "Untitled Bug"}
                </h2>
                <div className="btb-modal__meta">
                  <span
                    className={`btb-status-pill btb-status-pill--${selectedBug.status}`}
                  >
                    {selectedBug.status}
                  </span>
                  <span className="btb-modal__type">
                    {selectedBug.type}
                    {selectedBug.subtype && ` / ${selectedBug.subtype}`}
                  </span>
                </div>
              </div>
              <button className="btb-modal__close-btn" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <div className="btb-modal__body">
              <div className="btb-modal__section">
                <div className="btb-modal__section-title">Description</div>
                <div className="btb-modal__description">
                  {selectedBug.description || "No description provided."}
                </div>
              </div>

              <div className="btb-modal__section">
                <div className="btb-modal__section-title">Details</div>
                <div className="btb-modal__info-grid">
                  <div className="btb-modal__info-item">
                    <div className="btb-modal__info-label">Reporter</div>
                    <div className="btb-modal__info-value">
                      {selectedBug.creator_first_name ||
                        selectedBug.creator_name ||
                        "-"}
                    </div>
                  </div>
                  <div className="btb-modal__info-item">
                    <div className="btb-modal__info-label">Email</div>
                    <div className="btb-modal__info-value">
                      <a href={`mailto:${selectedBug.creator_email}`}>
                        {selectedBug.creator_email}
                      </a>
                    </div>
                  </div>
                  <div className="btb-modal__info-item">
                    <div className="btb-modal__info-label">Created</div>
                    <div className="btb-modal__info-value">
                      {formatDateTime(selectedBug.created_at)}
                    </div>
                  </div>
                  <div className="btb-modal__info-item">
                    <div className="btb-modal__info-label">Resolved</div>
                    <div className="btb-modal__info-value">
                      {selectedBug.resolved_at
                        ? formatDateTime(selectedBug.resolved_at)
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="btb-modal__section">
                <div className="btb-modal__section-title">Attachment</div>
                {selectedBug.attachment_url ? (
                  <div className="btb-modal__attachment">
                    <div className="btb-modal__attachment-preview">
                      <img
                        src={selectedBug.attachment_url}
                        alt="Bug attachment"
                        className="btb-modal__attachment-img"
                        onClick={() => setLightboxOpen(true)}
                      />
                      <div className="btb-modal__attachment-overlay">
                        <a
                          href={selectedBug.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btb-modal__attachment-link"
                        >
                          <ExternalLink size={14} /> Open Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="btb-modal__no-attachment">
                    <ImageOff size={20} /> No attachment provided
                  </div>
                )}
              </div>
            </div>

            <div className="btb-modal__footer">
              <button
                className="btb-modal__btn btb-modal__btn--secondary"
                onClick={closeModal}
              >
                Close
              </button>
              {selectedBug.status !== "resolved" && (
                <button
                  className="btb-modal__btn btb-modal__btn--primary"
                  onClick={() => handleResolve(selectedBug.id)}
                  disabled={resolving[selectedBug.id]}
                >
                  {resolving[selectedBug.id]
                    ? "Resolving..."
                    : "Mark as Resolved"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && selectedBug?.attachment_url && (
        <div className="btb-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="btb-lightbox__close-btn">
            <X size={24} />
          </button>
          <img
            src={selectedBug.attachment_url}
            alt="Full size attachment"
            className="btb-lightbox__img"
          />
        </div>
      )}
    </div>
  );
};

export default BetaTesterBugsPage;
