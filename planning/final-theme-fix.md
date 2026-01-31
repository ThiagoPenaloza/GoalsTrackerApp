# ⚡ Fix: Theme Animation Lag (Final)

**Status:** Identified 🔴
**Cause:** The "Universal Transition" rule is still present in `globals.css`.

Lines 77-82 of `src/app/globals.css`:
```css
/* ❌ THIS IS KILLING PERFORMANCE (20fps) */
body,
body * {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```
This forces the browser to calculate geometry and paint updates for *every single node* in the DOM simultaneously. It effectively doubles the work of the View Transitions API and causes the "stutter".

## 🛠️ The Fix

1.  **Delete** the `body, body *` block entirely from `src/app/globals.css`.
2.  (Optional) **Speed Up** the View Transition duration from `0.35s` to `0.25s` for a "snappier" feel.

---

## 🚀 Prompt for Claude

> "Fix the theme lag. Read `planning/final-theme-fix.md`.
>
> 1.  **In `src/app/globals.css`**: DELETE the `body, body * { transition... }` rule (lines 77-82). This is critical.
> 2.  **In `src/app/globals.css`**: Change `animation-duration` for `::view-transition-old/new` to `0.2s` for a faster feel."
