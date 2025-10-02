import axios from "axios";
import { getToken } from "../../utilits/auth";

const API_BASE = "https://nexa-circuit.com/hrms/api/Analytics";

export const getEmployeeStatistics = async () => {
  const res = await axios.get(`${API_BASE}/employee-statistics`, {
    headers: getToken(),
  });
  return res.data;
};

export const getLeaveStatistics = async (startDate, endDate) => {
  const res = await axios.get(`${API_BASE}/leave-statistics`, {
    headers: getToken(),
    params: { startDate, endDate },
  });
  return res.data;
};

export const getOnboardingStatistics = async (startDate, endDate) => {
  const res = await axios.get(`${API_BASE}/onboarding-statistics`, {
    headers: getToken(),
    params: { startDate, endDate },
  });
  return res.data;
};

export const getDepartmentHeadcount = async () => {
  const res = await axios.get(`${API_BASE}/department-headcount`, {
    headers: getToken(),
  });
  return res.data;
};

export const getBirthdaysThisMonth = async () => {
  const res = await axios.get(`${API_BASE}/birthdays-this-month`, {
    headers: getToken(),
  });
  return res.data;
};

export const getWorkAnniversariesThisMonth = async () => {
  const res = await axios.get(`${API_BASE}/work-anniversaries-this-month`, {
    headers: getToken(),
  });
  return res.data;
};

export const getAverageSalaryByDepartment = async () => {
  const res = await axios.get(`${API_BASE}/average-salary-by-department`, {
    headers: getToken(),
  });
  return res.data;
};