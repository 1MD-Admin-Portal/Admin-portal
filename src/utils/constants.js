export const CONSTANTS = {
  URL: {
    BASE_URL:
      "https://dancewithme-b9gadtdhbjdya5c5.westus-01.azurewebsites.net",
    // BASE_URL: "",

    LOGIN: "/api/v1/admin/login",
    FORGOT_PASSWORD: "/api/v1/admin-auth/forgot-password",
    RESET_PASSWORD: "/api/v1/admin-auth/reset-password",
    UPLOAD_MEDIA: "/api/v1/file/upload",
    DASHBOARD: "/dashboard",
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
    GET_ALL_BADGES: () => `/api/v1/admin/badges/all`,
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
  },
};
