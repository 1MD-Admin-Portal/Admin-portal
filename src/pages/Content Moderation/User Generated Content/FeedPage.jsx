import React, { useEffect, useState } from "react";
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
  getReportedPostsService,
  moderateReportService,
  getModerationStatsService,
} from "../../../services/feed.service";
import "./FeedPage.css";

const FeedPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [likesData, setLikesData] = useState(null);
  const [page, setPage] = useState(1);

  // Content Moderation States
  const [activeTab, setActiveTab] = useState("feeds"); // 'feeds', 'reports', 'stats'
  const [reportedPosts, setReportedPosts] = useState([]);
  const [reportsPagination, setReportsPagination] = useState({});
  const [reportsPage, setReportsPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportedPost, setSelectedReportedPost] = useState(null);
  const [moderationAction, setModerationAction] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [moderationStats, setModerationStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "feeds") {
      fetchFeeds(page);
    } else if (activeTab === "reports") {
      fetchReportedPosts(reportsPage);
    } else if (activeTab === "stats") {
      fetchModerationStats();
    }
  }, [page, reportsPage, activeTab]);

  const fetchFeeds = async (page) => {
    const res = await getFeedsService(page, 12);
    setFeeds(res.posts || []);
    setPagination(res.pagination || {});
  };

  const fetchReportedPosts = async (page) => {
    setIsLoading(true);
    const res = await getReportedPostsService(page, 10);
    setReportedPosts(res.reported_posts || []);
    setReportsPagination(res.pagination || {});
    setIsLoading(false);
  };

  const fetchModerationStats = async () => {
    setIsLoading(true);
    const res = await getModerationStatsService();
    setModerationStats(res.statistics || {});
    setIsLoading(false);
  };

  const handleViewLikes = async (postId) => {
    const res = await getFeedLikesService(postId);
    setLikesData(res);
  };

  const handleOpenModerationModal = (reportedPost) => {
    setSelectedReportedPost(reportedPost);
    setSelectedReport(reportedPost.reports[0]); // Select first pending report
    setModerationAction("");
    setAdminNotes("");
  };

  const handleModerateReport = async () => {
    if (!selectedReport || !moderationAction) return;

    try {
      setIsLoading(true);
      await moderateReportService(
        selectedReport.id,
        moderationAction,
        adminNotes
      );

      // Refresh reported posts
      fetchReportedPosts(reportsPage);

      // Close modal
      setSelectedReport(null);
      setSelectedReportedPost(null);
      setModerationAction("");
      setAdminNotes("");

      alert("Report moderated successfully!");
    } catch (error) {
      alert("Failed to moderate report. Please try again.");
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
        return <Eye size={16} />;
      case "warning_sent":
        return <AlertTriangle size={16} />;
      case "post_hidden":
        return <Ban size={16} />;
      case "post_deleted":
        return <Trash2 size={16} />;
      case "user_suspended":
        return <AlertOctagon size={16} />;
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
      no_action: "No Action",
      warning_sent: "Send Warning",
      post_hidden: "Hide Post",
      post_deleted: "Delete Post",
      user_suspended: "Suspend User",
    };
    return actionMap[action] || action;
  };

  return (
    <div className="feed-page-container">
      <div className="feed-page-header">
        <h2 className="feed-page-title">Feed & Content Management</h2>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "feeds" ? "active" : ""}`}
            onClick={() => setActiveTab("feeds")}
          >
            <Play size={16} />
            Feeds
          </button>
          <button
            className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <AlertTriangle size={16} />
            Reported Content
          </button>
          <button
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
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
          <div className="feed-grid">
            {feeds.map((feed) => (
              <div
                key={feed.post_id}
                className="feed-card"
                onClick={() => setSelectedFeed(feed)}
              >
                <div className="feed-thumbnail-container">
                  {isVideo(feed.content.video_url) ? (
                    <video
                      src={feed.content.video_url}
                      className="feed-thumbnail"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={feed.content.video_url}
                      alt="feed-thumbnail"
                      className="feed-thumbnail"
                    />
                  )}

                  {isVideo(feed.content.video_url) && (
                    <div className="play-overlay">
                      <Play size={24} />
                    </div>
                  )}

                  <div className="likes-overlay">
                    <Heart size={16} />
                    <span>{feed.metadata.like_count}</span>
                  </div>
                </div>

                <div className="feed-card-content">
                  <div className="feed-user-info">
                    <h3 className="feed-user-name">{feed.user.name}</h3>
                    <div className="feed-meta">
                      <span
                        className={`dance-style-badge style-${feed.metadata.dance_style
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {feed.metadata.dance_style}
                      </span>
                      <span
                        className={`level-badge level-${feed.metadata.level?.toLowerCase()}`}
                      >
                        {feed.metadata.level}
                      </span>
                    </div>
                  </div>

                  <p className="feed-caption">{feed.content.caption}</p>

                  <div className="feed-stats">
                    <div className="stat-item">
                      <Heart size={16} />
                      <span>{feed.metadata.like_count} Likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {feeds.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📱</span>
              <span className="empty-text">No feeds found.</span>
            </div>
          )}

          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </button>
            <span className="page-indicator">
              Page {pagination.page || 1} of {pagination.totalPages || 1}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Reported Content Tab */}
      {activeTab === "reports" && (
        <div className="reports-section">
          {isLoading ? (
            <div className="loading-state">Loading reported posts...</div>
          ) : (
            <>
              <div className="reports-grid">
                {reportedPosts.map((reportedPost) => (
                  <div key={reportedPost.post.id} className="report-card">
                    <div className="report-header">
                      <div className="report-post-info">
                        <h3 className="post-author">
                          {reportedPost.post.author.name}
                        </h3>
                        <p className="post-caption">
                          {reportedPost.post.caption}
                        </p>
                        <div className="post-meta">
                          <span
                            className={`dance-style-badge style-${reportedPost.post.dance_style
                              ?.toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {reportedPost.post.dance_style}
                          </span>
                          <span
                            className={`level-badge level-${reportedPost.post.level?.toLowerCase()}`}
                          >
                            {reportedPost.post.level}
                          </span>
                        </div>
                      </div>
                      <div className="report-count">
                        <AlertTriangle size={20} />
                        <span>{reportedPost.post.report_count} Reports</span>
                      </div>
                    </div>

                    <div className="report-thumbnail">
                      {isVideo(reportedPost.post.video_url) ? (
                        <video
                          src={reportedPost.post.video_url}
                          className="report-thumbnail-media"
                          muted
                        />
                      ) : (
                        <img
                          src={reportedPost.post.video_url}
                          alt="reported-content"
                          className="report-thumbnail-media"
                        />
                      )}
                    </div>

                    <div className="reports-list">
                      {reportedPost.reports.slice(0, 2).map((report) => (
                        <div key={report.id} className="report-item">
                          <div className="report-reason">
                            <span className="reason-badge">
                              {getReasonBadge(report.reason)}
                            </span>
                            <span
                              className={`status-badge status-${report.status}`}
                            >
                              {report.status}
                            </span>
                          </div>
                          <p className="report-description">
                            {report.description}
                          </p>
                          <div className="report-meta">
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
                        <div className="more-reports">
                          +{reportedPost.reports.length - 2} more reports
                        </div>
                      )}
                    </div>

                    <div className="report-actions">
                      <button
                        className="btn btn-primary"
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
                <div className="empty-state">
                  <span className="empty-icon">✅</span>
                  <span className="empty-text">No reported posts found.</span>
                </div>
              )}

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => setReportsPage(reportsPage - 1)}
                  disabled={!reportsPagination.hasPreviousPage}
                >
                  Previous
                </button>
                <span className="page-indicator">
                  Page {reportsPagination.page || 1} of{" "}
                  {reportsPagination.totalPages || 1}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setReportsPage(reportsPage + 1)}
                  disabled={!reportsPagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Moderation Stats Tab */}
      {activeTab === "stats" && (
        <div className="stats-section">
          {isLoading ? (
            <div className="loading-state">Loading statistics...</div>
          ) : (
            <>
              <div className="stats-overview">
                <div className="stats-card">
                  <div className="stats-icon">📊</div>
                  <div className="stats-content">
                    <div className="stats-value">
                      {moderationStats.reports?.total || 0}
                    </div>
                    <div className="stats-label">Total Reports</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">⏳</div>
                  <div className="stats-content">
                    <div className="stats-value">
                      {moderationStats.reports?.pending || 0}
                    </div>
                    <div className="stats-label">Pending Reports</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">✅</div>
                  <div className="stats-content">
                    <div className="stats-value">
                      {moderationStats.reports?.resolved || 0}
                    </div>
                    <div className="stats-label">Resolved Reports</div>
                  </div>
                </div>
                <div className="stats-card">
                  <div className="stats-icon">❌</div>
                  <div className="stats-content">
                    <div className="stats-value">
                      {moderationStats.reports?.dismissed || 0}
                    </div>
                    <div className="stats-label">Dismissed Reports</div>
                  </div>
                </div>
              </div>

              <div className="stats-details">
                <div className="stats-section-card">
                  <h3 className="section-title">Reports by Reason</h3>
                  <div className="reason-stats">
                    {moderationStats.reports_by_reason?.map((item) => (
                      <div
                        key={item.report_reason}
                        className="reason-stat-item"
                      >
                        <span className="reason-name">
                          {getReasonBadge(item.report_reason)}
                        </span>
                        <span className="reason-count">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stats-section-card">
                  <h3 className="section-title">Admin Actions</h3>
                  <div className="action-stats">
                    {moderationStats.admin_actions?.map((item) => (
                      <div key={item.admin_action} className="action-stat-item">
                        {getActionIcon(item.admin_action)}
                        <span className="action-name">
                          {getActionLabel(item.admin_action)}
                        </span>
                        <span className="action-count">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stats-section-card">
                  <h3 className="section-title">Most Reported Posts</h3>
                  <div className="reported-posts-stats">
                    {moderationStats.most_reported_posts?.map((post) => (
                      <div key={post.id} className="reported-post-item">
                        <div className="post-info">
                          <div className="post-caption">{post.caption}</div>
                          <div className="post-author">
                            by {post.author_name}
                          </div>
                          <div className="post-style">{post.dance_style}</div>
                        </div>
                        <div className="post-report-count">
                          <AlertTriangle size={16} />
                          <span>{post.report_count} reports</span>
                        </div>
                        {post.is_hidden === 1 && (
                          <div className="post-status hidden">Hidden</div>
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
        <div className="modal-overlay" onClick={() => setSelectedFeed(null)}>
          <div
            className="modal-content feed-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedFeed.user.name} - Feed Details
              </h2>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedFeed(null)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="feed-detail-image">
                  {isVideo(selectedFeed.content.video_url) ? (
                    <video
                      src={selectedFeed.content.video_url}
                      className="modal-feed-thumbnail"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={selectedFeed.content.video_url}
                      alt="feed-detail"
                      className="modal-feed-thumbnail"
                    />
                  )}
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Content Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Caption</div>
                    <div className="info-value">
                      {selectedFeed.content.caption}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Dance Style</div>
                    <div className="info-value">
                      <span
                        className={`dance-style-badge style-${selectedFeed.metadata.dance_style
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {selectedFeed.metadata.dance_style}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Level</div>
                    <div className="info-value">
                      <span
                        className={`level-badge level-${selectedFeed.metadata.level?.toLowerCase()}`}
                      >
                        {selectedFeed.metadata.level}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Likes</div>
                    <div className="info-value">
                      <div className="likes-count">
                        <Heart size={18} />
                        <span>{selectedFeed.metadata.like_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="view-likes-btn"
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
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div
            className="modal-content moderation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">Moderate Report</h2>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedReportedPost(null);
                }}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3 className="section-title">Post Details</h3>
                <div className="post-preview">
                  <div className="post-thumbnail">
                    {isVideo(selectedReportedPost.post.video_url) ? (
                      <video
                        src={selectedReportedPost.post.video_url}
                        className="post-thumbnail-media"
                        controls
                        style={{ maxHeight: "200px" }}
                      />
                    ) : (
                      <img
                        src={selectedReportedPost.post.video_url}
                        alt="reported-post"
                        className="post-thumbnail-media"
                        style={{ maxHeight: "200px" }}
                      />
                    )}
                  </div>
                  <div className="post-details">
                    <h4>{selectedReportedPost.post.author.name}</h4>
                    <p>{selectedReportedPost.post.caption}</p>
                    <div className="post-badges">
                      <span
                        className={`dance-style-badge style-${selectedReportedPost.post.dance_style
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {selectedReportedPost.post.dance_style}
                      </span>
                      <span
                        className={`level-badge level-${selectedReportedPost.post.level?.toLowerCase()}`}
                      >
                        {selectedReportedPost.post.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Report Details</h3>
                <div className="report-details">
                  <div className="detail-item">
                    <span className="detail-label">Reason:</span>
                    <span className="reason-badge">
                      {getReasonBadge(selectedReport.reason)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Description:</span>
                    <p>{selectedReport.description}</p>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reported by:</span>
                    <span>
                      {selectedReport.reporter.name} (
                      {selectedReport.reporter.email})
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reported at:</span>
                    <span>
                      {new Date(selectedReport.reported_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Reports:</span>
                    <span>{selectedReportedPost.post.report_count}</span>
                  </div>
                </div>
              </div>

              {selectedReportedPost.reports.length > 1 && (
                <div className="modal-section">
                  <h3 className="section-title">
                    All Reports ({selectedReportedPost.reports.length})
                  </h3>
                  <div className="all-reports-list">
                    {selectedReportedPost.reports.map((report) => (
                      <div key={report.id} className="report-summary">
                        <div className="report-summary-header">
                          <span className="reason-badge">
                            {getReasonBadge(report.reason)}
                          </span>
                          <span
                            className={`status-badge status-${report.status}`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="report-summary-description">
                          {report.description}
                        </p>
                        <div className="report-summary-meta">
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

              <div className="modal-section">
                <h3 className="section-title">Moderation Action</h3>
                <div className="action-selection">
                  <select
                    value={moderationAction}
                    onChange={(e) => setModerationAction(e.target.value)}
                    className="action-select"
                  >
                    <option value="">Select Action</option>
                    <option value="no_action">
                      No Action - Dismiss Report
                    </option>
                    <option value="warning_sent">Send Warning to User</option>
                    <option value="post_hidden">
                      Hide Post from Public View
                    </option>
                    <option value="post_deleted">
                      Delete Post Permanently
                    </option>
                    <option value="user_suspended">Suspend User Account</option>
                  </select>
                </div>

                <div className="admin-notes">
                  <label className="notes-label">Admin Notes:</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="notes-textarea"
                    placeholder="Add notes for this moderation action..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedReport(null);
                    setSelectedReportedPost(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
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
        <div className="modal-overlay" onClick={() => setLikesData(null)}>
          <div
            className="modal-content likes-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                Likes for Post #{likesData.post.id}
              </h2>
              <button
                className="modal-close-btn"
                onClick={() => setLikesData(null)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body">
              {likesData.analytics && (
                <div className="modal-section">
                  <h3 className="section-title">Analytics Insights</h3>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <div className="analytics-icon">❤️</div>
                      <div className="analytics-content">
                        <div className="analytics-value">
                          {likesData.analytics.total_likes}
                        </div>
                        <div className="analytics-label">Total Likes</div>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-icon">🎯</div>
                      <div className="analytics-content">
                        <div className="analytics-value">
                          {likesData.analytics.engagement_insights
                            ?.most_active_skill_level || "N/A"}
                        </div>
                        <div className="analytics-label">Most Active Level</div>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-icon">📈</div>
                      <div className="analytics-content">
                        <div className="analytics-value">
                          {likesData.analytics.engagement_insights
                            ?.peak_like_date?.like_date
                            ? new Date(
                                likesData.analytics.engagement_insights.peak_like_date.like_date
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div className="analytics-label">Peak Like Date</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="modal-section">
                <h3 className="section-title">Users Who Liked</h3>
                {likesData.likes.length > 0 ? (
                  <div className="likes-list">
                    {likesData.likes.map((like) => (
                      <div key={like.like_id} className="like-user-item">
                        <div className="user-avatar">
                          <img
                            src={
                              like.user.profile_image ||
                              "https://via.placeholder.com/40?text=U"
                            }
                            alt={like.user.name}
                            className="avatar-image"
                          />
                        </div>
                        <div className="user-info">
                          <div className="user-name">{like.user.name}</div>
                          <div className="user-skill">
                            <span
                              className={`level-badge level-${like.user.skill_level?.toLowerCase()}`}
                            >
                              {like.user.skill_level}
                            </span>
                          </div>
                        </div>
                        <div className="like-icon">
                          <Heart size={16} fill="currentColor" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">💔</span>
                    <span className="empty-text">
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
