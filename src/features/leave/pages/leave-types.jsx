import React, { useEffect, useState } from "react";
import {
  fetchLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../services/leaveTypesService";
import { getUserPermissions } from "../../utilits/auth";


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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view leave types.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Types</h1>
        {hasPermission("leavetypes.create") && (
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Leave Type
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Days/Year</th>
                <th className="px-4 py-2">Consecutive Max</th>
                <th className="px-4 py-2">Manager Approval</th>
                <th className="px-4 py-2">HR Approval</th>
                <th className="px-4 py-2">Paid</th>
                <th className="px-4 py-2">Carry Forward</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.length ? (
                leaveTypes.map((type) => (
                  <tr key={type.id} className="border-b">
                    <td className="px-4 py-2">{type.name}</td>
                    <td className="px-4 py-2">{type.description}</td>
                    <td className="px-4 py-2">{type.defaultDaysPerYear}</td>
                    <td className="px-4 py-2">{type.maxConsecutiveDays}</td>
                    <td className="px-4 py-2">{type.requireManagerApproval ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{type.requireHRApproval ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{type.isPaid ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">
                      {type.isCarryForward ? `Yes (${type.maxCarryForwardDays})` : "No"}
                    </td>
                    <td className="px-4 py-2">{type.isActive ? "Active" : "Inactive"}</td>
                    <td className="px-4 py-2 space-x-2">
                      {hasPermission("leavetypes.edit") && (
                        <button
                          onClick={() => openModal(type)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      )}
                      {hasPermission("leavetypes.delete") && (
                        <button
                          onClick={() => handleDelete(type.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 py-6 text-center text-gray-500">
                    No leave types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingLeaveType ? "Edit Leave Type" : "Add Leave Type"}
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                rows={3}
              />
            </div>

            {/* Numbers Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requireManagerApproval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requireManagerApproval: e.target.checked,
                    })
                  }
                />
                <span>Require Manager Approval</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requireHRApproval}
                  onChange={(e) =>
                    setFormData({ ...formData, requireHRApproval: e.target.checked })
                  }
                />
                <span>Require HR Approval</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) =>
                    setFormData({ ...formData, isPaid: e.target.checked })
                  }
                />
                <span>Paid Leave</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isCarryForward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isCarryForward: e.target.checked,
                    })
                  }
                />
                <span>Carry Forward</span>
              </label>
            </div>

            {formData.isCarryForward && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            )}

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <span>Active</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {editingLeaveType ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};

export default LeaveTypes;
