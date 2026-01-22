import { apiClient } from "../../utilits/apiClient";

const ANALYTICS_BASE = "/api/Analytics";

export const getEmployeeStatistics = async () => {
  const res = await apiClient.get(`${ANALYTICS_BASE}/employee-statistics`);
  return res.data;
};

export const getLeaveStatistics = async (startDate, endDate) => {
  const res = await apiClient.get(`${ANALYTICS_BASE}/leave-statistics`, {
    params: { startDate, endDate },
  });
  return res.data;
};

export const getOnboardingStatistics = async (startDate, endDate) => {
  const res = await apiClient.get(`${ANALYTICS_BASE}/onboarding-statistics`, {
    params: { startDate, endDate },
  });
  return res.data;
};

export const getDepartmentHeadcount = async () => {
  const res = await apiClient.get(`${ANALYTICS_BASE}/department-headcount`);
  return res.data;
};

export const getBirthdaysThisMonth = async () => {
  const res = await apiClient.get(`${ANALYTICS_BASE}/birthdays-this-month`);
  return res.data;
};

export const getWorkAnniversariesThisMonth = async () => {
  const res = await apiClient.get(`${ANALYTICS_BASE}/work-anniversaries-this-month`);
  return res.data;
};

export const getAverageSalaryByDepartment = async () => {
  const res = await apiClient.get(`${ANALYTICS_BASE}/average-salary-by-department`);
  return res.data;
};