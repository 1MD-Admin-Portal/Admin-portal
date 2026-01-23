import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { forgotPasswordService } from "../../../services/auth.service";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: success message
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear general error
    if (error) setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await forgotPasswordService(formData.email);

      if (response.status === 200) {
        setStep(2);
        // Navigate to reset password with email after a short delay
        setTimeout(() => {
          navigate("/reset-password", {
            state: { email: formData.email },
          });
        }, 2000);
      } else {
        setError(
          response.data?.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.response?.status === 404) {
        setError("Email not found. Please check your email address.");
      } else if (error.response?.status === 429) {
        setError(
          "Too many requests. Please wait a moment before trying again."
        );
      } else {
        setError(
          error.response?.data?.message ||
          "Failed to send OTP. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <div className="forgot-header">
          <h2>Forgot Password</h2>
          {step === 1 && <p>No worries, we'll send you reset instructions.</p>}
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="forgot-form">
            <div className="login-input-group">
              <label htmlFor="email">Email</label>
              <div
                className={`input-wrapper ${fieldErrors.email ? "error" : ""}`}
              >
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>

            <button
              type="submit"
              className="forgot-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Sending OTP...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="success-message">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h3>Check your email</h3>
            <p>
              We sent a reset link to <strong>{formData.email}</strong>
            </p>
            <p className="redirect-info">
              Redirecting to reset password page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
