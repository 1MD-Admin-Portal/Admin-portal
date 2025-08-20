import React, { useEffect, useState } from "react";
import { X, Heart, Play } from "lucide-react";
import {
  getFeedsService,
  getFeedLikesService,
} from "../../../services/feed.service";
import "./FeedPage.css";

const FeedPage = () => {
  const [feeds, setFeeds] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [likesData, setLikesData] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFeeds(page);
  }, [page]);

  const fetchFeeds = async (page) => {
    const res = await getFeedsService(page, 12);
    setFeeds(res.posts || []);
    setPagination(res.pagination || {});
  };

  const handleViewLikes = async (postId) => {
    const res = await getFeedLikesService(postId);
    setLikesData(res);
  };
  // helper function to check if url is video
  const isVideo = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith(".mp4");
  };

  return (
    <div className="feed-page-container">
      <div className="feed-page-header">
        <h2 className="feed-page-title">Feed Management</h2>
      </div>

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

              {/* ✅ Play overlay only for thumbnail previews */}
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

      {/* Pagination */}
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
                      controls // ✅ adds play/pause, volume, fullscreen, etc.
                      autoPlay
                    />
                  ) : (
                    <img
                      src={selectedFeed.content.video_url}
                      alt="feed-detail"
                      className="modal-feed-thumbnail"
                    />
                  )}
                  {/* ❌ No overlay here — let user interact with controls */}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
