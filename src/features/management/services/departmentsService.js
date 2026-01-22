import { apiClient } from "../../utilits/apiClient";

const DEPARTMENTS_BASE = "/api/departments";


// Department functions
export const fetchDepartments = async () => {
  const res = await apiClient.get(`${DEPARTMENTS_BASE}/getalldepartments`);
  return res.data || [];
};

export const fetchDepartmentById = async (id) => {
  const res = await apiClient.get(`${DEPARTMENTS_BASE}/getdepartmentbyid/${id}`);
  return res.data;
};

export const createDepartment = async (data) => {
  const res = await apiClient.post(`${DEPARTMENTS_BASE}/createdepartment`, data);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await apiClient.put(`${DEPARTMENTS_BASE}/updatedepartment/${id}`, data);
  return res.data;
};

export const deleteDepartment = async (id) => {
  await apiClient.delete(`${DEPARTMENTS_BASE}/deletedepartment/${id}`);
};