import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Demo from "./components/demo/Demo";
import HeroSection from "./components/HeroSection/HeroSection";
import AdminDashboard from "./pages/admin/Admin";
import About from "./pages/about/About";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
export default App;
