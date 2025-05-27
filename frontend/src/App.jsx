import "./App.css";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import VerifyAccount from "./pages/VerifyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import VerifyAccountGuard from "./components/VerifyAccountGuard";
import NotFound from "./pages/NotFound";
import ArtistPage from "./pages/ArtistsPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import EventsPage from "./pages/EventsPage";
import EventCreationPage from "./pages/EventCreationPage";
import EventDetail from "./pages/EventDetails";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import WorkWithUsPage from "./pages/WorkWithUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ArtistPublicProfile from "./pages/ArtistPublicProfile";

import ArtistDashboard from "./pages/ArtistDashboard";
import EventManagerDashboard from "./pages/EventManagerDashboard";
import RegisterManagerPage from "./pages/RegisterManagerPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/PrivacyPolicyPage" element={<PrivacyPolicyPage />} />
        <Route path="/TermsPage" element={<TermsPage />} />
        <Route path="/WorkWithUsPage" element={<WorkWithUsPage />} />
        <Route path="/AboutUsPage" element={<AboutUsPage />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/HelpCenterPage" element={<HelpCenterPage />} />
        <Route path="/artists" element={<ArtistPage />} />
        <Route path="/artists/:id" element={<ArtistPublicProfile />} />
        <Route path="/register-manager" element={<RegisterManagerPage />} />

        <Route
          path="/verifyAccount"
          element={
            <VerifyAccountGuard>
              <VerifyAccount />
            </VerifyAccountGuard>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}
        ></Route>

        <Route element={<RoleProtectedRoute allowedRoles={["ARTIST"]} />}>
        </Route>
          <Route path="/artistDashboard" element={<ArtistDashboard />} />

          <Route path="/eventCreation" element={<EventCreationPage />} />
        <Route
          element={<RoleProtectedRoute allowedRoles={["EVENT_MANAGER"]} />}
        >

          <Route
            path="/eventManagerDashboard"
            element={<EventManagerDashboard />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
