# 🧠 Smart Milestone Logic: Duration-Aware Planning

**Status:** Identified 🔎
**Problem:** The AI currently forces **12 milestones** regardless of the goal's deadline. A 2-month goal gets 12 months of tasks, which is confusing.

## 🔬 The Logic Change

We need to calculate the **Duration (in Months)** between `Today` and the `Target Date`.

### 1. Calculate Months
In `src/app/api/ai/generate-milestones/route.ts`, we will add logic to parse `target_date`.
- If `target_date` exists: `months = differenceInMonths(target_date, now)`
- If no date: Default to 12.
- Minimum: 1 month.

### 2. Dynamic Prompting
Update the prompt sent to Llama 3:
*   **Old:** "generate exactly 12 monthly milestones"
*   **New:** "generate exactly {N} monthly milestones..."

### 3. Validation Update
The current code has a fallback loop that *forces* the array to be 12 items long:
```typescript
while (milestones.length < 12) { ... } // ❌ This must be dynamic
```
We will change this to:
```typescript
while (milestones.length < durationInMonths) { ... }
```

---

## 🚀 Prompt for Claude

> "Fix the AI Milestone logic to respect the Goal's deadline. Read `planning/ai-milestone-fix.md`.
>
> 1.  **Parse Date:** In `src/app/api/ai/generate-milestones/route.ts`, read `target_date` from the request body.
> 2.  **Calculate Duration:** Calculate the number of months between now and `target_date`. If no date, default to 12.
> 3.  **Update Prompt:** Change the prompt to ask for specifically that number of milestones.
> 4.  **Update Validation:** Ensure the fallback/padding loop uses this calculated number, not the hardcoded '12'."
