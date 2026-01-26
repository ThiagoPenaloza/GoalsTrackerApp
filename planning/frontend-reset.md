# 🍊 The Fresh Start: Frontend Reset Plan

The current app has become "bloated" due to complex component libraries and glassmorphism effects.
**The Goal:** < 300ms page loads.
**The Method:** "Nuclear" cleanup + Minimalist Rebuild.

## 🧹 Step 1: The Cleanup (Delete Phase)
We will remove the heavy dependencies and complex components.

1.  **Delete:**
    *   `src/components/*` (Delete ALL existing components: `GoalCard`, `Navbar`, etc.)
    *   `src/app/globals.css` (Reset to zero).
    *   `src/app/dashboard/DashboardUI.tsx` (Delete complex client wrapper).
    *   `src/app/goals/GoalsUI.tsx`
    *   `src/app/checkin/CheckinUI.tsx`
2.  **Uninstall:**
    *   `@phosphor-icons/react` (The source of the lag).
    *   `framer-motion` (if present).

## 🎨 Step 2: The New Logic (Performance First)
*   **Icons:** Use **Lucide React** (standard, extremely light). `npm install lucide-react`.
*   **CSS:** Pure Tailwind. No custom CSS variables for complex gradients.
*   **Theme:**
    *   **Light:** Pastel Orange (`bg-orange-50`) & Cream.
    *   **Dark:** Pitch Black (`bg-black`) with Neon Orange accents (`text-orange-500`).

## 🏗️ Step 3: The Rebuild (Scaffold)

### 1. Global Styles (`globals.css`)
*   Zero imports.
*   Just Tailwind directives.
*   Font: `Inter` or `Geist` (System font stack for speed).

### 2. Components (Atomic & Server-First)
*   `Navbar.tsx`: Simple flexbox. Text links.
*   `Card.tsx`: `border border-gray-200 dark:border-gray-800`. No shadows, no blur.
*   `Button.tsx`: Solid colors. `bg-orange-500 hover:bg-orange-600`.

### 3. Pages
*   **Dashboard:** Simple grid.
*   **Goal List:** Simple list items.

---

## 🚀 Execution Prompt for Claude (The "Reset" Prompt)

> "Execute the **Frontend Reset Plan**.
>
> 1.  **DELETE:** Remove all files in `src/components/`. Delete `src/app/globals.css`.
> 2.  **UNINSTALL:** Run `npm uninstall @phosphor-icons/react`.
> 3.  **INSTALL:** Run `npm install lucide-react`.
> 4.  **RECREATE:**
>     *   **`src/app/globals.css`**: Minimal Tailwind setup.
>     *   **`src/components/ui/Button.tsx`**: Simple Pastel Orange button.
>     *   **`src/app/page.tsx`**: Lightweight Landing Page with Pastel Orange/Dark Mode theme.
>     *   **`src/app/dashboard/page.tsx`**: Server Component fetching data + simple UI.
>
> **Design Requirements:**
> *   **Primary Color:** Pastel Orange (#FFEDD5 / ##F97316).
> *   **Dark Mode:** Solid Black (#000000) with Orange Accents.
> *   **Performance:** NO `backdrop-filter`. NO heavy animations."
