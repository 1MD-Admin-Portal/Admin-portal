
import { useLocation } from "react-router-dom";
import "../styles/Otp.css";

const OtpPage = () => {
  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <p>OTP has been sent to <strong>{email}</strong></p>
      <input type="text" placeholder="Enter OTP" />
      <button>Verify OTP</button>
    </div>
  );
};

export default OtpPage;
