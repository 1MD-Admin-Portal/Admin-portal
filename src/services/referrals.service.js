import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

// Get leaderboard
export const getReferralLeaderboardService = async (params = {}) => {
  const { date_from = null, page = 1, limit = 20 } = params;
  const queryParams = new URLSearchParams({
    page,
    limit,
  });
  if (date_from) {
    queryParams.append("date_from", date_from);
  }
  const response = await api.get(
    `${CONSTANTS.URL.REFERRALS.LEADERBOARD}?${queryParams.toString()}`
  );
  

  
  // Handle multiple response structures
  if (response.data?.leaderboard) {
    return response.data.leaderboard;
  }
  if (response.data?.data) {
    return response.data;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data || [];
};

// Get overall stats
export const getReferralStatsService = async () => {
  const response = await api.get(CONSTANTS.URL.REFERRALS.STATS);
  return response.data.stats;
};

// Get user referrals with pagination
export const getUserReferralsService = async (userId, page = 1, limit = 10) => {
  const response = await api.get(
    CONSTANTS.URL.REFERRALS.USER_REFERRALS(userId, page, limit)
  );
  return response.data;
};
