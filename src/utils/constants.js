export const CONSTANTS = {
  URL: {
    BASE_URL:
      "https://dancewithme-b9gadtdhbjdya5c5.westus-01.azurewebsites.net",
    // BASE_URL: "",

    LOGIN: "/api/v1/admin/login",
    FORGOT_PASSWORD: "/api/v1/admin-auth/forgot-password",
    RESET_PASSWORD: "/api/v1/admin-auth/reset-password",
    DASHBOARD: "/api/v1/admin/dashboard",
    UPLOAD_MEDIA: "/api/v1/file/upload",
    PROFILE: "/profile",
    USERS: "/users",
    CHANGE_PASSWORD: "/api/v1/admin-auth/change-password",

    // === PROGRAM MANAGEMENT ===
    GET_PROGRAMS: "/api/v1/admin/program",
    CREATE_PROGRAM: "/api/v1/admin/program",

    // === CHALLENGE MANAGEMENT ===
    CREATE_CHALLENGE: "/api/v1/admin/challenge",
    GET_CHALLENGES: "/api/v1/admin/challenge",
    GET_CHALLENGE_BY_ID: (id) => `/api/v1/admin/challenge/${id}`,
    UPDATE_CHALLENGE: (id) => `/api/v1/admin/challenge/${id}`,
    DELETE_CHALLENGE: (id) => `/api/v1/admin/challenge/${id}`,
    UPDATE_CHALLENGE_STATUS: (id) => `/api/v1/admin/challenge/${id}/status`,

    // === INSTRUCTOR MANAGEMENT ===
    APPROVE_INSTRUCTOR: "/api/v1/admin/approveInstructorApplication",
    REJECT_INSTRUCTOR: "/api/v1/admin/rejectInstructorApplication",
    INSTRUCTOR_APPLICATION_LIST: "/api/v1/admin/instructorApplicationList",

    // === ORGANIZER MANAGEMENT ===
    APPROVE_ORGANIZER: "/api/v1/admin/approveOrganiserApplication",
    REJECT_ORGANIZER: "/api/v1/admin/rejectOrganiserApplication",
    ORGANIZER_APPLICATION_LIST: "/api/v1/admin/organiserApplicationList",

    // === DJ MANAGEMENT ===
    APPROVE_DJ: "/api/v1/admin/approveDjApplication",
    REJECT_DJ: "/api/v1/admin/rejectDjApplication",
    DJ_APPLICATION_LIST: "/api/v1/admin/djApplicationList",

    // === USER MANAGEMENT ===
    USERS_USER: "/api/v1/admin/users?userType=user&page=1&limit=10",
    USERS_DJ: "/api/v1/admin/users?userType=dj&page=1&limit=10",
    USERS_PROFESSOR: "/api/v1/admin/users?userType=instructor&page=1&limit=10",
    USERS_ORGANIZER: "/api/v1/admin/users?userType=organiser&page=1&limit=10",
    USER_BOOKED_DATES: (userId, page = 1, limit = 10) =>
      `/api/v1/admin/users/${userId}/booked-dates?page=${page}&limit=${limit}`,

    // === CLASS MANAGEMENT ===
    CLASS_PENDING: "/api/v1/admin/classes/pending", // GET
    CLASS_LIST: "/api/v1/admin/classes", // GET
    GET_ALL_CLASSES: "/api/v1/admin/classes", // <-- ADD THIS
    CLASS_DETAIL: (id) => `/api/v1/admin/classes/${id}`, // GET
    CLASS_APPROVE: (id) => `/api/v1/admin/classes/${id}/approve`, // PUT
    CLASS_REJECT: (id) => `/api/v1/admin/classes/${id}/reject`, // PUT

    // === EVENT MANAGEMENT ===
    GET_ALL_EVENTS_DRAFT: "/api/v1/admin/events?status=draft",
    GET_ALL_EVENTS_APPROVED: "/api/v1/admin/events?status=published",
    GET_EVENT_INTERESTS: (eventId) =>
      `/api/v1/admin/events/${eventId}/interests`,
    APPROVE_EVENT: (eventId) => `/api/v1/admin/events/${eventId}/approve`,
    REJECT_EVENT: (eventId) => `/api/v1/admin/events/${eventId}/reject`,

    // === FEED MANAGEMENT ===
    GET_FEEDS: `/api/v1/admin/posts`,
    GET_FEED_LIKES: (postId) => `/api/v1/admin/posts/${postId}/likes`,

    // === PLAYLIST MANAGEMENT ===
    GET_PLAYLISTS: "/api/v1/admin/playlists", // GET with filters
    APPROVE_PLAYLIST: (id) => `/api/v1/admin/playlists/${id}/approve`, // PUT
    REJECT_PLAYLIST: (id) => `/api/v1/admin/playlists/${id}/reject`, // PUT

    // === EARNING MANAGEMENT ===
    EARNINGS_OVERVIEW: "/api/v1/admin/earnings/overview",
    EARNINGS_ALL: "/api/v1/admin/earnings/all", // ✅ Fixed: Remove function, make it a string
    EARNINGS_USER_DETAIL: (id, type, page = 1, limit = 50) =>
      `/api/v1/admin/earnings/users/${id}?user_type=${type}&page=${page}&limit=${limit}`,

    // === PAYOUTS MANAGEMENT ===
    PAYOUTS_PENDING: "/api/v1/admin/earnings/payouts/pending",
    PROCESS_PAYOUT: (payoutId) =>
      `/api/v1/admin/earnings/payouts/${payoutId}/process`,
    UPLOAD_TRANSFER_PROOF: (payoutId) =>
      `/api/v1/admin/earnings/payouts/${payoutId}/transfer-proof`,
    MARK_DISPUTE_RESOLVED: (payoutId) =>
      `/api/v1/admin/earnings/payouts/${payoutId}/complete`,

    // === NOTIFICATION MANAGEMENT ===
    GET_NOTIFICATIONS: "/api/v1/admin/notifications",
    CREATE_NOTIFICATION: "/api/v1/admin/notifications",
    GET_NOTIFICATION_DETAILS: (id) => `/api/v1/admin/notifications/${id}`,
    CANCEL_NOTIFICATION: (id) => `/api/v1/admin/notifications/${id}/cancel`,

    // Badges APIs
    GET_ALL_BADGES: "/api/v1/admin/badges/all",
    GET_USER_BADGES: (userId) => `/api/v1/admin/users/${userId}/badges`,

    // Reports
    GET_REPORTS: "/api/v1/admin/reports",
    UPDATE_REPORT_STATUS: (reportId) =>
      `/api/v1/admin/reports/${reportId}/status`,

    // Blocks
    GET_BLOCKS: "/api/v1/admin/blocks",

    REFERRALS: {
      LEADERBOARD: "/api/v1/admin/referrals/leaderboard",
      STATS: "/api/v1/admin/referrals/stats",
      USER_REFERRALS: (userId, page, limit) =>
        `/api/v1/admin/referrals/users/${userId}?page=${page}&limit=${limit}`,
    },

    // === CHALLENGE SUBMISSIONS MANAGEMENT ===
    CHALLENGE_SUBMISSIONS: {
      GET_BY_CHALLENGE: (challengeId, page = 1, limit = 20) =>
        `/api/v1/admin/challenge/${challengeId}/submissions?page=${page}&limit=${limit}`,
      GET_PENDING: (page = 1, limit = 20) =>
        `/api/v1/admin/challenge/submissions/pending?page=${page}&limit=${limit}`,
      GET_DETAILS: (submissionId) =>
        `/api/v1/admin/challenge/submissions/${submissionId}`,
      APPROVE: (submissionId) =>
        `/api/v1/admin/challenge/submissions/${submissionId}/approve`,
      REJECT: (submissionId) =>
        `/api/v1/admin/challenge/submissions/${submissionId}/reject`,
      DELETE_SUBMISSION: (submissionId) =>
        `/api/v1/admin/challenge/submissions/${submissionId}`,

      // Challenge Participants
      GET_CHALLENGE_PARTICIPANTS: (challengeId, page = 1, limit = 20) =>
        `/api/v1/admin/challenge/${challengeId}/participants?page=${page}&limit=${limit}`,
      REMOVE_PARTICIPANT: (challengeId, userId) =>
        `/api/v1/admin/challenge/${challengeId}/participants/${userId}`,

      // Challenge Analytics
      GET_CHALLENGE_ANALYTICS: (challengeId) =>
        `/api/v1/admin/challenge/${challengeId}/analytics`,

      // Comments
      DELETE_COMMENT: (commentId) =>
        `/api/v1/admin/challenge/comments/${commentId}`,
    },
  },
};
// KPI Cards configuration
export const KPI_CARDS = [
  {
    key: "total_users",
    title: "Total Users",
    icon: "👥",
    color: "blue",
    format: "number",
  },
  {
    key: "active_subscriptions",
    title: "Active Subscriptions",
    icon: "📊",
    color: "green",
    format: "number",
  },
  {
    key: "total_revenue",
    title: "Total Revenue",
    icon: "💰",
    color: "purple",
    format: "currency",
  },
  {
    key: "active_challenges",
    title: "Active Challenges",
    icon: "🏆",
    color: "orange",
    format: "number",
  },
  {
    key: "ongoing_classes",
    title: "Ongoing Classes",
    icon: "📚",
    color: "red",
    format: "number",
  },
  {
    key: "active_events",
    title: "Active Events",
    icon: "🎉",
    color: "teal",
    format: "number",
  },
  {
    key: "active_programs",
    title: "Active Programs",
    icon: "🎬",
    color: "indigo",
    format: "number",
  },
];

// Year options for filter
export const YEAR_OPTIONS = [
  { value: "all", label: "All Years" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];

// Month options for filter
export const MONTH_OPTIONS = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Loading states
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};
