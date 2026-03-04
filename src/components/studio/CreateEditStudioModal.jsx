import React, { useState, useEffect, useRef } from "react";
import { X, Clock, Globe, Instagram, Facebook, Twitter, Youtube, Music2, Upload } from "lucide-react";
import "./CreateEditStudioModal.css";
import {
  getCountries,
  getCitiesByCountry,
  getDanceStyles,
} from "../../services/masterData.service";
import { uploadMediaFile } from "../../services/upload.service";


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
  Object.entries(links).forEach(([k, v]) => { 
    if (v && v.trim() && isValidUrl(v.trim())) out[k] = v.trim(); 
  });
  return Object.keys(out).length > 0 ? out : null;
};

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// ─── Operating Hours Component ────────────────────────────────────────────────


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
        const value = links[platform.key] || "";
        const isValid = !value || isValidUrl(value);
        
        return (
          <div key={platform.key} className="social-row">
            <div className="social-icon-wrap" style={{ "--platform-color": platform.color }}>
              <Icon size={16} />
            </div>
            <span className="social-platform-label">{platform.label}</span>
            <input
              type="url"
              className={`social-url-input ${value && !isValid ? "social-url-invalid" : ""}`}
              value={value}
              onChange={e => update(platform.key, e.target.value)}
              placeholder={platform.placeholder}
              title={value && !isValid ? "Invalid URL format" : ""}
            />
            {value && (
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
  // const [formData, setFormData] = useState({
  //   name: "", description: "", address: "", city: "", state: "", country: "",
  //   postal_code: "", latitude: "", longitude: "", phone: "", email: "",
  //   website: "", logo_url: "", amenities: "", dance_styles: "",
  //   capacity: "", established_year: "", status: "active",
  // })
  const [formData, setFormData] = useState({
  name: "", description: "", address: "",
  city_id: "", state: "", country_id: "",
  postal_code: "", latitude: "", longitude: "",
  phone: "", email: "", website: "", logo_url: "",
  amenities: "", dance_styles: [],
  capacity: "", established_year: "", status: "active",
});

const [countries, setCountries] = useState([]);
const [cities, setCities] = useState([]);
const [danceStyleOptions, setDanceStyleOptions] = useState([]);
const [danceStylesOpen, setDanceStylesOpen] = useState(false);
const [danceStylesQuery, setDanceStylesQuery] = useState("");
const danceStylesRef = useRef(null);

const [countryOpen, setCountryOpen] = useState(false);
const [cityOpen, setCityOpen] = useState(false);

const [countryQuery, setCountryQuery] = useState("");
const [cityQuery, setCityQuery] = useState("");

const countryRef = useRef(null);
const cityRef = useRef(null);

  // Structured state — no JSON string intermediary
  const [hours, setHours] = useState(buildDefaultHours);
  const [socialLinks, setSocialLinks] = useState(buildDefaultSocial);
  const [errors, setErrors] = useState({});
  const [logoUploading, setLogoUploading] = useState(false);
  const logoFileRef = useRef(null);

  const handleLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadMediaFile(file);
      if (url) {
        setFormData(prev => ({ ...prev, logo_url: url }));
      } else {
        alert("Upload succeeded but no URL was returned.");
      }
    } catch (err) {
      console.error("Logo upload failed", err);
      alert("Failed to upload logo. Please try again or paste a URL.");
    } finally {
      setLogoUploading(false);
      if (logoFileRef.current) logoFileRef.current.value = "";
    }
  };

  useEffect(() => {
  if (!isOpen) return;

  const loadData = async () => {
    try {
      const [c, d] = await Promise.all([
        getCountries(),
        getDanceStyles()
      ]);

      setCountries(c);
      setDanceStyleOptions(d);
    } catch (e) {
      console.error("Master load failed", e);
    }
  };

  loadData();
}, [isOpen]);

useEffect(() => {
  if (!formData.country_id) return;

  const loadCities = async () => {
    try {
      const res = await getCitiesByCountry(formData.country_id);
      setCities(res);
    } catch (e) {
      console.error("City load failed", e);
    }
  };

  loadCities();
}, [formData.country_id]);

useEffect(() => {
  if (!danceStylesOpen) return;

  const onDocMouseDown = (e) => {
    const el = danceStylesRef.current;
    if (!el) return;
    if (!el.contains(e.target)) setDanceStylesOpen(false);
  };

  document.addEventListener("mousedown", onDocMouseDown);
  return () => document.removeEventListener("mousedown", onDocMouseDown);
}, [danceStylesOpen]);

useEffect(() => {
  const handler = (e) => {
    if (!countryRef.current?.contains(e.target)) setCountryOpen(false);
    if (!cityRef.current?.contains(e.target)) setCityOpen(false);
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);


  // useEffect(() => {
  //   if (studio) {
  //     setFormData({
  //       name: studio.name || "",
  //       description: studio.description || "",
  //       address: studio.address || "",
  //       city: studio.city || "",
  //       state: studio.state || "",
  //       country: studio.country || "",
  //       postal_code: studio.postal_code || "",
  //       latitude: studio.latitude || "",
  //       longitude: studio.longitude || "",
  //       phone: studio.phone || "",
  //       email: studio.email || "",
  //       website: studio.website || "",
  //       logo_url: studio.logo_url || "",
  //       amenities: Array.isArray(studio.amenities) ? studio.amenities.join(", ") : "",
  //       dance_styles: Array.isArray(studio.dance_styles) ? studio.dance_styles.join(", ") : "",
  //       capacity: studio.capacity || "",
  //       established_year: studio.established_year || "",
  //       status: studio.status || "active",
  //     });
  //     setHours(parseHoursFromRaw(studio.operating_hours));
  //     setSocialLinks(parseSocialFromRaw(studio.social_media));
  //   } else {
  //     setFormData({
  //       name: "", description: "", address: "", city: "", state: "", country: "",
  //       postal_code: "", latitude: "", longitude: "", phone: "", email: "",
  //       website: "", logo_url: "", amenities: "", dance_styles: "",
  //       capacity: "", established_year: "", status: "active",
  //     });
  //     setHours(buildDefaultHours());
  //     setSocialLinks(buildDefaultSocial());
  //   }
  //   setErrors({});
  // }, [studio, isOpen]);

  useEffect(() => {
  if (studio) {
    setFormData({
      name: studio.name || "",
      description: studio.description || "",
      address: studio.address || "",
      city_id: studio.city_id || "",
      country_id: studio.country_id || "",
      state: studio.state || "",
      postal_code: studio.postal_code || "",
      latitude: studio.latitude || "",
      longitude: studio.longitude || "",
      phone: studio.phone || "",
      email: studio.email || "",
      website: studio.website || "",
      logo_url: studio.logo_url || "",
      amenities: Array.isArray(studio.amenities) ? studio.amenities.join(", ") : "",
      dance_styles: Array.isArray(studio.dance_styles) ? studio.dance_styles : [],
      capacity: studio.capacity || "",
      established_year: studio.established_year || "",
      status: studio.status || "active",
    });

    setHours(parseHoursFromRaw(studio.operating_hours));
    setSocialLinks(parseSocialFromRaw(studio.social_media));
  } else {
    setFormData({
      name: "", description: "", address: "",
      city_id: "", state: "", country_id: "",
      postal_code: "", latitude: "", longitude: "",
      phone: "", email: "", website: "", logo_url: "",
      amenities: "", dance_styles: [],
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
    if (!studio && !formData.city_id) newErrors.city = "City is required";
    if (!studio && !formData.country_id) newErrors.country = "Country is required";

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

  // Check for invalid social media URLs
  const invalidSocialLinks = Object.entries(socialLinks).filter(
    ([_, url]) => url && url.trim() && !isValidUrl(url.trim())
  );
  
  if (invalidSocialLinks.length > 0) {
    const invalidPlatforms = invalidSocialLinks.map(([key, _]) => 
      SOCIAL_PLATFORMS.find(p => p.key === key)?.label || key
    ).join(", ");
    alert(`Invalid URLs for: ${invalidPlatforms}. Please fix these or remove them.`);
    return;
  }

 const selectedCountry = countries.find(c => c.id == formData.country_id);
const selectedCity = cities.find(c => c.id == formData.city_id);
  onSubmit({
    ...formData,
    city: selectedCity?.name || "",
    country: selectedCountry?.name || "",
    latitude: parseFloat(formData.latitude),
    longitude: parseFloat(formData.longitude),
    capacity: parseInt(formData.capacity),
    established_year: formData.established_year ? parseInt(formData.established_year) : null,
    amenities: formData.amenities.split(",").map(i => i.trim()).filter(Boolean),
    dance_styles: formData.dance_styles,
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
                  <label htmlFor="city">City {!studio && <span className="required">*</span>}</label>
                  <div className="search-select" ref={cityRef}>
  <button
    type="button"
    className="search-select-trigger"
    disabled={!formData.country_id}
    onClick={() => setCityOpen(v => !v)}
  >
    {cities.find(c => c.id == formData.city_id)?.name || "Select City"}
    <span>▾</span>
  </button>

  {cityOpen && (
    <div className="search-select-dropdown">
      <input
        type="text"
        placeholder="Search city..."
        value={cityQuery}
        onChange={(e) => setCityQuery(e.target.value)}
        className="search-select-input"
        autoFocus
      />

      <div className="search-select-list">
        {cities
          .filter(c =>
            c.name.toLowerCase().includes(cityQuery.toLowerCase())
          )
          .map(c => (
            <div
              key={c.id}
              className="search-select-item"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  city_id: c.id
                }));
                setCityOpen(false);
                setCityQuery("");
              }}
            >
              {c.name}
            </div>
          ))}
      </div>
    </div>
  )}
</div>


                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country {!studio && <span className="required">*</span>}</label>
                  <div className="search-select" ref={countryRef}>
  <button
    type="button"
    className="search-select-trigger"
    onClick={() => setCountryOpen(v => !v)}
  >
    {countries.find(c => c.id == formData.country_id)?.name || "Select Country"}
    <span>▾</span>
  </button>

  {countryOpen && (
    <div className="search-select-dropdown">
      <input
        type="text"
        placeholder="Search country..."
        value={countryQuery}
        onChange={(e) => setCountryQuery(e.target.value)}
        className="search-select-input"
        autoFocus
      />

      <div className="search-select-list">
        {countries
          .filter(c =>
            c.name.toLowerCase().includes(countryQuery.toLowerCase())
          )
          .map(c => (
            <div
              key={c.id}
              className="search-select-item"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  country_id: c.id,
                  city_id: "",
                  state: ""
                }));
                setCountryOpen(false);
                setCountryQuery("");
              }}
            >
              {c.name}
            </div>
          ))}
      </div>
    </div>
  )}
