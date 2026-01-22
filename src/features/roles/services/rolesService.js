import { apiClient } from "../../utilits/apiClient";

const ROLES_BASE = "/api/roles";

export const fetchRoles = async () => {
  const res = await apiClient.get(`${ROLES_BASE}/getroles`);
  return res.data.result || [];
};

export const fetchPermissions = async () => {
  const res = await apiClient.get(`${ROLES_BASE}/permissions`);
  return res.data || [];
};

export const createRole = async (data) => {
  const res = await apiClient.post(`${ROLES_BASE}/createrole`, data);
  return res.data;
};

export const updateRole = async (id, data) => {
  const res = await apiClient.put(`${ROLES_BASE}/updaterole/${id}`, data);
  return res.data;
};

export const deleteRole = async (id) => {
  await apiClient.delete(`${ROLES_BASE}/deleterole/${id}`);
};