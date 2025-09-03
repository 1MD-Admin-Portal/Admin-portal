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
import { uploadMediaFile } from "../../../../services/upload.service";

const ChallengePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    challenger_type: "",
    description: "",
    image_url: "",
    dance_style: "",
    dance_level: "",
    start_date: "",
    end_date: "",
    prize_details: "",
    max_participants: "",
    status: "draft",
    tasks: [{ task_type: "watch_video", task_title: "", video_url: "" }],
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

  const handleFileUpload = async (file, field, taskIndex = null) => {
    try {
      const url = await uploadMediaFile(file); // ✅ returns fileURL directly

      if (!url) {
        console.error("❌ Upload returned no URL");
        return;
      }

      if (taskIndex !== null) {
        const updatedTasks = [...newChallenge.tasks];
        updatedTasks[taskIndex].video_url = url;
        setNewChallenge({ ...newChallenge, tasks: updatedTasks });
      } else {
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

  // 🔹 Reset form after creating challenge
  const resetForm = () => {
    setNewChallenge({
      title: "",
      challenger_type: "",
      description: "",
      image_url: "",
      dance_style: "",
      dance_level: "",
      start_date: "",
      end_date: "",
      prize_details: "",
      max_participants: "",
      status: "draft",
      tasks: [{ task_type: "watch_video", task_title: "", video_url: "" }],
    });
  };

  const handleCreateChallenge = async () => {
    try {
      const payload = {
        title: newChallenge.title,
        challenger_type: newChallenge.challenger_type,
        description: newChallenge.description,
        image_url: newChallenge.image_url,
        dance_style: newChallenge.dance_style,
        dance_level: newChallenge.dance_level,
        start_date: newChallenge.start_date
          ? new Date(newChallenge.start_date).toISOString()
          : null,
        end_date: newChallenge.end_date
          ? new Date(newChallenge.end_date).toISOString()
          : null,
        prize_details: newChallenge.prize_details || null,
        max_participants: newChallenge.max_participants
          ? parseInt(newChallenge.max_participants, 10)
          : null,
        tasks: newChallenge.tasks.map((task) => ({
          task_type: task.task_type,
          task_title: task.task_title || "",
          video_url: task.video_url || null,
        })),
      };

      console.log("📤 Challenge Payload:", payload);

      await createChallengeService(payload);

      setCreateModalOpen(false);
      resetForm(); // ✅ will now work
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
            <h2 className="text-xl font-bold mb-2">
              {selectedChallenge.title}
            </h2>

            <p>
              <strong>ID:</strong> {selectedChallenge.id}
            </p>
            <p>
              <strong>Description:</strong> {selectedChallenge.description}
            </p>
            <p>
              <strong>Challenger Type:</strong>{" "}
              {selectedChallenge.challenger_type}
            </p>
            <p>
              <strong>Status:</strong> {selectedChallenge.status}
            </p>
            <p>
              <strong>Dance Style:</strong> {selectedChallenge.dance_style}
            </p>
            <p>
              <strong>Dance Level:</strong> {selectedChallenge.dance_level}
            </p>
            <p>
              <strong>Prize:</strong> {selectedChallenge.prize_details}
            </p>
            <p>
              <strong>Max Participants:</strong>{" "}
              {selectedChallenge.max_participants}
            </p>
            <p>
              <strong>Total Participants:</strong>{" "}
              {selectedChallenge.total_participants}
            </p>
            <p>
              <strong>Total Submissions:</strong>{" "}
              {selectedChallenge.total_submissions}
            </p>
            <p>
              <strong>Pending Submissions:</strong>{" "}
              {selectedChallenge.pending_submissions}
            </p>
            <p>
              <strong>Approved Submissions:</strong>{" "}
              {selectedChallenge.approved_submissions}
            </p>
            <p>
              <strong>Rejected Submissions:</strong>{" "}
              {selectedChallenge.rejected_submissions}
            </p>

            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(selectedChallenge.start_date).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(selectedChallenge.end_date).toLocaleDateString()}
            </p>

            {/* 🔹 Show Challenge Image */}
            {selectedChallenge.image_url && (
              <div className="my-3">
                <strong>Image:</strong>
                <img
                  src={selectedChallenge.image_url}
                  alt={selectedChallenge.title}
                  className="rounded-lg mt-2 max-h-60 object-cover"
                />
              </div>
            )}

            {/* 🔹 Show Tasks (with videos if available) */}
            {selectedChallenge.tasks && selectedChallenge.tasks.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Tasks:</h3>
                {selectedChallenge.tasks.map((task) => (
                  <div key={task.id} className="mb-3">
                    <p>
                      <strong>Task Title:</strong> {task.task_title}
                    </p>
                    <p>
                      <strong>Task Type:</strong> {task.task_type}
                    </p>

                    {task.video_url && (
                      <video
                        controls
                        className="rounded-lg mt-2 w-full max-h-72"
                      >
                        <source src={task.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
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
            <input
              type="date"
              value={newChallenge.start_date}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, start_date: e.target.value })
              }
            />
            <input
              type="date"
              value={newChallenge.end_date}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, end_date: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Prize Details"
              value={newChallenge.prize_details}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  prize_details: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Max Participants"
              value={newChallenge.max_participants}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  max_participants: e.target.value,
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
              <option value="public">Public</option>
              <option value="private">Private</option>
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
