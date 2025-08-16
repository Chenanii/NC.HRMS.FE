import { Link, useLocation } from "react-router-dom";
import "../../index.css"; 
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { path: "/dashboard", icon: "fas fa-home", label: "Dashboard" },
    {
      icon: "fas fa-user",
      label: "Employees",
      dropdown: [
        { path: "/users", label: "All Employees" },
        { path: "/users/new", label: "Add Employee" },
        { path: "/users/roles", label: "Roles" }
      ]
    },
    { path: "/leave", icon: "fas fa-calendar-alt", label: "Leave Requests" },
    { path: "/payroll", icon: "fas fa-money-check-alt", label: "Payroll" },
    {
      icon: "fas fa-cogs",
      label: "Settings",
      dropdown: [
        { path: "/settings/profile", label: "Profile" },
        { path: "/settings/account", label: "Account" }
      ]
    }
  ];

  const handleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

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
          const isActive = item.path
            ? location.pathname === item.path
            : item.dropdown?.some((d) => location.pathname === d.path);

          if (item.dropdown) {
            return (
              <div key={item.label} className={`sidebar-link dropdown ${isActive ? "active" : ""}`}>
                <div
                  className="dropdown-toggle"
                  onClick={() => handleDropdown(item.label)}
                  tabIndex={0}
                  style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <motion.i
                    className={item.icon}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  ></motion.i>
                  <span style={{ marginLeft: 8 }}>{item.label}</span>
                  <i
                    className={`fas fa-chevron-${openDropdown === item.label ? "up" : "down"}`}
                    style={{ marginLeft: "auto", fontSize: 12 }}
                  ></i>
                </div>
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      className="dropdown-menu"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`dropdown-item${location.pathname === sub.path ? " active" : ""}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

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