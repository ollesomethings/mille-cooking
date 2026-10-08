/**
 * EAS Hosting serves the SPA's index.html fallback (200, text/html) for any
 * asset whose path contains a space — and the file:-linked UI package lives
 * under "../First try/…", so every scribble/moodie 200'd as HTML in prod and
 * silently disappeared (dev was fine, which is why local verification never
 * caught it). Rewriting httpServerLocation changes BOTH the exported file
 * location in dist and the URL the bundle requests, so they stay consistent.
 *
 * Production-only: the metro dev server resolves asset URLs back to real
 * files on disk, where the space still exists.
 */
module.exports = asset =>
  process.env.NODE_ENV === 'production'
    ? { ...asset, httpServerLocation: asset.httpServerLocation.replace(/\s/g, '-') }
    : asset;
