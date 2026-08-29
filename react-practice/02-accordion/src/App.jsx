/**
 * Placeholder page for the Accordion challenge.
 *
 * The workspace is set up (Vite + React + Tailwind) but the challenge itself
 * has not been built yet. Replace everything below with the real accordion.
 */
export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium text-slate-500">React Practice &middot; Day 2</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Accordion</h1>
      </div>

      <p className="text-slate-600">
        This workspace is scaffolded and deploying correctly. The challenge itself has not been
        built yet &mdash; that comes next.
      </p>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Setup check</p>
        <ul className="mt-2 space-y-1">
          <li>Vite + React (JavaScript)</li>
          <li>Tailwind CSS v4 &mdash; if this box is styled, it works</li>
          <li>
            Served from <code className="text-slate-800">/react-practice/02-accordion/</code>
          </li>
        </ul>
      </div>

      <a href="/" className="text-sm font-medium text-sky-700 underline-offset-4 hover:underline">
        &larr; Back to all challenges
      </a>
    </main>
  )
}
