import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit3,
} from "lucide-react";
import "./AdminProfile.css";
import {
  changePasswordService,
  profileService,
} from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";

const AdminProfile = () => {
  const { user } = useAuth(); // Get user data from context
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Loading...",
    email: "Loading...",
    role: "Loading...",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setProfileLoading(true);
      const response = await profileService();

      if (response.status === 200 && response.data) {
        setProfileData({
          name: response.data.name || response.data.username || "Admin User",
          email: response.data.email || "admin@local.com",
          role: response.data.role || "Super Admin",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      // Use fallback data or user context data
      setProfileData({
        name: user?.name || user?.username || "Admin User",
        email: user?.email || "admin@local.com",
        role: user?.role || "Super Admin",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)
    ) {
      errors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword =
        "New password must be different from current password";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear message
    if (message.text) setMessage({ type: "", text: "" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await changePasswordService(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (response.status === 200) {
        setMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({ current: false, new: false, confirm: false });

        // Auto-hide form after success
        setTimeout(() => {
          setShowChangePassword(false);
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: response.data?.message || "Failed to change password",
        });
      }
    } catch (error) {
      console.error("Change password error:", error);

      if (error.response?.status === 400) {
        setMessage({
          type: "error",
          text: "Current password is incorrect",
        });
      } else if (error.response?.status === 401) {
        setMessage({
          type: "error",
          text: "Session expired. Please login again.",
        });
      } else {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Failed to change password. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setFieldErrors({});
    setMessage({ type: "", text: "" });
    setShowPasswords({ current: false, new: false, confirm: false });
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

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="admin-profile-page-container">
      <div className="profile-header">
        <h2>Admin Profile</h2>
        <button
          className="change-password-trigger"
          onClick={() => setShowChangePassword(true)}
          disabled={showChangePassword}
        >
          <Edit3 size={18} />
          Change Password
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card-container">
          {profileLoading ? (
            <div className="profile-loading">
              <Loader2 size={40} className="spinner" />
              <p>Loading profile...</p>
            </div>
          ) : (
            <>
              <div className="profile-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileData.name
                  )}&size=120&background=667eea&color=ffffff&bold=true`}
                  alt="Admin Avatar"
                />
                <div className="avatar-badge">
                  <Shield size={16} />
                </div>
              </div>

              <div className="profile-info">
                <div className="info-item">
                  <User className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Name</span>
                    <span className="info-value">{profileData.name}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Mail className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{profileData.email}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Shield className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Role</span>
                    <span className="info-value role-badge">
                      {profileData.role}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {showChangePassword && (
          <div className="change-password-card">
            <div className="card-header">
              <div className="header-content">
                <Lock className="header-icon" size={20} />
                <h3>Change Password</h3>
              </div>
              <button
                className="close-button"
                onClick={handleCancelChangePassword}
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <div
                  className={`password-input-wrapper ${
                    fieldErrors.currentPassword ? "error" : ""
                  }`}
                >
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "currentPassword",
                        e.target.value
                      )
                    }
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility("current")}
                    disabled={isLoading}
                  >
                    {showPasswords.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {fieldErrors.currentPassword && (
                  <span className="field-error">
                    {fieldErrors.currentPassword}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div
                  className={`password-input-wrapper ${
                    fieldErrors.newPassword ? "error" : ""
                  }`}
                >
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      handlePasswordInputChange("newPassword", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility("new")}
                    disabled={isLoading}
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {passwordForm.newPassword && (
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

              <div className="form-group">
                <label>Confirm New Password</label>
                <div
                  className={`password-input-wrapper ${
                    fieldErrors.confirmPassword ? "error" : ""
                  }`}
                >
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility("confirm")}
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? (
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

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelChangePassword}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="spinner" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
