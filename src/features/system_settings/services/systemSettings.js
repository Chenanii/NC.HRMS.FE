
import { apiClient } from "../../utilits/apiClient";

// API Service functions
export const getCurrentTenant = async () => {
  const { apiClient } = await import("../../utilits/apiClient");
  const res = await apiClient.get("/api/tenants/getcurrenttenant");
  return res.data;
};

export const updateCurrentTenant = async (data) => {
  const { apiClient } = await import("../../utilits/apiClient");
  const res = await apiClient.put("/api/tenants/updatecurrenttenant", data);
  return res.data;
};