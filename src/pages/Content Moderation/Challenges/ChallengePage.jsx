// import React, { useEffect, useState } from "react";
// import {
//   Play,
//   Eye,
//   Edit3,
//   Trash2,
//   Users,
//   TrendingUp,
//   CheckCircle,
//   XCircle,
//   Clock,
//   BarChart3,
//   UserMinus,
//   MessageSquare,
//   ThumbsUp,
//   Upload,
//   Calendar,
//   Award,
//   Plus,
//   Search,
//   Filter,
//   X,
//   AlertCircle,
//   Download,
//   Settings,
// } from "lucide-react";

// // Import your services (assuming they're available)
// import {
//   createChallengeService,
//   getAllChallengesService,
//   getChallengeDetailsService,
//   updateChallengeService,
//   deleteChallengeService,
//   updateChallengeStatusService,
//   getChallengeSubmissionsService,
//   getPendingSubmissionsService,
//   getSubmissionDetailsService,
//   approveSubmissionService,
//   rejectSubmissionService,
//   deleteSubmissionService,
//   getChallengeParticipantsService,
//   removeParticipantService,
//   getChallengeAnalyticsService,
//   deleteCommentService,
// } from "../../../../services/challenge.service";

// const ChallengePage = () => {
//   // State for challenges
//   const [challenges, setChallenges] = useState([]);
//   const [selectedChallenge, setSelectedChallenge] = useState(null);
//   const [pagination, setPagination] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [activeTab, setActiveTab] = useState("challenges");

//   // Modal states
//   const [challengeDetailsModal, setChallengeDetailsModal] = useState(false);
//   const [createChallengeModal, setCreateChallengeModal] = useState(false);
//   const [editChallengeModal, setEditChallengeModal] = useState(false);
//   const [submissionsModal, setSubmissionsModal] = useState(false);
//   const [participantsModal, setParticipantsModal] = useState(false);
//   const [analyticsModal, setAnalyticsModal] = useState(false);
//   const [submissionDetailModal, setSubmissionDetailModal] = useState(false);

//   // Data states
//   const [submissions, setSubmissions] = useState([]);
//   const [pendingSubmissions, setPendingSubmissions] = useState([]);
//   const [participants, setParticipants] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   // Form states
//   const [newChallenge, setNewChallenge] = useState({
//     title: "",
//     challenger_type: "public",
//     description: "",
//     image_url: "",
//     dance_style: "",
//     dance_level: "",
//     start_date: "",
//     end_date: "",
//     prize_details: "",
//     max_participants: "",
//     status: "draft",
//     is_trending: false,
//     tasks: [{ task_type: "watch_video", task_title: "", video_url: "" }],
//   });

//   const [editChallenge, setEditChallenge] = useState({});
//   const [feedbackText, setFeedbackText] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Load initial data
//   useEffect(() => {
//     fetchChallenges();
//     if (activeTab === "pending-submissions") {
//       fetchPendingSubmissions();
//     }
//   }, [page, activeTab]);

//   const fetchChallenges = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllChallengesService(page, 20);
//       setChallenges(response.challenges || []);
//       setPagination(response.pagination || {});
//     } catch (error) {
//       setError("Failed to fetch challenges");
//       console.error("Error fetching challenges:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPendingSubmissions = async () => {
//     try {
//       setLoading(true);
//       const response = await getPendingSubmissionsService(page, 20);
//       setPendingSubmissions(response.submissions || []);
//     } catch (error) {
//       setError("Failed to fetch pending submissions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openChallengeDetails = async (challenge) => {
//     try {
//       const response = await getChallengeDetailsService(challenge.id);
//       setSelectedChallenge(response || challenge);
//       setChallengeDetailsModal(true);
//     } catch (error) {
//       setError("Failed to fetch challenge details");
//     }
//   };

//   const openSubmissions = async (challenge) => {
//     try {
//       setSelectedChallenge(challenge);
//       const response = await getChallengeSubmissionsService(challenge.id);
//       setSubmissions(response.submissions || []);
//       setSubmissionsModal(true);
//     } catch (error) {
//       setError("Failed to fetch submissions");
//     }
//   };

//   const openParticipants = async (challenge) => {
//     try {
//       setSelectedChallenge(challenge);
//       const response = await getChallengeParticipantsService(challenge.id);
//       setParticipants(response.participants || []);
//       setParticipantsModal(true);
//     } catch (error) {
//       setError("Failed to fetch participants");
//     }
//   };

//   const openAnalytics = async (challenge) => {
//     try {
//       setSelectedChallenge(challenge);
//       const response = await getChallengeAnalyticsService(challenge.id);
//       setAnalytics(response);
//       setAnalyticsModal(true);
//     } catch (error) {
//       setError("Failed to fetch analytics");
//     }
//   };

//   const openSubmissionDetail = async (submission) => {
//     try {
//       const response = await getSubmissionDetailsService(submission.id);
//       setSelectedSubmission(response || submission);
//       setSubmissionDetailModal(true);
//     } catch (error) {
//       setError("Failed to fetch submission details");
//     }
//   };

//   const handleApproveSubmission = async (submissionId) => {
//     try {
//       await approveSubmissionService(submissionId, feedbackText);
//       setSuccess("Submission approved successfully");
//       setFeedbackText("");
//       setSubmissionDetailModal(false);
//       fetchPendingSubmissions();
//     } catch (error) {
//       setError("Failed to approve submission");
//     }
//   };

//   const handleRejectSubmission = async (submissionId) => {
//     try {
//       await rejectSubmissionService(submissionId, feedbackText);
//       setSuccess("Submission rejected");
//       setFeedbackText("");
//       setSubmissionDetailModal(false);
//       fetchPendingSubmissions();
//     } catch (error) {
//       setError("Failed to reject submission");
//     }
//   };

//   const handleDeleteSubmission = async (submissionId) => {
//     if (window.confirm("Are you sure you want to delete this submission?")) {
//       try {
//         await deleteSubmissionService(submissionId);
//         setSuccess("Submission deleted successfully");
//         setSubmissionDetailModal(false);
//         fetchPendingSubmissions();
//       } catch (error) {
//         setError("Failed to delete submission");
//       }
//     }
//   };

//   const handleRemoveParticipant = async (challengeId, userId) => {
//     if (window.confirm("Are you sure you want to remove this participant?")) {
//       try {
//         await removeParticipantService(challengeId, userId);
//         setSuccess("Participant removed successfully");
//         openParticipants(selectedChallenge);
//       } catch (error) {
//         setError("Failed to remove participant");
//       }
//     }
//   };

//   const handleCreateChallenge = async () => {
//     try {
//       await createChallengeService(newChallenge);
//       setSuccess("Challenge created successfully");
//       setCreateChallengeModal(false);
//       setNewChallenge({
//         title: "",
//         challenger_type: "public",
//         description: "",
//         image_url: "",
//         dance_style: "",
//         dance_level: "",
//         start_date: "",
//         end_date: "",
//         prize_details: "",
//         max_participants: "",
//         status: "draft",
//         is_trending: false,
//         tasks: [{ task_type: "watch_video", task_title: "", video_url: "" }],
//       });
//       fetchChallenges();
//     } catch (error) {
//       setError("Failed to create challenge");
//     }
//   };

