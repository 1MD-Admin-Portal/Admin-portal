import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

export const getDJApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${BASE_URL}${CONSTANTS.URL.DJ_APPLICATION_LIST}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.applications;
};

export const approveDJApplication = async (applicationId) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${BASE_URL}${CONSTANTS.URL.APPROVE_DJ}`,
    { applicationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const rejectDJApplication = async (applicationId, comment = "") => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${BASE_URL}${CONSTANTS.URL.REJECT_DJ}`,
    { applicationId, comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const fetchDJs = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}${CONSTANTS.URL.USERS_DJ.replace(
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
    console.error("Error fetching DJs:", error);
    return { users: [], pagination: {} };
  }
};
