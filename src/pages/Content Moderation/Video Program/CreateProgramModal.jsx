import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { createProgramService } from "../../../services/program.service";
import { uploadMediaFile } from "../../../services/upload.service";
import { fetchProfessors } from "../../../services/professor.service";
import { getDanceStyles } from "../../../services/masterData.service";
import "./CreateProgramModal.css";

// ─── Dance Styles Multi-Select ────────────────────────────────────────────────
const DanceStylesSelect = ({ selected, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (name) =>
    onChange(
      selected.includes(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name]
    );

  const filtered = options.filter((d) =>
    (d?.name || "").toLowerCase().includes((query || "").toLowerCase().trim())
  );

  return (
    <div className="cpm-dropdown-wrapper" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`cpm-dropdown-trigger ${open ? "cpm-dropdown-trigger--open" : ""}`}
      >
        <div className="cpm-tags-row">
          {selected.length ? (
            selected.map((name) => (
              <span key={name} className="cpm-tag">
                {name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selected.filter((s) => s !== name));
                  }}
                  className="cpm-tag-remove"
                >
                  <X size={11} />
                </button>
              </span>
            ))
          ) : (
            <span className="cpm-placeholder">Select dance styles</span>
          )}
        </div>
        <span className="cpm-chevron">▾</span>
      </button>

      {open && (
        <div className="cpm-dropdown-menu">
          <div className="cpm-dropdown-search-wrap">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles..."
              autoFocus
              className="cpm-dropdown-search"
            />
          </div>
          <div className="cpm-dropdown-list">
            {filtered.map((d) => {
              const name = d?.name || "";
              const checked = selected.includes(name);
              return (
                <div
                  key={d.id ?? name}
                  onClick={() => toggle(name)}
                  className={`cpm-dropdown-item ${checked ? "cpm-dropdown-item--checked" : ""}`}
                >
                  <div className="cpm-dropdown-item-left">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(name)}
                      onClick={(e) => e.stopPropagation()}
                      className="cpm-checkbox"
                    />
                    {name}
                  </div>
                  {checked && <span className="cpm-checkmark">✓</span>}
                </div>
              );
            })}
            {!options.length && (
              <div className="cpm-dropdown-empty">No dance styles available.</div>
            )}
            {!!options.length && !filtered.length && (
              <div className="cpm-dropdown-empty">No matches.</div>
            )}
          </div>
          <div className="cpm-dropdown-footer">
            <button type="button" onClick={() => onChange([])} className="cpm-btn-outline">
              Clear
            </button>
            <button type="button" onClick={() => setOpen(false)} className="cpm-btn-gradient">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Instructor Searchable Dropdown ──────────────────────────────────────────
const InstructorSelect = ({ instructors, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = instructors.find((i) => i.id === value);
  const filtered = instructors.filter((i) =>
    (i?.name || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cpm-dropdown-wrapper" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`cpm-dropdown-trigger cpm-dropdown-trigger--instructor ${open ? "cpm-dropdown-trigger--open" : ""} ${!selected ? "cpm-dropdown-trigger--empty" : ""}`}
      >
        {selected ? `${selected.name} (${selected.email})` : "Select instructor"}
        <span className="cpm-chevron">▾</span>
      </button>

      {open && (
        <div className="cpm-dropdown-menu">
          <div className="cpm-dropdown-search-wrap">
            <input
              type="text"
              placeholder="Search instructor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="cpm-dropdown-search"
            />
          </div>
          <div className="cpm-dropdown-list">
            <div
              onClick={() => { onChange(""); setOpen(false); setQuery(""); }}
              className="cpm-dropdown-item cpm-dropdown-none"
            >
              — None —
            </div>
            {filtered.map((inst) => (
              <div
                key={inst.id}
                onClick={() => { onChange(inst.id); setOpen(false); setQuery(""); }}
                className={`cpm-dropdown-item cpm-dropdown-item--instructor ${inst.id === value ? "cpm-dropdown-item--checked" : ""}`}
              >
                <span>{inst.name}</span>
                <span className="cpm-instructor-email">{inst.email}</span>
              </div>
            ))}
            {!filtered.length && (
              <div className="cpm-dropdown-empty">No instructors found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tiny reusable field wrapper ──────────────────────────────────────────────
const Field = ({ label, className, children }) => (
  <div className={className}>
    <label className="cpm-label">{label}</label>
    {children}
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────
const CreateProgramModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [danceStyles, setDanceStyles] = useState([]);
  const [danceLevel, setDanceLevel] = useState("Professional");
  const [pricingType, setPricingType] = useState("paid");
  const [price, setPrice] = useState("");
  const [overview, setOverview] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([
    { title: "", duration: "", description: "", file: null },
  ]);
  const [danceStyleOptions, setDanceStyleOptions] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const [stylesRes, profRes] = await Promise.all([
          getDanceStyles(),
          fetchProfessors(),
        ]);
        setDanceStyleOptions(Array.isArray(stylesRes) ? stylesRes : []);
        setInstructors(Array.isArray(profRes?.users) ? profRes.users : []);
      } catch (err) {
        console.error("Failed to load modal data:", err);
      }
    })();
  }, [isOpen]);

  const handleVideoChange = (i, field, val) => {
    const u = [...videos];
    u[i][field] = val;
    setVideos(u);
  };
  const addVideo = () =>
    setVideos([...videos, { title: "", duration: "", description: "", file: null }]);
  const removeVideo = (i) => setVideos(videos.filter((_, idx) => idx !== i));

  const handleCreate = async () => {
    if (!danceStyles.length) {
      alert("Please select at least one dance style.");
      return;
    }
    if (!videos.some((v) => v.title && v.file)) {
      alert("Please add at least one video with a title and file.");
      return;
    }
    try {
      setLoading(true);
      let imageUrl = "";
      if (imageFile) {
        try {
          imageUrl = (await uploadMediaFile(imageFile)) || "";
        } catch (e) {
          console.error(e);
        }
      }
      const uploadedVideos = [];
      for (const v of videos) {
        let url = v.video_url || "";
        if (v.file) {
          try {
            url = (await uploadMediaFile(v.file)) || "";
          } catch (e) {
            console.error(e);
          }
        }
        uploadedVideos.push({ title: v.title, duration: v.duration, video_url: url });
      }

      const payload = {
        title,
        description,
        overview,
        dance_style: danceStyles[0],
        dance_level: danceLevel,
        pricing_type: pricingType,
        instructor_id: instructorId ? parseInt(instructorId, 10) : null,
        videos: uploadedVideos,
        image_url: imageUrl,
      };
      if (pricingType === "paid") payload.price = price === "" ? 0 : Number(price);

      await createProgramService(payload);
      setSuccessMsg("Program created successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to create program.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cpm-overlay" onClick={onClose}>
      {/* Success Notification */}
      {successMsg && (
        <div className="cpm-success-toast">{successMsg}</div>
      )}

      <div className="cpm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cpm-header">
          <h2 className="cpm-header-title">Create Video Program</h2>
          <button
            className="cpm-close-btn"
            onClick={onClose}
          >
            <X size={13} color="white" />
          </button>
        </div>

        {/* Body */}
        <div className="cpm-body">
          {/* ── Basic Information ── */}
          <div className="cpm-card">
            <h3 className="cpm-card-title">Basic Information</h3>
            <div className="cpm-grid-2">
              <Field label="Program Title">
                <input
                  className="cpm-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter program title"
                />
              </Field>

              <Field label="Level">
                <select
                  className="cpm-input"
                  value={danceLevel}
                  onChange={(e) => setDanceLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advance">Advance</option>
                  <option value="Professional">Professional</option>
                </select>
              </Field>

              <Field label="Description" className="cpm-full">
                <textarea
                  className="cpm-textarea cpm-textarea--md"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter program description"
                />
              </Field>

              <Field label="Overview" className="cpm-full">
                <textarea
                  className="cpm-textarea cpm-textarea--sm"
                  rows={2}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Enter program overview"
                />
              </Field>

              <Field label="Dance Styles" className="cpm-full">
                <DanceStylesSelect
                  selected={danceStyles}
                  onChange={setDanceStyles}
                  options={danceStyleOptions}
                />
              </Field>

              <Field label="Instructor" className="cpm-full">
                <InstructorSelect
                  instructors={instructors}
                  value={instructorId}
                  onChange={setInstructorId}
                />
              </Field>

              <Field label="Cover Image">
                <label className="cpm-file-label">
                  <Upload size={13} />
                  {imageFile ? imageFile.name : "Choose cover image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="cpm-file-input"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </label>
              </Field>

              <Field label="Pricing Type">
                <select
                  className="cpm-input"
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </Field>

              {pricingType === "paid" && (
                <Field label="Price (€)">
                  <input
  className="cpm-input"
  type="number"
  min={0}
  value={price}
  onWheel={(e) => e.target.blur()}
  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
  placeholder="0.00"
/>
                </Field>
              )}
            </div>
          </div>

          {/* ── Videos ── */}
          <div className="cpm-card">
            <div className="cpm-card-header">
              <h3 className="cpm-card-title cpm-card-title--no-margin">Videos</h3>
              <button type="button" onClick={addVideo} className="cpm-btn-add-video">
                <Plus size={12} /> Add Video
              </button>
            </div>

            <div className="cpm-videos-list">
              {videos.map((vid, idx) => (
                <div key={idx} className="cpm-video-item">
                  <div className="cpm-video-item-header">
                    <span className="cpm-video-label">Video {idx + 1}</span>
                    {videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideo(idx)}
                        className="cpm-btn-remove"
                      >
                        <Trash2 size={11} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="cpm-grid-2">
                    <Field label="Title">
                      <input
                        className="cpm-input"
                        placeholder="Video title"
                        value={vid.title}
                        onChange={(e) => handleVideoChange(idx, "title", e.target.value)}
                      />
                    </Field>

                    <Field label="Duration">
                      <input
                        className="cpm-input"
                        placeholder="e.g. 9:20"
                        value={vid.duration}
                        onChange={(e) => handleVideoChange(idx, "duration", e.target.value)}
                      />
                    </Field>

                    <Field label="Description" className="cpm-full">
                      <textarea
                        className="cpm-textarea cpm-textarea--sm"
                        rows={2}
                        placeholder="Video description"
                        value={vid.description}
                        onChange={(e) => handleVideoChange(idx, "description", e.target.value)}
                      />
                    </Field>

                    <Field label="Video File" className="cpm-full">
                      <label className="cpm-file-label cpm-file-label--video">
                        <Upload size={13} />
                        {vid.file ? vid.file.name : "Choose video file"}
                        <input
                          type="file"
                          accept="video/*"
                          className="cpm-file-input"
                          onChange={(e) => handleVideoChange(idx, "file", e.target.files[0])}
                        />
                      </label>
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="cpm-footer">
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`cpm-btn-create ${loading ? "cpm-btn-create--loading" : ""}`}
          >
            {loading ? "Creating..." : "Create Program"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgramModal;