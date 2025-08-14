import { motion } from "framer-motion";

export default function DashboardCard({ icon, title, value }) {
  return (
    <motion.div
      className="dashboard-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
    >
      <i className={icon}></i>
      <div>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </motion.div>
  );
}
