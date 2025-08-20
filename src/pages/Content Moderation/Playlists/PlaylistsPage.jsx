import React, { useEffect, useState } from "react";
import {
  getPlaylists,
  approvePlaylist,
  rejectPlaylist,
} from "../../../services/playlist.service";
import "./Playlist.css";

const PlaylistPage = () => {
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

  useEffect(() => {
    fetchPlaylists();
  }, [filters, activeTab]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await getPlaylists(filters);
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
    await approvePlaylist(id, { comment: "" });
    fetchPlaylists();
  };

  const handleReject = async (id) => {
    await rejectPlaylist(id, { comment: "Not suitable" });
    fetchPlaylists();
  };

  return (
    <div className="playlist-container">
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

      {/* Playlist Table */}
      <div className="playlist-table">
        {loading ? (
          <p>Loading playlists...</p>
        ) : playlists.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>DJ</th>
                <th>Type</th>
                <th>Status</th>
                <th>Songs</th>
                <th>Duration</th>
                {activeTab === "pending" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {playlists.map((pl) => (
                <tr key={pl.id}>
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
                    <img
                      src={pl.dj?.avatar}
                      alt={pl.dj?.name}
                      className="dj-avatar"
                    />
                    {pl.dj?.name}
                  </td>
                  <td>{pl.playlist_type}</td>
                  <td>{pl.status}</td>
                  <td>{pl.total_songs}</td>
                  <td>{pl.duration_minutes} min</td>
                  {activeTab === "pending" && (
                    <td>
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
                    </td>
                  )}
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
    </div>
  );
};

export default PlaylistPage;
