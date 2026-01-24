import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCurrentEmployeeId } from "../../utilits/auth";
import {
  getEmployeeLeaveRequests,
  modifyLeaveRequest,
  getLeavePolicies,
  createLeaveRequest,
} from "../services/leaveRequestService";
import { fetchLeaveTypes } from "../services/leaveTypesService";

import { CheckIcon, XMarkIcon, ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const formatDate = (v) => (v ? new Date(v).toISOString().split("T")[0] : "");

const getStatusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("approved")) return "bg-green-100 text-green-800";
  if (s.includes("rejected")) return "bg-red-100 text-red-800";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-800";
  return "bg-blue-100 text-blue-800";
};

export default function LeaveRequestEnhancements() {
  const employeeId = getCurrentEmployeeId();

  const [requests, setRequests] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("my-requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [newLeave, setNewLeave] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    loadAll();
    loadLeaveTypes();
  }, []);

  const loadAll = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const [reqs, pol] = await Promise.all([
        getEmployeeLeaveRequests(employeeId),
        getLeavePolicies(),
      ]);
      setRequests(reqs?.data || reqs || []);
      setPolicies(pol?.data || pol || []);
    } catch {
      toast.error("Failed to load leave information");
    } finally {
      setLoading(false);
    }
  };

  const loadLeaveTypes = async () => {
    try {
      const types = await fetchLeaveTypes();
      setLeaveTypes(types || []);
    } catch {
      toast.error("Failed to load leave types");
    }
  };

  const saveEdit = async () => {
    try {
      setSubmitting(true);
      await modifyLeaveRequest(editing.id, editing);
      toast.success("Leave request updated");
      setEditing(null);
      loadAll();
    } catch {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const submitNewLeave = async (newLeave) => {
    try {
      setSubmitting(true);
      await createLeaveRequest(newLeave);
      toast.success("Leave request submitted!");
      setApplying(false);
      setActiveTab("my-requests");
      loadAll();
      setNewLeave({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
    } catch {
      toast.error("Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((r) =>
    r.leaveTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave Requests</h1>
            <p className="text-gray-600 mt-1">
              {activeTab === "my-requests"
                ? "Track your submitted leave requests and their status"
                : "Apply for a new leave"}
            </p>
          </div>
          {activeTab === "my-requests" && (
            <button
              onClick={loadAll}
              disabled={loading || submitting}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span className="ml-2">Refresh</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4">
          <button
            onClick={() => setActiveTab("my-requests")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "my-requests"
                ? "bg-green-600 text-white"
                : "bg-white border text-gray-700 hover:bg-gray-50 transition"
            }`}
          >
            My Leave Requests
          </button>
          <button
            onClick={() => setActiveTab("apply-new")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "apply-new"
                ? "bg-green-600 text-white"
                : "bg-white border text-gray-700 hover:bg-gray-50 transition"
            }`}
          >
            Apply New Leave
          </button>
        </div>

        {/* Policies */}
        {policies.length > 0 && (
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Leave Policies</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {policies.map((p) => (
                <li key={p.id}>{p.description}</li>
              ))}
            </ul>
          </div>
        )}

        {/* My Requests Table */}
        {activeTab === "my-requests" && (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            {/* Search */}
            <div className="px-6 py-4 border-b flex items-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by leave type or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full"></div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">No leave requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-3">Leave Type</th>
                      <th className="px-6 py-3">From</th>
                      <th className="px-6 py-3">To</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-900">{r.leaveTypeName}</td>
                        <td className="px-6 py-3">{formatDate(r.startDate)}</td>
                        <td className="px-6 py-3">{formatDate(r.endDate)}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center space-x-2">
                          {r.status.toLowerCase() === "pending" && (
                            <button
                              onClick={() => setEditing({ ...r })}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Apply New Leave Modal */}
        {activeTab === "apply-new" && (
          <div className="bg-white border rounded-xl shadow-sm p-6 max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Leave Request</h3>
            <div className="space-y-3">
              <select
                value={newLeave.leaveTypeId}
                onChange={(e) => setNewLeave({ ...newLeave, leaveTypeId: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((lt) => (
                  <option key={lt.id} value={lt.id}>{lt.name}</option>
                ))}
              </select>

              <input
                type="date"
                value={newLeave.startDate}
                onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              <input
                type="date"
                value={newLeave.endDate}
                onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              <textarea
                rows={3}
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                placeholder="Reason for leave..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setActiveTab("my-requests")}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={() => submitNewLeave(newLeave)}
                disabled={submitting || !newLeave.leaveTypeId || !newLeave.startDate || !newLeave.endDate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {submitting ? "Submitting..." : "Submit Leave"}
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900">Edit Leave Request</h3>

              <div className="space-y-3">
                <input
                  type="date"
                  value={formatDate(editing.startDate)}
                  onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="date"
                  value={formatDate(editing.endDate)}
                  onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                <textarea
                  value={editing.reason || ""}
                  onChange={(e) => setEditing({ ...editing, reason: e.target.value })}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
