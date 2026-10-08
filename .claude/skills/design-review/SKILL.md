---
name: design-review
description: Mandatory self-critique of any screen built or modified in this prototype. Run after building/changing UI and before reporting done. Also triggered by /design-review.
---

# Design Review

Critique the screen(s) just built against every rule below. Fix all 🔴 and 🟡 findings immediately — do not report them as "known issues." Then output the review table (finding, severity, fix applied) in your response.

Review the RENDERED result at 390px width, not the code. Walk the screen top-to-bottom as a first-time user on a phone.

## 1. Inputs & controls

- Every input looks like an input: visible container (border, underline, or fill), min height 48px, clear focus state.
- Placeholder text is never the only label. Label above or floating label pattern.
- Disabled buttons use the design-system disabled token and their label still reads clearly. If the primary action is disabled, it must be obvious why (empty required field, etc.).
- Primary CTA is docked to the bottom of the viewport (above safe-area inset), not floating mid-screen — and never touching the element above it (min 24px gap).
- Touch targets ≥ 44×44. One primary action per screen.

## 2. Layout & spacing

- Consistent horizontal page gutter (16–24px) — nothing bleeds to the screen edge.
- Spacing uses a 4/8px scale. No arbitrary values.
- Vertical rhythm: heading → supporting text → content → CTA, with deliberate gaps, not one clump at the top and a void below.
- No horizontal scroll or clipped text at 390px width. Test a long value in every text slot.

## 3. Hierarchy

- One clear focal point. What draws the eye first should be the thing the user must do.
- Type scale from the design system only; heading, body, caption clearly distinct.
- Large empty regions must be intentional (e.g., keyboard will occupy them), not leftover.

## 4. Consistency

- Components come from `../First try/somethings-ui` when a web-compatible one exists. Local stand-ins match its spacing, radius, and color tokens.
- Same element = same style on every screen (back button position, page gutter, CTA style, field style).
- Copy matches product voice from the monorepo; no lorem ipsum, no placeholder labels left in.

## 5. Accessibility

- Text contrast ≥ 4.5:1 (3:1 for large text). Placeholders ≥ #767676 on white.
- Interactive elements distinguishable without color alone.
- Font size ≥ 16px for body (also prevents iOS input zoom), ≥ 12px absolute minimum.

## 6. Mobile-in-browser (per CLAUDE.md)

- Nothing depends on hover or keyboard. Swipes have tap alternatives.
- Keyboard behavior: focused input stays visible; CTA rises with keyboard or the page scrolls.
- Safe-area insets respected top and bottom; 100dvh not 100vh.
- First input on a single-field screen is auto-focused.

## Output format

```
## Design review: <screen>
| Finding | Severity 🔴/🟡/🟢 | Fix applied |
...
Verdict: PASS / fixed N issues
```

If zero findings, say what was checked — never just "looks good."
