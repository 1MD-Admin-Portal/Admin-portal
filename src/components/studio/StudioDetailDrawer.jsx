import React, { useState, useEffect } from "react";
import { X, Globe, Mail, Phone, MapPin, Users, Calendar, Music, Zap } from "lucide-react";
import axios from "axios";
import { CONSTANTS } from "../../utils/constants";
import "./StudioDetailDrawer.css";

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
};

const formatHours = (hours) => {
  if (!hours || hours === "closed") return null;
  if (typeof hours === "string") {
    if (hours.toLowerCase() === "closed") return null;
    return hours;
  }
  if (typeof hours === "object" && hours.open && hours.close) {
    return `${hours.open} – ${hours.close}`;
  }
  return null;
};

const StudioDetailDrawer = ({ isOpen, onClose, studio, loading = false }) => {
  const [linkedInstructors, setLinkedInstructors] = useState([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);

  // useEffect(() => {
  //   if (isOpen && studio?.id) fetchLinkedInstructors();
  //   else setLinkedInstructors([]);
  // }, [isOpen, studio]);

  // const fetchLinkedInstructors = async () => {
  //   setInstructorsLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.STUDIOS.GET_BY_ID(studio.id)}`,
  //       { headers: getHeaders() }
  //     );
      
  //     const data = res.data?.studio || res.data;
  //     setLinkedInstructors(res.data?.studio?.instructors || []);
  //   } catch (err) {
  //     console.error("Failed to fetch linked instructors", err);
  //   } finally {
  //     setInstructorsLoading(false);
  //   }
  // };

  if (!isOpen || !studio) return null;

  return (
    <div className="studio-drawer-overlay" onClick={onClose}>
      <div className="studio-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="studio-drawer-header">
          <h2>Studio Details</h2>
          <button className="studio-drawer-close" onClick={onClose} disabled={loading}>
            <X size={24} />
          </button>
        </div>

        <div className="studio-drawer-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading studio details...</p>
            </div>
          ) : (
            <>
              {/* Header with logo and name */}
              <div className="studio-header-section">
                {studio.logo_url && (
                  <div className="studio-logo">
                    <img src={studio.logo_url} alt={studio.name} />
                  </div>
                )}
                <div className="studio-header-info">
                  <h3>{studio.name}</h3>
                  <div className="studio-status">
                    <span className={`status-badge status-${studio.status}`}>
                      {studio.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {studio.description && (
                <div className="info-section">
                  <h4>Description</h4>
                  <p>{studio.description}</p>
                </div>
              )}

              {/* Location Information */}
              <div className="info-section">
                <h4><MapPin size={16} /> Location</h4>
                <div className="detail-grid">
                  {studio.address && (
                    <div className="detail-item">
                      <label>Address</label>
                      <p>{studio.address}</p>
                    </div>
                  )}
                  {studio.city && (
                    <div className="detail-item">
                      <label>City</label>
                      <p>{studio.city}</p>
                    </div>
                  )}
                  {studio.state && (
                    <div className="detail-item">
                      <label>State</label>
                      <p>{studio.state}</p>
                    </div>
                  )}
                  {studio.country && (
                    <div className="detail-item">
                      <label>Country</label>
                      <p>{studio.country}</p>
                    </div>
                  )}
                  {studio.postal_code && (
                    <div className="detail-item">
                      <label>Postal Code</label>
                      <p>{studio.postal_code}</p>
                    </div>
                  )}
                  {studio.latitude && studio.longitude && (
                    <div className="detail-item">
                      <label>Coordinates</label>
                      <p>{`${studio.latitude}, ${studio.longitude}`}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="info-section">
                <h4><Phone size={16} /> Contact Information</h4>
                <div className="detail-grid">
                  {studio.phone && (
                    <div className="detail-item">
                      <label><Phone size={14} /> Phone</label>
                      <p>{studio.phone}</p>
                    </div>
                  )}
                  {studio.email && (
                    <div className="detail-item">
                      <label><Mail size={14} /> Email</label>
                      <p>{studio.email}</p>
                    </div>
                  )}
                  {studio.website && (
                    <div className="detail-item">
                      <label><Globe size={14} /> Website</label>
                      <a href={studio.website} target="_blank" rel="noopener noreferrer">
                        {studio.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Studio Details */}
              <div className="info-section">
                <h4>Studio Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label><Users size={14} /> Capacity</label>
                    <p>{studio.capacity || "N/A"} people</p>
                  </div>
                  {studio.established_year && (
                    <div className="detail-item">
                      <label><Calendar size={14} /> Established Year</label>
                      <p>{studio.established_year}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {studio.amenities && Array.isArray(studio.amenities) && studio.amenities.length > 0 && (
                <div className="info-section">
                  <h4><Zap size={16} /> Amenities</h4>
                  <div className="tags-container">
                    {studio.amenities.map((amenity, index) => (
                      <span key={index} className="tag amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dance Styles */}
              {studio.dance_styles && Array.isArray(studio.dance_styles) && studio.dance_styles.length > 0 && (
                <div className="info-section">
                  <h4><Music size={16} /> Dance Styles</h4>
                  <div className="tags-container">
                    {studio.dance_styles.map((style, index) => (
                      <span key={index} className="tag style-tag">{style}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Instructors */}
              {/* <div className="info-section">
                <h4><Users size={16} /> Linked Instructors</h4>
                {instructorsLoading ? (
                  <p style={{ color: "#adb5bd", fontSize: 13 }}>Loading instructors...</p>
                ) : linkedInstructors.length === 0 ? (
                  <p style={{ color: "#adb5bd", fontSize: 13 }}>
                    No instructors linked to this studio.
                  </p>
                ) : (
                  <div className="instructors-list">
                    {linkedInstructors.map((instructor, index) => (
  <div key={instructor.link_id || index} className="instructor-item">
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
    <div className="instructor-info">
      <p className="instructor-name">
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
      <p className="instructor-email" style={{ color: "#adb5bd", fontSize: 12 }}>
        ID: {instructor.user_id}
      </p>
    </div>
  </div>
))}
                  </div>
                )}
              </div> */}

              {/* Operating Hours */}
              {studio.operating_hours && (
                <div className="info-section">
                  <h4>Operating Hours</h4>
                  <div className="operating-hours">
                    {typeof studio.operating_hours === "object" ? (
                      DAYS_OF_WEEK.map((day) => {
                        if (!(day in studio.operating_hours)) return null;
                        const display = formatHours(studio.operating_hours[day]);
                        return (
                          <div key={day} className="hour-item">
                            <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                            <p className={!display ? "hours-closed" : ""}>
                              {display || "Closed"}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p>{studio.operating_hours}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {/* Social Media */}
{(() => {
  let socialMedia = {};
  try {
    socialMedia = typeof studio.social_media === "string"
      ? JSON.parse(studio.social_media)
      : studio.social_media || {};
  } catch (e) {
    socialMedia = {};
  }
  const validLinks = Object.entries(socialMedia).filter(([_, url]) => url && typeof url === "string" && url.startsWith("http"));
  if (validLinks.length === 0) return null;
  return (
    <div className="info-section">
      <h4>Social Media</h4>
      <div className="social-links">
        {validLinks.map(([platform, url], index) => (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="social-link">
            {platform}
          </a>
        ))}
      </div>
    </div>
  );
})()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioDetailDrawer;