import React, { useEffect, useState } from "react";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  terminateEmployee,
} from "../services/employeesService";
import {
  fetchDepartments,
  fetchPositions,
} from "../services/positionsService";
import { getUserPermissions } from "../../utilits/auth";
import Select from "react-select";
import { EyeIcon } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
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
  });

  // Permissions
  const permissions = getUserPermissions();
  const hasPermission = (perm) => permissions.includes(perm);

  // === Load Employees ===
  const loadEmployees = async () => {
    if (!hasPermission("employees.view")) {
      setEmployees([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(Array.isArray(data) ? data : []);
      setTotal(data.length);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // === Load Departments ===
  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      const deptArray = Array.isArray(data) ? data : data?.items || [];
      setDepartments(deptArray.map((d) => ({ value: d.id, label: d.name })));
    } catch (err) {
      console.error(err);
      setDepartments([]);
    }
  };

  // === Load Positions ===
  const loadPositions = async () => {
    try {
      const data = await fetchPositions();
      const items = Array.isArray(data) ? data : data?.requestResponse?.result || [];
      setPositions(items.map((p) => ({ value: p.id, label: p.title })));
    } catch (err) {
      console.error(err);
      setPositions([]);
    }
  };

  // === Init Load ===
  useEffect(() => {
    loadEmployees();
    loadDepartments();
    loadPositions();
  }, []);

  // Manager options from existing employees
  const managerOptions = employees
    .filter(emp => emp.id !== editingEmployee?.id)
    .map(emp => ({ value: emp.id, label: emp.fullName || emp.firstName + ' ' + emp.lastName }));

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
      });
    }
    setIsModalOpen(true);
  };

  // === Validate Current Step ===
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
        if (!hasPermission("employees.edit")) return alert("You don't have permission to edit employees.");
        await updateEmployee(editingEmployee.id, { ...payload, id: editingEmployee.id });
        alert("Employee updated successfully!");
      } else {
        if (!hasPermission("employees.create")) return alert("You don't have permission to create employees.");
        await createEmployee(payload);
        alert("Employee created successfully!");
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
    if (!hasPermission("employees.delete")) return alert("You don't have permission to delete employees.");
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
    if (validateStep(currentStep) && currentStep < 4) {
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
              <th className="px-6 py-4">Status</th>
              {hasPermission("employees.view_salary") && <th className="px-6 py-4">Salary</th>}
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.length ? (
              filteredEmployees.map((emp, index) => {
                const count = (page - 1) * pageSize + index + 1;
                return(
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{count}</td>
                  <td className="px-6 py-4 font-medium">{emp.fullName || `${emp.firstName} ${emp.lastName}`}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">{emp.phoneNumber || "N/A"}</td>
                  <td className="px-6 py-4">{emp.positionTitle || "N/A"}</td>
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
                  <td className="px-6 py-4 flex space-x-2">
                    {hasPermission("employees.view") && (
                      <button onClick={() => setViewingEmployee(emp)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" >
                        <EyeIcon />
                      </button>
                    )}
                    {hasPermission("employees.edit") && (
                      <button onClick={() => openModal(emp)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <EditIcon />
                      </button>
                    )}
                    {hasPermission("employees.delete") && (
                      <button onClick={() => handleDelete(emp.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <TrashIcon />
                      </button>
                    )}
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
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

{/* === Employee Details Modal === */}
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
          <div><span className="font-semibold">Name:</span> {viewingEmployee.fullName || `${viewingEmployee.firstName} ${viewingEmployee.lastName}`}</div>
          <div><span className="font-semibold">Email:</span> {viewingEmployee.email}</div>
          <div><span className="font-semibold">Phone:</span> {viewingEmployee.phoneNumber || "N/A"}</div>
          <div><span className="font-semibold">Department:</span> {viewingEmployee.departmentName || "N/A"}</div>
          <div><span className="font-semibold">Position:</span> {viewingEmployee.positionTitle || "N/A"}</div>
          <div><span className="font-semibold">Manager:</span> {viewingEmployee.managerName || "N/A"}</div>
          <div><span className="font-semibold">Hire Date:</span> {viewingEmployee.hireDate?.split('T')[0] || "N/A"}</div>
          <div><span className="font-semibold">Gender:</span> {viewingEmployee.gender}</div>
          <div><span className="font-semibold">Address:</span> {viewingEmployee.address || "N/A"}</div>
          <div><span className="font-semibold">Emergency Contact:</span> {viewingEmployee.emergencyContactName || "N/A"} ({viewingEmployee.emergencyContactPhone || "N/A"})</div>
          <div><span className="font-semibold">National ID:</span> {viewingEmployee.nationalIdNumber || "N/A"}</div>
          <div><span className="font-semibold">Tax Number:</span> {viewingEmployee.taxNumber || "N/A"}</div>
          <div><span className="font-semibold">Employment Status:</span> {viewingEmployee.employmentStatus}</div>
          {hasPermission("employees.view_salary") && <div><span className="font-semibold">Salary:</span> {viewingEmployee.baseSalary ? `${viewingEmployee.baseSalary.toLocaleString()}` : "N/A"}</div>}
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

      </div>

      {/* === Multi-Step Modal === */}
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
                {[1, 2, 3, 4].map((step, index) => (
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
                        {step === 1 && "Personal Info"}
                        {step === 2 && "Employment"}
                        {step === 3 && "Emergency"}
                        {step === 4 && "Identification"}
                      </span>
                    </div>
                    {index < 3 && (
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

                {currentStep < 4 ? (
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
                      (editingEmployee ? !hasPermission("employees.edit") : !hasPermission("employees.create"))
                    }
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                      !formData.employeeNumber.trim() ||
                      !formData.firstName.trim() ||
                      !formData.lastName.trim() ||
                      !formData.email.trim() ||
                      !formData.departmentId ||
                      !formData.positionId ||
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
  );
};

export default Employees;