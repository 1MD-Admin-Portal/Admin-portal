import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import "./Login.css";
import loginImage from "../../../assets/login.jpg";
import { loginService } from "../../../services/auth.service";
import { useAuth } from "../../../contexts/AuthContext";

/* ── Particle system — exact port of golden-preview, purple/pink palette ── */

// Mirror the golden preview's palette exactly, colours swapped to theme
const PALETTE = [
  [168,  85, 247],  // purple-500   ← amber-400 equivalent
  [139,  92, 246],  // violet-500   ← amber-500 equivalent
  [192, 132, 252],  // purple-300   ← amber-300 (lighter highlight)
  [99,  102, 241],  // indigo-500   ← amber-600 (deeper anchor)
  [236, 200, 255],  // lavender     ← champagne  (pale shimmer)
];
const COUNT = 90; // identical to preview

function rand(a, b) { return a + Math.random() * (b - a); } // same helper name

function mkParticle(W, H) {                                  // same name as preview
  const size = rand(1, 3.5);                                 // exact range from preview
  const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return {
    x:      rand(0, W),
    y:      rand(0, H),
    vx:     rand(-0.18, 0.18),                               // exact from preview
    vy:     rand(-0.25, -0.05),                              // exact upward drift
    size,
    r, g, b,
    alpha:  rand(0.3, 0.9),                                  // exact from preview
    dAlpha: rand(0.003, 0.009) * (Math.random() < 0.5 ? 1 : -1),
  };
}

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;
    let particles = [];

    // exact resize pattern from preview
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => mkParticle(W, H));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // iterate backwards — exact loop style from preview
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dAlpha;

        // exact clamp thresholds from preview
        if (p.alpha >= 0.95 || p.alpha <= 0.05) p.dAlpha *= -1;

        // reset if drifted offscreen — exact condition from preview
        if (p.y < -20 || p.x < -20 || p.x > W + 20) {
          particles[i] = mkParticle(W, H);
          particles[i].y = H + 10;
          continue;
        }

        const a = Math.max(0, Math.min(1, p.alpha));

        // ① Outer glow halo — exact multiplier & stops from preview
        const haloR = p.size * 5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        grad.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},${(a * 0.25).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(${p.r},${p.g},${p.b},${(a * 0.08).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${p.r},${p.g},${p.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // ② Core dot — exact from preview
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${a.toFixed(3)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    // exact resize listener from preview
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="login-stars-canvas" aria-hidden="true" />;
};

/* ── Login Component ──────────────────────────────────────── */
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await loginService(formData.email, formData.password);
      if (response.status === 200 && response.data?.token) {
        login(response.data.token);
        navigate("/home");
      } else {
        setError(response.data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Please check your credentials.");
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StarField />
      <div className="login-page-wrap">
        {/* ── Form Panel ── */}
        <div className="login-form">

          {/* ── Glass Card ── */}
          <div className="login-glass-card">
            <div className="login-card-label">One Trillion Dancers</div>

            <div className="login-header">
              <h2>Welcome</h2>
              <p>Step back into the spotlight — enter your details.</p>
            </div>

            {error && (
              <div className="error-alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form-content">
              {/* Email */}
              <div className="login-input-group">
                <label htmlFor="email">Email</label>
                <div className={`input-wrapper ${fieldErrors.email ? "error" : ""}`}>
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="login-input-group">
                <label htmlFor="password">Password</label>
                <div className={`input-wrapper ${fieldErrors.password ? "error" : ""}`}>
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="field-error">{fieldErrors.password}</span>
                )}
              </div>

              {/* Options row */}
              <div className="login-options">
                {/* <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark" />
                  Remember me
                </label> */}
                <span
                  className="forgot-link"
                  onClick={() => navigate("/forgot-password")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/forgot-password")}
                >
                  Forgot password?
                </span>
              </div>

              {/* Submit */}
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
          {/* ── End Glass Card ── */}

        </div>

        {/* ── Image Panel ── */}
        <div className="login-image">
          <img src={loginImage} alt="Dance performance" />
          <div className="image-overlay">
            <h3>Where Movement Meets Mastery</h3>
            <p>Manage your studio, track progress, and elevate every performance.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;