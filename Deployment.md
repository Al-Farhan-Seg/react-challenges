# Deployment Notes

Personal working notes and reference for this repository's build and
deployment, written to be re-read later.

> **This file is intentionally not tracked by Git.** It is excluded via
> `.git/info/exclude` (a local-only ignore list) rather than `.gitignore`, so
> the exclusion stays on this machine and is never pushed. See
> [Why this file is untracked](#why-this-file-is-untracked).

---

## Status: live

| | |
| --- | --- |
| Custom domain | https://react-challenges.farhansegujja.com/ |
| Pages subdomain | https://react-challenges.pages.dev/ |
| GitHub | https://github.com/Al-Farhan-Seg/react-challenges |
| Challenges initialised | none yet — all 55 are placeholders |

Both URLs serve the same deployment. Every push to `main` rebuilds and
redeploys automatically.

The pipeline for deploying a challenge is built and was tested end to end (an
accordion workspace was scaffolded, deployed to
`/react-practice/02-accordion/`, verified, and then removed again so that every
challenge on the dashboard is one I build myself). So the first challenge I
finish deploys with no new setup — see
[One project, not fifty-six](#one-project-not-fifty-six).

---

## Cloudflare Pages settings (working configuration)

| Field | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build:site` |
| Build output directory | `homepage/dist` |
| Root directory | *(blank)* |

Three things here are easy to get wrong:

1. **Framework preset must be `None`.** Selecting "React" or "Vite" auto-fills
   `npm run build` and `dist`, which is correct for a single-app repo and wrong
   for this monorepo.
2. **Build command is `build:site`, not `build:homepage`.** `build:homepage`
   builds only the dashboard; `build:site` builds the dashboard *and* every
   initialised challenge. Getting this wrong is silent — the site deploys fine,
   just without any challenges.
3. **Root directory must stay blank.** It is tempting to point Cloudflare at
   `homepage/`, but `package-lock.json` and the workspaces config live at the
   repo root and npm needs both. The build command reaches into the workspaces
   on its own.

---

## Why this is different from a normal static site

With `roadmap.sh-builds`, the files in the repo **are** the website. Cloudflare
serves them directly, byte for byte.

Here, the files in the repo are **not** a website:

- A browser cannot execute `.jsx`. JSX is not JavaScript; it is syntax that has
  to be compiled away first.
- The Tailwind classes in the JSX do not exist as CSS anywhere in the repo.
  There is no stylesheet defining `.text-slate-900` until something generates
  it.

So Cloudflare has to **run a build** that turns the source into plain
HTML/CSS/JS, then serve only the generated folder. That is why two fields have
to be filled in that a plain static site never needs.

Day to day nothing changes: still just `git push`.

---

## The wildcard Worker incident

Worth recording, because the symptom pointed nowhere near the cause.

**Symptom.** `react-challenges.pages.dev` served fine. The custom domain
`react-challenges.farhansegujja.com` returned `404 Not found` as
`text/plain`, even though the Pages dashboard showed the domain **Active** with
**SSL enabled**, and DNS resolved correctly to Cloudflare IPs.

**What ruled things out.** The working `roadmapsh.farhansegujja.com` returned
the header `x-content-type-options: nosniff`, which Pages sets. The broken
domain returned no Pages headers at all — so the request was never reaching
Pages. TLS negotiated fine, so the certificate was not the issue. DNS resolved,
so that was not it either.

**The decisive test.** Requesting subdomains that do not exist at all:

```text
definitely-not-real-xyz123.farhansegujja.com   404   "Not found"
another-random-test.farhansegujja.com          404   "Not found"
react-challenges.farhansegujja.com             404   "Not found"   <- identical
roadmapsh.farhansegujja.com                    200   <!doctype html>
jarah.farhansegujja.com                        200   <!DOCTYPE html>
```

Non-existent subdomains returned exactly the same response as the broken one.
That is not a Pages 404 — that is the Worker behind the `*.farhansegujja.com`
wildcard answering everything.

**The cause.** Worker routes are evaluated *before* Pages custom domains.

- **Proxied (orange cloud)** → the request enters the zone's Cloudflare edge →
  the wildcard Worker route matches → the Worker replies "Not found" → Pages is
  never consulted.
- **DNS only (grey cloud)** → the CNAME resolves straight to
  `react-challenges.pages.dev` → the request never passes through the zone's
  routing → the Worker never runs → Pages serves it.

`roadmapsh` and `jarah` were both already grey-clouded. The new record was the
only orange one — which is exactly why it was the only broken one.

**The fix.** Set the `react-challenges` CNAME to **DNS only**.

The alternative, if the record has to stay proxied, is to carve out an
exception: **Workers Routes → Add route → `react-challenges.farhansegujja.com/*`
→ Worker: `None`**.

**Lesson.** When a hostname returns something, the question is not only "is my
app deployed?" but "what is answering?" Response headers and a control request
to a hostname that should *not* exist identified the culprit faster than any
amount of re-reading the Pages configuration.

---

## One project, not fifty-six

Challenges do **not** each get their own Pages project. With 55 challenges that
would mean 56 projects:

- Every Pages project connected to a repository rebuilds on every push to its
  production branch. One commit would kick off dozens of builds.
- The free tier caps both projects per account and builds per month.
- 56 dashboards to configure and keep in sync, for one repository.

Instead the whole repo is **one** project. `npm run build:site` builds the
homepage into `homepage/dist/`, then builds each initialised challenge and
copies it in underneath, at a path matching its folder:

```text
/                                     ->  the dashboard
/react-practice/02-accordion/         ->  a challenge
/frontend-mentor/01-results-summary/  ->  a future challenge
```

Placeholders are skipped automatically — a folder is only picked up once it has
a `package.json` containing a `build` script.

### The one thing each challenge must do

Set `base` in its own `vite.config.js`, matching its folder path:

```js
export default defineConfig({
  base: '/react-practice/02-accordion/',
  plugins: [react(), tailwindcss()],
})
```

Without it, Vite writes root-absolute asset paths (`/assets/index.js`) that 404
when the app is served from a subfolder — the page loads with no CSS and no JS.
`npm run build:site` inspects the built HTML and warns if this is missing.

### Recording it on the homepage

Set the challenge's `liveUrl` in `homepage/src/data/challenges.js` to its
subpath — relative, because it is the same site:

```js
liveUrl: '/react-practice/02-accordion/',
```

The card's greyed-out "Not deployed" label becomes a working "View project"
link, and the homepage's counters update themselves.

---
---

# Deep dive: how the build actually works

Everything below is the "why", not the "how to". It is the part worth
understanding properly, because it generalises far beyond this repository.

---

## 1. The three things npm juggles

Almost every confusion about Node projects comes from blurring these three.
They are different in kind, not just in content.

| | `package.json` | `package-lock.json` | `node_modules/` |
| --- | --- | --- | --- |
| Who writes it | You | npm | npm |
| What it expresses | **Intent** | **Resolution** | **Reality** |
| Example | `"react": "^19.2.0"` | `"version": "19.2.8"` + integrity hash | the actual files on disk |
| In Git? | Yes | Yes | **No** |
| Human-editable | Yes | Never by hand | Never by hand |

**`package.json` is a wish, not a fact.** `^19.2.0` means "19.2.0 or any later
19.x". That is a *range*. Two people installing on different days from the same
`package.json` could legitimately get different versions.

**`package-lock.json` is the fact.** It records precisely which version each
range resolved to, the resolved download URL, and a cryptographic `integrity`
hash of the package contents. It does this for the entire tree — not just your
direct dependencies but every dependency of every dependency, hundreds deep.

This is what makes builds *reproducible*. Without a lockfile, "it works on my
machine" is a genuine possibility rather than a joke: your machine resolved
`^19.2.0` to 19.2.8 in March, Cloudflare's build server resolves it to 19.4.0
in June, and a regression in 19.4.0 breaks production while your laptop stays
happy.

**`node_modules/` is disposable.** It is the materialisation of the lockfile.
It is enormous, platform-specific (some packages compile native binaries), and
fully reconstructible from the two files above. That is exactly why it is
gitignored: committing it would be committing a build artifact.

> The mental shortcut: **`package.json` = what I asked for. `package-lock.json`
> = what I actually got. `node_modules/` = where it physically lives.**

---

## 2. What npm Workspaces actually does

Without workspaces, ten React projects in one repo means ten `node_modules/`
folders, ten lockfiles, and ten copies of React on disk.

Workspaces change one thing: **npm treats many `package.json` files as a single
dependency problem to solve.**

The root `package.json` declares which folders participate:

```json
"workspaces": [
  "homepage",
  "frontend-mentor/*",
  "react-practice/*",
  "dev-challenges/*"
]
```

The `*` is a glob. A folder only becomes a workspace once it contains a
`package.json` — which is why all 55 placeholder folders match those globs
today and are silently ignored.

### What happens when you run `npm install` at the root

Today `homepage` is the only workspace, so the interesting behaviour is not yet
visible. The walkthrough below assumes a second one — say
`react-practice/02-accordion` — has been initialised, because that is when each
step starts to matter.

1. **Discovery.** npm reads the root `package.json`, expands the globs, and
   finds every folder containing a `package.json`.
2. **Unification.** It merges every workspace's dependencies into one problem.
   Suppose the homepage asks for `react@^19.2.0` and the accordion asks for
   `react@^19.2.8`. Those are *ranges*, and npm looks for a single version
   satisfying both. 19.2.8 does, so that is what it installs — **once**.
3. **Hoisting.** That one shared copy is installed at the **root**
   `node_modules/react`, not inside either workspace.
4. **Linking.** npm creates symlinks in the root `node_modules/` pointing at
   each workspace folder:

   ```text
   node_modules/@react-challenges/homepage      ->  ../../homepage
   node_modules/@react-challenges/02-accordion  ->  ../../react-practice/02-accordion
   ```

   This is why workspaces can import each other by package name, and why
   `--workspace @react-challenges/02-accordion` resolves to a folder.
5. **One lockfile.** A single root `package-lock.json` records the unified
   resolution for everything.

The payoff scales: twenty challenges all using React 19 means **one** copy of
React on disk, not twenty.

### Why Node still finds packages from inside a workspace

Node's module resolution walks *upward*. When
`react-practice/02-accordion/src/App.jsx` imports `react`, Node checks:

```text
react-practice/02-accordion/node_modules/react   (doesn't exist)
react-practice/node_modules/react                (doesn't exist)
node_modules/react                               <- found, at the repo root
```

Hoisting works *because* of this upward walk. Nothing has to be configured.

### Why nested lockfiles are actively harmful

If `react-practice/02-accordion/package-lock.json` existed, that workspace
would have resolved its dependencies **independently** of the root. You would
get two React copies at slightly different versions, two `node_modules` trees,
much slower installs, and — worst — bugs that appear in one challenge and not
another, from a version skew nothing in your code reveals.

This is precisely why the setup procedure passes `--no-immediate` to
`create-vite`. Without it, Vite helpfully runs its own `npm install` inside the
new folder, and that one command silently creates both a nested lockfile and a
nested `node_modules`.

Two commands verify the invariant at any time:

```bash
find . -name package-lock.json -not -path './node_modules/*'   # expect exactly 1
find . -mindepth 2 -name node_modules -type d \
  -not -path './node_modules/*'                                # expect nothing
```

---

## 3. `npm install` vs `npm ci` — and why Cloudflare uses the second

These look interchangeable. They are not, and the difference is the heart of
reproducible deployment.

| | `npm install` | `npm ci` |
| --- | --- | --- |
| Reads | `package.json` primarily | `package-lock.json` **only** |
| May change the lockfile | **Yes** | **Never** |
| Existing `node_modules` | Updated in place | **Deleted**, then rebuilt |
| If the two files disagree | Silently fixes the lockfile | **Fails loudly** |
| Speed | Slower (must resolve) | Faster (nothing to resolve) |
| Meant for | Development | CI / production builds |

`npm install` is a *negotiation*. If you hand-edit `package.json` to
`"react": "^20.0.0"`, install will go find React 20 and rewrite the lockfile.
Convenient while developing; unacceptable on a build server, where you want the
build to reflect exactly what you committed.

`npm ci` ("clean install") is an *execution*. It installs precisely the tree the
lockfile describes and refuses to improvise. If `package.json` and
`package-lock.json` disagree, it exits with an error rather than papering over
it.

**Practical consequence:** if you ever edit dependencies by hand and push
without running `npm install` locally, your Cloudflare build fails — not
because the code is wrong, but because `npm ci` correctly refuses to guess.
Always commit `package.json` and `package-lock.json` **together**.

This is also why the clean-clone rehearsal was worth doing:

```bash
git clone https://github.com/Al-Farhan-Seg/react-challenges.git
cd react-challenges
npm ci
npm run build:site
```

That is Cloudflare's pipeline, run locally. It produced asset filenames
identical to the local build — `index-BhDftUuL.css` both times. Identical
hashes across two machines is the observable proof that the lockfile did its
job.

---

## 4. How a build command actually resolves

`npm run build:homepage` looks like one command. It is four hops.

```text
1.  npm run build:homepage
      -> reads "scripts" in the ROOT package.json
      -> finds: "npm run build --workspace @react-challenges/homepage"

2.  npm run build --workspace @react-challenges/homepage
      -> resolves that package name to the folder ./homepage
      -> changes working directory to ./homepage
      -> reads "scripts" in homepage/package.json
      -> finds: "vite build"

3.  vite build
      -> npm puts ./node_modules/.bin on PATH first
      -> "vite" resolves to the shared binary at the repo ROOT
      -> Vite runs with its CWD inside ./homepage

4.  Vite reads homepage/vite.config.js and builds
```

Three things worth extracting from that:

**Scripts are just shell commands with a better `PATH`.** The only magic npm
adds is prepending `node_modules/.bin` to `PATH`. That is why `vite` works as a
bare word inside a script but not in your terminal — the binary is not global,
it is a shim in `node_modules/.bin` that npm makes findable.

**`--workspace` takes a package *name*, not a path.** `@react-challenges/homepage`
is resolved via the symlinks from step 4 of the install. This is why renaming a
workspace's `name` field breaks the root scripts that reference it.

**The working directory moves, but dependency resolution does not.** Vite runs
inside `homepage/`, so relative paths in the config are relative to there. But
`import react from 'react'` still walks upward to the root `node_modules/`.
Config is local; dependencies are shared.

---

## 5. What `vite build` actually does

This is the step that turns a repository into a website. Roughly:

**a. Find the entry.** Vite reads `index.html` — not a JS file. This is unusual
and deliberate: the HTML *is* the entry point. Vite finds
`<script type="module" src="/src/main.jsx">` and follows it.

**b. Walk the module graph.** From `main.jsx` it follows every `import`,
recursively: `App.jsx` → `Hero.jsx`, `ChallengeSection.jsx` →
`ChallengeCard.jsx` → `StatusBadge.jsx`, plus `challenges.js` and `index.css`.
The homepage build reports "21 modules transformed" — that is the graph size,
including React itself.

**c. Transform each module.** JSX is compiled to plain function calls. This:

```jsx
<h1 className="text-2xl">Accordion</h1>
```

becomes roughly:

```js
jsx('h1', { className: 'text-2xl', children: 'Accordion' })
```

No browser has ever understood JSX. This step is why a build is mandatory
rather than optional.

**d. Run plugins.** `@tailwindcss/vite` scans this workspace's source files for
class names, then generates a stylesheet containing **only** the utilities
actually used. Unused Tailwind classes are never emitted — which is why the
homepage's CSS is ~16 kB rather than the multi-megabyte theoretical maximum.
Note the scope: *this workspace's* files. That is what keeps challenges from
leaking styles into each other.

**e. Bundle and optimise.** Rollup combines the graph into a few files,
tree-shakes unreachable exports, and minifies.

**f. Hash and emit.** Output filenames embed a hash of their contents:

```text
dist/assets/index-BhDftUuL.css
dist/assets/index-C0nvdi3h.js
```

This enables **cache busting**. Cloudflare can serve these with a
years-long cache lifetime, because changing the code changes the filename. The
browser is never asked to guess whether its cached copy is stale — a different
build is simply a different URL. It also means identical hashes across two
machines prove byte-identical output.

**g. Copy `public/`.** Anything in `public/` is copied verbatim, no processing.
That is the escape hatch for files that must keep an exact name — `favicon.svg`,
`robots.txt`, `_redirects`.

The result in `dist/` is plain static files. **No Node, no Vite, and no build
tooling exists at runtime.** The deployed site is HTML, CSS and JS that any
static host could serve from a folder.

---

## 6. What `build:site` adds on top

`scripts/build-site.mjs` is an orchestrator. It runs no compiler itself:

1. Run `npm run build:homepage` → produces `homepage/dist/`.
   This happens **first**, because Vite empties its output directory before
   writing. Doing it later would delete every challenge already copied in.
2. Scan `frontend-mentor/`, `react-practice/`, `dev-challenges/` for folders
   containing a `package.json` with a `build` script. Placeholders have no
   `package.json`, so they are skipped with no special-casing.
3. For each one found: `npm run build --workspace <name>`, then copy its
   `dist/` into `homepage/dist/<source>/<slug>/`.
4. Between build and copy, read the produced `index.html` and check it contains
   the expected `base` prefix. If not, print a warning naming the exact line to
   add.

That last step is a *guard rail*, and it is the interesting design decision. A
missing `base` produces a build that succeeds, deploys, and then loads a blank
page in production with no error anywhere in the logs. Failing loudly at build
time converts a confusing production symptom into an obvious local message.

The general principle, worth carrying into other projects: **when a mistake is
silent and its symptom is remote from its cause, add a check at the moment the
mistake is made.**

---

## 7. Why `base` matters: absolute vs relative URLs

By default Vite assumes the app is served from the domain root, and emits:

```html
<script src="/assets/index-D9Ry5z9C.js">
```

That leading `/` means "from the origin root". Requested from
`react-challenges.farhansegujja.com/react-practice/02-accordion/`, the browser
asks for:

```text
https://react-challenges.farhansegujja.com/assets/index-D9Ry5z9C.js   -> 404
```

The file is actually at `/react-practice/02-accordion/assets/...`. The HTML
loads fine — hence a *blank but not broken* page, with 404s visible only in the
Network tab.

Setting `base` makes Vite emit the full prefix:

```html
<script src="/react-practice/02-accordion/assets/index-D9Ry5z9C.js">
```

The homepage needs no `base` because it genuinely is served from the root.

**This is also the difference between hosting a build and hosting source.**
With `roadmap.sh-builds` you write the paths yourself, so you already know where
things live. Here a tool writes them for you, so it has to be told.

---

## 8. Dev server vs production build

`npm run dev:homepage` and `npm run build:homepage` are not the same process
with a flag. They work on fundamentally different principles.

| | `vite` (dev) | `vite build` (production) |
| --- | --- | --- |
| Bundling | **None** | Full Rollup bundle |
| Serving | Node HTTP server | Files on disk |
| Modules | Native browser ESM, one request each | Few concatenated files |
| Transform | On demand, per request | Everything, ahead of time |
| Minified | No | Yes |
| Startup | Milliseconds | Seconds |
| Reloads on edit | Yes (HMR) | No |
| Exists in production | **Never** | This is the artifact |

The dev server exploits the fact that modern browsers understand
`import` natively. It sends your modules almost as written, compiling each one
only when requested. That is why startup is near-instant regardless of project
size, and why editing a component updates the page without a refresh — Vite
swaps that single module.

Production inverts every priority. Nobody is editing, so compile everything
ahead of time, bundle it to reduce round trips, minify it, and hash it for
caching.

**Consequence:** something can work perfectly in dev and break in the build.
A missing `base` is exactly that class of bug — invisible in dev (served from
the root), broken in production. Hence `npm run preview:homepage`, which serves
the real `dist/` locally over HTTP so you test the artifact rather than the
development illusion.

---

## 9. Local and Cloudflare, side by side

The genuinely important realisation: **Cloudflare runs the same commands you
do.** There is no special deployment mode.

| Step | Your machine | Cloudflare Pages |
| --- | --- | --- |
| Get the code | already there | `git clone` at the pushed commit |
| Install | `npm install` | `npm ci` |
| Build | `npm run build:site` | `npm run build:site` |
| Result | `homepage/dist/` | `homepage/dist/` |
| Then | you open it | uploaded to the CDN, container destroyed |

Only two things differ:

1. **`ci` instead of `install`** — the build server must not renegotiate
   versions (section 3).
2. **The container is thrown away.** Nothing persists between builds. Every
   deploy is a cold clone and a cold install. This is a feature: it makes a
   successful build proof the repository is self-sufficient, with no dependence
   on some file that happens to exist on your laptop.

The build container is also **not** the thing serving your site. It runs for
about a minute, produces `dist/`, uploads it, and dies. What serves visitors is
Cloudflare's static CDN. There is no Node process running in production, which
is why this deployment costs nothing to keep online and cannot "go down" the
way a server can.

**Therefore, to debug a failed deploy, reproduce it locally:**

```bash
rm -rf node_modules
npm ci
npm run build:site
```

If that passes locally and fails on Cloudflare, the difference is environmental
— Node version, an environment variable, a case-sensitive filename that Windows
tolerates and Linux does not. That last one catches people constantly:
`import Hero from './components/hero.jsx'` works on Windows and fails on
Cloudflare's Linux builder.

---

## 10. Node versions

Cloudflare's current v3 build image defaults to **Node 22.16.0**. Vite 8 needs
20.19+, so this works with no configuration.

One trap: the `engines` field in `package.json` is **ignored** by the v3
builder. This repo declares `"node": ">=20.19.0"`, which documents intent but
enforces nothing on Cloudflare. To actually pin a version, add a `.nvmrc` at the
repo root:

```text
22
```

`.node-version` also works, as does a `NODE_VERSION` environment variable in
the project settings.

---

## 11. `_redirects` — needed later, not yet

The homepage is a single page with no router, so nothing is needed now.

The moment a challenge uses React Router, deep links break. Visiting
`/settings` directly makes the browser ask the *server* for a file at that
path. In a single-page app no such file exists — the route only exists in
JavaScript, after the app has booted. The server returns 404.

The fix is to tell the host "for any path, serve `index.html` and let the app
sort it out". In that workspace's `public/` folder:

```text
/*    /index.html   200
```

The `200` matters: it serves `index.html` *as* that URL rather than redirecting,
so the address bar keeps the deep link for the router to read.

---

## 12. The mental model, compressed

```text
package.json      what I asked for        (intent, hand-written, committed)
package-lock.json what I actually got     (resolution, npm-written, committed)
node_modules/     where it lives          (reality, disposable, gitignored)

npm install       negotiate + may rewrite the lockfile   (development)
npm ci            obey the lockfile exactly              (CI / production)

vite              compile on demand, never bundle        (development only)
vite build        compile + bundle + hash -> dist/       (the artifact)

dist/             plain static files, no Node at runtime (what visitors get)

base              tells Vite where the app will be mounted
--workspace       selects one package by NAME, not path
```

And the single most useful sentence:

> **The repository is the recipe. `dist/` is the meal. Git stores recipes;
> Cloudflare cooks and serves.**

Which is also why `dist/` and `node_modules/` are both gitignored — they are
both *derived*. Committing either means committing something you can regenerate,
and risking that the copy in Git drifts from what the recipe would actually
produce.

---

## Why this file is untracked

`Deployment.md` is excluded through **`.git/info/exclude`**, not `.gitignore`.

| | `.gitignore` | `.git/info/exclude` |
| --- | --- | --- |
| Committed to the repo? | Yes | No — lives inside `.git/` |
| Applies to collaborators? | Yes | No — this machine only |
| Good for | Build artifacts, `node_modules`, secrets | Personal scratch files |

So this file stays local and invisible to Git, while `.gitignore` remains clean
and contains only rules that genuinely belong to the project.

Verify at any time — this should print nothing:

```bash
git status --porcelain | grep Deployment.md
```

See which rule excludes it:

```bash
git check-ignore -v Deployment.md
```

**One caveat:** because the rule lives inside `.git/`, it exists nowhere else.
Clone this repo on another machine and neither this file nor its exclusion rule
comes with it. If you want it in the repo after all, delete the `Deployment.md`
line from `.git/info/exclude` and commit it normally.
