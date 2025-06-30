import React from "react";
import "../styles/ProfessorDetailModal.css";

const ProfessorDetailModal = ({ professor, onClose }) => {
  if (!professor) return null;

  return (
    <div className="professor-modal-overlay">
      <div className="professor-modal-content">
        <button className="professor-modal-close" onClick={onClose}>×</button>

        <div className="profile-section">
          <img src={professor.avatar} alt="Avatar" className="profile-avatar" />
          <div className="profile-details">
            <h2 className="profile-name">{professor.name}</h2>
            <p className="profile-email">{professor.email}</p>
            <p>ID : {professor.id}</p>
            <p>Subscription : {professor.subscription}</p>
            <p>Status : {professor.status}</p>
            <p>Rating : {professor.rating}</p>
          </div>
        </div>

        <div className="profile-meta">
          <p><strong>Programs Offered :</strong> 5</p>
          <p><strong>Students Enrolled :</strong> 120</p>
          <p><strong>Subscription Start Date :</strong> 19-05-2025</p>
          <p><strong>Subscription End Date :</strong> 19-05-2026</p>
        </div>

        <div className="profile-preferences">
          <p><strong>Preferences:</strong></p>
          <p>Experience: Professional 5+ years</p>
          <p>Dance Styles: Salsa, Bachata, Kizomba</p>
          <p>Teaching: Weekly</p>
          <p>Goal: Build a student base & grow brand</p>
        </div>

        <div className="profile-actions">
          <button className="suspend-btn">Suspend</button>
          <button className="delete-btn">Delete</button>
          <button className="flag-btn">Flag</button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDetailModal;
