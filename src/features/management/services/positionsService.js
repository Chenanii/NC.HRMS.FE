import axios from "axios";

const API_BASE = "https://nthaka.com/hrms/api/positions";
const API_BASE_Department = "https://nthaka.com/hrms/api/departments";

const getToken = () => localStorage.getItem("nc_hrms_token");

export const fetchPositions = async () => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getallpositions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchDepartments = async () => {
  const token = getToken();
  const res = await axios.get(`${API_BASE_Department}/getalldepartments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data||[];
};

export const createPosition = async (data) => {
  const token = getToken();
  const res = await axios.post(`${API_BASE}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePosition = async (id, data) => {
  const token = getToken();
  const res = await axios.put(`${API_BASE}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deletePosition = async (id) => {
  const token = getToken();
  await axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
