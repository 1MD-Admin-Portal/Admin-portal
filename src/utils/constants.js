export const CONSTANTS = {
  URL: {
    BASE_URL:
      "https://dancewithme-b9gadtdhbjdya5c5.westus-01.azurewebsites.net",
    // BASE_URL: "",

    LOGIN: "/api/v1/admin/login",
    UPLOAD_MEDIA: "/api/v1/file/upload",
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    USERS: "/users",

    // === PROGRAM MANAGEMENT ===
    GET_PROGRAMS: "/api/v1/admin/program",
    CREATE_PROGRAM: "/api/v1/admin/program",

    // === CHALLENGE MANAGEMENT ===
    GET_CHALLENGES: "/api/v1/admin/challenge?page=1&limit=20",
    CHALLENGE_CREATE: "/api/v1/admin/challenge",

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

    // === CLASS MANAGEMENT ===
    CLASS_PENDING: "/api/v1/admin/classes/pending", // GET
    CLASS_LIST: "/api/v1/admin/classes", // GET
    GET_ALL_CLASSES: "/api/v1/admin/classes", // <-- ADD THIS
    CLASS_DETAIL: (id) => `/api/v1/admin/classes/${id}`, // GET
    CLASS_APPROVE: (id) => `/api/v1/admin/classes/${id}/approve`, // PUT
    CLASS_REJECT: (id) => `/api/v1/admin/classes/${id}/reject`, // PUT
  },
};
