import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPen, FaTrash, FaArrowLeft, FaPlus, FaCheck, FaClipboardList } from "react-icons/fa";
import AddPlanModal from "./AddPlanModal";
import "../styles/SubscriptionPlansPage.css";
import "../styles/AddPlanModal.css";

const plansData = [
  {
    name: "Danceur",
    monthly: 0,
    yearly: 10,
    features: ["Access basic programs"],
    color: "blue",
  },
  {
    name: "Ginga",
    monthly: 10,
    features: ["Access all programs"],
    color: "purple",
  },
  {
    name: "Ginga Premium",
    monthly: 100,
    features: ["Access all programs", "Join premium challenges"],
    color: "purple",
  },
  {
    name: "Fiver",
    monthly: 200,
    features: ["Access all programs", "Join premium challenges", "Priority support"],
    color: "pink",
  },
];

const SubscriptionPlansPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activePlans, setActivePlans] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
  });

  const togglePlan = (idx) => {
    setActivePlans((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="subscription-page">
      <button className="back-button" onClick={() => navigate("/SettingsPage")}>
        <FaArrowLeft /> Back to Settings
      </button>

      <div className="subscription-header">
        <div className="subscription-header-content">
          <div className="subscription-icon-wrapper">
            <FaClipboardList />
          </div>
          <div>
            <h1 className="subscription-title">Subscription Plans</h1>
            <p className="subscription-subtitle">Manage subscription tiers and pricing</p>
          </div>
        </div>
        <button className="add-plan-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add New Plan
        </button>
      </div>

      <div className="subscription-grid">
        {plansData.map((plan, idx) => (
          <div className={`plan-card plan-card-${plan.color}`} key={idx}>
            <div className="plan-card-header">
              <div className="plan-badge">{plan.name}</div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={activePlans[idx]}
                  onChange={() => togglePlan(idx)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="plan-pricing">
              <div className="plan-price-section">
                <span className="plan-price-label">Monthly</span>
                <div className="plan-price-amount">${plan.monthly}</div>
              </div>
              {plan.yearly !== undefined && (
                <div className="plan-price-section">
                  <span className="plan-price-label">Yearly</span>
                  <div className="plan-price-amount">${plan.yearly}</div>
                </div>
              )}
            </div>

            <div className="plan-features">
              <h4 className="features-title">Features Included</h4>
              <ul className="features-list">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <FaCheck className="feature-check" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="plan-actions">
              <button className="plan-action-btn plan-edit-btn">
                <FaPen /> Edit
              </button>
              <button className="plan-action-btn plan-delete-btn">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddPlanModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SubscriptionPlansPage;
