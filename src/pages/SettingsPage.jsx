import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPalette,
  FaClipboardList,
  FaFileContract,
  FaUserShield,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";
import "../styles/SettingsPage.css";

const settingsOptions = [
  {
    title: 'App Branding',
    description: 'Customize logo, theme colors, and visual identity',
    icon: <FaPalette />,
    path: '/settings/app-branding',
    color: 'blue',
  },
  {
    title: 'Subscription Plans',
    description: 'Manage Danceur, Ginga, and Fiver subscription tiers',
    icon: <FaClipboardList />,
    path: '/settings/subscription-plans',
    color: 'purple',
  },
  {
    title: 'Legal Content',
    description: 'Update terms of service, privacy policy, and legal documents',
    icon: <FaFileContract />,
    path: '/settings/legal-content',
    color: 'pink',
  },
  {
    title: 'Admin & Roles',
    description: 'Configure user roles, permissions, and access controls',
    icon: <FaUserShield />,
    path: '/settings/admin-roles',
    color: 'blue',
  },
  {
    title: "App Version Info",
    description: "View current version details and release information",
    icon: <FaInfoCircle />,
    path: "/settings/app-version",
    color: 'purple',
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your application configuration and preferences</p>
      </div>
      
      <div className="settings-grid">
        {settingsOptions.map((item, index) => (
          <div
            key={index}
            className={`settings-card settings-card-${item.color}`}
            onClick={() => navigate(item.path)}
          >
            <div className="settings-card-content">
              <div className="settings-icon-wrapper">
                <div className={`settings-icon settings-icon-${item.color}`}>
                  {item.icon}
                </div>
              </div>
              <div className="settings-card-text">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
              </div>
              <div className="settings-card-arrow">
                <FaChevronRight />
              </div>
            </div>
            <div className="settings-card-hover-effect"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
