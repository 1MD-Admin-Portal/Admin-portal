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

  // Handle modal open/close body scroll
  useEffect(() => {
    if (showChangePassword) {
      document.body.classList.add("admin-profile-modal-open");
    } else {
      document.body.classList.remove("admin-profile-modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("admin-profile-modal-open");
    };
  }, [showChangePassword]);

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
        name: user?.name || user?.username || "Admin",
        email: user?.email || "admin@example.com",
        role: user?.role || "Admin",
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

  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelChangePassword();
    }
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
    <>
      <div className="admin-profile-container">
        <div className="admin-profile-header">
          <h2 className="admin-profile-title">Admin Profile</h2>
          <button
            className="admin-profile-change-password-trigger"
            onClick={() => setShowChangePassword(true)}
            disabled={showChangePassword}
          >
            <Edit3 size={18} />
            Change Password
          </button>
        </div>

        <div className="admin-profile-content">
          <div className="admin-profile-card">
            {profileLoading ? (
              <div className="admin-profile-loading">
                <Loader2 size={40} className="admin-profile-spinner" />
                <p>Loading profile...</p>
              </div>
            ) : (
              <>
                <div className="admin-profile-avatar">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.name
                    )}&size=120&background=667eea&color=ffffff&bold=true`}
                    alt="Admin Avatar"
                  />
                  <div className="admin-profile-avatar-badge">
                    <Shield size={16} />
                  </div>
                </div>

                <div className="admin-profile-info">
                  <div className="admin-profile-info-item">
                    <User className="admin-profile-info-icon" size={18} />
                    <div>
                      <span className="admin-profile-info-label">Name</span>
                      <span className="admin-profile-info-value">
                        {profileData.name}
                      </span>
                    </div>
                  </div>

                  <div className="admin-profile-info-item">
                    <Mail className="admin-profile-info-icon" size={18} />
                    <div>
                      <span className="admin-profile-info-label">Email</span>
                      <span className="admin-profile-info-value">
                        {profileData.email}
                      </span>
                    </div>
                  </div>

                  <div className="admin-profile-info-item">
                    <Shield className="admin-profile-info-icon" size={18} />
                    <div>
                      <span className="admin-profile-info-label">Role</span>
                      <span className="admin-profile-info-value admin-profile-role-badge">
                        {profileData.role}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Overlay for Change Password */}
      {showChangePassword && (
        <div
          className={`admin-profile-modal-overlay ${
            showChangePassword ? "active" : ""
          }`}
          onClick={handleModalOverlayClick}
        >
          <div className="admin-profile-change-password-modal">
            <div className="admin-profile-modal-header">
              <div className="admin-profile-modal-header-content">
                <Lock className="admin-profile-modal-header-icon" size={20} />
                <h3 className="admin-profile-modal-title">Change Password</h3>
              </div>
              <button
                className="admin-profile-modal-close-button"
                onClick={handleCancelChangePassword}
                disabled={isLoading}
              >
                <X size={18} />
              </button>
            </div>

            {message.text && (
              <div className={`admin-profile-message ${message.type}`}>
                {message.type === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form
              onSubmit={handleChangePassword}
              className="admin-profile-password-form"
            >
              <div className="admin-profile-form-group">
                <label>Current Password</label>
                <div
                  className={`admin-profile-password-input-wrapper ${
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
                    className="admin-profile-password-toggle-btn"
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
                  <span className="admin-profile-field-error">
                    {fieldErrors.currentPassword}
                  </span>
                )}
              </div>

              <div className="admin-profile-form-group">
                <label>New Password</label>
                <div
                  className={`admin-profile-password-input-wrapper ${
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
                    className="admin-profile-password-toggle-btn"
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
                  <div className="admin-profile-password-strength">
                    <div className="admin-profile-strength-bar">
                      <div
                        className={`admin-profile-strength-fill admin-profile-strength-${passwordStrength.strength}`}
                        style={{
                          width: `${(passwordStrength.strength / 4) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span
                      className={`admin-profile-strength-label admin-profile-strength-${passwordStrength.strength}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}

                {fieldErrors.newPassword && (
                  <span className="admin-profile-field-error">
                    {fieldErrors.newPassword}
                  </span>
                )}
              </div>

              <div className="admin-profile-form-group">
                <label>Confirm New Password</label>
                <div
                  className={`admin-profile-password-input-wrapper ${
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
                    className="admin-profile-password-toggle-btn"
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
                  <span className="admin-profile-field-error">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="admin-profile-form-actions">
                <button
                  type="button"
                  className="admin-profile-cancel-btn"
                  onClick={handleCancelChangePassword}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-profile-save-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="admin-profile-spinner" />
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
        </div>
      )}
    </>
  );
};

export default AdminProfile;
