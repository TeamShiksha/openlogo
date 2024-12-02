import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Demo from "./components/demo/Demo";
import Dashboard from "./Pages/dashboard/Dashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Demo />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
