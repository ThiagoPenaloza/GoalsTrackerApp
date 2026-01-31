# 🎨 Fix Milestone Card Layout

**Status:** UI/UX Fix 🎨
**Problem:** The milestone cards display incorrectly:
*   The period label ("Month 1") is in the wrong position.
*   The title text includes redundant "Week X:" prefix.

## 🔬 Current State

The AI generates titles like: `"Week 1: Calculate daily caloric deficit..."`
The card displays:
```
[Title] Week 1: Calculate daily caloric deficit...
[Label] Month 1  <-- Wrong! Should say "Week 1" and be at the bottom
```

## 🛠️ The Fix (Two Parts)

### Part 1: Update AI Prompt
In `src/app/api/ai/generate-milestones/route.ts`:
*   Update the prompt to tell the AI: "Generate titles WITHOUT the 'Week X:' or 'Month X:' prefix. Just the action."
*   Example: Instead of `"Week 1: Calculate caloric deficit"`, generate `"Calculate caloric deficit"`.

### Part 2: Update MilestoneList Component
In `src/components/MilestoneList.tsx`:
*   Move the period label (`<p className="text-xs">`) to **after** the title.
*   Dynamically display "Week X" or "Month X" based on the total milestone count (if > 12, assume weekly).

---

## 🚀 Prompt for Claude

> "Fix the milestone card layout. Read `planning/milestone-card-layout.md`.
>
> 1.  **In `src/app/api/ai/generate-milestones/route.ts`**: Update the AI prompt to generate milestone titles WITHOUT period prefixes like 'Week X:' or 'Month X:'. Just the objective text.
> 2.  **In `src/components/MilestoneList.tsx`**: Swap the order of elements so the period label (Week X / Month X) appears BELOW the title. Calculate the label dynamically based on milestone count (> 12 = Weekly)."
