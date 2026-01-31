# 🧠 Smart Milestone Logic: Granular Steps

**Status:** Identified 🔎
**Goal:** The AI should generate *more* steps (e.g., weekly) for short-term goals, rather than just 1 per month.

## 🔬 The Logic Change

We need to update `src/app/api/ai/generate-milestones/route.ts` to be smarter about "Granularity".

### 1. Determine Granularity
Inside the route handler, after calculating `numMonths`:
*   **If duration <= 3 months:** Switch to **Weekly Mode**.
    *   `numSteps = numMonths * 4` (approx)
    *   Prompt modification: "Generate weekly milestones..."
*   **If duration > 3 months:** Stay in **Monthly Mode**.
    *   `numSteps = numMonths`
    *   Prompt modification: "Generate monthly milestones..."

### 2. Update Prompt Structure
Dynamic prompt based on granularity:
*   **Weekly:** "Generate exactly {numSteps} milestones (roughly 4 per month). Format the 'title' to start with 'Week X: ...'"
*   **Monthly:** "Generate exactly {numSteps} monthly milestones..."

### 3. Loop Update
Update the validation loop to check against `numSteps` instead of `numMonths`.

---

## 🚀 Prompt for Claude

> "Make the AI generate detailed weekly steps for short goals. Read `planning/smart-milestones.md`.
>
> 1.  **In `src/app/api/ai/generate-milestones/route.ts`**:
>     *   Add logic: `const isShortTerm = numMonths <= 3`.
>     *   Calculate `targetSteps`: If short-term, `numMonths * 4`. If long-term, `numMonths`.
>     *   **Crucial:** Update the AI Prompt to explicitly ask for "Weekly milestones" if short-term, and "Monthly milestones" if long-term.
>     *   Update the `while` loop to pad until `targetSteps` length."
