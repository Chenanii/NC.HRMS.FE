import React, { useEffect, useState } from "react";
import {
  fetchLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../services/leaveTypesService";

import { getUserPermissions } from "../../utilits/auth";

import { Check, X, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";

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
      } else {
        if (!hasPermission("leavetypes.create")) return alert("You don't have permission to create leave types.");
        await createLeaveType(formData);
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
      loadLeaveTypes();
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the leave type.");
    }
  };

  // View permission check
  if (!hasPermission("leavetypes.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md mx-4 border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view leave types.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Leave Types</h1>
            <p className="text-gray-600">Manage leave categories and their configurations</p>
          </div>
          {hasPermission("leavetypes.create") && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Leave Type
            </button>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading leave types...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Days/Year</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Max Days</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Approvals</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveTypes.length ? (
                    leaveTypes.map((type) => (
                      <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{type.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{type.description}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            {type.defaultDaysPerYear}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                            {type.maxConsecutiveDays}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {type.requireManagerApproval && (
                              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">Manager</span>
                            )}
                            {type.requireHRApproval && (
                              <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">HR</span>
                            )}
                            {!type.requireManagerApproval && !type.requireHRApproval && (
                              <span className="text-gray-400 text-xs">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {type.isPaid && (
                              <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Paid</span>
                            )}
                            {type.isCarryForward && (
                              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                CF: {type.maxCarryForwardDays}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {type.isActive ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              <X className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {hasPermission("leavetypes.edit") && (
                              <button
                                onClick={() => openModal(type)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission("leavetypes.delete") && (
                              <button
                                onClick={() => handleDelete(type.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">No leave types found</p>
                          <p className="text-gray-400 text-sm mt-1">Get started by creating your first leave type</p>
                        </div>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingLeaveType ? "Edit Leave Type" : "Create Leave Type"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leave Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="e.g., Annual Leave"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none"
                  rows={3}
                  placeholder="Brief description of this leave type"
                />
              </div>

              {/* Numbers Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    min="0"
                  />
                </div>
              </div>

              {/* Toggles Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-base">Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.requireManagerApproval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requireManagerApproval: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">Require Manager Approval</span>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.requireHRApproval}
                      onChange={(e) =>
                        setFormData({ ...formData, requireHRApproval: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">Require HR Approval</span>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isPaid}
                      onChange={(e) =>
                        setFormData({ ...formData, isPaid: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">Paid Leave</span>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isCarryForward}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isCarryForward: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-gray-700">Allow Carry Forward</span>
                  </label>
                </div>
              </div>

              {formData.isCarryForward && (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    min="0"
                  />
                </div>
              )}

              <div className="pt-4 border-t">
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-gray-700">Active Status</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-6 border-t bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-white transition-all font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none font-medium"
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