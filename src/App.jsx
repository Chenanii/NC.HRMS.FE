import { Container } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import Register from './features/auth/pages/Register'; 
import LandingPage from './features/home/LandingPage'; 
import EmailSent from './features/auth/pages/Email-Sent'; 
import EmailConfirm from './features/auth/pages/Email-Confirm'; 
import Employees from './features/dashboard/pages/management/Employees';
import Departments from './features/dashboard/pages/management/Departments';
import Positions from './features/dashboard/pages/management/Positions';
import DashboardContent from './features/dashboard/components/DashboardContent';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// Dashboard routes
import Dashboard from './features/dashboard/pages/Dashboard';

// User management routes
import UserListPage from './features/users/pages/UserListPage';
import UserForm from './features/users/components/UserForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Container size="sm" mt="xl">
              <LandingPage />
            </Container>
          }
        />
        <Route
          path="/register"
          element={
            <Container size="sm" mt="xl">
              <Register />
            </Container>
          }
        />
        <Route
          path="/login"
          element={
            <Container size="sm" mt="xl">
              <LoginPage />
            </Container>
          }
        />
        <Route
          path="/email-sent"
          element={
            <Container size="sm" mt="xl">
              <EmailSent />
            </Container>
          }
        />
        <Route
          path="/email-confirm"
          element={
            <Container size="sm" mt="xl">
              <EmailConfirm />
            </Container>
          }
        />

        {/* Protected routes (after login) */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* index route for /dashboard */}
          <Route index element={ <DashboardContent/>  } />

          {/* Nested management routes */}
          <Route path="management/employees" element={<Employees />} />
          <Route path="management/departments" element={<Departments />} />
          <Route path="management/positions" element={<Positions />} />

          {/* User management routes inside dashboard */}
          <Route path="users" element={<UserListPage />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm isEdit={true} />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
