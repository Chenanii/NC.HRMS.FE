import React, { useEffect, useState } from "react";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentsService";
import { fetchEmployees } from "../services/employeesService";
import { getUserPermissions } from "../../utilits/auth";

// Icons (you can replace these with your preferred icon library)
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

// Permission helpers
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

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState("");
  const [page, _setPage] = useState(1);
  const [pageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "", 
    description: "",
    managerId: null,
    isActive: true,
  });

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await fetchDepartments();
      const items = Array.isArray(data) ? data : data?.items || [];
      setDepartments(items);
      setTotal(data?.total || items.length);
    } catch (err) {
      console.error(err);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      const items = Array.isArray(data) ? data : data?.items || [];
      setEmployees(
        items.map(emp => ({
          value: emp.id,
          label: emp.name
        }))
      );
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, [page, search]);

  const openModal = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        name: department.name || "",
        code: department.code || "",
        description: department.description || "",
        managerId: department.managerId || null,
        isActive: department.isActive ?? true,
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        name: "",
        code: "",
        description: "",
        managerId: null,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingDepartment) {
        if (!hasPermission("departments.edit")) return alert("You don't have permission to edit departments.");
        const updateData = {
          name: formData.name,
          code: formData.code,
          description: formData.description,
          managerId: formData.managerId,
          isActive: formData.isActive
        };
        await updateDepartment(editingDepartment.id, updateData);
      } else {
        if (!hasPermission("departments.create")) return alert("You don't have permission to create departments.");
        const createData = {
          name: formData.name,
          code: formData.code || "",
          description: formData.description || "",
          managerId: formData.managerId || null      
        };
        await createDepartment(createData);
      }
      loadDepartments();
      setIsModalOpen(false);
      alert(`Department ${editingDepartment ? "updated" : "created"} successfully.`);
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the department.");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("departments.delete")) return alert("You don't have permission to delete departments.");
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id);
      loadDepartments();
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the department.");
    }
  };

  // Filter departments based on search
  const filteredDepartments = departments.filter(dept =>
    dept.name?.toLowerCase().includes(search.toLowerCase()) ||
    dept.description?.toLowerCase().includes(search.toLowerCase())
  );

  // If user doesn't have view permission
  if (!hasPermission("departments.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view departments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600 mt-1">Manage your organization's departments</p>
            </div>
            {hasPermission("departments.create") && (
              <button
                onClick={() => openModal()}
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
              >
                <PlusIcon />
                <span className="ml-2">Add Department</span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-2">Loading departments...</p>
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
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Manager</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                {filteredDepartments.length ? (
                  filteredDepartments.map((dept, index) => {
                    const count = (page - 1) * pageSize + index + 1; // calculate count per row
                    return (
                      <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{count}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{dept.code}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {dept.Email  || "No Manager" }
                        </td>
                         <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {dept.description || "No description"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              dept.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {dept.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {hasPermission("departments.edit") && (
                              <button
                                onClick={() => openModal(dept)}
                                className="inline-flex items-center p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <EditIcon />
                              </button>
                            )}
                            {hasPermission("departments.delete") && (
                              <button
                                onClick={() => handleDelete(dept.id)}
                                className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
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
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No departments found
                    </td>
                  </tr>
                )}

                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredDepartments.length ? (
                  filteredDepartments.map((dept) => (
                    <div key={dept.id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">{dept.name}</h3>
                          <p className="text-sm text-gray-500 font-mono">{dept.code}</p>
                        </div>
                        <span
                          className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            dept.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {dept.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {dept.description || "No description"}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Created: {dept.createdAt ? new Date(dept.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          {hasPermission("departments.edit") && (
                            <button
                              onClick={() => openModal(dept)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <EditIcon />
                              <span className="ml-1">Edit</span>
                            </button>
                          )}
                          {hasPermission("departments.delete") && (
                            <button
                              onClick={() => handleDelete(dept.id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <TrashIcon />
                              <span className="ml-1">Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                      <p className="text-gray-500 text-center">
                        {search ? "No departments match your search criteria" : "Get started by creating your first department"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Results Info */}
          {filteredDepartments.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredDepartments.length}</span> of{" "}
                <span className="font-medium">{departments.length}</span> departments
              </p>
            </div>
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
                {editingDepartment ? "Edit Department" : "Add Department"}
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
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter department name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter department code (max 10 chars)"
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 font-mono"
                  maxLength={10}
                  required={!editingDepartment}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.code?.length || 0}/10 characters</p>
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
                  Manager
                </label>
                <select
                  value={formData.managerId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      managerId: e.target.value === "" ? null : e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Select Manager (optional)</option>
                  {employees.map((emp) => (
                    <option key={emp.value} value={emp.value}>
                      {emp.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
                <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                  Active Department
                </label>
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
                  (!formData.code?.trim() && !editingDepartment) || 
                  (editingDepartment
                    ? !hasPermission("departments.edit")
                    : !hasPermission("departments.create"))
                }
                className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  !formData.name.trim() || 
                  (!formData.code?.trim() && !editingDepartment) ||
                  (editingDepartment
                    ? !hasPermission("departments.edit")
                    : !hasPermission("departments.create"))
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 shadow-sm"
                }`}
              >
                {editingDepartment ? "Update Department" : "Create Department"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;