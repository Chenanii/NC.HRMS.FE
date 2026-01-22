import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  approveLeaveRequest,
  getPendingLeaveRequests,
  rejectLeaveRequest,
} from "../services/leaveRequestService";

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


export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const data = await getPendingLeaveRequests();
      setLeaveRequests(normalizeItems(data));
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

  const approveRequest = async (leaveRequestId) => {
    try {
      setSubmitting(true);
      await approveLeaveRequest(leaveRequestId, comment);
      toast.success("Leave request approved.");
      await fetchPendingRequests();
      resetModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Approval failed";
      toast.error(message);
    }
    setSubmitting(false);
  };

  const rejectRequest = async (leaveRequestId) => {
    try {
      if (!comment.trim()) {
        toast.error("Please provide a reason for rejection.");
        return;
      }
      setSubmitting(true);
      await rejectLeaveRequest(leaveRequestId, comment);
      toast.success("Leave request rejected.");
      await fetchPendingRequests();
      resetModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Rejection failed";
      toast.error(message);
    }
    setSubmitting(false);
  };

  const resetModal = () => {
    setSelectedRequest(null);
    setComment("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Leave Requests Management</h2>

      {loading && <p>Loading leave requests...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && leaveRequests.length === 0 && (
        <p>No pending leave requests.</p>
      )}

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Leave Type</th>
            <th className="border p-2">From</th>
            <th className="border p-2">To</th>
            <th className="border p-2">Days</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((req) => (
            <tr key={req.id}>
              <td className="border p-2">{req.employeeName}</td>
              <td className="border p-2">{req.leaveTypeName || req.leaveType}</td>
              <td className="border p-2">{formatDate(req.startDate)}</td>
              <td className="border p-2">{formatDate(req.endDate)}</td>
              <td className="border p-2">{req.totalDays}</td>
              <td className="border p-2">{req.status}</td>
              <td className="border p-2 flex gap-2">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => setSelectedRequest({ ...req, action: "approve" })}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => setSelectedRequest({ ...req, action: "reject" })}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Approval / Rejection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-semibold mb-2">
              {selectedRequest.action === "approve"
                ? "Approve Leave Request"
                : "Reject Leave Request"}
            </h3>

            <textarea
              className="w-full border p-2 mb-4"
              placeholder={
                selectedRequest.action === "approve"
                  ? "Approval comments (optional)"
                  : "Reason for rejection"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={resetModal}
                disabled={submitting}
              >
                Cancel
              </button>

              {selectedRequest.action === "approve" ? (
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => approveRequest(selectedRequest.id)}
                  disabled={submitting}
                >
                  {submitting ? "Approving..." : "Confirm Approve"}
                </button>
              ) : (
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => rejectRequest(selectedRequest.id)}
                  disabled={submitting}
                >
                  {submitting ? "Rejecting..." : "Confirm Reject"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
