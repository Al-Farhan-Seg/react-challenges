# 01 - Simple Coffee Listing

|                 |                                                                          |
| --------------- | ------------------------------------------------------------------------ |
| Source          | [devChallenges](https://devchallenges.io/challenges-dashboard?path=%2C3) |
| Difficulty      | Junior                                                                   |
| Challenge brief | https://devchallenges.io/challenge/simple-coffee-listing                 |
| Status          | **Completed** ✅                                                         |

## Overview

A coffee shop product listing that fetches a live product feed and renders it
as a responsive card grid. Built as part of the
[React Challenges](../../README.md) monorepo, using this repo's standard
stack: **Vite + React (JavaScript)**, styled with **Tailwind CSS**.

## Features

- Fetches coffee product data at runtime from a remote JSON feed
- Filter toggle between **All Products** and **Available Now**
- Per-item rating display (filled/outline star), falling back to
  "No ratings" when a product has none
- **Popular** badge and **Sold Out** state driven by the product data
- Responsive grid (1 / 2 / 3 columns depending on viewport)
- Loading state while the feed is being fetched
- Link back to the original challenge brief

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Getting started

Run from the **repository root** (this is an npm workspace, not a
standalone project):

```bash
npm install
npm run dev --workspace @react-challenges/01-simple-coffee-listing
```

To build it on its own:

```bash
npm run build --workspace @react-challenges/01-simple-coffee-listing
```

Or build/preview the whole site (dashboard + every started challenge) with
`npm run build:site` / `npm run preview:homepage`, as described in the
[root README](../../README.md).

## Data source

Product data is fetched at runtime from devChallenges' curriculum repo:

```
https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json
```

## A note on assets

The design files and written brief for this challenge belong to
devChallenges and are **not** copied into this repository. See the challenge
brief linked above for the original design reference.
