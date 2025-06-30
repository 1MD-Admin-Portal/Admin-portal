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
import DashboardLayout from "./layouts/DashboardLayout"; // layout with sidebar
import Home from "./pages/Home";
import Users from "./pages/Users";
import CommunityContent from "./pages/CommunityContent";
import ProgramManagement from "./pages/ProgramManagement";
import Challenges from "./pages/Challenges";
import ClassModeration from "./pages/ClassModeration";
import EventsPage from "./pages/EventsPage";
import MarketplacePage from "./pages/MarketplacePage";
import AdsManagement from "./pages/AdsManagement";
import NotificationPage from "./pages/NotificationPage";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import DancersPage from "./pages/DancersPage";
import ProfessorsPage from "./pages/ProfessorsPage";
import PayoutsPage from "./pages/PayoutsPage";
import AccessLogs from "./pages/AccessLogs";
import VideoPrograms from "./pages/dashboard/VideoPrograms";
import CreateChallenge from "./pages/dashboard/CreateChallenge";
import AppBrandingPage from "./components/AppBrandingPage";
import SubscriptionPlansPage from "./components/SubscriptionPlansPage";
import LegalContentPage from "./components/LegalContentPage";
import AppVersionInfo from "./components/AppVersionInfo";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import AdminProfile from "./pages/AdminProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Protected/Admin routes with sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/CommunityContent" element={<CommunityContent />} />
          <Route path="/ProgramManagement" element={<ProgramManagement />} />
          <Route path="/Challenges" element={<Challenges />} />
          <Route path="/ClassModeration" element={<ClassModeration />} />
          <Route path="/EventsPage" element={<EventsPage />} />
          <Route path="/MarketplacePage" element={<MarketplacePage />} />
          <Route path="/AdsManagement" element={<AdsManagement />} />
          <Route path="/NotificationPage" element={<NotificationPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/SettingsPage" element={<SettingsPage />} />
          <Route path="/users/Dancers" element={<DancersPage />} />
          <Route path="/users/Professors" element={<ProfessorsPage />} />
          <Route path="/PayoutsPage" element={<PayoutsPage />} />
          <Route path="/AccessLogs" element={<AccessLogs />} />
          <Route path="/VideoPrograms" element={<VideoPrograms />} />
          <Route path="/CreateChallenge" element={<CreateChallenge />} />
          <Route path="/settings/app-branding" element={<AppBrandingPage />} />
          <Route path="/settings/subscription-plans" element={<SubscriptionPlansPage />} />
          <Route path="/settings/legal-content" element={<LegalContentPage />} />
          <Route path="/settings/app-version" element={<AppVersionInfo />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
