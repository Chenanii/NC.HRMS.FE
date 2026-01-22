import React, { useEffect, useState } from "react";
import { fetchUsers,
  updateUser,
  deleteUser,
  fetchDepartments,fetchPositions  } from "../services/userService";


// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

// UserForm component
const UserForm = ({ onSuccess, onCancel, initialData, isEdit, departments, positions }) => {
  const [formData, setFormData] = useState({
    employeeNumber: initialData?.employeeNumber || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
    departmentId: initialData?.departmentId || "",
    positionId: initialData?.positionId || ""
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeNumber.trim()) newErrors.employeeNumber = "User number is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.departmentId) newErrors.departmentId = "Department is required";
    if (!formData.positionId) newErrors.positionId = "Position is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setSaving(true);
    try {
      if (isEdit) {
        await updateUser(initialData.id, formData);
      }
      onSuccess();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to save employee";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User # <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.employeeNumber}
            onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
            className={`w-full px-4 py-3 border ${errors.employeeNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200`}
            disabled={isEdit}
          />
          {errors.employeeNumber && <p className="text-red-500 text-xs mt-1">{errors.employeeNumber}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            className={`w-full px-4 py-3 border ${errors.departmentId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200`}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name || dept.departmentName}
              </option>
            ))}
          </select>
          {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.positionId}
            onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
            className={`w-full px-4 py-3 border ${errors.positionId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200`}
          >
            <option value="">Select Position</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>
                {pos.name || pos.positionName || pos.title}
              </option>
            ))}
          </select>
          {errors.positionId && <p className="text-red-500 text-xs mt-1">{errors.positionId}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </div>
  );
};

const normalizeUsers = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const normalizeDepartments = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const normalizePositions = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

export default function SystemUsers() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, deptData, posData] = await Promise.all([
        fetchUsers(),
        fetchDepartments(),
        fetchPositions()
      ]);
      setUsers(normalizeUsers(usersData));
      setDepartments(normalizeDepartments(deptData));
      setPositions(normalizePositions(posData));
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Failed to load data.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User deleted successfully!", "success");
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "Delete failed.";
      showToast(message, "error");
    }
  };

  const handleAdd = () => {
    setEditUser(null);
    setModalOpened(true);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setModalOpened(true);
  };

  const handleModalSuccess = async () => {
    setModalOpened(false);
    const wasEdit = !!editUser;
    setEditUser(null);
    await loadData();
    showToast(
      wasEdit ? "User updated successfully!" : "User created successfully!",
      "success"
    );
  };

  const handleModalCancel = () => {
    setModalOpened(false);
    setEditUser(null);
  };

  // Get department and position names for display
  const getDepartmentName = (id) => {
    const dept = departments.find(d => d.id === id);
    return dept?.name || dept?.departmentName || id;
  };

  const getPositionName = (id) => {
    const pos = positions.find(p => p.id === id);
    return pos?.name || pos?.positionName || pos?.title || id;
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.employeeNumber?.toLowerCase().includes(search.toLowerCase()) ||
      getDepartmentName(user.departmentId)?.toLowerCase().includes(search.toLowerCase()) ||
      getPositionName(user.positionId)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div
            className={`rounded-lg shadow-lg p-4 max-w-sm ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 ${
                  toast.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {toast.type === "success" ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p
                className={`ml-3 text-sm font-medium ${
                  toast.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your organization's System Users</p>
          </div>
          {/* <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
          >
            <PlusIcon />
            <span className="ml-2">Add User</span>
          </button> */}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Error Message */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500 mt-2">Loading employees...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">First Name</th>
                      <th className="px-6 py-4">Last Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {user.employeeNumber}
                          </td>
                          <td className="px-6 py-4 text-gray-900">{user.firstName}</td>
                          <td className="px-6 py-4 text-gray-900">{user.lastName}</td>
                          <td className="px-6 py-4 text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-gray-600">{user.phoneNumber || "-"}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="inline-flex items-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          No employees found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{user.employeeNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {user.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span> {user.phoneNumber || "-"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Department:</span> {getDepartmentName(user.departmentId)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Position:</span> {getPositionName(user.positionId)}
                        </p>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <EditIcon />
                          <span className="ml-1">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <TrashIcon />
                          <span className="ml-1">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <UserIcon />
                      <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">
                        No employees found
                      </h3>
                      <p className="text-gray-500 text-center">
                        {search
                          ? "No employees match your search criteria"
                          : "Get started by adding your first employee"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpened && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <div className="flex items-center space-x-2">
                {editUser ? <EditIcon /> : <PlusIcon />}
                <h2 className="text-xl font-semibold text-gray-900">
                  {editUser ? "Edit User" : "Add New User"}
                </h2>
              </div>
              <button
                onClick={handleModalCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 flex-1 overflow-y-auto">
              <UserForm
                onSuccess={handleModalSuccess}
                onCancel={handleModalCancel}
                initialData={editUser}
                isEdit={!!editUser}
                departments={departments}
                positions={positions}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}