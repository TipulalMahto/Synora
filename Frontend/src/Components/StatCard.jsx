export default function StatCard({ icon, label, value, accent = 'border-blue-500' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${accent} p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}