// The challenge lifecycle — shared across Citizen / University / Industry / Government views.
// Citizen submits -> Government verifies -> Government reviews -> matched with
// University/Industry -> Collaboration -> Solution proposed -> Pilot -> Resolved.
export const STATUS_ORDER = [
  'submitted',
  'verified',
  'gov_review',
  'matching',
  'collaboration',
  'solution',
  'pilot',
  'resolved',
]

export const STATUS_META = {
  submitted: { icon: '📝', label: 'Submitted', desc: 'Received from citizen', color: 'slate' },
  verified: { icon: '✅', label: 'Verified', desc: 'Confirmed genuine by government', color: 'sky' },
  gov_review: { icon: '🏛️', label: 'Under Review', desc: 'Government evaluating the challenge', color: 'amber' },
  matching: { icon: '🎯', label: 'Matching', desc: 'Being matched with a University/Industry partner', color: 'indigo' },
  collaboration: { icon: '🤝', label: 'Under Collaboration', desc: 'Partner actively working on it', color: 'violet' },
  solution: { icon: '💡', label: 'Solution Proposed', desc: 'A solution has been proposed', color: 'yellow' },
  pilot: { icon: '🧪', label: 'Pilot Deployment', desc: 'Solution being piloted on the ground', color: 'teal' },
  resolved: { icon: '🎉', label: 'Resolved', desc: 'Successfully implemented & verified', color: 'green' },
  rejected: { icon: '⛔', label: 'Rejected', desc: 'Not accepted by government', color: 'rose' },
  reopened: { icon: '🔄', label: 'Reopened', desc: 'Citizen flagged the issue as unresolved', color: 'orange' },
  merged: { icon: '🔗', label: 'Merged', desc: 'Folded into another duplicate report', color: 'slate' },
}

export function statusIndex(status) {
  const i = STATUS_ORDER.indexOf(status)
  return i === -1 ? 0 : i
}

// 0-100% progress along the lifecycle, for progress bars.
export function statusProgress(status) {
  if (status === 'rejected') return 0
  return Math.round((statusIndex(status) / (STATUS_ORDER.length - 1)) * 100)
}

export function statusMeta(status) {
  return STATUS_META[status] || { icon: '•', label: status || 'Unknown', desc: '', color: 'slate' }
}

export const STATUS_BADGE_CLASS = {
  submitted: 'border-slate-300 bg-slate-50 text-slate-700',
  verified: 'border-sky-300 bg-sky-50 text-sky-700',
  gov_review: 'border-amber-300 bg-amber-50 text-amber-700',
  matching: 'border-indigo-300 bg-indigo-50 text-indigo-700',
  collaboration: 'border-violet-300 bg-violet-50 text-violet-700',
  solution: 'border-yellow-300 bg-yellow-50 text-yellow-800',
  pilot: 'border-teal-300 bg-teal-50 text-teal-700',
  resolved: 'border-green-300 bg-green-50 text-green-700',
  rejected: 'border-rose-300 bg-rose-50 text-rose-700',
  reopened: 'border-orange-300 bg-orange-50 text-orange-700',
  merged: 'border-slate-300 bg-slate-50 text-slate-500',
}

export function statusBadgeClass(status) {
  return STATUS_BADGE_CLASS[status] || 'border-slate-300 bg-slate-50 text-slate-600'
}
