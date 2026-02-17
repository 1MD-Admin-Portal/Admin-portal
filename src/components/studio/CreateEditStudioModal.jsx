// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import "./CreateEditStudioModal.css";

// const CreateEditStudioModal = ({ isOpen, onClose, onSubmit, studio = null, loading = false }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     postal_code: "",
//     latitude: "",
//     longitude: "",
//     phone: "",
//     email: "",
//     website: "",
//     logo_url: "",
//     amenities: "",
//     dance_styles: "",
//     operating_hours: "",
//     social_media: "",
//     capacity: "",
//     established_year: "",
//     status: "active",
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (studio) {
//       setFormData({
//         name: studio.name || "",
//         description: studio.description || "",
//         address: studio.address || "",
//         city: studio.city || "",
//         state: studio.state || "",
//         country: studio.country || "",
//         postal_code: studio.postal_code || "",
//         latitude: studio.latitude || "",
//         longitude: studio.longitude || "",
//         phone: studio.phone || "",
//         email: studio.email || "",
//         website: studio.website || "",
//         logo_url: studio.logo_url || "",
//         amenities: Array.isArray(studio.amenities) ? studio.amenities.join(", ") : "",
//         dance_styles: Array.isArray(studio.dance_styles) ? studio.dance_styles.join(", ") : "",
//         operating_hours: typeof studio.operating_hours === 'object' && studio.operating_hours ? JSON.stringify(studio.operating_hours, null, 2) : "",
//         social_media: typeof studio.social_media === 'object' && studio.social_media ? JSON.stringify(studio.social_media, null, 2) : "",
//         capacity: studio.capacity || "",
//         established_year: studio.established_year || "",
//         status: studio.status || "active",
//       });
//     } else {
//       resetForm();
//     }
//     setErrors({});
//   }, [studio, isOpen]);

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       postal_code: "",
//       latitude: "",
//       longitude: "",
//       phone: "",
//       email: "",
//       website: "",
//       logo_url: "",
//       amenities: "",
//       dance_styles: "",
//       operating_hours: "",
//       social_media: "",
//       capacity: "",
//       established_year: "",
//       status: "active",
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Studio name is required";
//     if (!formData.address.trim()) newErrors.address = "Address is required";
//     if (!formData.city.trim()) newErrors.city = "City is required";
//     if (!formData.country.trim()) newErrors.country = "Country is required";
//     if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = "Valid latitude is required";
//     if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = "Valid longitude is required";
//     if (!formData.capacity || isNaN(formData.capacity)) newErrors.capacity = "Valid capacity is required";
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newErrors = validateForm();

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     const submitData = {
//       name: formData.name,
//       description: formData.description,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state,
//       country: formData.country,
//       postal_code: formData.postal_code,
//       latitude: parseFloat(formData.latitude),
//       longitude: parseFloat(formData.longitude),
//       phone: formData.phone,
//       email: formData.email,
//       website: formData.website,
//       logo_url: formData.logo_url,
//       capacity: parseInt(formData.capacity),
//       established_year: formData.established_year ? parseInt(formData.established_year) : null,
//       status: formData.status,
//       amenities: formData.amenities
//         .split(",")
//         .map((item) => item.trim())
//         .filter((item) => item),
//       dance_styles: formData.dance_styles
//         .split(",")
//         .map((item) => item.trim())
//         .filter((item) => item),
//     };

//     // Parse operating_hours if provided
//     if (formData.operating_hours && formData.operating_hours.trim()) {
//       try {
//         submitData.operating_hours = JSON.parse(formData.operating_hours);
//       } catch (e) {
//         setErrors({ operating_hours: "Invalid JSON format for operating hours" });
//         return;
//       }
//     }

//     // Parse social_media if provided
//     if (formData.social_media && formData.social_media.trim()) {
//       try {
//         submitData.social_media = JSON.parse(formData.social_media);
//       } catch (e) {
//         setErrors({ social_media: "Invalid JSON format for social media" });
//         return;
//       }
//     }

//     onSubmit(submitData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="studio-modal-overlay" onClick={onClose}>
//       <div className="studio-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="studio-modal-header">
//           <h2>{studio ? "Edit Studio" : "Create New Studio"}</h2>
//           <button
//             className="studio-modal-close"
//             onClick={onClose}
//             disabled={loading}
//             aria-label="Close modal"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="studio-modal-form">
//           <div className="studio-form-grid">
//             {/* Basic Info */}
//             <div className="studio-form-section">
//               <h3>📋 Basic Information</h3>
//               <div className="form-group">
//                 <label htmlFor="name">
//                   Studio Name <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter studio name"
//                   className={errors.name ? "error" : ""}
//                 />
//                 {errors.name && <span className="error-message"> {errors.name}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="description">Description</label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   placeholder="Enter studio description"
//                   rows="3"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="status">Status</label>
//                 <select
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="suspended">Suspended</option>
//                 </select>
//               </div>
//             </div>

//             {/* Location Info */}
//             <div className="studio-form-section">
//               <h3>📍 Location</h3>
//               <div className="form-group">
//                 <label htmlFor="address">
//                   Address <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="Street address"
//                   className={errors.address ? "error" : ""}
//                 />
//                 {errors.address && <span className="error-message"> {errors.address}</span>}
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="city">
//                     City <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="city"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     placeholder="City"
//                     className={errors.city ? "error" : ""}
//                   />
//                   {errors.city && <span className="error-message"> {errors.city}</span>}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="state">State</label>
//                   <input
//                     type="text"
//                     id="state"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     placeholder="State"
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="country">
//                     Country <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="country"
//                     name="country"
//                     value={formData.country}
//                     onChange={handleChange}
//                     placeholder="Country"
//                     className={errors.country ? "error" : ""}
//                   />
//                   {errors.country && <span className="error-message"> {errors.country}</span>}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="postal_code">Postal Code</label>
//                   <input
//                     type="text"
//                     id="postal_code"
//                     name="postal_code"
//                     value={formData.postal_code}
//                     onChange={handleChange}
//                     placeholder="Postal code"
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="latitude">
//                     Latitude <span className="required">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     id="latitude"
//                     name="latitude"
//                     value={formData.latitude}
//                     onChange={handleChange}
//                     placeholder="e.g., 40.7128"
//                     step="0.0001"
//                     className={errors.latitude ? "error" : ""}
//                   />
//                   {errors.latitude && <span className="error-message"> {errors.latitude}</span>}
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="longitude">
//                     Longitude <span className="required">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     id="longitude"
//                     name="longitude"
//                     value={formData.longitude}
//                     onChange={handleChange}
//                     placeholder="e.g., -74.0060"
//                     step="0.0001"
//                     className={errors.longitude ? "error" : ""}
//                   />
//                   {errors.longitude && <span className="error-message"> {errors.longitude}</span>}
//                 </div>
//               </div>
//             </div>

//             {/* Contact Info */}
//             <div className="studio-form-section">
//               <h3>📞 Contact Information</h3>
//               <div className="form-group">
//                 <label htmlFor="phone">Phone</label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="+1 (555) 123-4567"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="studio@example.com"
//                   className={errors.email ? "error" : ""}
//                 />
//                 {errors.email && <span className="error-message"> {errors.email}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="website">Website</label>
//                 <input
//                   type="url"
//                   id="website"
//                   name="website"
//                   value={formData.website}
//                   onChange={handleChange}
//                   placeholder="https://example.com"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="logo_url">Logo URL</label>
//                 <input
//                   type="url"
//                   id="logo_url"
//                   name="logo_url"
//                   value={formData.logo_url}
//                   onChange={handleChange}
//                   placeholder="https://example.com/logo.png"
//                 />
//               </div>
//             </div>

//             {/* Studio Details */}
//             <div className="studio-form-section">
//               <h3>🎭 Studio Details</h3>
//               <div className="form-group">
//                 <label htmlFor="capacity">
//                   Capacity <span className="required">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   id="capacity"
//                   name="capacity"
//                   value={formData.capacity}
//                   onChange={handleChange}
//                   placeholder="Number of people"
//                   className={errors.capacity ? "error" : ""}
//                 />
//                 {errors.capacity && <span className="error-message"> {errors.capacity}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="established_year">Established Year</label>
//                 <input
//                   type="number"
//                   id="established_year"
//                   name="established_year"
//                   value={formData.established_year}
//                   onChange={handleChange}
//                   placeholder="e.g., 2020"
//                   min="1900"
//                   max={new Date().getFullYear()}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="amenities">Amenities (comma-separated)</label>
//                 <textarea
//                   id="amenities"
//                   name="amenities"
//                   value={formData.amenities}
//                   onChange={handleChange}
//                   placeholder="WiFi, Parking, Air Conditioning, Changing Rooms"
//                   rows="2"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="dance_styles">Dance Styles (comma-separated)</label>
//                 <textarea
//                   id="dance_styles"
//                   name="dance_styles"
//                   value={formData.dance_styles}
//                   onChange={handleChange}
//                   placeholder="Hip Hop, Contemporary, Ballet, Jazz"
//                   rows="2"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="operating_hours">Operating Hours (JSON format)</label>
//                 <textarea
//                   id="operating_hours"
//                   name="operating_hours"
//                   value={formData.operating_hours}
//                   onChange={handleChange}
//                   placeholder='{"monday": "9:00 AM - 9:00 PM", "tuesday": "9:00 AM - 9:00 PM"}'
//                   rows="3"
//                   className={errors.operating_hours ? "error" : ""}
//                 />
//                 {errors.operating_hours && <span className="error-message"> {errors.operating_hours}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="social_media">Social Media (JSON format)</label>
//                 <textarea
//                   id="social_media"
//                   name="social_media"
//                   value={formData.social_media}
//                   onChange={handleChange}
//                   placeholder='{"instagram": "https://instagram.com/...", "facebook": "https://facebook.com/..."}'
//                   rows="3"
//                   className={errors.social_media ? "error" : ""}
//                 />
//                 {errors.social_media && <span className="error-message"> {errors.social_media}</span>}
//               </div>
//             </div>
//           </div>

//           <div className="studio-modal-footer">
//             <button
//               type="button"
//               className="btn-cancel"
//               onClick={onClose}
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={`btn-submit ${loading ? 'loading' : ''}`}
//               disabled={loading}
//             >
//               {loading ? "" : studio ? "Update Studio" : "Create Studio"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateEditStudioModal;
import React, { useState, useEffect } from "react";
import { X, Clock, Globe, Instagram, Facebook, Twitter, Youtube, Music2 } from "lucide-react";
import "./CreateEditStudioModal.css";

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourstudio", color: "#E1306C" },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourstudio", color: "#1877F2" },
  { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/yourstudio", color: "#1DA1F2" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@yourstudio", color: "#FF0000" },
  { key: "tiktok", label: "TikTok", icon: Music2, placeholder: "https://tiktok.com/@yourstudio", color: "#000000" },
  { key: "website", label: "Other / Website", icon: Globe, placeholder: "https://example.com", color: "#8E5CF6" },
];

const DEFAULT_DAY = { open: "09:00", close: "21:00", closed: false };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildDefaultHours = () => {
  const h = {};
  DAYS_OF_WEEK.forEach(day => { h[day] = { ...DEFAULT_DAY }; });
  return h;
};

// Accepts raw value from DB: either an object or a JSON string
const parseHoursFromRaw = (raw) => {
  const h = buildDefaultHours();
  if (!raw) return h;

  let parsed = raw;
  if (typeof raw === "string") {
    try { parsed = JSON.parse(raw); } catch (e) { return h; }
  }
  if (typeof parsed !== "object" || parsed === null) return h;

  DAYS_OF_WEEK.forEach(day => {
    const val = parsed[day];
    if (val === undefined || val === null) return;

    if (typeof val === "string") {
      // "closed" string or legacy "9:00 AM - 9:00 PM"
      h[day] = { ...DEFAULT_DAY, closed: val.toLowerCase() === "closed" };
    } else if (typeof val === "object") {
      // { open: "09:00", close: "21:00" } or { open, close, closed }
      h[day] = {
        open:   typeof val.open  === "string" ? val.open  : DEFAULT_DAY.open,
        close:  typeof val.close === "string" ? val.close : DEFAULT_DAY.close,
        closed: val.closed === true,
      };
    }
  });
  return h;
};

const serializeHours = (hours) => {
  const out = {};
  DAYS_OF_WEEK.forEach(day => {
    out[day] = hours[day].closed
      ? "closed"
      : { open: hours[day].open, close: hours[day].close };
  });
  return out;
};

const buildDefaultSocial = () => {
  const s = {};
  SOCIAL_PLATFORMS.forEach(p => { s[p.key] = ""; });
  return s;
};

const parseSocialFromRaw = (raw) => {
  const s = buildDefaultSocial();
  if (!raw) return s;

  let parsed = raw;
  if (typeof raw === "string") {
    try { parsed = JSON.parse(raw); } catch (e) { return s; }
  }
  if (typeof parsed === "object" && parsed !== null) {
    Object.keys(parsed).forEach(key => {
      s[key] = typeof parsed[key] === "string" ? parsed[key] : "";
    });
  }
  return s;
};

const serializeSocial = (links) => {
  const out = {};
  Object.entries(links).forEach(([k, v]) => { if (v && v.trim()) out[k] = v.trim(); });
  return Object.keys(out).length > 0 ? out : null;
};

// ─── Operating Hours Component ────────────────────────────────────────────────
// Purely presentational: receives hours object, calls onChange with updated object.
// No internal state, no useEffect, no JSON serialization — zero sync issues.

const OperatingHoursField = ({ hours, onChange }) => {
  const update = (day, field, val) =>
    onChange({ ...hours, [day]: { ...hours[day], [field]: val } });

  const applyToAll = (sourceDay) => {
    const source = hours[sourceDay];
    const next = {};
    DAYS_OF_WEEK.forEach(day => { next[day] = { ...source }; });
    onChange(next);
  };

  return (
    <div className="hours-builder">
      <div className="hours-header-row">
        <span className="hours-col-label">Day</span>
        <span className="hours-col-label">Open</span>
        <span className="hours-col-label">Close</span>
        <span className="hours-col-label">Closed?</span>
        <span className="hours-col-label"></span>
      </div>

      {DAYS_OF_WEEK.map(day => (
        <div key={day} className={`hours-row ${hours[day].closed ? "hours-row--closed" : ""}`}>
          <span className="hours-day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>

          <input
            type="time"
            value={hours[day].open}
            disabled={hours[day].closed}
            onChange={e => update(day, "open", e.target.value)}
            className="hours-time-input"
          />

          <input
            type="time"
            value={hours[day].close}
            disabled={hours[day].closed}
            onChange={e => update(day, "close", e.target.value)}
            className="hours-time-input"
          />

          <label className="toggle-closed">
            <input
              type="checkbox"
              checked={hours[day].closed}
              onChange={e => update(day, "closed", e.target.checked)}
            />
            <span className="toggle-track"></span>
          </label>

          <button
            type="button"
            className="apply-all-btn"
            onClick={() => applyToAll(day)}
            title={`Apply ${day}'s hours to all days`}
          >
            Copy all
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── Social Media Component ───────────────────────────────────────────────────

const SocialMediaField = ({ links, onChange }) => {
  const update = (key, val) => onChange({ ...links, [key]: val });

  return (
    <div className="social-builder">
      {SOCIAL_PLATFORMS.map(platform => {
        const Icon = platform.icon;
        return (
          <div key={platform.key} className="social-row">
            <div className="social-icon-wrap" style={{ "--platform-color": platform.color }}>
              <Icon size={16} />
            </div>
            <span className="social-platform-label">{platform.label}</span>
            <input
              type="url"
              className="social-url-input"
              value={links[platform.key] || ""}
              onChange={e => update(platform.key, e.target.value)}
              placeholder={platform.placeholder}
            />
            {links[platform.key] && (
              <button
                type="button"
                className="social-clear-btn"
                onClick={() => update(platform.key, "")}
                title="Clear"
              >
                <X size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const CreateEditStudioModal = ({ isOpen, onClose, onSubmit, studio = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: "", description: "", address: "", city: "", state: "", country: "",
    postal_code: "", latitude: "", longitude: "", phone: "", email: "",
    website: "", logo_url: "", amenities: "", dance_styles: "",
    capacity: "", established_year: "", status: "active",
  });

  // Structured state — no JSON string intermediary
  const [hours, setHours] = useState(buildDefaultHours);
  const [socialLinks, setSocialLinks] = useState(buildDefaultSocial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studio) {
      setFormData({
        name: studio.name || "",
        description: studio.description || "",
        address: studio.address || "",
        city: studio.city || "",
        state: studio.state || "",
        country: studio.country || "",
        postal_code: studio.postal_code || "",
        latitude: studio.latitude || "",
        longitude: studio.longitude || "",
        phone: studio.phone || "",
        email: studio.email || "",
        website: studio.website || "",
        logo_url: studio.logo_url || "",
        amenities: Array.isArray(studio.amenities) ? studio.amenities.join(", ") : "",
        dance_styles: Array.isArray(studio.dance_styles) ? studio.dance_styles.join(", ") : "",
        capacity: studio.capacity || "",
        established_year: studio.established_year || "",
        status: studio.status || "active",
      });
      setHours(parseHoursFromRaw(studio.operating_hours));
      setSocialLinks(parseSocialFromRaw(studio.social_media));
    } else {
      setFormData({
        name: "", description: "", address: "", city: "", state: "", country: "",
        postal_code: "", latitude: "", longitude: "", phone: "", email: "",
        website: "", logo_url: "", amenities: "", dance_styles: "",
        capacity: "", established_year: "", status: "active",
      });
      setHours(buildDefaultHours());
      setSocialLinks(buildDefaultSocial());
    }
    setErrors({});
  }, [studio, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Studio name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = "Valid latitude is required";
    if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = "Valid longitude is required";
    if (!formData.capacity || isNaN(formData.capacity)) newErrors.capacity = "Valid capacity is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    onSubmit({
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      capacity: parseInt(formData.capacity),
      established_year: formData.established_year ? parseInt(formData.established_year) : null,
      amenities: formData.amenities.split(",").map(i => i.trim()).filter(Boolean),
      dance_styles: formData.dance_styles.split(",").map(i => i.trim()).filter(Boolean),
      operating_hours: serializeHours(hours),
      social_media: serializeSocial(socialLinks),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="studio-modal-overlay" onClick={onClose}>
      <div className="studio-modal" onClick={e => e.stopPropagation()}>
        <div className="studio-modal-header">
          <h2>{studio ? "Edit Studio" : "Create New Studio"}</h2>
          <button className="studio-modal-close" onClick={onClose} disabled={loading} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="studio-modal-form">
          <div className="studio-form-grid">

            {/* Basic Info */}
            <div className="studio-form-section">
              <h3>📋 Basic Information</h3>
              <div className="form-group">
                <label htmlFor="name">Studio Name <span className="required">*</span></label>
                <input type="text" id="name" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Enter studio name"
                  className={errors.name ? "error" : ""} />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description}
                  onChange={handleChange} placeholder="Enter studio description" rows="3" />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="studio-form-section">
              <h3>📍 Location</h3>
              <div className="form-group">
                <label htmlFor="address">Address <span className="required">*</span></label>
                <input type="text" id="address" name="address" value={formData.address}
                  onChange={handleChange} placeholder="Street address"
                  className={errors.address ? "error" : ""} />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City <span className="required">*</span></label>
                  <input type="text" id="city" name="city" value={formData.city}
                    onChange={handleChange} placeholder="City" className={errors.city ? "error" : ""} />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input type="text" id="state" name="state" value={formData.state}
                    onChange={handleChange} placeholder="State" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country <span className="required">*</span></label>
                  <input type="text" id="country" name="country" value={formData.country}
                    onChange={handleChange} placeholder="Country" className={errors.country ? "error" : ""} />
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="postal_code">Postal Code</label>
                  <input type="text" id="postal_code" name="postal_code" value={formData.postal_code}
                    onChange={handleChange} placeholder="Postal code" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude">Latitude <span className="required">*</span></label>
                  <input type="number" id="latitude" name="latitude" value={formData.latitude}
                    onChange={handleChange} placeholder="e.g., 40.7128" step="0.0001"
                    className={errors.latitude ? "error" : ""} />
                  {errors.latitude && <span className="error-message">{errors.latitude}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="longitude">Longitude <span className="required">*</span></label>
                  <input type="number" id="longitude" name="longitude" value={formData.longitude}
                    onChange={handleChange} placeholder="e.g., -74.0060" step="0.0001"
                    className={errors.longitude ? "error" : ""} />
                  {errors.longitude && <span className="error-message">{errors.longitude}</span>}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="studio-form-section">
              <h3>📞 Contact Information</h3>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="+1 (555) 123-4567" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="studio@example.com"
                  className={errors.email ? "error" : ""} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input type="url" id="website" name="website" value={formData.website}
                  onChange={handleChange} placeholder="https://example.com" />
              </div>
              <div className="form-group">
                <label htmlFor="logo_url">Logo URL</label>
                <input type="url" id="logo_url" name="logo_url" value={formData.logo_url}
                  onChange={handleChange} placeholder="https://example.com/logo.png" />
              </div>
            </div>

            {/* Studio Details */}
            <div className="studio-form-section">
              <h3>🎭 Studio Details</h3>
              <div className="form-group">
                <label htmlFor="capacity">Capacity <span className="required">*</span></label>
                <input type="number" id="capacity" name="capacity" value={formData.capacity}
                  onChange={handleChange} placeholder="Number of people"
                  className={errors.capacity ? "error" : ""} />
                {errors.capacity && <span className="error-message">{errors.capacity}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="established_year">Established Year</label>
                <input type="number" id="established_year" name="established_year"
                  value={formData.established_year} onChange={handleChange}
                  placeholder="e.g., 2020" min="1900" max={new Date().getFullYear()} />
              </div>
              <div className="form-group">
                <label htmlFor="amenities">Amenities (comma-separated)</label>
                <textarea id="amenities" name="amenities" value={formData.amenities}
                  onChange={handleChange} placeholder="WiFi, Parking, Air Conditioning" rows="2" />
              </div>
              <div className="form-group">
                <label htmlFor="dance_styles">Dance Styles (comma-separated)</label>
                <textarea id="dance_styles" name="dance_styles" value={formData.dance_styles}
                  onChange={handleChange} placeholder="Hip Hop, Contemporary, Ballet" rows="2" />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="studio-form-section studio-form-section--full">
              <h3>
                <Clock size={16} style={{ marginRight: 6 }} />
                Operating Hours
              </h3>
              <p className="section-hint">
                Set your studio's open and close times for each day. Toggle "Closed" for days you don't operate.
              </p>
              <OperatingHoursField hours={hours} onChange={setHours} />
            </div>

            {/* Social Media */}
            <div className="studio-form-section studio-form-section--full">
              <h3>
                <Globe size={16} style={{ marginRight: 6 }} />
                Social Media
              </h3>
              <p className="section-hint">
                Add links to your studio's social profiles. Leave blank any platforms you're not on.
              </p>
              <SocialMediaField links={socialLinks} onChange={setSocialLinks} />
            </div>

          </div>

          <div className="studio-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className={`btn-submit ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "" : studio ? "Update Studio" : "Create Studio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditStudioModal;