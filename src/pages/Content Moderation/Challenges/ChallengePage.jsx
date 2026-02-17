import React, { useEffect, useState } from "react";
import GlobalLoader from "../../../components/common/GlobalLoader";
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

import { uploadMediaFile } from "../../../services/upload.service";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./ChallengePage.css";

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
  const [uploading, setUploading] = useState(false);

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
  });

  const [tasks, setTasks] = useState([
    { task_type: "watch_video", task_title: "", video_url: "" },
  ]);

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

  // Tasks management functions
  const addTask = () => {
    setTasks([
      ...tasks,
      { task_type: "watch_video", task_title: "", video_url: "" },
    ]);
  };

  const removeTask = (index) => {
    if (tasks.length > 1) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  };

  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  // File upload handler
  const handleFileUpload = async (event, fieldName, taskIndex = null) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileUrl = await uploadMediaFile(file);

      if (fieldName === "image_url") {
        setNewChallenge({ ...newChallenge, image_url: fileUrl });
      } else if (fieldName === "video_url" && taskIndex !== null) {
        updateTask(taskIndex, "video_url", fileUrl);
      }

      setSuccess("File uploaded successfully");
    } catch (error) {
      setError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const challengeData = {
        ...newChallenge,
        tasks: tasks.filter((task) => task.task_title.trim() !== ""),
      };

      await createChallengeService(challengeData);
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
      });
      setTasks([{ task_type: "watch_video", task_title: "", video_url: "" }]);
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
    <div
      className={`alert alert-${
        type === "error" ? "danger" : "success"
      } alert-dismissible fade show position-fixed`}
      style={{ top: "20px", right: "20px", zIndex: 2000, maxWidth: "400px" }}
    >
      <div className="d-flex align-items-center">
        <AlertCircle className="me-2" size={20} />
        <span>{message}</span>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
    </div>
  );

  return (
    <div
      className="container-fluid py-3 py-md-4"
      style={{
        marginLeft: "0",
        paddingLeft: "15px",
        paddingRight: "15px",
        background: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* Responsive wrapper for sidebar offset */}
      <div
        className="challenge-wrapper"
        style={{
          marginLeft: "0",
          paddingLeft: "0",
        }}
      >
        {/* Add responsive styles */}
        <style>{`
          @media (min-width: 992px) {
            .challenge-wrapper {
              margin-left: 280px !important;
              padding-left: 15px !important;
            }
          }
          
          @media (max-width: 991.98px) {
            .challenge-wrapper {
              margin-left: 0 !important;
              padding-left: 0 !important;
            }
          }
          
          .modal-dialog {
            max-width: 95vw;
            margin: 0.5rem auto;
          }
          
          @media (min-width: 576px) {
            .modal-dialog {
              max-width: 540px;
              margin: 1.75rem auto;
            }
          }
          
          @media (min-width: 992px) {
            .modal-lg {
              max-width: 800px;
            }
            .modal-xl {
              max-width: 1140px;
            }
          }
          
          .card-img-top {
            height: 200px;
            object-fit: cover;
          }
          
          @media (max-width: 767.98px) {
            .card-img-top {
              height: 150px;
            }
          }
          
          .btn-group-responsive {
            flex-wrap: wrap;
            gap: 0.25rem;
          }
          
          .btn-group-responsive .btn {
            flex: 0 0 auto;
            margin-bottom: 0.25rem;
          }
          
          @media (max-width: 575.98px) {
            .btn-group-responsive .btn {
              font-size: 0.75rem;
              padding: 0.25rem 0.5rem;
            }
            
            .btn-group-responsive .btn svg {
              width: 14px;
              height: 14px;
            }
          }
        `}</style>

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

        {/* <div className="challenge-page">
  <div className="challenge-bg">
    <div className="challenge-content">
      {/* yahin tumhara pura Challenge UI rahega */}
    {/* </div>
  </div>
</div> // */}


        <div className="challenge-content">
          <div className="text-center mb-4 mb-md-5">
            <h1 className="text-dark fw-bold display-6 display-md-4 mb-2">
              Challenge Management
            </h1>
            <p className="text-secondary fs-6 fs-md-5">
              Manage challenges, submissions, and participants
            </p>
          </div>
          {/* Tab Navigation */}
          <div className="card mb-4 bg-transparent border-light">
            <div className="card-body p-2">
              <ul className="nav nav-pills justify-content-center flex-column flex-sm-row">
                {[
                  { id: "challenges", label: "Challenges", icon: Award },
                  {
                    id: "pending-submissions",
                    label: "Pending Submissions",
                    icon: Clock,
                  },
                ].map((tab) => (
                  <li className="nav-item mb-2 mb-sm-0" key={tab.id}>
                    <button
                      className={`nav-link ${
                        activeTab === tab.id
                          ? "active bg-primary text-white"
                          : "text-dark"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon className="me-2" size={18} />
                      <span className="d-none d-sm-inline">{tab.label}</span>
                      <span className="d-sm-none">
                        {tab.label.split(" ")[0]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <div className="tab-content">
              {/* Filters and Create Button */}
              <div className="card mb-4 bg-transparent border-light">
                <div className="card-body">
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center gap-3">
                    <div className="d-flex flex-column flex-md-row gap-2 flex-grow-1">
                      <div className="position-relative flex-grow-1">
                        <Search
                          className="position-absolute top-50 start-0 translate-middle-y ms-3"
                          size={20}
                        />
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Search challenges..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select"
                        style={{ minWidth: "150px" }}
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
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                    >
                      <Plus size={18} className="me-2" />
                      <span className="d-none d-sm-inline">
                        Create Challenge
                      </span>
                      <span className="d-sm-none">Create</span>
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <GlobalLoader text="Loading challenges..." />
              ) : (
                <>
                  {/* Challenges Grid */}
                  {filteredChallenges.length > 0 ? (
                    <>
                      <div className="alert alert-info">
                        Total Challenges: {challenges.length} | Filtered: {filteredChallenges.length}
                      </div>
                      <div className="row g-3 g-md-4 mb-4">
                        {filteredChallenges.map((challenge) => (
                          <div
                            key={challenge.id}
                            className="col-12 col-md-6 col-xl-4"
                          >
                        <div className="card h-100 shadow-sm">
                          {challenge.image_url && (
                            <img
                              src={challenge.image_url}
                              alt={challenge.title}
                              className="card-img-top"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="card-title">{challenge.title}</h5>
                              <span
                                className={`badge ${
                                  challenge.status === "draft"
                                    ? "bg-warning"
                                    : challenge.status === "active"
                                    ? "bg-success"
                                    : challenge.status === "completed"
                                    ? "bg-primary"
                                    : "bg-secondary"
                                }`}
                              >
                                {challenge.status}
                              </span>
                            </div>

                            <p className="card-text text-muted">
                              {challenge.description}
                            </p>

                            <div className="d-flex flex-wrap gap-2 gap-md-3 mb-3">
                              <div className="d-flex align-items-center">
                                <Users
                                  size={16}
                                  className="me-1 text-primary"
                                />
                                <small>
                                  {challenge.participants_count || 0}
                                  <span className="d-none d-sm-inline">
                                    {" "}
                                    participants
                                  </span>
                                </small>
                              </div>
                              <div className="d-flex align-items-center">
                                <Upload
                                  size={16}
                                  className="me-1 text-primary"
                                />
                                <small>
                                  {challenge.submissions_count || 0}
                                  <span className="d-none d-sm-inline">
                                    {" "}
                                    submissions
                                  </span>
                                </small>
                              </div>
                              <div className="d-flex align-items-center">
                                <Clock
                                  size={16}
                                  className="me-1 text-primary"
                                />
                                <small>
                                  {challenge.pending_submissions || 0}
                                  <span className="d-none d-sm-inline">
                                    {" "}
                                    pending
                                  </span>
                                </small>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                              <div className="d-flex gap-1 btn-group-responsive">
                                <button
                                  onClick={() =>
                                    openChallengeDetails(challenge)
                                  }
                                  className="btn btn-sm btn-outline-secondary"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditChallenge(challenge);
                                    setEditChallengeModal(true);
                                  }}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Edit"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => openSubmissions(challenge)}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="View Submissions"
                                >
                                  <Upload size={16} />
                                </button>
                                <button
                                  onClick={() => openParticipants(challenge)}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="View Participants"
                                >
                                  <Users size={16} />
                                </button>
                                <button
                                  onClick={() => openAnalytics(challenge)}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Analytics"
                                >
                                  <BarChart3 size={16} />
                                </button>
                              </div>

                              <div className="d-flex gap-1 align-items-center mt-2 mt-sm-0">
                                <select
                                  value={challenge.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      challenge.id,
                                      e.target.value
                                    )
                                  }
                                  className="form-select form-select-sm"
                                  style={{ width: "auto", minWidth: "90px" }}
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
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && filteredChallenges.length > 0 && (
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-dark gap-3">
                      <div>
                        <p className="mb-0 text-center text-sm-start">
                          Page {pagination.page} of {pagination.pages} (
                          {pagination.total} total)
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() =>
                            setPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={page === 1}
                          className="btn btn-sm btn-outline-light"
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
                          className="btn btn-sm btn-outline-light"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <Award size={48} className="text-muted mb-3" />
                      <p className="text-muted fs-5">No challenges found</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {/* Pending Submissions Tab */}
          {activeTab === "pending-submissions" && (
            <div className="tab-content">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h2 className="card-title mb-0 fs-5 fs-md-4">
                    Pending Submissions
                  </h2>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="d-flex justify-content-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : pendingSubmissions.length === 0 ? (
                    <div className="text-center py-5">
                      <Clock size={48} className="text-muted mb-3" />
                      <p className="text-muted">No pending submissions found</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {pendingSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
                        >
                          <div className="d-flex align-items-center flex-grow-1">
                            <img
                              src={
                                submission.profile_image_url ||
                                "/default-avatar.png"
                              }
                              alt={submission.username}
                              className="rounded-circle me-3"
                              width="48"
                              height="48"
                              onError={(e) => {
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                            <div className="flex-grow-1 min-width-0">
                              <h6 className="mb-1 text-truncate">
                                {submission.title}
                              </h6>
                              <p className="mb-1 text-muted small">
                                by {submission.username} •{" "}
                                {new Date(
                                  submission.submitted_at
                                ).toLocaleDateString()}
                              </p>
                              <p className="mb-0 text-primary small text-truncate">
                                {submission.challenge_title}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex gap-2 flex-nowrap">
                            <button
                              onClick={() => openSubmissionDetail(submission)}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Review
                            </button>
                            <button
                              onClick={() =>
                                handleApproveSubmission(submission.id)
                              }
                              className="btn btn-sm btn-success"
                            >
                              <span className="d-none d-sm-inline">Quick </span>
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* All your existing modals remain the same but with responsive modal classes */}
          {/* Create Challenge Modal */}
          {createChallengeModal && (
            <div
              className="modal fade show d-block modal-center"
              tabIndex="-1"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">Create New Challenge</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setCreateChallengeModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
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
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
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

                    <div className="row mb-3">
                      <div className="col-md-6">
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
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
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
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Challenge Image</label>
                      <div>
                        <input
                          type="file"
                          id="challenge-image-upload"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "image_url")}
                          className="form-control"
                          disabled={uploading}
                        />
                        {newChallenge.image_url && (
                          <div className="mt-2 position-relative d-inline-block">
                            <img
                              src={newChallenge.image_url}
                              alt="Preview"
                              className="img-thumbnail"
                              style={{ height: "100px" }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setNewChallenge({
                                  ...newChallenge,
                                  image_url: "",
                                })
                              }
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
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

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        checked={newChallenge.is_trending}
                        onChange={(e) =>
                          setNewChallenge({
                            ...newChallenge,
                            is_trending: e.target.checked,
                          })
                        }
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        Mark as Trending
                      </label>
                    </div>

                    {/* Tasks Section */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <label className="form-label">Challenge Tasks</label>
                        <button
                          type="button"
                          onClick={addTask}
                          className="btn btn-sm btn-primary d-flex align-items-center"
                        >
                          <Plus size={16} className="me-1" />
                          Add Task
                        </button>
                      </div>

                      <div className="tasks-list">
                        {tasks.map((task, index) => (
                          <div key={index} className="card mb-3">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="w-100 me-2">
                                  <label className="form-label">
                                    Task Type
                                  </label>
                                  <select
                                    value={task.task_type}
                                    onChange={(e) =>
                                      updateTask(
                                        index,
                                        "task_type",
                                        e.target.value
                                      )
                                    }
                                    className="form-select"
                                  >
                                    <option value="watch_video">
                                      Watch Video
                                    </option>
                                    <option value="upload_video">
                                      Upload Video
                                    </option>
                                  </select>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeTask(index)}
                                  className="btn btn-sm btn-danger mt-4"
                                  disabled={tasks.length === 1}
                                >
                                  <X size={14} />
                                </button>
                              </div>

                              <div className="mb-3">
                                <label className="form-label">Task Title</label>
                                <input
                                  type="text"
                                  value={task.task_title}
                                  onChange={(e) =>
                                    updateTask(
                                      index,
                                      "task_title",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="Enter task title"
                                />
                              </div>

                              {task.task_type === "watch_video" && (
                                <div className="mb-3">
                                  <label className="form-label">
                                    Video URL
                                  </label>
                                  <div>
                                    <input
                                      type="file"
                                      id={`task-video-upload-${index}`}
                                      accept="video/*"
                                      onChange={(e) =>
                                        handleFileUpload(e, "video_url", index)
                                      }
                                      className="form-control"
                                      disabled={uploading}
                                    />
                                    {task.video_url && (
                                      <div className="mt-2">
                                        <div className="position-relative d-inline-block">
                                          <video
                                            src={task.video_url}
                                            className="img-thumbnail"
                                            style={{ height: "100px" }}
                                            controls
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              updateTask(index, "video_url", "")
                                            }
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                          >
                                            <X size={14} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      onClick={() => setCreateChallengeModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateChallenge}
                      className="btn btn-primary"
                    >
                      Create Challenge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Edit Challenge Modal */}
          {editChallengeModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">Edit Challenge</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setEditChallengeModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
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
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
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

                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
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
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        checked={editChallenge.is_trending || false}
                        onChange={(e) =>
                          setEditChallenge({
                            ...editChallenge,
                            is_trending: e.target.checked,
                          })
                        }
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        Mark as Trending
                      </label>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      onClick={() => setEditChallengeModal(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateChallenge}
                      className="btn btn-primary"
                    >
                      Update Challenge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Challenge Details Modal */}
          {challengeDetailsModal && selectedChallenge && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">Challenge Details</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setChallengeDetailsModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        {selectedChallenge.challenge.image_url && (
                          <img
                            src={selectedChallenge.challenge.image_url}
                            alt={selectedChallenge.challenge.title}
                            className="img-fluid rounded mb-3"
                          />
                        )}
                        <h4>{selectedChallenge.challenge.title}</h4>
                        <p className="text-muted">
                          {selectedChallenge.challenge.description}
                        </p>

                        <div className="mt-4">
                          <div className="d-flex align-items-center mb-2">
                            <Calendar size={18} className="me-2 text-primary" />
                            <span>
                              {new Date(
                                selectedChallenge.challenge.start_date
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                selectedChallenge.challenge.end_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Award size={18} className="me-2 text-primary" />
                            <span>
                              {selectedChallenge.challenge.dance_style}
                            </span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <TrendingUp
                              size={18}
                              className="me-2 text-primary"
                            />
                            <span>
                              {selectedChallenge.challenge.dance_level}
                            </span>
                          </div>
                          {selectedChallenge.challenge.prize_details && (
                            <div className="d-flex align-items-center mb-2">
                              <Award size={18} className="me-2 text-primary" />
                              <span>
                                {selectedChallenge.challenge.prize_details}
                              </span>
                            </div>
                          )}
                          <div className="d-flex align-items-center mb-2">
                            <Users size={18} className="me-2 text-primary" />
                            <span>
                              Max:{" "}
                              {selectedChallenge.challenge.max_participants ||
                                "Unlimited"}{" "}
                              participants
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="row mb-4">
                          <div className="col-6">
                            <div className="card text-center">
                              <div className="card-body">
                                <Users
                                  size={24}
                                  className="text-primary mb-2"
                                />
                                <h4>
                                  {selectedChallenge.challenge
                                    .total_participants || 0}
                                </h4>
                                <p className="text-muted mb-0">Participants</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="card text-center">
                              <div className="card-body">
                                <Upload
                                  size={24}
                                  className="text-primary mb-2"
                                />
                                <h4>
                                  {selectedChallenge.challenge
                                    .total_submissions || 0}
                                </h4>
                                <p className="text-muted mb-0">Submissions</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 mt-3">
                            <div className="card text-center">
                              <div className="card-body">
                                <Clock
                                  size={24}
                                  className="text-primary mb-2"
                                />
                                <h4>
                                  {selectedChallenge.challenge
                                    .pending_submissions || 0}
                                </h4>
                                <p className="text-muted mb-0">Pending</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedChallenge.challenge.tasks &&
                          selectedChallenge.challenge.tasks.length > 0 && (
                            <div>
                              <h5>Challenge Tasks</h5>
                              <div className="list-group">
                                {selectedChallenge.challenge.tasks.map(
                                  (task, index) => (
                                    <div
                                      key={index}
                                      className="list-group-item"
                                    >
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="badge bg-primary">
                                          {task.task_type}
                                        </span>
                                        <span className="fw-semibold">
                                          {task.task_title}
                                        </span>
                                      </div>
                                      {task.video_url && (
                                        <a
                                          href={task.video_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-sm btn-outline-primary mt-2"
                                        >
                                          <Play size={14} className="me-1" />
                                          Watch Video
                                        </a>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      onClick={() => setChallengeDetailsModal(false)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Continue with remaining modals - they follow the same responsive pattern */}
          {/* I'll include the key remaining modals with responsive fixes */}
          {/* Submissions Modal */}
          {" "}
          {submissionsModal && selectedChallenge && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      Submissions - {selectedChallenge.title}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setSubmissionsModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {submissions.length === 0 ? (
                      <div className="text-center py-5">
                        <Upload size={48} className="text-muted mb-3" />
                        <p className="text-muted">No submissions found</p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {submissions.map((submission) => (
                          <div key={submission.id} className="col-md-6">
                            <div className="card h-100">
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                  <img
                                    src={
                                      submission.profile_image_url ||
                                      "/default-avatar.png"
                                    }
                                    alt={submission.username}
                                    className="rounded-circle me-3"
                                    width="40"
                                    height="40"
                                    onError={(e) => {
                                      e.target.src = "/default-avatar.png";
                                    }}
                                  />
                                  <div>
                                    <h6 className="mb-0">
                                      {submission.username}
                                    </h6>
                                    <small className="text-muted">
                                      {new Date(
                                        submission.submitted_at
                                      ).toLocaleDateString()}
                                    </small>
                                  </div>
                                  <span
                                    className={`badge ms-auto ${
                                      submission.status === "pending"
                                        ? "bg-warning"
                                        : submission.status === "approved"
                                        ? "bg-success"
                                        : "bg-danger"
                                    }`}
                                  >
                                    {submission.status}
                                  </span>
                                </div>

                                <h6>{submission.title}</h6>
                                {submission.description && (
                                  <p className="text-muted small">
                                    {submission.description}
                                  </p>
                                )}

                                {submission.video_url && (
                                  <div className="mb-3">
                                    <a
                                      href={submission.video_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      <Play size={14} className="me-1" />
                                      Watch Submission
                                    </a>
                                  </div>
                                )}

                                <div className="d-flex flex-wrap gap-1">
                                  <button
                                    onClick={() =>
                                      openSubmissionDetail(submission)
                                    }
                                    className="btn btn-sm btn-outline-secondary"
                                  >
                                    <Eye size={14} className="me-1" />
                                    View Details
                                  </button>
                                  {submission.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleApproveSubmission(submission.id)
                                        }
                                        className="btn btn-sm btn-outline-success"
                                      >
                                        <CheckCircle
                                          size={14}
                                          className="me-1"
                                        />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRejectSubmission(submission.id)
                                        }
                                        className="btn btn-sm btn-outline-danger"
                                      >
                                        <XCircle size={14} className="me-1" />
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleDeleteSubmission(submission.id)
                                    }
                                    className="btn btn-sm btn-outline-danger"
                                  >
                                    <Trash2 size={14} className="me-1" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      onClick={() => setSubmissionsModal(false)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Participants Modal */}
          {participantsModal && selectedChallenge && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      Participants - {selectedChallenge.title}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setParticipantsModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {participants.length === 0 ? (
                      <div className="text-center py-5">
                        <Users size={48} className="text-muted mb-3" />
                        <p className="text-muted">No participants found</p>
                      </div>
                    ) : (
                      <div className="list-group">
                        {participants.map((participant) => (
                          <div
                            key={participant.user_id}
                            className="list-group-item"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    participant.profile_image_url ||
                                    "/default-avatar.png"
                                  }
                                  alt={participant.username}
                                  className="rounded-circle me-3"
                                  width="48"
                                  height="48"
                                  onError={(e) => {
                                    e.target.src = "/default-avatar.png";
                                  }}
                                />
                                <div>
                                  <h6 className="mb-0">
                                    {participant.username}
                                  </h6>
                                  <p className="mb-0 text-muted small">
                                    {participant.email}
                                  </p>
                                  <small className="text-muted">
                                    Joined:{" "}
                                    {new Date(
                                      participant.joined_at
                                    ).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>

                              <div className="d-flex align-items-center">
                                <div className="me-3 text-end">
                                  <div className="d-flex align-items-center">
                                    <Upload
                                      size={14}
                                      className="me-1 text-muted"
                                    />
                                    <small>
                                      {participant.submissions_count || 0}{" "}
                                      submissions
                                    </small>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <ThumbsUp
                                      size={14}
                                      className="me-1 text-muted"
                                    />
                                    <small>
                                      {participant.likes_received || 0} likes
                                    </small>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleRemoveParticipant(
                                      selectedChallenge.id,
                                      participant.user_id
                                    )
                                  }
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  <UserMinus size={14} className="me-1" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      onClick={() => setParticipantsModal(false)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Analytics Modal */}
          {analyticsModal && selectedChallenge && analytics && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      Analytics - {selectedChallenge.title}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setAnalyticsModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Overview</h5>
                            <BarChart3 className="text-primary" />
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-6 col-md-4 col-lg-2 text-center mb-3">
                                <div className="display-6 fw-bold text-primary">
                                  {analytics.analytics.total_participants || 0}
                                </div>
                                <div className="text-muted">
                                  Total Participants
                                </div>
                              </div>
                              <div className="col-6 col-md-4 col-lg-2 text-center mb-3">
                                <div className="display-6 fw-bold text-primary">
                                  {analytics.analytics.total_submissions || 0}
                                </div>
                                <div className="text-muted">
                                  Total Submissions
                                </div>
                              </div>
                              <div className="col-6 col-md-4 col-lg-2 text-center mb-3">
                                <div className="display-6 fw-bold text-success">
                                  {analytics.analytics.approved_submissions ||
                                    0}
                                </div>
                                <div className="text-muted">Approved</div>
                              </div>
                              <div className="col-6 col-md-4 col-lg-2 text-center mb-3">
                                <div className="display-6 fw-bold text-warning">
                                  {analytics.analytics.pending_submissions || 0}
                                </div>
                                <div className="text-muted">Pending</div>
                              </div>
                              <div className="col-6 col-md-4 col-lg-2 text-center mb-3">
                                <div className="display-6 fw-bold text-info">
                                  {analytics.analytics.total_likes || 0}
                                </div>
                                <div className="text-muted">Total Likes</div>
                              </div>
                              <div className="col-6 col-md-4 col-lg-2 text-center mb-3">
                                <div className="display-6 fw-bold text-info">
                                  {analytics.analytics.total_comments || 0}
                                </div>
                                <div className="text-muted">Total Comments</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {analytics.analytics.top_performers &&
                      analytics.analytics.top_performers.length > 0 && (
                        <div className="row mb-4">
                          <div className="col-md-6">
                            <div className="card h-100">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Top Performers</h5>
                                <Award className="text-primary" />
                              </div>
                              <div className="card-body">
                                <div className="list-group list-group-flush">
                                  {analytics.analytics.top_performers.map(
                                    (performer, index) => (
                                      <div
                                        key={performer.user_id}
                                        className="list-group-item d-flex align-items-center"
                                      >
                                        <div
                                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                          }}
                                        >
                                          {index + 1}
                                        </div>
                                        <img
                                          src={
                                            performer.profile_image_url ||
                                            "/default-avatar.png"
                                          }
                                          alt={performer.username}
                                          className="rounded-circle me-3"
                                          width="40"
                                          height="40"
                                          onError={(e) => {
                                            e.target.src =
                                              "/default-avatar.png";
                                          }}
                                        />
                                        <div className="flex-grow-1">
                                          <div className="fw-semibold">
                                            {performer.username}
                                          </div>
                                          <div className="small text-muted">
                                            {performer.likes_count} likes •{" "}
                                            {performer.submissions_count}{" "}
                                            submissions
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card h-100">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Engagement Metrics</h5>
                                <TrendingUp className="text-primary" />
                              </div>
                              <div className="card-body">
                                <div className="list-group list-group-flush">
                                  <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Average Likes per Submission</span>
                                    <span className="fw-bold">
                                      {analytics.analytics.engagement_metrics
                                        .avg_likes_per_submission || 0}
                                    </span>
                                  </div>
                                  <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Average Comments per Submission</span>
                                    <span className="fw-bold">
                                      {analytics.analytics.engagement_metrics
                                        .avg_comments_per_submission || 0}
                                    </span>
                                  </div>
                                  <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Participation Rate</span>
                                    <span className="fw-bold">
                                      {analytics.engagement_metrics
                                        .participation_rate || 0}
                                      %
                                    </span>
                                  </div>
                                  <div className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Completion Rate</span>
                                    <span className="fw-bold">
                                      {analytics.engagement_metrics
                                        .completion_rate || 0}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* <div className="modal-footer">
                    <button
                      onClick={() => setAnalyticsModal(false)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                    <button className="btn btn-primary">
                      <Download size={16} className="me-1" />
                      Export Report
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          )}
          {submissionsModal && selectedChallenge && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      Submissions - {selectedChallenge.title}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setSubmissionsModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {submissions.length === 0 ? (
                      <div className="text-center py-5">
                        <Upload size={48} className="text-muted mb-3" />
                        <p className="text-muted">No submissions found</p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {submissions.map((submission) => (
                          <div key={submission.id} className="col-12 col-md-6">
                            <div className="card h-100">
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                  <img
                                    src={
                                      submission.profile_image_url ||
                                      "/default-avatar.png"
                                    }
                                    alt={submission.username}
                                    className="rounded-circle me-3"
                                    width="40"
                                    height="40"
                                    onError={(e) => {
                                      e.target.src = "/default-avatar.png";
                                    }}
                                  />
                                  <div>
                                    <h6 className="mb-0">
                                      {submission.username}
                                    </h6>
                                    <small className="text-muted">
                                      {new Date(
                                        submission.submitted_at
                                      ).toLocaleDateString()}
                                    </small>
                                  </div>
                                  <span
                                    className={`badge ms-auto ${
                                      submission.status === "pending"
                                        ? "bg-warning"
                                        : submission.status === "approved"
                                        ? "bg-success"
                                        : "bg-danger"
                                    }`}
                                  >
                                    {submission.status}
                                  </span>
                                </div>

                                <h6>{submission.title}</h6>
                                {submission.description && (
                                  <p className="text-muted small">
                                    {submission.description}
                                  </p>
                                )}

                                {submission.video_url && (
                                  <div className="mb-3">
                                    <a
                                      href={submission.video_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      <Play size={14} className="me-1" />
                                      Watch Submission
                                    </a>
                                  </div>
                                )}

                                <div className="d-flex flex-wrap gap-1">
                                  <button
                                    onClick={() =>
                                      openSubmissionDetail(submission)
                                    }
                                    className="btn btn-sm btn-outline-secondary"
                                  >
                                    <Eye size={14} className="me-1" />
                                    View Details
                                  </button>
                                  {submission.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleApproveSubmission(submission.id)
                                        }
                                        className="btn btn-sm btn-outline-success"
                                      >
                                        <CheckCircle
                                          size={14}
                                          className="me-1"
                                        />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRejectSubmission(submission.id)
                                        }
                                        className="btn btn-sm btn-outline-danger"
                                      >
                                        <XCircle size={14} className="me-1" />
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleDeleteSubmission(submission.id)
                                    }
                                    className="btn btn-sm btn-outline-danger"
                                  >
                                    <Trash2 size={14} className="me-1" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      onClick={() => setSubmissionsModal(false)}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
