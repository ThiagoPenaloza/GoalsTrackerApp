# 🕵️‍♂️ AI Error Analysis: The "400 Bad Request" Mystery

**Status:** Identified ❌
**Cause:** Payload Mismatch between Frontend and Backend.

## 🔬 The Investigation

I analyzed the data flow between `CheckinForm.tsx` (Frontend) and `api/ai/checkin-feedback/route.ts` (Backend).

### 1. The Backend Requirement
The API strictly enforces the presence of two fields (lines 14-20 of `route.ts`):
```typescript
const { checkinId, goalTitle, progressNote, mood, weekNumber } = await request.json()

if (!checkinId || !goalTitle) {
  return NextResponse.json({ error: '...' }, { status: 400 }) // <--- THIS is triggering
}
```

### 2. The Frontend Payload
The `CheckinForm.tsx` (lines 53-56) only sends this:
```typescript
body: JSON.stringify({
  checkinId: checkin.id,
  mood,
  note // <--- Mismatch 1: Backend expects 'progressNote'
})
```
**CRITICAL MISSING DATA:** The frontend sends **NO** `goalTitle`.
**CRITICAL MISSING DATA:** The frontend sends **NO** `weekNumber`.

## 🛠️ The Fix Plan (For Claude)

To fix this, we need to update the `fetch` call in `CheckinForm.tsx` to include the missing data.

**Required Changes in `src/components/CheckinForm.tsx`:**
1.  Find the `goals.find(...)` to get the title of the selected goal.
2.  Pass `goalTitle` and `weekNumber` in the body.
3.  Rename `note` to `progressNote` or update the object key.

---

## 🚀 Prompt for Claude

> "Fix the AI Check-in 400 Error.
>
> **Problem:** `CheckinForm.tsx` is sending an incomplete payload. The API requires `goalTitle` and `weekNumber`, but they are missing.
>
> **Action:**
> 1.  Edit `src/components/CheckinForm.tsx`.
> 2.  Inside `handleSubmit`, find the selected goal object: `const goal = goals.find(g => g.id === selectedGoal)`.
> 3.  Update the `fetch` body to match the API contract:
>     ```typescript
>     body: JSON.stringify({
>       checkinId: checkin.id,
>       goalTitle: goal?.title, // <--- Added
>       progressNote: note,     // <--- Renamed key from 'note'
>       mood,
>       weekNumber
>     }),
>     ```
> 4.  Verify the fix by submitting a check-in."
