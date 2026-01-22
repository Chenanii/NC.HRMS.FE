const TOKEN_KEY = "nc_hrms_token";
const PERMISSIONS_KEY = "nc_hrms_permissions";

export const getRawToken = () => localStorage.getItem(TOKEN_KEY);

export const getToken = () => {
  const token = getRawToken();
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const isAuthenticated = () => Boolean(getRawToken());

export const getUserPermissions = () => {
  try {
    return JSON.parse(localStorage.getItem(PERMISSIONS_KEY)) || [];
  } catch {
    return [];
  }
};

export const hasPermission = (permission) => {
  if (!permission) return true;
  return getUserPermissions().includes(permission);
};

export const hasAnyPermission = (permissions) => {
  if (!permissions) return true;
  const list = Array.isArray(permissions) ? permissions : [permissions];
  return list.some((p) => hasPermission(p));
};
export const setPermissions = (permissions) =>
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("nc_hrms_user"));
  } catch {
    return null;
  }
};

export const getCurrentEmployeeId = () => {
  const user = getCurrentUser();
  return user?.employeeId || user?.id || user?.userId || user?.employee?.id || null;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
};
