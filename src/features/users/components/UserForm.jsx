import React, { useState, useEffect } from "react";
import { createUser, updateUser, fetchDepartments, fetchPositions } from "../services/userService";
import { TextInput, Button, Group, Select } from "@mantine/core";
import toast from "react-hot-toast";

const normalizeItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

export default function UserForm({ onSuccess, initialData, isEdit }) {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    positionId: "",
    // ...other fields
  });

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoadingLookups(true);
      setError("");
      try {
        const [deptData, posData] = await Promise.all([fetchDepartments(), fetchPositions()]);
        setDepartments(normalizeItems(deptData));
        setPositions(normalizeItems(posData));
      } catch (e) {
        const message =
          e?.response?.data?.message ||
          (typeof e?.response?.data === "string" ? e.response.data : "") ||
          e?.message ||
          "Failed to load form data.";
        setError(message);
      } finally {
        setLoadingLookups(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (isEdit) {
        await updateUser(initialData.id, formData);
        toast.success("Employee updated.");
      } else {
        await createUser(formData);
        toast.success("Employee created.");
      }
      if (onSuccess) onSuccess();
    } catch (e2) {
      const message =
        e2?.response?.data?.message ||
        (typeof e2?.response?.data === "string" ? e2.response.data : "") ||
        e2?.message ||
        "Save failed.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      {error && (
        <div style={{ marginBottom: 12, color: "#b91c1c" }}>
          {error}
        </div>
      )}
      <TextInput label="Employee Number" name="employeeNumber" value={formData.employeeNumber} onChange={handleChange} required />
      <TextInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
      <TextInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
      <TextInput label="Email" name="email" value={formData.email} onChange={handleChange} required />
      <TextInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

      <Select
        label="Department"
        placeholder="Select department"
        data={departments.map(d => ({ value: String(d.id), label: d.name }))}
        value={formData.departmentId}
        onChange={value => handleSelectChange("departmentId", value)}
        required
        disabled={loadingLookups || submitting}
      />

      <Select
        label="Position"
        placeholder="Select position"
        data={positions.map(p => ({ value: String(p.id), label: p.name }))}
        value={formData.positionId}
        onChange={value => handleSelectChange("positionId", value)}
        required
        disabled={loadingLookups || submitting}
      />

      {/* ...other fields as needed... */}

      <Group position="right" mt="md">
        <Button type="submit" loading={submitting} disabled={loadingLookups}>
          {isEdit ? "Update" : "Create"} Employee
        </Button>
      </Group>
    </form>
  );
}