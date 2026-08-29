# 10 - Contact book app

| | |
| --- | --- |
| Source | [React Practice](https://reactpractice.dev/start-here/) |
| Category | Forms |
| Calendar position | Days 16-17 |
| Challenge brief | https://reactpractice.dev/exercise/create-a-simple-contact-book-app/ |
| Status | **Not Started** |

## Status

**Not Started.** This folder is a placeholder. No React application has been
created here yet.

## When I start this challenge

This directory becomes its own npm workspace, built with **Vite + React
(JavaScript)** and styled with **Tailwind CSS**, matching every other
application in this monorepo.

The full step-by-step procedure lives in the root README, under
*"How to add a new React challenge"*:

```
../../README.md
```

The short version, run from the repository root. The `mv` steps exist
because `create-vite` refuses to scaffold into a folder that already has
files in it, and this README is one:

```bash
mv react-practice/10-contact-book/README.md /tmp/challenge-readme.md
rm -rf react-practice/10-contact-book

npm create vite@latest react-practice/10-contact-book -- --template react --no-immediate
mv /tmp/challenge-readme.md react-practice/10-contact-book/README.md

npm pkg set name="@react-challenges/10-contact-book" --workspace react-practice/10-contact-book
npm install
npm install tailwindcss @tailwindcss/vite --save-dev --workspace @react-challenges/10-contact-book
```

`--no-immediate` is important: it stops Vite from running its own install
inside this folder, which is what would create a nested `node_modules` and a
second lockfile.

Then add Tailwind CSS to the new workspace, and update this challenge's
`status` in `homepage/src/data/challenges.js` so the homepage card
reflects the change.

## A note on assets

The design files, images and written brief for this challenge belong to
React Practice. They are **not** copied into this repository. Download them
from the challenge page linked above when you start work.
