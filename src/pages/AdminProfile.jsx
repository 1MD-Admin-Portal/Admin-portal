import React from "react";
import "../styles/AdminProfile.css";

const AdminProfile = () => {
  return (
    <div className="admin-profile-page">
      <h2>Admin Profile</h2>
      <div className="profile-card">
        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Admin" />
        <div className="info">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> admin@example.com</p>
          <p><strong>Role:</strong> Super Admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
