import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

export const fetchUsers = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    // Build the URL directly (instead of using .replace)
    const url = `${BASE_URL}/api/v1/admin/users?userType=user&page=${page}&limit=${limit}`;
    console.log("Fetching URL:", url); // For debug

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // Should include: { users: [...], pagination: {...} }
  } catch (error) {
    console.error("Error fetching Users:", error);
    return { users: [], pagination: {} };
  }
};
