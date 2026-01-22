import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { getCurrentEmployeeId, getUserPermissions } from "../../utilits/auth";
import {
  approveLeaveRequest,
  getPendingLeaveRequests,
  rejectLeaveRequest,
  getEmployeeLeaveRequests,
} from "../services/leaveRequestService";

// === Icons ===
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// === Helper Functions ===
const normalizeItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
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

const getStatusColor = (status) => {
  const statusLower = (status || "").toLowerCase();
  if (statusLower.includes("approved")) return "bg-green-100 text-green-800";
  if (statusLower.includes("rejected") || statusLower.includes("denied")) return "bg-red-100 text-red-800";
  if (statusLower.includes("pending")) return "bg-yellow-100 text-yellow-800";
  if (statusLower.includes("cancelled")) return "bg-gray-100 text-gray-800";
  return "bg-blue-100 text-blue-800";
};

export default function LeaveRequests() {
  const employeeId = useMemo(() => getCurrentEmployeeId(), []);
  const [activeTab, setActiveTab] = useState("my-leave-requests");
  
  // My Requests State
  const [myRequests, setMyRequests] = useState([]);
  const [myRequestsLoading, setMyRequestsLoading] = useState(false);
  const [myRequestsError, setMyRequestsError] = useState("");

  // Pending Requests State (for managers/HR)
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState("");

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check if user can manage requests
  const canManageRequests = hasPermission("leaverequests.approve") || hasPermission("leaverequests.manage");

  useEffect(() => {
    if (activeTab === "my-leave-requests") {
      loadMyRequests();
    } else if (activeTab === "pending-requests" && canManageRequests) {
      loadPendingRequests();
    }
  }, [activeTab]);

  // Load My Requests
  const loadMyRequests = async () => {
    if (!employeeId) {
      setMyRequestsError("Unable to identify your employee profile. Please log in again.");
      return;
    }

    setMyRequestsLoading(true);
    setMyRequestsError("");
    try {
      const data = await getEmployeeLeaveRequests(employeeId);
      setMyRequests(normalizeItems(data));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to load your leave requests.";
      setMyRequestsError(message);
      toast.error(message);
    } finally {
      setMyRequestsLoading(false);
    }
  };

  // Load Pending Requests
  const loadPendingRequests = async () => {
    setPendingLoading(true);
    setPendingError("");
    try {
      const data = await getPendingLeaveRequests();
      setPendingRequests(normalizeItems(data));
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to load pending requests.";
      setPendingError(message);
      toast.error(message);
    } finally {
      setPendingLoading(false);
    }
  };

  // Approve Request
  const approveRequest = async (leaveRequestId) => {
    try {
      setSubmitting(true);
      await approveLeaveRequest(leaveRequestId, comment);
      toast.success("Leave request approved successfully!");
      await loadPendingRequests();
      resetModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Approval failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reject Request
  const rejectRequest = async (leaveRequestId) => {
    try {
      if (!comment.trim()) {
        toast.error("Please provide a reason for rejection.");
        return;
      }
      setSubmitting(true);
      await rejectLeaveRequest(leaveRequestId, comment);
      toast.success("Leave request rejected.");
      await loadPendingRequests();
      resetModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Rejection failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setSelectedRequest(null);
    setComment("");
  };

  const handleRefresh = () => {
    if (activeTab === "my-leave-requests") {
      loadMyRequests();
    } else {
      loadPendingRequests();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave Requests</h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "my-leave-requests" 
                  ? "Track your submitted leave requests and their status" 
                  : "Manage and approve pending leave requests"}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={myRequestsLoading || pendingLoading}
              className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
            >
              <RefreshIcon />
              <span className="ml-2">Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("my-leave-requests")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "my-leave-requests"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Leave Requests
              </button>
              {canManageRequests && (
                <button
                  onClick={() => setActiveTab("pending-requests")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "pending-requests"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Pending Approvals
                  {pendingRequests.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "my-leave-requests" && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {myRequestsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="text-gray-500 mt-2">Loading your leave requests...</p>
                </div>
              </div>
            ) : myRequestsError ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {myRequestsError}
                </div>
              </div>
            ) : myRequests.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No leave requests found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-4">Leave Type</th>
                      <th className="px-6 py-4">From</th>
                      <th className="px-6 py-4">To</th>
                      <th className="px-6 py-4 text-center">Days</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {myRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {req.leaveTypeName || req.leaveType || req.leaveTypeId || "-"}
                        </td>
                        <td className="px-6 py-4">{formatDate(req.startDate)}</td>
                        <td className="px-6 py-4">{formatDate(req.endDate)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {req.totalDays ?? req.days ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                            {req.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {req.reason || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "pending-requests" && canManageRequests && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {pendingLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="text-gray-500 mt-2">Loading pending requests...</p>
                </div>
              </div>
            ) : pendingError ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {pendingError}
                </div>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No pending leave requests.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Leave Type</th>
                      <th className="px-6 py-4">From</th>
                      <th className="px-6 py-4">To</th>
                      <th className="px-6 py-4 text-center">Days</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {req.employeeName || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {req.leaveTypeName || req.leaveType || "-"}
                        </td>
                        <td className="px-6 py-4">{formatDate(req.startDate)}</td>
                        <td className="px-6 py-4">{formatDate(req.endDate)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {req.totalDays ?? req.days ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                            {req.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {req.reason || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => setSelectedRequest({ ...req, action: "approve" })}
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                            >
                              <CheckIcon />
                              <span className="ml-1">Approve</span>
                            </button>
                            <button
                              onClick={() => setSelectedRequest({ ...req, action: "reject" })}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                            >
                              <XIcon />
                              <span className="ml-1">Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval/Rejection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedRequest.action === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
              </h2>
              <button
                onClick={resetModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Request Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Employee:</span>
                    <p className="text-gray-900">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Leave Type:</span>
                    <p className="text-gray-900">{selectedRequest.leaveTypeName || selectedRequest.leaveType}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">From:</span>
                    <p className="text-gray-900">{formatDate(selectedRequest.startDate)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">To:</span>
                    <p className="text-gray-900">{formatDate(selectedRequest.endDate)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Total Days:</span>
                    <p className="text-gray-900">{selectedRequest.totalDays}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <p className="text-gray-900">{selectedRequest.status}</p>
                  </div>
                </div>
                {selectedRequest.reason && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-700 text-sm">Reason:</span>
                    <p className="text-gray-900 text-sm mt-1">{selectedRequest.reason}</p>
                  </div>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedRequest.action === "approve" ? "Comments (optional)" : "Reason for Rejection"}
                  {selectedRequest.action === "reject" && <span className="text-red-500"> *</span>}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    selectedRequest.action === "approve"
                      ? "Add any comments about this approval..."
                      : "Please provide a reason for rejection..."
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={resetModal}
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              {selectedRequest.action === "approve" ? (
                <button
                  onClick={() => approveRequest(selectedRequest.id)}
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium disabled:opacity-50 shadow-sm"
                >
                  {submitting ? "Approving..." : "Confirm Approval"}
                </button>
              ) : (
                <button
                  onClick={() => rejectRequest(selectedRequest.id)}
                  disabled={submitting || !comment.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:ring-4 focus:ring-red-200 transition-all duration-200 font-medium disabled:opacity-50 shadow-sm"
                >
                  {submitting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}