import { apiClient } from "../../utilits/apiClient";

const DOCUMENTS_BASE = "/api/Documents";

export const uploadDocument = async (file, documentData) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('EmployeeId', documentData.employeeId);
  formData.append('CategoryId', documentData.categoryId);
  formData.append('Description', documentData.description || '');
  if (documentData.expiryDate) {
    formData.append('ExpiryDate', documentData.expiryDate);
  }
  formData.append('HasExpiry', documentData.hasExpiry || false);
  if (documentData.tags) {
    formData.append('Tags', documentData.tags);
  }

  const res = await apiClient.post(`${DOCUMENTS_BASE}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getDocument = async (documentId) => {
  const res = await apiClient.get(`${DOCUMENTS_BASE}/${documentId}`);
  return res.data;
};

export const getEmployeeDocuments = async (employeeId) => {
  const res = await apiClient.get(`${DOCUMENTS_BASE}/employee/${employeeId}`);
  return res.data;
};

export const getExpiringDocuments = async (daysAhead = 30) => {
  const res = await apiClient.get(`${DOCUMENTS_BASE}/expiring`, {
    params: { daysAhead }
  });
  return res.data;
};

export const deleteDocument = async (documentId) => {
  const res = await apiClient.delete(`${DOCUMENTS_BASE}/${documentId}`);
  return res.data;
};

export const createCategory = async (categoryData) => {
  const res = await apiClient.post(`${DOCUMENTS_BASE}/category`, categoryData);
  return res.data;
};

export const downloadDocument = async (documentId) => {
  const res = await apiClient.get(`${DOCUMENTS_BASE}/download/${documentId}`, {
    responseType: 'blob'
  });
  return res.data;
};
