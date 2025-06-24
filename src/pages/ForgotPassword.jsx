import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (email !== "test@gmail.com") {
      alert("No account associated with this email.");
      return;
    }

    alert("OTP sent to your email.");
    setShowOtpBox(true);
  };

  const handleVerifyOtp = () => {
    if (otp === "123") {
      alert("OTP verified!");
      navigate("/change-password", { state: { email } });
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Forgot Password</h2>

        {!showOtpBox && (
          <>
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="forgot-button" onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        )}

        {showOtpBox && (
          <>
            <p className="otp-info">
              OTP has been sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="forgot-button" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
            {error && <p className="otp-error">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
