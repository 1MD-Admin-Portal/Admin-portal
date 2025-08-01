import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Users from "./pages/Users";
import CommunityContent from "./pages/CommunityContent";
import ProgramManagement from "./pages/ProgramManagement";
import ClassModeration from "./pages/ClassModeration";
import EventsPage from "./pages/EventsPage";
import MarketplacePage from "./pages/MarketplacePage";
import AdsManagement from "./pages/Ads Management/AdsManagement";
import NotificationPage from "./pages/NotificationPage";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import ProfessorsPage from "./pages/applicants/professors/ProfessorsPage";
import PayoutsPage from "./pages/PayoutsPage";
import AccessLogs from "./pages/Access Logs/AccessLogs";
import VideoPrograms from "./pages/dashboard/VideoPrograms";
import CreateChallenge from "./pages/dashboard/CreateChallenge";
import AppBrandingPage from "./components/AppBrandingPage";
import SubscriptionPlansPage from "./components/SubscriptionPlansPage";
import LegalContentPage from "./components/LegalContentPage";
import AppVersionInfo from "./components/AppVersionInfo";
import AdminProfile from "./pages/Admin Profile/AdminProfile";
import ReportManagement from "./pages/ReportManagement";
import DisputesPage from "./pages/earning&payout/Disputes/DisputesPage";
import EarningsPage from "./pages/earning&payout/earning/EarningsPage";
import ClassDisputesPage from "./pages/operation&support/classrelateddispute/ClassDisputesPage";
import TicketRaisePage from "./pages/operation&support/ticketraise/TicketRaisePage";
import OrganizersPage from "./pages/applicants/organizers/OrganizersPage.jsx";
import DJsPage from "./pages/applicants/djs/DJsPage.jsx";
import ProfessorsListPage from "./pages/users/Professors/ProfessorsListPage.jsx";
import OrganizerListPage from "./pages/users/organizers/OrganizerListPage.jsx";
import DJListPage from "./pages/users/djs/DJListPage.jsx";
import DancersList from "./pages/users/dancers/DancersList.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/CommunityContent" element={<CommunityContent />} />
          <Route path="/ProgramManagement" element={<ProgramManagement />} />
          <Route path="/ClassModeration" element={<ClassModeration />} />
          <Route path="/EventsPage" element={<EventsPage />} />
          <Route path="/MarketplacePage" element={<MarketplacePage />} />
          <Route path="/AdsManagement" element={<AdsManagement />} />
          <Route path="/NotificationPage" element={<NotificationPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/SettingsPage" element={<SettingsPage />} />
          <Route path="/Applicants/Professors" element={<ProfessorsPage />} />
          <Route path="/payouts/payouts" element={<PayoutsPage />} />
          <Route path="/payouts/disputes" element={<DisputesPage />} />
          <Route path="/payouts/earnings" element={<EarningsPage />} />
          <Route
            path="/support/class-disputes"
            element={<ClassDisputesPage />}
          />
          <Route path="/AccessLogs" element={<AccessLogs />} />
          <Route path="/support/ticket-raise" element={<TicketRaisePage />} />
          <Route path="/VideoPrograms" element={<VideoPrograms />} />
          <Route path="/CreateChallenge" element={<CreateChallenge />} />
          <Route path="/settings/app-branding" element={<AppBrandingPage />} />
          <Route
            path="/settings/subscription-plans"
            element={<SubscriptionPlansPage />}
          />
          <Route
            path="/settings/legal-content"
            element={<LegalContentPage />}
          />
          <Route path="/settings/app-version" element={<AppVersionInfo />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/ReportManagement" element={<ReportManagement />} />
          <Route path="/Applicants/Organizers" element={<OrganizersPage />} />
          <Route path="/Applicants/DJs" element={<DJsPage />} />
          <Route path="/users/Professors" element={<ProfessorsListPage />} />
          <Route path="/users/Organizers" element={<OrganizerListPage />} />
          <Route path="/users/DJs" element={<DJListPage />} />
          <Route path="/users/Dancers" element={<DancersList />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
