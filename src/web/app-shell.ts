/**
 * Web-only app shell: makes the browser behave like a native app surface.
 * Injected at runtime because `web.output: "single"` has no HTML template
 * (app/+html.tsx only applies to static output).
 *
 * - viewport: no pinch/double-tap zoom, viewport-fit=cover for safe areas
 * - PWA: manifest + iOS standalone meta so testers can Add to Home Screen
 * - CSS: no rubber-band scroll, no tap highlight, app-like text selection
 * - Desktop (>500px): centers the app in a 390×844 phone frame
 */

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function addLink(rel: string, href: string, sizes?: string) {
  const el = document.createElement('link');
  el.rel = rel;
  el.href = href;
  if (sizes) el.setAttribute('sizes', sizes);
  document.head.appendChild(el);
}

// Desktop phone-frame dimensions. Everything RN reads window size from
// (useWindowDimensions, Dimensions, pagers, sheets) must see the frame,
// not the real browser window — so we override innerWidth/innerHeight
// before the app mounts. Real values stay readable via documentElement.
const FRAME_WIDTH = 390;
const FRAME_MAX_HEIGHT = 844;
const FRAME_MARGIN = 48;
// iPhone 15 Pro-ish insets, faked inside the desktop frame (Dynamic Island
// top, home indicator bottom). Real devices use env(safe-area-inset-*).
export const FRAME_INSETS = { top: 59, right: 0, bottom: 34, left: 0 };

function isDesktop() {
  return document.documentElement.clientWidth >= 500;
}

function frameHeight() {
  return Math.min(FRAME_MAX_HEIGHT, document.documentElement.clientHeight - FRAME_MARGIN);
}

// The frame can be turned off at runtime (the scenario launcher renders
// full-bleed, then the picked flow "docks" into the frame). While off, the
// dimension getters fall through to the real viewport values.
let frameActive = true;

function virtualizeWindowSize() {
  try {
    const realInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth')?.get;
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      get: () =>
        frameActive ? FRAME_WIDTH : document.documentElement.clientWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      get: () =>
        frameActive ? frameHeight() : document.documentElement.clientHeight,
    });
    void realInnerWidth;
    // react-native-web reads window size from visualViewport, not innerWidth
    const vv = window.visualViewport;
    if (vv) {
      const proto = Object.getPrototypeOf(vv);
      const realW = Object.getOwnPropertyDescriptor(proto, 'width')?.get;
      const realH = Object.getOwnPropertyDescriptor(proto, 'height')?.get;
      Object.defineProperty(proto, 'width', {
        configurable: true,
        get(this: VisualViewport) {
          return frameActive ? FRAME_WIDTH : (realW?.call(this) ?? document.documentElement.clientWidth);
        },
      });
      Object.defineProperty(proto, 'height', {
        configurable: true,
        get(this: VisualViewport) {
          return frameActive ? frameHeight() : (realH?.call(this) ?? document.documentElement.clientHeight);
        },
      });
    }
    // Read by _layout.tsx to feed faked insets into SafeAreaInsetsContext
    (window as any).__PHONE_FRAME_INSETS__ = FRAME_INSETS;
    // react-native-web caches Dimensions at module init (which can run
    // before this file) — a resize event makes it re-read our getters.
    window.dispatchEvent(new Event('resize'));
    vv?.dispatchEvent(new Event('resize'));
  } catch (e) {
    console.warn('[app-shell] could not virtualize window size', e);
  }
}

/**
 * Toggle the desktop phone frame at runtime. Used by the scenario launcher:
 * off while the full-bleed splash shows, on when a flow docks into the
 * phone. No-op visual effect on real phones (<500px, media query).
 */
function setPhoneFrame(on: boolean) {
  frameActive = on;
  document.body.classList.toggle('phone-frame-off', !on);
  window.dispatchEvent(new Event('resize'));
  window.visualViewport?.dispatchEvent(new Event('resize'));
}
if (typeof window !== 'undefined') {
  (window as any).__setPhoneFrame = setPhoneFrame;
}

