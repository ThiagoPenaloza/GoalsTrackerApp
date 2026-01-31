# 🏷️ Fix Milestone Label Display

**Status:** Small UI Fix 🎨
**Problem:** The milestone cards always show "Month X" even when the AI generates weekly milestones.

## 🔬 The Issue

The `MilestoneList.tsx` component has this hardcoded label:
```tsx
<p className="text-xs text-txt-muted mt-0.5">Month {m.month}</p>
```

## 🛠️ The Fix

We need to update the label to dynamically display the correct granularity. We have two options:

### Option A: Infer from Count (Simple)
If there are more milestones than expected months, assume they are weekly:
*   **> 12 milestones or > 4 per month:** Display "Week X"
*   **Otherwise:** Display "Month X"

### Option B: Store Granularity in DB (Better)
Add a `granularity` field to the `milestones` table or pass it from the API response.

---

## 🚀 Prompt for Claude

> "Fix the milestone label display. Read `planning/milestone-label-fix.md`.
>
> In `src/components/MilestoneList.tsx`, update the label logic:
> *   If `milestones.length > 12` (or more than double the typical monthly count), change the label from 'Month' to 'Week'.
> *   Update the `<p>` tag to display the correct granularity."
