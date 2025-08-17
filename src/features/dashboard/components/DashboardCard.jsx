export default function DashboardCard({ icon, title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transition">
      <div className="text-blue-500 text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  );
}
