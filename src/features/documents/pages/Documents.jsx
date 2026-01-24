import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  uploadDocument,
  getEmployeeDocuments,
  getExpiringDocuments,
  deleteDocument,
  createCategory,
  downloadDocument,
} from "../services/documentsService";
import { fetchEmployees } from "../../management/services/employeesService";
import { getUserPermissions } from "../../utilits/auth";
import { FileText, Upload, Download, Trash2, Eye, AlertCircle, X } from "lucide-react";

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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

const normalizeDocuments = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [expiringDocuments, setExpiringDocuments] = useState([]);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [uploadFormData, setUploadFormData] = useState({
    employeeId: "",
    categoryId: "",
    description: "",
    expiryDate: "",
    hasExpiry: false,
    tags: "",
    file: null,
  });
  
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  const loadDocuments = async () => {
    if (!selectedEmployee) {
      setDocuments([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await getEmployeeDocuments(selectedEmployee);
      setDocuments(normalizeDocuments(data));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

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

  const loadExpiringDocuments = async () => {
    try {
      const data = await getExpiringDocuments(30);
      setExpiringDocuments(normalizeDocuments(data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadExpiringDocuments();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadDocuments();
    }
  }, [selectedEmployee]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFormData({ ...uploadFormData, file });
    }
  };

  const handleUpload = async () => {
    if (!uploadFormData.file) {
      toast.error("Please select a file");
      return;
    }
    if (!uploadFormData.employeeId) {
      toast.error("Please select an employee");
      return;
    }
    if (!uploadFormData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(uploadFormData.file, {
        employeeId: uploadFormData.employeeId,
        categoryId: uploadFormData.categoryId,
        description: uploadFormData.description,
        expiryDate: uploadFormData.hasExpiry ? uploadFormData.expiryDate : null,
        hasExpiry: uploadFormData.hasExpiry,
        tags: uploadFormData.tags,
      });
      toast.success("Document uploaded successfully");
      setIsUploadModalOpen(false);
      setUploadFormData({
        employeeId: "",
        categoryId: "",
        description: "",
        expiryDate: "",
        hasExpiry: false,
        tags: "",
        file: null,
      });
      loadDocuments();
      loadExpiringDocuments();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to upload document";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!hasPermission("documents.delete")) {
      toast.error("You don't have permission to delete documents");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    
    try {
      await deleteDocument(documentId);
      toast.success("Document deleted successfully");
      loadDocuments();
      loadExpiringDocuments();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to delete document";
      toast.error(message);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const blob = await downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "document";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Document downloaded");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to download document";
      toast.error(message);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryFormData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory(categoryFormData);
      toast.success("Category created successfully");
      setIsCategoryModalOpen(false);
      setCategoryFormData({ name: "", description: "" });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to create category";
      toast.error(message);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.fileName?.toLowerCase().includes(search.toLowerCase()) ||
    doc.description?.toLowerCase().includes(search.toLowerCase()) ||
    doc.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  if (!hasPermission("documents.view") && !hasPermission("documents.view_all")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view documents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage employee documents and files</p>
          </div>
          <div className="flex gap-2">
            {hasPermission("documents.manage-categories") && (
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Add Category
              </button>
            )}
            {hasPermission("documents.upload") && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            )}
          </div>
        </div>

        {/* Expiring Documents Alert */}
        {expiringDocuments.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                  {expiringDocuments.length} document(s) expiring in the next 30 days
                </h3>
                <p className="text-sm text-yellow-700">
                  Review and renew expiring documents to ensure compliance.
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
            <option value="">Select an employee to view documents</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.employeeNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        {selectedEmployee && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Documents Table */}
        {selectedEmployee ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="text-gray-500 mt-2">Loading documents...</p>
                </div>
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-medium">
                    <tr>
                      <th className="px-6 py-4">File Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Upload Date</th>
                      <th className="px-6 py-4">Expiry Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-gray-400" />
                            {doc.fileName || doc.name || "Document"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {doc.categoryName || doc.category || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {doc.description || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(doc.uploadDate || doc.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          {doc.expiryDate ? (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              new Date(doc.expiryDate) < new Date() 
                                ? "bg-red-100 text-red-800"
                                : new Date(doc.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {formatDate(doc.expiryDate)}
                            </span>
                          ) : (
                            <span className="text-gray-400">No expiry</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDownload(doc.id, doc.fileName || doc.name)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {hasPermission("documents.delete") && (
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
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
                {search ? "No documents match your search criteria" : "No documents found for this employee"}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Employee</h3>
            <p className="text-gray-500">Please select an employee from the dropdown above to view their documents.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadFormData.employeeId}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, employeeId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={uploadFormData.categoryId}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Note: Category will be created if it doesn't exist</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  rows="3"
                  placeholder="Document description (optional)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasExpiry"
                  checked={uploadFormData.hasExpiry}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, hasExpiry: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
                <label htmlFor="hasExpiry" className="ml-3 text-sm font-medium text-gray-700">
                  Document has expiry date
                </label>
              </div>

              {uploadFormData.hasExpiry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={uploadFormData.expiryDate}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={uploadFormData.tags}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., contract, certificate, license"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadFormData.file || !uploadFormData.employeeId || !uploadFormData.categoryId}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  uploading || !uploadFormData.file || !uploadFormData.employeeId || !uploadFormData.categoryId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 shadow-sm"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Create Category</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., Contracts, Certificates, Licenses"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                  rows="3"
                  placeholder="Category description (optional)"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!categoryFormData.name.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                  !categoryFormData.name.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 shadow-sm"
                }`}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
