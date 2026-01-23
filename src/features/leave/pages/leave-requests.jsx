import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  approveLeaveRequest,
  getPendingLeaveRequests,
} from "../services/leaveRequestService";
import { CheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

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

const getStatusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("approved")) return "bg-green-100 text-green-800";
  if (s.includes("rejected")) return "bg-red-100 text-red-800";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

export default function LeaveRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending-requests");

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const data = await getPendingLeaveRequests();
      setPendingRequests(normalizeItems(data));
      setError("");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to load leave requests";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      setSubmitting(true);
      await approveLeaveRequest(id, comment);
      toast.success("Leave request approved.");
      await fetchPendingRequests();
      resetModal();
    } catch (err) {
      toast.error(err?.message || "Approval failed");
    } finally {
      setSubmitting(false);
    }
  };

  const rejectRequest = async (id) => {
    if (!comment.trim()) return toast.error("Please provide a reason.");
    try {
      setSubmitting(true);
      await approveLeaveRequest(id, comment, false); 
      toast.success("Leave request rejected.");
      await fetchPendingRequests();
      resetModal();
    } catch (err) {
      toast.error(err?.message || "Rejection failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setSelectedRequest(null);
    setComment("");
  };

  const filteredRequests = pendingRequests.filter((req) =>
    [req.employeeName, req.leaveTypeName, req.status]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave Requests</h1>
            <p className="text-gray-600 mt-1">Manage and approve pending leave requests</p>
          </div>
          <button
            onClick={fetchPendingRequests}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
          >
            <  ArrowPathIcon className="h-5 w-5" />
            <span className="ml-2">Refresh</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by employee, leave type or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Pending Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="text-gray-500 mt-2">Loading pending requests...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">No pending leave requests.</div>
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
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{req.employeeName}</td>
                      <td className="px-6 py-4">{req.leaveTypeName || req.leaveType}</td>
                      <td className="px-6 py-4">{formatDate(req.startDate)}</td>
                      <td className="px-6 py-4">{formatDate(req.endDate)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{req.totalDays}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>{req.status}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{req.reason || "-"}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedRequest({ ...req, action: "approve" })}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span className="ml-1">Approve</span>
                        </button>
                        <button
                          onClick={() => setSelectedRequest({ ...req, action: "reject" })}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                        >
                          <XIcon className="h-4 w-4" />
                          <span className="ml-1">Reject</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Approval/Rejection Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedRequest.action === "approve" ? "Approve Leave Request" : "Reject Leave Request"}
                </h2>
                <button onClick={resetModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" disabled={submitting}>
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedRequest.action === "approve" ? "Comments (optional)" : "Reason for Rejection"}
                    {selectedRequest.action === "reject" && <span className="text-red-500"> *</span>}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={selectedRequest.action === "approve" ? "Add comments..." : "Provide a reason..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4">
                <button
                  onClick={resetModal}
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                {selectedRequest.action === "approve" ? (
                  <button
                    onClick={() => approveRequest(selectedRequest.id)}
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 shadow-sm"
                  >
                    {submitting ? "Approving..." : "Confirm Approval"}
                  </button>
                ) : (
                  <button
                    onClick={() => rejectRequest(selectedRequest.id)}
                    disabled={submitting || !comment.trim()}
                    className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 shadow-sm"
                  >
                    {submitting ? "Rejecting..." : "Confirm Rejection"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
