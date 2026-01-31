-- =====================================================
-- RESET ALL TEST DATA
-- WARNING: This will delete ALL goals, milestones, and checkins
-- Run this in Supabase SQL Editor
-- =====================================================

-- Delete in order of foreign key dependencies
-- 1. First delete checkins (references goals)
-- 2. Then delete milestones (references goals)
-- 3. Finally delete goals

DELETE FROM checkins;
DELETE FROM milestones;
DELETE FROM goals;

-- Verify deletion
SELECT 'goals' as table_name, COUNT(*) as count FROM goals
UNION ALL
SELECT 'milestones', COUNT(*) FROM milestones
UNION ALL
SELECT 'checkins', COUNT(*) FROM checkins;
