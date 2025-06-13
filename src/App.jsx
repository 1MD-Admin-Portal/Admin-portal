// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import OtpPage from "./pages/OtpPage";
// import Home from "./pages/Home";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/otp" element={<OtpPage />} />
//         <Route path="/home" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import OtpPage from "./pages/OtpPage";
import DashboardLayout from "./layouts/DashboardLayout"; // layout with sidebar
import Home from "./pages/Home";
import Users from "./pages/Users";
import Ads from "./pages/Ads";
// Add all other pages here

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OtpPage />} />

        {/* Protected/Admin routes with sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/ads" element={<Ads />} />
          {/* Add all other sidebar-linked pages here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
