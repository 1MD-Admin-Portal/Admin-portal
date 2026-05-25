import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

export const getDJApplications = async (params = {}) => {
  const token = localStorage.getItem("token");
  const { search = "", page = 1, limit = 10, status = "", date_from = "", date_to = "" } = params;

  const queryParams = new URLSearchParams({
    page,
    limit,
  });

  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (date_from) queryParams.append("date_from", date_from);
  if (date_to) queryParams.append("date_to", date_to);



  const res = await axios.get(
    `${BASE_URL}${CONSTANTS.URL.DJ_APPLICATION_LIST}?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  // Return the full response object so we can access both applications and pagination
  return res.data;
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
