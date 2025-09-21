import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { resetPasswordService } from "../../../services/auth.service";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [step, setStep] = useState(1); // 1: OTP + passwords, 2: success
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect to forgot password if no email is provided
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const validateForm = () => {
    const errors = {};

    if (!formData.otp) {
      errors.otp = "OTP is required";
    } else if (formData.otp.length !== 5) {
      errors.otp = "OTP must be 5 digits";
    }

    if (!formData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await resetPasswordService(
        email,
        formData.otp,
        formData.newPassword
      );

      if (response.status === 200) {
        setStep(2);
        // Redirect to login after showing success message
        setTimeout(() => {
          navigate("/", {
            state: {
              message:
                "Password reset successful! Please login with your new password.",
            },
          });
        }, 3000);
      } else {
        setError(
          response.data?.message ||
            "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.response?.status === 400) {
        setError(
          error.response.data?.message ||
            "Invalid OTP or request. Please try again."
        );
      } else if (error.response?.status === 404) {
        setError("Invalid reset request. Please start the process again.");
      } else if (error.response?.status === 410) {
        setError("Reset link has expired. Please request a new one.");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/forgot-password");
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 1, label: "Weak" };
    if (
      password.length < 8 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    ) {
      return { strength: 2, label: "Fair" };
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return { strength: 3, label: "Good" };
    }
    return { strength: 4, label: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="reset-password-header">
          <h2>Reset Password</h2>
          {step === 1 && (
            <p>
              Enter the OTP sent to <strong>{email}</strong> and create a new
              password.
            </p>
          )}
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="input-group">
              <label htmlFor="otp">Verification Code</label>
              <div
                className={`input-wrapper otp-wrapper ${
                  fieldErrors.otp ? "error" : ""
                }`}
              >
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 5-digit OTP"
                  value={formData.otp}
                  onChange={(e) =>
                    handleInputChange(
                      "otp",
                      e.target.value.replace(/\D/g, "").slice(0, 5)
                    )
                  }
                  disabled={isLoading}
                  maxLength={5}
                />
              </div>
              {fieldErrors.otp && (
                <span className="field-error">{fieldErrors.otp}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <div
                className={`input-wrapper ${
                  fieldErrors.newPassword ? "error" : ""
                }`}
              >
                <Lock size={18} className="input-icon" />
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill strength-${passwordStrength.strength}`}
                      style={{
                        width: `${(passwordStrength.strength / 4) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`strength-label strength-${passwordStrength.strength}`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}

              {fieldErrors.newPassword && (
                <span className="field-error">{fieldErrors.newPassword}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div
                className={`input-wrapper ${
                  fieldErrors.confirmPassword ? "error" : ""
                }`}
              >
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span className="field-error">
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="reset-password-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="success-message">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h3>Password Reset Successful!</h3>
            <p>Your password has been updated successfully.</p>
            <p className="redirect-info">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
