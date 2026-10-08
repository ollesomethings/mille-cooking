# Somethings — Mobile Prototype (Expo Web)

A web-only Expo prototype of the Somethings mobile app. It runs in the browser
but looks and behaves like the native app: testers open it on their phones via
the deployed URL, reviewers get a centered phone frame on desktop.

**Live:** https://mobile-design-proto.expo.app

## Getting started

```bash
npm install
npm run dev:web
```

That's it — the design system (`@somethings-ui/*`) is vendored into this repo
under `vendor/somethings-ui`, so a clone of this repo is self-contained. No
other checkouts needed. All data is mocked (`src/data/`); there is no backend.

Node 20+ recommended. The dev server picks a free port if 8081 is taken.

## Deploying

```bash
npm run deploy        # export + EAS preview URL
npm run deploy:prod   # export + the stable mobile-design-proto.expo.app URL
```

Deploys go to EAS Hosting under the project owner's Expo account — you need to
be a member of that Expo organization (expo.dev → org → Members) and logged in
via `npx eas login`. Without access you can still run everything locally.

## Project layout

- `app/` — screens (Expo Router). Names mirror the real app so PMs can cross-reference.
- `src/components/` — components; `src/components/proto/` is prototype-only chrome (launcher, disclaimer).
- `src/stores/` — zustand stores; `src/data/` — mock data/fixtures.
- `src/web/app-shell.ts` — the mobile-in-browser shell (viewport, phone frame, PWA). Keep intact.
- `vendor/somethings-ui/` — vendored copy of the design system, consumed as raw TS.
- `SCREENS.md` — every prototype screen, its status, and the matching real-app screen.
- `CLAUDE.md` — working rules (touch-only interaction, web stubs, verification steps). Read it before changing things, whether or not you use Claude.

## The vendored design system

`vendor/somethings-ui/{core,native}` is a snapshot of the `somethings-ui` repo's
packages, consumed as raw TypeScript via `file:` links. Their `package.json`s
declare **no dependencies on purpose** — everything resolves from this repo's
root `node_modules` (see `metro.config.js`); re-adding deps there makes npm nest
conflicting copies and breaks NativeWind's types.

To re-sync with upstream `somethings-ui`, re-copy `packages/core` and
`packages/native` over `vendor/somethings-ui/{core,native}` (excluding
`node_modules`), strip the dep fields from both `package.json`s again, and
re-apply any lines marked `Local change vs upstream` (currently one cast in
`native/src/fab/index.tsx`).

## Tester entry links

- `/` — launcher (pick scenario + toggles)
- `/calm` — preset link: calming tool set, no launcher, chat pointer to the Hub
