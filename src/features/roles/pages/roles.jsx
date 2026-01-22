import React, { useEffect, useState } from "react";
import {
  fetchRoles,
  fetchPermissions,
  createRole,
  updateRole,
  deleteRole,
} from "../services/rolesService";
import { getUserPermissions } from "../../utilits/auth";
import Select from "react-select";

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

// Permissions helpers
const getPermissions = () => {
  try {
    return getUserPermissions() || [];
  } catch {
    return [];
  }
};

const hasPermission = (permission) => {
  const permissions = getPermissions();
  return permissions.includes(permission);
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, _setPage] = useState(1);
  const [pageSize] = useState(10);
  const [_total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  // Load data
  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      const items = Array.isArray(data) ? data : data?.requestResponse?.result || [];

      setRoles(items);
      setTotal(data?.total || items.length);
    } catch (err) {
      console.error(err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await fetchPermissions();
      const permArray = Array.isArray(data?.result) ? data.result : [];

      setPermissions(
        permArray.map(p => ({
          value: p.id,
          label: p.name
        }))
      );
    } catch (err) {
      console.error("Failed to load permissions:", err);
      setPermissions([]);
    }
  };

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, [page, search]);

  const openModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      
      // Extract permission IDs from rolePermissions array
      const permissionIds = role.rolePermissions?.map(rp => rp.permissionId) || [];
      
      setFormData({
        name: role.name || "",
        description: role.description || "",
        permissions: permissionIds,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        description: "",
        permissions: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingRole) {
        if (!hasPermission("roles.edit")) {
          return alert("You don't have permission to edit roles.");
        }

        const updateData = {
          name: formData.name,
          description: formData.description || "",
          PermissionIds: formData.permissions || [],
        };

        await updateRole(editingRole.id, updateData);
        alert("Role updated successfully!");
      } else {
        if (!hasPermission("roles.create")) {
          return alert("You don't have permission to create roles.");
        }

        const createData = {
          name: formData.name,
          description: formData.description || "",
          PermissionIds: formData.permissions || [],
        };

        await createRole(createData);
        alert("Role created successfully!");
      }

      loadRoles();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the role.");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("roles.delete")) {
      return alert("You don't have permission to delete roles.");
    }

    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      await deleteRole(id);
      alert("Role deleted successfully!");
      loadRoles();
    } catch (err) {
      console.error(err);
      alert("Failed to delete the role.");
    }
  };

  // Filter roles
  const filteredRoles = roles.filter(role =>
    role.name?.toLowerCase().includes(search.toLowerCase()) ||
    role.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Custom styles for react-select with better visibility
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '48px',
      borderColor: state.isFocused ? '#10b981' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#10b981',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#dcfce7',
      borderRadius: '6px',
      padding: '2px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#166534',
      fontWeight: '500',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#166534',
      '&:hover': {
        backgroundColor: '#bbf7d0',
        color: '#14532d',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#10b981'
        : state.isFocused
        ? '#f0fdf4'
        : 'white',
      color: state.isSelected ? 'white' : '#111827',
      '&:active': {
        backgroundColor: '#059669',
      },
    }),
  };

  if (!hasPermission("roles.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Roles</h1>
            <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
          </div>
          {hasPermission("roles.create") && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
            >
              <PlusIcon />
              <span className="ml-2">Add Role</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-2">Loading roles...</p>
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
                      <th className="px-6 py-4">Role Name</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Permissions</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRoles.length ? (
                      filteredRoles.map((role, index) => {
                        const count = (page - 1) * pageSize + index + 1;
                        return (
                          <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{count}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{role.name}</td>
                            <td className="px-6 py-4 text-gray-600">
                              {role.description || "No description"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {role.rolePermissions?.length || 0} permission(s)
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                {hasPermission("roles.edit") && (
                                  <button
                                    onClick={() => openModal(role)}
                                    className="inline-flex items-center p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <EditIcon />
                                  </button>
                                )}
                                {hasPermission("roles.delete") && (
                                  <button
                                    onClick={() => handleDelete(role.id)}
                                    className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <TrashIcon />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          No roles found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredRoles.length ? (
                  filteredRoles.map((role) => (
                    <div key={role.id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{role.name}</h3>
                        </div>
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {role.permissions?.length || 0} permission(s)
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {role.description || "No description"}
                      </p>
                      <div className="flex items-center justify-end space-x-2">
                        {hasPermission("roles.edit") && (
                          <button
                            onClick={() => openModal(role)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <EditIcon />
                            <span className="ml-1">Edit</span>
                          </button>
                        )}
                        {hasPermission("roles.delete") && (
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <TrashIcon />
                            <span className="ml-1">Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
                      <p className="text-gray-500 text-center">
                        {search ? "No roles match your search criteria" : "Get started by creating your first role"}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingRole ? "Edit Role" : "Add Role"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter role name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  rows="3"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description?.length || 0}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions {formData.permissions.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-green-600">
                      ({formData.permissions.length} selected)
                    </span>
                  )}
                </label>
                <Select
                  options={permissions}
                  value={permissions.filter((p) => formData.permissions.includes(p.value))}
                  onChange={(selected) =>
                    setFormData({ ...formData, permissions: selected ? selected.map(s => s.value) : [] })
                  }
                  placeholder="Select permissions..."
                  isMulti
                  isClearable
                  closeMenuOnSelect={false}
                  styles={customSelectStyles}
                  className="w-full"
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "No permissions available"}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Select one or more permissions to assign to this role
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.name.trim() ||
                  (editingRole
                    ? !hasPermission("roles.edit")
                    : !hasPermission("roles.create"))
                }
                className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  !formData.name.trim() ||
                  (editingRole
                    ? !hasPermission("roles.edit")
                    : !hasPermission("roles.create"))
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 shadow-sm"
                }`}
              >
                {editingRole ? "Update Role" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;