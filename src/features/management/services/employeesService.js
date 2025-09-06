import axios from "axios";

const API_BASE = "https://nthaka.com/hrms/api/employees";

const getToken = () => localStorage.getItem("nc_hrms_token");

export const fetchEmployees = async () => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getallemployees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const createEmployee = async (data) => {
  const token = getToken();
  const res = await axios.post(`${API_BASE}/createemployee`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const token = getToken();
  const res = await axios.put(`${API_BASE}/updateemployee/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchEmployeeById = async (id) => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/getemployeebyid/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchEmployeeByNumber = async (employeeNumber) => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/by-number/${employeeNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchEmployeesByDepartment = async (departmentId) => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/department/${departmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const fetchDirectReports = async (managerId) => {
  const token = getToken();
  const res = await axios.get(`${API_BASE}/manager/direct-reports/${managerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const terminateEmployee = async (id, data) => {
  const token = getToken();
  const res = await axios.delete(`${API_BASE}/terminate/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    data, 
  });
  return res.data;
};
