import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Otp.css";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (otp === "123") {
      navigate("/home"); // redirect to home
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <p>OTP has been sent to <strong>{email}</strong></p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify}>Verify OTP</button>
      {error && <p className="otp-error">{error}</p>}
    </div>
  );
};

export default OtpPage;
