import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  completeTask,
  getEmployeeOnboardingTasks,
  getOverdueTasks,
  updateTask,
  reopenTask,
  getEmployeeOnboardingProgress,
  bulkCompleteTasks,
  getOnboardingReport,
} from "../services/onboardingTasksService";
import { fetchEmployees } from "../../management/services/employeesService";
import { getUserPermissions } from "../../utilits/auth";
import { CheckCircle, Clock, AlertCircle, RefreshCw, X, Edit, FileText } from "lucide-react";

const normalizeItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.result || data.data || [];
  return [];
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const getStatusColor = (status) => {
  const statusLower = (status || "").toLowerCase();
  if (statusLower.includes("completed") || statusLower.includes("done")) return "bg-green-100 text-green-800";
  if (statusLower.includes("overdue")) return "bg-red-100 text-red-800";
  if (statusLower.includes("pending") || statusLower.includes("in progress")) return "bg-yellow-100 text-yellow-800";
  return "bg-blue-100 text-blue-800";
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

const OnboardingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [progress, setProgress] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalAction, setModalAction] = useState(""); // "complete", "update", "reopen"
  const [formData, setFormData] = useState({
    notes: "",
    newDueDate: "",
    assignedToUserId: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      const items = Array.isArray(data) ? data : data?.items || [];
      setEmployees(items);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    }
  };

  const loadTasks = async () => {
    if (!selectedEmployee) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getEmployeeOnboardingTasks(selectedEmployee);
      setTasks(normalizeItems(data));
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to load tasks";
      toast.error(message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadOverdueTasks = async () => {
    try {
      const data = await getOverdueTasks();
      setOverdueTasks(normalizeItems(data));
    } catch (err) {
      console.error(err);
      setOverdueTasks([]);
    }
  };

  const loadProgress = async () => {
    if (!selectedEmployee) return;
    try {
      const data = await getEmployeeOnboardingProgress(selectedEmployee);
      setProgress(data?.result || data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadOverdueTasks();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadTasks();
      loadProgress();
    }
  }, [selectedEmployee]);

  const handleCompleteTask = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      await completeTask(selectedTask.id, {
        notes: formData.notes,
      });
      toast.success("Task completed successfully");
      setIsModalOpen(false);
      setSelectedTask(null);
      setFormData({ notes: "", newDueDate: "", assignedToUserId: "", reason: "" });
      loadTasks();
      loadProgress();
      loadOverdueTasks();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to complete task";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      await updateTask(selectedTask.id, {
        assignedToUserId: formData.assignedToUserId,
        newDueDate: formData.newDueDate,
        notes: formData.notes,
      });
      toast.success("Task updated successfully");
      setIsModalOpen(false);
      setSelectedTask(null);
      setFormData({ notes: "", newDueDate: "", assignedToUserId: "", reason: "" });
      loadTasks();
      loadOverdueTasks();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to update task";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopenTask = async () => {
    if (!selectedTask) return;
    if (!formData.reason.trim()) {
      toast.error("Please provide a reason for reopening");
      return;
    }
    setSubmitting(true);
    try {
      await reopenTask(selectedTask.id, {
        reason: formData.reason,
      });
      toast.success("Task reopened successfully");
      setIsModalOpen(false);
      setSelectedTask(null);
      setFormData({ notes: "", newDueDate: "", assignedToUserId: "", reason: "" });
      loadTasks();
      loadProgress();
      loadOverdueTasks();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to reopen task";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (task, action) => {
    setSelectedTask(task);
    setModalAction(action);
    setIsModalOpen(true);
    setFormData({ notes: "", newDueDate: "", assignedToUserId: "", reason: "" });
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "completed") return task.status?.toLowerCase().includes("completed");
    if (activeTab === "pending") return !task.status?.toLowerCase().includes("completed");
    return true;
  });

  if (!hasPermission("onboardingtasks.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view onboarding tasks.</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Onboarding Tasks</h1>
              <p className="text-gray-600 mt-1">Manage employee onboarding tasks and progress</p>
            </div>
            <button
              onClick={() => {
                if (selectedEmployee) {
                  loadTasks();
                  loadProgress();
                }
                loadOverdueTasks();
              }}
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  {overdueTasks.length} overdue task(s)
                </h3>
                <p className="text-sm text-red-700">
                  Review and update overdue onboarding tasks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Employee Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Employee
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="">Select an employee to view tasks</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.employeeNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Progress Card */}
        {selectedEmployee && progress && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Progress</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${progress.completionPercentage || 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {progress.completedTasks || 0} / {progress.totalTasks || 0} tasks completed
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        {selectedEmployee && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "all"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "pending"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "completed"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Completed
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Tasks Table */}
        {selectedEmployee ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="text-gray-500 mt-2">Loading tasks...</p>
                </div>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-4">Task Name</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Assigned To</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {task.taskName || task.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {task.description || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(task.dueDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {task.assignedToName || task.assignedTo || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {!task.status?.toLowerCase().includes("completed") && hasPermission("onboardingtasks.complete") && (
                              <button
                                onClick={() => openModal(task, "complete")}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Complete"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission("onboardingtasks.update") && (
                              <button
                                onClick={() => openModal(task, "update")}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Update"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {task.status?.toLowerCase().includes("completed") && hasPermission("onboardingtasks.reopen") && (
                              <button
                                onClick={() => openModal(task, "reopen")}
                                className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                title="Reopen"
                              >
                                <RefreshCw className="w-4 h-4" />
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
                No tasks found
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Employee</h3>
            <p className="text-gray-500">Please select an employee from the dropdown above to view their onboarding tasks.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalAction === "complete" && "Complete Task"}
                {modalAction === "update" && "Update Task"}
                {modalAction === "reopen" && "Reopen Task"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTask(null);
                  setFormData({ notes: "", newDueDate: "", assignedToUserId: "", reason: "" });
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-1">{selectedTask.taskName || selectedTask.name}</p>
                <p className="text-sm text-gray-600">{selectedTask.description || "No description"}</p>
              </div>

              {modalAction === "complete" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Add completion notes..."
                  />
                </div>
              )}

              {modalAction === "update" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.newDueDate}
                      onChange={(e) => setFormData({ ...formData, newDueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                      rows={4}
                      placeholder="Add update notes..."
                    />
                  </div>
                </>
              )}

              {modalAction === "reopen" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Reopening <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Please provide a reason for reopening this task..."
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTask(null);
                  setFormData({ notes: "", newDueDate: "", assignedToUserId: "", reason: "" });
                }}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (modalAction === "complete") handleCompleteTask();
                  else if (modalAction === "update") handleUpdateTask();
                  else if (modalAction === "reopen") handleReopenTask();
                }}
                disabled={submitting || (modalAction === "reopen" && !formData.reason.trim())}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium disabled:opacity-50 shadow-sm"
              >
                {submitting ? "Processing..." : modalAction === "complete" ? "Complete Task" : modalAction === "update" ? "Update Task" : "Reopen Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTasks;
