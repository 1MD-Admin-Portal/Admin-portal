
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginImage from "../assets/login.jpg";
import { loginService } from "../services/auth.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     const response = await loginService(email, password);
  //     if (response.status === 200) {
  //       alert("Login successful!");
  //       navigate("/home");
  //     } else {
  //       alert("Invalid credentials. Please try again.");
  //     }
  //     return;
  //   }   
  //     alert("Please enter both email and password.");
  // };
  // const handleLogin = () => {
  //   if (email === "test@gmail.com" && password === "test") {
  //     alert("Login successful!");
  //     navigate("/home");
  //   } else {
  //     alert("Invalid credentials.");
  //   }
  // };
  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await loginService(email, password);
    if (response.status === 200) {
      alert("Login successful!");
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
          type="password"
          placeholder="**********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-options">
          <a href="#" onClick={() => navigate("/forgot-password")}>Forgot password</a>
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
