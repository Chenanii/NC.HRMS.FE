import { useState } from "react";
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
  FileText
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen, isMobile }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [active, setActive] = useState("dashboard");

  const handleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const navItemClass = (id) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 
     ${
       active === id
         ? "bg-blue-100 text-blue-700 font-medium"
         : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
     }`;

  // Close sidebar on mobile when clicking nav items
  const handleNavClick = (id) => {
    setActive(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? 'fixed' : 'relative'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isMobile && sidebarOpen ? 'z-50' : 'z-30'}
          bg-white border-r border-gray-200 shadow-sm flex flex-col transition-transform duration-300 h-screen
          ${isMobile ? 'w-64' : sidebarOpen ? 'w-64' : 'w-16'}
        `}
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
          {/* Dashboard */}
          <button
            className={navItemClass("dashboard")}
            onClick={() => handleNavClick("dashboard")}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

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

            {openDropdown === "employees" && sidebarOpen && (
              <div className="pl-8 flex flex-col space-y-1 mt-1">
                <button className="text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded">
                  All Employees
                </button>
                <button className="text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded">
                  Add Employee
                </button>
                <button className="text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded">
                  Roles
                </button>
              </div>
            )}
          </div>

          {/* Leaves */}
          <button
            className={navItemClass("leave")}
            onClick={() => handleNavClick("leave")}
          >
            <Calendar size={20} />
            {sidebarOpen && <span>Leaves</span>}
          </button>

          {/* Payroll */}
          <button
            className={navItemClass("payroll")}
            onClick={() => handleNavClick("payroll")}
          >
            <CreditCard size={20} />
            {sidebarOpen && <span>Payroll</span>}
          </button>

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
                <FileText size={20} />
                {sidebarOpen && <span>Reports</span>}
              </div>
              {sidebarOpen &&
                (openDropdown === "reports" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </button>

            {openDropdown === "reports" && sidebarOpen && (
              <div className="pl-8 flex flex-col space-y-1 mt-1">
                <button className="text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded">
                  Attendance
                </button>
                <button className="text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded">
                  Performance
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            className={navItemClass("settings")}
            onClick={() => handleNavClick("settings")}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>
      </aside>
    </>
  );
}