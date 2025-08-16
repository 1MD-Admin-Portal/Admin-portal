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
