import React, { useState, useEffect } from "react";
import "./VideoPrograms.css";
import GlobalLoader from "../../../components/common/GlobalLoader";
import CreateProgramModal from "./CreateProgramModal";
import { X, Check, XCircle, Clock } from "lucide-react";
import {
  getProgramsService,
  getPendingProgramsService,
  approveProgramService,
  rejectProgramService,
} from "../../../services/program.service";

const VideoPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [pendingPrograms, setPendingPrograms] = useState([]);
  const [currentView, setCurrentView] = useState("all"); // "all" or "pending"
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [videoFilter, setVideoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (currentView === "all") {
      loadPrograms();
    } else {
      loadPendingPrograms();
    }
  }, [currentView, pagination.page]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const res = await getProgramsService();
      
      if (Array.isArray(res)) {
        setPrograms(res);
      } else if (res && Array.isArray(res.programs)) {
        setPrograms(res.programs);
      } else {
        setPrograms([]); // fallback
      }
    } catch (e) {
      console.error("Failed to load programs", e);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingPrograms = async () => {
    try {
      setLoading(true);
      const res = await getPendingProgramsService(
        pagination.page,
        pagination.limit
      );
      
      setPendingPrograms(res.programs || []);
      setPagination((prev) => ({
        ...prev,
        total: res.pagination?.total || 0,
        totalPages: res.pagination?.totalPages || 1,
      }));
    } catch (e) {
      console.error("Failed to load pending programs", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProgram = async (programId, adminNotes) => {
    try {
      setLoading(true);
      const result = await approveProgramService(programId, adminNotes);
      

      // Refresh the pending programs list
      await loadPendingPrograms();

      // Close modal and reset state
      setSelectedProgram(null);
      setAction(null);
      setReason("");

      // You might want to show a success message here
      alert("Program approved successfully!");
    } catch (error) {
      console.error("Failed to approve program:", error);
      alert("Failed to approve program. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectProgram = async (programId, rejectionReason) => {
    try {
      setLoading(true);
      const result = await rejectProgramService(programId, rejectionReason);
      

      // Refresh the pending programs list
      await loadPendingPrograms();

      // Close modal and reset state
      setSelectedProgram(null);
      setAction(null);
      setReason("");

      // You might want to show a success message here
      alert("Program rejected successfully!");
    } catch (error) {
      console.error("Failed to reject program:", error);
      alert("Failed to reject program. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = (prog) => {
    const matchesSearch = prog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel = !levelFilter || prog.dance_level === levelFilter;
    const matchesStatus = !statusFilter || prog.status === statusFilter;
    const videoCount = prog.videos?.length || 0;
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

  const currentPrograms = currentView === "all" ? programs : pendingPrograms;
  const filteredPrograms = currentPrograms.filter(filterVideos);

  const getStatusDisplay = (program) => {
    if (currentView === "pending") {
      return (
        <span className="status status-pending">
          <Clock size={14} className="inline mr-1" />
          Pending Approval
        </span>
      );
    }
    return (
      <span
        className={`status status-${
          program.status?.toLowerCase() || "published"
        }`}
      >
        {program.status || "Published"}
      </span>
    );
  };

  const renderActionButtons = () => {
    if (currentView === "pending" && selectedProgram) {
      return (
        <div className="program-actions">
          <button
            className="success-btn"
            onClick={() => setAction("Approve")}
            disabled={loading}
          >
            <Check size={16} className="inline mr-1" />
            Approve
          </button>
          <button
            className="danger-btn"
            onClick={() => setAction("Reject")}
            disabled={loading}
          >
            <XCircle size={16} className="inline mr-1" />
            Reject
          </button>
        </div>
      );
    }

    // Original action buttons for regular programs
    return (
      <div className="program-actions">
        <button
          className="danger-btn"
          onClick={() => setAction("Delete")}
        >
          Delete
        </button>
        <button
          className="warning-btn"
          onClick={() => setAction("Retire")}
        >
          Retire
        </button>
        <button
          className="pause-btn"
          onClick={() => setAction("Pause")}
        >
          Pause
        </button>
      </div>
    );
  };

  const handleSubmitAction = async () => {
    if (!selectedProgram || !reason.trim()) return;

    if (action === "Approve") {
      await handleApproveProgram(selectedProgram.program_id, reason);
    } else if (action === "Reject") {
      await handleRejectProgram(selectedProgram.program_id, reason);
    } else {
      // Handle other actions (Delete, Retire, Pause) as before
      
      setSelectedProgram(null);
      setAction(null);
      setReason("");
    }
  };

  const getActionPlaceholder = () => {
    switch (action) {
      case "Approve":
        return "Add admin notes for this approval...";
      case "Reject":
        return "Provide detailed reason for rejection...";
      default:
        return `Why do you want to ${action?.toLowerCase()} this program?`;
    }
  };

  return (
    <div className="video-programs-container">
      {/* header and view toggle */}
      <div className="video-programs-header">
        <div className="header-left">
          <h1 className="video-programs-title">Video Programs Management</h1>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${currentView === "all" ? "active" : ""}`}
              onClick={() => setCurrentView("all")}
            >
              All Programs
            </button>
            <button
              className={`toggle-btn ${
                currentView === "pending" ? "active" : ""
              }`}
              onClick={() => setCurrentView("pending")}
            >
              Pending Approval
              {pendingPrograms.length > 0 && (
                <span className="pending-badge">{pendingPrograms.length}</span>
              )}
            </button>
          </div>
        </div>
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
            value={levelFilter}
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
            value={videoFilter}
          >
            <option value="">All Videos</option>
            <option value="0">0</option>
            <option value="1-10">1 - 10</option>
            <option value="10-30">10 - 30</option>
            <option value="30-50">30 - 50</option>
            <option value="50-100">50 - 100</option>
            <option value="100+">100+</option>
          </select>
          {currentView === "all" && (
            <select
              className="filter-select"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
            >
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Flagged">Flagged</option>
            </select>
          )}
        </div>
      </div>

      {/* table */}
      <div className="video-programs-table-container">
        {loading ? (
          <GlobalLoader text="Loading programs..." />
        ) : (
          <table className="video-programs-table">
            <thead>
              <tr>
                <th>Program Title</th>
                <th>Host</th>
                <th>Level</th>
                <th>Videos</th>
                <th>Status</th>
                {currentView === "pending" && <th>Submitted</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((prog) => (
                <tr
                  key={prog.program_id}
                  onClick={() => setSelectedProgram(prog)}
                  className="clickable-row"
                >
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
                    {prog.instructor_name ||
                      `Instructor #${prog.instructor_id}`}
                  </td>
                  <td className="program-level">
                    <span
                      className={`level-badge level-${prog.dance_level?.toLowerCase()}`}
                    >
                      {prog.dance_level}
                    </span>
                  </td>
                  <td className="program-videos">
                    <span className="video-count">
                      {prog.videos?.length || 0}
                    </span>
                  </td>
                  <td className="program-status">{getStatusDisplay(prog)}</td>
                  {currentView === "pending" && (
                    <td className="program-submitted">
                      {new Date(prog.created_at).toLocaleDateString()}
                    </td>
                  )}
                </tr>
              ))}
              {filteredPrograms.length === 0 && (
                <tr>
                  <td
                    colSpan={currentView === "pending" ? "6" : "5"}
                    className="no-programs"
                  >
                    <div className="empty-state">
                      <span className="empty-icon">📹</span>
                      <span className="empty-text">
                        {currentView === "pending"
                          ? "No pending programs found."
                          : "No programs found."}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination for pending programs */}
      {currentView === "pending" && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </button>
        </div>
      )}

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
                      {getStatusDisplay(selectedProgram)}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Total Videos</div>
                    <div className="info-value">
                      <span className="video-count">
                        {selectedProgram.videos?.length || 0}
                      </span>
                    </div>
                  </div>
                  {currentView === "pending" && (
                    <>
                      <div className="info-item">
                        <div className="info-label">Dance Style</div>
                        <div className="info-value">
                          {selectedProgram.dance_style}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Price</div>
                        <div className="info-value">
                          {selectedProgram.pricing_type === "paid"
                            ? `€${selectedProgram.price}`
                            : "Free"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedProgram.description && currentView === "pending" && (
                <div className="popup-section">
                  <h3 className="section-title">Description</h3>
                  <p className="program-description">
                    {selectedProgram.description}
                  </p>
                </div>
              )}

              <div className="popup-section">
                <h3 className="section-title">Videos</h3>
                <div className="videos-list">
                  {selectedProgram.videos?.map((video) => (
                    <div key={video.id} className="video-item">
                      <div className="video-info">
                        <div className="video-title">{video.title}</div>
                        <div className="video-duration">{video.duration}s</div>
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

              {renderActionButtons()}

              {action && (
                <div className="reason-form">
                  <h4 className="reason-title">
                    {action === "Approve"
                      ? "Admin Notes:"
                      : action === "Reject"
                      ? "Rejection Reason:"
                      : `${action} Reason:`}
                  </h4>
                  <textarea
                    className="reason-textarea"
                    placeholder={getActionPlaceholder()}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    className="submit-reason"
                    onClick={handleSubmitAction}
                    disabled={!reason.trim() || loading}
                  >
                    {loading ? "Processing..." : "Submit"}
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
