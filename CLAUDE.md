# CLAUDE.md — Mobile Prototype (Expo Web)

This repo is a web-only Expo prototype of our mobile app. It runs in a browser but must look, feel, and behave like a native mobile app. Testers open it on their phones via a deployed URL; reviewers open it on desktop inside a phone frame.

## Design system (vendored)

The design system (`@somethings-ui/core` + `@somethings-ui/native`) is vendored
at `vendor/somethings-ui/` and consumed as raw TS via file: links, so the repo
is self-contained. Always reuse these components when they work with
react-native-web; only build a local stand-in when a component is native-only,
and match its API so it can be swapped later. Read `README.md`,
`COMPONENT_GUIDE.md`, and `OVERRIDES.md` in `vendor/somethings-ui/` before
adding components. The vendored `package.json`s intentionally declare no
dependencies — everything resolves from the root `node_modules` (see README,
"The vendored design system", also for how to re-sync with upstream).

## Reference repos (read-only, optional — may not exist on every machine)

- `../First try/mono/link-v2` — the real app (Somethings: mentorship platform, React Native + Expo Router). Source of truth for screens, navigation, copy, and business logic.
- `../First try/somethings-ui` — upstream of the vendored design system.
- `../First try/somethings-demo` — the original iOS-simulator prototype this repo was seeded from. Fidelity reference only; this repo has diverged.

Never modify files in the reference repos. (Paths contain a space — quote them in shell commands.) If they're missing, work from the vendored copy and the mock data already in `src/data/`.

## Commands

- Dev: `npx expo start --web`
- Export: `npm run export` (`expo export --platform web`)
- Deploy: `npm run deploy` (export + `eas deploy`); `npm run deploy:prod` for the stable URL
- After any meaningful change: export + deploy, and report the URL.

Expo SDK 54 — check https://docs.expo.dev/versions/v54.0.0/ before writing Expo API code; APIs have changed across SDK versions.

## Hard rules: mobile-in-browser

Touch-only interaction. Users have no mouse, no keyboard, no hover:

- Never rely on hover, focus-visible, right-click, tooltips, or keyboard shortcuts for anything essential.
- Touch targets ≥ 44×44. Hit slop on small icons.
- Every swipe/drag gesture needs a tap-based alternative.
- Gestures use `react-native-gesture-handler` + `react-native-reanimated`. Their web support is imperfect (Pan/Tap can misfire in browsers) — prefer simple Pressable/ScrollView interactions; if a gesture misbehaves on web, fall back to buttons rather than fighting it.

App-like shell (already implemented in `src/web/app-shell.ts` — keep it intact):

- Viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no`.
- Global CSS: `overscroll-behavior: none`, `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`; `user-select: none` globally (add `data-selectable="true"` on containers where users genuinely need to copy text).
- Heights in `100dvh`, never `100vh`.
- `react-native-safe-area-context` everywhere; respect `env(safe-area-inset-*)` for PWA standalone mode.
- PWA manifest at `public/manifest.json`: `display: standalone`, icons, theme color, so testers can Add to Home Screen.
- On viewports wider than 500px, `app-shell.ts` renders the app inside a centered 390×844 phone frame; the app fills the real viewport on actual phones.

Native modules: anything without web support gets a graceful web stub — never a crash, never a blank screen. `expo-haptics` is already stubbed via a metro alias (`metro.config.js` → `src/web/expo-haptics-stub.ts`); add new stubs to the same `webStubs` map. Log stubbed calls to console so we know what's faked.

Data: all data is mocked, in-memory or fixture files (`src/data/`). No real backend calls. Mock data should be realistic (use real copy and plausible values from the monorepo, not lorem ipsum).

## Verification before saying "done"

0. Run the `design-review` skill (`.claude/skills/design-review/SKILL.md`) on every screen built or changed; fix all 🔴/🟡 findings before reporting.
1. `npx expo start --web` runs clean, no console errors.
2. Check the flow in a narrow viewport (390px) — no horizontal scroll, no layout bleed.
3. Confirm no interaction depends on hover or keyboard.
4. `npm run export` builds without errors.

## Project conventions

- TypeScript, Expo Router for navigation. Routes live in `app/`, components in `src/components/`, stores in `src/stores/` (zustand), mock data in `src/data/`.
- Styling: NativeWind (Tailwind) — see `tailwind.config.js`.
- Screen files mirror the real app's screen names so PMs/designers can cross-reference.
- Keep `SCREENS.md` at root listing each prototype screen, its status (stub / interactive / polished), and the matching real-app screen.
