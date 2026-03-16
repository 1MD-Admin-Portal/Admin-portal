import React, { useEffect, useState } from "react";
import GlobalLoader from "../../../components/common/GlobalLoader";
import {
  X,
  Heart,
  Play,
  AlertTriangle,
  Shield,
  BarChart3,
  Eye,
  Ban,
  Trash2,
  AlertOctagon,
} from "lucide-react";
import {
  getFeedsService,
  getFeedLikesService,
} from "../../../services/feed.service";
import { useModeration } from "../../../contexts/ModerationContext";
import "./FeedPage.css";
import Pagination from "../../../components/common/Pagination";

const FeedPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [likesData, setLikesData] = useState(null);
  const [page, setPage] = useState(1);

  // Filter, Sort, and Search States
  const [sortByInput, setSortByInput] = useState("created_at");
  const [orderInput, setOrderInput] = useState("desc");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    sort_by: "created_at",
    order: "desc",
    search: "",
  });

  // Content Moderation States
  const [activeTab, setActiveTab] = useState("feeds"); // 'feeds', 'reports', 'stats'
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportedPost, setSelectedReportedPost] = useState(null);
  const [moderationAction, setModerationAction] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    reportedPosts,
    reportsPagination,
    reportsPage,
    setReportsPage,
    moderationStats,
    isLoadingReports,
    isLoadingStats,
    refreshReportedPosts,
    refreshModerationStats,
    moderateReport,
  } = useModeration();

  // Debounced search effect
  useEffect(() => {
    const debounce = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
      }));
      setPage(1);
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchInput]);

  useEffect(() => {
    if (activeTab === "feeds") {
      fetchFeeds(page, filters);
    } else if (activeTab === "reports") {
      refreshReportedPosts({ page: reportsPage });
    } else if (activeTab === "stats") {
      refreshModerationStats();
    }
  }, [page, reportsPage, activeTab, filters, refreshModerationStats, refreshReportedPosts]);

  const fetchFeeds = async (pageNum, appliedFilters) => {
    const res = await getFeedsService(pageNum, 12, appliedFilters);
    setFeeds(res.posts || []);
    setPagination(res.pagination || {});
  };

  const handleViewLikes = async (postId) => {
    const res = await getFeedLikesService(postId);
    setLikesData(res);
  };


  const handleApplyFilters = () => {
    setFilters({
      sort_by: sortByInput,
      order: orderInput,
      search: searchInput,
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    setSortByInput("created_at");
    setOrderInput("desc");
    setSearchInput("");
    setFilters({
      sort_by: "created_at",
      order: "desc",
      search: "",
    });
    setPage(1);
  };

  const handleOpenModerationModal = (reportedPost) => {
    setSelectedReportedPost(reportedPost);
    const firstPending = reportedPost?.reports?.find((r) => r.status === "pending");
    setSelectedReport(firstPending || null);
    setModerationAction("");
    setAdminNotes("");
    setError("");
  };

  const handleModerateReport = async () => {
    // 1. Client-side Validation
    if (!moderationAction) {
      setError("Please select a moderation action.");
      return;
    }

    try {
      setIsLoading(true);
      setError(""); // Clear previous errors

      await moderateReport({
        reportId: selectedReport.id,
        adminAction: moderationAction,
        adminNotes,
      });

      // 2. Success Handling (Close modal only on success)
      setSelectedReport(null);
      setSelectedReportedPost(null);
      setModerationAction("");
      setAdminNotes("");

      alert("Report moderated successfully!");
    } catch (err) {
      // 3. Error Handling (Keep modal open, show error)
      console.error("Moderation Error:", err);
      setError(err?.message || "Failed to moderate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // helper function to check if url is video
  const isVideo = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith(".mp4");
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "no_action":
      case "dismiss":
        return <Eye size={16} />;
      case "warning_sent":
      case "send_warning":
        return <AlertTriangle size={16} />;
      case "post_hidden":
      case "hide_post":
        return <Ban size={16} />;
      case "resolve":
        return <Shield size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  const getReasonBadge = (reason) => {
    const reasonMap = {
      inappropriate_content: "Inappropriate Content",
      violence: "Violence",
      spam: "Spam",
      harassment: "Harassment",
      copyright: "Copyright Violation",
      other: "Other",
    };
    return reasonMap[reason] || reason;
  };

  const getActionLabel = (action) => {
    const actionMap = {
      dismiss: "Dismiss",
      send_warning: "Send Warning",
      hide_post: "Hide Post",
      resolve: "Resolve",

      // Backend values (for stats coming from API)
      no_action: "Dismiss",
      warning_sent: "Send Warning",
      post_hidden: "Hide Post",
    };
    return actionMap[action] || action;
  };

  return (
    <div className="fp-main-container">
      <div className="fp-header-section">
        <h2 className="fp-main-title">Feed & Content Management</h2>

        {/* Tab Navigation */}
        <div className="fp-tab-nav">
          <button
            className={`fp-nav-tab ${activeTab === "feeds" ? "fp-tab-active" : ""
              }`}
            onClick={() => setActiveTab("feeds")}
          >
            <Play size={16} />
            Feeds
          </button>
          <button
            className={`fp-nav-tab ${activeTab === "reports" ? "fp-tab-active" : ""
              }`}
            onClick={() => setActiveTab("reports")}
          >
            <AlertTriangle size={16} />
            Reported Content
          </button>
          <button
            className={`fp-nav-tab ${activeTab === "stats" ? "fp-tab-active" : ""
              }`}
            onClick={() => setActiveTab("stats")}
          >
            <BarChart3 size={16} />
            Moderation Stats
          </button>
        </div>
      </div>

      {/* Feeds Tab */}
      {activeTab === "feeds" && (
        <>
          {/* Filters Section */}
          <div className="filter-section-feed">
            {/* Search */}
            <div style={{ flex: "2 1 220px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#475569" }}>
                Search
              </label>
              <input 
                className="fp-search-input"
                type="text"
                placeholder="Search by user, caption, etc..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: "6px",
                  border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Sort By */}
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#475569" }}>
                Sort By
              </label>
              <select
                value={sortByInput}
                onChange={(e) => setSortByInput(e.target.value)}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: "6px",
                  border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
                  boxSizing: "border-box", cursor: "pointer",
                }}
              >
                <option value="created_at">Date Created</option>
                <option value="updated_at">Date Updated</option>
              </select>
            </div>

            {/* Order */}
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#475569" }}>
                Order
              </label>
              <select
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: "6px",
                  border: "1px solid rgba(142,92,246,0.2)", fontSize: "13px",
                  boxSizing: "border-box", cursor: "pointer",
                }}
              >
                <option value="asc">Oldest</option>
                <option value="desc">Newest</option>
              </select>
            </div>

            {/* Apply & Clear Buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
              <button
                onClick={handleApplyFilters}
                style={{
                  padding: "8px 16px", borderRadius: "6px",
                  background: "linear-gradient(135deg, #6c3de8, #ec4899)",
                  color: "white", border: "none", cursor: "pointer",
                  fontWeight: "600", fontSize: "13px",
                }}
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                style={{
                  padding: "8px 16px", borderRadius: "6px",
                  background: "#f0f0f0", color: "#333", border: "1px solid #ddd",
                  cursor: "pointer", fontWeight: "600", fontSize: "13px",
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="fp-content-grid">
            {feeds.map((feed) => (
              <div
                key={feed.post_id}
                className="fp-content-card"
                onClick={() => setSelectedFeed(feed)}
              >
                <div className="fp-thumbnail-wrap">
                  {isVideo(feed.content.video_url) ? (
                    <video
                      src={feed.content.video_url}
                      className="fp-media-thumb"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={feed.content.video_url}
                      alt="feed-thumbnail"
                      className="fp-media-thumb"
                    />
                  )}

                  {isVideo(feed.content.video_url) && (
                    <div className="fp-play-icon">
                      <Play size={24} />
                    </div>
                  )}

                  <div className="fp-likes-badge">
                    <Heart size={16} />
                    <span>{feed.metadata.like_count}</span>
                  </div>
                </div>

                <div className="fp-card-body">
                  <div className="fp-user-details">
                    <h3 className="fp-username">{feed.user.name}</h3>
                    <div className="fp-meta-tags">
                      <span
                        className={`fp-style-tag fp-style-${feed.metadata.dance_style
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {feed.metadata.dance_style}
                      </span>
                      <span
                        className={`fp-level-tag fp-level-${feed.metadata.level?.toLowerCase()}`}
                      >
                        {feed.metadata.level}
                      </span>
                    </div>
                  </div>

                  <p className="fp-post-caption">{feed.content.caption}</p>

                  <div className="fp-engagement-stats">
                    <div className="fp-stat-group">
                      <Heart size={16} />
                      <span>{feed.metadata.like_count} Likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {feeds.length === 0 && (
            <div className="fp-empty-view">
              <span className="fp-empty-emoji">📱</span>
              <span className="fp-empty-msg">No feeds found.</span>
            </div>
          )}
            <Pagination
              currentPage={pagination.current_page || 1}
              totalPages={pagination.total_pages || 1}
              onPageChange={p => setPage(p)}
            />
        </>
      )}

      {/* Reported Content Tab */}
      {activeTab === "reports" && (
        <div className="fp-reports-area">
          {isLoading || isLoadingReports ? (
            <GlobalLoader text="Loading reported posts..." />
          ) : (
            <>
              <div className="fp-reports-grid">
                {reportedPosts.map((reportedPost) => (
                  <div key={reportedPost.post.id} className="fp-report-item">
                    <div className="fp-report-head">
                      <div className="fp-post-details">
                        <h3 className="fp-author-name">
                          {reportedPost.post.author.name}
                        </h3>
                        <p className="fp-post-text">
                          {reportedPost.post.caption}
                        </p>
                        <div className="fp-post-labels">
                          <span
                            className={`fp-style-tag fp-style-${reportedPost.post.dance_style
                              ?.toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {reportedPost.post.dance_style}
                          </span>
                          <span
                            className={`fp-level-tag fp-level-${reportedPost.post.level?.toLowerCase()}`}
                          >
                            {reportedPost.post.level}
                          </span>
                        </div>
                      </div>
                      <div className="fp-report-counter">
                        <AlertTriangle size={20} />
                        <span>{reportedPost.reports.length} Reports</span>
                      </div>
                    </div>

                    <div className="fp-report-preview">
                      {isVideo(reportedPost.post.video_url) ? (
                        <video
                          src={reportedPost.post.video_url}
                          className="fp-preview-media"
                          muted
                        />
                      ) : (
                        <img
                          src={reportedPost.post.video_url}
                          alt="reported-content"
                          className="fp-preview-media"
                        />
                      )}
                    </div>

                    <div className="fp-reports-collection">
                      {reportedPost.reports.slice(0, 2).map((report) => (
                        <div key={report.id} className="fp-single-report">
                          <div className="fp-report-reason">
                            <span className="fp-reason-label">
                              {getReasonBadge(report.reason)}
                            </span>
                            <span
                              className={`fp-status-label fp-status-${report.status}`}
                            >
                              {report.status}
                            </span>
                          </div>
                          <p className="fp-report-desc">{report.description}</p>
                          <div className="fp-report-info">
                            <span>By: {report.reporter.name}</span>
                            <span>
                              {new Date(
                                report.reported_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {reportedPost.reports.length > 2 && (
                        <div className="fp-additional-reports">
                          +{reportedPost.reports.length - 2} more reports
                        </div>
                      )}
                    </div>

                    <div className="fp-report-controls">
                      <button
                        className="fp-btn fp-btn-primary"
                        onClick={() => handleOpenModerationModal(reportedPost)}
                      >
                        <Shield size={16} />
                        Review & Moderate
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {reportedPosts.length === 0 && (
                <div className="fp-empty-view">
                  <span className="fp-empty-emoji">✅</span>
                  <span className="fp-empty-msg">No reported posts found.</span>
                </div>
              )}

              <Pagination
                currentPage={reportsPagination.current_page || 1}
                totalPages={reportsPagination.total_pages || 1}
                onPageChange={p => setReportsPage(p)}
              />
            </>
          )}
        </div>
      )}

      {/* Moderation Stats Tab */}
      {activeTab === "stats" && (
        <div className="fp-stats-area">
          {isLoading || isLoadingStats ? (
            <div className="fp-loading-view">Loading statistics...</div>
          ) : (
            <>
              <div className="fp-stats-summary">
                <div className="fp-summary-card">
                  <div className="fp-stats-emoji">📊</div>
                  <div className="fp-stats-data">
                    <div className="fp-stats-number">
                      {moderationStats.reports?.total || 0}
                    </div>
                    <div className="fp-stats-title">Total Reports</div>
                  </div>
                </div>
                <div className="fp-summary-card">
                  <div className="fp-stats-emoji">⏳</div>
                  <div className="fp-stats-data">
                    <div className="fp-stats-number">
                      {moderationStats.reports?.pending || 0}
                    </div>
                    <div className="fp-stats-title">Pending Reports</div>
                  </div>
                </div>
                <div className="fp-summary-card">
                  <div className="fp-stats-emoji">✅</div>
                  <div className="fp-stats-data">
                    <div className="fp-stats-number">
                      {moderationStats.reports?.resolved || 0}
                    </div>
                    <div className="fp-stats-title">Resolved Reports</div>
                  </div>
                </div>
                <div className="fp-summary-card">
                  <div className="fp-stats-emoji">❌</div>
                  <div className="fp-stats-data">
                    <div className="fp-stats-number">
                      {moderationStats.reports?.dismissed || 0}
                    </div>
                    <div className="fp-stats-title">Dismissed Reports</div>
                  </div>
                </div>
              </div>

              <div className="fp-detailed-stats">
                <div className="fp-stats-panel">
                  <h3 className="fp-panel-title">Reports by Reason</h3>
                  <div className="fp-reason-breakdown">
                    {moderationStats.reports_by_reason?.map((item) => (
                      <div key={item.report_reason} className="fp-reason-entry">
                        <span className="fp-reason-text">
                          {getReasonBadge(item.report_reason)}
                        </span>
                        <span className="fp-reason-value">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="fp-stats-panel">
                  <h3 className="fp-panel-title">Admin Actions</h3>
                  <div className="fp-action-breakdown">
                    {moderationStats.admin_actions?.map((item) => (
                      <div key={item.admin_action} className="fp-action-entry">
                        {getActionIcon(item.admin_action)}
                        <span className="fp-action-text">
                          {getActionLabel(item.admin_action)}
                        </span>
                        <span className="fp-action-value">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="fp-stats-panel">
                  <h3 className="fp-panel-title">Most Reported Posts</h3>
                  <div className="fp-reported-breakdown">
                    {moderationStats.most_reported_posts?.map((post) => (
                      <div key={post.id} className="fp-reported-entry">
                        <div className="fp-reported-details">
                          <div className="fp-reported-caption">
                            {post.caption}
                          </div>
                          <div className="fp-reported-author">
                            by {post.author_name}
                          </div>
                          <div className="fp-reported-style">
                            {post.dance_style}
                          </div>
                        </div>
                        <div className="fp-reported-count">
                          <AlertTriangle size={16} />
                          <span>{post.report_count} reports</span>
                        </div>
                        {post.is_hidden === 1 && (
                          <div className="fp-reported-status fp-hidden-status">
                            Hidden
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Feed Details Modal */}
      {selectedFeed && (
        <div
          className="fp-modal-backdrop"
          onClick={() => setSelectedFeed(null)}
        >
          <div
            className="fp-modal-container fp-feed-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fp-modal-header">
              <h2 className="fp-modal-heading">
                {selectedFeed.user.name} - Feed Details
              </h2>
              <button
                className="fp-modal-close"
                onClick={() => setSelectedFeed(null)}
              >
                <X />
              </button>
            </div>

            <div className="fp-modal-content">
              <div className="fp-modal-block">
                <div className="fp-feed-display">
                  {isVideo(selectedFeed.content.video_url) ? (
                    <video
                      src={selectedFeed.content.video_url}
                      className="fp-modal-media"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={selectedFeed.content.video_url}
                      alt="feed-detail"
                      className="fp-modal-media"
                    />
                  )}
                </div>
              </div>

              <div className="fp-modal-block">
                <h3 className="fp-block-title">Content Details</h3>
                <div className="fp-info-layout">
                  <div className="fp-info-field">
                    <div className="fp-field-label">Caption</div>
                    <div className="fp-field-value">
                      {selectedFeed.content.caption}
                    </div>
                  </div>
                  <div className="fp-info-field">
                    <div className="fp-field-label">Dance Style</div>
                    <div className="fp-field-value">
                      <span
                        className={`fp-style-tag fp-style-${selectedFeed.metadata.dance_style
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {selectedFeed.metadata.dance_style}
                      </span>
                    </div>
                  </div>
                  <div className="fp-info-field">
                    <div className="fp-field-label">Level</div>
                    <div className="fp-field-value">
                      <span
                        className={`fp-level-tag fp-level-${selectedFeed.metadata.level?.toLowerCase()}`}
                      >
                        {selectedFeed.metadata.level}
                      </span>
                    </div>
                  </div>
                  <div className="fp-info-field">
                    <div className="fp-field-label">Likes</div>
                    <div className="fp-field-value">
                      <div className="fp-likes-display">
                        <Heart size={18} />
                        <span>{selectedFeed.metadata.like_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fp-modal-actions">
                <button
                  className="fp-likes-btn"
                  onClick={() => handleViewLikes(selectedFeed.post_id)}
                >
                  <Heart size={16} />
                  View Likes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Moderation Modal */}
      {selectedReport && selectedReportedPost && (
        <div
          className="fp-modal-backdrop"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="fp-modal-container fp-moderation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fp-modal-header">
              <h2 className="fp-modal-heading">Moderate Report</h2>
              <button
                className="fp-modal-close"
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedReportedPost(null);
                }}
              >
                <X />
              </button>
            </div>

            <div className="fp-modal-content">
              <div className="fp-modal-block">
                <h3 className="fp-block-title">Post Details</h3>
                <div className="fp-post-overview">
                  <div className="fp-post-thumb">
                    {isVideo(selectedReportedPost.post.video_url) ? (
                      <video
                        src={selectedReportedPost.post.video_url}
                        className="fp-thumb-media"
                        controls
                        style={{ maxHeight: "200px" }}
                      />
                    ) : (
                      <img
                        src={selectedReportedPost.post.video_url}
                        alt="reported-post"
                        className="fp-thumb-media"
                        style={{ maxHeight: "200px" }}
                      />
                    )}
                  </div>
                  <div className="fp-post-summary">
                    <h4>{selectedReportedPost.post.author.name}</h4>
                    <p>{selectedReportedPost.post.caption}</p>
                    <div className="fp-post-tags">
                      <span
                        className={`fp-style-tag fp-style-${selectedReportedPost.post.dance_style
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {selectedReportedPost.post.dance_style}
                      </span>
                      <span
                        className={`fp-level-tag fp-level-${selectedReportedPost.post.level?.toLowerCase()}`}
                      >
                        {selectedReportedPost.post.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fp-modal-block">
                <h3 className="fp-block-title">Report Details</h3>
                <div className="fp-report-summary">
                  <div className="fp-detail-row">
                    <span className="fp-detail-key">Reason:</span>
                    <span className="fp-reason-label">
                      {getReasonBadge(selectedReport.reason)}
                    </span>
                  </div>
                  <div className="fp-detail-row">
                    <span className="fp-detail-key">Description:</span>
                    <p>{selectedReport.description}</p>
                  </div>
                  <div className="fp-detail-row">
                    <span className="fp-detail-key">Reported by:</span>
                    <span>
                      {selectedReport.reporter.name} (
                      {selectedReport.reporter.email})
                    </span>
                  </div>
                  <div className="fp-detail-row">
                    <span className="fp-detail-key">Reported at:</span>
                    <span>
                      {new Date(selectedReport.reported_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="fp-detail-row">
                    <span className="fp-detail-key">Total Reports:</span>
                    <span>{selectedReportedPost.post.report_count}</span>
                  </div>
                </div>
              </div>

              {selectedReportedPost.reports.length > 1 && (
                <div className="fp-modal-block">
                  <h3 className="fp-block-title">
                    All Reports ({selectedReportedPost.reports.length})
                  </h3>
                  <div className="fp-all-reports">
                    {selectedReportedPost.reports.map((report) => (
                      <div key={report.id} className="fp-report-brief">
                        <div className="fp-brief-header">
                          <span className="fp-reason-label">
                            {getReasonBadge(report.reason)}
                          </span>
                          <span
                            className={`fp-status-label fp-status-${report.status}`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="fp-brief-desc">{report.description}</p>
                        <div className="fp-brief-info">
                          <span>By: {report.reporter.name}</span>
                          <span>
                            {new Date(report.reported_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="fp-modal-block">
                <h3 className="fp-block-title">Moderation Action</h3>
                <div className="fp-action-picker">
                  <select
                    value={moderationAction}
                    onChange={(e) => setModerationAction(e.target.value)}
                    className="fp-action-dropdown"
                  >
                    <option value="">Select Action</option>
                    <option value="resolve">Resolve</option>
                    <option value="dismiss">Dismiss</option>
                    <option value="hide_post">Hide Post</option>
                    <option value="send_warning">Send Warning</option>
                  </select>
                </div>

                <div className="fp-admin-textarea">
                  <label className="fp-textarea-label">Admin Notes:</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="fp-notes-input"
                    placeholder="Add notes for this moderation action..."
                    rows={4}
                  />
                </div>
              </div>

              {error && (
                <div className="fp-error-message" style={{ color: "#ef4444", marginBottom: "1rem", textAlign: "center", fontWeight: "500" }}>
                  <AlertOctagon size={16} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />
                  {error}
                </div>
              )}

              <div className="fp-modal-actions">
                <button
                  className="fp-btn fp-btn-secondary"
                  onClick={() => {
                    setSelectedReport(null);
                    setSelectedReportedPost(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="fp-btn fp-btn-primary"
                  onClick={handleModerateReport}
                  disabled={!moderationAction || isLoading}
                >
                  {isLoading ? "Processing..." : "Apply Action"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Likes Modal */}
      {likesData && (
        <div className="fp-modal-backdrop" onClick={() => setLikesData(null)}>
          <div
            className="fp-modal-container fp-likes-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fp-modal-header">
              <h2 className="fp-modal-heading">
                Likes for Post #{likesData.post.id}
              </h2>
              <button
                className="fp-modal-close"
                onClick={() => setLikesData(null)}
              >
                <X />
              </button>
            </div>

            <div className="fp-modal-content">
              {likesData.analytics && (
                <div className="fp-modal-block">
                  <h3 className="fp-block-title">Analytics Insights</h3>
                  <div className="fp-analytics-overview">
                    <div className="fp-analytics-item">
                      <div className="fp-analytics-emoji">❤️</div>
                      <div className="fp-analytics-info">
                        <div className="fp-analytics-count">
                          {likesData.analytics.total_likes}
                        </div>
                        <div className="fp-analytics-desc">Total Likes</div>
                      </div>
                    </div>
                    <div className="fp-analytics-item">
                      <div className="fp-analytics-emoji">🎯</div>
                      <div className="fp-analytics-info">
                        <div className="fp-analytics-count">
                          {likesData.analytics.engagement_insights
                            ?.most_active_skill_level || "N/A"}
                        </div>
                        <div className="fp-analytics-desc">
                          Most Active Level
                        </div>
                      </div>
                    </div>
                    <div className="fp-analytics-item">
                      <div className="fp-analytics-emoji">📈</div>
                      <div className="fp-analytics-info">
                        <div className="fp-analytics-count">
                          {likesData.analytics.engagement_insights
                            ?.peak_like_date?.like_date
                            ? new Date(
                              likesData.analytics.engagement_insights.peak_like_date.like_date
                            ).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div className="fp-analytics-desc">Peak Like Date</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="fp-modal-block">
                <h3 className="fp-block-title">Users Who Liked</h3>
                {likesData.likes.length > 0 ? (
                  <div className="fp-likes-listing">
                    {likesData.likes.map((like) => (
                      <div key={like.like_id} className="fp-like-user">
                        <div className="fp-user-avatar">
                          <img
                            src={
                              like.user.profile_image ||
                              "https://via.placeholder.com/40?text=U"
                            }
                            alt={like.user.name}
                            className="fp-avatar-img"
                          />
                        </div>
                        <div className="fp-user-data">
                          <div className="fp-user-title">{like.user.name}</div>
                          <div className="fp-user-level">
                            <span
                              className={`fp-level-tag fp-level-${like.user.skill_level?.toLowerCase()}`}
                            >
                              {like.user.skill_level}
                            </span>
                          </div>
                        </div>
                        <div className="fp-heart-icon">
                          <Heart size={16} fill="currentColor" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="fp-empty-view">
                    <span className="fp-empty-emoji">💔</span>
                    <span className="fp-empty-msg">
                      No likes yet for this post.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
