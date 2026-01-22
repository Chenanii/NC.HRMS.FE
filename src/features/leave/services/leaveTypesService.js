import { apiClient } from "../../utilits/apiClient";

const LEAVE_TYPE_BASE = "/api/LeaveType";

export const fetchLeaveTypes = async () => {
  const res = await apiClient.get(`${LEAVE_TYPE_BASE}/getallleavetypes`);
  return res.data || [];
};

export const createLeaveType = async (data) => {
  const res = await apiClient.post(`${LEAVE_TYPE_BASE}/createleavetype`, data);
  return res.data;
};

export const fetchLeaveTypeById = async (id) => {
  const res = await apiClient.get(`${LEAVE_TYPE_BASE}/getleavetypebyid/${id}`);
  return res.data || {};
};

export const updateLeaveType = async (id, data) => {
  const res = await apiClient.put(`${LEAVE_TYPE_BASE}/modifyleavetype/${id}`, data);
  return res.data;
};

export const deleteLeaveType = async (id) => {
  const res = await apiClient.delete(`${LEAVE_TYPE_BASE}/deleteleavetype/${id}`);
  return res.data;
};
