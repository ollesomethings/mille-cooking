# Somethings UI

A modern, cross-platform React UI library built with TypeScript, Tailwind CSS, and React Native.

## Features

- 🎨 Cross-platform components for Web and React Native
- 🎯 Consistent styling with Tailwind CSS and NativeWind
- 📦 Zero-bundling approach - let apps handle their own bundling
- 🔒 Type-safe with TypeScript
- 📖 Component documentation with Storybook
- 🤖 AI-friendly structure for vibecoding with Claude Code and other agents

## Packages

| Package | Description |
|---------|-------------|
| `@somethings-ui/core` | Shared interfaces, types, styles, and utilities |
| `@somethings-ui/web` | Web components built with Tailwind CSS |
| `@somethings-ui/native` | React Native components with NativeWind |

## Components

The library includes **40+ components** across web and native platforms.

### Shared Components (Available in both Web & Native)
These components work on both platforms with platform-specific implementations:

**UI Components:**
- `Avatar` - User avatar with image fallbacks
- `BrandIcon` - Brand identity icons
- `Button` - Primary interactive buttons
- `IconButton` - Icon-only buttons
- `Link` - Styled navigation links
- `SelectGroup` - Multi-select group component
- `Switch` - Toggle switch
- `TextInput` - Text input field

**Feedback & Indicators:**
- `Ping` - Animated ping indicator
- `SpotifyVinyl` - Spotify track display with vinyl animation

### Web-Only Components
Components available exclusively for web applications:

- `Calendar` - Date selection calendar
- `CalendarInput` - Calendar with input field
- `Card` - Content card container
- `DatePicker` - Date picker with calendar
- `Dialog` - Modal dialog
- `Filters` - Filter controls
- `Input` - Enhanced text input
- `Popover` - Popover overlay
- `Sidebar` - Navigation sidebar
- `Walkthrough` - User onboarding walkthrough

### Native-Only Components
Components available exclusively for React Native applications:

- `BulletList` - Bulleted list component
- `ContentBlock` - Content block container
- `Dropdown` - Dropdown selector
- `FAB` - Floating Action Button
- `ForYouCard` - Personalized content card
- `Header` - Screen header component
- `Logo` - App logo component
- `Modal` - Modal overlay
- `PhoneInput` - Phone number input
- `Toast` - Toast notification

### Core Utilities
- `swap-prompts` - Random swap prompt utilities
- Shared types, styles, and theme definitions

> **For Contributors:** See [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) for detailed instructions on creating new components.

## Playgrounds (Storybook)

| Playground | Description | Command |
|------------|-------------|---------|
| `web-playground` | Web Storybook for `@somethings-ui/web` | `cd packages/web-playground && yarn storybook` |
| `native-playground` | React Native Storybook for `@somethings-ui/native` | `cd packages/native-playground && yarn storybook` |

### Native Playground (Recommended for Designers)

The native-playground is the primary environment for designing and previewing React Native components:

```bash
cd packages/native-playground
yarn storybook
```

Then open Expo Go on your device and scan the QR code.

**For AI Agents:** See [packages/native-playground/README.md](packages/native-playground/README.md) for detailed instructions on component architecture, styling, and common tasks.

## Installation

You can install the packages directly from GitHub. Choose the packages you need based on your platform:

### For React Native Apps

```bash
# Install core and native packages using Yarn
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/core"
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/native"

# Optionally, you can pin to a specific commit
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/core&commit=COMMIT_HASH"
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/native&commit=COMMIT_HASH"
```

### For Web Apps

```bash
# Install core and web packages using Yarn
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/core"
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/web"

# Optionally, you can pin to a specific commit
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/core&commit=COMMIT_HASH"
yarn add "git@github.com:withlink/somethings-ui.git#workspace=@somethings-ui/web&commit=COMMIT_HASH"
```

Note: This package uses Yarn Berry (4.x) workspace protocol. Make sure you're using Yarn as your package manager.

## Usage

### In React Native

