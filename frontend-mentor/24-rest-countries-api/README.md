# 24 - REST Countries API with color theme switcher

| | |
| --- | --- |
| Source | [Frontend Mentor](https://www.frontendmentor.io/use-cases/react-projects) |
| Difficulty | Advanced |
| Access | Free |
| Challenge brief | https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca |
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
mv frontend-mentor/24-rest-countries-api/README.md /tmp/challenge-readme.md
rm -rf frontend-mentor/24-rest-countries-api

npm create vite@latest frontend-mentor/24-rest-countries-api -- --template react --no-immediate
mv /tmp/challenge-readme.md frontend-mentor/24-rest-countries-api/README.md

npm pkg set name="@react-challenges/24-rest-countries-api" --workspace frontend-mentor/24-rest-countries-api
npm install
npm install tailwindcss @tailwindcss/vite --save-dev --workspace @react-challenges/24-rest-countries-api
```

`--no-immediate` is important: it stops Vite from running its own install
inside this folder, which is what would create a nested `node_modules` and a
second lockfile.

Then add Tailwind CSS to the new workspace, and update this challenge's
`status` in `homepage/src/data/challenges.js` so the homepage card
reflects the change.

## A note on assets

The design files, images and written brief for this challenge belong to
Frontend Mentor. They are **not** copied into this repository. Download them
from the challenge page linked above when you start work.
