import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createProgramService } from "../../../services/program.service";
import { uploadMediaFile } from "../../../services/upload.service";
import { fetchProfessors } from "../../../services/professor.service"; // ✅ fixed import

const CreateProgramModal = ({ isOpen, onClose, danceStyles }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [danceStyle, setDanceStyle] = useState(danceStyles[0] || "");
  const [danceLevel, setDanceLevel] = useState("Professional");
  const [pricingType, setPricingType] = useState("paid");
  const [price, setPrice] = useState(0);
  const [overview, setOverview] = useState("");

  // 🔹 Instructor states
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([
    { title: "", duration: "", description: "", file: null },
  ]);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const response = await fetchProfessors();
        console.log("📌 Fetched instructors response:", response); // 👈 add this

        if (Array.isArray(response?.users)) {
          setInstructors(response.users);
        } else {
          setInstructors([]);
        }
      } catch (error) {
        console.error("❌ Error fetching instructors:", error);
        setInstructors([]);
      }
    };

    loadInstructors();
  }, []);

  // ✅ Filter instructors by search text
  const filteredInstructors = instructors.filter((inst) =>
    (inst?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Handle video field changes
  const handleVideoChange = (index, field, value) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };

  // ✅ Add/remove video cards
  const addVideo = () => {
    setVideos([
      ...videos,
      { title: "", duration: "", description: "", file: null },
    ]);
  };
  const removeVideo = (index) => {
    const updated = [...videos];
    updated.splice(index, 1);
    setVideos(updated);
  };

  // ✅ Submit program
  const handleCreateProgram = async () => {
    try {
      setLoading(true);

      console.log("📌 Selected instructorId state:", instructorId);
      console.log("📌 Instructors list:", instructors);

      // 1️⃣ Upload cover image
      let uploadedImageUrl = "";
      if (imageFile) {
        try {
          const uploadRes = await uploadMediaFile(imageFile);
          uploadedImageUrl = uploadRes?.uploadResponse?.fileURL || "";
          console.log("✅ Uploaded image URL:", uploadedImageUrl);
        } catch (err) {
          console.error("❌ Image upload failed:", err);
        }
      }

      // 2️⃣ Upload videos
      const uploadedVideos = [];
      for (const [index, video] of videos.entries()) {
        let videoUrl = "";
        if (video.file) {
          try {
            const uploadRes = await uploadMediaFile(video.file, {
              title: video.title,
              duration: video.duration,
              program_id: 1, // replace with actual program_id if needed
            });
            videoUrl = uploadRes?.uploadResponse?.fileURL || "";
            console.log(`✅ Video ${index + 1} uploaded:`, videoUrl);
          } catch (err) {
            console.error(`❌ Failed to upload video ${index + 1}:`, err);
          }
        } else {
          videoUrl = video.video_url || "";
        }

        uploadedVideos.push({
          title: video.title,
          duration: video.duration,
          description: video.description,
          video_url: videoUrl,
        });
      }

      // 3️⃣ Final payload
      const payload = {
        title,
        description,
        overview,
        dance_style: danceStyle,
        dance_level: danceLevel,
        pricing_type: pricingType,
        price: pricingType === "paid" ? price : 0,
        instructor_id: instructorId ? parseInt(instructorId, 10) : null,
        videos: uploadedVideos,
        image_url: uploadedImageUrl,
      };

      console.log("🚀 Final payload:", payload);

      await createProgramService(payload);
      alert("✅ Program created successfully!");
      onClose();
    } catch (error) {
      console.error(
        "❌ Error creating program:",
        error?.response?.data || error
      );
      alert("Failed to create program.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content create-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Create Video Program</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              {/* 🔹 Title */}
              <div className="form-group">
                <label className="form-label">Program Title</label>
                <input
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter program title"
                />
              </div>

              {/* 🔹 Description */}
              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter program description"
                  rows="4"
                />
              </div>
              {/* 🔹 Overview */}
              <div className="form-group full-width">
                <label className="form-label">Overview</label>
                <textarea
                  className="form-textarea"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Enter program overview"
                  rows="3"
                />
              </div>

              {/* 🔹 Dance Style */}
              <div className="form-group">
                <label className="form-label">Dance Style</label>
                <select
                  className="form-select"
                  value={danceStyle}
                  onChange={(e) => setDanceStyle(e.target.value)}
                >
                  {danceStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔹 Dance Level */}
              <div className="form-group">
                <label className="form-label">Level</label>
                <select
                  className="form-select"
                  value={danceLevel}
                  onChange={(e) => setDanceLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advance">Advance</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              {/* 🔹 Pricing */}
              <div className="form-group">
                <label className="form-label">Pricing Type</label>
                <select
                  className="form-select"
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {pricingType === "paid" && (
                <div className="form-group">
                  <label className="form-label">Price (€)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              )}

              {/* 🔹 Instructor Search + Dropdown */}
              <div className="form-group full-width">
                <label className="form-label">Instructor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search instructor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="form-select"
                  value={instructorId || ""}
                  onChange={(e) =>
                    setInstructorId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                >
                  <option value="">Select Instructor</option>
                  {filteredInstructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔹 Cover Image */}
              <div className="form-group">
                <label className="form-label">Cover Image</label>
                <div className="file-input-container">
                  <input
                    className="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    id="cover-image"
                  />
                  <label htmlFor="cover-image" className="file-input-label">
                    {imageFile ? imageFile.name : "Choose cover image"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Videos Section */}
          <div className="modal-section">
            <div className="section-header">
              <h3 className="section-title">Videos</h3>
              <button
                type="button"
                className="add-video-btn"
                onClick={addVideo}
              >
                + Add Video
              </button>
            </div>

            <div className="videos-container">
              {videos.map((vid, index) => (
                <div key={index} className="video-form-card">
                  <div className="video-card-header">
                    <span className="video-number">Video {index + 1}</span>
                    {videos.length > 1 && (
                      <button
                        type="button"
                        className="remove-video-btn"
                        onClick={() => removeVideo(index)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="video-form-grid">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input
                        className="form-input"
                        placeholder="Video title"
                        value={vid.title}
                        onChange={(e) =>
                          handleVideoChange(index, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input
                        className="form-input"
                        placeholder="e.g. 9:20"
                        value={vid.duration}
                        onChange={(e) =>
                          handleVideoChange(index, "duration", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Video description"
                        value={vid.description}
                        onChange={(e) =>
                          handleVideoChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Video File</label>
                      <div className="file-input-container">
                        <input
                          className="file-input"
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            handleVideoChange(index, "file", e.target.files[0])
                          }
                          id={`video-file-${index}`}
                        />
                        <label
                          htmlFor={`video-file-${index}`}
                          className="file-input-label"
                        >
                          {vid.file ? vid.file.name : "Choose video file"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="modal-btn create-btn"
            onClick={handleCreateProgram}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Program"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgramModal;
