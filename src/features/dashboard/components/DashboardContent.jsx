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
  getEmployeeStatistics,
  getLeaveStatistics,
  getOnboardingStatistics,
  getDepartmentHeadcount
} from "../services/analyticsService"; 

const getPermissions = () => {
  try {
    
    const permissionsInfo = getUserPermissions();
    return permissionsInfo || [];
  } catch {
    return [];
  }
};

const hasPermission = (permission) => {
  const permissions = getPermissions();
  return permissions.includes(permission);
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
      } catch (err) {
        console.error("Error fetching stats:", err);
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
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
