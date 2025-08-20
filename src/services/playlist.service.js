// services/playlist.service.js
import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

// === GET PLAYLISTS (with filters & pagination) ===
export const getPlaylistsService = async (
  page = 1,
  limit = 10,
  status = "pending_approval",
  playlistType = "all",
  search = "",
  sortBy = "newest"
) => {
  try {
    const res = await api.get(
      `${CONSTANTS.URL.GET_PLAYLISTS}?status=${status}&playlist_type=${playlistType}&search=${search}&sort_by=${sortBy}&page=${page}&limit=${limit}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data; // { playlists: [...], pagination: {...} }
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

// === APPROVE PLAYLIST ===
export const approvePlaylistService = async (id, adminNotes = "") => {
  try {
    const res = await api.put(
      CONSTANTS.URL.APPROVE_PLAYLIST(id),
      { admin_notes: adminNotes },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    console.error("Error approving playlist:", error);
    throw error;
  }
};

// === REJECT PLAYLIST ===
export const rejectPlaylistService = async (
  id,
  reason = "Rejected by admin"
) => {
  try {
    const res = await api.put(
      CONSTANTS.URL.REJECT_PLAYLIST(id),
      { rejection_reason: reason },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error rejecting playlist:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// === GET PLAYLIST DETAIL ===
export const getPlaylistDetailService = async (id) => {
  try {
    const res = await api.get(CONSTANTS.URL.PLAYLIST_DETAIL(id), {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching playlist detail:", error);
    throw error;
  }
};