//   const handleUpdateChallenge = async () => {
//     try {
//       await updateChallengeService(editChallenge.id, editChallenge);
//       setSuccess("Challenge updated successfully");
//       setEditChallengeModal(false);
//       fetchChallenges();
//     } catch (error) {
//       setError("Failed to update challenge");
//     }
//   };

//   const handleStatusChange = async (challengeId, newStatus) => {
//     try {
//       await updateChallengeStatusService(challengeId, newStatus);
//       setSuccess("Challenge status updated");
//       fetchChallenges();
//     } catch (error) {
//       setError("Failed to update challenge status");
//     }
//   };

//   const handleDeleteChallenge = async (challengeId) => {
//     if (window.confirm("Are you sure you want to delete this challenge?")) {
//       try {
//         await deleteChallengeService(challengeId);
//         setSuccess("Challenge deleted successfully");
//         fetchChallenges();
//       } catch (error) {
//         setError("Failed to delete challenge");
//       }
//     }
//   };

//   const filteredChallenges = challenges.filter((challenge) => {
//     const matchSearch = challenge.title
//       .toLowerCase()
//       .includes(search.toLowerCase());
//     const matchStatus = statusFilter ? challenge.status === statusFilter : true;
//     return matchSearch && matchStatus;
//   });

//   // Alert Component
//   const Alert = ({ type, message, onClose }) => (
//     <div
//       className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
//         type === "error"
//           ? "bg-red-50 text-red-800 border border-red-200"
//           : "bg-green-50 text-green-800 border border-green-200"
//       }`}
//     >
//       <div className="flex items-center space-x-2">
//         <AlertCircle className="h-4 w-4" />
//         <span>{message}</span>
//         <button onClick={onClose} className="ml-2">
//           <X className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Alerts */}
//       {error && (
//         <Alert type="error" message={error} onClose={() => setError("")} />
//       )}
//       {success && (
//         <Alert
//           type="success"
//           message={success}
//           onClose={() => setSuccess("")}
//         />
//       )}

//       <div className="max-w-7xl mx-auto p-6">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Challenge Management
//           </h1>
//           <p className="text-gray-600">
//             Manage challenges, submissions, and participants
//           </p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="border-b border-gray-200 mb-6">
//           <nav className="flex space-x-8">
//             {[
//               { id: "challenges", label: "Challenges", icon: Award },
//               {
//                 id: "pending-submissions",
//                 label: "Pending Submissions",
//                 icon: Clock,
//               },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === tab.id
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 <tab.icon className="h-4 w-4" />
//                 <span>{tab.label}</span>
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Challenges Tab */}
//         {activeTab === "challenges" && (
//           <div className="space-y-6">
//             {/* Filters and Create Button */}
//             <div className="bg-white rounded-lg shadow-sm p-4">
//               <div className="flex flex-wrap gap-4 items-center justify-between">
//                 <div className="flex gap-4 items-center">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search challenges..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">All Status</option>
//                     <option value="draft">Draft</option>
//                     <option value="active">Active</option>
//                     <option value="completed">Completed</option>
//                     <option value="ended">Ended</option>
//                   </select>
//                 </div>
//                 <button
//                   onClick={() => setCreateChallengeModal(true)}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
//                 >
//                   <Plus className="h-4 w-4" />
//                   <span>Create Challenge</span>
//                 </button>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex justify-center py-12">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             ) : (
//               <>
//                 {/* Challenges Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredChallenges.map((challenge) => (
//                     <div
//                       key={challenge.id}
//                       className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
//                     >
//                       {challenge.image_url && (
//                         <img
//                           src={challenge.image_url}
//                           alt={challenge.title}
//                           className="w-full h-48 object-cover"
//                           onError={(e) => {
//                             e.target.style.display = "none";
//                           }}
//                         />
//                       )}
//                       <div className="p-4">
//                         <div className="flex items-center justify-between mb-2">
//                           <h3 className="text-lg font-semibold text-gray-900 truncate">
//                             {challenge.title}
//                           </h3>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               challenge.status === "active"
//                                 ? "bg-green-100 text-green-800"
//                                 : challenge.status === "draft"
//                                 ? "bg-gray-100 text-gray-800"
//                                 : challenge.status === "completed"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {challenge.status}
//                           </span>
//                         </div>

//                         <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                           {challenge.description}
//                         </p>

//                         <div className="space-y-2 mb-4">
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Users className="h-4 w-4 mr-2" />
//                             <span>
//                               {challenge.participants_count || 0} participants
//                             </span>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Upload className="h-4 w-4 mr-2" />
//                             <span>
//                               {challenge.submissions_count || 0} submissions
//                             </span>
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Clock className="h-4 w-4 mr-2" />
//                             <span>
//                               {challenge.pending_submissions || 0} pending
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <div className="flex space-x-1">
//                             <button
//                               onClick={() => openChallengeDetails(challenge)}
//                               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
//                               title="View Details"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setEditChallenge(challenge);
//                                 setEditChallengeModal(true);
//                               }}
//                               className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-lg"
//                               title="Edit"
//                             >
//                               <Edit3 className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => openSubmissions(challenge)}
//                               className="p-2 text-gray-500 hover:text-purple-600 hover:bg-gray-100 rounded-lg"
//                               title="View Submissions"
//                             >
//                               <Upload className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => openParticipants(challenge)}
//                               className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
//                               title="View Participants"
//                             >
//                               <Users className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => openAnalytics(challenge)}
//                               className="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-100 rounded-lg"
//                               title="Analytics"
//                             >
//                               <BarChart3 className="h-4 w-4" />
//                             </button>
//                           </div>

//                           <div className="flex space-x-2">
//                             <select
//                               value={challenge.status}
//                               onChange={(e) =>
//                                 handleStatusChange(challenge.id, e.target.value)
//                               }
//                               className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//                             >
//                               <option value="draft">Draft</option>
//                               <option value="active">Active</option>
//                               <option value="completed">Completed</option>
//                               <option value="ended">Ended</option>
//                             </select>
//                             <button
//                               onClick={() =>
//                                 handleDeleteChallenge(challenge.id)
//                               }
//                               className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
//                               title="Delete"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {pagination.pages > 1 && (
//                   <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
//                     <div className="flex items-center">
//                       <p className="text-sm text-gray-700">
//                         Page {pagination.page} of {pagination.pages} (
//                         {pagination.total} total)
//                       </p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//                         disabled={page === 1}
//                         className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Previous
//                       </button>
//                       <button
//                         onClick={() =>
//                           setPage((prev) =>
//                             Math.min(pagination.pages, prev + 1)
//                           )
//                         }
//                         disabled={page === pagination.pages}
//                         className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/* Pending Submissions Tab */}
//         {activeTab === "pending-submissions" && (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow-sm">
//               <div className="p-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Pending Submissions
//                 </h2>
//               </div>
//               {loading ? (
//                 <div className="flex justify-center py-12">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//               ) : pendingSubmissions.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-500">No pending submissions found</p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-200">
//                   {pendingSubmissions.map((submission) => (
//                     <div key={submission.id} className="p-4 hover:bg-gray-50">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                           <img
//                             src={submission.profile_image_url}
//                             alt={submission.username}
//                             className="h-10 w-10 rounded-full object-cover"
//                             onError={(e) => {
//                               e.target.src = "/default-avatar.png";
//                             }}
//                           />
//                           <div>
//                             <h3 className="font-medium text-gray-900">
//                               {submission.title}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               by {submission.username} •{" "}
//                               {new Date(
//                                 submission.submitted_at
//                               ).toLocaleDateString()}
//                             </p>
//                             <p className="text-sm text-gray-600 mt-1">
//                               {submission.challenge_title}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openSubmissionDetail(submission)}
//                             className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
//                           >
//                             Review
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleApproveSubmission(submission.id)
//                             }
//                             className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
//                           >
//                             Quick Approve
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Modals */}