```tsx
import { Button } from '@somethings-ui/native';

function App() {
  return (
    <Button variant="primary" size="md" onPress={() => console.log('Pressed!')}>
      Click Me
    </Button>
  );
}
```

### In Web

```tsx
import { Button } from '@somethings-ui/web';

function App() {
  return (
    <Button variant="primary" size="md" onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}
```

## Setup Requirements

### For React Native Apps

1. Make sure you have NativeWind set up in your app:

```bash
yarn add nativewind
yarn add --dev tailwindcss@3.3.0
```

2. Configure your `tailwind.config.js`:

```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@somethings-ui/**/*.{js,jsx,ts,tsx}'],
  // ... rest of your config
};
```

### For Web Apps

1. Make sure you have Tailwind CSS set up in your app:

```bash
yarn add -D tailwindcss
```

2. Configure your `tailwind.config.js`:

```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@somethings-ui/**/*.{js,jsx,ts,tsx}'],
  // ... rest of your config
};
```

## Development

This monorepo uses Yarn Berry (4.x) as its package manager. Make sure you have Yarn installed:

```bash
corepack enable
yarn set version 4.6.0
```

Then install dependencies:

```bash
yarn install
```

### Root Commands

```bash
yarn build       # Build all packages
yarn dev         # Run all packages in dev mode
yarn lint        # Lint all packages
yarn typecheck   # Type check all packages
yarn test        # Run tests
yarn clean       # Clean build artifacts
```

### Start Native Playground (React Native Storybook)

```bash
cd packages/native-playground
yarn storybook
```

Open Expo Go on your device, scan the QR code, and tap "Open Storybook".

**Alternative:** Run in dev client mode:
```bash
cd packages/native-playground
yarn dev
```

### Start Web Playground (Web Storybook)

```bash
cd packages/web-playground
yarn install
yarn init-msw  # First time only
yarn storybook
```

## CI/CD

Pull requests are automatically checked with:
- **Linting:** `yarn lint` (ESLint)
- **Type checking:** `yarn typecheck` (TypeScript)

Make sure your code passes both checks before submitting a PR.

## Project Structure

```
somethings-ui/
├── packages/
│   ├── core/                 # Shared styles, types, utilities
│   │   └── src/
│   │       ├── styles/       # Theme colors, fonts, shadows
│   │       ├── button/       # Component types & CVA styles
│   │       └── ...
│   ├── native/               # React Native components
│   │   └── src/
│   │       ├── button/
│   │       ├── avatar/
│   │       └── ...
│   ├── web/                  # Web components
│   │   └── src/
│   │       ├── button/
│   │       └── ...
│   ├── native-playground/    # React Native Storybook
│   │   ├── components/       # Story files (*.stories.tsx)
│   │   └── .rnstorybook/     # Storybook config
│   └── web-playground/       # Web Storybook
│       └── src/
└── README.md
```

## For AI Agents & Designers

This codebase is structured to be AI-friendly. Common tasks:

| Task | Files to Modify |
|------|-----------------|
| Edit component styling | `packages/core/src/{component}/styles.ts` |
| Edit component behavior | `packages/native/src/{component}/index.tsx` |
| Add/edit stories | `packages/native-playground/components/{component}.stories.tsx` |
| Change theme colors | `packages/core/src/styles/colors.ts` |
| Change typography | `packages/core/src/styles/fonts.ts` |

See [packages/native-playground/README.md](packages/native-playground/README.md) for detailed AI agent instructions.

## Contributing

1. Clone the repository
2. Install dependencies: `yarn install`
3. Make your changes
4. Run tests: `yarn test`
5. Ensure linting and type checking pass: `yarn lint && yarn typecheck`
6. Submit a pull request

**Creating new components?** See [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) for step-by-step instructions on:
- Directory structure and naming conventions
- Defining shared types and styles in `core`
- Implementing platform-specific components
- Creating Storybook documentation
- Best practices and common gotchas

## Configuration

### Tailwind Config

Make sure to include the UI library in your Tailwind configuration:

```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@somethings-ui/**/*.{js,jsx,ts,tsx}'],
  // ... rest of your config
};
```

## License

[Your License Here]
