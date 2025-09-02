import React, { useEffect, useState } from "react";
import "./ChallengePage.css";
import {
  createChallengeService,
  getAllChallengesService,
  getChallengeDetailsService,
  updateChallengeService,
  deleteChallengeService,
  updateChallengeStatusService,
} from "../../../../services/challenge.service";
import { uploadMediaFile } from "../../../../services/upload.service"; // ✅ reuse upload service

const ChallengePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    challenger_type: "Public",
    description: "",
    image_url: "",
    dance_style: "",
    dance_level: "",
    start_date: "",
    end_date: "",
    prize_details: "",
    max_participants: "",
    tasks: [],
  });

  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 🔹 Fetch challenges
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const data = await getAllChallengesService(page, limit);
      setChallenges(data.challenges || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("❌ Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [page]);

  // 🔹 Open details modal
  const openChallengeDetails = async (id) => {
    try {
      const data = await getChallengeDetailsService(id);
      if (data) {
        setSelectedChallenge(data.challenge || data);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("❌ Error fetching challenge details:", error);
    }
  };

  // 🔹 Upload media (image/video)
  const handleFileUpload = async (file, field, taskIndex = null) => {
    try {
      const url = await uploadMediaFile(file);
      if (taskIndex !== null) {
        // update video_url inside a specific task
        const updatedTasks = [...newChallenge.tasks];
        updatedTasks[taskIndex].video_url = url;
        setNewChallenge({ ...newChallenge, tasks: updatedTasks });
      } else {
        // update top-level challenge image
        setNewChallenge({ ...newChallenge, [field]: url });
      }
    } catch (err) {
      console.error("❌ File upload failed:", err);
    }
  };

  // 🔹 Add new task
  const addTask = () => {
    setNewChallenge({
      ...newChallenge,
      tasks: [
        ...newChallenge.tasks,
        { task_type: "watch_video", task_title: "", video_url: "" },
      ],
    });
  };

  // 🔹 Remove task
  const removeTask = (index) => {
    const updatedTasks = [...newChallenge.tasks];
    updatedTasks.splice(index, 1);
    setNewChallenge({ ...newChallenge, tasks: updatedTasks });
  };

  // 🔹 Create challenge
  const handleCreateChallenge = async () => {
    try {
      await createChallengeService(newChallenge);
      setCreateModalOpen(false);
      setNewChallenge({
        title: "",
        challenger_type: "Public",
        description: "",
        image_url: "",
        dance_style: "",
        dance_level: "",
        tasks: [],
      });
      fetchChallenges();
    } catch (error) {
      console.error("❌ Error creating challenge:", error);
    }
  };

  // 🔹 Update challenge
  const handleUpdateChallenge = async (id, updatedData) => {
    try {
      await updateChallengeService(id, updatedData);
      fetchChallenges();
    } catch (error) {
      console.error("❌ Error updating challenge:", error);
    }
  };

  // 🔹 Delete challenge
  const handleDeleteChallenge = async (id) => {
    try {
      await deleteChallengeService(id);
      fetchChallenges();
    } catch (error) {
      console.error("❌ Error deleting challenge:", error);
    }
  };

  // 🔹 Update status
  const handleStatusChange = async (id, status) => {
    try {
      await updateChallengeStatusService(id, status);
      fetchChallenges();
    } catch (error) {
      console.error("❌ Error updating challenge status:", error);
    }
  };

  // 🔹 Filtered challenges
  const filteredChallenges = challenges.filter((challenge) => {
    const matchSearch = challenge?.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter
      ? challenge?.status === statusFilter
      : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="challenge-page">
      <h2>Challenges</h2>

      {/* 🔍 Filters & Create button */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
        <button className="create-btn" onClick={() => setCreateModalOpen(true)}>
          + Create Challenge
        </button>
      </div>

      {/* 🔹 Challenge List */}
      {loading ? (
        <p>Loading challenges...</p>
      ) : (
        <div className="challenge-list">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="challenge-card"
                onClick={() => openChallengeDetails(challenge.id)}
              >
                <h3>{challenge.title}</h3>
                <p>{challenge.description?.slice(0, 100)}...</p>
                <span className={`status ${challenge.status}`}>
                  {challenge.status}
                </span>
                <div className="actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(
                        challenge.id,
                        challenge.status === "active" ? "completed" : "active"
                      );
                    }}
                  >
                    {challenge.status === "active"
                      ? "Mark Completed"
                      : "Activate"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChallenge(challenge.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No challenges found</p>
          )}
        </div>
      )}

      {/* 🔹 Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {pagination.totalPages || 1}
        </span>
        <button
          onClick={() =>
            setPage((prev) =>
              pagination.totalPages
                ? Math.min(pagination.totalPages, prev + 1)
                : prev + 1
            )
          }
          disabled={page === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {/* 🔹 Details Modal */}
      {modalOpen && selectedChallenge && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedChallenge.title}</h2>
            <p>{selectedChallenge.description}</p>
            <p>Status: {selectedChallenge.status}</p>
            <p>Start Date: {selectedChallenge.startDate}</p>
            <p>End Date: {selectedChallenge.endDate}</p>
            <button onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* 🔹 Create Challenge Modal */}
      {createModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setCreateModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Challenge</h2>
            <input
              type="text"
              placeholder="Title"
              value={newChallenge.title}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newChallenge.description}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  description: e.target.value,
                })
              }
            />

            <select
              value={newChallenge.challenger_type}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  challenger_type: e.target.value,
                })
              }
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files[0], "image_url")}
            />
            {newChallenge.image_url && (
              <img
                src={newChallenge.image_url}
                alt="Challenge"
                style={{ width: "100px", marginTop: "10px" }}
              />
            )}

            <input
              type="text"
              placeholder="Dance Style"
              value={newChallenge.dance_style}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  dance_style: e.target.value,
                })
              }
            />

            <select
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
              <option value="Advance">Advance</option>
            </select>

            {/* Dynamic Tasks */}
            <h3>Tasks</h3>
            {newChallenge.tasks.map((task, index) => (
              <div key={index} className="task-item">
                <select
                  value={task.task_type}
                  onChange={(e) => {
                    const updatedTasks = [...newChallenge.tasks];
                    updatedTasks[index].task_type = e.target.value;
                    setNewChallenge({ ...newChallenge, tasks: updatedTasks });
                  }}
                >
                  <option value="watch_video">Watch Video</option>
                  <option value="upload_video">Upload Video</option>
                </select>
                <input
                  type="text"
                  placeholder="Task Title"
                  value={task.task_title}
                  onChange={(e) => {
                    const updatedTasks = [...newChallenge.tasks];
                    updatedTasks[index].task_title = e.target.value;
                    setNewChallenge({ ...newChallenge, tasks: updatedTasks });
                  }}
                />
                {task.task_type === "watch_video" && (
                  <>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        handleFileUpload(e.target.files[0], "video_url", index)
                      }
                    />
                    {task.video_url && (
                      <video
                        src={task.video_url}
                        width="120"
                        controls
                        style={{ marginTop: "10px" }}
                      />
                    )}
                  </>
                )}
                <button onClick={() => removeTask(index)}>Remove</button>
              </div>
            ))}
            <button onClick={addTask}>+ Add Task</button>

            <div className="modal-actions">
              <button onClick={handleCreateChallenge}>Create</button>
              <button onClick={() => setCreateModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