</div>


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
              <div className="form-group logo-upload-group">
                <label htmlFor="logo_url">Studio Logo</label>
                <div className="logo-input-row">
                  <input type="url" id="logo_url" name="logo_url" value={formData.logo_url}
                    onChange={handleChange} placeholder="Paste URL or upload a file" className="logo-url-input" />
                  <input
                    type="file"
                    ref={logoFileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleLogoFileUpload}
                  />
                  <button
                    type="button"
                    className="logo-upload-btn"
                    disabled={logoUploading}
                    onClick={() => logoFileRef.current?.click()}
                  >
                    <Upload size={16} />
                    {logoUploading ? "Uploading…" : "Upload"}
                  </button>
                </div>
                {formData.logo_url && (
                  <div className="logo-preview">
                    <img src={formData.logo_url} alt="Logo preview" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
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
                <label>Dance Styles</label>
                <div className="dance-styles-field" ref={danceStylesRef}>
                  <button
  type="button"
  className={`dance-styles-control ${danceStylesOpen ? "open" : ""}`}
  onClick={() => setDanceStylesOpen((v) => !v)}
>

                    <div className="dance-styles-chips">
                      {formData.dance_styles?.length ? (
                        formData.dance_styles.map((name) => (
                          <span key={name} className="dance-style-chip">
                            <span className="dance-style-chip__label">{name}</span>
                            <button
                              type="button"
                              className="dance-style-chip__remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData((prev) => ({
                                  ...prev,
                                  dance_styles: (prev.dance_styles || []).filter((s) => s !== name),
                                }));
                              }}
                              aria-label={`Remove ${name}`}
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="dance-styles-placeholder">Select dance styles</span>
                      )}
                    </div>
                    <span className="dance-styles-chevron">▾</span>
                  </button>

                  {danceStylesOpen && (
                    <div className="dance-styles-popover" role="listbox" aria-label="Dance styles">
                      <input
                        className="dance-styles-search"
                        type="text"
                        value={danceStylesQuery}
                        onChange={(e) => setDanceStylesQuery(e.target.value)}
                        placeholder="Search styles..."
                        autoFocus
                      />

                      <div className="dance-styles-options">
                        
                        {danceStyleOptions
                          .filter((d) =>
                            (d?.name || "")
                              .toLowerCase()
                              .includes((danceStylesQuery || "").toLowerCase().trim())
                          )
                          .map((d) => {
                            const name = d?.name || "";
                            const checked = (formData.dance_styles || []).includes(name);
                            return (
                              <label key={d.id ?? name} className={`dance-styles-option ${checked ? "selected" : ""}`}>
  <div className="ds-left">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => {
        setFormData((prev) => {
          const curr = prev.dance_styles || [];
          const next = checked
            ? curr.filter((s) => s !== name)
            : [...curr, name];
          return { ...prev, dance_styles: next };
        });
      }}
    />
    <span>{name}</span>
  </div>

  {checked && <span className="ds-check">✓</span>}
</label>

                            );
                          })}

                        {!danceStyleOptions?.length && (
                          <div className="dance-styles-empty">No dance styles available.</div>
                        )}
                        {!!danceStyleOptions?.length &&
                          !danceStyleOptions.some((d) =>
                            (d?.name || "")
                              .toLowerCase()
                              .includes((danceStylesQuery || "").toLowerCase().trim())
                          ) && <div className="dance-styles-empty">No matches.</div>}
                      </div>

                      <div className="dance-styles-actions">
                        <button
                          type="button"
                          className="dance-styles-action"
                          onClick={() => setFormData((prev) => ({ ...prev, dance_styles: [] }))}
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          className="dance-styles-action dance-styles-action--primary"
                          onClick={() => setDanceStylesOpen(false)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                    
                  )}
                </div>
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
            {/* <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button> */}
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