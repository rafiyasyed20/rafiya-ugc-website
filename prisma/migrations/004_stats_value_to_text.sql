-- Migration: change stats.value to TEXT, drop suffix and decimals columns
-- Run with: npx prisma db execute --file prisma/migrations/004_stats_value_to_text.sql

ALTER TABLE "stats" ALTER COLUMN "value" TYPE TEXT USING value::TEXT;
ALTER TABLE "stats" DROP COLUMN IF EXISTS "suffix";
ALTER TABLE "stats" DROP COLUMN IF EXISTS "decimals";
