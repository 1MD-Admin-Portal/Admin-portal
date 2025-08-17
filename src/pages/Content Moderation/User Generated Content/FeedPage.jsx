import React, { useEffect, useState } from "react";
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

  return (
    <div className="feed-page">
      <h2 className="feed-title">📢 Feed Management</h2>

      <div className="feed-grid">
        {feeds.map((feed) => (
          <div
            key={feed.post_id}
            className="feed-card"
            onClick={() => setSelectedFeed(feed)}
          >
            <img
              src={feed.content.video_url}
              alt="feed-thumbnail"
              className="feed-thumbnail"
            />
            <div className="feed-info">
              <h3>{feed.user.name}</h3>
              <p>{feed.content.caption}</p>
              <span>
                {feed.metadata.dance_style} | {feed.metadata.level}
              </span>
              <p>❤️ {feed.metadata.like_count} Likes</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {pagination.hasPreviousPage && (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        )}
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        {pagination.hasNextPage && (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>
      {/* Feed Details Modal */}
      {selectedFeed && (
        <div
          className="modal-overlay-feed"
          onClick={() => setSelectedFeed(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedFeed.user.name} - Feed Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedFeed(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content-feed">
              <img
                src={selectedFeed.content.video_url}
                alt="feed-detail"
                className="modal-thumbnail"
              />
              <div className="modal-section">
                <p>
                  <b>Caption:</b> {selectedFeed.content.caption}
                </p>
                <p>
                  <b>Dance Style:</b> {selectedFeed.metadata.dance_style}
                </p>
                <p>
                  <b>Level:</b> {selectedFeed.metadata.level}
                </p>
                <p>
                  <b>Likes:</b> {selectedFeed.metadata.like_count}
                </p>
              </div>
              <button
                className="view-likes-btn"
                onClick={() => handleViewLikes(selectedFeed.post_id)}
              >
                View Likes
              </button>
            </div>
          </div>
        </div>
      )}

      {likesData && (
        <div className="modal-overlay-likes" onClick={() => setLikesData(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👍 Likes for Post {likesData.post.id}</h2>
              <button className="close-btn" onClick={() => setLikesData(null)}>
                ✕
              </button>
            </div>

            <div className="modal-content-likes">
              {likesData.likes.length > 0 ? (
                <ul className="likes-list">
                  {likesData.likes.map((like) => (
                    <li key={like.like_id} className="like-user">
                      <img
                        src={
                          like.user.profile_image ||
                          "https://via.placeholder.com/40"
                        }
                        alt={like.user.name}
                      />
                      <div className="info">
                        <span className="name">{like.user.name}</span>
                        <span className="email">({like.user.skill_level})</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ textAlign: "center", color: "#6b7280" }}>
                  🚫 No likes yet for this post.
                </p>
              )}

              <div className="analytics">
                <h4>📊 Insights</h4>
                <p>Total Likes: {likesData.analytics.total_likes}</p>
                <p>
                  Most Active Skill Level:{" "}
                  {likesData.analytics.engagement_insights
                    ?.most_active_skill_level || "N/A"}
                </p>
                <p>
                  Peak Like Date:{" "}
                  {likesData.analytics.engagement_insights?.peak_like_date
                    ?.like_date || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
