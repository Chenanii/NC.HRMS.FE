import { useState } from "react";
import { 
  Users, 
  UserCheck, 
  Clock, 
  DollarSign,
  Calendar,
  CreditCard,
  Bell
} from "lucide-react";

// Dashboard Card Component
function DashboardCard({ icon, title, value, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50",
    green: "text-green-500 bg-green-50",
    yellow: "text-yellow-500 bg-yellow-50",
    purple: "text-purple-500 bg-purple-50",
    red: "text-red-500 bg-red-50",
    indigo: "text-indigo-500 bg-indigo-50"
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className={`${colorClasses[color]} p-2 lg:p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-500 text-sm lg:text-base truncate">{title}</p>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{value}</h2>
        </div>
      </div>
    </div>
  );
}

// Dashboard Grid Component
function DashboardGrid() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <DashboardCard
          icon={<Users className="w-6 h-6" />}
          title="Total Employees"
          value="124"
          color="blue"
        />
        <DashboardCard
          icon={<UserCheck className="w-6 h-6" />}
          title="Present Today"
          value="98"
          color="green"
        />
        <DashboardCard
          icon={<Clock className="w-6 h-6" />}
          title="Pending Leaves"
          value="12"
          color="yellow"
        />
        <DashboardCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Payroll This Month"
          value="$84,200"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
          <button className="flex flex-col items-center p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <Users className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Add Employee</span>
          </button>
          <button className="flex flex-col items-center p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group">
            <Calendar className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Approve Leave</span>
          </button>
          <button className="flex flex-col items-center p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <CreditCard className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Run Payroll</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                New employee John Doe added to Development team
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Leave request approved for Sarah Smith
              </p>
              <p className="text-xs text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Payroll processed for 124 employees
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                3 leave requests submitted for approval
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-4 text-center text-sm text-blue-600 hover:underline py-2">
          View all activity
        </button>
      </div>
    </div>
  );
}

// Notification Panel Component
function NotificationPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "3 new leave requests pending approval.",
      time: "2h ago",
      type: "alert",
      unread: true,
    },
    {
      id: 2,
      message: "Payroll for August needs approval.",
      time: "1d ago",
      type: "warning",
      unread: true,
    },
    {
      id: 3,
      message: "Employee satisfaction survey results available.",
      time: "3d ago",
      type: "info",
      unread: false,
    },
    {
      id: 4,
      message: "New employee onboarding scheduled for next week.",
      time: "5d ago",
      type: "info",
      unread: false,
    },
    {
      id: 5,
      message: "Performance review meeting scheduled with team leads.",
      time: "1w ago",
      type: "info",
      unread: false,
    },
    {
      id: 6,
      message: "Company policy updates require acknowledgment.",
      time: "1w ago",
      type: "warning",
      unread: false,
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const typeStyles = {
    alert: "bg-red-100 text-red-600 border-red-500",
    warning: "bg-yellow-100 text-yellow-600 border-yellow-500",
    info: "bg-blue-100 text-blue-600 border-blue-500",
  };

  return (
    <div className="sticky top-6 bg-white rounded-xl shadow-sm p-4 lg:p-6 h-fit max-h-[calc(100vh-8rem)] overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg lg:text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Bell className="w-5 h-5" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 hover:underline flex-shrink-0"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto max-h-96 pr-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`flex items-start gap-3 p-3 rounded-lg hover:shadow-sm transition cursor-pointer ${
              n.unread 
                ? `bg-gray-50 border-l-4 ${typeStyles[n.type].split(' ')[2]}` 
                : "bg-gray-25 hover:bg-gray-50"
            }`}
          >
            <span className={`mt-1 p-1.5 rounded-full text-xs ${typeStyles[n.type]}`}>
              •
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-relaxed ${
                n.unread ? 'text-gray-900 font-medium' : 'text-gray-700'
              }`}>
                {n.message}
              </p>
              <span className="text-xs text-gray-500">{n.time}</span>
            </div>
            {n.unread && (
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            )}
          </div>
        ))}
      </div>
      
      {notifications.length > 6 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-sm text-blue-600 hover:underline w-full text-center">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, Edgar! Here's what's happening with your team today.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Main Dashboard Content - Takes up 3 columns on xl screens */}
        <div className="xl:col-span-3">
          <DashboardGrid />
        </div>

        {/* Notifications Panel - Sticky on the right, takes up 1 column on xl screens */}
        <div className="xl:col-span-1 xl:order-last order-first xl:block">
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}