//         {/* Create Challenge Modal */}
//         {createChallengeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Create New Challenge
//                   </h2>
//                   <button
//                     onClick={() => setCreateChallengeModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     value={newChallenge.title}
//                     onChange={(e) =>
//                       setNewChallenge({
//                         ...newChallenge,
//                         title: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={newChallenge.description}
//                     onChange={(e) =>
//                       setNewChallenge({
//                         ...newChallenge,
//                         description: e.target.value,
//                       })
//                     }
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Dance Style
//                     </label>
//                     <input
//                       type="text"
//                       value={newChallenge.dance_style}
//                       onChange={(e) =>
//                         setNewChallenge({
//                           ...newChallenge,
//                           dance_style: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Dance Level
//                     </label>
//                     <select
//                       value={newChallenge.dance_level}
//                       onChange={(e) =>
//                         setNewChallenge({
//                           ...newChallenge,
//                           dance_level: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Select Level</option>
//                       <option value="Beginner">Beginner</option>
//                       <option value="Intermediate">Intermediate</option>
//                       <option value="Advanced">Advanced</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       value={newChallenge.start_date}
//                       onChange={(e) =>
//                         setNewChallenge({
//                           ...newChallenge,
//                           start_date: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={newChallenge.end_date}
//                       onChange={(e) =>
//                         setNewChallenge({
//                           ...newChallenge,
//                           end_date: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Prize Details
//                   </label>
//                   <input
//                     type="text"
//                     value={newChallenge.prize_details}
//                     onChange={(e) =>
//                       setNewChallenge({
//                         ...newChallenge,
//                         prize_details: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Max Participants
//                   </label>
//                   <input
//                     type="number"
//                     value={newChallenge.max_participants}
//                     onChange={(e) =>
//                       setNewChallenge({
//                         ...newChallenge,
//                         max_participants: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   onClick={() => setCreateChallengeModal(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCreateChallenge}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Create Challenge
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit Challenge Modal */}
//         {editChallengeModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Edit Challenge
//                   </h2>
//                   <button
//                     onClick={() => setEditChallengeModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     value={editChallenge.title || ""}
//                     onChange={(e) =>
//                       setEditChallenge({
//                         ...editChallenge,
//                         title: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={editChallenge.description || ""}
//                     onChange={(e) =>
//                       setEditChallenge({
//                         ...editChallenge,
//                         description: e.target.value,
//                       })
//                     }
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Dance Style
//                     </label>
//                     <input
//                       type="text"
//                       value={editChallenge.dance_style || ""}
//                       onChange={(e) =>
//                         setEditChallenge({
//                           ...editChallenge,
//                           dance_style: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Dance Level
//                     </label>
//                     <select
//                       value={editChallenge.dance_level || ""}
//                       onChange={(e) =>
//                         setEditChallenge({
//                           ...editChallenge,
//                           dance_level: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Select Level</option>
//                       <option value="Beginner">Beginner</option>
//                       <option value="Intermediate">Intermediate</option>
//                       <option value="Advanced">Advanced</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Prize Details
//                   </label>
//                   <input
//                     type="text"
//                     value={editChallenge.prize_details || ""}
//                     onChange={(e) =>
//                       setEditChallenge({
//                         ...editChallenge,
//                         prize_details: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Max Participants
//                   </label>
//                   <input
//                     type="number"
//                     value={editChallenge.max_participants || ""}
//                     onChange={(e) =>
//                       setEditChallenge({
//                         ...editChallenge,
//                         max_participants: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//                 <button
//                   onClick={() => setEditChallengeModal(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdateChallenge}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Update Challenge
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Challenge Details Modal */}
//         {challengeDetailsModal && selectedChallenge && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Challenge Details
//                   </h2>
//                   <button
//                     onClick={() => setChallengeDetailsModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div>
//                     {selectedChallenge.image_url && (
//                       <img
//                         src={selectedChallenge.image_url}
//                         alt={selectedChallenge.title}
//                         className="w-full h-64 object-cover rounded-lg mb-4"
//                       />
//                     )}
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                       {selectedChallenge.title}
//                     </h3>
//                     <p className="text-gray-600 mb-4">
//                       {selectedChallenge.description}
//                     </p>

//                     <div className="space-y-2">
//                       <div className="flex items-center text-sm">
//                         <Calendar className="h-4 w-4 mr-2 text-gray-400" />
//                         <span className="text-gray-600">
//                           {new Date(
//                             selectedChallenge.start_date
//                           ).toLocaleDateString()}{" "}
//                           -{" "}
//                           {new Date(
//                             selectedChallenge.end_date
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="flex items-center text-sm">
//                         <Award className="h-4 w-4 mr-2 text-gray-400" />
//                         <span className="text-gray-600">
//                           {selectedChallenge.prize_details}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <h4 className="font-semibold text-gray-900 mb-3">
//                         Challenge Statistics
//                       </h4>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-blue-600">
//                             {selectedChallenge.participants_count || 0}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Participants
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-green-600">
//                             {selectedChallenge.submissions_count || 0}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Submissions
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-yellow-600">
//                             {selectedChallenge.pending_submissions || 0}
//                           </div>
//                           <div className="text-sm text-gray-600">Pending</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-purple-600">
//                             {selectedChallenge.max_participants || "Unlimited"}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Max Participants
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-4 space-y-2">
//                       <div>
//                         <span className="font-medium">Dance Style:</span>{" "}
//                         {selectedChallenge.dance_style}
//                       </div>
//                       <div>
//                         <span className="font-medium">Level:</span>{" "}
//                         {selectedChallenge.dance_level}
//                       </div>
//                       <div>
//                         <span className="font-medium">Type:</span>{" "}
//                         {selectedChallenge.challenger_type}
//                       </div>
//                       <div>
//                         <span className="font-medium">Status:</span>
//                         <span
//                           className={`ml-2 px-2 py-1 rounded-full text-xs ${
//                             selectedChallenge.status === "active"
//                               ? "bg-green-100 text-green-800"
//                               : selectedChallenge.status === "draft"
//                               ? "bg-gray-100 text-gray-800"
//                               : selectedChallenge.status === "completed"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {selectedChallenge.status}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Submissions Modal */}
//         {submissionsModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Submissions for "{selectedChallenge?.title}"
//                   </h2>
//                   <button
//                     onClick={() => setSubmissionsModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {submissions.length === 0 ? (
//                   <div className="text-center py-12">
//                     <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500">No submissions found</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {submissions.map((submission) => (
//                       <div
//                         key={submission.id}
//                         className="bg-gray-50 rounded-lg p-4"
//                       >
//                         <div className="flex items-center space-x-3 mb-3">
//                           <img
//                             src={submission.profile_image_url}
//                             alt={submission.username}
//                             className="h-8 w-8 rounded-full object-cover"
//                             onError={(e) => {
//                               e.target.src = "/default-avatar.png";
//                             }}
//                           />
//                           <div>
//                             <div className="font-medium text-sm">
//                               {submission.username}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {new Date(
//                                 submission.submitted_at
//                               ).toLocaleDateString()}
//                             </div>
//                           </div>
//                         </div>

