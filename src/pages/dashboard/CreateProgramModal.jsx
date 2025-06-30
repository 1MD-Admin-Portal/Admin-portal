import React, { useState } from "react";
import "../../styles/CreateProgramModal.css"; // Assuming you have a CSS file for styling
const CreateProgramModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [tags, setTags] = useState([]);
  const [danceStyle, setDanceStyle] = useState("");
  const [danceLevel, setDanceLevel] = useState("");
  const [pricing, setPricing] = useState("free");
  const [price, setPrice] = useState("");
  const [videos, setVideos] = useState([]);
  const [instructor, setInstructor] = useState("");

  const instructorOptions = ["Ananya R.", "Dev P.", "Maria K."];
  const danceStyles = ["Salsa", "Bachata", "Hip-Hop", "Contemporary"];

  const addVideo = () => {
    setVideos([...videos, { title: "", duration: "" }]);
  };

  const removeVideo = (index) => {
    const updated = [...videos];
    updated.splice(index, 1);
    setVideos(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="vp-modal-backdrop">
      <div className="vp-modal">
        <h2>Create a Video Program</h2>

        <input
          placeholder="Program Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="vp-tags-container">
          <label>Dance Style:</label>
          <select value={danceStyle} onChange={(e) => setDanceStyle(e.target.value)}>
            <option value="">Select style</option>
            {danceStyles.map((style, idx) => (
              <option key={idx} value={style}>{style}</option>
            ))}
          </select>

          <label>Dance Level:</label>
          <input
            placeholder="e.g., Beginner"
            value={danceLevel}
            onChange={(e) => setDanceLevel(e.target.value)}
          />
        </div>

        <textarea
          className="overview"
          placeholder="Overview (e.g., - Bullet points)"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
        />

        <div className="vp-pricing-section">
          <label>Pricing:</label>
          <div>
            <label>
              <input
                type="radio"
                checked={pricing === "free"}
                onChange={() => setPricing("free")}
              />
              Free
            </label>
            <label>
              <input
                type="radio"
                checked={pricing === "paid"}
                onChange={() => setPricing("paid")}
              />
              Paid
              {pricing === "paid" && (
                <input
                  type="text"
                  value={price}
                  placeholder="Enter price"
                  onChange={(e) => setPrice(e.target.value)}
                />
              )}
            </label>
          </div>
        </div>

        <div className="vp-videos-section">
          <div className="vp-video-header">
            <strong>Videos</strong>
            <button onClick={addVideo}>+ Add Video</button>
          </div>
          {videos.map((vid, idx) => (
            <div key={idx} className="vp-video-item">
              <input
                placeholder="Title"
                value={vid.title}
                onChange={(e) => {
                  const updated = [...videos];
                  updated[idx].title = e.target.value;
                  setVideos(updated);
                }}
              />
              <input
                placeholder="Duration (e.g., 5:32)"
                value={vid.duration}
                onChange={(e) => {
                  const updated = [...videos];
                  updated[idx].duration = e.target.value;
                  setVideos(updated);
                }}
              />
              <button onClick={() => removeVideo(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="vp-modal-footer">
          <select value={instructor} onChange={(e) => setInstructor(e.target.value)}>
            <option value="">Select Instructor</option>
            {instructorOptions.map((inst, i) => (
              <option key={i} value={inst}>{inst}</option>
            ))}
          </select>
          <button className="vp-create-btn">+ Create Program</button>
          <button className="vp-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgramModal;
