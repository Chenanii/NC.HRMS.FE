import axios from "axios";

const API_BASE = "https://nexacircuit-hrms.com/api/departments";

const getToken = () => localStorage.getItem("nc_hrms_token");


// Department functions
export const fetchDepartments = async () => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getalldepartments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const fetchDepartmentById = async (id) => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getdepartmentbyid/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createDepartment = async (data) => {
  const token = getToken();
  const res = await axios.post(`${API_BASE}/createdepartment`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const token = getToken();
  const res = await axios.put(`${API_BASE}/updatedepartment/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteDepartment = async (id) => {
  const token = getToken();
  await axios.delete(`${API_BASE}/deletedepartment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};