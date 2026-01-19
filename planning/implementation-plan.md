# 2026 Goals Tracker - Implementation Plan

This document serves as the blueprint for building the 2026 Goals Tracker application.

## 📋 Execution Order Overview

1.  **Project Setup**: Initialize Next.js, Tailwind, and install dependencies.
2.  **Database & Env**: Set up Supabase tables, RLS, and environment variables.
3.  **Authentication**: Implement Sign Up, Login, and Auth Middleware.
4.  **Core Components**: Build the design system and reusable UI components.
5.  **Goals Feature**: specific CRUD operations for goals.
6.  **AI Milestones**: Implement AI generation logic and UI.
7.  **Check-ins & Feedback**: Implement weekly check-ins and AI coaching.
8.  **Polish & Dashboard**: Finalize the dashboard and UI details.

---

## 🛠️ Phase 1: Project Setup & Configuration

### Tasks
- [ ] Initialize Next.js 14 project with TypeScript and Tailwind CSS
- [ ] Install required dependencies (`lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`, `openai`)
- [ ] Configure `tailwind.config.ts` with the specific color palette
- [ ] Create `.env.local` file with necessary variables
- [ ] Set up basic folder structure (`/components`, `/lib`, `/types`, `/hooks`)

### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### NPM Packages
```bash
npm install lucide-react @supabase/supabase-js @supabase/ssr openai clsx tailwind-merge
```

### Tailwind Config (Colors)
```javascript
// tailwind.config.ts extensions
colors: {
  primary: '#6366F1', // Indigo
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  background: '#F9FAFB', // Light Gray
  text: '#111827', // Near Black
}
```

---

## 🗄️ Phase 2: Database Structure (Supabase)

Run these SQL commands in the Supabase SQL Editor.

### 1. Enable UUID Extension
```sql
create extension if not exists "uuid-ossp";
```

### 2. Create Tables

#### Goals Table
```sql
create table goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  category text check (category in ('health', 'career', 'finance', 'personal', 'learning')),
  target_date date,
  status text default 'active' check (status in ('active', 'completed', 'abandoned')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

#### Milestones Table
```sql
create table milestones (
  id uuid primary key default uuid_generate_v4(),
  goal_id uuid references goals(id) on delete cascade not null,
  title text not null,
  month integer check (month between 1 and 12),
  is_completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
```

#### Checkins Table
```sql
create table checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  goal_id uuid references goals(id) not null,
  week_number integer check (week_number between 1 and 52),
  progress_note text,
  mood text check (mood in ('great', 'good', 'okay', 'struggling')),
  ai_feedback text,
  created_at timestamp with time zone default now()
);
```

### 3. Row Level Security (RLS) Policies

```sql
-- Enable RLS
alter table goals enable row level security;
alter table milestones enable row level security;
alter table checkins enable row level security;

-- Goals Policies
create policy "Users can view their own goals" 
on goals for select using (auth.uid() = user_id);

create policy "Users can insert their own goals" 
on goals for insert with check (auth.uid() = user_id);

create policy "Users can update their own goals" 
on goals for update using (auth.uid() = user_id);

create policy "Users can delete their own goals" 
on goals for delete using (auth.uid() = user_id);

-- Milestones Policies (Linked via goal_id, but simpler to check goal ownership or join)
-- For simplicity, we can trust the cascade or enforce via stored procedure, 
-- but standards suggest checking the goal's user_id. 
-- A simpler approach for milestones is often sufficient if the goals are secure:
create policy "Users can view milestones for their goals"
on milestones for select using (
  exists (select 1 from goals where goals.id = milestones.goal_id and goals.user_id = auth.uid())
);

create policy "Users can insert milestones for their goals"
on milestones for insert with check (
  exists (select 1 from goals where goals.id = milestones.goal_id and goals.user_id = auth.uid())
);

create policy "Users can update milestones for their goals"
on milestones for update using (
  exists (select 1 from goals where goals.id = milestones.goal_id and goals.user_id = auth.uid())
);

-- Checkins Policies
create policy "Users can view their own checkins" 
on checkins for select using (auth.uid() = user_id);

