import React, { useState } from "react";
import "../styles/AddPlanModal.css";

const AddPlanModal = ({ onClose }) => {
  const [planName, setPlanName] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [features, setFeatures] = useState([""]);

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlan = {
      name: planName,
      monthly: parseFloat(monthlyPrice),
      yearly: yearlyPrice ? parseFloat(yearlyPrice) : undefined,
      features: features.filter((f) => f.trim() !== ""),
    };
    console.log("New Plan Submitted:", newPlan);
    onClose(); // Close modal after submit
  };

  return (
    <div className="modal-overlay">
      <div className="add-plan-modal">
        <div className="modal-header">
          <h2>Add New Plan</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <label>Plan Name</label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
          />

          <label>Monthly Price ($)</label>
          <input
            type="number"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(e.target.value)}
            required
          />

          <label>Yearly Price ($)</label>
          <input
            type="number"
            value={yearlyPrice}
            onChange={(e) => setYearlyPrice(e.target.value)}
          />

          <label>Features</label>
          {features.map((feature, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Feature ${idx + 1}`}
              value={feature}
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
              required
            />
          ))}
          <button type="button" className="add-feature-btn" onClick={addFeatureField}>
            + Add Feature
          </button>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Plan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlanModal;
