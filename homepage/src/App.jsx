import Hero from './components/Hero.jsx'
import ChallengeSection from './components/ChallengeSection.jsx'
import { SOURCES, challengesBySource, getStats } from './data/challenges.js'

// The order the three sections appear in on the page.
const sectionOrder = ['frontend-mentor', 'react-practice', 'dev-challenges']

export default function App() {
  const stats = getStats()

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <Hero stats={stats} />

      <main className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        {sectionOrder.map((sourceId) => (
          <ChallengeSection
            key={sourceId}
            id={sourceId}
            source={SOURCES[sourceId]}
            challenges={challengesBySource(sourceId)}
          />
        ))}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>
            A learning repository. Designs and briefs belong to their original authors and are not
            reproduced here.
          </p>
          <p className="mt-1">
            Progress is tracked in{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
              homepage/src/data/challenges.js
            </code>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
