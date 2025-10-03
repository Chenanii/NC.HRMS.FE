import axios from "axios";

const API_BASE = "https://nexa-circuit.com/hrms/api/positions";
const API_BASE_Department = "https://nexa-circuit.com/hrms/api/departments";

const getToken = () => localStorage.getItem("nc_hrms_token");

export const fetchPositions = async () => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getallpositions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
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
  const res = await axios.post(`${API_BASE}/createposition`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePosition = async (id, data) => {
  const token = getToken();
  const res = await axios.put(`${API_BASE}/updateposition/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Update Response:", res.data);
  return res.data;
};

export const deletePosition = async (id) => {
  const token = getToken();
  await axios.delete(`${API_BASE}/deleteposition/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
