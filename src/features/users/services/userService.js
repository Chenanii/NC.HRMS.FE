import axios from "axios";

const API_URL = "/api/employees";
const DEPT_URL = "/api/departments";
const POS_URL = "/api/positions";

export const fetchUsers = () => axios.get(API_URL);
export const createUser = (employee) => axios.post(API_URL, employee);
export const updateUser = (id, employee) => axios.put(`${API_URL}/${id}`, employee);
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
export const getUserById = (id) => axios.get(`${API_URL}/${id}`);

export const fetchDepartments = () => axios.get(DEPT_URL);
export const fetchPositions = () => axios.get(POS_URL);