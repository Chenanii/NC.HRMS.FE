import axios from "axios";

const API_BASE_URL = "https://nexa-circuit.com/hrms/api/Auth";

// Login request
export const login = async (form) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
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
    const response = await axios.post(`${API_BASE_URL}/register`, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });
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
  const response = await axios.post(
      `${API_BASE_URL}/check-subdomain`,
      JSON.stringify(subdomain),
      { headers: { "Content-Type": "application/json" } }
    );

    // Available when isError is false
    return response.data?.isError === false;
    
  } catch (error) {
    console.error("Error checking subdomain:", error);
    // Fallback to not available on error
    return false;
  }
};

export const resendConfirmationEmail = async (email) => {
  const response = await fetch(`${API_BASE_URL}}/resend-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to resend confirmation email');
  }

  return response.json();
};

export const logout = async () => {
  const token = localStorage.getItem("nc_hrms_token");

  await axios.post(
    `${API_BASE_URL}}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};