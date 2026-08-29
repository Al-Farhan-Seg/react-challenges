/** Page header, plus the three totals derived from the challenge data. */
export default function Hero({ stats }) {
  const summary = [
    { label: 'Total Challenges', value: stats.total },
    { label: 'Completed', value: stats.completed },
    { label: 'In Progress', value: stats.inProgress },
  ]

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          React Challenges
        </h1>

        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Building React projects one challenge at a time.
        </p>

        <p className="mt-4 text-sm font-medium text-slate-500">
          Frontend Mentor <span className="text-slate-300">&bull;</span> React Practice{' '}
          <span className="text-slate-300">&bull;</span> devChallenges
        </p>

        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
          {summary.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
              <dd className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}
