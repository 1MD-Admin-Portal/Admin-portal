import axios from "axios";
import { CONSTANTS } from "../utils/constants.js";

export const getFeedsService = async (page = 1, limit = 12) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_FEEDS}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching feeds:",
      error.response?.data || error.message
    );
    return { posts: [], pagination: {} };
  }
};

export const getFeedLikesService = async (postId, page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_FEED_LIKES(
        postId
      )}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching feed likes:",
      error.response?.data || error.message
    );
    return { likes: [], pagination: {}, analytics: {} };
  }
};

// === NEW CONTENT MODERATION SERVICES ===

export const getReportedPostsService = async (
  page = 1,
  limit = 20,
  filters = {}
) => {
  try {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_REPORTED_POSTS}?${queryParams}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching reported posts:",
      error.response?.data || error.message
    );
    return { reported_posts: [], pagination: {} };
  }
};

export const moderateReportService = async (
  reportId,
  action,
  adminNotes = ""
) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.MODERATE_REPORT(reportId)}`,
      {
        action,
        admin_notes: adminNotes,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error moderating report:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getModerationStatsService = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_MODERATION_STATS}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching moderation stats:",
      error.response?.data || error.message
    );
    return { statistics: {} };
  }
};
