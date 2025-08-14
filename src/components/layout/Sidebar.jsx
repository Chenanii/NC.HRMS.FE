import { Link, useLocation } from "react-router-dom";
import "../../index.css"; 
import { motion } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: "fas fa-home", label: "Dashboard" },
    { path: "/users", icon: "fas fa-user", label: "Employees" },
    { path: "/leave", icon: "fas fa-calendar-alt", label: "Leave Requests" },
    { path: "/payroll", icon: "fas fa-money-check-alt", label: "Payroll" },
    { path: "/settings", icon: "fas fa-cogs", label: "Settings" },
  ];

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      <div className="sidebar-logo">
        <motion.i
          className="fas fa-users-cog"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        ></motion.i>
        <span>HRMS</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <motion.i
                className={item.icon}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
              ></motion.i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
