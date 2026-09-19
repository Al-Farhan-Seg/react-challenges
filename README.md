# React Challenges 

Building React projects one challenge at a time.

**Live:** https://react-challenges.farhansegujja.com/

---

## What this repository is

This is my personal React practice monorepo. It collects challenges from three
different websites into one place, so I can work through them, track my
progress, and deploy the results:

| Source | What it is |
| --- | --- |
| [Frontend Mentor](https://www.frontendmentor.io/use-cases/react-projects) | Real-world designs to build and refine into portfolio pieces. |
| [React Practice](https://reactpractice.dev/start-here/) | A 28-day calendar of small, focused React exercises. |
| [devChallenges](https://devchallenges.io/challenges-dashboard?path=%2C3) | Job-style frontend projects graded by seniority level. |

There are **55 challenges** catalogued: 32 from Frontend Mentor, 13 from React
Practice, and 10 from devChallenges.

### On how this repository was set up

The scaffolding in the first commit — the npm Workspaces structure, the build
tooling, the homepage dashboard, and this README — was generated with
[Claude Code](https://claude.com/claude-code) (Anthropic's CLI), working from a
specification I wrote.

I want that stated plainly rather than left ambiguous. What the AI produced was
**the empty frame**: folders, configuration, documentation, and a dashboard that
renders a list. It solved none of the challenges, and it was explicitly
instructed not to.

Every challenge in this repository is mine to build. That is the entire point of
the repo — I am a Computer Science student learning full-stack development, and
the reason these 55 folders exist is so that I write the code that fills them.
The scaffold saved me a day of configuration; it did not save me any of the
learning, and it was never meant to.

If you are reading a solution in here, I wrote it.

Every application in this repository is built the same way, on purpose, so that
switching between challenges never means re-learning the setup:

- **npm** and **npm Workspaces** for dependency management
- **Vite** as the build tool and dev server
- **React** with **JavaScript** (no TypeScript)
- **Tailwind CSS** for all styling

Tailwind CSS is the standard styling tool here. The homepage uses it, and every
future challenge application should use it too.

### What is here right now

Only the **homepage** is a real, working application. All 55 challenge folders
are **placeholders** — each one holds a small `README.md` with the challenge's
metadata and a link to its brief, and nothing else. I initialise each challenge
as its own application at the moment I actually start working on it. See
[How to add a new React challenge](#how-to-add-a-new-react-challenge).

> The designs, images and written briefs belong to the three source websites.
> They are deliberately **not** copied into this repository. Download them from
> the challenge page when you start work.

---

## Repository structure

```text
react-challenges/
├── package.json            <- the ONE root manifest; declares the workspaces
├── package-lock.json       <- the ONE lockfile for the whole repository
├── node_modules/           <- the ONE install (not committed to Git)
├── README.md               <- this file
├── .gitignore
│
├── homepage/               <- the dashboard. The only real app so far.
│   ├── package.json        <- workspace manifest: @react-challenges/homepage
│   ├── index.html          <- Vite's entry HTML
│   ├── vite.config.js      <- React plugin + Tailwind plugin
│   ├── public/             <- static files copied into dist/ untouched
│   ├── dist/               <- production build output (not committed)
│   └── src/
│       ├── main.jsx        <- React entry point; imports index.css
│       ├── App.jsx         <- page layout
│       ├── index.css       <- Tailwind import + a couple of base styles
│       ├── components/     <- Hero, ChallengeSection, ChallengeCard, StatusBadge
│       └── data/
│           └── challenges.js   <- the catalog of all 55 challenges
│
├── frontend-mentor/        <- 32 placeholder folders (01-… to 32-…)
├── react-practice/         <- 13 placeholder folders (01-… to 13-…)
└── dev-challenges/         <- 10 placeholder folders (01-… to 10-…)
```

### What each directory is for

- **`homepage/`** — a small dashboard listing every challenge, its difficulty,
  and its status. It is a normal Vite + React + Tailwind application and it is
  what gets deployed to Cloudflare Pages.
- **`frontend-mentor/`**, **`react-practice/`**, **`dev-challenges/`** — one
  folder per source. Each contains one folder per challenge. These are
  **grouping directories only**: they have no `package.json` of their own and
  are not workspaces themselves. Their *children* become workspaces.
- **`node_modules/`** — every dependency for every workspace, installed once at
  the root. Never committed.

### `homepage/src/data/challenges.js` — the important file

This is the single source of truth for the whole repository. The homepage
renders all of its cards and calculates its three summary numbers from this one
array, so I never edit JSX to record progress — I only edit data.

---

## npm Workspaces mental model

npm Workspaces lets one repository hold many separate applications while
installing dependencies **once**, together, at the root.

Think of it as one shared warehouse with many shops:

### The root `package.json` is the manager

It doesn't ship any code of its own. It does two jobs:

1. It lists which folders are workspaces:

   ```json
   "workspaces": [
     "homepage",
     "frontend-mentor/*",
     "react-practice/*",
     "dev-challenges/*"
   ]
   ```

   The `*` is a wildcard meaning "any folder directly inside this one". Because
   of those three wildcard lines, **any future challenge folder automatically
   becomes a workspace the moment you give it a `package.json`.** No
   configuration change is ever needed.

   Folders without a `package.json` — which is all 55 placeholders today — are
   simply ignored. That is why `npm install` works fine right now even though
   the wildcards match 55 directories.

2. It provides shortcut scripts so I can work from the root
   (see [Commands reference](#commands-reference)).

### Each workspace `package.json` is a shop

`homepage/package.json` describes only the homepage: its name, its scripts
(`dev`, `build`, `preview`), and the packages it needs. Each future challenge
will get its own, describing only itself.

Workspace names are scoped so they read clearly and can never collide:

```text
@react-challenges/homepage
@react-challenges/02-accordion
@react-challenges/01-results-summary
```

### One `package-lock.json`, at the root only

The lockfile records the exact version of every package installed anywhere in
the repository. There must be exactly **one**, at the root.

**Why nested lockfiles must not exist:** a lockfile inside a workspace means
that workspace resolved its dependencies on its own, independently of the root.
That defeats the entire point of workspaces. You end up with two copies of
React at slightly different versions, duplicated `node_modules` folders, a much
slower install, and bugs that appear in one challenge but not another. If you
ever see a `package-lock.json` inside a challenge folder, delete it (along with
any nested `node_modules`) and run `npm install` from the root again.

### Shared installation

When you run `npm install` at the root, npm reads every workspace's
`package.json`, works out one dependency tree that satisfies all of them, and
installs it into the root `node_modules/`. Ten challenges that all use React 19
share **one** copy of React.

Verify the setup at any time:

```bash
npm run workspaces:list      # lists every folder npm currently treats as a workspace
```

---

## Tailwind CSS mental model

This repository uses **Tailwind CSS v4**, which is configured very differently
from the v3 setup you will find in most older tutorials.

### There is no `tailwind.config.js` and no `postcss.config.js`

If you have used Tailwind v3 before, you will expect those two files. **In v4
they are not needed and this repository does not have them.** Instead:

- Tailwind runs as a **Vite plugin** (`@tailwindcss/vite`), registered in the
  workspace's `vite.config.js`.
- The stylesheet uses a single `@import 'tailwindcss';` line, replacing the old
  `@tailwind base; @tailwind components; @tailwind utilities;` directives.
- Tailwind finds your source files automatically — there is no `content:` array
  to maintain.

Concretely, the homepage's entire Tailwind setup is these two things:

**`homepage/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**`homepage/src/index.css`** (imported once from `src/main.jsx`)

```css
@import 'tailwindcss';
```

If you ever *do* need custom theme values (a brand colour, a custom font), you
add them in CSS rather than in a JS config file:

```css
@import 'tailwindcss';

@theme {
  --color-brand: #2563eb;
}
```

### Tailwind is installed per workspace, not at the root

Each real application installs its own `tailwindcss` and `@tailwindcss/vite`
into its own `package.json`:

```bash
npm install tailwindcss @tailwindcss/vite --save-dev --workspace @react-challenges/homepage
```

Placeholder folders need none of this. They have no `package.json`, no build,
and no styles — there is nothing for Tailwind to scan. **Do not install
Tailwind into a placeholder.** Install it at the moment you initialise that
challenge as a real workspace.

### Why this keeps challenges independent

- Tailwind only ever scans **that workspace's own source files**, so one
  challenge's class names can never leak into another challenge's CSS.
- Tailwind is compiled during **that workspace's own Vite build**. Running
  `npm run build:homepage` compiles the homepage's CSS and touches nothing else.
- Each challenge can pin its own Tailwind version, or customise its own theme,
  without affecting any other challenge.
- **Tailwind is not a runtime dependency.** It is not a server and it does not
  load in the browser. It is a build-time tool that reads your class names and
  writes a plain `.css` file. The deployed site is ordinary static CSS.

Because dependencies are still *installed* by the root npm workspace, this
independence costs nothing: the shared `node_modules` means Tailwind is
downloaded once, not once per challenge.

---

## Commands reference

Unless a row says otherwise, **run every command from the repository root**
(`react-challenges/`).

| Command | What it does | Run from |
| --- | --- | --- |
| `npm install` | Reads every workspace's `package.json` and installs all dependencies into the single root `node_modules/`. Also creates/updates the single root `package-lock.json`. Run this after cloning, and after adding any new workspace. | Root |
| `npm run dev:homepage` | Starts the Vite dev server for the homepage with hot reloading, at `http://localhost:5173`. Stop it with `Ctrl+C`. | Root |
| `npm run build:homepage` | Compiles the homepage for production into `homepage/dist/`. This is the command Cloudflare Pages will run. | Root |
| `npm run preview:homepage` | Serves the already-built `homepage/dist/` locally, so you can check the production build before deploying. Run `build:homepage` first. | Root |
| `npm run build:site` | **The deploy build.** Builds the homepage, then builds every initialised challenge and copies each into `homepage/dist/<source>/<slug>/`, producing one static site containing everything. This is the command Cloudflare Pages runs. | Root |
| `npm run build:all` | Builds every workspace that has a `build` script, leaving each `dist/` where it is. Useful for checking that everything still compiles, without assembling the combined site. | Root |
| `npm run workspaces:list` | Prints every folder npm currently treats as a workspace. Useful for confirming a new challenge was picked up. | Root |
| `npm run dev --workspace @react-challenges/<name>` | Starts the dev server for any single workspace by name. This is how you run an individual challenge. | Root |
| `npm run build --workspace @react-challenges/<name>` | Builds any single workspace by name. | Root |

The three `:homepage` scripts are just shorthand. `npm run dev:homepage` is
defined in the root `package.json` as
`npm run dev --workspace @react-challenges/homepage` — the long form works
identically for any workspace.

---

## How to add a new React challenge

This is the procedure to follow whenever you start a challenge. The example
uses `react-practice/02-accordion`; substitute the folder you actually want.

Run everything **from the repository root**.

### Step 1 — preserve the placeholder README

The folder already contains a `README.md` with the challenge's metadata, and
`create-vite` refuses to scaffold into a folder that is not empty. So move the
README aside first and put it back afterwards:

```bash
mv react-practice/02-accordion/README.md /tmp/challenge-readme.md
rm -rf react-practice/02-accordion
```

### Step 2 — scaffold the Vite React app

```bash
npm create vite@latest react-practice/02-accordion -- --template react --no-immediate
```

Two details matter here:

- **`--template react`** selects React with **JavaScript**. (`react-ts` would
  give you TypeScript — that is not what this repository uses.)
- **`--no-immediate`** stops Vite from running its own `npm install` inside the
  new folder. This is the flag that prevents a nested `node_modules` and a
  second `package-lock.json` from ever being created. **Do not skip it.**

Now restore the challenge README:

```bash
mv /tmp/challenge-readme.md react-practice/02-accordion/README.md
```

### Step 3 — make it a workspace

The generated `package.json` is named just `02-accordion`. Rename it to the
scoped convention so it can never collide with another challenge:

```bash
npm pkg set name="@react-challenges/02-accordion" --workspace react-practice/02-accordion
```

The folder now has a `package.json`, and the root's `react-practice/*` wildcard
already matches it — so it is a workspace. Nothing in the root `package.json`
needs editing.

### Step 4 — install dependencies through the root

```bash
npm install
```

**What this does:** npm notices the new workspace, merges its dependencies into
the shared tree, installs anything missing into the **root** `node_modules/`,
and updates the **root** `package-lock.json`. React and Vite are almost
certainly already there from another challenge, so this is usually fast and
adds nothing new to disk.

### Step 5 — add Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite --save-dev --workspace @react-challenges/02-accordion
```

This adds Tailwind to *that workspace's* `package.json` while still installing
into the shared root `node_modules/`.

Then register the plugin in `react-practice/02-accordion/vite.config.js`, and
set the `base` path at the same time:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/react-practice/02-accordion/',
  plugins: [react(), tailwindcss()],
})
```

**`base` matters.** The whole repository deploys as one site, and this
challenge will be served from `/react-practice/02-accordion/` rather than from
the root. Without `base`, Vite writes asset paths like `/assets/index.js`,
which will 404 once deployed — the page loads with no CSS and no JavaScript.

The value is always a leading slash, the challenge's folder path, and a
trailing slash. `npm run build:site` warns you if you forget it.

### Step 6 — add the Tailwind directive to the stylesheet

Replace the contents of `react-practice/02-accordion/src/index.css` with:

```css
@import 'tailwindcss';
```

(Remember: no `@tailwind base/components/utilities` — that is v3 syntax.)

### Step 7 — import the stylesheet in the React entry point

Check that `react-practice/02-accordion/src/main.jsx` imports it. The Vite
template already does this, but confirm the line is present:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'          // <- this line makes Tailwind work

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Step 8 — clear out the Vite demo content

The template ships a counter demo, logos, and its own styling. Delete them so
you start clean:

```bash
rm -rf react-practice/02-accordion/src/assets
rm -f react-practice/02-accordion/src/App.css
rm -f react-practice/02-accordion/public/vite.svg
```

Then rewrite `src/App.jsx` as your own component, and remove the
`import './App.css'` line it contains.

The template also generates its own `.gitignore` and an `.oxlintrc.json`
(plus an `oxlint` dev dependency). The root `.gitignore` already covers
everything, and this repository does not use a linter yet, so both are safe to
delete if you want a leaner workspace.

### Step 9 — run it

```bash
npm run dev --workspace @react-challenges/02-accordion
```

Vite will pick a free port (5173, then 5174, and so on), so you can even run
the homepage and a challenge side by side.

### Step 10 — update the homepage

Open `homepage/src/data/challenges.js`, find the `rp-02` entry, and change its
status:

```js
status: 'in-progress',
```

### Step 11 — check you did not break the monorepo

```bash
# Should print exactly one path: ./package-lock.json
find . -name package-lock.json -not -path './node_modules/*'

# Should print nothing at all
find . -mindepth 2 -name node_modules -type d -not -path './node_modules/*'
```

If either check fails, delete the offending nested `package-lock.json` and
`node_modules/`, then run `npm install` from the root again.

---

## Dependencies: root vs. workspace

This is the distinction that matters most day to day.

### Installing into one workspace (almost always what you want)

```bash
npm install <package> --workspace @react-challenges/<name>
```

The package is added to **that workspace's** `package.json` only. Other
challenges never see it, never bundle it, and never pay for it in their build
output.

**Example — React Router in one challenge only:**

```bash
npm install react-router --workspace @react-challenges/23-devjobs-web-app
```

Only the devjobs app gets React Router. The homepage and the other 54
challenges stay untouched.

**Example — `date-fns` in the homepage only:**

```bash
npm install date-fns --workspace @react-challenges/homepage
```

**Example — a dev-only dependency (build tools, Tailwind):**

```bash
npm install tailwindcss @tailwindcss/vite --save-dev --workspace @react-challenges/09-weather-app
```

Use `--save-dev` for anything needed only to *build* the project, and a plain
install for anything that ships to the browser.

### Installing at the root (rare)

```bash
npm install <package>
```

Without `--workspace`, the package is added to the **root** `package.json`. Do
this only for tooling that genuinely operates across the whole repository — a
formatter, for example. Never install a challenge's UI library here: it makes
that dependency invisible in the workspace that actually uses it, and the
workspace would no longer build on its own.

**Tailwind belongs in the workspace that uses it**, not at the root. Every
initialised challenge installs its own `tailwindcss` and `@tailwindcss/vite`.
The shared `node_modules/` means this does not waste disk space, and it keeps
each workspace independently buildable. Only change this if you deliberately
redesign the repository to centralise build tooling later.

### Removing a package

```bash
npm uninstall <package> --workspace @react-challenges/<name>
```

---

## `package.json` vs `package-lock.json`

| File | Purpose |
| --- | --- |
| **`package.json`** | The **intent**, written by you. It says *"this project needs React 19-ish"* using a version range like `^19.2.0`. It also holds the project's name and its scripts. |
| **`package-lock.json`** | The **outcome**, written by npm. It records the *exact* version that range resolved to (`19.2.8`), plus the exact version of every dependency-of-a-dependency, and a checksum for each. |

The lockfile is what makes installs reproducible: it guarantees that installing
today, or on another machine, or on Cloudflare's build server, produces the
identical dependency tree. Commit it, and let npm edit it — never edit it by
hand.

---

## `node_modules/`

`node_modules/` is not committed to Git, and `.gitignore` excludes it. Reasons:

- **It is enormous.** Tens of thousands of files, easily hundreds of megabytes.
- **It is fully reproducible.** `package.json` plus `package-lock.json` contain
  everything needed to rebuild it exactly, and `npm install` does so in seconds.
- **It is machine-specific.** Some packages compile native binaries for the
  operating system they were installed on. Committing them would break the
  repository for anyone on a different platform.

Anyone cloning this repository just runs `npm install` at the root.

---

## Adding challenge links to the homepage

All progress tracking happens in **`homepage/src/data/challenges.js`**. The
three numbers in the hero (`Total Challenges`, `Completed`, `In Progress`) are
calculated from this array, so they update themselves — there is nothing else
to edit.

Find the challenge's entry and change these fields:

**When I start a challenge:**

```js
status: 'in-progress',
```

**When I finish it:**

```js
status: 'completed',
```

**When I have a live deployed URL:**

```js
liveUrl: 'https://my-accordion.pages.dev',
```

The card's action button reads `liveUrl` directly. While it is `null` the card
shows a greyed-out **"Not deployed"** label instead of a link, so the homepage
never contains a link that leads nowhere. As soon as you fill in a real URL,
that label becomes a working **"View project"** link.

The valid statuses are exactly:

```text
not-started    in-progress    completed
```

---

## Building

```bash
npm run build:homepage
```

Here is what actually happens:

1. Vite reads `homepage/index.html` and follows it to `src/main.jsx`.
2. It compiles every `.jsx` file to plain JavaScript, and bundles the whole
   module graph — including your `challenges.js` data — into a few optimised
   files.
3. **Tailwind runs as part of this build.** The plugin scans the workspace's
   source files, finds every utility class actually used, and generates a CSS
   file containing only those. Unused Tailwind classes are never emitted, which
   is why the homepage's CSS is around 16 kB rather than megabytes.
4. Everything in `homepage/public/` is copied across untouched.
5. The result is written to **`homepage/dist/`**: an `index.html` plus hashed
   asset files, for example:

   ```text
   homepage/dist/index.html
   homepage/dist/assets/index-BhDftUuL.css
   homepage/dist/assets/index-C0nvdi3h.js
   ```

That output is **plain static files** — HTML, CSS and JavaScript. There is no
server, no Node process, and no Vite involved at runtime. A static host serves
`dist/` exactly as it is. Vite's dev server (`npm run dev:homepage`) is a
local development tool only; it is never part of a deployment.

To check the production build locally before deploying:

```bash
npm run build:homepage
npm run preview:homepage
```

To build the **whole** site — the homepage plus every challenge you have
started — use the deploy build instead:

```bash
npm run build:site
```

---

## Deploying a challenge

Challenges do **not** each get their own Cloudflare Pages project. That would
mean dozens of projects, and because every project connected to this repository
rebuilds on every push to `main`, a single commit would trigger dozens of
builds and burn through the free tier's monthly build allowance.

Instead the entire repository is one Pages project. `npm run build:site`
assembles everything into a single `homepage/dist/` folder, and each challenge
is served from a subfolder matching its path in the repo:

```text
reactchallenges.example.com/                              <- the dashboard
reactchallenges.example.com/react-practice/02-accordion/  <- a challenge
```

So to deploy a challenge, there is nothing to configure. Just:

1. Make sure its `vite.config.js` sets `base` (see
   [step 5](#step-5--add-tailwind-css) of the setup procedure).
2. Set its `liveUrl` in `homepage/src/data/challenges.js` to its subpath:

   ```js
   liveUrl: '/react-practice/02-accordion/',
   ```

3. Commit and push. Cloudflare rebuilds the whole site, and the card's
   "Not deployed" label becomes a working "View project" link.

Run `npm run build:site` locally first if you want to check it before pushing —
it prints every path it produced.

A separate Pages project is only worth it if a particular challenge needs its
own domain.

---

## Cloudflare Pages note

This repository is structured to be deployed to Cloudflare Pages, but **no
Cloudflare account, project, or deployment is configured yet.** That will be set
up separately, through the Cloudflare dashboard.

The whole repository deploys as **one** Cloudflare Pages project:

| | |
| --- | --- |
| Build command | `npm run build:site` |
| Build output directory | `homepage/dist` |
| Root directory | *leave blank* |

`npm run build:site` builds the homepage, then builds every challenge that has
actually been initialised and copies each one into the site underneath the
homepage:

```text
/                                  ->  the dashboard
/react-practice/02-accordion/      ->  that challenge
/frontend-mentor/01-results-summary/
```

So one push deploys everything, and there is no need for a separate Pages
project per challenge. See [Deploying a challenge](#deploying-a-challenge).

This is a plain static site. It needs no Cloudflare Workers, no Pages
Functions, and no Cloudflare-specific code — and none of those have been added.
Unlike a plain HTML/CSS/JS repository, which Cloudflare can serve directly from
source, this one has a build step: Cloudflare runs `npm install` and the build
command, then serves the generated `homepage/dist/` folder.

Every push to `main` rebuilds and redeploys the whole site automatically.
Pushes to any other branch get their own preview URL instead, so an unfinished
challenge can be checked without touching production.

**Root directory must stay blank.** It is tempting to point Cloudflare at
`homepage/`, but `package-lock.json` and the workspaces config live at the repo
root and npm needs both. The build command reaches into the workspaces for you.
