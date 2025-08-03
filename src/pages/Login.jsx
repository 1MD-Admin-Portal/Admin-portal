import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginImage from "../assets/login.jpg";
import { loginService } from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 new state
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await loginService(email, password);
      if (response.status === 200 && response.data?.token) {
        login(response.data.token);
        navigate("/home");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      alert("Login failed. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome back</h2>
        <p>Welcome back! Please enter your details.</p>

        <label>Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type={showPassword ? "text" : "password"} // 👈 toggle input type
          placeholder="**********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1rem",
          }}
        >
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        <div className="login-options">
          <span
            className="forgot-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password
          </span>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Sign in
        </button>
      </div>

      <div className="login-image">
        <img src={loginImage} alt="Login Visual" />
      </div>
    </div>
  );
};

export default Login;
