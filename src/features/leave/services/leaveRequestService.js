import { apiClient } from "../../utilits/apiClient";

const LEAVE_REQUEST_BASE = "/api/LeaveRequest";

export const createLeaveRequest = async (payload) => {
  const response = await apiClient.post(
    `${LEAVE_REQUEST_BASE}/createleaverequest`,
    payload
  );
  return response.data;
};

export const modifyLeaveRequest = async (leaveRequestId, payload) => {
  const response = await apiClient.put(
    `${LEAVE_REQUEST_BASE}/modifyleaverequest/${leaveRequestId}`,
    payload
  );
  return response.data;
};

export const approveLeaveRequest = async (leaveRequestId, comments) => {
  const response = await apiClient.put(
    `${LEAVE_REQUEST_BASE}/approveleaverequest/${leaveRequestId}`,
    { comments },
  );
  return response.data;
};

export const rejectLeaveRequest = async (leaveRequestId, reason) => {
  const response = await apiClient.put(
    `${LEAVE_REQUEST_BASE}/rejectleaverequest/${leaveRequestId}`,
    { reason },
  );
  return response.data;
};

export const getEmployeeLeaveRequests = async (employeeId) => {
  const response = await apiClient.get(
    `${LEAVE_REQUEST_BASE}/getemployeeleaverequests/${employeeId}`
  );
  return response.data;
};

export const getPendingLeaveRequests = async (managerId = null) => {
  const response = await apiClient.get(`${LEAVE_REQUEST_BASE}/pending`, {
    params: managerId ? { managerId } : {},
  });
  return response.data;
};
