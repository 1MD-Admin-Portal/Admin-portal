import React, { useState } from "react";
import "../../styles/CreateChallengeModal.css";

const CreateChallengeModal = ({ onClose }) => {
  const [watchVideos, setWatchVideos] = useState([{ title: "", id: Date.now() }]);
  const [uploadVideo, setUploadVideo] = useState({ title: "", file: null });

  const handleAddWatchVideo = () => {
    setWatchVideos([...watchVideos, { title: "", id: Date.now() }]);
  };

  const handleWatchTitleChange = (index, value) => {
    const updated = [...watchVideos];
    updated[index].title = value;
    setWatchVideos(updated);
  };

  const handleUploadVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadVideo((prev) => ({ ...prev, file }));
    }
  };

  return (
    <div className="create-challenge-modal">
      <div className="modal-content-challenge">
        <div className="modal-header">
          <span onClick={onClose} className="back-button">← Back</span>
          <h2>Create New Challenge</h2>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Challenge Title</label>
            <input type="text" placeholder="Challenge" />
          </div>

          <div className="form-group">
            <label>Challenger Type</label>
            <select>
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Description" />
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="form-group">
            <label>Dance Style</label>
            <select>
              <option>Salsa</option>
              <option>Bachata</option>
              <option>Kizomba</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dance Level</label>
            <select>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advance</option>
            </select>
          </div>

          <div className="task-section">
            <h4>Challenge Tasks</h4>
            {watchVideos.map((video, index) => (
              <div key={video.id} className="task-row">
                <span className="task-type">+ Watch Video</span>
                <input
                  type="text"
                  placeholder="Video Title"
                  value={video.title}
                  onChange={(e) => handleWatchTitleChange(index, e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleAddWatchVideo} className="add-task-btn">+ Add Watch Video</button>

            <div className="task-row">
              <span className="task-type">Upload Video</span>
              <input
                type="text"
                placeholder="Upload Task Title"
                value={uploadVideo.title}
                onChange={(e) => setUploadVideo((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="file"
                accept="video/*"
                onChange={handleUploadVideoChange}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="publish-btn">Publish Challenge</button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeModal;
