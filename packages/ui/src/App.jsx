import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import AdminDashboard from "./page/admin/Admin";
import About from "./page/about/About";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./page/home/Home";
import Dashboard from "./page/dashboard/Dashboard";
import Footer from "./components/footer/Footer";
import PrivacyPolicy from "./page/privacypolicy/PrivacyPolicy";
// import Analytics from "./components/analytics/Analytics";
import Documentation from "./page/documentation/Documentation.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import { useContext } from "react";
import { AuthContext } from "./contexts/Contexts";
import AuthModal from "./components/auth/Auth";

function App() {
  const { signupModal, setSignupModal } = useContext(AuthContext);

  return (
    <div className="app-container">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/docs" element={<Documentation />} />
        {/* <Route path="/analytics" element={<Analytics />} /> */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <AuthModal isOpen={signupModal} onClose={() => setSignupModal(false)} />
      <Footer />
    </div>
  );
}
export default App;
