import React, { useEffect, useState } from "react";
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
    limit: 10,
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

  return (
    <div className="playlist-container">
      <h2>Playlists</h2>
      {/* Tabs */}
      <div className="playlist-tabs">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => handleTabChange("pending")}
        >
          Require Approval
        </button>
        <button
          className={activeTab === "approved" ? "active" : ""}
          onClick={() => handleTabChange("approved")}
        >
          Ongoing / Accepted
        </button>
      </div>

      {/* Filters */}
      <div className="playlist-filters">
        <input
          type="text"
          placeholder="Search by title or DJ"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
          }
        />

        <select
          value={filters.playlist_type}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              playlist_type: e.target.value,
              page: 1,
            }))
          }
        >
          <option value="all">All Types</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        <select
          value={filters.sort_by}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sort_by: e.target.value,
              page: 1,
            }))
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {activeTab === "pending" && playlists.length > 0 && (
        <div className="bulk-actions">
          <button
            onClick={async () => {
              for (const id of selectedIds) {
                await approvePlaylistService(id, "");
              }
              fetchPlaylists();
              setSelectedIds([]);
            }}
            disabled={selectedIds.length === 0}
          >
            ✅ Approve Selected
          </button>

          <button
            onClick={async () => {
              for (const id of selectedIds) {
                await rejectPlaylistService(id, "Not suitable");
              }
              fetchPlaylists();
              setSelectedIds([]);
            }}
            disabled={selectedIds.length === 0}
          >
            ❌ Reject Selected
          </button>
        </div>
      )}

      {/* Playlist Table */}
      <div className="playlist-table">
        {loading ? (
          <p>Loading playlists...</p>
        ) : playlists.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(
                          playlists
                            .filter((pl) => pl.status === "pending_approval")
                            .map((pl) => pl.id)
                        );
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length ===
                        playlists.filter(
                          (pl) => pl.status === "pending_approval"
                        ).length
                    }
                  />
                </th>
                <th>Cover</th>
                <th>Title</th>
                <th>DJ</th>
                <th>Type</th>
                <th>Status</th>
                <th>Songs</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {playlists.map((pl) => (
                <tr key={pl.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(pl.id)}
                      disabled={pl.status !== "pending_approval"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [...prev, pl.id]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== pl.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    {pl.cover_image_url ? (
                      <img
                        src={pl.cover_image_url}
                        alt={pl.title}
                        className="playlist-cover"
                      />
                    ) : (
                      "No Cover"
                    )}
                  </td>
                  <td>{pl.title}</td>
                  <td>
                    {pl.dj?.avatar && (
                      <img
                        src={pl.dj?.avatar}
                        alt={pl.dj?.name}
                        className="dj-avatar"
                      />
                    )}
                    {pl.dj?.name}
                  </td>
                  <td>{pl.playlist_type}</td>
                  <td>{pl.status}</td>
                  <td>{pl.total_songs}</td>
                  <td>{pl.duration_minutes} min</td>
                  <td>
                    {pl.status === "pending_approval" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(pl.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(pl.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No playlists found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: pagination.total_pages }, (_, i) => (
          <button
            key={i + 1}
            className={pagination.page === i + 1 ? "active" : ""}
            onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Playlist Modal */}
      {selectedPlaylist && (
        <div
          className="playlist-modal-overlay"
          onClick={() => setSelectedPlaylist(null)}
        >
          <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedPlaylist(null)}
            >
              ✖
            </button>
            <h2>{selectedPlaylist.title}</h2>
            {selectedPlaylist.cover_image_url && (
              <img
                src={selectedPlaylist.cover_image_url}
                alt={selectedPlaylist.title}
                className="modal-cover"
              />
            )}
            <p>
              <strong>DJ:</strong> {selectedPlaylist.dj?.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedPlaylist.playlist_type}
            </p>
            <p>
              <strong>Status:</strong> {selectedPlaylist.status}
            </p>
            <p>
              <strong>Songs:</strong> {selectedPlaylist.total_songs}
            </p>
            <p>
              <strong>Duration:</strong> {selectedPlaylist.duration_minutes} min
            </p>

            {/* {activeTab === "pending" && (
              <div className="modal-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(selectedPlaylist.id)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(selectedPlaylist.id)}
                >
                  Reject
                </button>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
