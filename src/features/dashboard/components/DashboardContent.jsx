import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  UserCheck, 
  Building2,
  PlusCircle
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getEmployeeStatistics,
  getLeaveStatistics,
  getOnboardingStatistics,
  getDepartmentHeadcount
} from "../services/analyticsService"; 
import { hasPermission } from "../../utilits/auth";

const normalizeArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.departments)) return data.departments;
  return [];
};

const QuickActions = () => {
  const actions = [
    { icon: UserPlus, label: 'Add Employee', permission: 'employees.create', color: 'blue' },
    { icon: Calendar, label: 'Request Leave', permission: 'leave.create', color: 'green' },
    { icon: FileText, label: 'Upload Document', permission: 'documents.upload', color: 'purple' },
    { icon: PlusCircle, label: 'New Department', permission: 'departments.create', color: 'orange' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          if (action.permission && !hasPermission(action.permission)) {
            return null;
          }
          
          return (
            <button
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors`}
            >
              <action.icon size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
// Dashboard Stats Card Component
const StatsCard = ({ icon: Icon, title, value, change, changeType }) => {
  const iconEl = Icon
    ? React.createElement(Icon, { size: 24, className: "text-blue-600" })
    : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}
            >
              {changeType === "positive" ? "↗" : "↘"} {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">{iconEl}</div>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    { type: 'employee', message: 'John Doe joined IT Department', time: '2 hours ago', icon: Users },
    { type: 'leave', message: 'Sarah Wilson requested 3 days leave', time: '4 hours ago', icon: Calendar },
    { type: 'document', message: 'Contract uploaded for Mike Johnson', time: '6 hours ago', icon: FileText },
    { type: 'onboarding', message: 'Onboarding completed for Lisa Chen', time: '1 day ago', icon: UserCheck },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-gray-100 rounded-lg">
              <activity.icon size={16} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deptHeadcountData, setDeptHeadcountData] = useState([]);
  const [leaveBreakdownData, setLeaveBreakdownData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          employees,
          leaves,
          onboarding,
          departments
        ] = await Promise.all([
          getEmployeeStatistics(),
          getLeaveStatistics(),
          getOnboardingStatistics(),
          getDepartmentHeadcount()
        ]);

        setStats([
          {
            icon: Users,
            title: "Total Employees",
            value: employees?.totalEmployees ?? "0",
            change: employees?.changeText ?? "",
            changeType: employees?.changeType ?? "neutral"
          },
          {
            icon: Calendar,
            title: "Pending Leaves",
            value: leaves?.pending ?? "0",
            change: leaves?.changeText ?? "",
            changeType: leaves?.changeType ?? "neutral"
          },
          {
            icon: UserCheck,
            title: "Active Onboarding",
            value: onboarding?.active ?? "0",
            change: onboarding?.changeText ?? "",
            changeType: onboarding?.changeType ?? "neutral"
          },
          {
            icon: Building2,
            title: "Departments",
            value: departments?.totalDepartments ?? "0",
            change: departments?.changeText ?? "",
            changeType: departments?.changeType ?? "neutral"
          }
        ]);

        // Department headcount chart (bar)
        const deptItems = normalizeArray(departments).map((d) => ({
          name: d.departmentName || d.name || d.department || "Department",
          headcount: Number(d.headcount ?? d.count ?? d.total ?? 0),
        }));
        setDeptHeadcountData(deptItems);

        // Leave breakdown chart (pie)
        const pending = Number(leaves?.pending ?? 0);
        const approved = Number(leaves?.approved ?? 0);
        const rejected = Number(leaves?.rejected ?? 0);
        const breakdown = [
          { name: "Pending", value: pending, color: "#f59e0b" },
          { name: "Approved", value: approved, color: "#10b981" },
          { name: "Rejected", value: rejected, color: "#ef4444" },
        ].filter((x) => x.value > 0);
        setLeaveBreakdownData(breakdown);
      } catch (err) {
        setError(err?.message || "Failed to load dashboard analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your team.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department headcount</h3>
          {deptHeadcountData.length === 0 ? (
            <div className="text-sm text-gray-500">No department headcount data.</div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptHeadcountData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="headcount" name="Employees" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave status breakdown</h3>
          {leaveBreakdownData.length === 0 ? (
            <div className="text-sm text-gray-500">No leave breakdown data.</div>
          ) : (
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
                    {leaveBreakdownData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
