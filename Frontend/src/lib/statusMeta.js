export const STATUS_META = {
    submitted: { label: 'Pending Verification', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    verified: { label: 'Verified', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    review: { label: 'Under Review', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    forwarded: { label: 'Shared as Challenge', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    matching: { label: 'Interest Received', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
    collaboration: { label: 'Under Collaboration', color: 'bg-teal-100 text-teal-800 border-teal-300' },
    solution: { label: 'Solution Proposed', color: 'bg-green-100 text-green-800 border-green-300' },
    pilot: { label: 'Implementation', color: 'bg-lime-100 text-lime-800 border-lime-300' },
    resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    reopened: { label: 'Reopened', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-300' },
    merged: { label: 'Merged', color: 'bg-gray-100 text-gray-600 border-gray-300' },
}
export const FLOW_STEPS = ['submitted', 'verified', 'review', 'forwarded', 'matching', 'collaboration', 'solution', 'pilot', 'resolved']