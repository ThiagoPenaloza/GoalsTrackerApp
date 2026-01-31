# 2026 Goals Tracker - Pre-Launch Improvements

Copy each prompt below and send it to Claude to implement the feature.

---

## 🚨 CRITICAL: Security & Authentication (DO FIRST!)

### Task 0A: Fix User Data Isolation (URGENT!)
```
CRITICAL BUG: Goals from one user account are appearing on another user's dashboard.

This is a data isolation/security issue that MUST be fixed immediately.

Requirements:
1. Audit ALL Supabase queries in the codebase to ensure they filter by `user_id`
2. Verify Row Level Security (RLS) policies are correctly set up in Supabase:
   - Goals table: Users can only SELECT/INSERT/UPDATE/DELETE their own goals
   - Milestones table: Users can only access milestones for goals they own
   - Checkins table: Users can only access their own check-ins
3. Check the dashboard, goals list, and goal detail pages for proper user filtering
4. Ensure the `auth.uid()` is correctly passed in all queries
5. Test with multiple accounts to verify isolation works

Files to audit:
- `src/app/dashboard/page.tsx`
- `src/app/goals/page.tsx`
- `src/app/goals/[id]/page.tsx`
- `src/app/checkin/page.tsx`
- All API routes in `src/app/api/`

This is a SECURITY VULNERABILITY - fix before any other tasks.
```

---

### Task 0B: Fix Email Confirmation
```
Users are not receiving email confirmation when signing up.

Requirements:
1. Check Supabase Auth settings in the dashboard:
   - Email confirmations should be enabled
   - SMTP settings should be configured (or use Supabase's built-in email)
2. Verify the auth callback route handles email confirmation correctly
3. Add a "Resend Confirmation Email" button on the login page
4. Show a clear message after signup: "Check your email to confirm your account"
5. Handle the case where user tries to login without confirmed email

Check:
- Supabase Dashboard → Authentication → Email Templates
- Supabase Dashboard → Authentication → Providers → Email settings
- `src/app/auth/signup/page.tsx`
- `src/app/auth/callback/route.ts`

Document what Supabase settings need to be changed.
```

---

### Task 0C: Add Google OAuth Login
```
Add "Sign in with Google" option to the authentication flow.

Requirements:
1. Configure Google OAuth in Supabase Dashboard:
   - Authentication → Providers → Google
   - Need: Google Cloud Console OAuth credentials (Client ID & Secret)
2. Add "Continue with Google" button to login and signup pages
3. Style the button according to Google's brand guidelines
4. Handle the OAuth callback properly
5. Ensure new Google users get a proper profile created
6. Support both new signups and returning users

Implementation:
- Update `src/app/auth/login/page.tsx`
- Update `src/app/auth/signup/page.tsx`
- Verify `src/app/auth/callback/route.ts` handles OAuth

Provide instructions for setting up Google Cloud Console OAuth credentials.
```

---

## 🎨 User Experience Polish

### Task 1: Onboarding Flow
```
Add an onboarding flow for new users.

Requirements:
- Detect first-time users (no goals yet)
- Show a 3-step welcome modal: "Welcome" → "Create Your First Goal" → "AI Will Help You"
- Include a "Skip" option
- After completing, redirect to the goal creation page
- Store onboarding completion in localStorage

Create the component at `src/components/OnboardingModal.tsx` and integrate it into the dashboard.
```

---

### Task 2: Toast Notifications
```
Add toast notifications for user feedback.

Requirements:
- Install `sonner` package
- Create a toast provider in the layout
- Add success toasts for: goal created, goal deleted, milestone completed, check-in submitted
- Add error toasts for: API failures, form validation errors
- Toasts should appear in the bottom-right corner
- Support dark mode

Update all relevant pages and components to use the new toast system.
```

---

### Task 3: Skeleton Loaders
```
Replace loading spinners with skeleton loaders.

Requirements:
- Create `src/components/ui/Skeleton.tsx` with animated pulse effect
- Create skeleton variants for: GoalCard, MilestoneList, Dashboard stats
- Apply to: `/dashboard/page.tsx`, `/goals/page.tsx`, `/goals/[id]/page.tsx`
- Match the exact dimensions of the content being loaded

Use CSS animations, not external libraries.
```

---

### Task 4: Mobile Optimization
```
Audit and fix mobile responsiveness issues.

Requirements:
- Test all pages at 375px width (iPhone SE)
- Fix any overflow issues in the Navbar
- Ensure GoalCard grid is single-column on mobile
- Make forms full-width on mobile
- Ensure touch targets are at least 44x44px
- Fix any text truncation issues

List all changes made in your response.
```

---

## 🔥 Engagement Features

### Task 5: Streak Tracking
```
Add streak tracking for user check-ins.

Requirements:
- Calculate consecutive days/weeks of check-ins
- Add `current_streak` and `longest_streak` columns to the user profile (or calculate client-side)
- Display streak on dashboard with a flame 🔥 icon
- Show "X day streak" badge
- Reset streak if user misses a week

Create a utility function at `src/lib/streaks.ts` and add the UI to the dashboard.
```

---

### Task 6: Goal Sharing
```
Add the ability to share goal progress on social media.

Requirements:
- Create a "Share Progress" button on the goal detail page
- Generate a shareable image card showing: goal title, progress %, milestone count
- Use `html-to-image` or canvas API to generate the image
- Support sharing to Twitter/X with pre-filled text
- Also provide a "Copy Link" option

Create `src/components/ShareProgressButton.tsx`.
```

---

