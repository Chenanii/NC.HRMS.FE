import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [active, setActive] = useState("dashboard");

  const handleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const navItemClass = (id) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 
     ${
       active === id
         ? "bg-gray-100 text-gray-900 font-medium"
         : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
     }`;

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 70 }}
      className="bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all h-screen"
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        <span
          className={`text-lg font-bold text-gray-800 transition-all ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          HRMS
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Employees Dropdown */}
        <div>
          <button
            className={`${navItemClass("employees")} w-full justify-between`}
            onClick={() => {
              handleDropdown("employees");
              setActive("employees");
            }}
          >
            <div className="flex items-center gap-3">
              <Users size={20} />
              {sidebarOpen && <span>Employees</span>}
            </div>
            {sidebarOpen &&
              (openDropdown === "employees" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </button>

          <AnimatePresence>
            {openDropdown === "employees" && sidebarOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-8 flex flex-col space-y-1 mt-1"
              >
                <Link
                  to="/users"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded"
                >
                  All Employees
                </Link>
                <Link
                  to="/users/new"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Add Employee
                </Link>
                <Link
                  to="/users/roles"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Roles
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Leaves */}
        <Link
          to="/leave"
          className={navItemClass("leave")}
          onClick={() => setActive("leave")}
        >
          <Calendar size={20} />
          {sidebarOpen && <span>Leaves</span>}
        </Link>

        {/* Payroll */}
        <Link
          to="/payroll"
          className={navItemClass("payroll")}
          onClick={() => setActive("payroll")}
        >
          <CreditCard size={20} />
          {sidebarOpen && <span>Payroll</span>}
        </Link>

        {/* Reports Dropdown */}
        <div>
          <button
            className={`${navItemClass("reports")} w-full justify-between`}
            onClick={() => {
              handleDropdown("reports");
              setActive("reports");
            }}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={20} />
              {sidebarOpen && <span>Reports</span>}
            </div>
            {sidebarOpen &&
              (openDropdown === "reports" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </button>

          <AnimatePresence>
            {openDropdown === "reports" && sidebarOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-8 flex flex-col space-y-1 mt-1"
              >
                <Link
                  to="/reports/attendance"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Attendance
                </Link>
                <Link
                  to="/reports/performance"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded"
                >
                  Performance
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className={navItemClass("settings")}
          onClick={() => setActive("settings")}
        >
          <Settings size={20} />
          {sidebarOpen && <span>Settings</span>}
        </Link>
      </nav>
    </motion.aside>
  );
}
