import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaPalette } from "react-icons/fa";
import "../styles/AppBrandingPage.css";

const AppBrandingPage = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [themeColor, setThemeColor] = useState("#5b7cfa"); // default blue

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e) => setThemeColor(e.target.value);

  return (
    <div className="app-branding-container">
      <button className="back-button" onClick={() => navigate("/SettingsPage")}>
        <FaArrowLeft /> Back to Settings
      </button>

      <div className="branding-header">
        <div className="branding-header-content">
          <div className="branding-icon-wrapper">
            <FaPalette />
          </div>
          <div>
            <h1 className="branding-title">App Branding</h1>
            <p className="branding-subtitle">Customize your app's visual identity and branding</p>
          </div>
        </div>
      </div>

      <div className="branding-content">
        <div className="branding-card">
          <div className="branding-card-header">
            <h3 className="branding-card-title">Logo</h3>
            <p className="branding-card-description">Upload your app logo (PNG, JPG, SVG recommended)</p>
          </div>
          <div className="branding-card-body">
            <div className="logo-preview-wrapper">
              <div className="logo-preview">
                {logo ? (
                  <img src={logo} alt="Logo Preview" />
                ) : (
                  <div className="placeholder-content">
                    <div className="placeholder-icon">🖼️</div>
                    <span className="placeholder-text">No logo uploaded</span>
                  </div>
                )}
              </div>
            </div>
            <label className="upload-button">
              <FaUpload /> Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
            </label>
          </div>
        </div>

        <div className="branding-card">
          <div className="branding-card-header">
            <h3 className="branding-card-title">Theme Color</h3>
            <p className="branding-card-description">Set your primary brand color</p>
          </div>
          <div className="branding-card-body">
            <div className="theme-color-wrapper">
              <div className="theme-color-preview" style={{ backgroundColor: themeColor }} />
              <div className="theme-color-info">
                <span className="theme-color-label">Current Color</span>
                <span className="theme-color-value">{themeColor.toUpperCase()}</span>
              </div>
            </div>
            <label className="color-picker-button">
              <FaPalette /> Change Color
              <input type="color" value={themeColor} onChange={handleColorChange} hidden />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBrandingPage;
