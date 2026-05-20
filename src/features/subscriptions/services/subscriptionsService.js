import { apiClient } from "../../utilits/apiClient";

const API_BASE = "/api/subscriptions";

export const getSubscriptionPlans = async () => {
  try {
    const response = await apiClient.get(`${API_BASE}/plans`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentSubscription = async () => {
  try {
    const response = await apiClient.get(`${API_BASE}/current`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const initiatePayPalPayment = async (planId, amount) => {
  try {
    const response = await apiClient.post(`${API_BASE}/paypal/create`, {
      planId,
      amount,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const capturePayPalPayment = async (orderId) => {
  try {
    const response = await apiClient.post(`${API_BASE}/paypal/capture`, {
      orderId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const initiateAirtelMoneyPayment = async (planId, amount, phoneNumber) => {
  try {
    const response = await apiClient.post(`${API_BASE}/airtel-money/initiate`, {
      planId,
      amount,
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyAirtelMoneyPayment = async (transactionId) => {
  try {
    const response = await apiClient.post(`${API_BASE}/airtel-money/verify`, {
      transactionId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await apiClient.get(`${API_BASE}/payment-history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await apiClient.post(`${API_BASE}/${subscriptionId}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
