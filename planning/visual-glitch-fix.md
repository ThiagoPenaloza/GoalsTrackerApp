# 🐛 Visual Glitch Analysis: The "Cut Line" on Desktop

**Status:** Identified 🔎
**Issue:** Abrupt clipping of background effects on the right edge/side of the landing page.

## 🔬 Diagnosis

I analyzed `src/app/page.tsx` and `src/components/landing/HeroScene.tsx`.

The culprit is likely a combination of **`overflow-hidden`** on the `<main>` container and **absolute positioning** of the Glow/Gradient elements that extend beyond the viewport width on desktop.

### Specific Suspects:

1.  **Strict Overflow:**
    In `src/app/page.tsx`:
    ```tsx
    <main className="min-h-screen bg-bg overflow-hidden relative">
    ```
    This chops off any blurred or glowing element that touches the edge, creating a sharp "cut" instead of a smooth fade-out.

2.  **Constrained Hero Scene:**
    In `src/components/landing/HeroScene.tsx`, the container is `absolute inset-0 overflow-hidden`.
    If the SVG or div shapes (like the "hearth" glow or "organic curves") move outside this box, they get cut. On desktop, the `grid` layout in `page.tsx` constraints the Right Column width, but the visual effects might "want" to spill over into the margins.

3.  **Background Radial Gradient:**
    The fixed background (lines 17-23 in `page.tsx`) uses `ellipse 80% 60%`. On ultra-wide screens, this might end abruptly if the percentage calculation falls short of the screen edge.

## 🛠️ The Fix Plan (For Claude)

We need to allow the lighting effects to "breathe" while keeping the page scrollbar-free.

**Solution:**
1.  **Relax Overflow on Scene:** Remove `overflow-hidden` from `HeroScene.tsx` wrapper so effects can bleed into the padding.
2.  **Soften Boundaries:** Add a CSS mask or simply ensure the parent container in `page.tsx` allows the right column to overlap the edge.
3.  **Adjust Gradient:** Increase the width of the background radial gradient to `120%` or use `100vw`.

---

## 🚀 Prompt for Claude

> "Fix the visual 'cut' glitch on the Landing Page. Read `planning/visual-glitch-fix.md`.
>
> 1.  **Modify `src/components/landing/HeroScene.tsx`**:
>     *   Remove `overflow-hidden` from the outer `div` className.
>     *   Add `z-0` to ensure it sits behind text if needed.
> 2.  **Modify `src/app/page.tsx`**:
>     *   Change the background gradient width from `80%` to `120%` (or `100vw`) to ensure it covers edge-to-edge on large screens.
>     *   Check the Right Column `div` (line 171). Ensure it allows contents to be visible if they slightly overflow (`overflow-visible`)."
