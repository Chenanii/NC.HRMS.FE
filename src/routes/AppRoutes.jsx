import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../features/dashboard/pages/Dashboard";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </Router>
  );
}
