import { apiClient } from "../../utilits/apiClient";

const POSITIONS_BASE = "/api/positions";
const DEPARTMENTS_BASE = "/api/departments";

export const fetchPositions = async () => {
  const res = await apiClient.get(`${POSITIONS_BASE}/getallpositions`);
  return res.data || [];
};

export const fetchDepartments = async () => {
  const res = await apiClient.get(`${DEPARTMENTS_BASE}/getalldepartments`);
  return res.data||[];
};

export const createPosition = async (data) => {
  const res = await apiClient.post(`${POSITIONS_BASE}/createposition`, data);
  return res.data;
};

export const updatePosition = async (id, data) => {
  const res = await apiClient.put(`${POSITIONS_BASE}/updateposition/${id}`, data);
  return res.data;
};

export const deletePosition = async (id) => {
  await apiClient.delete(`${POSITIONS_BASE}/deleteposition/${id}`);
};
