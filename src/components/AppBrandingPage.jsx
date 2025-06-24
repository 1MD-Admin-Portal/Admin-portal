import React, { useState } from "react";
import "../styles/AppBrandingPage.css"; // Assuming you have a CSS file for styles

const AppBrandingPage = () => {
  const [logo, setLogo] = useState(null);
  const [themeColor, setThemeColor] = useState("#3b82f6"); // default blue

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
      <h2 className="branding-title">App Branding</h2>

      <div className="branding-section">
        <h3>Logo</h3>
        <div className="branding-box">
          <div className="logo-preview">
            {logo ? (
              <img src={logo} alt="Logo Preview" />
            ) : (
              <div className="placeholder-icon">🖼️</div>
            )}
          </div>
          <label className="upload-button">
            Upload
            <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
          </label>
        </div>
      </div>

      <div className="branding-section">
        <h3>Theme</h3>
        <div className="branding-box">
          <div className="theme-color-box" style={{ backgroundColor: themeColor }} />
          <label className="upload-button">
            Change
            <input type="color" value={themeColor} onChange={handleColorChange} hidden />
          </label>
        </div>
      </div>
    </div>
  );
};

export default AppBrandingPage;
