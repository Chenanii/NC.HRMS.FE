import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createOnboardingTemplate,
  updateOnboardingTemplate,
  deleteOnboardingTemplate,
  getOnboardingTemplates,
  getOnboardingTemplateById,
} from "../services/onboardingTemplatesService";
import { fetchDepartments } from "../../management/services/departmentsService";
import { fetchPositions } from "../../management/services/positionsService";
import { getUserPermissions } from "../../utilits/auth";
import { Plus, Edit, Trash2, Eye, X, AlertCircle, FileText } from "lucide-react";

const normalizeItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.result || data.data || [];
  return [];
};

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

const OnboardingTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    applicableDepartmentId: "",
    applicablePositionId: "",
    isActive: true,
    taskTemplates: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await getOnboardingTemplates(true);
      setTemplates(normalizeItems(data));
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to load templates";
      toast.error(message);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      const items = Array.isArray(data) ? data : data?.items || [];
      setDepartments(items);
    } catch (err) {
      console.error(err);
      setDepartments([]);
    }
  };

  const loadPositions = async () => {
    try {
      const data = await fetchPositions();
      const items = Array.isArray(data) ? data : data?.requestResponse?.result || [];
      setPositions(items);
    } catch (err) {
      console.error(err);
      setPositions([]);
    }
  };

  useEffect(() => {
    loadTemplates();
    loadDepartments();
    loadPositions();
  }, []);

  const openModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name || "",
        description: template.description || "",
        applicableDepartmentId: template.applicableDepartmentId || "",
        applicablePositionId: template.applicablePositionId || "",
        isActive: template.isActive ?? true,
        taskTemplates: template.taskTemplates || [],
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        description: "",
        applicableDepartmentId: "",
        applicablePositionId: "",
        isActive: true,
        taskTemplates: [],
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = async (templateId) => {
    try {
      const data = await getOnboardingTemplateById(templateId);
      setViewingTemplate(data?.result || data);
      setIsViewModalOpen(true);
    } catch (err) {
      toast.error("Failed to load template details");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingTemplate) {
        await updateOnboardingTemplate(editingTemplate.id, formData);
        toast.success("Template updated successfully");
      } else {
        await createOnboardingTemplate(formData);
        toast.success("Template created successfully");
      }
      setIsModalOpen(false);
      setEditingTemplate(null);
      loadTemplates();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to save template";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!hasPermission("onboardingtemplates.delete")) {
      toast.error("You don't have permission to delete templates");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      await deleteOnboardingTemplate(templateId);
      toast.success("Template deleted successfully");
      loadTemplates();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to delete template";
      toast.error(message);
    }
  };

  const addTaskTemplate = () => {
    setFormData({
      ...formData,
      taskTemplates: [
        ...formData.taskTemplates,
        {
          id: "",
          taskName: "",
          description: "",
          assignedTo: "Employee",
          dueDaysAfterHire: 0,
          isRequired: true,
          sortOrder: formData.taskTemplates.length,
        },
      ],
    });
  };

  const updateTaskTemplate = (index, field, value) => {
    const updated = [...formData.taskTemplates];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, taskTemplates: updated });
  };

  const removeTaskTemplate = (index) => {
    setFormData({
      ...formData,
      taskTemplates: formData.taskTemplates.filter((_, i) => i !== index),
    });
  };

  const filteredTemplates = templates.filter((template) =>
    template.name?.toLowerCase().includes(search.toLowerCase()) ||
    template.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (!hasPermission("onboardingtemplates.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view onboarding templates.</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Onboarding Templates</h1>
            <p className="text-gray-600 mt-1">Create and manage onboarding templates</p>
          </div>
          {hasPermission("onboardingtemplates.create") && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-2">Loading templates...</p>
              </div>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Tasks</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {template.description || "No description"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {template.applicableDepartmentName || template.departmentName || "All"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {template.applicablePositionName || template.positionName || "All"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {template.taskTemplates?.length || 0} tasks
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openViewModal(template.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {hasPermission("onboardingtemplates.update") && (
                            <button
                              onClick={() => openModal(template)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {hasPermission("onboardingtemplates.delete") && (
                            <button
                              onClick={() => handleDelete(template.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              {search ? "No templates match your search criteria" : "No templates found"}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTemplate(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., Standard Onboarding"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  rows="3"
                  placeholder="Template description (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable Department
                  </label>
                  <select
                    value={formData.applicableDepartmentId}
                    onChange={(e) => setFormData({ ...formData, applicableDepartmentId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable Position
                  </label>
                  <select
                    value={formData.applicablePositionId}
                    onChange={(e) => setFormData({ ...formData, applicablePositionId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="">All Positions</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Templates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Task Templates
                  </label>
                  <button
                    onClick={addTaskTemplate}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.taskTemplates.map((task, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-700">Task {index + 1}</span>
                        <button
                          onClick={() => removeTaskTemplate(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Task Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={task.taskName}
                            onChange={(e) => updateTaskTemplate(index, "taskName", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Assigned To
                          </label>
                          <select
                            value={task.assignedTo}
                            onChange={(e) => updateTaskTemplate(index, "assignedTo", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                          >
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Due Days After Hire
                          </label>
                          <input
                            type="number"
                            value={task.dueDaysAfterHire}
                            onChange={(e) => updateTaskTemplate(index, "dueDaysAfterHire", parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center pt-6">
                          <input
                            type="checkbox"
                            checked={task.isRequired}
                            onChange={(e) => updateTaskTemplate(index, "isRequired", e.target.checked)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <label className="ml-2 text-xs font-medium text-gray-700">
                            Required
                          </label>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={task.description || ""}
                            onChange={(e) => updateTaskTemplate(index, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm resize-none"
                            rows="2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.taskTemplates.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No tasks added. Click "Add Task" to create task templates.
                    </div>
                  )}
                </div>
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
                  Active Template
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTemplate(null);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.name.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  submitting || !formData.name.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 shadow-sm"
                }`}
              >
                {submitting ? "Saving..." : editingTemplate ? "Update Template" : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingTemplate && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Template Details</h2>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingTemplate(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{viewingTemplate.name}</h3>
                <p className="text-gray-600">{viewingTemplate.description || "No description"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Department:</span>
                  <p className="text-gray-900">{viewingTemplate.applicableDepartmentName || "All"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Position:</span>
                  <p className="text-gray-900">{viewingTemplate.applicablePositionName || "All"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <p className="text-gray-900">{viewingTemplate.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Tasks:</span>
                  <p className="text-gray-900">{viewingTemplate.taskTemplates?.length || 0} tasks</p>
                </div>
              </div>

              {viewingTemplate.taskTemplates && viewingTemplate.taskTemplates.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Task Templates</h4>
                  <div className="space-y-2">
                    {viewingTemplate.taskTemplates.map((task, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{task.taskName}</p>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                              <span>Assigned to: {task.assignedTo}</span>
                              <span>Due: {task.dueDaysAfterHire} days after hire</span>
                              {task.isRequired && <span className="text-green-600">Required</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingTemplate(null);
                }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTemplates;
