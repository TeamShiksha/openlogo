import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import AdminDashboard from "./page/admin/Admin";
import Home from "./page/home/Home";
import Dashboard from "./page/dashboard/Dashboard";
import Footer from "./components/footer/Footer";
import AuthModal from "./components/auth/Auth";
import PrivacyPolicy from "./page/privacypolicy/PrivacyPolicy";
import Analytics from "./components/analytics/Analytics";
import Documentation from "./page/documentation/Documentation";
import ScrollManager from "./components/common/ScrollManager";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  const [authModal, setAuthModal] = useState(false);
  const openCloseAuthModal = () => {
    setAuthModal(!authModal);
  };

  return (
    <div className="app-container">
      <ScrollManager />
      <Header openAuthModal={openCloseAuthModal} />
      <Routes>
        <Route path="/" element={<Home openAuthModal={openCloseAuthModal} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <AuthModal isOpen={authModal} onClose={openCloseAuthModal} />
    </div>
  );
}

export default App;
