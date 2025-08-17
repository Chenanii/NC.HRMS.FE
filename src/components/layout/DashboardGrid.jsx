import { motion } from "framer-motion";
import { Users, Calendar, CreditCard, BarChart3, CheckCircle, AlertCircle } from "lucide-react";

function DashboardCard({ icon: Icon, title, value, subtitle, badge, color = "blue" }) {
  const bgColor = `bg-${color}-100`;
  const textColor = `text-${color}-600`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 transition"
    >
      {badge && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          {badge}
        </span>
      )}
      <div className={`p-3 rounded-xl ${bgColor} ${textColor}`}>
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

export default function DashboardGrid({ sidebarOpen }) {
  // Example dynamic data
  const cardData = [
    {
      icon: Users,
      title: "Total Employees",
      value: "120",
      subtitle: "Active employees in the system",
      color: "blue",
    },
    {
      icon: Calendar,
      title: "Pending Leave Requests",
      value: "8",
      subtitle: "Awaiting approval",
      badge: 8,
      color: "yellow",
    },
    {
      icon: CreditCard,
      title: "Payroll Pending",
      value: "3",
      subtitle: "Requires processing",
      badge: 3,
      color: "green",
    },
    
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      {cardData.map((card, i) => (
        <DashboardCard key={i} {...card} />
      ))}
    </motion.div>
  );
}
