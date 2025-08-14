import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
