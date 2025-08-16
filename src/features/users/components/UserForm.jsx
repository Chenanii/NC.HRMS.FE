import React, { useState, useEffect } from "react";
import { createUser, updateUser, fetchDepartments, fetchPositions } from "../services/userService";
import { TextInput, Button, Group, Select } from "@mantine/core";

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

  useEffect(() => {
    fetchDepartments().then(res => setDepartments(res.data.result || []));
    fetchPositions().then(res => setPositions(res.data.result || []));
  }, []);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({ ...formData, ...initialData });
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
    if (isEdit) {
      await updateUser(initialData.id, formData);
    } else {
      await createUser(formData);
    }
    if (onSuccess) onSuccess();
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <TextInput label="Employee Number" name="employeeNumber" value={formData.employeeNumber} onChange={handleChange} required />
      <TextInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
      <TextInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
      <TextInput label="Email" name="email" value={formData.email} onChange={handleChange} required />
      <TextInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

      <Select
        label="Department"
        placeholder="Select department"
        data={departments.map(d => ({ value: d.id, label: d.name }))}
        value={formData.departmentId}
        onChange={value => handleSelectChange("departmentId", value)}
        required
      />

      <Select
        label="Position"
        placeholder="Select position"
        data={positions.map(p => ({ value: p.id, label: p.name }))}
        value={formData.positionId}
        onChange={value => handleSelectChange("positionId", value)}
        required
      />

      {/* ...other fields as needed... */}

      <Group position="right" mt="md">
        <Button type="submit">{isEdit ? "Update" : "Create"} Employee</Button>
      </Group>
    </form>
  );
}