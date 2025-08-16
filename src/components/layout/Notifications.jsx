import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, message: "New user registered", time: "2 mins ago" },
    { id: 2, message: "Server backup completed", time: "10 mins ago" },
    { id: 3, message: "3 pending approvals", time: "30 mins ago" },
  ];

  return (
    <>
      {/* Bell Icon */}
      <div
        className="fixed top-4 right-4 z-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.i
          className="fas fa-bell text-gray-700 hover:text-blue-600"
          style={{ fontSize: "1.75rem" }}
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-40"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500 transition"
                whileHover={{ scale: 1.2 }}
              >
                <i className="fas fa-times"></i>
              </motion.button>
            </div>

            {/* Notification List */}
            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-3rem)]">
              {notifications.map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm flex items-start gap-3"
                >
                  <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                  <div>
                    <p className="text-gray-700 text-sm">{note.message}</p>
                    <span className="text-gray-400 text-xs">{note.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
