import { Container } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import Register from './features/auth/pages/Register'; 
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Dashboard routes
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './features/dashboard/pages/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <Container size="sm" mt="xl">
            <LoginPage />
          </Container>
        } />
        <Route path="/register" element={
          <Container size="sm" mt="xl">
            <Register />
          </Container>
        } />

        {/* Protected routes (after login) */}
        <Route path="/dashboard" element={
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
