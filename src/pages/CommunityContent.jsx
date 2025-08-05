import React, { useState } from "react";
import "../styles/CommunityContent.css";

const dummyContent = [
  {
    id: 1,
    image: "https://dummyimage.com/48x48/000/fff",
    caption: "Love this Challenge",
    postedBy: "Ananya R.",
    likes: 150,
    status: "Published",
    date: "May 1",
  },
];

const CommunityContent = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);

  const handleRowClick = (content) => {
    setSelectedContent(content);
  };

  const closeModal = () => {
    setSelectedContent(null);
  };

  return (
    <div className="community-content-page">
      <div className="community-header">
        <h1>User Generated Content</h1>
      </div>

      <div className="filters-bar">
        <div className="filters-left">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Video">Video</option>
            <option value="Image">Image</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        <div className="filters-right">
          <input
            type="text"
            placeholder="Search Content"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="tabs">
        <button className="active">All</button>
        <button>Videos</button>
        <button>Images</button>
      </div>

      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Caption</th>
              <th>Posted By</th>
              <th>Likes</th>
              <th>Status</th>
              <th>Date</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {dummyContent.map((content) => (
              <tr key={content.id} onClick={() => handleRowClick(content)}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="content-caption">
                  <img src={content.image} alt="content" />
                  <span>{content.caption}</span>
                </td>
                <td>{content.postedBy}</td>
                <td>{content.likes}</td>
                <td>
                  <span
                    className={`status-tag status-${content.status.toLowerCase()}`}
                  >
                    {content.status}
                  </span>
                </td>
                <td>{content.date}</td>
                {/* <td className="actions">⋮</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedContent && (
        <div className="modal-overlay">
          <div className="modal-content-community">
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <h2 className="modal-title">Content Details</h2>

            <div className="modal-info">
              <img
                src={selectedContent.image}
                alt="preview"
                className="modal-img"
              />
              <p>
                <strong>Caption:</strong> {selectedContent.caption}
              </p>
              <p>
                <strong>Posted By:</strong> {selectedContent.postedBy}
              </p>
              <p>
                <strong>Likes:</strong> {selectedContent.likes}
              </p>
              <p>
                <strong>Status:</strong> {selectedContent.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedContent.date}
              </p>
            </div>

            <div className="modal-actions">
              <button className="delete-btn">Delete</button>
              <button className="flag-btn">Flag</button>
              <button className="suspend-btn">Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityContent;
