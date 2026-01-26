# 📉 Performance Audit & Optimization Plan

**Diagnosis:** The app is clean, but the **3-second lag** on GET requests is caused by **Middleware Bottlenecks**.
The middleware (`src/middleware.ts`) contacts Supabase (`supabase.auth.getUser()`) on *every* request to check if the user is logged in. This adds an external HTTP roundtrip (500ms - 2s depending on database region) before your page even starts rendering.

## 🗑️ Weight Reduction & Cleanup

No "junk files" were found in the structure, but we can make the *runtime* lighter.

### 1. Optimize Middleware (The 3s Fix)
*   **Problem:** Middleware runs on too many paths.
*   **Fix:** Restrict the `matcher` config to ONLY run on protected routes. Don't let it run on the landing page or public assets.
*   **Target:** `src/middleware.ts`

### 2. "Instant" Navigation (Streaming)
*   **Problem:** The browser waits for the *entire* page data (Goals + Milestones + Checkins) to be fetched before showing anything.
*   **Fix:** Use `loading.tsx` files. This essentially tells Next.js: "Show this Skeleton UI immediately (0ms), then fill in the data when it's ready."
*   **Target:** Create `src/app/dashboard/loading.tsx` and `src/app/goals/loading.tsx`.

### 3. Font Optimization
*   **Problem:** `globals.css` has an `@import` for Google Fonts. This is a "render blocking" request. The browser halts painting until it downloads the CSS, then halts again to download the font.
*   **Fix:** Use `next/font`. It downloads the font at build time and self-hosts it. Zero network delay at runtime.
*   **Target:** Remove `@import` from `globals.css`. Add `next/font/google` to `layout.tsx`.

---

## 🛠️ Optimization Prompt for Claude

> "Make the app load in <1s. Read `planning/optimization-audit.md` and execute:
>
> 1.  **Fix Font Loading:** Remove the `@import` from `globals.css`. Configure `Manrope` and `DM Sans` using `next/font/google` in `src/app/layout.tsx`.
> 2.  **Optimize Middleware:** Update `src/middleware.ts` config `matcher` to strictly include only `/dashboard/:path*`, `/goals/:path*`, `/checkin/:path*`, and `/auth/:path*`. Exclude everything else (like the Landing Page `/`).
> 3.  **Add Loading States:** Create a `loading.tsx` file for `/dashboard` that imports and renders the `DashboardSkeleton`. This makes navigation feel instant."
