import axios from "axios";

const API_URL = "https://nthaka.com/hrms/api/Auth";

// Login request
export const login = async (form) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: form.email,
      password: form.password,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Login failed";
    throw new Error(message);
  }
};

// Register request
export const register = async (form) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      company: form.company,
      subdomain: form.subdomain,
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Registration failed";
    throw new Error(message);
  }
};