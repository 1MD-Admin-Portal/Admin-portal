import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaInfoCircle, FaCheckCircle, FaDownload, FaClock } from "react-icons/fa";
import "../styles/AppVersionInfo.css";

const AppVersionInfo = () => {
  const navigate = useNavigate();
  const [version] = useState("1.4.2");
  const [buildNumber] = useState("2024.12.15");
  const [releaseDate] = useState("December 15, 2024");
  const [updateAvailable] = useState(false);

  return (
    <div className="app-version-container">
      <button className="back-button" onClick={() => navigate("/SettingsPage")}>
        <FaArrowLeft /> Back to Settings
      </button>

      <div className="version-header">
        <div className="version-header-content">
          <div className="version-icon-wrapper">
            <FaInfoCircle />
          </div>
          <div>
            <h1 className="version-title">App Version Info</h1>
            <p className="version-subtitle">Current version details and release information</p>
          </div>
        </div>
      </div>

      <div className="version-content">
        <div className="version-card">
          <div className="version-status">
            {updateAvailable ? (
              <div className="version-badge version-badge-update">
                <FaDownload /> Update Available
              </div>
            ) : (
              <div className="version-badge version-badge-current">
                <FaCheckCircle /> Up to Date
              </div>
            )}
          </div>

          <div className="version-info-grid">
            <div className="version-info-item">
              <div className="version-info-label">Current Version</div>
              <div className="version-info-value">{version}</div>
            </div>

            <div className="version-info-item">
              <div className="version-info-label">Build Number</div>
              <div className="version-info-value">{buildNumber}</div>
            </div>

            <div className="version-info-item">
              <div className="version-info-label">
                <FaClock /> Release Date
              </div>
              <div className="version-info-value">{releaseDate}</div>
            </div>
          </div>

          <div className="version-actions">
            <button className="version-check-btn">
              <FaDownload /> Check for Updates
            </button>
          </div>
        </div>

        <div className="version-release-notes">
          <h3 className="release-notes-title">Release Notes</h3>
          <div className="release-notes-content">
            <div className="release-note-item">
              <span className="release-note-version">v{version}</span>
              <div className="release-note-details">
                <p className="release-note-date">{releaseDate}</p>
                <ul className="release-note-list">
                  <li>Performance improvements and bug fixes</li>
                  <li>Enhanced user interface components</li>
                  <li>Security updates and patches</li>
                  <li>New features and functionality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppVersionInfo;
