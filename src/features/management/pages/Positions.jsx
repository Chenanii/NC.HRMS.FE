import React, { useEffect, useState } from "react";
import {
  fetchPositions,
  fetchDepartments,
  createPosition,
  updatePosition,
  deletePosition,
} from "../services/positionsService";

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

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentId: "",
    minSalary: "",
    maxSalary: "",
    isActive: true,
  });

  const loadPositions = async () => {
    setLoading(true);
    try {
      const data = await fetchPositions();
      const items = Array.isArray(data) ? data : data?.items || [];
      setPositions(items);
      setTotal(data?.total || items.length);
    } catch (err) {
      console.error(err);
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      const deptArray = Array.isArray(data) ? data : data?.items || []; 
      setDepartments(deptArray.map((d) => ({ value: d.id, label: d.name })));
    } catch (err) {
      console.error("Error loading departments:", err);
      setDepartments([]);
    }
  };

  useEffect(() => {
    loadPositions();
    loadDepartments();
  }, [page, search]);

  const openModal = (position = null) => {
    if (position) {
      setEditingPosition(position);
      setFormData({
        title: position.title,
        description: position.description,
        departmentId: position.departmentId,
        minSalary: position.minSalary,
        maxSalary: position.maxSalary,
        isActive: position.isActive,
      });
    } else {
      setEditingPosition(null);
      setFormData({
        title: "",
        description: "",
        departmentId: "",
        minSalary: "",
        maxSalary: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingPosition) {
        if (!hasPermission("positions.edit")) return alert("You don’t have permission to edit positions.");
        await updatePosition(editingPosition.id, formData);
      } else {
        if (!hasPermission("positions.create")) return alert("You don’t have permission to create positions.");
        await createPosition(formData);
      }
      loadPositions();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!hasPermission("positions.delete")) return alert("You don’t have permission to delete positions.");
    if (!window.confirm("Are you sure you want to delete this position?")) return;
    try {
      await deletePosition(id);
      loadPositions();
    } catch (err) {
      console.error(err);
    }
  };

  // If user doesn’t have view permission
  if (!hasPermission("positions.view")) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        You do not have permission to view positions.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Positions</h1>
        {hasPermission("positions.create") && (
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Position
          </button>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search positions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-6 animate-pulse text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Min Salary</th>
                <th className="px-4 py-3">Max Salary</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.length ? (
                positions.map((pos) => (
                  <tr key={pos.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{pos.title}</td>
                    <td className="px-4 py-3">{pos.departmentName}</td>
                    <td className="px-4 py-3">{pos.minSalary}</td>
                    <td className="px-4 py-3">{pos.maxSalary}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          pos.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pos.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {hasPermission("positions.edit") && (
                        <button
                          onClick={() => openModal(pos)}
                          className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                        >
                          Edit
                        </button>
                      )}
                      {hasPermission("positions.delete") && (
                        <button
                          onClick={() => handleDelete(pos.id)}
                          className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No positions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

 {/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg transform transition-all animate-[fadeIn_0.3s_ease-out,slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center border-b px-6 py-3">
        <h2 className="text-lg font-semibold">
          {editingPosition ? "Edit Position" : "Add Position"}
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <div className="p-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Salary"
          value={formData.minSalary}
          onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="number"
          placeholder="Max Salary"
          value={formData.maxSalary}
          onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span>Active</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 border-t px-6 py-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 rounded border hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={
            editingPosition
              ? !hasPermission("positions.edit")
              : !hasPermission("positions.create")
          }
          className={`px-4 py-2 rounded text-white transition ${
            editingPosition
              ? hasPermission("positions.edit")
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
              : hasPermission("positions.create")
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Positions;
