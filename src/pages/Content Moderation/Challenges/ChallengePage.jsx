import React, { useEffect, useState, useRef } from "react";
import {
  Play, Eye, Edit3, Trash2, Users, TrendingUp, CheckCircle, XCircle,
  Clock, BarChart3, UserMinus, ThumbsUp, Upload, Calendar, Award,
  Plus, Search, X, AlertCircle, Download,
} from "lucide-react";

import {
  createChallengeService, getAllChallengesService, getChallengeDetailsService,
  updateChallengeService, deleteChallengeService, updateChallengeStatusService,
  getChallengeSubmissionsService, getPendingSubmissionsService,
  getSubmissionDetailsService, approveSubmissionService, rejectSubmissionService,
  deleteSubmissionService, getChallengeParticipantsService, removeParticipantService,
  getChallengeAnalyticsService, deleteCommentService,
} from "../../../services/challenge.service";

import { uploadMediaFile } from "../../../services/upload.service";
import { getDanceStyles } from "../../../services/masterData.service";
import "./ChallengePage.css";

// ─── Dance Styles Multi-Select (same as CreateProgramModal) ──────────────────
const DanceStylesSelect = ({ selected, onChange, options }) => {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle   = (name) => onChange(selected.includes(name) ? selected.filter(s => s !== name) : [...selected, name]);
  const filtered = options.filter(d => (d?.name || "").toLowerCase().includes((query || "").toLowerCase().trim()));

  return (
    <div style={{ position: "relative" }} ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.5rem 0.75rem", background: "#f8fafc",
          border: "1.5px solid " + (open ? "#ec4899" : "#e2e8f0"),
          borderRadius: "8px", cursor: "pointer", minHeight: "38px",
          boxShadow: open ? "0 0 0 3px rgba(236,72,153,0.1)" : "none",
          transition: "all 0.2s", boxSizing: "border-box", fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", flex: 1 }}>
          {selected.length ? selected.map(name => (
            <span key={name} style={{
              display: "inline-flex", alignItems: "center", gap: "3px",
              background: "linear-gradient(135deg,rgba(108,61,232,0.1),rgba(236,72,153,0.1))",
              border: "1px solid rgba(108,61,232,0.2)", borderRadius: "20px",
              padding: "1px 8px 1px 10px", fontSize: "0.75rem", fontWeight: 600, color: "#6c3de8",
            }}>
              {name}
              <button type="button"
                onClick={e => { e.stopPropagation(); onChange(selected.filter(s => s !== name)); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#6c3de8" }}>
                <X size={11} />
              </button>
            </span>
          )) : (
            <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Select dance styles</span>
          )}
        </div>
        <span style={{ color: "#94a3b8", fontSize: "0.7rem", marginLeft: "6px", flexShrink: 0 }}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
          background: "white", border: "1.5px solid #e2e8f0", borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(108,61,232,0.15)", overflow: "hidden",
        }}>
          <div style={{ padding: "8px" }}>
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search styles..." autoFocus
              style={{
                width: "100%", padding: "0.45rem 0.75rem", border: "1.5px solid #e2e8f0",
                borderRadius: "7px", fontSize: "0.8rem", outline: "none",
                boxSizing: "border-box", fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            {filtered.map(d => {
              const name    = d?.name || "";
              const checked = selected.includes(name);
              return (
                <label key={d.id ?? name} onClick={() => toggle(name)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.45rem 0.875rem", cursor: "pointer", fontSize: "0.85rem",
                    background: checked ? "rgba(108,61,232,0.05)" : "transparent",
                    color: checked ? "#6c3de8" : "#1e293b",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input type="checkbox" checked={checked} onChange={() => {}} style={{ accentColor: "#ec4899" }} />
                    {name}
                  </div>
                  {checked && <span style={{ color: "#ec4899", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>}
                </label>
              );
            })}
            {!options.length && (
              <div style={{ padding: "0.75rem", color: "#94a3b8", fontSize: "0.8rem", textAlign: "center" }}>
                No dance styles available.
              </div>
            )}
            {!!options.length && !filtered.length && (
              <div style={{ padding: "0.75rem", color: "#94a3b8", fontSize: "0.8rem", textAlign: "center" }}>
                No matches.
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", padding: "8px", borderTop: "1px solid #f1f5f9" }}>
            <button type="button" onClick={() => onChange([])}
              style={{ padding: "0.35rem 0.75rem", border: "1px solid #e2e8f0", borderRadius: "6px", background: "white", fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>
              Clear
            </button>
            <button type="button" onClick={() => setOpen(false)}
              style={{ padding: "0.35rem 0.75rem", border: "none", borderRadius: "6px", background: "linear-gradient(135deg,#6c3de8,#ec4899)", color: "white", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
// ─── Modal Shell ─────────────────────────────────────────────────────────────
const ModalShell = ({ title, onClose, maxWidth = "600px", children, footer }) => (
  <div className="modal-overlay-custom">
    <div className="modal-shell" style={{ maxWidth }}>
      <div className="modal-header-custom">
        <h5 className="modal-title-custom">{title}</h5>
        <button className="modal-close-custom" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="modal-body-custom">{children}</div>
      {footer && <div className="modal-footer-custom">{footer}</div>}
    </div>
  </div>
);

// ─── Alert Banner ─────────────────────────────────────────────────────────────
const AlertBanner = ({ type, message, onClose }) => (
  <div className={`alert-banner alert-banner--${type}`}>
    <AlertCircle size={18} className="alert-banner__icon" />
    <span className="alert-banner__msg">{message}</span>
    <button className="alert-banner__close" onClick={onClose}><X size={14} /></button>
  </div>
);

// ─── Form Field Wrapper ───────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="cp-form-group">
    <label className="cp-form-label">{label}</label>
    {children}
  </div>
);

const ChallengePage = () => {
  const [challenges,          setChallenges]          = useState([]);
  const [selectedChallenge,   setSelectedChallenge]   = useState(null);
  const [pagination,          setPagination]          = useState({});
  const [loading,             setLoading]             = useState(false);
  const [page,                setPage]                = useState(1);
  const [search,              setSearch]              = useState("");
  const [statusFilter,        setStatusFilter]        = useState("");
  const [activeTab,           setActiveTab]           = useState("challenges");
  const [uploading,           setUploading]           = useState(false);

  const [challengeDetailsModal,  setChallengeDetailsModal]  = useState(false);
  const [createChallengeModal,   setCreateChallengeModal]   = useState(false);
  const [editChallengeModal,     setEditChallengeModal]     = useState(false);
  const [submissionsModal,       setSubmissionsModal]       = useState(false);
  const [participantsModal,      setParticipantsModal]      = useState(false);
  const [analyticsModal,         setAnalyticsModal]         = useState(false);
  const [submissionDetailModal,  setSubmissionDetailModal]  = useState(false);

  const [submissions,        setSubmissions]        = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [participants,       setParticipants]       = useState([]);
  const [analytics,          setAnalytics]          = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Dance style options from API
  const [danceStyleOptions, setDanceStyleOptions] = useState([]);

  const [newChallenge, setNewChallenge] = useState({
    title: "", challenger_type: "public", description: "", image_url: "",
    dance_style: [],   // ← now an array
    dance_level: "", start_date: "", end_date: "",
    prize_details: "", max_participants: "", status: "draft", is_trending: false,
  });

  const [tasks, setTasks] = useState([
    { task_type: "watch_video", task_title: "", video_url: "" },
  ]);

  const [editChallenge,  setEditChallenge]  = useState({});
  const [feedbackText,   setFeedbackText]   = useState("");
  const [error,          setError]          = useState("");
  const [success,        setSuccess]        = useState("");

  // Load dance styles once
  useEffect(() => {
    getDanceStyles()
      .then(res => setDanceStyleOptions(Array.isArray(res) ? res : []))
      .catch(err => console.error("Failed to load dance styles", err));
  }, []);

  useEffect(() => {
    fetchChallenges();
    if (activeTab === "pending-submissions") fetchPendingSubmissions();
  }, [page, activeTab]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await getAllChallengesService(page, 20);
      setChallenges(response.challenges || []);
      setPagination(response.pagination || {});
    } catch { setError("Failed to fetch challenges"); }
    finally { setLoading(false); }
  };

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getPendingSubmissionsService(page, 20);
      setPendingSubmissions(response.submissions || []);
    } catch { setError("Failed to fetch pending submissions"); }
    finally { setLoading(false); }
  };

  const openChallengeDetails = async (challenge) => {
    try {
      const response = await getChallengeDetailsService(challenge.id);
      setSelectedChallenge(response || challenge);
      setChallengeDetailsModal(true);
    } catch { setError("Failed to fetch challenge details"); }
  };

  const openSubmissions = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const response = await getChallengeSubmissionsService(challenge.id);
      setSubmissions(response.submissions || []);
      setSubmissionsModal(true);
    } catch { setError("Failed to fetch submissions"); }
  };

  const openParticipants = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const response = await getChallengeParticipantsService(challenge.id);
      setParticipants(response.participants || []);
      setParticipantsModal(true);
    } catch { setError("Failed to fetch participants"); }
  };

  const openAnalytics = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const response = await getChallengeAnalyticsService(challenge.id);
      setAnalytics(response);
      setAnalyticsModal(true);
    } catch { setError("Failed to fetch analytics"); }
  };

  const openSubmissionDetail = async (submission) => {
    try {
      const response = await getSubmissionDetailsService(submission.id);
      setSelectedSubmission(response || submission);
      setSubmissionDetailModal(true);
    } catch { setError("Failed to fetch submission details"); }
  };

  const handleApproveSubmission = async (submissionId) => {
    try {
      await approveSubmissionService(submissionId, feedbackText);
      setSuccess("Submission approved successfully");
      setFeedbackText("");
      setSubmissionDetailModal(false);
      fetchPendingSubmissions();
    } catch { setError("Failed to approve submission"); }
  };

  const handleRejectSubmission = async (submissionId) => {
    try {
      await rejectSubmissionService(submissionId, feedbackText);
      setSuccess("Submission rejected");
      setFeedbackText("");
      setSubmissionDetailModal(false);
      fetchPendingSubmissions();
    } catch { setError("Failed to reject submission"); }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await deleteSubmissionService(submissionId);
      setSuccess("Submission deleted successfully");
      setSubmissionDetailModal(false);
      fetchPendingSubmissions();
    } catch { setError("Failed to delete submission"); }
  };

  const handleRemoveParticipant = async (challengeId, userId) => {
    if (!window.confirm("Remove this participant?")) return;
    try {
      await removeParticipantService(challengeId, userId);
      setSuccess("Participant removed successfully");
      openParticipants(selectedChallenge);
    } catch { setError("Failed to remove participant"); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteCommentService(commentId);
      setSuccess("Comment deleted successfully");
      if (selectedSubmission) openSubmissionDetail(selectedSubmission);
    } catch { setError("Failed to delete comment"); }
  };

  const addTask    = () => setTasks([...tasks, { task_type: "watch_video", task_title: "", video_url: "" }]);
  const removeTask = (i) => { if (tasks.length > 1) { const t = [...tasks]; t.splice(i, 1); setTasks(t); } };
  const updateTask = (i, field, val) => { const t = [...tasks]; t[i][field] = val; setTasks(t); };

  const handleFileUpload = async (event, fieldName, taskIndex = null) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileUrl = await uploadMediaFile(file);
      if (fieldName === "image_url") {
        setNewChallenge(prev => ({ ...prev, image_url: fileUrl }));
      } else if (fieldName === "video_url" && taskIndex !== null) {
        updateTask(taskIndex, "video_url", fileUrl);
      }
      setSuccess("File uploaded successfully");
    } catch { setError("Failed to upload file"); }
    finally { setUploading(false); }
  };

  const handleCreateChallenge = async () => {
    try {
      await createChallengeService({
        ...newChallenge,
        // send as comma-separated string or array depending on your API
        dance_style: Array.isArray(newChallenge.dance_style)
          ? newChallenge.dance_style.join(", ")
          : newChallenge.dance_style,
        tasks: tasks.filter(t => t.task_title.trim() !== ""),
      });
      setSuccess("Challenge created successfully");
      setCreateChallengeModal(false);
      setNewChallenge({
        title: "", challenger_type: "public", description: "", image_url: "",
        dance_style: [], dance_level: "", start_date: "", end_date: "",
        prize_details: "", max_participants: "", status: "draft", is_trending: false,
      });
      setTasks([{ task_type: "watch_video", task_title: "", video_url: "" }]);
      fetchChallenges();
    } catch { setError("Failed to create challenge"); }
  };

  const handleUpdateChallenge = async () => {
    try {
      await updateChallengeService(editChallenge.id, {
        ...editChallenge,
        dance_style: Array.isArray(editChallenge.dance_style)
          ? editChallenge.dance_style.join(", ")
          : editChallenge.dance_style,
      });
      setSuccess("Challenge updated successfully");
      setEditChallengeModal(false);
      fetchChallenges();
    } catch { setError("Failed to update challenge"); }
  };

  const handleStatusChange = async (challengeId, newStatus) => {
    try {
      await updateChallengeStatusService(challengeId, newStatus);
      setSuccess("Challenge status updated");
      fetchChallenges();
    } catch { setError("Failed to update challenge status"); }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!window.confirm("Delete this challenge?")) return;
    try {
      await deleteChallengeService(challengeId);
      setSuccess("Challenge deleted successfully");
      fetchChallenges();
    } catch { setError("Failed to delete challenge"); }
  };

  // When opening edit modal, normalise dance_style to array
  const openEditModal = (challenge) => {
    setEditChallenge({
      ...challenge,
      dance_style: typeof challenge.dance_style === "string"
        ? challenge.dance_style.split(",").map(s => s.trim()).filter(Boolean)
        : (challenge.dance_style || []),
    });
    setEditChallengeModal(true);
  };

  const filteredChallenges = challenges.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    return matchSearch && matchStatus;
  });



  return (
    <div className="challenge-page">
      <div className="challenge-content">

        {error   && <AlertBanner type="error"   message={error}   onClose={() => setError("")} />}
        {success && <AlertBanner type="success" message={success} onClose={() => setSuccess("")} />}

        {/* Header */}
        <div className="challenge-header">
          <div>
            <h1 className="page-title">Challenge Management</h1>
            
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-navigation">
          <div className="tab-nav">
            {[
              { id: "challenges",          label: "Challenges",          icon: Award },
              { id: "pending-submissions", label: "Pending Submissions", icon: Clock },
            ].map(tab => (
              <button key={tab.id} className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}>
                <tab.icon size={16} className="tab-icon" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Challenges Tab ── */}
        {activeTab === "challenges" && (
          <>
            <div className="filters-section">
              <div className="filters-container">
                <div className="filters-left">
                  <div className="search-container">
                    <Search size={16} className="search-icon" />
                    <input type="text" className="search-input" placeholder="Search challenges..."
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <button className="create-button" onClick={() => setCreateChallengeModal(true)}>
                  <Plus size={16} className="button-icon" /> Create Challenge
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-container"><div className="loading-spinner" /></div>
            ) : (
              <>
                <div className="challenges-grid">
                  {filteredChallenges.map(challenge => (
                    <div key={challenge.id} className="challenge-card">
                      {challenge.image_url && (
                        <img src={challenge.image_url} alt={challenge.title} className="challenge-image"
                          onError={e => { e.target.style.display = "none"; }} />
                      )}
                      <div className="challenge-content-area">
                        <div className="challenge-header-info">
                          <h5 className="challenge-title">{challenge.title}</h5>
                          <span className={`status-badge ${challenge.status}`}>{challenge.status}</span>
                        </div>
                        <p className="challenge-description">{challenge.description}</p>
                        <div className="challenge-stats">
                          <div className="stat-item"><Users size={14} className="stat-icon" />{challenge.participants_count || 0} participants</div>
                          <div className="stat-item"><Upload size={14} className="stat-icon" />{challenge.submissions_count || 0} submissions</div>
                          <div className="stat-item"><Clock size={14} className="stat-icon" />{challenge.pending_submissions || 0} pending</div>
                        </div>
                        <div className="challenge-actions" style={{ display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", gap:"0.5rem", paddingTop:"0.875rem", borderTop:"1px solid #e5e7eb", flexWrap:"nowrap" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", flexShrink:0 }}>
                            <button className="action-btn" title="View Details" onClick={() => openChallengeDetails(challenge)}><Eye size={13} /></button>
                            <button className="action-btn" title="Edit" onClick={() => openEditModal(challenge)}><Edit3 size={13} /></button>
                            <button className="action-btn" title="Submissions" onClick={() => openSubmissions(challenge)}><Upload size={13} /></button>
                            <button className="action-btn" title="Participants" onClick={() => openParticipants(challenge)}><Users size={13} /></button>
                            <button className="action-btn" title="Analytics" onClick={() => openAnalytics(challenge)}><BarChart3 size={13} /></button>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:"0.375rem", flexShrink:0 }}>
                            <select className="status-select" value={challenge.status}
                              onChange={e => handleStatusChange(challenge.id, e.target.value)}
                              style={{ width:"85px", height:"1.875rem", padding:"0 0.4rem", fontSize:"0.78rem", border:"1.5px solid #e5e7eb", borderRadius:"0.45rem", background:"#fff", cursor:"pointer" }}>
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="ended">Ended</option>
                            </select>
                            <button className="delete-btn" title="Delete" onClick={() => handleDeleteChallenge(challenge.id)}
                              style={{ width:"1.875rem", height:"1.875rem", minWidth:"1.875rem", display:"flex", alignItems:"center", justifyContent:"center", border:"1.5px solid #fecaca", borderRadius:"0.45rem", background:"#fff5f5", color:"#dc2626", cursor:"pointer", padding:0, flexShrink:0 }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="pagination">
                    <div className="pagination-info">
                      <p>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</p>
                    </div>
                    <div className="pagination-controls">
                      <button className="pagination-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Previous</button>
                      <button className="pagination-btn" onClick={() => setPage(p => Math.min(pagination.pages, p+1))} disabled={page === pagination.pages}>Next</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── Pending Submissions Tab ── */}
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
                {pendingSubmissions.map(submission => (
                  <div key={submission.id} className="submission-item">
                    <div className="submission-info">
                      <img src={submission.profile_image_url || "/default-avatar.png"} alt={submission.username}
                        className="submission-avatar" onError={e => { e.target.src = "/default-avatar.png"; }} />
                      <div className="submission-details">
                        <h3>{submission.title}</h3>
                        <p className="submission-meta">by {submission.username} · {new Date(submission.submitted_at).toLocaleDateString()}</p>
                        <p className="submission-challenge">{submission.challenge_title}</p>
                      </div>
                    </div>
                    <div className="submission-actions">
                      <button className="review-btn" onClick={() => openSubmissionDetail(submission)}>Review</button>
                      <button className="approve-btn" onClick={() => handleApproveSubmission(submission.id)}>Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ CREATE CHALLENGE MODAL ══ */}
        {createChallengeModal && (
          <ModalShell title="Create New Challenge" onClose={() => setCreateChallengeModal(false)} maxWidth="640px"
            footer={
              <>
                <button className="btn-cancel" onClick={() => setCreateChallengeModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleCreateChallenge}>Create Challenge</button>
              </>
            }>

            <Field label="Title">
              <input type="text" className="form-input" value={newChallenge.title}
                onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })} />
            </Field>

            <Field label="Description">
              <textarea className="form-textarea" rows={3} value={newChallenge.description}
                onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })} />
            </Field>

            <div className="form-row">
              {/* ── Dance Style: chip multi-select ── */}
              <Field label="Dance Style">
                <DanceStylesSelect
                  selected={newChallenge.dance_style}
                  onChange={val => setNewChallenge({ ...newChallenge, dance_style: val })}
                  options={danceStyleOptions}
                />
              </Field>

              <Field label="Dance Level">
                <select className="form-select" value={newChallenge.dance_level}
                  onChange={e => setNewChallenge({ ...newChallenge, dance_level: e.target.value })}>
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
                  onChange={e => setNewChallenge({ ...newChallenge, start_date: e.target.value })} />
              </Field>
              <Field label="End Date">
                <input type="date" className="form-input" value={newChallenge.end_date}
                  onChange={e => setNewChallenge({ ...newChallenge, end_date: e.target.value })} />
              </Field>
            </div>

            <Field label="Prize Details">
              <input type="text" className="form-input" value={newChallenge.prize_details}
                onChange={e => setNewChallenge({ ...newChallenge, prize_details: e.target.value })} />
            </Field>

            <Field label="Max Participants">
              <input type="number" className="form-input" value={newChallenge.max_participants}
                onChange={e => setNewChallenge({ ...newChallenge, max_participants: e.target.value })} />
            </Field>

            <Field label="Challenge Image">
              <input type="file" className="form-input" accept="image/*"
                onChange={e => handleFileUpload(e, "image_url")} disabled={uploading} />
              {newChallenge.image_url && (
                <div className="cp-img-preview">
                  <img src={newChallenge.image_url} alt="Preview" className="cp-img-preview__img" />
                  <button className="cp-img-preview__remove" onClick={() => setNewChallenge({ ...newChallenge, image_url: "" })}><X size={12} /></button>
                </div>
              )}
            </Field>

            <Field label="Challenge Type">
              <select className="form-select" value={newChallenge.challenger_type}
                onChange={e => setNewChallenge({ ...newChallenge, challenger_type: e.target.value })}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </Field>

            <div className="cp-form-group">
              <label className="form-checkbox">
                <input type="checkbox" checked={newChallenge.is_trending}
                  onChange={e => setNewChallenge({ ...newChallenge, is_trending: e.target.checked })} />
                Mark as Trending
              </label>
            </div>

            {/* Tasks */}
            <div className="cp-form-group">
              <div className="cp-tasks-header">
                <label className="cp-form-label">Challenge Tasks</label>
                <button className="btn-primary btn-sm-custom" onClick={addTask}><Plus size={14} /> Add Task</button>
              </div>
              {tasks.map((task, index) => (
                <div key={index} className="cp-task-card">
                  <div className="form-row">
                    <Field label="Task Type">
                      <select className="form-select" value={task.task_type}
                        onChange={e => updateTask(index, "task_type", e.target.value)}>
                        <option value="watch_video">Watch Video</option>
                        <option value="upload_video">Upload Video</option>
                      </select>
                    </Field>
                    <div className="cp-task-remove-wrap">
                      <button className="delete-btn" onClick={() => removeTask(index)} disabled={tasks.length === 1}><X size={14} /></button>
                    </div>
                  </div>
                  <Field label="Task Title">
                    <input type="text" className="form-input" placeholder="Enter task title"
                      value={task.task_title} onChange={e => updateTask(index, "task_title", e.target.value)} />
                  </Field>
                  {task.task_type === "watch_video" && (
                    <Field label="Video Upload">
                      <input type="file" className="form-input" accept="video/*"
                        onChange={e => handleFileUpload(e, "video_url", index)} disabled={uploading} />
                      {task.video_url && (
                        <div className="cp-img-preview">
                          <video src={task.video_url} className="cp-img-preview__img" controls />
                          <button className="cp-img-preview__remove" onClick={() => updateTask(index, "video_url", "")}><X size={12} /></button>
                        </div>
                      )}
                    </Field>
                  )}
                </div>
              ))}
            </div>
          </ModalShell>
        )}

        {/* ══ EDIT CHALLENGE MODAL ══ */}
        {editChallengeModal && (
          <ModalShell title="Edit Challenge" onClose={() => setEditChallengeModal(false)} maxWidth="580px"
            footer={
              <>
                <button className="btn-cancel" onClick={() => setEditChallengeModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleUpdateChallenge}>Update Challenge</button>
              </>
            }>

            <Field label="Title">
              <input type="text" className="form-input" value={editChallenge.title || ""}
                onChange={e => setEditChallenge({ ...editChallenge, title: e.target.value })} />
            </Field>

            <Field label="Description">
              <textarea className="form-textarea" rows={3} value={editChallenge.description || ""}
                onChange={e => setEditChallenge({ ...editChallenge, description: e.target.value })} />
            </Field>

            <div className="form-row">
              {/* ── Dance Style: chip multi-select ── */}
              <Field label="Dance Style">
                <DanceStylesSelect
                  selected={editChallenge.dance_style || []}
                  onChange={val => setEditChallenge({ ...editChallenge, dance_style: val })}
                  options={danceStyleOptions}
                />
              </Field>

              <Field label="Dance Level">
                <select className="form-select" value={editChallenge.dance_level || ""}
                  onChange={e => setEditChallenge({ ...editChallenge, dance_level: e.target.value })}>
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>
            </div>

            <Field label="Prize Details">
              <input type="text" className="form-input" value={editChallenge.prize_details || ""}
                onChange={e => setEditChallenge({ ...editChallenge, prize_details: e.target.value })} />
            </Field>

            <Field label="Max Participants">
              <input type="number" className="form-input" value={editChallenge.max_participants || ""}
                onChange={e => setEditChallenge({ ...editChallenge, max_participants: e.target.value })} />
            </Field>

            <Field label="Image URL">
              <input type="url" className="form-input" value={editChallenge.image_url || ""}
                onChange={e => setEditChallenge({ ...editChallenge, image_url: e.target.value })} />
            </Field>

            <div className="cp-form-group">
              <label className="form-checkbox">
                <input type="checkbox" checked={editChallenge.is_trending || false}
                  onChange={e => setEditChallenge({ ...editChallenge, is_trending: e.target.checked })} />
                Mark as Trending
              </label>
            </div>
          </ModalShell>
        )}

        {/* ══ CHALLENGE DETAILS MODAL ══ */}
        {challengeDetailsModal && selectedChallenge && (
          <ModalShell title="Challenge Details" onClose={() => setChallengeDetailsModal(false)} maxWidth="860px"
            footer={<button className="btn-cancel" onClick={() => setChallengeDetailsModal(false)}>Close</button>}>
            <div className="challenge-details">
              <div>
                {selectedChallenge.challenge?.image_url && (
                  <img src={selectedChallenge.challenge.image_url} alt={selectedChallenge.challenge.title} className="details-image" />
                )}
                <h4 className="details-title">{selectedChallenge.challenge?.title}</h4>
                <p className="details-description">{selectedChallenge.challenge?.description}</p>
                <div className="details-info">
                  <div className="info-item"><Calendar size={16} className="info-icon" />
                    {new Date(selectedChallenge.challenge?.start_date).toLocaleDateString()} –{" "}
                    {new Date(selectedChallenge.challenge?.end_date).toLocaleDateString()}
                  </div>
                  <div className="info-item"><Award size={16} className="info-icon" />{selectedChallenge.challenge?.dance_style}</div>
                  <div className="info-item"><TrendingUp size={16} className="info-icon" />{selectedChallenge.challenge?.dance_level}</div>
                  {selectedChallenge.challenge?.prize_details && (
                    <div className="info-item"><Award size={16} className="info-icon" />{selectedChallenge.challenge.prize_details}</div>
                  )}
                  <div className="info-item"><Users size={16} className="info-icon" />Max: {selectedChallenge.challenge?.max_participants || "Unlimited"} participants</div>
                </div>
              </div>
              <div>
                <div className="row mb-4">
                  {[
                    { icon: Users,  val: selectedChallenge.challenge?.total_participants || 0,  label: "Participants" },
                    { icon: Upload, val: selectedChallenge.challenge?.total_submissions    || 0, label: "Submissions" },
                    { icon: Clock,  val: selectedChallenge.challenge?.pending_submissions  || 0, label: "Pending" },
                  ].map(({ icon: Icon, val, label }) => (
                    <div key={label} className="col-6">
                      <div className="card text-center">
                        <div className="card-body">
                          <Icon size={24} className="text-primary mb-2" />
                          <h4>{val}</h4>
                          <p className="text-muted mb-0">{label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedChallenge.challenge?.tasks?.length > 0 && (
                  <div className="challenge-tasks">
                    <h4>Challenge Tasks</h4>
                    <div className="tasks-list">
                      {selectedChallenge.challenge.tasks.map((task, i) => (
                        <div key={i} className="task-item">
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

        {/* ══ SUBMISSIONS MODAL ══ */}
        {submissionsModal && selectedChallenge && (
          <ModalShell title={`Submissions — ${selectedChallenge.title}`} onClose={() => setSubmissionsModal(false)} maxWidth="1000px"
            footer={<button className="btn-cancel" onClick={() => setSubmissionsModal(false)}>Close</button>}>
            {submissions.length === 0 ? (
              <div className="empty-state"><Upload size={48} className="empty-icon" /><p className="empty-text">No submissions found</p></div>
            ) : (
              <div className="submissions-grid">
                {submissions.map(sub => (
                  <div key={sub.id} className="submission-card">
                    <div className="submission-header">
                      <img src={sub.profile_image_url || "/default-avatar.png"} alt={sub.username}
                        className="submission-user-avatar" onError={e => { e.target.src = "/default-avatar.png"; }} />
                      <div className="submission-user-info">
                        <h4>{sub.username}</h4>
                        <p>{new Date(sub.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`submission-status ${sub.status}`}>{sub.status}</span>
                    </div>
                    <div className="submission-content">
                      <h5>{sub.title}</h5>
                      {sub.description && <p className="submission-desc">{sub.description}</p>}
                      {sub.video_url && (
                        <div className="submission-video">
                          <a href={sub.video_url} target="_blank" rel="noopener noreferrer" className="video-link">
                            <Play size={13} /> Watch Submission
                          </a>
                        </div>
                      )}
                      <div className="submission-actions">
                        <button className="view-detail-btn" onClick={() => openSubmissionDetail(sub)}><Eye size={13} /> View</button>
                        {sub.status === "pending" && (
                          <>
                            <button className="approve-btn" onClick={() => handleApproveSubmission(sub.id)}><CheckCircle size={13} /> Approve</button>
                            <button className="reject-btn"  onClick={() => handleRejectSubmission(sub.id)}><XCircle size={13} /> Reject</button>
                          </>
                        )}
                        <button className="reject-btn" onClick={() => handleDeleteSubmission(sub.id)}><Trash2 size={13} /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalShell>
        )}

        {/* ══ PARTICIPANTS MODAL ══ */}
        {participantsModal && selectedChallenge && (
          <ModalShell title={`Participants — ${selectedChallenge.title}`} onClose={() => setParticipantsModal(false)} maxWidth="720px"
            footer={<button className="btn-cancel" onClick={() => setParticipantsModal(false)}>Close</button>}>
            {participants.length === 0 ? (
              <div className="empty-state"><Users size={48} className="empty-icon" /><p className="empty-text">No participants found</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {participants.map(p => (
                  <div key={p.user_id} style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.75rem 1rem", background: "white",
                    border: "1.5px solid #f1f5f9", borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}>
                    {/* Avatar */}
                    <img
                      src={p.profile_image_url || "/default-avatar.png"}
                      alt={p.username}
                      onError={e => { e.target.src = "/default-avatar.png"; }}
                      style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        objectFit: "cover", flexShrink: 0,
                        border: "2px solid #e2e8f0",
                      }}
                    />

                    {/* Info — takes all available space */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b", marginBottom: "1px" }}>
                        {p.username}
                      </div>
                      <div style={{
                        fontSize: "0.78rem", color: "#64748b",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        marginBottom: "3px",
                      }}>
                        {p.email}
                      </div>
                      <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                          Joined: {new Date(p.joined_at).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#6c3de8", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Upload size={11} /> {p.submissions_count || 0} submissions
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#ec4899", display: "flex", alignItems: "center", gap: "3px" }}>
                          <ThumbsUp size={11} /> {p.likes_received || 0} likes
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveParticipant(selectedChallenge.id, p.user_id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        padding: "0.4rem 0.875rem", flexShrink: 0,
                        background: "rgba(239,68,68,0.06)",
                        border: "1.5px solid rgba(239,68,68,0.25)",
                        borderRadius: "8px", color: "#dc2626",
                        fontSize: "0.78rem", fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      <UserMinus size={13} /> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ModalShell>
        )}

        {/* ══ ANALYTICS MODAL ══ */}
        {analyticsModal && selectedChallenge && analytics && (
          <ModalShell title={`Analytics — ${selectedChallenge.title}`} onClose={() => setAnalyticsModal(false)} maxWidth="1000px"
            footer={<button className="btn-cancel" onClick={() => setAnalyticsModal(false)}>Close</button>}>
            <div className="analytics-container">
              <div className="analytics-card">
                <div className="analytics-card-header"><h3>Overview</h3><BarChart3 size={20} className="analytics-icon" /></div>
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
              {analytics.analytics?.top_performers?.length > 0 && (
                <div className="analytics-overview">
                  <div className="analytics-card">
                    <div className="analytics-card-header"><h3>Top Performers</h3><Award size={18} className="analytics-icon" /></div>
                    <div className="top-performers-list">
                      {analytics.analytics.top_performers.map((p, i) => (
                        <div key={p.user_id} className="top-performer-item">
                          <div className="performer-rank">{i + 1}</div>
                          <img src={p.profile_image_url || "/default-avatar.png"} alt={p.username}
                            className="performer-avatar" onError={e => { e.target.src = "/default-avatar.png"; }} />
                          <div className="performer-info">
                            <span className="performer-name">{p.username}</span>
                            <span className="performer-stats">{p.likes_count} likes · {p.submissions_count} submissions</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="analytics-card">
                    <div className="analytics-card-header"><h3>Engagement Metrics</h3><TrendingUp size={18} className="analytics-icon" /></div>
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

        {/* ══ SUBMISSION DETAIL MODAL ══ */}
        {submissionDetailModal && selectedSubmission && (
          <ModalShell title="Submission Review" onClose={() => setSubmissionDetailModal(false)} maxWidth="720px"
            footer={<button className="btn-cancel" onClick={() => setSubmissionDetailModal(false)}>Close</button>}>
            <div className="submission-detail">
              <div className="submission-detail-header">
                <img src={selectedSubmission.profile_image_url || "/default-avatar.png"} alt={selectedSubmission.username}
                  className="submission-detail-avatar" onError={e => { e.target.src = "/default-avatar.png"; }} />
                <div className="submission-detail-info">
                  <h3>{selectedSubmission.title}</h3>
                  <p>by {selectedSubmission.username}</p>
                  <span className="submission-date">{new Date(selectedSubmission.submitted_at).toLocaleDateString()}</span>
                </div>
                <span className={`submission-detail-status submission-status ${selectedSubmission.status}`}>{selectedSubmission.status}</span>
              </div>
              <div className="submission-detail-content">
                {selectedSubmission.description && (
                  <div className="detail-section"><h4>Description</h4><p>{selectedSubmission.description}</p></div>
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
                  <div className="detail-section"><h4>Admin Feedback</h4><div className="admin-feedback">{selectedSubmission.admin_feedback}</div></div>
                )}
                {selectedSubmission.comments?.length > 0 && (
                  <div className="detail-section">
                    <h4>Comments</h4>
                    <div className="comments-list">
                      {selectedSubmission.comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                          <img src={comment.profile_image_url || "/default-avatar.png"} alt={comment.username}
                            className="comment-avatar" onError={e => { e.target.src = "/default-avatar.png"; }} />
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-username">{comment.username}</span>
                              <span className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                          <button className="comment-delete-btn" onClick={() => handleDeleteComment(comment.id)}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedSubmission.status === "pending" && (
                  <div className="admin-actions">
                    <div className="feedback-input">
                      <label className="cp-form-label">Feedback (optional)</label>
                      <textarea className="form-textarea" rows={3} placeholder="Add feedback for the creator..."
                        value={feedbackText} onChange={e => setFeedbackText(e.target.value)} />
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