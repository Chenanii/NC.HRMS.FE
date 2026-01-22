import React, { useEffect, useState } from "react";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  terminateEmployee,
  inviteUserForEmployee,
  fetchRoles
} from "../services/employeesService";
import {
  fetchDepartments,
  fetchPositions,
} from "../services/positionsService";
import { getUserPermissions } from "../../utilits/auth";
import Select from "react-select";
import { EyeIcon, UserPlus, Mail } from "lucide-react";

// === Icons ===
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const formatAmount = (value) => {
  if (value == null || value === "") return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
  }).format(Number(value));
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [pageSize] = useState(10);

  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Invite User Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitingEmployee, setInvitingEmployee] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [formData, setFormData] = useState({
    employeeNumber: "",
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "Not Specified",
    departmentId: "",
    positionId: "",
    managerId: null,
    hireDate: new Date().toISOString().split('T')[0],
    baseSalary: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    nationalIdNumber: "",
    taxNumber: "",
    employmentStatus: "Active",
    inviteAsUser: false,
    roleId: ""
  });

  // Permissions
  const permissions = getUserPermissions();
  const hasPermission = (perm) => permissions.includes(perm);

  // === Load Data ===
  const loadEmployees = async () => {
    if (!hasPermission("employees.view")) {
      setEmployees([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data.map((d) => ({ value: d.id, label: d.name })));
    } catch (err) {
      console.error(err);
      setDepartments([]);
    }
  };

  const loadPositions = async () => {
    try {
      const data = await fetchPositions();
      let pos = data.requestResponse.result;
      setPositions(pos.map((p) => ({ value: p.id, label: p.title })));
    } catch (err) {
      console.error(err);
      setPositions([]);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data.map((r) => ({ value: r.id, label: r.name })));
    } catch (err) {
      console.error(err);
      setRoles([]);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadDepartments();
    loadPositions();
    loadRoles();
  }, []);

  // Manager options
  const managerOptions = employees
    .filter(emp => emp.id !== editingEmployee?.id)
    .map(emp => ({ 
      value: emp.id, 
      label: `${emp.firstName} ${emp.lastName}` 
    }));

  // === Open Modal ===
  const openModal = (emp = null) => {
    setCurrentStep(1);
    if (emp) {
      setEditingEmployee(emp);
      setFormData({
        employeeNumber: emp.employeeNumber || "",
        firstName: emp.firstName || "",
        lastName: emp.lastName || "",
        middleName: emp.middleName || "",
        email: emp.email || "",
        phoneNumber: emp.phoneNumber || "",
        dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : "",
        gender: emp.gender || "Not Specified",
        departmentId: emp.departmentId || "",
        positionId: emp.positionId || "",
        managerId: emp.managerId || null,
        hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : "",
        baseSalary: emp.baseSalary || "",
        address: emp.address || "",
        emergencyContactName: emp.emergencyContactName || "",
        emergencyContactPhone: emp.emergencyContactPhone || "",
        nationalIdNumber: emp.nationalIdNumber || "",
        taxNumber: emp.taxNumber || "",
        employmentStatus: emp.employmentStatus || "Active",
        inviteAsUser: false,
        roleId: ""
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        employeeNumber: "",
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "Not Specified",
        departmentId: "",
        positionId: "",
        managerId: null,
        hireDate: new Date().toISOString().split('T')[0],
        baseSalary: "",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        nationalIdNumber: "",
        taxNumber: "",
        employmentStatus: "Active",
        inviteAsUser: false,
        roleId: ""
      });
    }
    setIsModalOpen(true);
  };

  // === Open Invite Modal ===
  const openInviteModal = (employee) => {
    setInvitingEmployee(employee);
    setSelectedRole("");
    setShowInviteModal(true);
  };

  const handleInviteUser = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    try {
      let userData= [invitingEmployee.email,
        invitingEmployee.firstName,
        invitingEmployee.lastName,
        selectedRole,
        invitingEmployee.jobtitle
      ];
      await inviteUserForEmployee(userData);
      alert(`Invitation sent to ${invitingEmployee.email}`);
      setShowInviteModal(false);
      loadEmployees();
    } catch (error) {
      alert("Failed to send invitation");
    }
  };

  // === Validate Step ===
  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.employeeNumber.trim() && 
               formData.firstName.trim() && 
               formData.lastName.trim() && 
               formData.email.trim();
      case 2:
        return formData.departmentId && formData.positionId;
      case 3:
      case 4:
        return true;
      case 5: // User Invitation Step
        return !formData.inviteAsUser || formData.roleId;
      default:
        return false;
    }
  };

  // === Submit ===
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        baseSalary: formData.baseSalary ? parseFloat(formData.baseSalary) : null,
      };

      if (editingEmployee) {
        if (!hasPermission("employees.edit")) {
          alert("You don't have permission to edit employees.");
          return;
        }
        await updateEmployee(editingEmployee.id, { ...payload, id: editingEmployee.id });
        alert("Employee updated successfully!");
      } else {
        if (!hasPermission("employees.create")) {
          alert("You don't have permission to create employees.");
          return;
        }
        await createEmployee(payload);
        alert(formData.inviteAsUser 
          ? "Employee created and invitation sent!" 
          : "Employee created successfully!");
      }
      setIsModalOpen(false);
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Error saving employee: " + (err.message || "Unknown error"));
    }
  };

  // === Delete / Terminate ===
  const handleDelete = async (id) => {
    if (!hasPermission("employees.delete")) {
      alert("You don't have permission to delete employees.");
      return;
    }
    if (!window.confirm("Are you sure?")) return;
    try {
      await terminateEmployee(id, { reason: "Terminated via UI" });
      alert("Employee terminated!");
      loadEmployees();
    } catch {
      alert("Delete failed");
    }
  };

  // === Filter ===
  const filteredEmployees = employees.filter((emp) =>
    emp.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    emp.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    emp.email?.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeNumber?.toLowerCase().includes(search.toLowerCase())
  );

  // === Step Navigation ===
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // === Render Step Content ===
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="EMP001"
                  value={formData.employeeNumber}
                  onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="employee@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  placeholder="Michael"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                placeholder="Street address, city, state, zip code"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                rows="3"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <Select
                  options={departments}
                  value={departments.find((d) => d.value === formData.departmentId) || null}
                  onChange={(selected) => setFormData({ ...formData, departmentId: selected?.value || "" })}
                  placeholder="Select Department"
                  isClearable
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <Select
                  options={positions}
                  value={positions.find((p) => p.value === formData.positionId) || null}
                  onChange={(selected) => setFormData({ ...formData, positionId: selected?.value || "" })}
                  placeholder="Select Position"
                  isClearable
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <Select
                  options={managerOptions}
                  value={managerOptions.find((m) => m.value === formData.managerId) || null}
                  onChange={(selected) => setFormData({ ...formData, managerId: selected?.value || null })}
                  placeholder="Select Manager"
                  isClearable
                  className="w-full"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date</label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editingEmployee && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              )}

              {hasPermission("employees.view_salary") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                    step="0.01"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National ID Number</label>
                <input
                  type="text"
                  placeholder="National ID"
                  value={formData.nationalIdNumber}
                  onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Number</label>
                <input
                  type="text"
                  placeholder="Tax ID"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            {!editingEmployee && hasPermission("users.invite") && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      Invite as System User
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Send an invitation email to this employee to create their system login account.
                    </p>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.inviteAsUser}
                        onChange={(e) => setFormData({ ...formData, inviteAsUser: e.target.checked })}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Send system invitation email
                      </span>
                    </label>

                    {formData.inviteAsUser && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Role <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={roles}
                          value={roles.find(r => r.value === formData.roleId) || null}
                          onChange={(selected) => setFormData({ ...formData, roleId: selected?.value || "" })}
                          placeholder="Select Role"
                          className="w-full"
                          classNamePrefix="react-select"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          This role determines what permissions the user will have in the system.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!formData.inviteAsUser && (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">
                  You can invite this employee to create a system account later from the employee list.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-1">Manage employee information and records</p>
          </div>
          {hasPermission("employees.create") && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
            >
              <PlusIcon />
              <span className="ml-2">Add Employee</span>
            </button>
          )}
        </div>

        {/* Search */}
        {hasPermission("employees.view") && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or employee number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Table */}
        {hasPermission("employees.view") ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="text-gray-500 mt-2">Loading employees...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-4">Emp #</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">System Access</th>
                      <th className="px-6 py-4">Status</th>
                      {hasPermission("employees.view_salary") && <th className="px-6 py-4">Salary</th>}
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEmployees.length ? (
                      filteredEmployees.map((emp, index) => {
                        const count = (page - 1) * pageSize + index + 1;
                        return (
                          <tr key={emp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-xs">{emp.employeeNumber}</td>
                            <td className="px-6 py-4 font-medium">{`${emp.firstName} ${emp.lastName}`}</td>
                            <td className="px-6 py-4">{emp.email}</td>
                            <td className="px-6 py-4">{emp.phoneNumber || "N/A"}</td>
                            <td className="px-6 py-4">{emp.positionTitle || "N/A"}</td>
                            <td className="px-6 py-4">
                              {emp.userId ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Has Login
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 flex items-center gap-1 w-fit">
                                  No Login
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                emp.employmentStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {emp.employmentStatus}
                              </span>
                            </td>
                            {hasPermission("employees.view_salary") && (
                              <td className="px-6 py-4">{emp.baseSalary ? `${formatAmount(emp.baseSalary)}` : "N/A"}</td>
                            )}
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                {hasPermission("employees.view") && (
                                  <button 
                                    onClick={() => setViewingEmployee(emp)} 
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="View Details"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                  </button>
                                )}
                                {!emp.userId && hasPermission("users.invite") && (
                                  <button 
                                    onClick={() => openInviteModal(emp)} 
                                    className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                    title="Invite as System User"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </button>
                                )}
                                {hasPermission("employees.edit") && (
                                  <button 
                                    onClick={() => openModal(emp)} 
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Edit"
                                  >
                                    <EditIcon />
                                  </button>
                                )}
                                {hasPermission("employees.delete") && (
                                  <button 
                                    onClick={() => handleDelete(emp.id)} 
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Terminate"
                                  >
                                    <TrashIcon />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                          No employees found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">You don't have permission to view employees.</div>
        )}

        {/* Employee Details Modal */}
        {viewingEmployee && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Employee Details</h2>
                <button
                  onClick={() => setViewingEmployee(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-semibold">Employee Number:</span> {viewingEmployee.employeeNumber}</div>
                  <div><span className="font-semibold">Name:</span> {`${viewingEmployee.firstName} ${viewingEmployee.lastName}`}</div>
                  <div><span className="font-semibold">Email:</span> {viewingEmployee.email}</div>
                  <div><span className="font-semibold">Phone:</span> {viewingEmployee.phoneNumber || "N/A"}</div>
                  <div><span className="font-semibold">Department:</span> {viewingEmployee.departmentName || "N/A"}</div>
                  <div><span className="font-semibold">Position:</span> {viewingEmployee.positionTitle || "N/A"}</div>
                  <div><span className="font-semibold">Hire Date:</span> {viewingEmployee.hireDate?.split('T')[0] || "N/A"}</div>
                  <div><span className="font-semibold">Gender:</span> {viewingEmployee.gender}</div>
                  <div className="md:col-span-2"><span className="font-semibold">Address:</span> {viewingEmployee.address || "N/A"}</div>
                  <div><span className="font-semibold">Emergency Contact:</span> {viewingEmployee.emergencyContactName || "N/A"}</div>
                  <div><span className="font-semibold">Emergency Phone:</span> {viewingEmployee.emergencyContactPhone || "N/A"}</div>
                  <div><span className="font-semibold">National ID:</span> {viewingEmployee.nationalIdNumber || "N/A"}</div>
                  <div><span className="font-semibold">Tax Number:</span> {viewingEmployee.taxNumber || "N/A"}</div>
                  <div><span className="font-semibold">Employment Status:</span> {viewingEmployee.employmentStatus}</div>
                  {hasPermission("employees.view_salary") && (
                    <div><span className="font-semibold">Salary:</span> {viewingEmployee.baseSalary ? `${viewingEmployee.baseSalary.toLocaleString()}` : "N/A"}</div>
                  )}
                  <div className="md:col-span-2">
                    <span className="font-semibold">System Access:</span>{" "}
                    {viewingEmployee.userId ? (
                      <span className="text-blue-600">Has system login</span>
                    ) : (
                      <span className="text-gray-500">No system access</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t px-6 py-4">
                <button
                  onClick={() => setViewingEmployee(null)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite User Modal */}
        {showInviteModal && invitingEmployee && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Invite as System User</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900">
                        An invitation email will be sent to:
                      </p>
                      <p className="text-sm font-semibold text-blue-900 mt-1">
                        {invitingEmployee.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={roles}
                    value={roles.find(r => r.value === selectedRole) || null}
                    onChange={(selected) => setSelectedRole(selected?.value || "")}
                    placeholder="Choose a role"
                    className="w-full"
                    classNamePrefix="react-select"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This determines what permissions {invitingEmployee.firstName} will have in the system.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteUser}
                  disabled={!selectedRole}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                    !selectedRole
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200"
                  }`}
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Step Employee Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEmployee ? "Edit Employee" : "Add Employee"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="px-6 pt-4 pb-2 border-b bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {[1, 2, 3, 4, 5].map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                          currentStep === step 
                            ? "bg-green-600 text-white ring-4 ring-green-200" 
                            : currentStep > step 
                              ? "bg-green-500 text-white" 
                              : "bg-gray-300 text-gray-600"
                        }`}>
                          {step}
                        </div>
                        <span className={`text-xs mt-1 font-medium ${
                          currentStep === step ? "text-green-600" : "text-gray-500"
                        }`}>
                          {step === 1 && "Personal"}
                          {step === 2 && "Employment"}
                          {step === 3 && "Emergency"}
                          {step === 4 && "ID"}
                          {step === 5 && "Access"}
                        </span>
                      </div>
                      {index < 4 && (
                        <div className={`flex-1 h-1 mx-2 mb-6 rounded transition-all duration-200 ${
                          currentStep > step ? "bg-green-500" : "bg-gray-300"
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {renderStepContent()}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 border-t px-6 py-4 flex-shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg border font-medium transition-all duration-200 ${
                      currentStep === 1
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <ChevronLeftIcon />
                    <span className="ml-1">Previous</span>
                  </button>

                  {currentStep < 5 ? (
                    <button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        !validateStep(currentStep)
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white focus:ring-4 focus:ring-green-200 shadow-sm"
                      }`}
                    >
                      <span className="mr-1">Next</span>
                      <ChevronRightIcon />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={
                        !formData.employeeNumber.trim() ||
                        !formData.firstName.trim() ||
                        !formData.lastName.trim() ||
                        !formData.email.trim() ||
                        !formData.departmentId ||
                        !formData.positionId ||
                        !validateStep(5) ||
                        (editingEmployee ? !hasPermission("employees.edit") : !hasPermission("employees.create"))
                      }
                      className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                        !formData.employeeNumber.trim() ||
                        !formData.firstName.trim() ||
                        !formData.lastName.trim() ||
                        !formData.email.trim() ||
                        !formData.departmentId ||
                        !formData.positionId ||
                        !validateStep(5) ||
                        (editingEmployee ? !hasPermission("employees.edit") : !hasPermission("employees.create"))
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 shadow-sm"
                      }`}
                    >
                      {editingEmployee ? "Update Employee" : "Create Employee"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees