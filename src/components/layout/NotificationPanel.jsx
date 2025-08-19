import { useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationPanel() {
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