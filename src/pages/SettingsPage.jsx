import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPalette, FaClipboardList, FaFileContract, FaBell, FaUserShield, FaInfoCircle } from 'react-icons/fa';
import '../styles/SettingsPage.css';

const settingsOptions = [
  {
    title: 'App Branding',
    description: 'Logo & Theme Color',
    icon: <FaPalette />,
    path: '/settings/app-branding',
  },
  {
    title: 'Subscription Plans',
    description: 'Danceur, Ginga, Fiver Plans',
    icon: <FaClipboardList />,
    path: '/settings/subscription-plans',
  },
  {
    title: 'Legal Content',
    description: 'Terms & Policies',
    icon: <FaFileContract />,
    path: '/settings/legal-content',
  },
  {
    title: 'Admin & Roles',
    description: 'Role Management',
    icon: <FaUserShield />,
    path: '/settings/admin-roles',
  },
  {
    title: 'App Version Info',
    description: 'Version Details',
    icon: <FaInfoCircle />,
    path: '/settings/app-version',
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <div className="settings-grid">
        {settingsOptions.map((item, index) => (
          <div
            key={index}
            className="settings-card"
            onClick={() => navigate(item.path)}
          >
            <div className="icon">{item.icon}</div>
            <div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
