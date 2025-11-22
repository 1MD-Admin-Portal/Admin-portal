// src/services/betaTesters.service.js
import axios from "axios";
import { CONSTANTS } from "../utils/constants";

// ⚡ Helper: Auth header
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ============================================================
   1️⃣ DASHBOARD API (GET)
   GET /api/v1/betaTesters/dashboard?start_date=&end_date=&user_id=
   ============================================================ */
export const getBetaTesterDashboardService = async (
  startDate = null,
  endDate = null,
  userId = null
) => {
  const params = new URLSearchParams();

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  if (userId) params.append("user_id", userId);

  const url = `${CONSTANTS.URL.BASE_URL}/api/v1/betaTesters/dashboard${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const res = await axios.get(url, {
    headers: authHeader(),
  });

  return res.data;
};

/* ============================================================
   2️⃣ GET BUG LIST API (GET)
   GET /api/v1/betaTesters/bugs?page=&limit=
   ============================================================ */
export const getBetaTesterBugsService = async (page = 1, limit = 20) => {
  const url = `${CONSTANTS.URL.BASE_URL}/api/v1/betaTesters/bugs?page=${page}&limit=${limit}`;

  const res = await axios.get(url, {
    headers: authHeader(),
  });

  return res.data;
};

/* ============================================================
   3️⃣ RESOLVE BUG API (PATCH)
   PATCH /api/v1/betaTesters/bugs/:id/resolve
   ============================================================ */
export const resolveBetaTesterBugService = async (bugId) => {
  const url = `${CONSTANTS.URL.BASE_URL}/api/v1/betaTesters/bugs/${bugId}/resolve`;

  const res = await axios.patch(
    url,
    {},
    {
      headers: authHeader(),
    }
  );

  return res.data;
};
