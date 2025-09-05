import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  UserCheck, 
  Building2,
  PlusCircle
} from 'lucide-react';

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

// Dashboard Stats Card Component
const StatsCard = ({ icon: Icon, title, value, change, changeType }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? '↗' : '↘'} {change}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon size={24} className="text-blue-600" />
      </div>
    </div>
  </div>
);

// Quick Actions Component
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

// Main Dashboard Content Component
const DashboardContent = () => {
  const stats = [
    { icon: Users, title: 'Total Employees', value: '124', change: '+8 this month', changeType: 'positive' },
    { icon: Calendar, title: 'Pending Leaves', value: '7', change: '-2 from last week', changeType: 'positive' },
    { icon: UserCheck, title: 'Active Onboarding', value: '3', change: 'New hires', changeType: 'neutral' },
    { icon: Building2, title: 'Departments', value: '12', change: '+1 this quarter', changeType: 'positive' },
  ];

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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Information Technology</span>
              <span className="font-medium">24 employees</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Human Resources</span>
              <span className="font-medium">8 employees</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Finance</span>
              <span className="font-medium">12 employees</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-gray-900 font-medium">Team Meeting</p>
                <p className="text-sm text-gray-600">IT Department</p>
              </div>
              <span className="text-sm text-blue-600">Tomorrow</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-gray-900 font-medium">New Hire Orientation</p>
                <p className="text-sm text-gray-600">Lisa Chen - Marketing</p>
              </div>
              <span className="text-sm text-green-600">Friday</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;