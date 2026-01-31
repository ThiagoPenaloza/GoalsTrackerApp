-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR DATA ISOLATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GOALS TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON goals;
DROP POLICY IF EXISTS "Users can update own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON goals;

-- Users can only SELECT their own goals
CREATE POLICY "Users can view own goals"
ON goals FOR SELECT
USING (auth.uid() = user_id);

-- Users can only INSERT goals with their own user_id
CREATE POLICY "Users can insert own goals"
ON goals FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own goals
CREATE POLICY "Users can update own goals"
ON goals FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only DELETE their own goals
CREATE POLICY "Users can delete own goals"
ON goals FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- MILESTONES TABLE POLICIES
-- Milestones are linked to goals, so we check goal ownership
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view milestones for own goals" ON milestones;
DROP POLICY IF EXISTS "Users can insert milestones for own goals" ON milestones;
DROP POLICY IF EXISTS "Users can update milestones for own goals" ON milestones;
DROP POLICY IF EXISTS "Users can delete milestones for own goals" ON milestones;

-- Users can only SELECT milestones for their own goals
CREATE POLICY "Users can view milestones for own goals"
ON milestones FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = milestones.goal_id
    AND goals.user_id = auth.uid()
  )
);

-- Users can only INSERT milestones for their own goals
CREATE POLICY "Users can insert milestones for own goals"
ON milestones FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = milestones.goal_id
    AND goals.user_id = auth.uid()
  )
);

-- Users can only UPDATE milestones for their own goals
CREATE POLICY "Users can update milestones for own goals"
ON milestones FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = milestones.goal_id
    AND goals.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = milestones.goal_id
    AND goals.user_id = auth.uid()
  )
);

-- Users can only DELETE milestones for their own goals
CREATE POLICY "Users can delete milestones for own goals"
ON milestones FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM goals
    WHERE goals.id = milestones.goal_id
    AND goals.user_id = auth.uid()
  )
);

-- =====================================================
-- CHECKINS TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own checkins" ON checkins;
DROP POLICY IF EXISTS "Users can insert own checkins" ON checkins;
DROP POLICY IF EXISTS "Users can update own checkins" ON checkins;
DROP POLICY IF EXISTS "Users can delete own checkins" ON checkins;

-- Users can only SELECT their own checkins
CREATE POLICY "Users can view own checkins"
ON checkins FOR SELECT
USING (auth.uid() = user_id);

-- Users can only INSERT checkins with their own user_id
CREATE POLICY "Users can insert own checkins"
ON checkins FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own checkins
CREATE POLICY "Users can update own checkins"
ON checkins FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only DELETE their own checkins
CREATE POLICY "Users can delete own checkins"
ON checkins FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION QUERIES (run after applying policies)
-- =====================================================

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('goals', 'milestones', 'checkins');

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
