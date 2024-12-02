import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import AdminDashboard from "./pages/admin/Admin";
import About from "./pages/about/About";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
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
