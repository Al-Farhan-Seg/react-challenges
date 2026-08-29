# 02 - Social links profile

| | |
| --- | --- |
| Source | [Frontend Mentor](https://www.frontendmentor.io/use-cases/react-projects) |
| Difficulty | Newbie |
| Access | Free |
| Challenge brief | https://www.frontendmentor.io/challenges/social-links-profile-UG32l9m6dQ |
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
mv frontend-mentor/02-social-links-profile/README.md /tmp/challenge-readme.md
rm -rf frontend-mentor/02-social-links-profile

npm create vite@latest frontend-mentor/02-social-links-profile -- --template react --no-immediate
mv /tmp/challenge-readme.md frontend-mentor/02-social-links-profile/README.md

npm pkg set name="@react-challenges/02-social-links-profile" --workspace frontend-mentor/02-social-links-profile
npm install
npm install tailwindcss @tailwindcss/vite --save-dev --workspace @react-challenges/02-social-links-profile
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
