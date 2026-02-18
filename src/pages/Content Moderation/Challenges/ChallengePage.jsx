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
  ThumbsUp,
  Upload,
  Calendar,
  Award,
  Plus,
  Search,
  X,
  AlertCircle,
  Download,
} from "lucide-react";

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
import "./ChallengePage.css"; // ← your CSS file

const ChallengePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("challenges");
  const [uploading, setUploading] = useState(false);

  const [challengeDetailsModal, setChallengeDetailsModal] = useState(false);
  const [createChallengeModal, setCreateChallengeModal] = useState(false);
  const [editChallengeModal, setEditChallengeModal] = useState(false);
  const [submissionsModal, setSubmissionsModal] = useState(false);
  const [participantsModal, setParticipantsModal] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [submissionDetailModal, setSubmissionDetailModal] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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
        if (selectedSubmission) openSubmissionDetail(selectedSubmission);
      } catch (error) {
        setError("Failed to delete comment");
      }
    }
  };

  const addTask = () => {
    setTasks([...tasks, { task_type: "watch_video", task_title: "", video_url: "" }]);
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
        tasks: tasks.filter((t) => t.task_title.trim() !== ""),
      };
      await createChallengeService(challengeData);
      setSuccess("Challenge created successfully");
      setCreateChallengeModal(false);
      setNewChallenge({
        title: "", challenger_type: "public", description: "", image_url: "",
        dance_style: "", dance_level: "", start_date: "", end_date: "",
        prize_details: "", max_participants: "", status: "draft", is_trending: false,
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
    const matchSearch = challenge.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? challenge.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  /* ─── Reusable Modal Shell ─────────────────────────────────── */
  const ModalShell = ({ title, onClose, maxWidth = "600px", children, footer }) => (
    <div className="modal-overlay-custom">
      <div className="modal-shell" style={{ maxWidth }}>
        <div className="modal-header-custom">
          <h5 className="modal-title-custom">{title}</h5>
          <button className="modal-close-custom" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body-custom">{children}</div>
        {footer && <div className="modal-footer-custom">{footer}</div>}
      </div>
    </div>
  );

  /* ─── Alert ────────────────────────────────────────────────── */
  const AlertBanner = ({ type, message, onClose }) => (
    <div className={`alert-banner alert-banner--${type}`}>
      <AlertCircle size={18} className="alert-banner__icon" />
      <span className="alert-banner__msg">{message}</span>
      <button className="alert-banner__close" onClick={onClose}><X size={14} /></button>
    </div>
  );

  /* ─── Form field helpers ───────────────────────────────────── */
  const Field = ({ label, children }) => (
    <div className="cp-form-group">
      <label className="cp-form-label">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="challenge-page">
      <div className="challenge-content">

        {/* Alerts */}
        {error   && <AlertBanner type="error"   message={error}   onClose={() => setError("")} />}
        {success && <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />}

        {/* ── Header ── */}
        <div className="challenge-header">
          <div>
            <h1 className="page-title">Challenge Management</h1>
            <p className="page-description">Manage challenges, submissions, and participants</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tab-navigation">
          <div className="tab-nav">
            {[
              { id: "challenges",          label: "Challenges",          icon: Award },
              { id: "pending-submissions", label: "Pending Submissions", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} className="tab-icon" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            CHALLENGES TAB
        ══════════════════════════════════════ */}
        {activeTab === "challenges" && (
          <>
            {/* Filters */}
            <div className="filters-section">
              <div className="filters-container">
                <div className="filters-left">
                  <div className="search-container">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search challenges..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <button className="create-button" onClick={() => setCreateChallengeModal(true)}>
                  <Plus size={16} className="button-icon" />
                  Create Challenge
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner" />
              </div>
            ) : (
              <>
                {/* Cards */}
                <div className="challenges-grid">
                  {filteredChallenges.map((challenge) => (
                    <div key={challenge.id} className="challenge-card">
                      {challenge.image_url && (
                        <img
                          src={challenge.image_url}
                          alt={challenge.title}
                          className="challenge-image"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <div className="challenge-content-area">
                        <div className="challenge-header-info">
                          <h5 className="challenge-title">{challenge.title}</h5>
                          <span className={`status-badge ${challenge.status}`}>
                            {challenge.status}
                          </span>
                        </div>

                        <p className="challenge-description">{challenge.description}</p>

                        <div className="challenge-stats">
                          <div className="stat-item">
                            <Users size={14} className="stat-icon" />
                            {challenge.participants_count || 0} participants
                          </div>
                          <div className="stat-item">
                            <Upload size={14} className="stat-icon" />
                            {challenge.submissions_count || 0} submissions
                          </div>
                          <div className="stat-item">
                            <Clock size={14} className="stat-icon" />
                            {challenge.pending_submissions || 0} pending
                          </div>
                        </div>

                         <div className="challenge-actions" style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:'0.5rem', paddingTop:'0.875rem', borderTop:'1px solid #e5e7eb', flexWrap:'nowrap'}}>
                          
                          {/* Left: icon buttons */}
                          <div style={{display:'flex', alignItems:'center', gap:'0.35rem', flexShrink:0}}>
                            <button className="action-btn" title="View Details" onClick={() => openChallengeDetails(challenge)}>
                              <Eye size={13} />
                            </button>
                            <button className="action-btn" title="Edit" onClick={() => { setEditChallenge(challenge); setEditChallengeModal(true); }}>
                              <Edit3 size={13} />
                            </button>
                            <button className="action-btn" title="Submissions" onClick={() => openSubmissions(challenge)}>
                              <Upload size={13} />
                            </button>
                            <button className="action-btn" title="Participants" onClick={() => openParticipants(challenge)}>
                              <Users size={13} />
                            </button>
                            <button className="action-btn" title="Analytics" onClick={() => openAnalytics(challenge)}>
                              <BarChart3 size={13} />
                            </button>
                          </div>

                          {/* Right: status select + delete */}
                          <div style={{display:'flex', alignItems:'center', gap:'0.375rem', flexShrink:0}}>
                            <select
                              className="status-select"
                              value={challenge.status}
                              onChange={(e) => handleStatusChange(challenge.id, e.target.value)}
                              style={{width:'85px', height:'1.875rem', padding:'0 0.4rem', fontSize:'0.78rem', border:'1.5px solid #e5e7eb', borderRadius:'0.45rem', background:'#fff', cursor:'pointer'}}
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="ended">Ended</option>
                            </select>
                            <button
                              className="delete-btn"
                              title="Delete"
                              onClick={() => handleDeleteChallenge(challenge.id)}
                              style={{width:'1.875rem', height:'1.875rem', minWidth:'1.875rem', display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid #fecaca', borderRadius:'0.45rem', background:'#fff5f5', color:'#dc2626', cursor:'pointer', padding:0, flexShrink:0}}
                            >
                              <Trash2 size={13} />
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
                      <p>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</p>
                    </div>
                    <div className="pagination-controls">
                      <button
                        className="pagination-btn"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="pagination-btn"
                        onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ══════════════════════════════════════
            PENDING SUBMISSIONS TAB
        ══════════════════════════════════════ */}
        {activeTab === "pending-submissions" && (
          <div className="submissions-container">
            <div className="submissions-header">
              <h2 className="submissions-title">Pending Submissions</h2>
            </div>

            {loading ? (
              <div className="loading-container"><div className="loading-spinner" /></div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="empty-state">
                <Clock size={48} className="empty-icon" />
                <p className="empty-text">No pending submissions found</p>
              </div>
            ) : (
              <div className="submissions-list">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="submission-item">
                    <div className="submission-info">
                      <img
                        src={submission.profile_image_url || "/default-avatar.png"}
                        alt={submission.username}
                        className="submission-avatar"
                        onError={(e) => { e.target.src = "/default-avatar.png"; }}
                      />
                      <div className="submission-details">
                        <h3>{submission.title}</h3>
                        <p className="submission-meta">
                          by {submission.username} · {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                        <p className="submission-challenge">{submission.challenge_title}</p>
                      </div>
                    </div>
                    <div className="submission-actions">
                      <button className="review-btn" onClick={() => openSubmissionDetail(submission)}>
                        Review
                      </button>
                      <button className="approve-btn" onClick={() => handleApproveSubmission(submission.id)}>
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            CREATE CHALLENGE MODAL
        ══════════════════════════════════════ */}
        {createChallengeModal && (
          <ModalShell
            title="Create New Challenge"
            onClose={() => setCreateChallengeModal(false)}
            maxWidth="640px"
            footer={
              <>
                <button className="btn-cancel" onClick={() => setCreateChallengeModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleCreateChallenge}>Create Challenge</button>
              </>
            }
          >
            <Field label="Title">
              <input type="text" className="form-input" value={newChallenge.title}
                onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })} />
            </Field>

            <Field label="Description">
              <textarea className="form-textarea" rows={3} value={newChallenge.description}
                onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })} />
            </Field>

            <div className="form-row">
              <Field label="Dance Style">
                <input type="text" className="form-input" value={newChallenge.dance_style}
                  onChange={(e) => setNewChallenge({ ...newChallenge, dance_style: e.target.value })} />
              </Field>
              <Field label="Dance Level">
                <select className="form-select" value={newChallenge.dance_level}
                  onChange={(e) => setNewChallenge({ ...newChallenge, dance_level: e.target.value })}>
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>
            </div>

            <div className="form-row">
              <Field label="Start Date">
                <input type="date" className="form-input" value={newChallenge.start_date}
                  onChange={(e) => setNewChallenge({ ...newChallenge, start_date: e.target.value })} />
              </Field>
              <Field label="End Date">
                <input type="date" className="form-input" value={newChallenge.end_date}
                  onChange={(e) => setNewChallenge({ ...newChallenge, end_date: e.target.value })} />
              </Field>
            </div>

            <Field label="Prize Details">
              <input type="text" className="form-input" value={newChallenge.prize_details}
                onChange={(e) => setNewChallenge({ ...newChallenge, prize_details: e.target.value })} />
            </Field>

            <Field label="Max Participants">
              <input type="number" className="form-input" value={newChallenge.max_participants}
                onChange={(e) => setNewChallenge({ ...newChallenge, max_participants: e.target.value })} />
            </Field>

            <Field label="Challenge Image">
              <input type="file" className="form-input" accept="image/*"
                onChange={(e) => handleFileUpload(e, "image_url")} disabled={uploading} />
              {newChallenge.image_url && (
                <div className="cp-img-preview">
                  <img src={newChallenge.image_url} alt="Preview" className="cp-img-preview__img" />
                  <button className="cp-img-preview__remove" onClick={() => setNewChallenge({ ...newChallenge, image_url: "" })}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </Field>

            <Field label="Challenge Type">
              <select className="form-select" value={newChallenge.challenger_type}
                onChange={(e) => setNewChallenge({ ...newChallenge, challenger_type: e.target.value })}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </Field>

            <div className="cp-form-group">
              <label className="form-checkbox">
                <input type="checkbox" checked={newChallenge.is_trending}
                  onChange={(e) => setNewChallenge({ ...newChallenge, is_trending: e.target.checked })} />
                Mark as Trending
              </label>
            </div>

            {/* Tasks */}
            <div className="cp-form-group">
              <div className="cp-tasks-header">
                <label className="cp-form-label">Challenge Tasks</label>
                <button className="btn-primary btn-sm-custom" onClick={addTask}>
                  <Plus size={14} /> Add Task
                </button>
              </div>

              {tasks.map((task, index) => (
                <div key={index} className="cp-task-card">
                  <div className="form-row">
                    <Field label="Task Type">
                      <select className="form-select" value={task.task_type}
                        onChange={(e) => updateTask(index, "task_type", e.target.value)}>
                        <option value="watch_video">Watch Video</option>
                        <option value="upload_video">Upload Video</option>
                      </select>
                    </Field>
                    <div className="cp-task-remove-wrap">
                      <button className="delete-btn" onClick={() => removeTask(index)} disabled={tasks.length === 1}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  <Field label="Task Title">
                    <input type="text" className="form-input" placeholder="Enter task title"
                      value={task.task_title} onChange={(e) => updateTask(index, "task_title", e.target.value)} />
                  </Field>

                  {task.task_type === "watch_video" && (
                    <Field label="Video Upload">
                      <input type="file" className="form-input" accept="video/*"
                        onChange={(e) => handleFileUpload(e, "video_url", index)} disabled={uploading} />
                      {task.video_url && (
                        <div className="cp-img-preview">
                          <video src={task.video_url} className="cp-img-preview__img" controls />
                          <button className="cp-img-preview__remove" onClick={() => updateTask(index, "video_url", "")}>
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </Field>
                  )}
                </div>
              ))}
            </div>
          </ModalShell>
        )}

        {/* ══════════════════════════════════════
            EDIT CHALLENGE MODAL
        ══════════════════════════════════════ */}
        {editChallengeModal && (
          <ModalShell
            title="Edit Challenge"
            onClose={() => setEditChallengeModal(false)}
            maxWidth="580px"
            footer={
              <>
                <button className="btn-cancel" onClick={() => setEditChallengeModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleUpdateChallenge}>Update Challenge</button>
              </>
            }
          >
            <Field label="Title">
              <input type="text" className="form-input" value={editChallenge.title || ""}
                onChange={(e) => setEditChallenge({ ...editChallenge, title: e.target.value })} />
            </Field>

            <Field label="Description">
              <textarea className="form-textarea" rows={3} value={editChallenge.description || ""}
                onChange={(e) => setEditChallenge({ ...editChallenge, description: e.target.value })} />
            </Field>

            <div className="form-row">
              <Field label="Dance Style">
                <input type="text" className="form-input" value={editChallenge.dance_style || ""}
                  onChange={(e) => setEditChallenge({ ...editChallenge, dance_style: e.target.value })} />
              </Field>
              <Field label="Dance Level">
                <select className="form-select" value={editChallenge.dance_level || ""}
                  onChange={(e) => setEditChallenge({ ...editChallenge, dance_level: e.target.value })}>
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>
            </div>

            <Field label="Prize Details">
              <input type="text" className="form-input" value={editChallenge.prize_details || ""}
                onChange={(e) => setEditChallenge({ ...editChallenge, prize_details: e.target.value })} />
            </Field>

            <Field label="Max Participants">
              <input type="number" className="form-input" value={editChallenge.max_participants || ""}
                onChange={(e) => setEditChallenge({ ...editChallenge, max_participants: e.target.value })} />
            </Field>

            <Field label="Image URL">
              <input type="url" className="form-input" value={editChallenge.image_url || ""}
                onChange={(e) => setEditChallenge({ ...editChallenge, image_url: e.target.value })} />
            </Field>

            <div className="cp-form-group">
              <label className="form-checkbox">
                <input type="checkbox" checked={editChallenge.is_trending || false}
                  onChange={(e) => setEditChallenge({ ...editChallenge, is_trending: e.target.checked })} />
                Mark as Trending
              </label>
            </div>
          </ModalShell>
        )}

        {/* ══════════════════════════════════════
            CHALLENGE DETAILS MODAL
        ══════════════════════════════════════ */}
        {challengeDetailsModal && selectedChallenge && (
          <ModalShell
            title="Challenge Details"
            onClose={() => setChallengeDetailsModal(false)}
            maxWidth="860px"
            footer={
              <button className="btn-cancel" onClick={() => setChallengeDetailsModal(false)}>Close</button>
            }
          >
            <div className="challenge-details">
              <div>
                {selectedChallenge.challenge?.image_url && (
                  <img src={selectedChallenge.challenge.image_url} alt={selectedChallenge.challenge.title} className="details-image" />
                )}
                <h4 className="details-title">{selectedChallenge.challenge?.title}</h4>
                <p className="details-description">{selectedChallenge.challenge?.description}</p>

                <div className="details-info">
                  <div className="info-item">
                    <Calendar size={16} className="info-icon" />
                    {new Date(selectedChallenge.challenge?.start_date).toLocaleDateString()} –{" "}
                    {new Date(selectedChallenge.challenge?.end_date).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <Award size={16} className="info-icon" />
                    {selectedChallenge.challenge?.dance_style}
                  </div>
                  <div className="info-item">
                    <TrendingUp size={16} className="info-icon" />
                    {selectedChallenge.challenge?.dance_level}
                  </div>
                  {selectedChallenge.challenge?.prize_details && (
                    <div className="info-item">
                      <Award size={16} className="info-icon" />
                      {selectedChallenge.challenge.prize_details}
                    </div>
                  )}
                  <div className="info-item">
                    <Users size={16} className="info-icon" />
                    Max: {selectedChallenge.challenge?.max_participants || "Unlimited"} participants
                  </div>
                </div>
              </div>

              <div>
                <div className="row mb-4">
                  <div className="col-6">
                    <div className="card text-center">
                      <div className="card-body">
                        <Users size={24} className="text-primary mb-2" />
                        <h4>{selectedChallenge.challenge?.total_participants || 0}</h4>
                        <p className="text-muted mb-0">Participants</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card text-center">
                      <div className="card-body">
                        <Upload size={24} className="text-primary mb-2" />
                        <h4>{selectedChallenge.challenge?.total_submissions || 0}</h4>
                        <p className="text-muted mb-0">Submissions</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 mt-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <Clock size={24} className="text-primary mb-2" />
                        <h4>{selectedChallenge.challenge?.pending_submissions || 0}</h4>
                        <p className="text-muted mb-0">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedChallenge.challenge?.tasks?.length > 0 && (
                  <div className="challenge-tasks">
                    <h4>Challenge Tasks</h4>
                    <div className="tasks-list">
                      {selectedChallenge.challenge.tasks.map((task, index) => (
                        <div key={index} className="task-item">
                          <div className="task-header">
                            <span className="task-type">{task.task_type}</span>
                            <span className="task-title">{task.task_title}</span>
                          </div>
                          {task.video_url && (
                            <a href={task.video_url} target="_blank" rel="noopener noreferrer" className="task-video-link">
                              <Play size={13} className="play-icon" /> Watch Video
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalShell>
        )}

        {/* ══════════════════════════════════════
            SUBMISSIONS MODAL
        ══════════════════════════════════════ */}
        {submissionsModal && selectedChallenge && (
          <ModalShell
            title={`Submissions — ${selectedChallenge.title}`}
            onClose={() => setSubmissionsModal(false)}
            maxWidth="1000px"
            footer={
              <button className="btn-cancel" onClick={() => setSubmissionsModal(false)}>Close</button>
            }
          >
            {submissions.length === 0 ? (
              <div className="empty-state">
                <Upload size={48} className="empty-icon" />
                <p className="empty-text">No submissions found</p>
              </div>
            ) : (
              <div className="submissions-grid">
                {submissions.map((submission) => (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-header">
                      <img
                        src={submission.profile_image_url || "/default-avatar.png"}
                        alt={submission.username}
                        className="submission-user-avatar"
                        onError={(e) => { e.target.src = "/default-avatar.png"; }}
                      />
                      <div className="submission-user-info">
                        <h4>{submission.username}</h4>
                        <p>{new Date(submission.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`submission-status ${submission.status}`}>
                        {submission.status}
                      </span>
                    </div>

                    <div className="submission-content">
                      <h5>{submission.title}</h5>
                      {submission.description && (
                        <p className="submission-desc">{submission.description}</p>
                      )}
                      {submission.video_url && (
                        <div className="submission-video">
                          <a href={submission.video_url} target="_blank" rel="noopener noreferrer" className="video-link">
                            <Play size={13} /> Watch Submission
                          </a>
                        </div>
                      )}
                      <div className="submission-actions">
                        <button className="view-detail-btn" onClick={() => openSubmissionDetail(submission)}>
                          <Eye size={13} /> View
                        </button>
                        {submission.status === "pending" && (
                          <>
                            <button className="approve-btn" onClick={() => handleApproveSubmission(submission.id)}>
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button className="reject-btn" onClick={() => handleRejectSubmission(submission.id)}>
                              <XCircle size={13} /> Reject
                            </button>
                          </>
                        )}
                        <button className="reject-btn" onClick={() => handleDeleteSubmission(submission.id)}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalShell>
        )}

        {/* ══════════════════════════════════════
            PARTICIPANTS MODAL
        ══════════════════════════════════════ */}
        {participantsModal && selectedChallenge && (
          <ModalShell
            title={`Participants — ${selectedChallenge.title}`}
            onClose={() => setParticipantsModal(false)}
            maxWidth="720px"
            footer={
              <button className="btn-cancel" onClick={() => setParticipantsModal(false)}>Close</button>
            }
          >
            {participants.length === 0 ? (
              <div className="empty-state">
                <Users size={48} className="empty-icon" />
                <p className="empty-text">No participants found</p>
              </div>
            ) : (
              <div className="participants-list">
                {participants.map((participant) => (
                  <div key={participant.user_id} className="participant-item">
                    <div className="participant-info">
                      <img
                        src={participant.profile_image_url || "/default-avatar.png"}
                        alt={participant.username}
                        className="participant-avatar"
                        onError={(e) => { e.target.src = "/default-avatar.png"; }}
                      />
                      <div className="participant-details">
                        <h4>{participant.username}</h4>
                        <p>{participant.email}</p>
                        <span className="join-date">
                          Joined: {new Date(participant.joined_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="participant-stats">
                      <div className="participant-stat">
                        <Upload size={13} className="stat-icon-small" />
                        {participant.submissions_count || 0} submissions
                      </div>
                      <div className="participant-stat">
                        <ThumbsUp size={13} className="stat-icon-small" />
                        {participant.likes_received || 0} likes
                      </div>
                    </div>

                    <div className="participant-actions">
                      <button
                        className="remove-participant-btn"
                        onClick={() => handleRemoveParticipant(selectedChallenge.id, participant.user_id)}
                      >
                        <UserMinus size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalShell>
        )}

        {/* ══════════════════════════════════════
            ANALYTICS MODAL
        ══════════════════════════════════════ */}
        {analyticsModal && selectedChallenge && analytics && (
          <ModalShell
            title={`Analytics — ${selectedChallenge.title}`}
            onClose={() => setAnalyticsModal(false)}
            maxWidth="1000px"
            footer={
              <button className="btn-cancel" onClick={() => setAnalyticsModal(false)}>Close</button>
            }
          >
            <div className="analytics-container">
              {/* Overview */}
              <div className="analytics-card">
                <div className="analytics-card-header">
                  <h3>Overview</h3>
                  <BarChart3 size={20} className="analytics-icon" />
                </div>
                <div className="analytics-stats-grid">
                  {[
                    { val: analytics.analytics?.total_participants || 0,   label: "Total Participants" },
                    { val: analytics.analytics?.total_submissions || 0,    label: "Total Submissions" },
                    { val: analytics.analytics?.approved_submissions || 0, label: "Approved" },
                    { val: analytics.analytics?.pending_submissions || 0,  label: "Pending" },
                    { val: analytics.analytics?.total_likes || 0,          label: "Total Likes" },
                    { val: analytics.analytics?.total_comments || 0,       label: "Total Comments" },
                  ].map(({ val, label }) => (
                    <div key={label} className="analytics-stat">
                      <span className="stat-value">{val}</span>
                      <span className="stat-label">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performers + Engagement */}
              {analytics.analytics?.top_performers?.length > 0 && (
                <div className="analytics-overview">
                  <div className="analytics-card">
                    <div className="analytics-card-header">
                      <h3>Top Performers</h3>
                      <Award size={18} className="analytics-icon" />
                    </div>
                    <div className="top-performers-list">
                      {analytics.analytics.top_performers.map((performer, index) => (
                        <div key={performer.user_id} className="top-performer-item">
                          <div className="performer-rank">{index + 1}</div>
                          <img
                            src={performer.profile_image_url || "/default-avatar.png"}
                            alt={performer.username}
                            className="performer-avatar"
                            onError={(e) => { e.target.src = "/default-avatar.png"; }}
                          />
                          <div className="performer-info">
                            <span className="performer-name">{performer.username}</span>
                            <span className="performer-stats">
                              {performer.likes_count} likes · {performer.submissions_count} submissions
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="analytics-card">
                    <div className="analytics-card-header">
                      <h3>Engagement Metrics</h3>
                      <TrendingUp size={18} className="analytics-icon" />
                    </div>
                    <div className="engagement-metrics">
                      {[
                        { label: "Avg Likes / Submission",    val: analytics.analytics?.engagement_metrics?.avg_likes_per_submission || 0 },
                        { label: "Avg Comments / Submission", val: analytics.analytics?.engagement_metrics?.avg_comments_per_submission || 0 },
                        { label: "Participation Rate",        val: `${analytics.engagement_metrics?.participation_rate || 0}%` },
                        { label: "Completion Rate",           val: `${analytics.engagement_metrics?.completion_rate || 0}%` },
                      ].map(({ label, val }) => (
                        <div key={label} className="metric-item">
                          <span className="metric-label">{label}</span>
                          <span className="metric-value">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ModalShell>
        )}

        {/* ══════════════════════════════════════
            SUBMISSION DETAIL MODAL
        ══════════════════════════════════════ */}
        {submissionDetailModal && selectedSubmission && (
          <ModalShell
            title="Submission Review"
            onClose={() => setSubmissionDetailModal(false)}
            maxWidth="720px"
            footer={
              <button className="btn-cancel" onClick={() => setSubmissionDetailModal(false)}>Close</button>
            }
          >
            <div className="submission-detail">
              {/* User info header */}
              <div className="submission-detail-header">
                <img
                  src={selectedSubmission.profile_image_url || "/default-avatar.png"}
                  alt={selectedSubmission.username}
                  className="submission-detail-avatar"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />
                <div className="submission-detail-info">
                  <h3>{selectedSubmission.title}</h3>
                  <p>by {selectedSubmission.username}</p>
                  <span className="submission-date">
                    {new Date(selectedSubmission.submitted_at).toLocaleDateString()}
                  </span>
                </div>
                <span className={`submission-detail-status submission-status ${selectedSubmission.status}`}>
                  {selectedSubmission.status}
                </span>
              </div>

              {/* Content */}
              <div className="submission-detail-content">
                {selectedSubmission.description && (
                  <div className="detail-section">
                    <h4>Description</h4>
                    <p>{selectedSubmission.description}</p>
                  </div>
                )}

                {selectedSubmission.video_url && (
                  <div className="detail-section">
                    <h4>Submission Video</h4>
                    <div className="video-container">
                      <a href={selectedSubmission.video_url} target="_blank" rel="noopener noreferrer" className="video-link-large">
                        <Play size={20} className="play-icon-large" /> Watch Video
                      </a>
                    </div>
                  </div>
                )}

                {selectedSubmission.admin_feedback && (
                  <div className="detail-section">
                    <h4>Admin Feedback</h4>
                    <div className="admin-feedback">{selectedSubmission.admin_feedback}</div>
                  </div>
                )}

                {/* Comments */}
                {selectedSubmission.comments?.length > 0 && (
                  <div className="detail-section">
                    <h4>Comments</h4>
                    <div className="comments-list">
                      {selectedSubmission.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <img
                            src={comment.profile_image_url || "/default-avatar.png"}
                            alt={comment.username}
                            className="comment-avatar"
                            onError={(e) => { e.target.src = "/default-avatar.png"; }}
                          />
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-username">{comment.username}</span>
                              <span className="comment-date">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                          <button className="comment-delete-btn" onClick={() => handleDeleteComment(comment.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin actions */}
                {selectedSubmission.status === "pending" && (
                  <div className="admin-actions">
                    <div className="feedback-input">
                      <label className="cp-form-label">Feedback (optional)</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="Add feedback for the creator..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </div>
                    <div className="action-buttons-group">
                      <button className="approve-btn-large" onClick={() => handleApproveSubmission(selectedSubmission.id)}>
                        <CheckCircle size={16} /> Approve Submission
                      </button>
                      <button className="reject-btn-large" onClick={() => handleRejectSubmission(selectedSubmission.id)}>
                        <XCircle size={16} /> Reject Submission
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalShell>
        )}

      </div>
    </div>
  );
};

export default ChallengePage;