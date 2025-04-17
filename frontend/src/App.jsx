import "./App.css";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import VerifyAccount from "./pages/VerifyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyAccountGuard from "./components/VerifyAccountGuard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyAccount" element={<VerifyAccount />} />

        {/* <Route
          path="/verifyAccount"
          element={
            <VerifyAccountGuard>
              <VerifyAccount />
            </VerifyAccountGuard>
          }
        /> */}

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
