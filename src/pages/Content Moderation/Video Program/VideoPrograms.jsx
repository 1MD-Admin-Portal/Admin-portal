import React, { useState, useEffect } from "react";
import "./VideoPrograms.css";
import CreateProgramModal from "./CreateProgramModal";
import { X } from "lucide-react";
import { getProgramsService } from "../../../services/program.service";

const VideoPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [videoFilter, setVideoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const res = await getProgramsService();
        console.log("Loaded programs response:", res);
        if (Array.isArray(res)) {
          setPrograms(res);
        } else if (res && Array.isArray(res.programs)) {
          setPrograms(res.programs);
        } else {
          setPrograms([]); // fallback
        }
      } catch (e) {
        console.error("Failed to load programs", e);
      }
    };
    loadPrograms();
  }, []);

  const filterVideos = (prog) => {
    const matchesSearch = prog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || prog.dance_level === levelFilter;
    const matchesStatus = !statusFilter || prog.status === statusFilter;
    const videoCount = prog.videos.length;
    const matchesVideoCount = (() => {
      switch (videoFilter) {
        case "0":
          return videoCount === 0;
        case "1-10":
          return videoCount > 0 && videoCount <= 10;
        case "10-30":
          return videoCount > 10 && videoCount <= 30;
        case "30-50":
          return videoCount > 30 && videoCount <= 50;
        case "50-100":
          return videoCount > 50 && videoCount <= 100;
        case "100+":
          return videoCount > 100;
        default:
          return true;
      }
    })();
    return matchesSearch && matchesLevel && matchesStatus && matchesVideoCount;
  };

  const filteredPrograms = programs.filter(filterVideos);

  return (
    <div className="video-programs-container">
      {/* header and filters */}
      <div className="video-programs-header">
        <h1 className="video-programs-title">Video Programs Management</h1>
        <button
          className="create-video-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Video Program
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <input
            type="text"
            className="filter-input"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            onChange={(e) => setLevelFilter(e.target.value)}
            defaultValue=""
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advance">Advance</option>
            <option value="Professional">Professional</option>
          </select>
          <select
            className="filter-select"
            onChange={(e) => setVideoFilter(e.target.value)}
            defaultValue=""
          >
            <option value="">All Videos</option>
            <option value="0">0</option>
            <option value="1-10">1 - 10</option>
            <option value="10-30">10 - 30</option>
            <option value="30-50">30 - 50</option>
            <option value="50-100">50 - 100</option>
            <option value="100+">100+</option>
          </select>
          <select
            className="filter-select"
            onChange={(e) => setStatusFilter(e.target.value)}
            defaultValue=""
          >
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* table */}
      <div className="video-programs-table-container">
        <table className="video-programs-table">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Program Title</th>
              <th>Host</th>
              <th>Level</th>
              <th>Videos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((prog) => (
              <tr
                key={prog.program_id}
                onClick={() => setSelectedProgram(prog)}
                className="clickable-row"
              >
                <td>
                  <input type="checkbox" className="program-checkbox" />
                </td>
                <td className="program-title">
                  <div className="program-title-content">
                    <img
                      src={
                        prog.image_url ||
                        "https://via.placeholder.com/40?text=No+Image"
                      }
                      alt="thumbnail"
                      className="program-thumbnail"
                    />
                    <span className="program-name">{prog.title}</span>
                  </div>
                </td>
                <td className="program-host">
                  {prog.instructor_name || `Instructor #${prog.instructor_id}`}
                </td>
                <td className="program-level">
                  <span
                    className={`level-badge level-${prog.dance_level?.toLowerCase()}`}
                  >
                    {prog.dance_level}
                  </span>
                </td>
                <td className="program-videos">
                  <span className="video-count">{prog.videos.length}</span>
                </td>
                <td className="program-status">
                  <span
                    className={`status status-${
                      prog.status?.toLowerCase() || "published"
                    }`}
                  >
                    Published
                  </span>
                </td>
              </tr>
            ))}
            {filteredPrograms.length === 0 && (
              <tr>
                <td colSpan="6" className="no-programs">
                  <div className="empty-state">
                    <span className="empty-icon">📹</span>
                    <span className="empty-text">No programs found.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* create modal */}
      <CreateProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instructorOptions={[{ id: 1, name: "Ananya R." }]}
        danceStyles={["Salsa", "Hip-Hop", "Bachata", "Contemporary"]}
      />

      {/* view modal */}
      {selectedProgram && (
        <div
          className="video-popup-overlay"
          onClick={() => {
            setSelectedProgram(null);
            setAction(null);
            setReason("");
          }}
        >
          <div
            className="video-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h2 className="popup-title">{selectedProgram.title}</h2>
              <button
                className="popup-close"
                onClick={() => {
                  setSelectedProgram(null);
                  setAction(null);
                  setReason("");
                }}
              >
                <X />
              </button>
            </div>

            <div className="popup-body">
              <div className="popup-image-container">
                <img
                  src={
                    selectedProgram.image_url ||
                    "https://via.placeholder.com/300?text=No+Image"
                  }
                  alt="cover"
                  className="popup-image"
                />
              </div>

              <div className="popup-info">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Host</div>
                    <div className="info-value">
                      {selectedProgram.instructor_name ||
                        `Instructor #${selectedProgram.instructor_id}`}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Level</div>
                    <div className="info-value">
                      <span
                        className={`level-badge level-${selectedProgram.dance_level?.toLowerCase()}`}
                      >
                        {selectedProgram.dance_level}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Status</div>
                    <div className="info-value">
                      <span className="status status-published">Published</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Total Videos</div>
                    <div className="info-value">
                      <span className="video-count">
                        {selectedProgram.videos.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="popup-section">
                <h3 className="section-title">Videos</h3>
                <div className="videos-list">
                  {selectedProgram.videos.map((video) => (
                    <div key={video.id} className="video-item">
                      <div className="video-info">
                        <div className="video-title">{video.title}</div>
                        <div className="video-duration">{video.duration}</div>
                      </div>
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="watch-link"
                      >
                        Watch Video
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="program-actions">
                <button
                  className="action-btn danger-btn"
                  onClick={() => setAction("Delete")}
                >
                  Delete
                </button>
                <button
                  className="action-btn warning-btn"
                  onClick={() => setAction("Retire")}
                >
                  Retire
                </button>
                <button
                  className="action-btn pause-btn"
                  onClick={() => setAction("Pause")}
                >
                  Pause
                </button>
              </div>

              {action && (
                <div className="reason-form">
                  <h4 className="reason-title">{action} Reason:</h4>
                  <textarea
                    className="reason-textarea"
                    placeholder={`Why do you want to ${action.toLowerCase()} this program?`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    className="submit-reason"
                    onClick={() => {
                      console.log(
                        `${action} program ${selectedProgram.title} for reason: ${reason}`
                      );
                      setSelectedProgram(null);
                      setAction(null);
                      setReason("");
                    }}
                    disabled={!reason.trim()}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPrograms;
