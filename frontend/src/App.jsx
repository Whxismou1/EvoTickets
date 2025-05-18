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
import AdminPage from "./pages/AdminPage";
import ArtistPage from "./pages/ArtistsPage";
import EventManagerPage from "./pages/EventManagerPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import EventsPage from "./pages/EventsPage"
// import EventDetail from "./pages/EventDetail";
import EventCreationPage from "./pages/EventCreationPage";
import EventDetail from "./pages/EventDetails";
import ArtistDashboard from "./pages/ArtistDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />}/>
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyAccount" element={<VerifyAccount />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        {/* <Route path="/event/:id" element={<EventDetail />} /> */}
        <Route path="/eventCreation" element={<EventCreationPage />} />
        <Route path ="/artistpage" element={<ArtistPage/>}/>
        <Route path="/artistDashboard" element={<ArtistDashboard />} />

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
        <Route path="/profile" element={<Profile/>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["ARTIST"]} />}>
          <Route path="/artist" element={<ArtistPage />} />
        </Route>

        <Route
          element={<RoleProtectedRoute allowedRoles={["EVENT_MANAGER"]} />}
        >
          <Route path="/eventManager" element={<EventManagerPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
