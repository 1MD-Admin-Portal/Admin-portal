import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { createProgramService } from "../../../services/program.service";
import { uploadMediaFile } from "../../../services/upload.service";
import { fetchProfessors } from "../../../services/professor.service";
import { getDanceStyles } from "../../../services/masterData.service";

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
        : [...selected, name],
    );
  const filtered = options.filter((d) =>
    (d?.name || "").toLowerCase().includes((query || "").toLowerCase().trim()),
  );

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.75rem",
          background: "#f8fafc",
          border: "1.5px solid " + (open ? "#ec4899" : "#e2e8f0"),
          borderRadius: "8px",
          cursor: "pointer",
          minHeight: "38px",
          boxShadow: open ? "0 0 0 3px rgba(236,72,153,0.1)" : "none",
          transition: "all 0.2s",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", flex: 1 }}>
          {selected.length ? (
            selected.map((name) => (
              <span
                key={name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  background:
                    "linear-gradient(135deg, rgba(108,61,232,0.1), rgba(236,72,153,0.1))",
                  border: "1px solid rgba(108,61,232,0.2)",
                  borderRadius: "20px",
                  padding: "1px 8px 1px 10px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#6c3de8",
                }}
              >
                {name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selected.filter((s) => s !== name));
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    color: "#6c3de8",
                  }}
                >
                  <X size={11} />
                </button>
              </span>
            ))
          ) : (
            <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
              Select dance styles
            </span>
          )}
        </div>
        <span
          style={{
            color: "#94a3b8",
            fontSize: "0.7rem",
            marginLeft: "6px",
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "white",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(108,61,232,0.15)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles..."
              autoFocus
              style={{
                width: "100%",
                padding: "0.45rem 0.75rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "7px",
                fontSize: "0.8rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            {filtered.map((d) => {
              const name = d?.name || "";
              const checked = selected.includes(name);
              return (
                <label
                  key={d.id ?? name}
                  onClick={() => toggle(name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.45rem 0.875rem",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    background: checked
                      ? "rgba(108,61,232,0.05)"
                      : "transparent",
                    color: checked ? "#6c3de8" : "#1e293b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      style={{ accentColor: "#ec4899" }}
                    />
                    {name}
                  </div>
                  {checked && (
                    <span
                      style={{
                        color: "#ec4899",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </label>
              );
            })}
            {!options.length && (
              <div
                style={{
                  padding: "0.75rem",
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                No dance styles available.
              </div>
            )}
            {!!options.length && !filtered.length && (
              <div
                style={{
                  padding: "0.75rem",
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                No matches.
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "6px",
              padding: "8px",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <button
              type="button"
              onClick={() => onChange([])}
              style={{
                padding: "0.35rem 0.75rem",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                background: "white",
                fontSize: "0.78rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                padding: "0.35rem 0.75rem",
                border: "none",
                borderRadius: "6px",
                background: "linear-gradient(135deg,#6c3de8,#ec4899)",
                color: "white",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
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
    (i?.name || "").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.75rem",
          background: "#f8fafc",
          border: "1.5px solid " + (open ? "#ec4899" : "#e2e8f0"),
          borderRadius: "8px",
          cursor: "pointer",
          minHeight: "38px",
          textAlign: "left",
          boxShadow: open ? "0 0 0 3px rgba(236,72,153,0.1)" : "none",
          fontSize: "0.875rem",
          color: selected ? "#1e293b" : "#94a3b8",
          transition: "all 0.2s",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      >
        {selected
          ? `${selected.name} (${selected.email})`
          : "Select instructor"}
        <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "white",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(108,61,232,0.15)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px" }}>
            <input
              type="text"
              placeholder="Search instructor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "0.45rem 0.75rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "7px",
                fontSize: "0.8rem",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ maxHeight: "180px", overflowY: "auto" }}>
            <div
              onClick={() => {
                onChange("");
                setOpen(false);
                setQuery("");
              }}
              style={{
                padding: "0.45rem 0.875rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "#94a3b8",
              }}
            >
              — None —
            </div>
            {filtered.map((inst) => (
              <div
                key={inst.id}
                onClick={() => {
                  onChange(inst.id);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  padding: "0.45rem 0.875rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  background:
                    inst.id === value ? "rgba(108,61,232,0.05)" : "transparent",
                  color: inst.id === value ? "#6c3de8" : "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{inst.name}</span>
                <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  {inst.email}
                </span>
              </div>
            ))}
            {!filtered.length && (
              <div
                style={{
                  padding: "0.75rem",
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                No instructors found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Shared inline style tokens ───────────────────────────────────────────────
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(9,5,30,0.6)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modal: {
    background: "white",
    width: "100%",
    maxWidth: "620px",
    maxHeight: "90vh",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 24px 48px -8px rgba(108,61,232,0.22)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.875rem 1.25rem",
    background: "linear-gradient(135deg, #6c3de8 0%, #ec4899 100%)",
    flexShrink: 0,
  },
  headerTitle: { fontSize: "1rem", fontWeight: 700, color: "white", margin: 0 },
  closeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    boxShadow: "none",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    background: "#f5f7fa",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  card: {
    background: "white",
    border: "1px solid #e8edf3",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 0.875rem",
    textAlign: "left",
    WebkitTextFillColor: "#1e293b",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.875rem",
    paddingBottom: "0.625rem",
    borderBottom: "1px solid #f1f5f9",
  },
  // 2-col grid
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
  // full row inside grid
  full: { gridColumn: "1 / -1" },
  // label
  label: {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#412969",
    marginBottom: "4px",
  },
  // input / select / textarea base
  input: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    color: "#1e293b",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    color: "#1e293b",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    transition: "border-color 0.2s",
  },
  footer: {
    padding: "0.75rem 1.25rem",
    borderTop: "1px solid #e8edf3",
    background: "white",
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
    flexShrink: 0,
  },
};

// ─── Tiny reusable field wrapper ──────────────────────────────────────────────
const Field = ({ label, style, children }) => (
  <div style={style}>
    <label style={S.label}>{label}</label>
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
  const [price, setPrice] = useState(0);
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
    setVideos([
      ...videos,
      { title: "", duration: "", description: "", file: null },
    ]);
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
      for (const [i, v] of videos.entries()) {
        let url = v.video_url || "";
        if (v.file) {
          try {
            url = (await uploadMediaFile(v.file)) || "";
          } catch (e) {
            console.error(e);
          }
        }
        uploadedVideos.push({
          title: v.title,
          duration: v.duration,
          video_url: url,
        });
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

      // Only include price if it's a paid program
      if (pricingType === "paid") {
        payload.price = price;
      }

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

  const inputFocus = (e) => {
    e.target.style.borderColor = "#ec4899";
    e.target.style.background = "white";
    e.target.style.boxShadow = "0 0 0 3px rgba(236,72,153,0.1)";
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "#f8fafc";
    e.target.style.boxShadow = "none";
  };

  if (!isOpen) return null;
  if (!isOpen) return null;

  return (
    <div style={S.overlay} onClick={onClose}>
      {/* Success Notification */}
      {successMsg && (
        <div
          style={{
            position: "fixed",
            top: "18%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(135deg,#6c3de8,#ec4899)",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            padding: "16px 32px",
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(108,61,232,0.18)",
            zIndex: 2000,
            letterSpacing: "0.02em",
            textAlign: "center",
            opacity: 0.97,
          }}
        >
          {successMsg}
        </div>
      )}
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={S.header}>
          <h2 style={S.headerTitle}>Create Video Program</h2>
          <button
            style={S.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.32)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
            }
          >
            <X size={13} color="white" />
          </button>
        </div>

        {/* Body */}
        <div style={S.body}>
          {/* ── Basic Information ── */}
          <div style={S.card}>
            <h3 style={S.cardTitle}>Basic Information</h3>
            <div style={S.grid2}>
              <Field label="Program Title">
                <input
                  style={S.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter program title"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </Field>

              <Field label="Level">
                <select
                  style={S.input}
                  value={danceLevel}
                  onChange={(e) => setDanceLevel(e.target.value)}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advance">Advance</option>
                  <option value="Professional">Professional</option>
                </select>
              </Field>

              <Field label="Description" style={S.full}>
                <textarea
                  style={{ ...S.textarea, minHeight: "72px" }}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter program description"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </Field>

              <Field label="Overview" style={S.full}>
                <textarea
                  style={{ ...S.textarea, minHeight: "56px" }}
                  rows={2}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Enter program overview"
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </Field>

              <Field label="Dance Styles" style={S.full}>
                <DanceStylesSelect
                  selected={danceStyles}
                  onChange={setDanceStyles}
                  options={danceStyleOptions}
                />
              </Field>

              <Field label="Instructor" style={S.full}>
                <InstructorSelect
                  instructors={instructors}
                  value={instructorId}
                  onChange={setInstructorId}
                />
              </Field>

              {/* Cover Image + Pricing side by side */}
              <Field label="Cover Image">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "0.5rem 0.75rem",
                    background: "#f8fafc",
                    border: "1.5px dashed #c4b5fd",
                    borderRadius: "8px",
                    color: "#6c3de8",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    minHeight: "38px",
                    boxSizing: "border-box",
                  }}
                >
                  <Upload size={13} />
                  {imageFile ? imageFile.name : "Choose cover image"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </label>
              </Field>

              <Field label="Pricing Type">
                <select
                  style={S.input}
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </Field>

              {/* Price only when paid — stays in grid */}
              {pricingType === "paid" && (
                <Field label="Price (€)">
                  <input
                    style={S.input}
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="0.00"
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </Field>
              )}
            </div>
          </div>

          {/* ── Videos ── */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h3 style={{ ...S.cardTitle, margin: 0 }}>Videos</h3>
              <button
                type="button"
                onClick={addVideo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "0.35rem 0.75rem",
                  background: "white",
                  border: "1.5px solid #c4b5fd",
                  borderRadius: "7px",
                  color: "#6c3de8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Plus size={12} /> Add Video
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              {videos.map((vid, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f8fafc",
                    border: "1.5px solid #e8edf3",
                    borderRadius: "9px",
                    padding: "0.875rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#6c3de8",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Video {idx + 1}
                    </span>
                    {videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideo(idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          background: "rgba(239,68,68,0.07)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          borderRadius: "6px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: "#dc2626",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        <Trash2 size={11} /> Remove
                      </button>
                    )}
                  </div>

                  <div style={S.grid2}>
                    <Field label="Title">
                      <input
                        style={S.input}
                        placeholder="Video title"
                        value={vid.title}
                        onChange={(e) =>
                          handleVideoChange(idx, "title", e.target.value)
                        }
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </Field>

                    <Field label="Duration">
                      <input
                        style={S.input}
                        placeholder="e.g. 9:20"
                        value={vid.duration}
                        onChange={(e) =>
                          handleVideoChange(idx, "duration", e.target.value)
                        }
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </Field>

                    <Field label="Description" style={S.full}>
                      <textarea
                        style={{ ...S.textarea, minHeight: "56px" }}
                        rows={2}
                        placeholder="Video description"
                        value={vid.description}
                        onChange={(e) =>
                          handleVideoChange(idx, "description", e.target.value)
                        }
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </Field>

                    <Field label="Video File" style={S.full}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "0.5rem 0.75rem",
                          background: "white",
                          border: "1.5px dashed #c4b5fd",
                          borderRadius: "8px",
                          color: "#6c3de8",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          boxSizing: "border-box",
                        }}
                      >
                        <Upload size={13} />
                        {vid.file ? vid.file.name : "Choose video file"}
                        <input
                          type="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleVideoChange(idx, "file", e.target.files[0])
                          }
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
        <div style={S.footer}>
          {/* <button onClick={onClose} disabled={loading}
            style={{
              padding: "0.55rem 1.25rem", borderRadius: "8px", fontSize: "0.875rem",
              fontWeight: 600, cursor: "pointer", border: "1.5px solid #d1d5db",
              background: "white", color: "#374151", fontFamily: "inherit",
            }}>
            Cancel
          </button> */}
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              background: "linear-gradient(135deg,#6c3de8,#ec4899)",
              color: "white",
              boxShadow: "0 2px 8px rgba(236,72,153,0.3)",
              fontFamily: "inherit",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating..." : "Create Program"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgramModal;
