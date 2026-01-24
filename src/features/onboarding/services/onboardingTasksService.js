import { apiClient } from "../../utilits/apiClient";

const ONBOARDING_TASKS_BASE = "/api/OnboardingTasks";

export const completeTask = async (taskId, request) => {
  const res = await apiClient.put(`${ONBOARDING_TASKS_BASE}/completetask/${taskId}`, request);
  return res.data;
};

export const getEmployeeOnboardingTasks = async (employeeId) => {
  const res = await apiClient.get(`${ONBOARDING_TASKS_BASE}/getemployeeonboardingtasks/${employeeId}`);
  return res.data;
};

export const getOverdueTasks = async () => {
  const res = await apiClient.get(`${ONBOARDING_TASKS_BASE}/getoverduetasks`);
  return res.data;
};

export const updateTask = async (taskId, request) => {
  const res = await apiClient.put(`${ONBOARDING_TASKS_BASE}/updatetask/${taskId}`, request);
  return res.data;
};

export const reopenTask = async (taskId, request) => {
  const res = await apiClient.put(`${ONBOARDING_TASKS_BASE}/reopentask/${taskId}`, request);
  return res.data;
};

export const getEmployeeOnboardingProgress = async (employeeId) => {
  const res = await apiClient.get(`${ONBOARDING_TASKS_BASE}/employee/progress/${employeeId}`);
  return res.data;
};

export const bulkCompleteTasks = async (request) => {
  const res = await apiClient.put(`${ONBOARDING_TASKS_BASE}/bulk-complete`, request);
  return res.data;
};

export const getOnboardingReport = async (fromDate, toDate) => {
  const res = await apiClient.get(`${ONBOARDING_TASKS_BASE}/getonboardingreport`, {
    params: { fromDate, toDate }
  });
  return res.data;
};
