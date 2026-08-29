import ChallengeCard from './ChallengeCard.jsx'

/** One source heading followed by its grid of challenge cards. */
export default function ChallengeSection({ id, source, challenges }) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{source.name}</h2>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
        >
          Visit source
        </a>
      </div>

      <p className="mt-1 text-sm text-slate-600">
        {source.description} <span className="text-slate-400">&middot;</span>{' '}
        {challenges.length} challenges
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </section>
  )
}
