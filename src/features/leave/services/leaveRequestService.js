import axios from "axios";
import { getToken } from "../../utilits/auth";

const API_BASE = "https://nexacircuit-hrms.com/api/LeaveRequest";

const getHeaders = () => ({
  headers: {
    ...getToken(),
  },
});

export const createLeaveRequest = async (payload) => {
  const config = getHeaders();
  console.log("Request headers:", config);
  console.log("Request payload:", payload);
  
  try {
    const response = await axios.post(
      `${API_BASE}/createleaverequest`,
      payload,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error response status:", error.response?.status);
    console.error("Error message:", error.message);
    throw error;
  }
};

export const modifyLeaveRequest = async (leaveRequestId, payload) => {
  const response = await axios.put(
    `${API_BASE}/modifyleaverequest/${leaveRequestId}`,
    payload,
    getHeaders()
  );
  return response.data;
};

export const approveLeaveRequest = async (leaveRequestId, comments) => {
  const response = await axios.put(
    `${API_BASE}/approveleaverequest/${leaveRequestId}`,
    { comments },
    getHeaders()
  );
  return response.data;
};

export const rejectLeaveRequest = async (leaveRequestId, reason) => {
  const response = await axios.put(
    `${API_BASE}/rejectleaverequest/${leaveRequestId}`,
    { reason },
    getHeaders()
  );
  return response.data;
};

export const getEmployeeLeaveRequests = async (employeeId) => {
  const response = await axios.get(
    `${API_BASE}/getemployeeleaverequests/${employeeId}`,
    getHeaders()
  );
  return response.data;
};

export const getPendingLeaveRequests = async (managerId = null) => {
  const response = await axios.get(`${API_BASE}/pending`, {
    params: managerId ? { managerId } : {},
    ...getHeaders(),
  });
  return response.data;
};
