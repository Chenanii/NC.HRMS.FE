import { apiClient } from "../../utilits/apiClient";

const EMPLOYEES_BASE = "/api/employees";
const USERS_BASE = "/api/users";
const ROLES_BASE = "/api/roles";

export const fetchEmployees = async () => {
  const res = await apiClient.get(`${EMPLOYEES_BASE}/getallemployees`);

  return res.data.result || [];
};


export const createEmployee = async (data) => {
  const res = await apiClient.post(`${EMPLOYEES_BASE}/createemployee`, data);
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await apiClient.put(`${EMPLOYEES_BASE}/updateemployee/${id}`, data);
  return res.data;
};

export const fetchEmployeeById = async (id) => {
  const res = await apiClient.get(`${EMPLOYEES_BASE}/getemployeebyid/${id}`);
  return res.data;
};

export const fetchEmployeeByNumber = async (employeeNumber) => {
  const res = await apiClient.get(`${EMPLOYEES_BASE}/by-number/${employeeNumber}`);
  return res.data;
};

export const fetchEmployeesByDepartment = async (departmentId) => {
  const res = await apiClient.get(`${EMPLOYEES_BASE}/department/${departmentId}`);
  return res.data || [];
};

export const fetchDirectReports = async (managerId) => {
  const res = await apiClient.get(`${EMPLOYEES_BASE}/manager/direct-reports/${managerId}`);
  return res.data || [];
};

export const terminateEmployee = async (id, data) => {
  const res = await apiClient.delete(`${EMPLOYEES_BASE}/terminate/${id}`, { data });
  return res.data;
};


export const inviteUserForEmployee  = async (userData) => {
  const res = await apiClient.post(`${USERS_BASE}/invite`, { userData });
  return res.data;
};

export const fetchRoles = async () => {
  const res = await apiClient.get(`${ROLES_BASE}/getroles`);
  return res.data.result || [];
};