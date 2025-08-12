import { Button, Container, TextInput, Title } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import Register from './features/auth/pages/Register'; 
import './index.css';


function App() {
  return (
    <Container size="sm" mt="xl">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
