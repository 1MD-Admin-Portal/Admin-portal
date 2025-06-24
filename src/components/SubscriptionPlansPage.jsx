import React, { useState } from "react";
import { FaPen, FaTrash, FaToggleOn } from "react-icons/fa";
import AddPlanModal from "./AddPlanModal";
import "../styles/SubscriptionPlansPage.css"; // Assuming you have a CSS file for styles
import "../styles/AddPlanModal.css"; // Assuming you have a CSS file for modal styles
const plansData = [
  {
    name: "Danceur",
    monthly: 0,
    yearly: 10,
    features: ["Access basic programs"],
  },
  {
    name: "Ginga",
    monthly: 10,
    features: ["Access all programs"],
  },
  {
    name: "Ginga",
    monthly: 100,
    features: ["Access all programs", "Join premium challenges"],
  },
  {
    name: "Fiver",
    monthly: 200,
    features: ["Access all programs", "Join premium challenges"],
  },
];

const SubscriptionPlansPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <h2>Subscription Plans</h2>
        <button className="add-plan-btn" onClick={() => setShowModal(true)}>
          + Add New Plan
        </button>
      </div>

      <div className="subscription-grid">
        {plansData.map((plan, idx) => (
          <div className="plan-card" key={idx}>
            <div>
              <h3 className="plan-title">{plan.name}</h3>
              <p className="plan-price">Price (Monthly)</p>
              <h2>${plan.monthly}</h2>
              {plan.yearly && (
                <>
                  <p className="plan-price">Price (Yearly)</p>
                  <h2>${plan.yearly}</h2>
                </>
              )}
              <div className="features-list">
                <p>Features Included</p>
                <ul>
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="plan-actions">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
              <div className="icon-buttons">
                <button><FaPen /></button>
                <button><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddPlanModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SubscriptionPlansPage;
