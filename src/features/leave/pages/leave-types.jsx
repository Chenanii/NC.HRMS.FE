import React, { useEffect, useState } from "react";
import {
  fetchLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../services/leaveTypesService";

import { getUserPermissions } from "../../utilits/auth";

import { Check, X, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultDaysPerYear: 0,
    maxConsecutiveDays: 0,
    requireManagerApproval: true,
    requireHRApproval: false,
    isPaid: true,
    isCarryForward: false,
    maxCarryForwardDays: 0,
    isActive: true,
  });

  const loadLeaveTypes = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaveTypes();
      const items = Array.isArray(data) ? data : data?.items || [];
      setLeaveTypes(items);
    } catch (err) {
      console.error(err);
      setLeaveTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const openModal = (leaveType = null) => {
    if (leaveType) {
      setEditingLeaveType(leaveType);
      setFormData({
        name: leaveType.name || "",
        description: leaveType.description || "",
        defaultDaysPerYear: leaveType.defaultDaysPerYear ?? 0,
        maxConsecutiveDays: leaveType.maxConsecutiveDays ?? 0,
        requireManagerApproval: leaveType.requireManagerApproval ?? true,
        requireHRApproval: leaveType.requireHRApproval ?? false,
        isPaid: leaveType.isPaid ?? true,
        isCarryForward: leaveType.isCarryForward ?? false,
        maxCarryForwardDays: leaveType.maxCarryForwardDays ?? 0,
        isActive: leaveType.isActive ?? true,
      });
    } else {
      setEditingLeaveType(null);
      setFormData({
        name: "",
        description: "",
        defaultDaysPerYear: 0,
        maxConsecutiveDays: 0,
        requireManagerApproval: true,
        requireHRApproval: false,
        isPaid: true,
        isCarryForward: false,
        maxCarryForwardDays: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingLeaveType) {
        if (!hasPermission("leavetypes.edit")) return alert("You don't have permission to edit leave types.");
        await updateLeaveType(editingLeaveType.id, formData);
        alert("Leave type updated successfully!");
      } else {
        if (!hasPermission("leavetypes.create")) return alert("You don't have permission to create leave types.");
        await createLeaveType(formData);
        alert("Leave type created successfully!");
      }
      loadLeaveTypes();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the leave type.");
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("leavetypes.delete")) return alert("You don't have permission to delete leave types.");
    if (!window.confirm("Are you sure you want to delete this leave type?")) return;
    try {
      await deleteLeaveType(id);
      alert("Leave type deleted successfully!");
      loadLeaveTypes();
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the leave type.");
    }
  };

  // Filter leave types
  const filteredLeaveTypes = leaveTypes.filter((type) =>
    type.name?.toLowerCase().includes(search.toLowerCase()) ||
    type.description?.toLowerCase().includes(search.toLowerCase())
  );

  // View permission check
  if (!hasPermission("leavetypes.view")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 py-12">
            You don't have permission to view leave types.
          </div>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave Types</h1>
            <p className="text-gray-600 mt-1">Manage leave categories and their configurations</p>
          </div>
          {hasPermission("leavetypes.create") && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
            >
              <PlusIcon />
              <span className="ml-2">Add Leave Type</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-2">Loading leave types...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-center">Days/Year</th>
                    <th className="px-6 py-4 text-center">Max Days</th>
                    <th className="px-6 py-4 text-center">Approvals</th>
                    <th className="px-6 py-4 text-center">Type</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeaveTypes.length ? (
                    filteredLeaveTypes.map((type) => (
                      <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{type.name}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{type.description}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {type.defaultDaysPerYear}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {type.maxConsecutiveDays}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center flex-wrap">
                            {type.requireManagerApproval && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">Manager</span>
                            )}
                            {type.requireHRApproval && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">HR</span>
                            )}
                            {!type.requireManagerApproval && !type.requireHRApproval && (
                              <span className="text-gray-400 text-xs">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center flex-wrap">
                            {type.isPaid && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Paid</span>
                            )}
                            {type.isCarryForward && (
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                                CF: {type.maxCarryForwardDays}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            type.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {type.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {hasPermission("leavetypes.edit") && (
                              <button
                                onClick={() => openModal(type)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Edit"
                              >
                                <EditIcon />
                              </button>
                            )}
                            {hasPermission("leavetypes.delete") && (
                              <button
                                onClick={() => handleDelete(type.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <TrashIcon />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        No leave types found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., Annual Leave"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Brief description of this leave type"
                />
              </div>

              {/* Numbers Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Days Per Year
                  </label>
                  <input
                    type="number"
                    value={formData.defaultDaysPerYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defaultDaysPerYear: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Consecutive Days
                  </label>
                  <input
                    type="number"
                    value={formData.maxConsecutiveDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxConsecutiveDays: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                    min="0"
                  />
                </div>
              </div>

              {/* Toggles Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-base">Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.requireManagerApproval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requireManagerApproval: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-700">Require Manager Approval</span>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.requireHRApproval}
                      onChange={(e) =>
                        setFormData({ ...formData, requireHRApproval: e.target.checked })
                      }
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-700">Require HR Approval</span>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isPaid}
                      onChange={(e) =>
                        setFormData({ ...formData, isPaid: e.target.checked })
                      }
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-700">Paid Leave</span>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isCarryForward}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isCarryForward: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="font-medium text-gray-700">Allow Carry Forward</span>
                  </label>
                </div>
              </div>

              {formData.isCarryForward && (
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Carry Forward Days
                  </label>
                  <input
                    type="number"
                    value={formData.maxCarryForwardDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCarryForwardDays: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                    min="0"
                  />
                </div>
              )}

              <div className="pt-4 border-t">
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="font-medium text-gray-700">Active Status</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  !formData.name.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 shadow-sm"
                }`}
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