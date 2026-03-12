import React, { useState, useEffect, useRef } from "react";
import { X, UserMinus, UserPlus, Loader, Search, ChevronDown } from "lucide-react";
import { linkInstructorToStudio, unlinkInstructor } from "../../services/studio.service";
import axios from "axios";
import { CONSTANTS } from "../../utils/constants";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

const InstructorLinkModal = ({ isOpen, onClose, studio }) => {
  const [linkedInstructors, setLinkedInstructors] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && studio?.id) {
      fetchLinkedInstructors();
      fetchAllInstructors();
    }
  }, [isOpen, studio]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const fetchAllInstructors = async () => {
    setInstructorsLoading(true);
    try {
      const res = await axios.get(
        `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.INSTRUCTOR_APPLICATION_LIST}`,
        { headers: getHeaders() }
      );
      const list = res.data?.application || [];
      setAllInstructors(list.filter((i) => i.status === "accepted"));
    } catch (err) {
      console.error("Failed to fetch instructors", err);
    } finally {
      setInstructorsLoading(false);
    }
  };

  const fetchLinkedInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.STUDIOS.GET_BY_ID(studio.id)}`,
        { headers: getHeaders() }
      );
      const data = res.data?.studio || res.data;
      setLinkedInstructors(res.data?.studio?.instructors || []);
    } catch (err) {
      setError("Failed to load linked instructors.");
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    if (!selectedInstructorId) return;
    setActionLoading("link");
    setError(null);
    try {
      await linkInstructorToStudio({
        instructor_id: Number(selectedInstructorId),
        studio_id: studio.id,
        is_primary: isPrimary,
      });
      setSuccess("Instructor linked successfully!");
      setSelectedInstructorId("");
      setIsPrimary(false);
      setSearch("");
      setIsDropdownOpen(false);
      fetchLinkedInstructors();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to link instructor.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlink = async (linkId) => {
    setActionLoading(linkId);
    setError(null);
    try {
      await unlinkInstructor(linkId);
      setSuccess("Instructor unlinked successfully.");
      fetchLinkedInstructors();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to unlink instructor.");
    } finally {
      setActionLoading(null);
    }
  };

  const linkedIds = new Set(linkedInstructors.map((i) => i.instructor_id));
const filteredInstructors = allInstructors.filter(
  (i) => !linkedIds.has(i.id) && 
      (i.name || i.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16,
          width: "100%", maxWidth: 540,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: "1.2rem", fontWeight: 700,
              background: "linear-gradient(135deg, #4F7CF7, #8E5CF6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Manage Instructors
            </h2>
            <p style={{ margin: "3px 0 0", color: "#6c757d", fontSize: 13 }}>{studio?.name}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6c757d", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Feedback */}
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(220,53,69,0.08)", color: "#dc3545", fontSize: 13, border: "1px solid rgba(220,53,69,0.2)" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(46,204,113,0.08)", color: "#27ae60", fontSize: 13, border: "1px solid rgba(46,204,113,0.2)" }}>
              {success}
            </div>
          )}

          {/* Link Section */}
          <div style={{ background: "#f8f9ff", borderRadius: 12, padding: 16, border: "1px solid rgba(142,92,246,0.15)" }}>
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.6px", color: "#4F7CF7" }}>
              Link Instructor
            </p>

            {/* Merged Searchable Dropdown */}
            <div ref={dropdownRef} style={{ position: "relative", marginBottom: 12 }}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  position: "relative", width: "100%", padding: "10px 14px",
                  borderRadius: 8, border: "2px solid rgba(142,92,246,0.2)",
                  fontSize: 13, outline: "none",
                  cursor: "pointer", boxSizing: "border-box",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.2s ease",
                  borderColor: isDropdownOpen ? "rgba(79,124,247,0.4)" : "rgba(142,92,246,0.2)",
                  background: isDropdownOpen ? "rgba(79,124,247,0.02)" : "white",
                }}
              >
                <Search size={14} style={{ color: "#adb5bd", flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={instructorsLoading ? "Loading instructors..." : "Search and select instructor..."}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                  }}
                  style={{
                    flex: 1, border: "none", outline: "none", fontSize: 13,
                    background: "transparent", color: "#212529", fontFamily: "inherit",
                  }}
                />
                <ChevronDown
                  size={14}
                  style={{
                    color: "#adb5bd", flexShrink: 0,
                    transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>

              {/* Dropdown List */}
              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute", top: "100%", left: 0, right: 0,
                    marginTop: 4, background: "white", borderRadius: 8,
                    border: "2px solid rgba(79,124,247,0.2)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 1000, maxHeight: 240, overflowY: "auto",
                  }}
                >
                  {instructorsLoading ? (
                    <div style={{ padding: 12, textAlign: "center", color: "#adb5bd", fontSize: 13 }}>
                      <Loader size={16} style={{ animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                    </div>
                  ) : filteredInstructors.length === 0 ? (
                    <div style={{ padding: 12, textAlign: "center", color: "#adb5bd", fontSize: 13 }}>
                      {search ? "No instructors found" : "No available instructors"}
                    </div>
                  ) : (
                    filteredInstructors.map((inst) => (
                      <div
                        key={inst.id}
                        onClick={() => {
                          setSelectedInstructorId(inst.id);
                          setSearch(inst.name);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: "10px 14px", cursor: "pointer",
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                          transition: "background 0.2s ease",
                          background: selectedInstructorId === inst.id ? "rgba(79,124,247,0.1)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = selectedInstructorId === inst.id ? "rgba(79,124,247,0.15)" : "rgba(142,92,246,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = selectedInstructorId === inst.id ? "rgba(79,124,247,0.1)" : "transparent";
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: "#212529" }}>
                          {inst.name}
                        </p>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#adb5bd" }}>
                          {inst.email}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: "#495057" }}>
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  style={{ accentColor: "#8E5CF6" }}
                />
                Set as Primary Instructor
              </label>

              <button
                onClick={handleLink}
                disabled={!selectedInstructorId || actionLoading === "link"}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 20px", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg, #4F7CF7 0%, #8E5CF6 100%)",
                  color: "white", fontWeight: 600, fontSize: 13,
                  cursor: !selectedInstructorId ? "not-allowed" : "pointer",
                  opacity: !selectedInstructorId ? 0.5 : 1,
                }}
              >
                {actionLoading === "link"
                  ? <Loader size={14} style={{ animation: "spin 0.8s linear infinite" }} />
                  : <UserPlus size={14} />}
                Link
              </button>
            </div>
          </div>

          {/* Linked Instructors List */}
          <div>
            <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.6px", color: "#495057" }}>
              Linked Instructors ({linkedInstructors.length})
            </p>

            {loading ? (
              <div style={{ textAlign: "center", padding: 30 }}>
                <Loader size={24} style={{ animation: "spin 0.8s linear infinite", color: "#8E5CF6" }} />
              </div>
            ) : linkedInstructors.length === 0 ? (
              <div style={{ textAlign: "center", padding: 24, color: "#adb5bd", background: "#f8f9ff", borderRadius: 10, fontSize: 13 }}>
                No instructors linked to this studio yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {linkedInstructors.map((instructor) => (
  <div key={instructor.link_id} style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e9ecef",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg,#4F7CF7,#8E5CF6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontWeight: 700, fontSize: 14, overflow: "hidden"
      }}>
        {instructor.profile_image_url ? (
          <img src={instructor.profile_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          (instructor.instructor_name || "I")[0].toUpperCase()
        )}
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
          {instructor.instructor_name || "N/A"}
          {instructor.is_primary === 1 && (
            <span style={{
              marginLeft: 8, fontSize: 11, padding: "2px 8px",
              borderRadius: 20, background: "rgba(79,124,247,0.1)",
              color: "#4F7CF7", fontWeight: 600,
            }}>
              Primary
            </span>
          )}
        </p>
      </div>
    </div>

    <button
      onClick={() => handleUnlink(instructor.link_id)}  // ✅ use link_id
      disabled={actionLoading === instructor.link_id}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "6px 12px", borderRadius: 8,
        border: "1px solid #ffcdd2", background: "rgba(220,53,69,0.06)",
        color: "#dc3545", fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}
    >
      {actionLoading === instructor.link_id
        ? <Loader size={13} style={{ animation: "spin 0.8s linear infinite" }} />
        : <UserMinus size={13} />}
      Unlink
    </button>
  </div>
))}
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default InstructorLinkModal;