import React, { useEffect, useState } from "react";
import {
  X,
  Heart,
  Play,
  Music,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import {
  getPlaylistsService,
  approvePlaylistService,
  rejectPlaylistService,
} from "../../../services/playlist.service";
import "./Playlist.css";

const PlaylistsPage = () => {
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "approved"
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "pending_approval",
    playlist_type: "all",
    search: "",
    sort_by: "newest",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); // Modal state
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch playlists whenever filters or active tab change
  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeTab]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await getPlaylistsService(
        filters.page,
        filters.limit,
        filters.status,
        filters.playlist_type,
        filters.search,
        filters.sort_by
      );
      setPlaylists(res.playlists || []);
      setPagination(res.pagination || { page: 1, total_pages: 1 });
    } catch (error) {
      console.error("Error fetching playlists", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedIds([]); // Clear selections when changing tabs
    setFilters((prev) => ({
      ...prev,
      status: tab === "pending" ? "pending_approval" : "approved",
      page: 1,
    }));
  };

  const handleApprove = async (id) => {
    try {
      await approvePlaylistService(id, "");
      fetchPlaylists();
      setSelectedPlaylist(null); // close modal after approve
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPlaylistService(id, "Not suitable");
      fetchPlaylists();
      setSelectedPlaylist(null); // close modal after reject
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  const handleBulkApprove = async () => {
    try {
      const idsToApprove =
        selectedIds.length > 0
          ? selectedIds
          : playlists
              .filter((pl) => pl.status === "pending_approval")
              .map((pl) => pl.id);

      for (const id of idsToApprove) {
        await approvePlaylistService(id, "");
      }
      fetchPlaylists();
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk approve failed", err);
    }
  };

  const handleBulkReject = async () => {
    try {
      const idsToReject =
        selectedIds.length > 0
          ? selectedIds
          : playlists
              .filter((pl) => pl.status === "pending_approval")
              .map((pl) => pl.id);

      for (const id of idsToReject) {
        await rejectPlaylistService(id, "Not suitable");
      }
      fetchPlaylists();
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk reject failed", err);
    }
  };

  const pendingPlaylists = playlists.filter(
    (pl) => pl.status === "pending_approval"
  );

  const approveButtonText =
    selectedIds.length > 0
      ? `Approve Selected (${selectedIds.length})`
      : `Approve All (${pendingPlaylists.length})`;

  const rejectButtonText =
    selectedIds.length > 0
      ? `Reject Selected (${selectedIds.length})`
      : `Reject All (${pendingPlaylists.length})`;

  return (
    <div className="plmgmt-main-container">
      <div className="plmgmt-header-section">
        <h2 className="plmgmt-main-title">Playlist Management</h2>
      </div>

      {/* Enhanced Tab System */}
      <div className="plmgmt-tabs-wrapper">
        <div className="plmgmt-tab-controls">
          <button
            className={`plmgmt-tab-btn ${
              activeTab === "pending" ? "plmgmt-tab-active" : ""
            }`}
            onClick={() => handleTabChange("pending")}
          >
            <Clock size={18} />
            Require Approval
            {pendingPlaylists.length > 0 && (
              <span className="plmgmt-tab-counter">
                {pendingPlaylists.length}
              </span>
            )}
          </button>
          <button
            className={`plmgmt-tab-btn ${
              activeTab === "approved" ? "plmgmt-tab-active" : ""
            }`}
            onClick={() => handleTabChange("approved")}
          >
            <CheckCircle size={18} />
            Ongoing / Accepted
          </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="plmgmt-filter-wrapper">
        <div className="plmgmt-filter-controls">
          <div className="plmgmt-filter-item">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by title or DJ..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
              className="plmgmt-search-field"
            />
          </div>

          <div className="plmgmt-filter-item">
            <select
              value={filters.playlist_type}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  playlist_type: e.target.value,
                  page: 1,
                }))
              }
              className="plmgmt-dropdown"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="plmgmt-filter-item">
            <select
              value={filters.sort_by}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sort_by: e.target.value,
                  page: 1,
                }))
              }
              className="plmgmt-dropdown"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {activeTab === "pending" && playlists.length > 0 && (
        <div className="plmgmt-bulk-controls">
          <button
            className="plmgmt-bulk-approve"
            onClick={handleBulkApprove}
            disabled={pendingPlaylists.length === 0}
          >
            <CheckCircle size={16} />
            {approveButtonText}
          </button>

          <button
            className="plmgmt-bulk-reject"
            onClick={handleBulkReject}
            disabled={pendingPlaylists.length === 0}
          >
            <XCircle size={16} />
            {rejectButtonText}
          </button>
        </div>
      )}

      {/* Enhanced Grid Layout */}
      <div className="plmgmt-cards-grid">
        {loading ? (
          <div className="plmgmt-loading-display">
            <div className="plmgmt-loading-spinner"></div>
            <p>Loading playlists...</p>
          </div>
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="plmgmt-playlist-card"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              {activeTab === "pending" && (
                <div
                  className="plmgmt-card-checkbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(playlist.id)}
                    disabled={playlist.status !== "pending_approval"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, playlist.id]);
                      } else {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== playlist.id)
                        );
                      }
                    }}
                  />
                </div>
              )}

              <div className="plmgmt-thumbnail-wrapper">
                {playlist.cover_image_url ? (
                  <img
                    src={playlist.cover_image_url}
                    alt={playlist.title}
                    className="plmgmt-cover-image"
                  />
                ) : (
                  <div className="plmgmt-cover-placeholder">
                    <Music size={48} />
                  </div>
                )}

                <div className="plmgmt-type-badge-overlay">
                  <span
                    className={`plmgmt-type-label plmgmt-type-${playlist.playlist_type}`}
                  >
                    {playlist.playlist_type}
                  </span>
                </div>

                <div className="plmgmt-status-badge-overlay">
                  <span
                    className={`plmgmt-status-label plmgmt-status-${playlist.status?.replace(
                      "_",
                      "-"
                    )}`}
                  >
                    {playlist.status === "pending_approval"
                      ? "Pending"
                      : "Approved"}
                  </span>
                </div>
              </div>

              <div className="plmgmt-card-details">
                <div className="plmgmt-card-header">
                  <h3 className="plmgmt-card-title">{playlist.title}</h3>
                  <div className="plmgmt-card-meta">
                    <div className="plmgmt-dj-info">
                      {playlist.dj?.avatar && (
                        <img
                          src={playlist.dj.avatar}
                          alt={playlist.dj.name}
                          className="plmgmt-dj-avatar"
                        />
                      )}
                      <span className="plmgmt-dj-name">
                        {playlist.dj?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="plmgmt-card-stats">
                  <div className="plmgmt-stat-item">
                    <Music size={16} />
                    <span>{playlist.total_songs} Songs</span>
                  </div>
                  <div className="plmgmt-stat-item">
                    <Clock size={16} />
                    <span>{playlist.duration_minutes} min</span>
                  </div>
                </div>

                {activeTab === "pending" &&
                  playlist.status === "pending_approval" && (
                    <div
                      className="plmgmt-card-buttons"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="plmgmt-approve-btn"
                        onClick={() => handleApprove(playlist.id)}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        className="plmgmt-reject-btn"
                        onClick={() => handleReject(playlist.id)}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))
        ) : (
          <div className="plmgmt-empty-display">
            <span className="plmgmt-empty-icon">🎵</span>
            <span className="plmgmt-empty-message">No playlists found.</span>
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      <div className="plmgmt-pagination-wrapper">
        <button
          className="plmgmt-pagination-btn"
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          disabled={pagination.page <= 1}
        >
          Previous
        </button>
        <span className="plmgmt-page-info">
          Page {pagination.page || 1} of {pagination.total_pages || 1}
        </span>
        <button
          className="plmgmt-pagination-btn"
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          disabled={pagination.page >= pagination.total_pages}
        >
          Next
        </button>
      </div>

      {/* Enhanced Modal */}
      {selectedPlaylist && (
        <div
          className="plmgmt-modal-backdrop"
          onClick={() => setSelectedPlaylist(null)}
        >
          <div
            className="plmgmt-modal-container plmgmt-playlist-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plmgmt-modal-header">
              <h2 className="plmgmt-modal-title">
                {selectedPlaylist.title} - Playlist Details
              </h2>
              <button
                className="plmgmt-modal-close"
                onClick={() => setSelectedPlaylist(null)}
              >
                <X />
              </button>
            </div>

            <div className="plmgmt-modal-body">
              <div className="plmgmt-modal-section">
                <div className="plmgmt-detail-image">
                  {selectedPlaylist.cover_image_url ? (
                    <img
                      src={selectedPlaylist.cover_image_url}
                      alt={selectedPlaylist.title}
                      className="plmgmt-modal-cover"
                    />
                  ) : (
                    <div className="plmgmt-modal-placeholder">
                      <Music size={80} />
                      <p>No Cover Image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="plmgmt-modal-section">
                <h3 className="plmgmt-section-title">Playlist Details</h3>
                <div className="plmgmt-info-grid">
                  <div className="plmgmt-info-item">
                    <div className="plmgmt-info-label">DJ</div>
                    <div className="plmgmt-info-value">
                      <div className="plmgmt-dj-detail">
                        {selectedPlaylist.dj?.avatar && (
                          <img
                            src={selectedPlaylist.dj.avatar}
                            alt={selectedPlaylist.dj.name}
                            className="plmgmt-dj-avatar-large"
                          />
                        )}
                        <span>{selectedPlaylist.dj?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="plmgmt-info-item">
                    <div className="plmgmt-info-label">Type</div>
                    <div className="plmgmt-info-value">
                      <span
                        className={`plmgmt-type-label plmgmt-type-${selectedPlaylist.playlist_type}`}
                      >
                        {selectedPlaylist.playlist_type}
                      </span>
                    </div>
                  </div>
                  <div className="plmgmt-info-item">
                    <div className="plmgmt-info-label">Status</div>
                    <div className="plmgmt-info-value">
                      <span
                        className={`plmgmt-status-label plmgmt-status-${selectedPlaylist.status?.replace(
                          "_",
                          "-"
                        )}`}
                      >
                        {selectedPlaylist.status === "pending_approval"
                          ? "Pending Approval"
                          : "Approved"}
                      </span>
                    </div>
                  </div>
                  <div className="plmgmt-info-item">
                    <div className="plmgmt-info-label">Songs</div>
                    <div className="plmgmt-info-value">
                      <div className="plmgmt-songs-count">
                        <Music size={18} />
                        <span>{selectedPlaylist.total_songs}</span>
                      </div>
                    </div>
                  </div>
                  <div className="plmgmt-info-item">
                    <div className="plmgmt-info-label">Duration</div>
                    <div className="plmgmt-info-value">
                      <div className="plmgmt-duration-count">
                        <Clock size={18} />
                        <span>{selectedPlaylist.duration_minutes} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {activeTab === "pending" &&
                selectedPlaylist.status === "pending_approval" && (
                  <div className="plmgmt-modal-actions">
                    <button
                      className="plmgmt-approve-action"
                      onClick={() => handleApprove(selectedPlaylist.id)}
                    >
                      <CheckCircle size={16} />
                      Approve Playlist
                    </button>
                    <button
                      className="plmgmt-reject-action"
                      onClick={() => handleReject(selectedPlaylist.id)}
                    >
                      <XCircle size={16} />
                      Reject Playlist
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
