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
    <div className="playlist-page-container">
      <div className="playlist-page-header">
        <h2 className="playlist-page-title">Playlist Management</h2>
      </div>

      {/* Enhanced Tab System */}
      <div className="playlist-tabs-container">
        <div className="playlist-tabs">
          <button
            className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => handleTabChange("pending")}
          >
            <Clock size={18} />
            Require Approval
            {pendingPlaylists.length > 0 && (
              <span className="tab-badge">{pendingPlaylists.length}</span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => handleTabChange("approved")}
          >
            <CheckCircle size={18} />
            Ongoing / Accepted
          </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="playlist-filters-container">
        <div className="playlist-filters">
          <div className="filter-group">
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
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filters.playlist_type}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  playlist_type: e.target.value,
                  page: 1,
                }))
              }
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filters.sort_by}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sort_by: e.target.value,
                  page: 1,
                }))
              }
              className="filter-select"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {activeTab === "pending" && playlists.length > 0 && (
        <div className="bulk-actions">
          <button
            className="bulk-approve-btn"
            onClick={handleBulkApprove}
            disabled={pendingPlaylists.length === 0}
          >
            <CheckCircle size={16} />
            {approveButtonText}
          </button>

          <button
            className="bulk-reject-btn"
            onClick={handleBulkReject}
            disabled={pendingPlaylists.length === 0}
          >
            <XCircle size={16} />
            {rejectButtonText}
          </button>
        </div>
      )}

      {/* Enhanced Grid Layout */}
      <div className="playlist-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading playlists...</p>
          </div>
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="playlist-card"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              {activeTab === "pending" && (
                <div
                  className="card-checkbox"
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

              <div className="playlist-thumbnail-container">
                {playlist.cover_image_url ? (
                  <img
                    src={playlist.cover_image_url}
                    alt={playlist.title}
                    className="playlist-thumbnail"
                  />
                ) : (
                  <div className="playlist-thumbnail-placeholder">
                    <Music size={48} />
                  </div>
                )}

                {/* <div className="play-overlay">
                  <Play size={24} />
                </div> */}

                <div className="playlist-type-overlay">
                  <span className={`type-badge type-${playlist.playlist_type}`}>
                    {playlist.playlist_type}
                  </span>
                </div>

                <div className="status-overlay">
                  <span
                    className={`status-badge status-${playlist.status?.replace(
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

              <div className="playlist-card-content">
                <div className="playlist-header">
                  <h3 className="playlist-title">{playlist.title}</h3>
                  <div className="playlist-meta">
                    <div className="dj-info">
                      {playlist.dj?.avatar && (
                        <img
                          src={playlist.dj.avatar}
                          alt={playlist.dj.name}
                          className="dj-avatar"
                        />
                      )}
                      <span className="dj-name">{playlist.dj?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="playlist-stats">
                  <div className="stat-item">
                    <Music size={16} />
                    <span>{playlist.total_songs} Songs</span>
                  </div>
                  <div className="stat-item">
                    <Clock size={16} />
                    <span>{playlist.duration_minutes} min</span>
                  </div>
                </div>

                {activeTab === "pending" &&
                  playlist.status === "pending_approval" && (
                    <div
                      className="card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="card-approve-btn"
                        onClick={() => handleApprove(playlist.id)}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        className="card-reject-btn"
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
          <div className="empty-state">
            <span className="empty-icon">🎵</span>
            <span className="empty-text">No playlists found.</span>
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          disabled={pagination.page <= 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {pagination.page || 1} of {pagination.total_pages || 1}
        </span>
        <button
          className="pagination-btn"
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
          className="modal-overlay"
          onClick={() => setSelectedPlaylist(null)}
        >
          <div
            className="modal-content playlist-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedPlaylist.title} - Playlist Details
              </h2>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedPlaylist(null)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="playlist-detail-image">
                  {selectedPlaylist.cover_image_url ? (
                    <img
                      src={selectedPlaylist.cover_image_url}
                      alt={selectedPlaylist.title}
                      className="modal-playlist-cover"
                    />
                  ) : (
                    <div className="modal-placeholder-cover">
                      <Music size={80} />
                      <p>No Cover Image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Playlist Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">DJ</div>
                    <div className="info-value">
                      <div className="dj-detail">
                        {selectedPlaylist.dj?.avatar && (
                          <img
                            src={selectedPlaylist.dj.avatar}
                            alt={selectedPlaylist.dj.name}
                            className="dj-avatar-large"
                          />
                        )}
                        <span>{selectedPlaylist.dj?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Type</div>
                    <div className="info-value">
                      <span
                        className={`type-badge type-${selectedPlaylist.playlist_type}`}
                      >
                        {selectedPlaylist.playlist_type}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Status</div>
                    <div className="info-value">
                      <span
                        className={`status-badge status-${selectedPlaylist.status?.replace(
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
                  <div className="info-item">
                    <div className="info-label">Songs</div>
                    <div className="info-value">
                      <div className="songs-count">
                        <Music size={18} />
                        <span>{selectedPlaylist.total_songs}</span>
                      </div>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Duration</div>
                    <div className="info-value">
                      <div className="duration-count">
                        <Clock size={18} />
                        <span>{selectedPlaylist.duration_minutes} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {activeTab === "pending" &&
                selectedPlaylist.status === "pending_approval" && (
                  <div className="modal-actions">
                    <button
                      className="approve-action-btn"
                      onClick={() => handleApprove(selectedPlaylist.id)}
                    >
                      <CheckCircle size={16} />
                      Approve Playlist
                    </button>
                    <button
                      className="reject-action-btn"
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
