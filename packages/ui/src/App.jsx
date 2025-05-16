import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import AdminDashboard from "./page/admin/Admin";
import Home from "./page/home/Home";
import Dashboard from "./page/dashboard/Dashboard";
import Footer from "./components/footer/Footer";
import AuthModal from "./components/auth/Auth";
import PrivacyPolicy from "./page/privacypolicy/PrivacyPolicy";
import Documentation from "./page/documentation/Documentation";
import ScrollManager from "./components/common/ScrollManager";
import ProtectedRoute from "./utils/ProtectedRoute";
import VerifyEmail from "./components/verification/VerifyEmail";

function App() {
  const [authModal, setAuthModal] = useState(false);
  const openCloseAuthModal = () => {
    setAuthModal(!authModal);
  };

  return (
    <div className="app-container">
      <ScrollManager />
      <Header openAuthModal={openCloseAuthModal} />
      <div className="content-wrapper">
        <Routes>
          <Route
            path="/"
            element={<Home openAuthModal={openCloseAuthModal} />}
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute adminOnly={false}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
      <AuthModal isOpen={authModal} onClose={openCloseAuthModal} />
    </div>
  );
}

export default App;
