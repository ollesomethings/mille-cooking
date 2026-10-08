# Dependency Overrides

Each entry pins a transitive dependency past what its parent normally
resolves to (via `resolutions` in `package.json` for Yarn). Remove the entry
(and the resolution in `package.json`) when the **Removal trigger** is
satisfied.

To verify on removal: drop the entry, run `yarn install`, then
`yarn why <package-name>` and confirm the resolved version is at or above
the fixed version without the override.

---

## node-forge

- **Override version**: `>=1.4.0` (currently resolves to `1.4.0`)
- **Original parents**:
  - `@expo/cli@54.0.24` (range `^1.3.3`)
  - `@expo/code-signing-certificates@0.0.6` (range `^1.3.3`)
  - `selfsigned@2.4.1` (range `^1`)
- **Reason**: Dependabot alerts require `node-forge >=1.4.0`. This pins the
  minimum safe version at the manifest level so a lockfile regeneration
  cannot drop back to `1.3.x`.
- **Route 1 (lockfile refresh)**: Works today, but is non-durable if lockfile
  is regenerated under different upstream resolution conditions.
- **Route 2 (parent upgrade)**: Not required to reach fixed version on this
  line; parent ranges already accept `1.4.0`.
- **Route 3 (override)**: Chosen to enforce a stable security floor in
  `package.json`.
- **Added**: 2026-05-03
- **Removal trigger**: Remove once all active parents in this repo require
  `node-forge >=1.4.0` natively (without the root override floor).
- **Verification on removal**: Drop this resolution, run `yarn install`, then
  `yarn why node-forge` and confirm every path resolves to `>=1.4.0`.

## uuid

- **Override version**: `^14.0.0` (currently resolves to `14.0.0`)
- **Original parents**:
  - `@storybook/addon-actions@8.6.18` (range `^9.0.0`)
  - `xcode@3.0.1` (range `^7.0.3`)
- **Reason**: Dependabot alert requires `uuid >=14.0.0`.
- **Route 1 (lockfile refresh)**: Not viable; parent semver ranges are capped
  below `14`.
- **Route 2 (parent upgrade)**: Attempted direct transitive parent updates via
  `yarn up -R @storybook/addon-actions xcode`, but the graph remains on
  `@storybook/addon-actions@8.6.18` and `xcode@3.0.1`, both still requesting
  pre-14 uuid ranges. Upgrading to parent major lines that might change this
  is out of scope for a security-only patch.
- **Route 3 (override)**: Chosen to enforce `uuid@14` across all consumers.
- **Added**: 2026-05-03
- **Removal trigger**: Remove once all resolved parents in-use request
  `uuid >=14` natively.
- **Verification on removal**: Drop this resolution, run `yarn install`, then
  `yarn why uuid` and confirm every path resolves to `>=14.0.0`.

## postcss

- **Override version**: `>=8.5.10` (currently resolves to `8.5.13`)
- **Original parents**:
  - `@expo/metro-config@54.0.15` (range `~8.4.32`)
- **Reason**: Dependabot alert requires `postcss >=8.5.10`, but active Expo
  Metro parent chain is pinned to the 8.4.x line.
- **Route 1 (lockfile refresh)**: Not viable because parent range is capped to
  8.4.x.
- **Route 2 (parent upgrade)**: Not viable on current upstream lines; even
  newer `@expo/metro-config` releases still declare `postcss ~8.4.32`.
- **Route 3 (override)**: Chosen to enforce patched `postcss` floor at the
  root manifest so lockfile regeneration cannot regress.
- **Added**: 2026-05-04
- **Removal trigger**: Remove once all resolved Expo Metro parent chains
  request `postcss >=8.5.10` natively.
- **Verification on removal**: Drop this resolution, run `yarn install`, then
  `yarn why postcss` and confirm every path resolves to `>=8.5.10`.

## esbuild

- **Override version** (scoped to parent): `storybook/esbuild -> 0.27.2`
- **Original parents**:
  - `storybook@10.4.0` (range `... || ^0.27.0`, i.e. `>=0.27.0 <0.28.0`) —
    vuln `0.27.7`
  - (`vite@6.4.2` requests `^0.25.0`, resolves a safe `0.25.12`, left alone)
- **Reason**: Dependabot alert `GHSA-g7r4-m6w7-qqqr` (low) flags
  `esbuild >=0.27.3 <0.28.1`. Only the `storybook@10.4.0` chain pulled the
  vulnerable `0.27.7`; `vite`'s `0.25.12` is outside the vulnerable range, so
  the override is scoped to the `storybook` parent.
- **Why `0.27.2` and not the `0.28.1` "first patched" version**: esbuild is
  `0.x`, so storybook's `^0.27.0` means `>=0.27.0 <0.28.0`. `0.28.1` would
  satisfy the alert but sits *outside* storybook's tested range. `0.27.2` is
  the highest release below the vulnerable floor (`0.27.3`) and still inside
  `^0.27.0`, so it patches the alert without running storybook against an
  esbuild minor it never declared support for.
- **Route 1 (lockfile refresh)**: Not viable; lockfile resolved the vulnerable
  `0.27.7` and would not regress to `<=0.27.2` on its own.
- **Route 2 (parent upgrade)**: Out of scope for a security-only patch
  (storybook major/minor bump).
- **Route 3 (scoped override)**: Chosen — pins esbuild under `storybook` to
  `0.27.2`, in-range and unaffected.
- **Added**: 2026-06-23
- **Removal trigger**: Remove once `storybook` declares an esbuild range whose
  natural resolution lands outside `>=0.27.3 <0.28.1` (e.g. ships with esbuild
  `>=0.28.1`, or the alert is otherwise retired).
- **Verification on removal**: Drop the entry, run `yarn install`, then
  `yarn why esbuild` and confirm no path resolves to `>=0.27.3 <0.28.1`.

