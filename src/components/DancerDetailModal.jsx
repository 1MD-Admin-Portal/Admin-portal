import React from "react";
import "../styles/DancerDetailModal.css"; // adjust path if needed

const DancerDetailModal = ({ dancer, onClose }) => {
  if (!dancer) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-profile">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Dancer Details</h2>
        <div className="modal-profile-img">
          <img src={dancer.avatar} alt="Avatar" />
        </div>

        <div className="modal-info">
          <p><strong>User ID</strong> {dancer.id}</p>
          <p><strong>Name</strong> {dancer.name}</p>
          <p><strong>Email</strong> {dancer.email}</p>
          <p><strong>Dance Style Preference</strong> Salsa, Bachata</p>
          <p><strong>Dance Level</strong> {dancer.level}</p>
          <p><strong>Subscription</strong> {dancer.subscription}</p>
          <p><strong>Challenges Completed</strong> 5</p>
          <p><strong>Subscription date</strong> 12-05-2025 to 12-05-2026</p>
          <p><strong>Programs Enrolled</strong> 7</p>
          <p><strong>Friends Added</strong> 24</p>
        </div>

        <div className="modal-actions">
          <button className="suspend-btn">Suspend</button>
          <button className="delete-btn">Delete</button>
          <button className="flag-btn">Flag</button>
        </div>
      </div>
    </div>
  );
};

export default DancerDetailModal;
