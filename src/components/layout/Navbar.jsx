import "../../index.css";
import { motion } from "framer-motion";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <motion.i
          className="fas fa-bars"
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
          onClick={onToggleSidebar}
          style={{ cursor: "pointer" }}
        ></motion.i>
      </div>
      <div className="navbar-right">
        <motion.i
          className="fas fa-bell"
          whileHover={{ rotate: 20, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 200 }}
        ></motion.i>
        <motion.i
          className="fas fa-user-circle"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        ></motion.i>
      </div>
    </header>
  );
}
