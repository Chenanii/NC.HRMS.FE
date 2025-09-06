import React, { useEffect, useState } from "react";
import {
  fetchLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../services/leaveTypesService";
import { getUserPermissions } from "../../utilits/auth";


// Icons (same as in departments page)
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

const LeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
  });

  const loadLeaveTypes = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaveTypes();
      const items = Array.isArray(data) ? data : data?.items || [];
      setLeaveTypes(items);
      setTotal(data?.total || items.length);
    } catch (err) {
      console.error(err);
      setLeaveTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveTypes();
  }, [page, search]);

  const openModal = (leaveType = null) => {
    if (leaveType) {
      setEditingLeaveType(leaveType);
      setFormData({
        name: leaveType.name || "",
        code: leaveType.code || "",
        description: leaveType.description || "",
        isActive: leaveType.isActive ?? true,
      });
    } else {
      setEditingLeaveType(null);
      setFormData({
        name: "",
        code: "",
        description: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingLeaveType) {
        if (hasPermission("leave-types.edit")) return alert("You don't have permission to edit leave types.");
        const updateData = { ...formData };
        await updateLeaveType(editingLeaveType.id, updateData);
      } else {
        if (hasPermission("leave-types.create")) return alert("You don't have permission to create leave types.");
        const createData = { ...formData };
        await createLeaveType(createData);
      }
      loadLeaveTypes();
      setIsModalOpen(false);
      alert(`Leave type ${editingLeaveType ? "updated" : "created"} successfully.`);
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the leave type.");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("leave-types.delete")) return alert("You don't have permission to delete leave types.");
    if (!window.confirm("Are you sure you want to delete this leave type?")) return;
    try {
      await deleteLeaveType(id);
      loadLeaveTypes();
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the leave type.");
    }
  };

  // Filter leave types based on search
  const filteredLeaveTypes = leaveTypes.filter(type =>
    type.name?.toLowerCase().includes(search.toLowerCase()) ||
    type.description?.toLowerCase().includes(search.toLowerCase())
  );

  // No view permission
  if (!hasPermission("leave-types.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view leave types.</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave Types</h1>
              <p className="text-gray-600 mt-1">Manage types of employee leave</p>
            </div>
            {hasPermission("leave-types.create") && (
              <button
                onClick={() => openModal()}
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
              >
                <PlusIcon />
                <span className="ml-2">Add Leave Type</span>
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
              placeholder="Search leave types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Table + Mobile Cards (same structure as departments, but showing leave type info) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-2">Loading leave types...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeaveTypes.length ? (
                      filteredLeaveTypes.map((type, index) => {
                        const count = (page - 1) * pageSize + index + 1;
                        return (
                          <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">{count}</td>
                            <td className="px-6 py-4 font-medium">{type.name}</td>
                            <td className="px-6 py-4 font-mono text-sm text-gray-600">{type.code}</td>
                            <td className="px-6 py-4 text-gray-600">{type.description || "No description"}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  type.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {type.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {type.createdAt ? new Date(type.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                {hasPermission("leave-types.edit") && (
                                  <button
                                    onClick={() => openModal(type)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  >
                                    <EditIcon />
                                  </button>
                                )}
                                {hasPermission("leave-types.delete") && (
                                  <button
                                    onClick={() => handleDelete(type.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                          No leave types found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">
                {editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter leave type name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter leave type code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                  Active Leave Type
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700"
              >
                {editingLeaveType ? "Update Leave Type" : "Create Leave Type"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTypes;
