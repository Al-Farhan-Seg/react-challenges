import { STATUSES } from '../data/challenges.js'

// One Tailwind class string per status. Keeping them in a plain object is
// easier to read than nesting ternaries inside the JSX.
const statusStyles = {
  'not-started': 'bg-slate-100 text-slate-600 ring-slate-200',
  'in-progress': 'bg-amber-100 text-amber-800 ring-amber-200',
  completed: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {STATUSES[status].label}
    </span>
  )
}