if (typeof document !== 'undefined') {
  if (isDesktop()) {
    virtualizeWindowSize();
  } else if (document.documentElement.clientWidth === 0) {
    // Hidden/zero-size viewport (e.g. a background preview pane): decide
    // once the viewport gets a real size.
    const onResize = () => {
      if (document.documentElement.clientWidth === 0) return;
      window.removeEventListener('resize', onResize);
      if (isDesktop()) virtualizeWindowSize();
    };
    window.addEventListener('resize', onResize);
  }

  setMeta(
    'viewport',
    'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
  );
  setMeta('theme-color', '#FDFCF9');
  setMeta('apple-mobile-web-app-capable', 'yes');
  setMeta('mobile-web-app-capable', 'yes');
  setMeta('apple-mobile-web-app-status-bar-style', 'default');
  setMeta('apple-mobile-web-app-title', 'Somethings');
  addLink('manifest', '/manifest.json');
  addLink('apple-touch-icon', '/icons/icon-180.png', '180x180');

  const style = document.createElement('style');
  style.textContent = `
    html, body {
      overscroll-behavior: none;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      background: #FDFCF9;
    }
    body {
      user-select: none;
      -webkit-user-select: none;
    }
    /* Images must not start native drags — they'd swallow drag-to-scroll */
    img {
      -webkit-user-drag: none;
      user-drag: none;
    }
    /* Text content stays selectable only where explicitly opted in */
    [data-selectable="true"], [data-selectable="true"] * {
      user-select: text;
      -webkit-user-select: text;
    }

    /* NativeWind's *-safe-or-* utilities are native-only; provide them on
       web. Real devices resolve env(); the desktop frame overrides the
       variables below to clear the fake Dynamic Island / home indicator. */
    :root {
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
    }
    .pt-safe-or-2 { padding-top: max(var(--safe-top), 0.5rem); }
    .pt-safe-or-4 { padding-top: max(var(--safe-top), 1rem); }
    .pb-safe-or-4 { padding-bottom: max(var(--safe-bottom), 1rem); }
    .pb-safe-or-6 { padding-bottom: max(var(--safe-bottom), 1.5rem); }

    /* Desktop reviewers: center the app in a phone frame.
       body.phone-frame-off (the scenario launcher) renders full-bleed. */
    @media (min-width: 500px) {
      :root {
        --safe-top: ${FRAME_INSETS.top}px;
        --safe-bottom: ${FRAME_INSETS.bottom}px;
      }
      body.phone-frame-off {
        --safe-top: 0px;
        --safe-bottom: 0px;
      }
      body {
        background: #E9E6DF;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100dvh;
        transition: background-color 350ms ease;
      }
      body.phone-frame-off {
        background: #FDFCF9;
      }
      #root {
        /* Expo's base CSS sets #root { flex: 1 } — reset so width/height hold */
        flex: 0 0 auto;
        position: relative;
        width: 390px;
        height: min(844px, calc(100dvh - 48px));
        border-radius: 44px;
        overflow: hidden;
        box-shadow:
          0 0 0 11px #17171a,
          0 0 0 13px #3c3c40,
          0 30px 80px rgba(0, 0, 0, 0.35);
      }
      body.phone-frame-off #root {
        flex: 1 1 auto;
        width: 100%;
        height: 100dvh;
        border-radius: 0;
        box-shadow: none;
      }
      body.phone-frame-off #root::before,
      body.phone-frame-off #root::after {
        display: none;
      }
      /* Dynamic Island */
      #root::before {
        content: '';
        position: absolute;
        top: 11px;
        left: 50%;
        transform: translateX(-50%);
        width: 125px;
        height: 37px;
        border-radius: 19px;
        background: #000;
        z-index: 99999;
        pointer-events: none;
      }
      /* Home indicator */
      #root::after {
        content: '';
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 139px;
        height: 5px;
        border-radius: 3px;
        background: #000;
        z-index: 99999;
        pointer-events: none;
      }
    }
  `;
  document.head.appendChild(style);
}

export {};
