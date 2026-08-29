/**
 * Builds the whole repository into ONE static site.
 *
 * The homepage is built first, into `homepage/dist/`. Then every challenge
 * that has actually been initialised is built and copied in underneath it, at
 * a path matching its folder:
 *
 *   homepage/dist/                                     ->  /
 *   homepage/dist/react-practice/02-accordion/         ->  /react-practice/02-accordion/
 *   homepage/dist/frontend-mentor/01-results-summary/  ->  /frontend-mentor/01-results-summary/
 *
 * That means ONE Cloudflare Pages project deploys the dashboard and every
 * challenge together, rather than one project per challenge.
 *
 * Placeholder folders are skipped automatically: a challenge is only picked up
 * once it has a `package.json` with a `build` script.
 *
 * Run it with:  npm run build:site
 */

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, cpSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE_DIRS = ['frontend-mentor', 'react-practice', 'dev-challenges']
const SITE_DIR = 'homepage/dist'

/**
 * Run an npm command, inheriting this terminal so build output streams through.
 * On Windows npm is a `.cmd` shim, which Node will only launch via a shell, so
 * the command is passed as one already-quoted string rather than an array.
 */
function npm(command) {
  execSync(`npm ${command}`, { stdio: 'inherit' })
}

/**
 * Find every challenge folder that has become a real workspace.
 * A folder counts only if it has a package.json with a `build` script.
 */
function findBuiltChallenges() {
  const found = []

  for (const sourceDir of SOURCE_DIRS) {
    if (!existsSync(sourceDir)) continue

    for (const slug of readdirSync(sourceDir).sort()) {
      const localPath = `${sourceDir}/${slug}`
      const pkgPath = join(sourceDir, slug, 'package.json')
      if (!existsSync(pkgPath)) continue

      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      if (!pkg.scripts?.build) continue

      found.push({
        name: pkg.name,
        localPath,
        // Vite must be told the site is served from this subfolder.
        expectedBase: `/${localPath}/`,
      })
    }
  }

  return found
}

/**
 * Warn if a challenge forgot to set `base` in its vite.config.js. Without it
 * Vite writes root-absolute asset paths like `/assets/index.js`, which 404
 * once the app is served from a subfolder.
 */
function checkBasePath(challenge) {
  const indexHtml = join(challenge.localPath, 'dist', 'index.html')
  if (!existsSync(indexHtml)) return

  const html = readFileSync(indexHtml, 'utf8')
  if (html.includes(challenge.expectedBase)) return

  console.warn(
    `\n  WARNING  ${challenge.localPath} does not look like it sets a base path.` +
      `\n           Add this to ${challenge.localPath}/vite.config.js:` +
      `\n             base: '${challenge.expectedBase}',` +
      `\n           Without it, the deployed page will load no CSS or JS.\n`,
  )
}

// --- build ---------------------------------------------------------------

console.log('\nBuilding homepage...')
npm('run build:homepage')

const challenges = findBuiltChallenges()

if (challenges.length === 0) {
  console.log('\nNo challenges initialised yet. Site contains the homepage only.')
} else {
  console.log(`\nBuilding ${challenges.length} challenge(s)...`)

  for (const challenge of challenges) {
    console.log(`\n-> ${challenge.localPath}`)
    npm(`run build --workspace ${JSON.stringify(challenge.name)}`)
    checkBasePath(challenge)

    // Copy the built challenge into the site under its own folder.
    cpSync(join(challenge.localPath, 'dist'), join(SITE_DIR, challenge.localPath), {
      recursive: true,
    })
  }
}

console.log(`\nDone. Site ready in ${SITE_DIR}/`)
for (const challenge of challenges) {
  console.log(`  ${challenge.expectedBase}`)
}
console.log('')
