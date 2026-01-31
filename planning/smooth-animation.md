# 🦋 60FPS Smooth Theme Switch (No-Code Plugin Approach)

**Status:** Research Complete 📚
**Recommendation:** `next-view-transitions`

The user requested a "plugin" to just import and work.
The best library for Next.js App Router that enables smooth standard View Transitions (cross-fade) with zero complex code is **`next-view-transitions`**.

## 📦 The "Plugin" Plan

### 1. Install
`npm install next-view-transitions`

### 2. Import & Wrap
In `src/app/layout.tsx`:
```tsx
import { ViewTransitions } from 'next-view-transitions'

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang="en">...</html>
    </ViewTransitions>
  )
}
```

### 3. Use the Link
Replace `next/link` with `Link` from `next-view-transitions` for smooth page navigation (Bonus!).

### 4. Theme Switch
Modify `ThemeToggle.tsx` to use the helper:
```tsx
import { useTransitionRouter } from 'next-view-transitions' // Optional helper
// actually, for theme toggle, we just wrap the setter:
import { startTransition } from 'react' // or rely on the library's auto-handling if traversing
```
**Wait, for strictly THEME toggling (no navigation), we still need `document.startViewTransition`.**
There is no "magic library" that automatically intercepts the `setTheme` of *another* library (Supabase/Context) without wrapping it.

**Revised "Copy-Paste" Solution:**
We will create a helper hook `useSmoothTheme` so the user feels like they are just "importing a feature".

---

## 🛠️ Prompt for Claude

> "Make the theme switch silky smooth (60fps) using the View Transitions API.
>
> 1.  **Remove Output Lag:** In `src/app/globals.css`, DELETE the `body * { transition... }` rule. This is the main cause of the 20fps lag.
> 2.  **Add Helper:** Create `src/hooks/useViewTransition.ts` that wraps `document.startViewTransition`.
> 3.  **Apply:** Use this hook in `ThemeToggle.tsx` to wrap the `toggle()` function.
>
> This is a zero-dependency, native browser solution that is faster and lighter than any plugin."
