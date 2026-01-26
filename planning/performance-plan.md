# ⚡ Phase 2: Maximum Speed Optimization

The app is functionally correct but "heavy". The user wants < 1s load times.
The bottleneck is **Module Compilation** (processing 14k+ modules) and **Bundle Size**.

## � Optimization Strategy

### 1. Enable TurboPack (Instant Dev Server)
*   **Why:** Next.js 14 includes `turbopack`, a Rust-based compiler that is 700x faster than Webpack.
*   **Action:** Update `package.json` dev script to use `next dev --turbo`.

### 2. Optimize Package Imports (Critical)
*   **Why:** Even with the import strings fixed, Webpack might still be tree-shaking poorly.
*   **Action:** Add `experimental.optimizePackageImports` to `next.config.js`. This forces Next.js to only load the exact icons you use, treating `@phosphor-icons/react` as a barrel file to be split.

### 3. Route Segment Config
*   **Why:** We need to ensure pages that *can* be static *are* static, and dynamic ones are optimized.
*   **Action:** Add `export const dynamic = 'force-dynamic'` to `DashboardContent.tsx` (the server part) but ensure the specialized Client Parts are lazy loaded if possible.

### 4. Lazy Loading Heavy Components
*   **Why:** Loading the entire Dashboard UI code (with all its charts/icons) upfront blocks the main thread.
*   **Action:** Use `next/dynamic` to load the `DashboardUI` component. This means the browser renders the "Skeleton" instantly, then "populates" the heavy UI 200ms later.

---

## 🛠️ Execution Prompt for Claude

> "Optimize the project for speed (<1s load). Read `planning/performance-plan.md` and execute:
>
> 1.  **Turbo Mode:** Modify `package.json` -> `"dev": "next dev --turbo"`.
> 2.  **Config Optimization:** Update `next.config.js` to include:
>     ```javascript
>     experimental: {
>       optimizePackageImports: ['@phosphor-icons/react', 'lucide-react'],
>     },
>     ```
> 3.  **Lazy Load UI:** In `src/app/dashboard/DashboardContent.tsx` and `GoalsContent.tsx`, import the UI components using `dynamic`:
>     ```typescript
>     import dynamic from 'next/dynamic'
>     const DashboardUI = dynamic(() => import('./DashboardUI').then(mod => mod.DashboardUI), {
>       loading: () => <DashboardSkeleton />,
>     })
>     ```
> 4.  **Verify:** Restart the server. It should start much faster."
