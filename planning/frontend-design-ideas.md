# 🎨 Frontend Design Ideas & Prompts

Use these concepts to guide your Frontend Design Agent. The goal is a **"Calm & Innovation"** aesthetic.

## 🌈 Global Design Language (`Pastel Dreams` + `Dark Mode`)

### Fixes Required
*   **Error:** Replace `rounded-pill` with `rounded-full` in global CSS.

### 🌑 Dark Mode Strategy
*   **Concept:** "Deep Sleep". Not just black, but deep, rich charcoal.
*   **Background:** `#0F172A` (Slate 900) or `#111827` (Gray 900).
*   **Cards:** `#1E293B` (Slate 800) with a subtle light border (`border-white/5`).
*   **Text:**
    *   Primary: `#F8FAFC` (Slate 50).
    *   Secondary: `#94A3B8` (Slate 400).
*   **Pastels in Dark Mode:** Keep the pastel accents (Lavender, Mint) but reduce their opacity (e.g., `text-indigo-300` instead of `600`) so they glow against the dark background.

---

## 🏗️ UI Components (Light / Dark)

### 1. Navigation / Header
*   **Light:** Semi-transparent white cloud.
*   **Dark:** Semi-transparent black glass (`bg-slate-900/80 backdrop-blur`).

### 2. Goal Cards
*   **Light:** White card, soft colored shadow.
*   **Dark:** Dark gray card (`bg-slate-800`), glowing border effect on hover (`hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]`).

### 3. Inputs & Forms
*   **Strategy:** Use `bg-transparent` with a border for inputs to work seamlessly in both modes.
*   **Active State:** Glow ring (`ring-2 ring-indigo-500/50`).

---

## 🚀 Implementation Prompts

### Simple Prompt for Agent
> "Fix the CSS error by changing 'rounded-pill' to 'rounded-full'. Then, implement a system-aware Dark Mode using Tailwind's `dark:` classes. The dark theme should use deep slate backgrounds (`bg-slate-900`) and the cards should use lighter slate (`bg-slate-800`) with white text."
