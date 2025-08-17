import { useState, useEffect } from "react";
import { FaBell, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "3 new leave requests pending.",
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
  ]);

  // Function to mark all as read
  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  // Mark single notification as read
  const markRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const typeStyles = {
    alert: "bg-red-100 text-red-600",
    warning: "bg-yellow-100 text-yellow-600",
    info: "bg-blue-100 text-blue-600",
  };

  const typeIcons = {
    alert: FaExclamationCircle,
    warning: FaExclamationCircle,
    info: FaCheckCircle,
  };

  // Simulate real-time incoming notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: "New task assigned to you.",
        time: "Just now",
        type: "info",
        unread: true,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <FaBell /> Notifications
        </h2>

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            {unreadCount}
          </span>
        )}

        <button
          onClick={markAllRead}
          className="text-sm text-blue-600 hover:underline ml-auto"
        >
          Mark all as read
        </button>
      </div>

      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((n) => {
          const Icon = typeIcons[n.type];
          return (
            <li
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer ${
                n.unread ? "bg-gray-50" : "bg-gray-100"
              }`}
            >
              <span className={`mt-1 p-2 rounded-full ${typeStyles[n.type]}`}>
                <Icon />
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{n.message}</p>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
              {n.unread && (
                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
