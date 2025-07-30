import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

export const fetchUsers = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}${CONSTANTS.URL.USERS_USER.replace(
      "page=1",
      `page=${page}`
    ).replace("limit=10", `limit=${limit}`)}`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching Users:", error);
    return { users: [], pagination: {} };
  }
};
