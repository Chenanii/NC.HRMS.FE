const TOKEN_KEY = "nc_hrms_token";
const PERMISSIONS_KEY = "nc_hrms_permissions";

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY); 
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

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
