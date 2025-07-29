import React from "react";
import "./AdminProfile.css";

const AdminProfile = () => {
  return (
    <div className="admin-profile-page-container">
      <h2>Admin Profile</h2>
      <div className="profile-card-container">
        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Admin" />
        <div className="info">
          <p>
            <strong>Name:</strong> Mark
          </p>
          <p>
            <strong>Email:</strong> admin@local.com
          </p>
          <p>
            <strong>Role:</strong> Super Admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