create policy "Users can insert their own checkins" 
on checkins for insert with check (auth.uid() = user_id);
```

---

## 🔐 Phase 3: Authentication & Security

### Tasks
- [ ] Create `lib/supabase-server.ts` (Cookie-based client for Server Components)
- [ ] Create `lib/supabase-client.ts` (Browser client)
- [ ] Create `middleware.ts` to protect `/dashboard`, `/goals`, `/checkin` routes
- [ ] Create `app/auth/login/page.tsx`
- [ ] Create `app/auth/signup/page.tsx`
- [ ] Create `app/auth/callback/route.ts` for handling auth callbacks

### Code Structure Key Points
- **Middleware**: Check for session. If no session and trying to access protected route -> redirect to `/auth/login`.
- **Login/Signup**: Use `supabase.auth.signInWithPassword` and `signUp`.

---

## 🧩 Phase 4: Core Components & Layout

### Tasks
- [ ] Create `components/ui/Button.tsx` (Variants: primary, outline, ghost)
- [ ] Create `components/ui/Input.tsx`
- [ ] Create `components/ui/Card.tsx`
- [ ] Create `components/ui/LoadingSpinner.tsx`
- [ ] Create `components/Navbar.tsx` (Responsive, handles active state and logout)
- [ ] Update `app/layout.tsx` to include font (Inter) and global styles

### Component Specs
- **Button**: Should accept `isLoading` prop.
- **Navbar**: Show "Dashboard", "Goals", "Logout" when logged in. Show "Login" when logged out.

---

## 🎯 Phase 5: Goals Management (CRUD)

### Tasks
- [ ] Create `types/index.ts` defining `Goal`, `Milestone`, `Checkin` interfaces.
- [ ] Create `app/goals/page.tsx` (List view with `GoalCard` grid)
- [ ] Create `components/GoalCard.tsx` (Visualize progress, badge for category)
- [ ] Create `components/EmptyState.tsx`
- [ ] Create `app/goals/new/page.tsx` (Form to add title, description, category, date)
- [ ] Implement Server Action or API Route for creating a goal.

### Logic
- **GoalCard**: Shows title, category badge, and a calculated progress bar based on completed milestones.

---

## 🤖 Phase 6: AI Milestones Generation

### Tasks
- [ ] Setup `lib/openai.ts` configuration
- [ ] Create `app/api/ai/generate-milestones/route.ts`
- [ ] Update `app/goals/new/page.tsx` to call AI API after goal creation
- [ ] Implement the "Goal Detail" page `app/goals/[id]/page.tsx`
- [ ] Create `components/MilestoneList.tsx` (Checkboxes for milestones)

### AI Flow
1. User submits Goal.
2. App saves Goal to DB.
3. App calls `api/ai/generate-milestones` with goal details.
4. API calls OpenAI with the prompt from requirements.
5. API receives JSON array, saves 12 entries to `milestones` table.
6. User is redirected to `goals/[id]` page to see the generated plan.

---

## 📝 Phase 7: Weekly Check-ins & AI Coach

### Tasks
- [ ] Create `components/CheckinForm.tsx` (Textarea + Mood selection)
- [ ] Create `app/checkin/page.tsx` (Or modal on dashboard)
- [ ] Create `app/api/ai/coach-feedback/route.ts`
- [ ] Display feedback on the dashboard or check-in history.

### AI Flow
1. User selects a goal (or general check-in) and submits logic.
2. App saves `checkin` record.
3. App calls `api/ai/coach-feedback` with weekly data.
4. API returns motivational text.
5. App updates the `checkin` record with `ai_feedback`.
6. UI displays the feedback immediately.

---

## 📊 Phase 8: Dashboard & Polish

### Tasks
- [ ] Create `components/ProgressRing.tsx` for visual stats.
- [ ] Build `app/dashboard/page.tsx`
    - Show "Active Goals" count.
    - Show "Current Streak" (mock or calculated).
    - Show "Recent Feedback".
- [ ] Add Loading Skeletons for data fetching states.
- [ ] Verify Mobile Responsiveness for all pages.

### Dashboard Logic
- Fetch all active goals.
- Calculate overall completion % (Total completed milestones / Total milestones).
- display the most recent AI feedback if available.
