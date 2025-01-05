import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import AdminDashboard from "./page/admin/Admin";
import About from "./page/about/About";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./page/home/Home";
import Dashboard from "./page/dashboard/Dashboard";
import Footer from "./components/footer/Footer";
import PrivacyPolicy from "./page/privacypolicy/PrivacyPolicy";
import SettingsPage from "./components/settingsPage/SettingsPage";
// import Analytics from "./components/analytics/Analytics";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/profile" element={<SettingsPage />} />
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
      <Footer />
    </div>
  );
}
export default App;
