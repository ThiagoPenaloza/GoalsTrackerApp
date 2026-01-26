# 🎨 Visual Upgrade & Polish Plan

We are adding "Verify High-End" visual impact while maintaining the new lightweight architecture.

## 1. 🧊 React Three Fiber Hero (Landing Page)
*   **Goal:** A mesmerizing 3D abstract scene that floats on the right side of the Hero section.
*   **Tech:** `three`, `@react-three/fiber`, `@react-three/drei`.
*   **Performance Strategy:**
    *   **Lazy Load:** The 3D canvas must be imported using `next/dynamic` with `ssr: false`.
    *   **Fallback:** Show a nice gradient orb while the 3D loads.
    *   **Design:** Abstract floating geometric shapes (Glass-like icosahedrons or spheres) that rotate slowly. Matches the Pastel Orange/Dark theme.

## 2. 🏷️ Rebranding: "MyGoals AI"
*   **Update:** Change all text references from "Mindful Goals" or "Goals Tracker" to **"MyGoals AI"**.
*   **Locations:**
    *   `src/app/layout.tsx` (Metadata title).
    *   `src/app/page.tsx` (Navbar & Hero text).
    *   `src/components/Navbar.tsx` (Dashboard usage).

## 3. 🌓 Theme Toggle Animation
*   **Goal:** A satisfying "switch" animation.
*   **Implementation:**
    *   Use CSS View Transitions (if supported) or SVG morphing.
    *   **Effect:** The Sun icon rotates and scales down as the Moon scales up (and vice versa).
    *   **Code:** Update `ThemeToggle.tsx` with Tailwind 'group-hover' and conditional rendering classes for smooth CSS transitions.

---

## 🚀 Execution Prompt for Claude

> "Execute the Visual Upgrade Plan.
>
> 1.  **Install:** `npm install three @types/three @react-three/fiber @react-three/drei`
> 2.  **Rename:** Search the project for "Mindful Goals" and replace with **"MyGoals AI"**. Update `src/app/layout.tsx` metadata title as well.
> 3.  **Create 3D Hero:**
>     *   Create `src/components/landing/HeroScene.tsx`. Make it a client component.
>     *   Render a `Canvas` with some floating, auto-rotating `Float` meshes (like an Icosahedron) with `MeshDistortMaterial`. Use colors `#F97316` (Orange) and `#4B5563` (Gray).
>     *   Import it into `src/app/page.tsx` using `dynamic(() => import(...), { ssr: false })` and place it in the Hero section.
> 4.  **Animate Theme Toggle:** Update `ThemeToggle.tsx` to have a smooth rotation/scale animation when switching icons.
>
> **Constraint:** Ensure the 3D scene does NOT block the main page load."
