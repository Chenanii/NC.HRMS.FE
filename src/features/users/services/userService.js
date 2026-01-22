import { User } from "lucide-react";
import { apiClient } from "../../utilits/apiClient";

const EMPLOYEES_BASE = "/api/employees";
const DEPARTMENTS_BASE = "/api/departments";
const POSITIONS_BASE = "/api/positions";
const USERS_BASE = "/api/users";

export const fetchUsers = async () => {
  const res = await apiClient.get(`${USERS_BASE}/`);
  console.log("Fetched users:", res.data);
  return res.data;
};

export const updateUser = async (id, user) => {
  const res = await apiClient.put(`${USERS_BASE}/updateuser/${id}`, user);
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