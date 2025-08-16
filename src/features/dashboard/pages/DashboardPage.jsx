import DashboardCard from "../components/DashboardCard";
import { motion } from "framer-motion";
import "../../../index.css"; 
import NotificationPanel from "../../../components/layout/Notifications";

export default function DashboardPage() {
  const cardData = [
    { icon: "fas fa-user", title: "Total Employees", value: "120" },
    { icon: "fas fa-calendar-alt", title: "Leave Requests", value: "8" },
    { icon: "fas fa-money-check-alt", title: "Pending Payrolls", value: "3" },
    { icon: "fas fa-chart-line", title: "Performance", value: "92%" },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <motion.div
        className="dashboard-cards"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
          />
        ))}
      </motion.div>

    </div>
  );
}
