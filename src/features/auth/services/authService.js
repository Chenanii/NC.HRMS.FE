// import axios from "../../../services/axios"; // Assuming this is your axios instance

// Login function (same as before)
export async function login(credentials) {
  try {
    const response = await axios.post("/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Login request failed");
  }
}

// Register function (newly added)
export async function registerUser(userData) {
  try {
    const response = await axios.post("/api/auth/register", userData);
    return response.data;  // Assuming the backend returns user data or a success message
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Registration request failed");
  }
}
