import { Container } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import Register from './features/auth/pages/Register'; 
import LandingPage from './features/home/LandingPage'; 
import EmailSent from './features/auth/pages/Email-Sent'; 
import EmailConfirm from './features/auth/pages/Email-Confirm'; 
import Employees from './features/management/pages/Employees';
import Departments from './features/management/pages/Departments';
import Positions from './features/management/pages/Positions';
import LeaveTypes from './features/leave/pages/leave-types';
import LeaveRequests from './features/leave/pages/leave-requests';
import RequestLeave from './features/leave/pages/request-leave';
import MyLeaveRequests from './features/leave/pages/my-leave-requests';


import DashboardContent from './features/dashboard/components/DashboardContent';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import RequireAuth from './features/auth/components/RequireAuth';
import RequirePermission from './features/auth/components/RequirePermission';
// Dashboard routes
import Dashboard from './features/dashboard/pages/Dashboard';

// User management routes
import UserListPage from './features/users/pages/UserListPage';
import UserForm from './features/users/components/UserForm';


//for toast notifications
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
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
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        >
          {/* index route for /dashboard */}
          <Route index element={ <DashboardContent/>  } />

          {/* Nested management routes */}
          <Route
            path="management/employees"
            element={
              <RequirePermission anyOf={["employees.view"]}>
                <Employees />
              </RequirePermission>
            }
          />
          <Route
            path="management/departments"
            element={
              <RequirePermission anyOf={["departments.view"]}>
                <Departments />
              </RequirePermission>
            }
          />
          <Route
            path="management/positions"
            element={
              <RequirePermission anyOf={["positions.view"]}>
                <Positions />
              </RequirePermission>
            }
          />

          {/* Nested management routes */}
          <Route
            path="leave/leave-requests"
            element={
              <RequirePermission anyOf={["leave.view_all"]}>
                <LeaveRequests />
              </RequirePermission>
            }
          />
          <Route
            path="leave/leave-types"
            element={
              <RequirePermission anyOf={["leavetypes.view"]}>
                <LeaveTypes />
              </RequirePermission>
            }
          />
          <Route path="leave/request-leave" element={<RequestLeave /> } />
          <Route path="leave/my-leave-requests" element={<MyLeaveRequests /> } />

          {/* User management routes inside dashboard */}
          <Route
            path="users"
            element={
              <RequirePermission anyOf={["users.view"]}>
                <UserListPage />
              </RequirePermission>
            }
          />
          <Route
            path="users/new"
            element={
              <RequirePermission anyOf={["users.view"]}>
                <UserForm />
              </RequirePermission>
            }
          />
          <Route
            path="users/edit/:id"
            element={
              <RequirePermission anyOf={["users.view"]}>
                <UserForm isEdit={true} />
              </RequirePermission>
            }
          />

          {/* Align with sidebar "Settings" paths */}
          <Route
            path="settings/users"
            element={
              <RequirePermission anyOf={["users.view"]}>
                <UserListPage />
              </RequirePermission>
            }
          />

        </Route>
      </Routes>
    </Router>
   <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
</>
  );
}

export default App;
