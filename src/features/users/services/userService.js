import { apiClient } from "../../utilits/apiClient";

const EMPLOYEES_BASE = "/api/employees";
const DEPARTMENTS_BASE = "/api/departments";
const POSITIONS_BASE = "/api/positions";

export const fetchUsers = async () => {
  const res = await apiClient.get(`${EMPLOYEES_BASE}/getallemployees`);
  return res.data;
};
export const createUser = async (employee) => {
  const res = await apiClient.post(`${EMPLOYEES_BASE}/createemployee`, employee);
  return res.data;
};
export const updateUser = async (id, employee) => {
  const res = await apiClient.put(`${EMPLOYEES_BASE}/updateemployee/${id}`, employee);
  return res.data;
};
export const deleteUser = async (id) => {
  const res = await apiClient.delete(`${EMPLOYEES_BASE}/terminate/${id}`);
  return res.data;
};
export const getUserById = async (id) => {
  const res = await apiClient.get(`${EMPLOYEES_BASE}/getemployeebyid/${id}`);
  return res.data;
};

export const fetchDepartments = async () => {
  const res = await apiClient.get(`${DEPARTMENTS_BASE}/getalldepartments`);
  return res.data;
};
export const fetchPositions = async () => {
  const res = await apiClient.get(`${POSITIONS_BASE}/getallpositions`);
  return res.data;
};