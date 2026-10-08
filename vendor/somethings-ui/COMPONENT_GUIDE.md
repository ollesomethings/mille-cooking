# Component Guide

This repo does not use a single component pattern for everything.

Use one of these three shapes:

1. Shared component: `core` + `web` + `native`
2. Web-only component: `web` only
3. Native-only component: `native` only

## Current Package Structure

```text
somethings-ui/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── [component]/
│   │       │   ├── index.ts
│   │       │   ├── styles.ts
│   │       │   └── types.ts
│   │       ├── assets/
│   │       ├── styles/
│   │       └── lib/
│   ├── web/
│   │   └── src/
│   │       ├── [component]/index.tsx
│   │       ├── [component]/*.tsx
│   │       └── index.tsx
│   ├── native/
│   │   └── src/
│   │       ├── [component]/index.tsx
│   │       ├── [component]/*.tsx
│   │       └── index.tsx
│   ├── web-playground/
│   │   └── src/stories/
│   │       └── [component].stories.tsx
│   └── native-playground/
│       ├── components/
│       │   └── [component].stories.tsx
│       └── .rnstorybook/
```

## How To Decide Where A Component Lives

### Shared Component

Use `core` when both platforms need the same public API and can share styling primitives or types.

Current shared components:

- `avatar`
- `brand-icon`
- `button`
- `content-block`
- `fab`
- `icon-button`
- `link`
- `modal`
- `ping`
- `select-group`
- `spotify-vinyl`
- `switch`
- `text-input`

Recommended structure:

```text
packages/core/src/[component]/
  index.ts
  styles.ts
  types.ts

packages/web/src/[component]/
  index.tsx

packages/native/src/[component]/
  index.tsx
```

### Web-Only Component

Use `web` only when the component depends on DOM-only APIs or has no native equivalent yet.

Current web-only exports:

- `calendar`
- `calendar-input`
- `card`
- `date-picker`
- `dialog`
- `filters`
- `input`
- `popover`
- `sidebar`
- `walkthrough`

Recommended structure:

```text
packages/web/src/[component]/
  index.tsx
  ...supporting files
```

### Native-Only Component

Use `native` only when the component depends on React Native APIs or native-specific UX.

Current native-only exports:

- `bullet-list`
- `dropdown`
- `for-you-card`
- `header`
- `logo`
- `phone-input`
- `toast`

Recommended structure:

```text
packages/native/src/[component]/
  index.tsx
  ...supporting files
```

## Authoring Rules

### `core`

- Put cross-platform types in `types.ts`
- Put shared CVA definitions in `styles.ts`
- Re-export from `index.ts`
- Export the component from `packages/core/src/index.ts` if it should be public

### `web`

- Implement the actual React component in `index.tsx`
- Import shared styles/types from `@somethings-ui/core` when applicable
- Export the component from `packages/web/src/index.tsx`

### `native`

- Implement the actual React Native component in `index.tsx`
- Import shared styles/types from `@somethings-ui/core` when applicable
- Export the component from `packages/native/src/index.tsx`

## Storybook

Web stories live in:

```text
packages/web-playground/src/stories/[component].stories.tsx
```

Native stories live in:

```text
packages/native-playground/components/[component].stories.tsx
```

Add stories for the platform(s) the component supports. Do not assume every component needs both.

## Workflow

### Adding A Shared Component

1. Create `packages/core/src/[component]/types.ts`
2. Create `packages/core/src/[component]/styles.ts`
3. Create `packages/core/src/[component]/index.ts`
4. Create `packages/web/src/[component]/index.tsx`
5. Create `packages/native/src/[component]/index.tsx`
6. Re-export from `packages/core/src/index.ts`
7. Re-export from `packages/web/src/index.tsx`
8. Re-export from `packages/native/src/index.tsx`
9. Add stories in `web-playground` and/or `native-playground`

### Adding A Web-Only Component

1. Create `packages/web/src/[component]/index.tsx`
2. Re-export from `packages/web/src/index.tsx`
3. Add a story in `packages/web-playground/src/stories`

### Adding A Native-Only Component

1. Create `packages/native/src/[component]/index.tsx`
2. Re-export from `packages/native/src/index.tsx`
3. Add a story in `packages/native-playground/components`

## Conventions

- Default to shared types/styles only when both platforms truly benefit
- Keep platform-specific behavior in `web` or `native`, not in `core`
- Use `forwardRef` when the component exposes a meaningful underlying element/ref
- Keep `core` focused on reusable contracts, variants, and utilities
- Put extra implementation files beside the platform entrypoint when needed

## Notes

- `packages/core/src/assets` and `packages/core/src/swap-prompts` are intentionally not re-exported from the root `@somethings-ui/core` entrypoint
- `web-playground` and `native-playground` are separate Storybook surfaces with different file locations and setup
- The source of truth for public components is the package entrypoint for each platform: `packages/core/src/index.ts`, `packages/web/src/index.tsx`, and `packages/native/src/index.tsx`