//                         <h4 className="font-semibold mb-2">
//                           {submission.title}
//                         </h4>
//                         <p className="text-sm text-gray-600 mb-3">
//                           {submission.description}
//                         </p>

//                         <div className="flex items-center justify-between mb-3">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs ${
//                               submission.status === "approved"
//                                 ? "bg-green-100 text-green-800"
//                                 : submission.status === "pending"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-red-100 text-red-800"
//                             }`}
//                           >
//                             {submission.status}
//                           </span>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <ThumbsUp className="h-3 w-3 mr-1" />
//                             <span>{submission.likes_count}</span>
//                             <MessageSquare className="h-3 w-3 ml-3 mr-1" />
//                             <span>{submission.comments_count}</span>
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => openSubmissionDetail(submission)}
//                           className="w-full px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100"
//                         >
//                           View Details
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Participants Modal */}
//         {participantsModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Participants for "{selectedChallenge?.title}"
//                   </h2>
//                   <button
//                     onClick={() => setParticipantsModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {participants.length === 0 ? (
//                   <div className="text-center py-12">
//                     <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500">No participants found</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {participants.map((participant) => (
//                       <div
//                         key={participant.user_id}
//                         className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                       >
//                         <div className="flex items-center space-x-4">
//                           <img
//                             src={participant.profile_image_url}
//                             alt={participant.username}
//                             className="h-12 w-12 rounded-full object-cover"
//                             onError={(e) => {
//                               e.target.src = "/default-avatar.png";
//                             }}
//                           />
//                           <div>
//                             <div className="font-medium">
//                               {participant.username}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {participant.email}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               Joined:{" "}
//                               {new Date(
//                                 participant.joined_at
//                               ).toLocaleDateString()}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center space-x-4">
//                           <div className="text-center">
//                             <div className="text-lg font-semibold">
//                               {participant.submissions_count}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Submissions
//                             </div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-lg font-semibold">
//                               {participant.approved_submissions}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Approved
//                             </div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-lg font-semibold">
//                               {parseFloat(
//                                 participant.completion_percentage
//                               ).toFixed(0)}
//                               %
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Progress
//                             </div>
//                           </div>
//                           <button
//                             onClick={() =>
//                               handleRemoveParticipant(
//                                 selectedChallenge.id,
//                                 participant.user_id
//                               )
//                             }
//                             className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
//                             title="Remove Participant"
//                           >
//                             <UserMinus className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Analytics Modal */}
//         {analyticsModal && analytics && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Analytics for "{selectedChallenge?.title}"
//                   </h2>
//                   <button
//                     onClick={() => setAnalyticsModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                   <div className="bg-blue-50 p-4 rounded-lg text-center">
//                     <div className="text-2xl font-bold text-blue-600">
//                       {analytics.analytics.total_participants}
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Total Participants
//                     </div>
//                   </div>
//                   <div className="bg-green-50 p-4 rounded-lg text-center">
//                     <div className="text-2xl font-bold text-green-600">
//                       {analytics.analytics.total_submissions}
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Total Submissions
//                     </div>
//                   </div>
//                   <div className="bg-yellow-50 p-4 rounded-lg text-center">
//                     <div className="text-2xl font-bold text-yellow-600">
//                       {analytics.analytics.pending_submissions}
//                     </div>
//                     <div className="text-sm text-gray-600">Pending Review</div>
//                   </div>
//                   <div className="bg-purple-50 p-4 rounded-lg text-center">
//                     <div className="text-2xl font-bold text-purple-600">
//                       {analytics.analytics.total_likes}
//                     </div>
//                     <div className="text-sm text-gray-600">Total Likes</div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold mb-4">Submission Status</h3>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span>Approved:</span>
//                         <span className="font-medium text-green-600">
//                           {analytics.analytics.approved_submissions}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Rejected:</span>
//                         <span className="font-medium text-red-600">
//                           {analytics.analytics.rejected_submissions}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Pending:</span>
//                         <span className="font-medium text-yellow-600">
//                           {analytics.analytics.pending_submissions}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold mb-4">Engagement</h3>
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span>Total Comments:</span>
//                         <span className="font-medium">
//                           {analytics.analytics.total_comments}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Average Likes per Submission:</span>
//                         <span className="font-medium">
//                           {parseFloat(
//                             analytics.analytics.avg_likes_per_submission
//                           ).toFixed(1)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Submission Detail Modal */}
//         {submissionDetailModal && selectedSubmission && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Review Submission
//                   </h2>
//                   <button
//                     onClick={() => setSubmissionDetailModal(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="mb-6">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <img
//                       src={selectedSubmission.profile_image_url}
//                       alt={selectedSubmission.username}
//                       className="h-12 w-12 rounded-full object-cover"
//                       onError={(e) => {
//                         e.target.src = "/default-avatar.png";
//                       }}
//                     />
//                     <div>
//                       <div className="font-medium">
//                         {selectedSubmission.username}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Submitted:{" "}
//                         {new Date(
//                           selectedSubmission.submitted_at
//                         ).toLocaleString()}
//                       </div>
//                     </div>
//                   </div>

//                   <h3 className="text-lg font-semibold mb-2">
//                     {selectedSubmission.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4">
//                     {selectedSubmission.description}
//                   </p>

//                   {selectedSubmission.video_url && (
//                     <div className="mb-4">
//                       <video
//                         controls
//                         className="w-full max-h-64 rounded-lg"
//                         src={selectedSubmission.video_url}
//                       >
//                         Your browser does not support the video tag.
//                       </video>
//                     </div>
//                   )}

//                   <div className="flex items-center space-x-4 text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <ThumbsUp className="h-4 w-4 mr-1" />
//                       <span>{selectedSubmission.likes_count} likes</span>
//                     </div>
//                     <div className="flex items-center">
//                       <MessageSquare className="h-4 w-4 mr-1" />
//                       <span>{selectedSubmission.comments_count} comments</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Admin Feedback
//                   </label>
//                   <textarea
//                     value={feedbackText}
//                     onChange={(e) => setFeedbackText(e.target.value)}
//                     rows={3}
//                     placeholder="Add your feedback here..."
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() =>
//                       handleDeleteSubmission(selectedSubmission.id)
//                     }
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleRejectSubmission(selectedSubmission.id)
//                     }
//                     className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//                   >
//                     Reject
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleApproveSubmission(selectedSubmission.id)
//                     }
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                   >
//                     Approve
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChallengePage;
import React, { useEffect, useState } from "react";
import {
  Play,
  Eye,
  Edit3,
  Trash2,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  UserMinus,
  MessageSquare,
  ThumbsUp,
  Upload,
  Calendar,
  Award,
  Plus,
  Search,
  Filter,
  X,
  AlertCircle,
  Download,
  Settings,
} from "lucide-react";
import "./ChallengePage.css";

// Import your services
import {
  createChallengeService,
  getAllChallengesService,
  getChallengeDetailsService,
  updateChallengeService,
  deleteChallengeService,
  updateChallengeStatusService,
  getChallengeSubmissionsService,
  getPendingSubmissionsService,
  getSubmissionDetailsService,
  approveSubmissionService,
  rejectSubmissionService,
  deleteSubmissionService,
  getChallengeParticipantsService,
  removeParticipantService,
  getChallengeAnalyticsService,
  deleteCommentService,
} from "../../../services/challenge.service";

