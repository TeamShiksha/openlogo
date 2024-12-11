import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import AdminDashboard from "./pages/admin/Admin";
import About from "./pages/about/About";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/home/Home";
import "./App.css";
import Dashboard from "./Pages/dashboard/Dashboard";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
    </div>
  );
}

export default App;
