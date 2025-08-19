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


export async function registerUser(payload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, payload, {
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
      `${API_BASE_URL}/auth/check-subdomain`,
      JSON.stringify(subdomain),
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Subdomain check response:", response.data);

    // Available when isError is false
    return response.data?.isError === false;
    
  } catch (error) {
    console.error("Error checking subdomain:", error);
    // Fallback to not available on error
    return false;
  }
};

export const resendConfirmationEmail = async (email) => {
  const response = await fetch(`${API_BASE_URL}}/auth/resend-confirmation`, {
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