import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      await registerUser(data);
      alert("Registration successful!");
      navigate('/');
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
      
    <RegisterForm onSubmit={handleRegister} />
  );
};

export default Register;
