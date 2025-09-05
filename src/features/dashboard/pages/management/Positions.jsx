import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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

 // Fetch positions
const fetchPositions = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token"); // or however you store it

    const res = await axios.get(
      "https://nthaka.com/hrms/api/auth/positions/getallpositions",
      {
        params: { page, pageSize, search },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPositions(res.data.items);
    setTotal(res.data.total);
  } catch (err) {
    console.error("Failed to fetch positions:", err);
    alert("Failed to load positions.");
  } finally {
    setLoading(false);
  }
};


  // Fetch departments for dropdown
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://nthaka.com/hrms/api/auth/positions/getalldepartments",
        {
          params: { page, pageSize, search },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDepartments(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      alert("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, [page, pageSize, search]);

  // Handle form field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Open modal for new or edit
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

  // Submit create/update
  const handleSubmit = async () => {
    try {
      if (editingPosition) {
        await axios.put(`/api/positions/${editingPosition.id}`, formData);
        alert("Position updated successfully!");
      } else {
        await axios.post("/api/positions", formData);
        alert("Position created successfully!");
      }
      fetchPositions();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save position.");
    }
  };

  // Delete position
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this position?")) return;
    try {
      await axios.delete(`/api/positions/${id}`);
      alert("Position deleted successfully!");
      fetchPositions();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete position.");
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Positions</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Position
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search positions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border">Title</th>
              <th className="p-2 text-left border">Department</th>
              <th className="p-2 text-left border">Min Salary</th>
              <th className="p-2 text-left border">Max Salary</th>
              <th className="p-2 text-left border">Status</th>
              <th className="p-2 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : positions.length > 0 ? (
              positions.map((pos) => (
                <tr key={pos.id} className="border-t">
                  <td className="p-2 border">{pos.title}</td>
                  <td className="p-2 border">{pos.departmentName}</td>
                  <td className="p-2 border">{pos.minSalary}</td>
                  <td className="p-2 border">{pos.maxSalary}</td>
                  <td className="p-2 border">
                    {pos.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => openModal(pos)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pos.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No positions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingPosition ? "Edit Position" : "Add Position"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="border px-3 py-2 rounded w-full mb-2"
              rows="3"
            />
            <select
              value={formData.departmentId}
              onChange={(e) => handleChange("departmentId", e.target.value)}
              className="border px-3 py-2 rounded w-full mb-2"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Salary"
              value={formData.minSalary}
              onChange={(e) => handleChange("minSalary", e.target.value)}
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="number"
              placeholder="Max Salary"
              value={formData.maxSalary}
              onChange={(e) => handleChange("maxSalary", e.target.value)}
              className="border px-3 py-2 rounded w-full mb-2"
            />

            {/* Actions */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
