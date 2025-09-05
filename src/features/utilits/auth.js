const TOKEN_KEY = "nc_hrms_token";
const PERMISSIONS_KEY = "nc_hrms_permissions";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getUserPermissions = () => {
  try {
    return JSON.parse(localStorage.getItem(PERMISSIONS_KEY)) || [];
  } catch {
    return [];
  }
};
export const setPermissions = (permissions) =>
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
};
