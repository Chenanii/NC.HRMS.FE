import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchLeaveTypes } from "../services/leaveTypesService";
import { createLeaveRequest } from "../services/leaveRequestService";
import { getCurrentEmployeeId } from "../../utilits/auth";

const Spinner = ({ label }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
    {label}
  </div>
);

const LeaveRequest = () => {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    const loadLeaveTypes = async () => {
      try {
        const data = await fetchLeaveTypes();
        const items = Array.isArray(data) ? data : data?.items || [];
        setLeaveTypes(items);
      } catch {
        setError("Failed to load leave types.");
      } finally {
        setLoadingTypes(false);
      }
    };

    loadLeaveTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.leaveTypeId || !form.startDate || !form.endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date must be the same as or after the start date.");
      return;
    }

    try {
      setSubmitting(true);

      const employeeId = getCurrentEmployeeId();
      if (!employeeId) {
        setError("Unable to identify current user. Please log in again.");
        return;
      }

      // Format dates to ISO 8601 DateTime format (required by backend)
      const startDateTime = form.startDate ? new Date(form.startDate).toISOString() : null;
      const endDateTime = form.endDate ? new Date(form.endDate).toISOString() : null;

      const payload = {
        employeeId: employeeId,
        leaveTypeId: form.leaveTypeId,
        startDate: startDateTime,
        endDate: endDateTime,
        reason: form.reason || null,
      };

      await createLeaveRequest(payload);

      toast.success("Leave request submitted.");
      setForm({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
      navigate("/dashboard/leave/my-leave-requests");
    } catch (e) {
      const errorMessage = 
        typeof e.response?.data === "string" 
          ? e.response.data 
          : e.response?.data?.message || e.message || "Failed to submit leave request.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Create Leave Request
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Leave Type <span className="text-red-500">*</span>
          </label>
          {loadingTypes ? (
            <Spinner label="Loading leave types..." />
          ) : (
            <select
              value={form.leaveTypeId}
              onChange={(e) =>
                setForm({ ...form, leaveTypeId: e.target.value })
              }
              disabled={submitting}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select leave type</option>
              {leaveTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              disabled={submitting}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              disabled={submitting}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Reason (optional)
          </label>
          <textarea
            rows={3}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            disabled={submitting}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            placeholder="Brief reason for leave"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequest;