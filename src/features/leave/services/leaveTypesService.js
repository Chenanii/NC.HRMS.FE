import axios from "axios";

const API_BASE = "https://nexacircuit-hrms.com/api/LeaveType";



const getToken = () => localStorage.getItem("nc_hrms_token");

export const fetchLeaveTypes = async () => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getallleavetypes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const createLeaveType = async (data) => {
  const token = getToken();
  const res = await axios.post(`${API_BASE}/createleavetype`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchLeaveTypeById = async (id) => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getleavetypebyid/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || {};
};

export const updateLeaveType = async (id, data) => {
  const token = getToken();
  const res = await axios.put(`${API_BASE}/modifyleavetype/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteLeaveType = async (id) => {
  const token = getToken();
  const res = await axios.delete(`${API_BASE}/deleteleavetype/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
