import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { resetPasswordService } from "../../../services/auth.service";
import "../login/Login.css";

/* ── Reuse same particle canvas ──────────────────────────── */
const PALETTE = [
  [168,  85, 247],
  [139,  92, 246],
  [192, 132, 252],
  [99,  102, 241],
  [236, 200, 255],
];
const COUNT = 90;
function rand(a, b) { return a + Math.random() * (b - a); }
function mkParticle(W, H) {
  const size = rand(1, 3.5);
  const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return { x: rand(0, W), y: rand(0, H), vx: rand(-0.18, 0.18), vy: rand(-0.25, -0.05), size, r, g, b, alpha: rand(0.3, 0.9), dAlpha: rand(0.003, 0.009) * (Math.random() < 0.5 ? 1 : -1) };
}
const StarField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, W, H, particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function init() { resize(); particles = Array.from({ length: COUNT }, () => mkParticle(W, H)); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha += p.dAlpha;
        if (p.alpha >= 0.95 || p.alpha <= 0.05) p.dAlpha *= -1;
        if (p.y < -20 || p.x < -20 || p.x > W + 20) { particles[i] = mkParticle(W, H); particles[i].y = H + 10; continue; }
        const a = Math.max(0, Math.min(1, p.alpha));
        const haloR = p.size * 5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${(a * 0.25).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(${p.r},${p.g},${p.b},${(a * 0.08).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${a.toFixed(3)})`; ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    init(); draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} id="login-stars-canvas" aria-hidden="true" />;
};

/* ── ResetPassword Component ─────────────────────────────── */
const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ otp: "", newPassword: "", confirmPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  if (!email) { navigate("/forgot-password"); return null; }

  const validateForm = () => {
    const errors = {};
    if (!formData.otp) errors.otp = "OTP is required";
    else if (formData.otp.length !== 5) errors.otp = "OTP must be 5 digits";
    if (!formData.newPassword) errors.newPassword = "New password is required";
    else if (formData.newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) errors.newPassword = "Password must contain uppercase, lowercase, and number";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (formData.newPassword !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await resetPasswordService(email, formData.otp, formData.newPassword);
      if (response.status === 200) {
        setStep(2);
        setTimeout(() => navigate("/", { state: { message: "Password reset successful! Please login with your new password." } }), 3000);
      } else {
        setError(response.data?.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 400) setError(err.response.data?.message || "Invalid OTP. Please try again.");
      else if (err.response?.status === 410) setError("Reset link expired. Please request a new one.");
      else setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 1, label: "Weak" };
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 2, label: "Fair" };
    if (!/(?=.*[!@#$%^&*])/.test(password)) return { strength: 3, label: "Good" };
    return { strength: 4, label: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <>
      <StarField />
      <div className="reset-password-container">
        <div className="reset-password-box">
          <button className="back-button" onClick={() => navigate("/forgot-password")}>
            <ArrowLeft size={18} /> Back
          </button>

          <div className="reset-password-header">
            <h2>Reset Password</h2>
            {step === 1 && <p>Enter the OTP sent to <strong style={{color:'rgba(255,255,255,0.8)'}}>{email}</strong> and create a new password.</p>}
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="login-input-group">
                <label htmlFor="otp">Verification Code</label>
                <div className={`input-wrapper otp-wrapper ${fieldErrors.otp ? "error" : ""}`}>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 5-digit OTP"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, "").slice(0, 5))}
                    disabled={isLoading}
                    maxLength={5}
                  />
                </div>
                {fieldErrors.otp && <span className="field-error">{fieldErrors.otp}</span>}
              </div>

              <div className="login-input-group">
                <label htmlFor="newPassword">New Password</label>
                <div className={`input-wrapper ${fieldErrors.newPassword ? "error" : ""}`}>
                  <Lock size={18} className="input-icon" />
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    disabled={isLoading}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)} disabled={isLoading}>
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div className={`strength-fill strength-${passwordStrength.strength}`} style={{ width: `${(passwordStrength.strength / 4) * 100}%` }} />
                    </div>
                    <span className={`strength-label strength-${passwordStrength.strength}`}>{passwordStrength.label}</span>
                  </div>
                )}
                {fieldErrors.newPassword && <span className="field-error">{fieldErrors.newPassword}</span>}
              </div>

              <div className="login-input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`input-wrapper ${fieldErrors.confirmPassword ? "error" : ""}`}>
                  <Lock size={18} className="input-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    disabled={isLoading}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
              </div>

              <button type="submit" className="reset-password-button" disabled={isLoading}>
                {isLoading ? <><Loader2 size={18} className="spinner" /> Resetting...</> : "Reset Password"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="success-message">
              <div className="success-icon"><CheckCircle size={48} /></div>
              <h3>Password Reset Successful!</h3>
              <p>Your password has been updated successfully.</p>
              <p className="redirect-info">Redirecting to login page...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;