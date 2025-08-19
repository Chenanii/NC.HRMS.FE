export default function DashboardCard({ icon, title, value, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50",
    green: "text-green-500 bg-green-50",
    yellow: "text-yellow-500 bg-yellow-50",
    purple: "text-purple-500 bg-purple-50",
    red: "text-red-500 bg-red-50",
    indigo: "text-indigo-500 bg-indigo-50"
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className={`${colorClasses[color]} p-2 lg:p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-500 text-sm lg:text-base truncate">{title}</p>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{value}</h2>
        </div>
      </div>
    </div>
  );
}