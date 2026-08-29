import StatusBadge from './StatusBadge.jsx'
import { SOURCES } from '../data/challenges.js'

/**
 * A single challenge.
 *
 * The "View project" action is only a real link once `liveUrl` is filled in
 * inside challenges.js. Until then it renders as a disabled button, so the
 * page never contains a link that leads nowhere.
 */
export default function ChallengeCard({ challenge }) {
  const source = SOURCES[challenge.source]
  const label = challenge.difficulty ?? challenge.category
  const isLive = Boolean(challenge.liveUrl)

  // Challenges deployed as part of this site use a relative path like
  // '/react-practice/02-accordion/', so they should open in the same tab.
  // Only a full external URL gets target="_blank".
  const opensExternally = isLive && /^https?:\/\//.test(challenge.liveUrl)

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold tabular-nums text-slate-400">
          {String(challenge.number).padStart(2, '0')}
        </span>
        <StatusBadge status={challenge.status} />
      </div>

      <h3 className="mt-3 text-base font-semibold text-slate-900">{challenge.title}</h3>

      <p className="mt-1 text-sm text-slate-500">{source.name}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {label && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            {label}
          </span>
        )}
        {challenge.calendarDay && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            {challenge.calendarDay}
          </span>
        )}
        {challenge.premium && (
          <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
            Premium
          </span>
        )}
      </div>

      {/* mt-auto pins this row to the bottom so every card in a row lines up. */}
      <div className="mt-auto flex items-center gap-4 pt-5 text-sm">
        {isLive ? (
          <a
            href={challenge.liveUrl}
            target={opensExternally ? '_blank' : undefined}
            rel={opensExternally ? 'noreferrer' : undefined}
            className="font-medium text-sky-700 underline-offset-4 hover:underline"
          >
            View project
          </a>
        ) : (
          <span className="cursor-not-allowed font-medium text-slate-300" aria-disabled="true">
            Not deployed
          </span>
        )}

        <a
          href={challenge.originalUrl}
          target="_blank"
          rel="noreferrer"
          className="text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
        >
          Challenge brief
        </a>
      </div>
    </article>
  )
}
