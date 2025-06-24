// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Login.css";
// import loginImage from "../assets/login.jpg";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleForgotPassword = () => {
//     if (!email) {
//       alert("Please enter your email first.");
//       return;
//     }

//     if (email !== "test@gmail.com") {
//       alert("No account associated with this email.");
//       return;
//     }

//     alert("OTP sent to your email.");
//     navigate("/otp", { state: { email } });
//   };

//   const handleLogin = () => {
//     if (email === "test@gmail.com" && password === "test") {
//       alert("Login successful!");
//       navigate("/home");
//     } else {
//       alert("Invalid credentials.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <h2>Welcome back</h2>
//         <p>Welcome back! Please enter your details.</p>

//         <label>Email</label>
//         <input
//           type="text"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <label>Password</label>
//         <input
//           type="password"
//           placeholder="**********"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <div className="login-options">
//           <a href="#" onClick={handleForgotPassword}>Forgot password</a>
//         </div>

//         <button className="login-button" onClick={handleLogin}>
//           Sign in
//         </button>
//       </div>

//       <div className="login-image">
//         <img src={loginImage} alt="Login Visual" />
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginImage from "../assets/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "test@gmail.com" && password === "test") {
      alert("Login successful!");
      navigate("/home");
    } else {
      alert("Invalid credentials.");
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
