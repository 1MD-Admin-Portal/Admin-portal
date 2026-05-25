import React, { useEffect, useState, useRef } from "react";
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
  Flag,
  MessageSquare,
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
  getFlaggedCommentsService,
} from "../../../services/challenge.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../../../components/common/Pagination";
import { uploadMediaFile } from "../../../services/upload.service";
import { getDanceStyles } from "../../../services/masterData.service";
import "./ChallengePage.css";

// ─── Dance Styles Multi-Select ────────────────────────────────────────────────
const DanceStylesSelect = ({ selected, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (name) =>
    onChange(
      selected.includes(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name],
    );
  const filtered = options.filter((d) =>
    (d?.name || "").toLowerCase().includes((query || "").toLowerCase().trim()),
  );

  return (
    <div className="ds-wrap" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`ds-trigger ${open ? "ds-trigger--open" : ""}`}
      >
        <div className="ds-selected-list">
          {selected.length ? (
            selected.map((name) => (
              <span key={name} className="ds-chip">
                {name}
                <span
                  className="ds-chip__remove"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selected.filter((s) => s !== name));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange(selected.filter((s) => s !== name));
                    }
                  }}
                >
                  <X size={11} />
                </span>
              </span>
            ))
          ) : (
            <span className="ds-placeholder">Select dance styles</span>
          )}
        </div>
        <span className="ds-arrow">▾</span>
      </button>

      {open && (
        <div className="ds-dropdown">
          <div className="ds-search-wrap">
            <input
              type="text"
              className="ds-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles..."
              autoFocus
            />
          </div>
          <div className="ds-options">
            {filtered.map((d) => {
              const name = d?.name || "";
              const checked = selected.includes(name);
              return (
                <label
                  key={d.id ?? name}
                  className={`ds-option ${checked ? "ds-option--checked" : ""}`}
                  onClick={() => toggle(name)}
                >
                  <div className="ds-option__left">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="ds-checkbox"
                    />
                    {name}
                  </div>
                  {checked && <span className="ds-check">✓</span>}
                </label>
              );
            })}
            {!options.length && (
              <div className="ds-empty">No dance styles available.</div>
            )}
            {!!options.length && !filtered.length && (
              <div className="ds-empty">No matches.</div>
            )}
          </div>
          <div className="ds-footer">
            <button
              type="button"
              className="ds-clear"
              onClick={() => onChange([])}
            >
              Clear
            </button>
            <button
              type="button"
              className="ds-done"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Modal Shell ──────────────────────────────────────────────────────────────
const ModalShell = ({
  title,
  onClose,
  maxWidth = "600px",
  children,
  footer,
}) => (
  <div className="modal-overlay-custom" onClick={onClose}>
    <div
      className="modal-shell"
      style={{ maxWidth }}
      onClick={(e) => e.stopPropagation()}
    >
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

// ─── Alert Banner ─────────────────────────────────────────────────────────────
const AlertBanner = ({ type, message, onClose }) => (
  <div className={`alert-banner alert-banner--${type}`}>
    <AlertCircle size={18} className="alert-banner__icon" />
    <span className="alert-banner__msg">{message}</span>
    <button className="alert-banner__close" onClick={onClose}>
      <X size={14} />
    </button>
  </div>
);

// ─── Form Field Wrapper ───────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="cp-form-group">
    <label className="cp-form-label">{label}</label>
    {children}
  </div>
);

// ─── Severity Badge ───────────────────────────────────────────────────────────
const SeverityBadge = ({ count }) => {
  const level = count >= 5 ? "high" : count >= 2 ? "medium" : "low";
  return (
    <span className={`severity-badge severity-badge--${level}`}>
      {level} · {count} {count === 1 ? "report" : "reports"}
    </span>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
const ConfirmDialog = ({ message, onConfirm, onClose }) => (
  <div
    className="modal-overlay-custom"
    style={{ zIndex: 2000 }}
    onClick={onClose}
  >
    <div
      className="modal-shell"
      style={{ maxWidth: "420px" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="modal-header-custom"
        style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}
      >
        <h5 className="modal-title-custom">Confirm Action</h5>
        <button className="modal-close-custom" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="modal-body-custom">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "0.5rem 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trash2 size={24} color="#ef4444" />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            {message}
          </p>
        </div>
      </div>
      <div className="modal-footer-custom">
        {/* <button className="btn-cancel" onClick={onClose}>Cancel</button> */}
        <button
          className="reject-btn-large"
          style={{ flex: "none", minWidth: "auto" }}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
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

  // const [flaggedComments,        setFlaggedComments]        = useState([]);
  const [flaggedPage, setFlaggedPage] = useState(1);
  const [flaggedPagination, setFlaggedPagination] = useState({});
  const [flaggedSearch, setFlaggedSearch] = useState("");
  const [flaggedLoading, setFlaggedLoading] = useState(false);
  // const [selectedFlaggedComment, setSelectedFlaggedComment] = useState(null);
  const [flaggedDetailModal, setFlaggedDetailModal] = useState(false);

  const [danceStyleOptions, setDanceStyleOptions] = useState([]);

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    challenger_type: "public",
    description: "",
    image_url: "",
    dance_style: [],
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
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });

  const showConfirm = (message, onConfirm) =>
    setConfirmDialog({ open: true, message, onConfirm });
  const closeConfirm = () =>
    setConfirmDialog({ open: false, message: "", onConfirm: null });

  // Load dance styles
  useEffect(() => {
    getDanceStyles()
      .then((res) => setDanceStyleOptions(Array.isArray(res) ? res : []))
      .catch((err) => console.error("Failed to load dance styles", err));
  }, []);

  // Auto-dismiss alerts
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // Tab data fetch
  useEffect(() => {
    if (activeTab === "challenges") fetchChallenges();
    if (activeTab === "pending-submissions") fetchPendingSubmissions();
    // if (activeTab === "flagged-comments")    fetchFlaggedComments();
  }, [page, activeTab]);

  // ── Fetch functions ──────────────────────────────────────────────────────────
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const r = await getAllChallengesService(page, 20);
      setChallenges(r.challenges || []);
      setPagination(r.pagination || {});
    } catch {
      setError("Failed to fetch challenges");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      const r = await getPendingSubmissionsService(page, 20);
      setPendingSubmissions(r.submissions || []);
    } catch {
      setError("Failed to fetch pending submissions");
    } finally {
      setLoading(false);
    }
  };

  // const fetchFlaggedComments = async () => {
  //   try {
  //     setFlaggedLoading(true);
  //     const r = await getFlaggedCommentsService(flaggedPage, 20);
  //     setFlaggedComments(r.comments || r.data || []);
  //     setFlaggedPagination(r.pagination || {});
  //   } catch { setError("Failed to fetch flagged comments"); } finally { setFlaggedLoading(false); }
  // };

  // ── Open modals ──────────────────────────────────────────────────────────────
  const openChallengeDetails = async (challenge) => {
    try {
      const r = await getChallengeDetailsService(challenge.id);
      setSelectedChallenge(r || challenge);
      setChallengeDetailsModal(true);
    } catch {
      setError("Failed to fetch challenge details");
    }
  };


  const toLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

  const openSubmissions = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const r = await getChallengeSubmissionsService(challenge.id);
      setSubmissions(r.submissions || []);
      setSubmissionsModal(true);
    } catch {
      setError("Failed to fetch submissions");
    }
  };

  const openParticipants = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const r = await getChallengeParticipantsService(challenge.id);
      setParticipants(r.participants || []);
      setParticipantsModal(true);
    } catch {
      setError("Failed to fetch participants");
    }
  };

  const openAnalytics = async (challenge) => {
    try {
      setSelectedChallenge(challenge);
      const r = await getChallengeAnalyticsService(challenge.id);
      setAnalytics(r);
      setAnalyticsModal(true);
    } catch {
      setError("Failed to fetch analytics");
    }
  };

  const openSubmissionDetail = async (submission) => {
    try {
      const r = await getSubmissionDetailsService(submission.id);
      setSelectedSubmission(r?.submission || r?.data || r || submission);
      setSubmissionDetailModal(true);
    } catch {
      setError("Failed to fetch submission details");
    }
  };

  // const openFlaggedDetail = (comment) => { setSelectedFlaggedComment(comment); setFlaggedDetailModal(true); };

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleApproveSubmission = async (id) => {
    try {
      await approveSubmissionService(id, feedbackText);
      setSuccess("Submission approved");
      setFeedbackText("");
      setSubmissionDetailModal(false);
      fetchPendingSubmissions();
    } catch {
      setError("Failed to approve submission");
    }
  };

  const handleRejectSubmission = async (id) => {
    try {
      await rejectSubmissionService(id, feedbackText);
      setSuccess("Submission rejected");
      setFeedbackText("");
      setSubmissionDetailModal(false);
      fetchPendingSubmissions();
    } catch {
      setError("Failed to reject submission");
    }
  };

  const handleDeleteSubmission = (id) => {
    showConfirm(
      "Delete this submission? This action cannot be undone.",
      async () => {
        try {
          await deleteSubmissionService(id);
          setSubmissions((prev) => prev.filter((s) => s.id !== id));
          setSuccess("Submission deleted");
          setSubmissionDetailModal(false);
          fetchPendingSubmissions();
        } catch {
          setError("Failed to delete submission");
        }
      },
    );
  };

  const handleRemoveParticipant = (challengeId, userId) => {
    showConfirm("Remove this participant from the challenge?", async () => {
      try {
        await removeParticipantService(challengeId, userId);
        setSuccess("Participant removed");
        openParticipants(selectedChallenge);
      } catch {
        setError("Failed to remove participant");
      }
    });
  };

  const handleDeleteComment = (id) => {
    showConfirm(
      "Delete this comment? This action cannot be undone.",
      async () => {
        try {
          await deleteCommentService(id);
          setSuccess("Comment deleted");
          if (selectedSubmission) openSubmissionDetail(selectedSubmission);
        } catch {
          setError("Failed to delete comment");
        }
      },
    );
  };

  // const handleDeleteFlaggedComment = (id) => {
  //   showConfirm("Permanently delete this flagged comment?", async () => {
  //     try { await deleteCommentService(id); setSuccess("Flagged comment deleted"); setFlaggedDetailModal(false); setSelectedFlaggedComment(null); fetchFlaggedComments(); }
  //     catch { setError("Failed to delete flagged comment"); }
  //   });
  // };

  const addTask = () =>
    setTasks([
      ...tasks,
      { task_type: "watch_video", task_title: "", video_url: "" },
    ]);
  const removeTask = (i) => {
    if (tasks.length > 1) {
      const t = [...tasks];
      t.splice(i, 1);
      setTasks(t);
    }
  };
  const updateTask = (i, field, val) => {
    const t = [...tasks];
    t[i][field] = val;
    setTasks(t);
  };

  const handleFileUpload = async (event, fieldName, taskIndex = null) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMediaFile(file);
      if (fieldName === "image_url")
        setNewChallenge((prev) => ({ ...prev, image_url: url }));
      else if (fieldName === "video_url" && taskIndex !== null)
        updateTask(taskIndex, "video_url", url);
      setSuccess("File uploaded successfully");
    } catch {
      setError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  

  const handleCreateChallenge = async () => {
  // ── Client-side validation ──
  if (!newChallenge.title.trim()) {
    setError("Title is required.");
    return;
  }
  if (!newChallenge.description.trim()) {
    setError("Description is required.");
    return;
  }

  try {
    await createChallengeService({
        ...newChallenge,
        dance_style: Array.isArray(newChallenge.dance_style)
          ? newChallenge.dance_style.join(", ")
          : newChallenge.dance_style,
        tasks: tasks.filter((t) => t.task_title.trim() !== ""),
      });
      setSuccess("Challenge created successfully");
      setCreateChallengeModal(false);
      setNewChallenge({
        title: "",
        challenger_type: "public",
        description: "",
        image_url: "",
        dance_style: [],
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
    } catch {
      setError("Failed to create challenge");
    }
  };

  const handleUpdateChallenge = async () => {
    try {
      const payload = {
        title: editChallenge.title,
        description: editChallenge.description,
        dance_style: Array.isArray(editChallenge.dance_style)
          ? editChallenge.dance_style.join(", ")
          : editChallenge.dance_style,
        dance_level: editChallenge.dance_level,
        prize_details: editChallenge.prize_details,
        max_participants: editChallenge.max_participants,
        image_url: editChallenge.image_url,
        is_trending: editChallenge.is_trending,
      };
      await updateChallengeService(editChallenge.id, payload);
      setSuccess("Challenge updated");
      setEditChallengeModal(false);
      fetchChallenges();
    } catch {
      setError("Failed to update challenge");
    }
  };

  const handleStatusChange = async (challengeId, newStatus) => {
    try {
      await updateChallengeStatusService(challengeId, newStatus);
      setSuccess("Status updated");
      fetchChallenges();
    } catch {
      setError("Failed to update status");
    }
  };

  const handleDeleteChallenge = (id) => {
    showConfirm(
      "Delete this challenge? This action cannot be undone.",
      async () => {
        try {
          await deleteChallengeService(id);
          setSuccess("Challenge deleted");
          fetchChallenges();
        } catch {
          setError("Failed to delete challenge");
        }
      },
    );
  };

  const openEditModal = (challenge) => {
    setEditChallenge({
      ...challenge,
      dance_style:
        typeof challenge.dance_style === "string"
          ? challenge.dance_style
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : challenge.dance_style || [],
    });
    setEditChallengeModal(true);
  };

  // ── Filters ──────────────────────────────────────────────────────────────────
  const filteredChallenges = challenges.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  // const filteredFlaggedComments = flaggedComments.filter(c => {
  //   const q = flaggedSearch.toLowerCase();
  //   return !q ||
  //     (c.content || c.comment || "").toLowerCase().includes(q) ||
  //     (c.username || c.user?.username || "").toLowerCase().includes(q) ||
  //     (c.challenge_title || "").toLowerCase().includes(q);
  // });

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="fp-main-container">
      {/* ── Header + Tabs ── */}
      <div className="fp-header-section">
        <h2 className="fp-main-title">Challenge Management</h2>
        <div className="fp-tab-nav">
          {[
            { id: "challenges", label: "Challenges", icon: Award },
            {
              id: "pending-submissions",
              label: "Pending Submissions",
              icon: Clock,
            },
            // { id: "flagged-comments",    label: "Flagged Comments",    icon: Flag  },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`fp-nav-tab ${activeTab === tab.id ? "fp-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <AlertBanner
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}
      {success && (
        <AlertBanner
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      {/* ══ Challenges Tab ══ */}
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
                  {/* <option value="completed">Completed</option> */}
                  <option value="ended">Ended</option>
                </select>
              </div>
              <button
                className="create-button"
                onClick={() => setCreateChallengeModal(true)}
              >
                <Plus size={16} className="button-icon" /> Create Challenge
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
            </div>
          ) : (
            <>
              {/* ── Cards Grid ── */}
              <div className="fp-content-grid">
                {filteredChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="fp-content-card"
                    onClick={() => openChallengeDetails(challenge)}
                  >
                    {/* Thumbnail */}
                    <div className="fp-thumbnail-wrap">
                      {challenge.image_url ? (
                        <img
                          src={challenge.image_url}
                          alt={challenge.title}
                          className="fp-media-thumb"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="fp-media-thumb fp-media-placeholder">
                          <Award size={36} />
                        </div>
                      )}
                      <div className="fp-likes-badge">
                        <span className={`status-badge ${challenge.status}`}>
                          {challenge.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="fp-card-body">
                      {/* ── TOP: title, tags, description, stats — does NOT grow ── */}

                      <div className="fp-user-details">
                        <h3 className="fp-username">{challenge.title}</h3>
                        <div className="fp-meta-tags">
                          {challenge.dance_style &&
                            challenge.dance_style.split(",").map((style, i) => {
                              const trimmed = style.trim();
                              return (
                                <span
                                  key={i}
                                  className={`fp-style-tag fp-style-${trimmed.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                  {trimmed}
                                </span>
                              );
                            })}
                          {challenge.dance_level && (
                            <span
                              className={`fp-level-tag fp-level-${challenge.dance_level?.toLowerCase()}`}
                            >
                              {challenge.dance_level}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="fp-post-caption">{challenge.description}</p>
                      <div className="fp-card-top">
                        <div className="fp-engagement-stats">
                          <div className="fp-stat-group">
                            <Users size={14} />
                            <span>
                              {challenge.participants_count || 0} Participants
                            </span>
                          </div>
                          <div className="fp-stat-group">
                            <Upload size={14} />
                            <span>
                              {challenge.submissions_count || 0} Submissions
                            </span>
                          </div>
                          <div className="fp-stat-group">
                            <Clock size={14} />
                            <span>
                              {challenge.pending_submissions || 0} Pending
                            </span>
                          </div>
                        </div>

                        {/* ── END TOP ── */}

                        <div
                          className="challenge-actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="challenge-actions__left">
                            <button
                              className="action-btn"
                              title="Edit"
                              onClick={() => openEditModal(challenge)}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="action-btn"
                              title="Submissions"
                              onClick={() => openSubmissions(challenge)}
                            >
                              <Upload size={13} />
                            </button>
                            <button
                              className="action-btn"
                              title="Participants"
                              onClick={() => openParticipants(challenge)}
                            >
                              <Users size={13} />
                            </button>
                            <button
                              className="action-btn"
                              title="Analytics"
                              onClick={() => openAnalytics(challenge)}
                            >
                              <BarChart3 size={13} />
                            </button>
                          </div>
                          <div className="challenge-actions__right">
                            <select
                              className="status-select"
                              value={challenge.status}
                              onChange={(e) =>
                                handleStatusChange(challenge.id, e.target.value)
                              }
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              {/* <option value="completed">Completed</option> */}
                              <option value="ended">Ended</option>
                            </select>
                            <button
                              className="delete-btn"
                              title="Delete"
                              onClick={() =>
                                handleDeleteChallenge(challenge.id)
                              }
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        {/* ── END BOTTOM ── */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredChallenges.length === 0 && (
                <div className="fp-empty-view">
                  <span className="fp-empty-emoji">🏆</span>
                  <span className="fp-empty-msg">No challenges found.</span>
                </div>
              )}

              {
                <Pagination
                  currentPage={pagination.current_page || 1}
                  totalPages={pagination.total_pages || 1}
                  onPageChange={(p) => setPage(p)}
                />
              }
            </>
          )}
        </>
      )}

      {/* ══ Pending Submissions Tab ══ */}
      {activeTab === "pending-submissions" && (
        <div className="submissions-container">
          <div className="submissions-header">
            <h2 className="submissions-title">Pending Submissions</h2>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
            </div>
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
                      src={
                        submission.profile_image_url || "/default-avatar.png"
                      }
                      alt={submission.username}
                      className="submission-avatar"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div className="submission-details">
                      <h3>{submission.title}</h3>
                      <p className="submission-meta">
                        by {submission.username} ·{" "}
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                      <p className="submission-challenge">
                        {submission.challenge_title}
                      </p>
                    </div>
                  </div>
                  <div className="submission-actions">
                    <button
                      className="review-btn"
                      onClick={() => openSubmissionDetail(submission)}
                    >
                      Review
                    </button>
                    <button
                      className="approve-btn"
                      onClick={() => handleApproveSubmission(submission.id)}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ Flagged Comments Tab ══ */}
      {/* {activeTab === "flagged-comments" && (
        <div className="submissions-container">
          <div className="submissions-header">
            <div className="flagged-header-title">
              <Flag size={18} className="flagged-icon" />
              <h2 className="submissions-title">Flagged Comments</h2>
              {flaggedComments.length > 0 && (
                <span className="flagged-count-badge">{filteredFlaggedComments.length}</span>
              )}
            </div>
            <div className="flagged-search-wrap">
              <Search size={14} className="flagged-search-icon" />
              <input type="text" className="flagged-search-input" placeholder="Search comments, users…"
                value={flaggedSearch} onChange={e => setFlaggedSearch(e.target.value)} />
            </div>
          </div>

          {flaggedLoading ? (
            <div className="loading-container"><div className="loading-spinner" /></div>
          ) : filteredFlaggedComments.length === 0 ? (
            <div className="empty-state">
              <Flag size={48} className="empty-icon" />
              <p className="empty-text">
                {flaggedSearch ? "No flagged comments match your search" : "No flagged comments found"}
              </p>
            </div>
          ) : (
            <div className="flagged-list">
              {filteredFlaggedComments.map((comment) => {
                const commentId       = comment.id || comment.comment_id;
                const content         = comment.content || comment.comment || "";
                const username        = comment.username || comment.user?.username || "Unknown User";
                const avatar          = comment.profile_image_url || comment.user?.profile_image_url || "/default-avatar.png";
                const challengeTitle  = comment.challenge_title || comment.submission?.challenge_title || "—";
                const submissionTitle = comment.submission_title || comment.submission?.title || "—";
                const flagCount       = comment.flag_count || comment.reports_count || comment.flagged_count || 1;
                const createdAt       = comment.created_at || comment.commented_at;

                return (
                  <div key={commentId} className="flagged-item">
                    <img src={avatar} alt={username} className="flagged-avatar"
                      onError={e => { e.target.src = "/default-avatar.png"; }} />
                    <div className="flagged-body">
                      <div className="flagged-user-row">
                        <span className="flagged-username">{username}</span>
                        <SeverityBadge count={flagCount} />
                      </div>
                      <p className="flagged-content">{content}</p>
                      <div className="flagged-meta">
                        {challengeTitle !== "—" && (
                          <span className="flagged-meta-challenge">
                            <Award size={11} /><span>{challengeTitle}</span>
                          </span>
                        )}
                        {submissionTitle !== "—" && (
                          <span className="flagged-meta-submission">
                            <Upload size={11} /> {submissionTitle}
                          </span>
                        )}
                        {createdAt && (
                          <span className="flagged-meta-date">{new Date(createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flagged-actions">
                      <button className="review-btn" onClick={() => openFlaggedDetail(comment)}>
                        <Eye size={12} /> Review
                      </button>
                      <button className="reject-btn" onClick={() => handleDeleteFlaggedComment(commentId)}>
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {flaggedPagination.pages > 1 && (
            <div className="fp-pagination-wrapper">
              <button className="fp-page-btn" onClick={() => setFlaggedPage(p => Math.max(1, p - 1))} disabled={flaggedPage === 1}>Previous</button>
              <span className="fp-page-info">Page {flaggedPagination.page} of {flaggedPagination.pages} ({flaggedPagination.total} total)</span>
              <button className="fp-page-btn" onClick={() => setFlaggedPage(p => Math.min(flaggedPagination.pages, p + 1))} disabled={flaggedPage === flaggedPagination.pages}>Next</button>
            </div>
          )}
        </div>
      )} */}

      {/* ══ CREATE CHALLENGE MODAL ══ */}
      {createChallengeModal && (
        <ModalShell
          title="Create New Challenge"
          onClose={() => setCreateChallengeModal(false)}
          maxWidth="640px"
          footer={
            <>
              {/* <button className="btn-cancel" onClick={() => setCreateChallengeModal(false)}>Cancel</button> */}
              <button className="btn-primary" onClick={handleCreateChallenge}>
                Create Challenge
              </button>
            </>
          }
        >
          <Field label="Title">
            <input
              type="text"
              className="form-input"
              value={newChallenge.title}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, title: e.target.value })
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className="form-textarea"
              rows={3}
              value={newChallenge.description}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  description: e.target.value,
                })
              }
            />
          </Field>
          <div className="form-row">
            <Field label="Dance Style">
              <DanceStylesSelect
                selected={newChallenge.dance_style}
                onChange={(val) =>
                  setNewChallenge({ ...newChallenge, dance_style: val })
                }
                options={danceStyleOptions}
              />
            </Field>
            <Field label="Dance Level">
              <select
                className="form-select"
                value={newChallenge.dance_level}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    dance_level: e.target.value,
                  })
                }
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </Field>
          </div>
          <div className="form-row">
            <Field label="Start Date">
              <DatePicker
                selected={
                  newChallenge.start_date
                    ? new Date(newChallenge.start_date)
                    : null
                }
                onChange={(date) =>
                  setNewChallenge({
                    ...newChallenge,
                    start_date: date ? toLocalDateString(date) : "",
                  })
                }
                placeholderText="Select start date"
                className="class-mod-filter-input"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </Field>
            <Field label="End Date">
              <DatePicker
                selected={
                  newChallenge.end_date ? new Date(newChallenge.end_date) : null
                }
                onChange={(date) =>
                  setNewChallenge({
                    ...newChallenge,
                    end_date: date ? toLocalDateString(date) : "",
                  })
                }
                placeholderText="Select end date"
                className="class-mod-filter-input"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={
                  newChallenge.start_date
                    ? new Date(newChallenge.start_date)
                    : null
                }
              />
            </Field>
          </div>
          <Field label="Prize Details">
            <input
              type="text"
              className="form-input"
              value={newChallenge.prize_details}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  prize_details: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Max Participants">
            <input
              type="number"
              className="form-input"
              value={newChallenge.max_participants}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  max_participants: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Challenge Image">
            <input
              type="file"
              className="form-input"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "image_url")}
              disabled={uploading}
            />
            {newChallenge.image_url && (
              <div className="cp-img-preview">
                <img
                  src={newChallenge.image_url}
                  alt="Preview"
                  className="cp-img-preview__img"
                />
                <button
                  className="cp-img-preview__remove"
                  onClick={() =>
                    setNewChallenge({ ...newChallenge, image_url: "" })
                  }
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </Field>
          <Field label="Challenge Type">
            <select
              className="form-select"
              value={newChallenge.challenger_type}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  challenger_type: e.target.value,
                })
              }
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </Field>
          <div className="cp-form-group">
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
                  <Field label="Task Title">
                    <input
                      type="text"
                      className="form-input"
                      value={task.task_title}
                      onChange={(e) =>
                        updateTask(index, "task_title", e.target.value)
                      }
                      placeholder="Enter task title"
                    />
                  </Field>
                  <Field label="Task Type">
                    <select
                      className="form-select"
                      value={task.task_type}
                      onChange={(e) =>
                        updateTask(index, "task_type", e.target.value)
                      }
                    >
                      <option value="watch_video">Watch Video</option>
                      <option value="upload_video">Upload Video</option>
                    </select>
                  </Field>
                  <div className="cp-task-remove-wrap">
                    <button
                      className="delete-btn"
                      onClick={() => removeTask(index)}
                      disabled={tasks.length === 1}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                {task.task_type === "upload_video" && (
                  <Field label="Upload Submission Template (Optional)">
                    <input
                      type="file"
                      className="form-input"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, "video_url", index)}
                      disabled={uploading}
                    />
                    {task.video_url && (
                      <div className="cp-img-preview">
                        <video
                          src={task.video_url}
                          className="cp-img-preview__img"
                          controls
                        />
                        <button
                          className="cp-img-preview__remove"
                          onClick={() => updateTask(index, "video_url", "")}
                        >
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

      {/* ══ EDIT CHALLENGE MODAL ══ */}
      {editChallengeModal && (
        <ModalShell
          title="Edit Challenge"
          onClose={() => setEditChallengeModal(false)}
          maxWidth="580px"
          footer={
            <>
              {/* <button className="btn-cancel" onClick={() => setEditChallengeModal(false)}>Cancel</button> */}
              <button className="btn-primary" onClick={handleUpdateChallenge}>
                Update Challenge
              </button>
            </>
          }
        >
          <Field label="Title">
            <input
              type="text"
              className="form-input"
              value={editChallenge.title || ""}
              onChange={(e) =>
                setEditChallenge({ ...editChallenge, title: e.target.value })
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className="form-textarea"
              rows={3}
              value={editChallenge.description || ""}
              onChange={(e) =>
                setEditChallenge({
                  ...editChallenge,
                  description: e.target.value,
                })
              }
            />
          </Field>
          <div className="form-row">
            <Field label="Dance Style">
              <DanceStylesSelect
                selected={editChallenge.dance_style || []}
                onChange={(val) =>
                  setEditChallenge({ ...editChallenge, dance_style: val })
                }
                options={danceStyleOptions}
              />
            </Field>
            <Field label="Dance Level">
              <select
                className="form-select"
                value={editChallenge.dance_level || ""}
                onChange={(e) =>
                  setEditChallenge({
                    ...editChallenge,
                    dance_level: e.target.value,
                  })
                }
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </Field>
          </div>
          <Field label="Prize Details">
            <input
              type="text"
              className="form-input"
              value={editChallenge.prize_details || ""}
              onChange={(e) =>
                setEditChallenge({
                  ...editChallenge,
                  prize_details: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Max Participants">
            <input
              type="number"
              className="form-input"
              value={editChallenge.max_participants || ""}
              onChange={(e) =>
                setEditChallenge({
                  ...editChallenge,
                  max_participants: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Image URL">
            <input
              type="url"
              className="form-input"
              value={editChallenge.image_url || ""}
              onChange={(e) =>
                setEditChallenge({
                  ...editChallenge,
                  image_url: e.target.value,
                })
              }
            />
          </Field>
          <div className="cp-form-group">
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
              Mark as Trending
            </label>
          </div>
        </ModalShell>
      )}

      {/* ══ CHALLENGE DETAILS MODAL ══ */}
      {challengeDetailsModal && selectedChallenge && (
        <ModalShell
          title="Challenge Details"
          onClose={() => setChallengeDetailsModal(false)}
          maxWidth="860px"
        >
          <div className="challenge-details">
            <div>
              {selectedChallenge.challenge?.image_url && (
                <img
                  src={selectedChallenge.challenge.image_url}
                  alt={selectedChallenge.challenge.title}
                  className="details-image"
                />
              )}
              <h4 className="details-title">
                {selectedChallenge.challenge?.title}
              </h4>
              <p className="details-description">
                {selectedChallenge.challenge?.description}
              </p>
              <div className="details-info">
                <div className="info-item">
                  <Calendar size={16} className="info-icon" />
                  {new Date(
                    selectedChallenge.challenge?.start_date,
                  ).toLocaleDateString()}{" "}
                  –{" "}
                  {new Date(
                    selectedChallenge.challenge?.end_date,
                  ).toLocaleDateString()}
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
                  Max:{" "}
                  {selectedChallenge.challenge?.max_participants ||
                    "Unlimited"}{" "}
                  participants
                </div>
              </div>
            </div>
            <div>
              <div className="detail-stats-row">
                {[
                  {
                    icon: Users,
                    val: selectedChallenge.challenge?.total_participants || 0,
                    label: "Participants",
                  },
                  {
                    icon: Upload,
                    val: selectedChallenge.challenge?.total_submissions || 0,
                    label: "Submissions",
                  },
                  {
                    icon: Clock,
                    val: selectedChallenge.challenge?.pending_submissions || 0,
                    label: "Pending",
                  },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="detail-stat-card">
                    <Icon size={18} />
                    <h4>{val}</h4>
                    <p>{label}</p>
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
                          <div
                            className="video-container"
                            style={{ marginTop: "0.5rem" }}
                          >
                            <video
                              key={task.video_url}
                              src={task.video_url}
                              controls
                              preload="metadata"
                              controlsList="nodownload"
                              onEnded={(e) => e.target.pause()}
                              style={{ width: "100%", borderRadius: "8px" }}
                            />
                          </div>
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
        <ModalShell
          title={`Submissions — ${selectedChallenge.title}`}
          onClose={() => setSubmissionsModal(false)}
          maxWidth="1000px"
        >
          {submissions.length === 0 ? (
            <div className="empty-state">
              <Upload size={48} className="empty-icon" />
              <p className="empty-text">No submissions found</p>
            </div>
          ) : (
            <div className="submissions-grid">
              {submissions.map((sub) => (
                <div key={sub.id} className="submission-card">
                  <div className="submission-header">
                    <img
                      src={sub.profile_image_url || "/default-avatar.png"}
                      alt={sub.username}
                      className="submission-user-avatar"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div className="submission-user-info">
                      <h4>{sub.username}</h4>
                      <p>{new Date(sub.submitted_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`submission-status ${sub.status}`}>
                      {sub.status}
                    </span>
                  </div>
                  <div className="submission-content">
                    <h5>{sub.title}</h5>
                    {sub.description && (
                      <p className="submission-desc">{sub.description}</p>
                    )}
                    {sub.video_url && (
                      <div className="submission-video">
                        <a
                          href={sub.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-link"
                        >
                          <Play size={13} /> Watch Submission
                        </a>
                      </div>
                    )}
                    <div className="submission-actions">
                      <button
                        className="view-detail-btn"
                        onClick={() => openSubmissionDetail(sub)}
                      >
                        <Eye size={13} /> View
                      </button>
                      {sub.status === "pending" && (
                        <>
                          <button
                            className="approve-btn-sm"
                            onClick={() => handleApproveSubmission(sub.id)}
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleRejectSubmission(sub.id)}
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                      <button
                        className="reject-btn"
                        onClick={() => handleDeleteSubmission(sub.id)}
                      >
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

      {/* ══ PARTICIPANTS MODAL ══ */}
      {participantsModal && selectedChallenge && (
        <ModalShell
          title={`Participants — ${selectedChallenge.title}`}
          onClose={() => setParticipantsModal(false)}
          maxWidth="720px"
        >
          {participants.length === 0 ? (
            <div className="empty-state">
              <Users size={48} className="empty-icon" />
              <p className="empty-text">No participants found</p>
            </div>
          ) : (
            <div className="participants-list">
              {participants.map((p) => (
                <div key={p.user_id} className="participant-item">
                  <img
                    src={p.profile_image_url || "/default-avatar.png"}
                    alt={p.username}
                    className="participant-avatar"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <div className="participant-info">
                    <div className="participant-name">{p.username}</div>
                    <div className="participant-email">{p.email}</div>
                    <div className="participant-stats">
                      <span className="participant-stat-date">
                        Joined: {new Date(p.joined_at).toLocaleDateString()}
                      </span>
                      <span className="participant-stat-sub">
                        <Upload size={11} /> {p.submissions_count || 0}{" "}
                        submissions
                      </span>
                      <span className="participant-stat-like">
                        <ThumbsUp size={11} /> {p.likes_received || 0} likes
                      </span>
                    </div>
                  </div>
                  <button
                    className="remove-participant-btn"
                    onClick={() =>
                      handleRemoveParticipant(selectedChallenge.id, p.user_id)
                    }
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
        <ModalShell
          title={`Analytics — ${selectedChallenge.title}`}
          onClose={() => setAnalyticsModal(false)}
          maxWidth="1000px"
        >
          <div className="analytics-container">
            <div className="analytics-card">
              <div className="analytics-card-header">
                <h3>Overview</h3>
                <BarChart3 size={20} className="analytics-icon" />
              </div>
              <div className="analytics-stats-grid">
                {[
                  {
                    val: analytics.analytics?.total_participants || 0,
                    label: "Total Participants",
                  },
                  {
                    val: analytics.analytics?.total_submissions || 0,
                    label: "Total Submissions",
                  },
                  {
                    val: analytics.analytics?.approved_submissions || 0,
                    label: "Approved",
                  },
                  {
                    val: analytics.analytics?.pending_submissions || 0,
                    label: "Pending",
                  },
                  {
                    val: analytics.analytics?.total_likes || 0,
                    label: "Total Likes",
                  },
                  {
                    val: analytics.analytics?.total_comments || 0,
                    label: "Total Comments",
                  },
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
                  <div className="analytics-card-header">
                    <h3>Top Performers</h3>
                    <Award size={18} className="analytics-icon" />
                  </div>
                  <div className="top-performers-list">
                    {analytics.analytics.top_performers.map((p, i) => (
                      <div key={p.user_id} className="top-performer-item">
                        <div className="performer-rank">{i + 1}</div>
                        <img
                          src={p.profile_image_url || "/default-avatar.png"}
                          alt={p.username}
                          className="performer-avatar"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                        <div className="performer-info">
                          <span className="performer-name">{p.username}</span>
                          <span className="performer-stats">
                            {p.likes_count} likes · {p.submissions_count}{" "}
                            submissions
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
                      {
                        label: "Avg Likes / Submission",
                        val:
                          analytics.analytics?.engagement_metrics
                            ?.avg_likes_per_submission || 0,
                      },
                      {
                        label: "Avg Comments / Submission",
                        val:
                          analytics.analytics?.engagement_metrics
                            ?.avg_comments_per_submission || 0,
                      },
                      {
                        label: "Participation Rate",
                        val: `${analytics.engagement_metrics?.participation_rate || 0}%`,
                      },
                      {
                        label: "Completion Rate",
                        val: `${analytics.engagement_metrics?.completion_rate || 0}%`,
                      },
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
        <ModalShell
          title="Submission Review"
          onClose={() => setSubmissionDetailModal(false)}
          maxWidth="720px"
        >
          <div className="submission-detail">
            <div className="submission-detail-header">
              <img
                src={
                  selectedSubmission.profile_image_url ||
                  selectedSubmission.avatar ||
                  selectedSubmission.user?.profile_image_url ||
                  "/default-avatar.png"
                }
                alt={
                  selectedSubmission.username ||
                  selectedSubmission.user_name ||
                  selectedSubmission.user?.username ||
                  "User"
                }
                className="submission-detail-avatar"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="submission-detail-info">
                <h3>
                  {selectedSubmission.title ||
                    selectedSubmission.challenge_title ||
                    "Untitled Submission"}
                </h3>
                <p>
                  by{" "}
                  {selectedSubmission.username ||
                    selectedSubmission.user_name ||
                    selectedSubmission.user?.username ||
                    selectedSubmission.user?.name ||
                    "Unknown User"}
                </p>
                <span className="submission-date">
                  {selectedSubmission.submitted_at ||
                  selectedSubmission.created_at ||
                  selectedSubmission.createdAt
                    ? new Date(
                        selectedSubmission.submitted_at ||
                          selectedSubmission.created_at ||
                          selectedSubmission.createdAt,
                      ).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <span
                className={`submission-detail-status submission-status ${selectedSubmission.status}`}
              >
                {selectedSubmission.status}
              </span>
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
                  <h4>Submission Video</h4>
                  <div className="video-container">
                    <video
                      key={selectedSubmission.video_url}
                      src={selectedSubmission.video_url}
                      controls
                      preload="metadata"
                      controlsList="nodownload"
                      onEnded={(e) => e.target.pause()}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  </div>
                </div>
              )}
              {selectedSubmission.admin_feedback && (
                <div className="detail-section">
                  <h4>Admin Feedback</h4>
                  <div className="admin-feedback">
                    {selectedSubmission.admin_feedback}
                  </div>
                </div>
              )}
              {selectedSubmission.comments?.length > 0 && (
                <div className="detail-section">
                  <h4>Comments</h4>
                  <div className="comments-list">
                    {selectedSubmission.comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <img
                          src={
                            comment.profile_image_url || "/default-avatar.png"
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
                                comment.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="comment-text">{comment.content}</p>
                        </div>
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedSubmission.status === "pending" && (
                <div className="admin-actions">
                  {/* <div className="feedback-input">
                    <label className="cp-form-label">Feedback (optional)</label>
                    <textarea className="form-textarea" rows={3} placeholder="Add feedback for the creator..."
                      value={feedbackText} onChange={e => setFeedbackText(e.target.value)} />
                  </div> */}
                  <div className="action-buttons-group">
                    <button
                      className="approve-btn-large"
                      onClick={() =>
                        handleApproveSubmission(selectedSubmission.id)
                      }
                    >
                      <CheckCircle size={16} /> Approve Submission
                    </button>
                    <button
                      className="reject-btn-large"
                      onClick={() =>
                        handleRejectSubmission(selectedSubmission.id)
                      }
                    >
                      <XCircle size={16} /> Reject Submission
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModalShell>
      )}

      {/* ══ FLAGGED COMMENT DETAIL MODAL ══ */}
      {/* {flaggedDetailModal && selectedFlaggedComment && (() => {
        const c               = selectedFlaggedComment;
        const commentId       = c.id || c.comment_id;
        const content         = c.content || c.comment || "";
        const username        = c.username || c.user?.username || "Unknown User";
        const avatar          = c.profile_image_url || c.user?.profile_image_url || "/default-avatar.png";
        const email           = c.email || c.user?.email || "";
        const challengeTitle  = c.challenge_title || c.submission?.challenge_title || "—";
        const submissionTitle = c.submission_title || c.submission?.title || "—";
        const flagCount       = c.flag_count || c.reports_count || c.flagged_count || 1;
        const createdAt       = c.created_at || c.commented_at;
        const reasons         = c.flag_reasons || c.report_reasons || [];

        return (
          <ModalShell
            title="Flagged Comment Review"
            onClose={() => { setFlaggedDetailModal(false); setSelectedFlaggedComment(null); }}
            maxWidth="600px"
            footer={
              <div className="flagged-detail-footer">
                <button className="reject-btn-large reject-btn-large--no-flex"
                  onClick={() => handleDeleteFlaggedComment(commentId)}>
                  <Trash2 size={14} /> Delete Comment
                </button>
              </div>
            }>
            <div className="fd-user-card">
              <img src={avatar} alt={username} className="fd-avatar"
                onError={e => { e.target.src = "/default-avatar.png"; }} />
              <div className="fd-user-info">
                <div className="fd-username">{username}</div>
                {email     && <div className="fd-email">{email}</div>}
                {createdAt && <div className="fd-date">Commented: {new Date(createdAt).toLocaleString()}</div>}
              </div>
              <SeverityBadge count={flagCount} />
            </div>

            <div className="fd-section">
              <div className="fd-section-label"><MessageSquare size={13} className="fd-label-icon" /> Comment Content</div>
              <div className="fd-comment-box">{content}</div>
            </div>

            <div className="fd-section">
              <div className="fd-section-label">Context</div>
              <div className="fd-context-list">
                {challengeTitle !== "—" && (
                  <div className="fd-context-item">
                    <Award size={14} className="fd-context-icon" />
                    <div><span className="fd-context-type">Challenge</span><span className="fd-context-value">{challengeTitle}</span></div>
                  </div>
                )}
                {submissionTitle !== "—" && (
                  <div className="fd-context-item">
                    <Upload size={14} className="fd-context-icon" />
                    <div><span className="fd-context-type">Submission</span><span className="fd-context-value">{submissionTitle}</span></div>
                  </div>
                )}
              </div>
            </div>

            {reasons.length > 0 && (
              <div className="fd-section">
                <div className="fd-section-label">
                  <Flag size={13} className="fd-label-icon fd-label-icon--red" /> Report Reasons ({reasons.length})
                </div>
                <div className="fd-reasons-list">
                  {reasons.map((r, i) => (
                    <div key={i} className="fd-reason-item">
                      <Flag size={12} className="fd-reason-icon" />
                      <span>{r.reason || r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ModalShell>
        );
      })()} */}

      {/* ══ CONFIRM DIALOG ══ */}
      {confirmDialog.open && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onClose={closeConfirm}
        />
      )}
    </div>
  );
};

export default ChallengePage;
