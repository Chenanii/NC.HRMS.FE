import React, { useEffect, useState } from "react";
import { getCurrentTenant, updateCurrentTenant } from "../services/systemSettings";

const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 13l4 4L19 7" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
  </svg>
);

const normalizeResponse = (data) => {
  if (!data) return null;
  if (data.requestResponse) return data.requestResponse;
  if (data.result) return data.result;
  if (data.data) return data.data;
  return data;
};

const Row = ({ label, value }) => (
  <div className="flex justify-between text-gray-700">
    <span>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default function SystemSettings() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    primaryColor: "#06d339",
    secondaryColor: "#2291c5",
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentTenant();
        const t = normalizeResponse(res);

        setFormData({
          name: t?.name || "",
          description: t?.description || "",
          logo: t?.logo || "",
          primaryColor: t?.primaryColor || "#06d339",
          secondaryColor: t?.secondaryColor || "#2291c5",
        });

        setLogoPreview(t?.logo || "");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--tenant-primary", formData.primaryColor);
    root.style.setProperty("--tenant-secondary", formData.secondaryColor);
  }, [formData.primaryColor, formData.secondaryColor]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result });
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateCurrentTenant(formData);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-xl shadow border p-6 space-y-6">
          <h2 className="text-2xl font-bold">System Settings</h2>

          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Organization name"
            className="w-full border rounded-lg px-4 py-3"
          />

          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Description"
            className="w-full border rounded-lg px-4 py-3"
          />

          {/* Logo Upload */}
          <div>
            {logoPreview ? (
              <img src={logoPreview} className="h-24 mb-3 object-contain rounded-md border" />
            ) : (
              <ImageIcon />
            )}
            <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-2" />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Primary Color</label>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-full h-10 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Secondary Color</label>
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-full h-10 border rounded"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 font-medium"
          >
            <SaveIcon />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow border overflow-hidden">

          <div
            className="flex items-center justify-between px-6 py-4 text-white"
            style={{ backgroundColor: "var(--tenant-primary)" }}
          >
            <div className="flex items-center gap-3">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  className="h-10 bg-white rounded-md p-1 object-contain"
                />
              ) : (
                <BuildingIcon />
              )}
              <div>
                <div className="font-semibold text-lg">
                  {formData.name || "Your Company"}
                </div>
                <div className="text-xs opacity-90">
                  Payslip • January 2026
                </div>
              </div>
            </div>
            <span className="text-sm font-medium">Confidential</span>
          </div>

          {/* Payslip Body */}
          <div className="p-6 space-y-6 text-sm">

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500">Employee Name</div>
                <div className="font-medium">Jane Doe</div>
              </div>
              <div>
                <div className="text-gray-500">Employee ID</div>
                <div className="font-medium">EMP-001</div>
              </div>
              <div>
                <div className="text-gray-500">Department</div>
                <div className="font-medium">Finance</div>
              </div>
              <div>
                <div className="text-gray-500">Pay Date</div>
                <div className="font-medium">31 Jan 2026</div>
              </div>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid grid-cols-2 gap-6">
              {/* Earnings */}
              <div className="border rounded-lg overflow-hidden">
                <div
                  className="px-4 py-2 font-semibold text-white"
                  style={{ backgroundColor: "var(--tenant-secondary)" }}
                >
                  Earnings
                </div>
                <div className="p-4 space-y-2">
                  <Row label="Basic Salary" value="MWK 450,000" />
                  <Row label="Housing Allowance" value="MWK 100,000" />
                  <Row label="Transport Allowance" value="MWK 50,000" />
                  <Row label="Bonus" value="MWK 25,000" />
                </div>
              </div>

              {/* Deductions */}
              <div className="border rounded-lg overflow-hidden">
                <div
                  className="px-4 py-2 font-semibold text-white"
                  style={{ backgroundColor: "#ef4444" }}
                >
                  Deductions
                </div>
                <div className="p-4 space-y-2">
                  <Row label="Tax" value="MWK 80,000" />
                  <Row label="Pension" value="MWK 20,000" />
                  <Row label="Other" value="MWK 5,000" />
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t pt-4 font-semibold text-lg">
              <span>Net Pay</span>
              <span style={{ color: "var(--tenant-primary)" }}>MWK 620,000</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --tenant-primary: #06d339;
          --tenant-secondary: #2291c5;
        }
      `}</style>
    </div>
  );
}
