import { STATUS_META } from '../lib/statusMeta.js'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-600 border-gray-300' }
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.color}`}>{meta.label}</span>
}