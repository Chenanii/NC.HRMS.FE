import { apiClient } from "../../utilits/apiClient";

const AUTH_BASE = "/api/Auth";

// Login request
export const login = async (form) => {
  try {
    const response = await apiClient.post(`${AUTH_BASE}/login`, {
      email: form.email,
      password: form.password,
    });

    return response.data;
  } catch (error) {

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.requestResponse?.message ||
      "Login failed";
    throw new Error(message);
  }
};


export async function registerUser(payload) {
  try {
    const response = await apiClient.post(`${AUTH_BASE}/register`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    }
    throw new Error("Network error, please try again later");
  }
}

const takenSubdomains = [
  "admin", "api", "www", "app", "dashboard", "support",
  "help", "blog", "docs", "mail", "ftp", "test", "dev", "staging"
];

export const checkSubdomainAvailability = async (subdomain) => {

  if (takenSubdomains.includes(subdomain.toLowerCase())) {
    return false;
  }

  try {
    const response = await apiClient.post(
      `${AUTH_BASE}/check-subdomain`,
      JSON.stringify(subdomain),
      { headers: { "Content-Type": "application/json" } }
    );

    // Available when isError is false
    return response.data?.isError === false;
    
  } catch {
    // Fallback to not available on error
    return false;
  }
};

export const resendConfirmationEmail = async (email) => {
  try {
    const res = await apiClient.post(`${AUTH_BASE}/resend-confirmation`, { email });
    return res.data;
  } catch {
    throw new Error("Failed to resend confirmation email");
  }
};

export const logout = async () => {
  await apiClient.post(`${AUTH_BASE}/logout`, {});
};

export const loginWithGoogle = async (credential) => {
  try {
    const response = await apiClient.post(
      `${AUTH_BASE}/login/google`,
      { credential: credential.credential },
      { headers: { "Content-Type": "application/json" } }
    );
    
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.requestResponse?.message ||
      "Google login failed";
    throw new Error(message);
  }
};

// Google OAuth registration
export const registerWithGoogle = async (credential, companyData) => {
  try {
    const response = await apiClient.post(`${AUTH_BASE}/register/google`, {
      credential: credential.credential,
      ...companyData,
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.requestResponse?.message ||
      "Google registration failed";
    throw new Error(message);
  }
};