const ChallengePage = () => {
  // State for challenges
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("challenges");

  // Modal states
  const [challengeDetailsModal, setChallengeDetailsModal] = useState(false);
  const [createChallengeModal, setCreateChallengeModal] = useState(false);
  const [editChallengeModal, setEditChallengeModal] = useState(false);
  const [submissionsModal, setSubmissionsModal] = useState(false);
  const [participantsModal, setParticipantsModal] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [submissionDetailModal, setSubmissionDetailModal] = useState(false);

  // Data states
  const [submissions, setSubmissions] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Form states
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    challenger_type: "public",
    description: "",
    image_url: "",
    dance_style: "",
    dance_level: "",
    start_date: "",
    end_date: "",
    prize_details: "",
    max_participants: "",
    status: "draft",
    is_trending: false,
    tasks: [{ task_type: "watch_video", task_title: "", video_url: "" }],
  });

  const [editChallenge, setEditChallenge] = useState({});
  const [feedbackText, setFeedbackText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load initial data
  useEffect(() => {
    fetchChallenges();
    if (activeTab === "pending-submissions") {
      fetchPendingSubmissions();
    }
  }, [page, activeTab]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await getAllChallengesService(page, 20);
      setChallenges(response.challenges || []);
      setPagination(response.pagination || {});
    } catch (error) {
      setError("Failed to fetch challenges");
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getPendingSubmissionsService(page, 20);
      setPendingSubmissions(response.submissions || []);
    } catch (error) {
      setError("Failed to fetch pending submissions");
    } finally {
      setLoading(false);
    }
  };

  const openChallengeDetails = async (challenge) => {
    try {
      const response = await getChallengeDetailsService(challenge.id);
      setSelectedChallenge(response || challenge);
      setChallengeDetailsModal(true);
    } catch (error) {
      setError("Failed to fetch challenge details");
    }
  };

  const openSubmissions = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const response = await getChallengeSubmissionsService(challenge.id);
      setSubmissions(response.submissions || []);
      setSubmissionsModal(true);
    } catch (error) {
      setError("Failed to fetch submissions");
    }
  };

  const openParticipants = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const response = await getChallengeParticipantsService(challenge.id);
      setParticipants(response.participants || []);
      setParticipantsModal(true);
    } catch (error) {
      setError("Failed to fetch participants");
    }
  };

  const openAnalytics = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const response = await getChallengeAnalyticsService(challenge.id);
      setAnalytics(response);
      setAnalyticsModal(true);
    } catch (error) {
      setError("Failed to fetch analytics");
    }
  };

  const openSubmissionDetail = async (submission) => {
    try {
      const response = await getSubmissionDetailsService(submission.id);
      setSelectedSubmission(response || submission);
      setSubmissionDetailModal(true);
    } catch (error) {
      setError("Failed to fetch submission details");
    }
  };

  const handleApproveSubmission = async (submissionId) => {
    try {
      await approveSubmissionService(submissionId, feedbackText);
      setSuccess("Submission approved successfully");
      setFeedbackText("");
      setSubmissionDetailModal(false);
      fetchPendingSubmissions();
    } catch (error) {
      setError("Failed to approve submission");
    }
  };

  const handleRejectSubmission = async (submissionId) => {
    try {
      await rejectSubmissionService(submissionId, feedbackText);
      setSuccess("Submission rejected");
      setFeedbackText("");
      setSubmissionDetailModal(false);
      fetchPendingSubmissions();
    } catch (error) {
      setError("Failed to reject submission");
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await deleteSubmissionService(submissionId);
        setSuccess("Submission deleted successfully");
        setSubmissionDetailModal(false);
        fetchPendingSubmissions();
      } catch (error) {
        setError("Failed to delete submission");
      }
    }
  };

  const handleRemoveParticipant = async (challengeId, userId) => {
    if (window.confirm("Are you sure you want to remove this participant?")) {
      try {
        await removeParticipantService(challengeId, userId);
        setSuccess("Participant removed successfully");
        openParticipants(selectedChallenge);
      } catch (error) {
        setError("Failed to remove participant");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteCommentService(commentId);
        setSuccess("Comment deleted successfully");
        // Refresh the submission details if needed
        if (selectedSubmission) {
          openSubmissionDetail(selectedSubmission);
        }
      } catch (error) {
        setError("Failed to delete comment");
      }
    }
  };

  const handleCreateChallenge = async () => {
    try {
      await createChallengeService(newChallenge);
      setSuccess("Challenge created successfully");
      setCreateChallengeModal(false);
      setNewChallenge({
        title: "",
        challenger_type: "public",
        description: "",
        image_url: "",
        dance_style: "",
        dance_level: "",
        start_date: "",
        end_date: "",
        prize_details: "",
        max_participants: "",
        status: "draft",
        is_trending: false,
        tasks: [{ task_type: "watch_video", task_title: "", video_url: "" }],
      });
      fetchChallenges();
    } catch (error) {
      setError("Failed to create challenge");
    }
  };

  const handleUpdateChallenge = async () => {
    try {
      await updateChallengeService(editChallenge.id, editChallenge);
      setSuccess("Challenge updated successfully");
      setEditChallengeModal(false);
      fetchChallenges();
    } catch (error) {
      setError("Failed to update challenge");
    }
  };

  const handleStatusChange = async (challengeId, newStatus) => {
    try {
      await updateChallengeStatusService(challengeId, newStatus);
      setSuccess("Challenge status updated");
      fetchChallenges();
    } catch (error) {
      setError("Failed to update challenge status");
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      try {
        await deleteChallengeService(challengeId);
        setSuccess("Challenge deleted successfully");
        fetchChallenges();
      } catch (error) {
        setError("Failed to delete challenge");
      }
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const matchSearch = challenge.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter ? challenge.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  // Alert Component
  const Alert = ({ type, message, onClose }) => (
    <div className={`alert ${type}`}>
      <div className="alert-content">
        <AlertCircle className="alert-icon" />
        <span>{message}</span>
        <button onClick={onClose} className="alert-close">
          <X className="close-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="challenge-page">
      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="challenge-content">
        <div className="challenge-header">
          <h1 className="page-title">Challenge Management</h1>
          <p className="page-description">
            Manage challenges, submissions, and participants
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <nav className="tab-nav">
            {[
              { id: "challenges", label: "Challenges", icon: Award },
              {
                id: "pending-submissions",
                label: "Pending Submissions",
                icon: Clock,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              >
                <tab.icon className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <div className="tab-content">
            {/* Filters and Create Button */}
            <div className="filters-section">
              <div className="filters-container">
                <div className="filters-left">
                  <div className="search-container">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search challenges..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-filter"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <button
                  onClick={() => setCreateChallengeModal(true)}
                  className="create-button"
                >
                  <Plus className="button-icon" />
                  <span>Create Challenge</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <>
                {/* Challenges Grid */}
                <div className="challenges-grid">
                  {filteredChallenges.map((challenge) => (
                    <div key={challenge.id} className="challenge-card">
                      {challenge.image_url && (
                        <img
                          src={challenge.image_url}
                          alt={challenge.title}
                          className="challenge-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="challenge-content-area">
                        <div className="challenge-header-info">
                          <h3 className="challenge-title">{challenge.title}</h3>
                          <span className={`status-badge ${challenge.status}`}>
                            {challenge.status}
                          </span>
                        </div>

                        <p className="challenge-description">
                          {challenge.description}
                        </p>

                        <div className="challenge-stats">
                          <div className="stat-item">
                            <Users className="stat-icon" />
                            <span>
                              {challenge.participants_count || 0} participants
                            </span>
                          </div>
                          <div className="stat-item">
                            <Upload className="stat-icon" />
                            <span>
                              {challenge.submissions_count || 0} submissions
                            </span>
                          </div>
                          <div className="stat-item">
                            <Clock className="stat-icon" />
                            <span>
                              {challenge.pending_submissions || 0} pending
                            </span>
                          </div>
                        </div>

                        <div className="challenge-actions">
                          <div className="action-buttons">
                            <button
                              onClick={() => openChallengeDetails(challenge)}
                              className="action-btn"
                              title="View Details"
                            >
                              <Eye className="action-icon" />
                            </button>
                            <button
                              onClick={() => {
                                setEditChallenge(challenge);
                                setEditChallengeModal(true);
                              }}
                              className="action-btn"
                              title="Edit"
                            >
                              <Edit3 className="action-icon" />
                            </button>
                            <button
                              onClick={() => openSubmissions(challenge)}
                              className="action-btn"
                              title="View Submissions"
                            >
                              <Upload className="action-icon" />
                            </button>
                            <button
                              onClick={() => openParticipants(challenge)}
                              className="action-btn"
                              title="View Participants"
                            >
                              <Users className="action-icon" />
                            </button>
                            <button
                              onClick={() => openAnalytics(challenge)}
                              className="action-btn"
                              title="Analytics"
                            >
                              <BarChart3 className="action-icon" />
                            </button>
                          </div>

                          <div className="challenge-controls">
                            <select
                              value={challenge.status}
                              onChange={(e) =>
                                handleStatusChange(challenge.id, e.target.value)
                              }
                              className="status-select"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="ended">Ended</option>
                            </select>
                            <button
                              onClick={() =>
                                handleDeleteChallenge(challenge.id)
                              }
                              className="delete-btn"
                              title="Delete"
                            >
                              <Trash2 className="action-icon" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <div className="pagination-info">
                      <p>
                        Page {pagination.page} of {pagination.pages} (
                        {pagination.total} total)
                      </p>
                    </div>
                    <div className="pagination-controls">
                      <button
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setPage((prev) =>
                            Math.min(pagination.pages, prev + 1)
                          )
                        }
                        disabled={page === pagination.pages}
                        className="pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Pending Submissions Tab */}
        {activeTab === "pending-submissions" && (
          <div className="tab-content">
            <div className="submissions-container">
              <div className="submissions-header">
                <h2 className="submissions-title">Pending Submissions</h2>
              </div>
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              ) : pendingSubmissions.length === 0 ? (
                <div className="empty-state">
                  <Clock className="empty-icon" />
                  <p className="empty-text">No pending submissions found</p>
                </div>
              ) : (
                <div className="submissions-list">
                  {pendingSubmissions.map((submission) => (
                    <div key={submission.id} className="submission-item">
                      <div className="submission-info">
                        <img
                          src={
                            submission.profile_image_url ||
                            "/default-avatar.png"
                          }
                          alt={submission.username}
                          className="submission-avatar"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                        <div className="submission-details">
                          <h3 className="submission-title">
                            {submission.title}
                          </h3>
                          <p className="submission-meta">
                            by {submission.username} •{" "}
                            {new Date(
                              submission.submitted_at
                            ).toLocaleDateString()}
                          </p>
                          <p className="submission-challenge">
                            {submission.challenge_title}
                          </p>
                        </div>
                      </div>
                      <div className="submission-actions">
                        <button
                          onClick={() => openSubmissionDetail(submission)}
                          className="review-btn"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleApproveSubmission(submission.id)}
                          className="approve-btn"
                        >
                          Quick Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}

        {/* Create Challenge Modal */}
        {createChallengeModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">Create New Challenge</h2>
                <button
                  onClick={() => setCreateChallengeModal(false)}
                  className="modal-close"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={newChallenge.title}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        title: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={newChallenge.description}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="form-textarea"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Dance Style</label>
                    <input
                      type="text"
                      value={newChallenge.dance_style}
                      onChange={(e) =>
                        setNewChallenge({
                          ...newChallenge,
                          dance_style: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dance Level</label>
                    <select
                      value={newChallenge.dance_level}
                      onChange={(e) =>
                        setNewChallenge({
                          ...newChallenge,
                          dance_level: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={newChallenge.start_date}
                      onChange={(e) =>
                        setNewChallenge({
                          ...newChallenge,
                          start_date: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      value={newChallenge.end_date}
                      onChange={(e) =>
                        setNewChallenge({
                          ...newChallenge,
                          end_date: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Prize Details</label>
                  <input
                    type="text"
                    value={newChallenge.prize_details}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        prize_details: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Participants</label>
                  <input
                    type="number"
                    value={newChallenge.max_participants}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        max_participants: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    value={newChallenge.image_url}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        image_url: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Challenge Type</label>
                  <select
                    value={newChallenge.challenger_type}
                    onChange={(e) =>
                      setNewChallenge({
                        ...newChallenge,
                        challenger_type: e.target.value,
                      })
                    }
                    className="form-select"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={newChallenge.is_trending}
                      onChange={(e) =>
                        setNewChallenge({
                          ...newChallenge,
                          is_trending: e.target.checked,
                        })
                      }
                    />
                    <span>Mark as Trending</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setCreateChallengeModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button onClick={handleCreateChallenge} className="btn-primary">
                  Create Challenge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Challenge Modal */}
        {editChallengeModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">Edit Challenge</h2>
                <button
                  onClick={() => setEditChallengeModal(false)}
                  className="modal-close"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={editChallenge.title || ""}
                    onChange={(e) =>
                      setEditChallenge({
                        ...editChallenge,
                        title: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={editChallenge.description || ""}
                    onChange={(e) =>
                      setEditChallenge({
                        ...editChallenge,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="form-textarea"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Dance Style</label>
                    <input
                      type="text"
                      value={editChallenge.dance_style || ""}
                      onChange={(e) =>
                        setEditChallenge({
                          ...editChallenge,
                          dance_style: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dance Level</label>
                    <select
                      value={editChallenge.dance_level || ""}
                      onChange={(e) =>
                        setEditChallenge({
                          ...editChallenge,
                          dance_level: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Prize Details</label>
                  <input
                    type="text"
                    value={editChallenge.prize_details || ""}
                    onChange={(e) =>
                      setEditChallenge({
                        ...editChallenge,
                        prize_details: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Participants</label>
                  <input
                    type="number"
                    value={editChallenge.max_participants || ""}
                    onChange={(e) =>
                      setEditChallenge({
                        ...editChallenge,
                        max_participants: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    value={editChallenge.image_url || ""}
                    onChange={(e) =>
                      setEditChallenge({
                        ...editChallenge,
                        image_url: e.target.value,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={editChallenge.is_trending || false}
                      onChange={(e) =>
                        setEditChallenge({
                          ...editChallenge,
                          is_trending: e.target.checked,
                        })
                      }
                    />
                    <span>Mark as Trending</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setEditChallengeModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button onClick={handleUpdateChallenge} className="btn-primary">
                  Update Challenge
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Details Modal */}
        {challengeDetailsModal && selectedChallenge && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h2 className="modal-title">Challenge Details</h2>
                <button
                  onClick={() => setChallengeDetailsModal(false)}
                  className="modal-close"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                <div className="challenge-details">
                  <div className="details-left">
                    {selectedChallenge.image_url && (
                      <img
                        src={selectedChallenge.image_url}
                        alt={selectedChallenge.title}
                        className="details-image"
                      />
                    )}
                    <h3 className="details-title">{selectedChallenge.title}</h3>
                    <p className="details-description">
                      {selectedChallenge.description}
                    </p>

                    <div className="details-info">
                      <div className="info-item">
                        <Calendar className="info-icon" />
                        <span>
                          {new Date(
                            selectedChallenge.start_date
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            selectedChallenge.end_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="info-item">
                        <Award className="info-icon" />
                        <span>{selectedChallenge.dance_style}</span>
                      </div>
                      <div className="info-item">
                        <TrendingUp className="info-icon" />
                        <span>{selectedChallenge.dance_level}</span>
                      </div>
                      {selectedChallenge.prize_details && (
                        <div className="info-item">
                          <Award className="info-icon" />
                          <span>{selectedChallenge.prize_details}</span>
                        </div>
                      )}
                      <div className="info-item">
                        <Users className="info-icon" />
                        <span>
                          Max:{" "}
                          {selectedChallenge.max_participants || "Unlimited"}{" "}
                          participants
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="details-right">
                    <div className="details-stats">
                      <div className="stat-card">
                        <Users className="stat-card-icon" />
                        <div className="stat-card-content">
                          <h4>{selectedChallenge.participants_count || 0}</h4>
                          <p>Participants</p>
                        </div>
                      </div>
                      <div className="stat-card">
                        <Upload className="stat-card-icon" />
                        <div className="stat-card-content">
                          <h4>{selectedChallenge.submissions_count || 0}</h4>
                          <p>Submissions</p>
                        </div>
                      </div>
                      <div className="stat-card">
                        <Clock className="stat-card-icon" />
                        <div className="stat-card-content">
                          <h4>{selectedChallenge.pending_submissions || 0}</h4>
                          <p>Pending</p>
                        </div>
                      </div>
                    </div>

                    {selectedChallenge.tasks &&
                      selectedChallenge.tasks.length > 0 && (
                        <div className="challenge-tasks">
                          <h4>Challenge Tasks</h4>
                          <div className="tasks-list">
                            {selectedChallenge.tasks.map((task, index) => (
                              <div key={index} className="task-item">
                                <div className="task-header">
                                  <span className="task-type">
                                    {task.task_type}
                                  </span>
                                  <span className="task-title">
                                    {task.task_title}
                                  </span>
                                </div>
                                {task.video_url && (
                                  <a
                                    href={task.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="task-video-link"
                                  >
                                    <Play className="play-icon" />
                                    Watch Video
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setChallengeDetailsModal(false)}
                  className="btn-cancel"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Modal */}
        {submissionsModal && selectedChallenge && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h2 className="modal-title">
                  Submissions - {selectedChallenge.title}
                </h2>
                <button
                  onClick={() => setSubmissionsModal(false)}
                  className="modal-close"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                {submissions.length === 0 ? (
                  <div className="empty-state">
                    <Upload className="empty-icon" />
                    <p className="empty-text">No submissions found</p>
                  </div>
                ) : (
                  <div className="submissions-grid">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="submission-card">
                        <div className="submission-header">
                          <img
                            src={
                              submission.profile_image_url ||
                              "/default-avatar.png"
                            }
                            alt={submission.username}
                            className="submission-user-avatar"
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                          <div className="submission-user-info">
                            <h4>{submission.username}</h4>
                            <p>
                              {new Date(
                                submission.submitted_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`submission-status ${submission.status}`}
                          >
                            {submission.status}
                          </span>
                        </div>

                        <div className="submission-content">
                          <h5>{submission.title}</h5>
                          {submission.description && (
                            <p className="submission-desc">
                              {submission.description}
                            </p>
                          )}

                          {submission.video_url && (
                            <div className="submission-video">
                              <a
                                href={submission.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-link"
                              >
                                <Play className="play-icon" />
                                Watch Submission
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="submission-actions">
                          <button
                            onClick={() => openSubmissionDetail(submission)}
                            className="view-detail-btn"
                          >
                            <Eye className="btn-icon" />
                            View Details
                          </button>
                          {submission.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApproveSubmission(submission.id)
                                }
                                className="approve-btn"
                              >
                                <CheckCircle className="btn-icon" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectSubmission(submission.id)
                                }
                                className="reject-btn"
                              >
                                <XCircle className="btn-icon" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteSubmission(submission.id)
                            }
                            className="delete-btn"
                          >
                            <Trash2 className="btn-icon" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setSubmissionsModal(false)}
                  className="btn-cancel"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants Modal */}
        {participantsModal && selectedChallenge && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h2 className="modal-title">
                  Participants - {selectedChallenge.title}
                </h2>
                <button
                  onClick={() => setParticipantsModal(false)}
                  className="modal-close"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                {participants.length === 0 ? (
                  <div className="empty-state">
                    <Users className="empty-icon" />
                    <p className="empty-text">No participants found</p>
                  </div>
                ) : (
                  <div className="participants-list">
                    {participants.map((participant) => (
                      <div
                        key={participant.user_id}
                        className="participant-item"
                      >
                        <div className="participant-info">
                          <img
                            src={
                              participant.profile_image_url ||
                              "/default-avatar.png"
                            }
                            alt={participant.username}
                            className="participant-avatar"
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                          <div className="participant-details">
                            <h4>{participant.username}</h4>
                            <p>{participant.email}</p>
                            <span className="join-date">
                              Joined:{" "}
                              {new Date(
                                participant.joined_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="participant-stats">
                          <div className="participant-stat">
                            <Upload className="stat-icon-small" />
                            <span>
                              {participant.submissions_count || 0} submissions
                            </span>
                          </div>
                          <div className="participant-stat">
                            <ThumbsUp className="stat-icon-small" />
                            <span>{participant.likes_received || 0} likes</span>
                          </div>
                        </div>

                        <div className="participant-actions">
                          <button
                            onClick={() =>
                              handleRemoveParticipant(
                                selectedChallenge.id,
                                participant.user_id
                              )
                            }
                            className="remove-participant-btn"
                          >
                            <UserMinus className="btn-icon" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setParticipantsModal(false)}
                  className="btn-cancel"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        {analyticsModal && selectedChallenge && analytics && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h2 className="modal-title">
                  Analytics - {selectedChallenge.title}
                </h2>
                <button
                  onClick={() => setAnalyticsModal(false)}
                  className="modal-close"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                <div className="analytics-container">
                  <div className="analytics-overview">
                    <div className="analytics-card">
                      <div className="analytics-card-header">
                        <h3>Overview</h3>
                        <BarChart3 className="analytics-icon" />
                      </div>
                      <div className="analytics-stats-grid">
                        <div className="analytics-stat">
                          <span className="stat-value">
                            {analytics.total_participants || 0}
                          </span>
                          <span className="stat-label">Total Participants</span>
                        </div>
                        <div className="analytics-stat">
                          <span className="stat-value">
                            {analytics.total_submissions || 0}
                          </span>
                          <span className="stat-label">Total Submissions</span>
                        </div>
                        <div className="analytics-stat">
                          <span className="stat-value">
                            {analytics.approved_submissions || 0}
                          </span>
                          <span className="stat-label">Approved</span>
                        </div>
                        <div className="analytics-stat">
                          <span className="stat-value">
                            {analytics.pending_submissions || 0}
                          </span>
                          <span className="stat-label">Pending</span>
                        </div>
                        <div className="analytics-stat">
                          <span className="stat-value">
                            {analytics.total_likes || 0}
                          </span>
                          <span className="stat-label">Total Likes</span>
                        </div>
                        <div className="analytics-stat">
                          <span className="stat-value">
                            {analytics.total_comments || 0}
                          </span>
                          <span className="stat-label">Total Comments</span>
                        </div>
                      </div>
                    </div>

                    {analytics.top_performers &&
                      analytics.top_performers.length > 0 && (
                        <div className="analytics-card">
                          <div className="analytics-card-header">
                            <h3>Top Performers</h3>
                            <Award className="analytics-icon" />
                          </div>
                          <div className="top-performers-list">
                            {analytics.top_performers.map(
                              (performer, index) => (
                                <div
                                  key={performer.user_id}
                                  className="top-performer-item"
                                >
                                  <div className="performer-rank">
                                    #{index + 1}
                                  </div>
                                  <img
                                    src={
                                      performer.profile_image_url ||
                                      "/default-avatar.png"
                                    }
                                    alt={performer.username}
                                    className="performer-avatar"
                                    onError={(e) => {
                                      e.target.src = "/default-avatar.png";
                                    }}
                                  />
                                  <div className="performer-info">
                                    <span className="performer-name">
                                      {performer.username}
                                    </span>
                                    <span className="performer-stats">
                                      {performer.likes_count} likes •{" "}
                                      {performer.submissions_count} submissions
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {analytics.engagement_metrics && (
                      <div className="analytics-card">
                        <div className="analytics-card-header">
                          <h3>Engagement Metrics</h3>
                          <TrendingUp className="analytics-icon" />
                        </div>
                        <div className="engagement-metrics">
                          <div className="metric-item">
                            <span className="metric-label">
                              Average Likes per Submission
                            </span>
                            <span className="metric-value">
                              {analytics.engagement_metrics
                                .avg_likes_per_submission || 0}
                            </span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">
                              Average Comments per Submission
                            </span>
                            <span className="metric-value">
                              {analytics.engagement_metrics
                                .avg_comments_per_submission || 0}
                            </span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">
                              Participation Rate
                            </span>
                            <span className="metric-value">
                              {analytics.engagement_metrics
                                .participation_rate || 0}
                              %
                            </span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">
                              Completion Rate
                            </span>
                            <span className="metric-value">
                              {analytics.engagement_metrics.completion_rate ||
                                0}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setAnalyticsModal(false)}
                  className="btn-cancel"
                >
                  Close
                </button>
                <button className="btn-primary">
                  <Download className="btn-icon" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submission Detail Modal */}
        {submissionDetailModal && selectedSubmission && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h2 className="modal-title">Submission Details</h2>
                <button
                  onClick={() => setSubmissionDetailModal(false)}
                  className="modal-close"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="modal-body">
                <div className="submission-detail">
                  <div className="submission-detail-header">
                    <img
                      src={
                        selectedSubmission.profile_image_url ||
                        "/default-avatar.png"
                      }
                      alt={selectedSubmission.username}
                      className="submission-detail-avatar"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div className="submission-detail-info">
                      <h3>{selectedSubmission.title}</h3>
                      <p>by {selectedSubmission.username}</p>
                      <span className="submission-date">
                        Submitted on{" "}
                        {new Date(
                          selectedSubmission.submitted_at
                        ).toLocaleDateString()}
                      </span>
                      <span
                        className={`submission-detail-status ${selectedSubmission.status}`}
                      >
                        {selectedSubmission.status}
                      </span>
                    </div>
                  </div>

                  <div className="submission-detail-content">
                    {selectedSubmission.description && (
                      <div className="detail-section">
                        <h4>Description</h4>
                        <p>{selectedSubmission.description}</p>
                      </div>
                    )}

                    {selectedSubmission.video_url && (
                      <div className="detail-section">
                        <h4>Video Submission</h4>
                        <div className="video-container">
                          <a
                            href={selectedSubmission.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="video-link-large"
                          >
                            <Play className="play-icon-large" />
                            <span>Watch Full Submission</span>
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="submission-detail-stats">
                      <div className="detail-stat">
                        <ThumbsUp className="stat-icon" />
                        <span>{selectedSubmission.likes_count || 0} likes</span>
                      </div>
                      <div className="detail-stat">
                        <MessageSquare className="stat-icon" />
                        <span>
                          {selectedSubmission.comments_count || 0} comments
                        </span>
                      </div>
                    </div>

                    {selectedSubmission.admin_feedback && (
                      <div className="detail-section">
                        <h4>Admin Feedback</h4>
                        <p className="admin-feedback">
                          {selectedSubmission.admin_feedback}
                        </p>
                      </div>
                    )}

                    {selectedSubmission.comments &&
                      selectedSubmission.comments.length > 0 && (
                        <div className="detail-section">
                          <h4>Comments</h4>
                          <div className="comments-list">
                            {selectedSubmission.comments.map((comment) => (
                              <div key={comment.id} className="comment-item">
                                <img
                                  src={
                                    comment.profile_image_url ||
                                    "/default-avatar.png"
                                  }
                                  alt={comment.username}
                                  className="comment-avatar"
                                  onError={(e) => {
                                    e.target.src = "/default-avatar.png";
                                  }}
                                />
                                <div className="comment-content">
                                  <div className="comment-header">
                                    <span className="comment-username">
                                      {comment.username}
                                    </span>
                                    <span className="comment-date">
                                      {new Date(
                                        comment.created_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="comment-text">
                                    {comment.comment_text}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
                                  className="comment-delete-btn"
                                  title="Delete Comment"
                                >
                                  <Trash2 className="btn-icon" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedSubmission.status === "pending" && (
                      <div className="detail-section">
                        <h4>Admin Actions</h4>
                        <div className="admin-actions">
                          <div className="feedback-input">
                            <label className="form-label">
                              Admin Feedback (Optional)
                            </label>
                            <textarea
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Add feedback for the user..."
                              rows={3}
                              className="form-textarea"
                            />
                          </div>
                          <div className="action-buttons-group">
                            <button
                              onClick={() =>
                                handleApproveSubmission(selectedSubmission.id)
                              }
                              className="approve-btn-large"
                            >
                              <CheckCircle className="btn-icon" />
                              Approve Submission
                            </button>
                            <button
                              onClick={() =>
                                handleRejectSubmission(selectedSubmission.id)
                              }
                              className="reject-btn-large"
                            >
                              <XCircle className="btn-icon" />
                              Reject Submission
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setSubmissionDetailModal(false)}
                  className="btn-cancel"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                  className="btn-danger"
                >
                  <Trash2 className="btn-icon" />
                  Delete Submission
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;
