import React, { useEffect, useState } from "react";
import {
  getEmployeeStatistics,
  getLeaveStatistics,
  getOnboardingStatistics,
  getDepartmentHeadcount,
  getBirthdaysThisMonth,
  getWorkAnniversariesThisMonth,
  getAverageSalaryByDepartment,
} from "../../dashboard/services/analyticsService";
import { getUserPermissions } from "../../utilits/auth";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Calendar, Users, TrendingUp, DollarSign, Gift, Award } from "lucide-react";

const normalizeArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.departments)) return data.departments;
  return [];
};

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

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [employeeStats, setEmployeeStats] = useState(null);
  const [leaveStats, setLeaveStats] = useState(null);
  const [onboardingStats, setOnboardingStats] = useState(null);
  const [departmentHeadcount, setDepartmentHeadcount] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);
  const [salaryByDept, setSalaryByDept] = useState([]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [
        empStats,
        leaveStatsData,
        onboardingStatsData,
        deptHeadcountData,
        birthdaysData,
        anniversariesData,
        salaryData,
      ] = await Promise.all([
        getEmployeeStatistics(),
        getLeaveStatistics(dateRange.startDate, dateRange.endDate),
        getOnboardingStatistics(dateRange.startDate, dateRange.endDate),
        getDepartmentHeadcount(),
        getBirthdaysThisMonth(),
        getWorkAnniversariesThisMonth(),
        getAverageSalaryByDepartment(),
      ]);

      setEmployeeStats(empStats?.requestResponse || empStats);
      setLeaveStats(leaveStatsData?.requestResponse || leaveStatsData);
      setOnboardingStats(onboardingStatsData?.requestResponse || onboardingStatsData);
      setDepartmentHeadcount(normalizeArray(deptHeadcountData?.requestResponse || deptHeadcountData));
      setBirthdays(normalizeArray(birthdaysData?.requestResponse || birthdaysData));
      setAnniversaries(normalizeArray(anniversariesData?.requestResponse || anniversariesData));
      setSalaryByDept(normalizeArray(salaryData?.requestResponse || salaryData));
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const deptHeadcountChartData = departmentHeadcount.map((d) => ({
    name: d.departmentName || d.name || "Department",
    headcount: Number(d.headcount ?? d.count ?? d.total ?? 0),
  }));

  const salaryChartData = salaryByDept.map((d) => ({
    name: d.departmentName || d.name || "Department",
    averageSalary: Number(d.averageSalary ?? d.avgSalary ?? 0),
  }));

  const leaveBreakdownData = [
    { name: "Pending", value: Number(leaveStats?.pending ?? 0), color: "#f59e0b" },
    { name: "Approved", value: Number(leaveStats?.approved ?? 0), color: "#10b981" },
    { name: "Rejected", value: Number(leaveStats?.rejected ?? 0), color: "#ef4444" },
  ].filter((x) => x.value > 0);

  if (!hasPermission("analytics.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights and analytics</p>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-500 mt-2">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{employeeStats?.totalEmployees ?? 0}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Leaves</p>
                    <p className="text-2xl font-bold text-gray-900">{leaveStats?.pending ?? 0}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Onboarding</p>
                    <p className="text-2xl font-bold text-gray-900">{onboardingStats?.active ?? 0}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Departments</p>
                    <p className="text-2xl font-bold text-gray-900">{departmentHeadcount.length}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Department Headcount */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Headcount</h3>
                {deptHeadcountChartData.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptHeadcountChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="headcount" name="Employees" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-12">No data available</div>
                )}
              </div>

              {/* Leave Breakdown */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Status Breakdown</h3>
                {leaveBreakdownData.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                          data={leaveBreakdownData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {leaveBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-12">No leave data available</div>
                )}
              </div>
            </div>

            {/* Charts Row 2 */}
            {salaryChartData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Average Salary by Department */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Salary by Department</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salaryChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="averageSalary" name="Average Salary" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Birthdays & Anniversaries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Birthdays */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Gift className="w-5 h-5 text-pink-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Birthdays This Month</h3>
                </div>
                {birthdays.length > 0 ? (
                  <div className="space-y-2">
                    {birthdays.map((emp, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{emp.departmentName || "N/A"}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(emp.dateOfBirth)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-8">No birthdays this month</div>
                )}
              </div>

              {/* Work Anniversaries */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <Award className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Work Anniversaries This Month</h3>
                </div>
                {anniversaries.length > 0 ? (
                  <div className="space-y-2">
                    {anniversaries.map((emp, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{emp.departmentName || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {emp.yearsOfService || 0} years
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(emp.hireDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-8">No anniversaries this month</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