### Task 7: Celebration Animations
```
Add celebration animations when users complete milestones or goals.

Requirements:
- Install `canvas-confetti` package
- Trigger confetti when a milestone is marked complete
- Bigger celebration when a goal is 100% complete
- Add a subtle success sound (optional, with user preference)
- Animations should be performant and not block UI

Integrate into `MilestoneList.tsx` and `GoalStatusSelector.tsx`.
```

---

## 🤖 AI Enhancements

### Task 8: Smart Milestone Periods
```
Make AI generate contextually appropriate milestone periods.

Requirements:
- If goal target_date is < 3 months away: generate WEEKLY milestones
- If goal target_date is 3-12 months: generate MONTHLY milestones
- If goal target_date is > 12 months: generate QUARTERLY milestones
- Update the AI prompt in `api/ai/generate-milestones/route.ts`
- Update `MilestoneList.tsx` to display "Week 1", "Month 1", or "Q1" labels accordingly
- Update the database schema if needed to store milestone type

This is a critical UX improvement for short-term goals.
```

---

### Task 9: AI Retry Logic
```
Add retry logic and error handling for AI API calls.

Requirements:
- Wrap AI calls in a retry function (max 3 attempts with exponential backoff)
- Show user-friendly error messages if AI fails
- Provide a "Retry" button on failure
- Add fallback placeholder milestones if AI is unavailable
- Log errors for debugging

Update both `api/ai/generate-milestones/route.ts` and `api/ai/coach-feedback/route.ts`.
```

---

## 🛠️ Technical Improvements

### Task 10: Error Boundaries
```
Add React error boundaries to catch crashes gracefully.

Requirements:
- Create `src/components/ErrorBoundary.tsx`
- Wrap the main layout with the error boundary
- Show a friendly error page with "Something went wrong" message
- Include a "Try Again" button that reloads the page
- Log errors to console (or external service)

Use React's class-based error boundary pattern or the `react-error-boundary` package.
```

---

### Task 11: SEO Metadata
```
Add comprehensive SEO metadata for marketing.

Requirements:
- Update `src/app/layout.tsx` with proper metadata export
- Add: title, description, Open Graph tags, Twitter card tags
- Add `robots.txt` and `sitemap.xml` generation
- Add structured data (JSON-LD) for the application
- Ensure all pages have unique titles

Target keywords: "goal tracker", "AI goal planning", "2026 goals", "milestone tracker"
```

---

### Task 12: PWA Support
```
Add Progressive Web App (PWA) support.

Requirements:
- Create `public/manifest.json` with app name, icons, theme colors
- Add a service worker for offline support (or use `next-pwa`)
- Add appropriate meta tags in the layout
- Create app icons in multiple sizes (192x192, 512x512)
- Test "Add to Home Screen" functionality

The app should work offline for viewing existing goals.
```

---

### Task 13: Rate Limiting
```
Add rate limiting to protect AI API endpoints.

Requirements:
- Install `@upstash/ratelimit` and `@upstash/redis` (or use in-memory for MVP)
- Limit AI endpoints to 10 requests per minute per user
- Return 429 status code with retry-after header when exceeded
- Show user-friendly message: "You're moving fast! Please wait a moment."

Apply to `api/ai/generate-milestones/route.ts` and `api/ai/coach-feedback/route.ts`.
```

---

## 📊 Analytics & Growth

### Task 14: Analytics Integration
```
Add analytics to track user engagement.

Requirements:
- Install Vercel Analytics or Posthog
- Track page views automatically
- Add custom events for: goal_created, milestone_completed, checkin_submitted
- Create an analytics utility at `src/lib/analytics.ts`
- Respect user privacy (no PII in events)

Follow the provider's Next.js integration guide.
```

---

### Task 15: User Feedback Widget
```
Add a simple feedback widget for users to report issues.

Requirements:
- Create a floating "Feedback" button in the bottom-left corner
- Opens a modal with: issue type dropdown, text area, optional email
- Submit to a simple API route that stores in Supabase `feedback` table
- Show confirmation after submission
- Should not interfere with main app navigation

Create `src/components/FeedbackWidget.tsx` and `api/feedback/route.ts`.
```

---

## 🚀 Quick Wins (Do First!)

### Task 16: Landing Page Polish
```
Review and enhance the landing page for conversions.

Requirements:
- Ensure hero section has a compelling headline and CTA
- Add social proof section (testimonials or stats placeholders)
- Add feature highlights with icons
- Ensure mobile responsiveness
- Add subtle animations on scroll
- Test load time and optimize images

The landing page should "wow" visitors and clearly communicate the value.
```

---

## Priority Order

### 🚨 CRITICAL (Do Immediately!)
1. **Task 0A** (Data Isolation) - SECURITY FIX - Goals leaking between accounts
2. **Task 0B** (Email Confirmation) - Users can't verify accounts
3. **Task 0C** (Google OAuth) - Easier login experience

### 🔥 High Priority
4. **Task 2** (Toast Notifications) - Quick win, big UX impact
5. **Task 11** (SEO Metadata) - Essential for marketing
6. **Task 16** (Landing Page Polish) - First impression matters
7. **Task 8** (Smart Milestones) - Core feature improvement

### ⭐ Standard Priority
8. **Task 7** (Celebrations) - Delightful UX
9. **Task 1** (Onboarding) - Reduce churn
10. **Task 5** (Streaks) - Engagement driver
11. **Task 3** (Skeletons) - Professional feel
12. **Task 10** (Error Boundaries) - Stability
13. **Task 12** (PWA) - Mobile experience
14-19. (Rest as time allows)

---

*Created: 2026-01-30*
*Updated: 2026-01-30 - Added critical security fixes*
