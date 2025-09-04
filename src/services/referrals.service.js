import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

// Get leaderboard
export const getReferralLeaderboardService = async () => {
  const response = await api.get(CONSTANTS.URL.REFERRALS.LEADERBOARD);
  return response.data.leaderboard;
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
