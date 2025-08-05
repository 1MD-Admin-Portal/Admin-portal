import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ChangePassword.css"; // new CSS file

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    alert(`Password changed for ${email}. Please login again.`);
    navigate("/");
  };

  return (
    <div className="change-password-container">
      <div className="change-password-box">
        <h2>Change Password</h2>

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="change-password-button" onClick={handleSubmit}>
          Submit
        </button>
        {error && <p className="otp-error">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;
