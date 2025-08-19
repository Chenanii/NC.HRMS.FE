import { Container } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import Register from './features/auth/pages/Register'; 
import LandingPage from './features/home/LandingPage'; 
import EmailSent from './features/auth/pages/Email-Sent'; 
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Dashboard routes
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import { LogIn } from 'lucide-react';

// User management routes
import UserListPage from './features/users/pages/UserListPage';
import UserForm from './features/users/components/UserForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <Container size="sm" mt="xl">
            <LandingPage />
          </Container>
        } />
        <Route path="/register" element={
          <Container size="sm" mt="xl">
            <Register />
          </Container>
        } />
       <Route path="/login" element={
          <Container size="sm" mt="xl">
            <LoginPage />
          </Container>
        } />

        <Route path="/email-sent" element={
          <Container size="sm" mt="xl">
            <EmailSent />
          </Container>
        } />

        {/* Protected routes (after login) */}
        <Route path="/dashboard" element={
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        } />

        <Route path="/users" element={
          <MainLayout>
            <UserListPage />
          </MainLayout>
        } />

        <Route path="/users/new" element={
          <MainLayout>
            <UserForm />
          </MainLayout>
        } />

        <Route path="/users/edit/:id" element={
          <MainLayout>
            <UserForm isEdit={true} /> 
          </MainLayout>
        } />


      </Routes> 
    </Router>
  );
}

export default App;
