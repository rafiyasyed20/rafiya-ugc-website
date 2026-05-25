-- Migration: add category_id FK to portfolio_links, backfill from category name
-- Run with: npx prisma db execute --file prisma/migrations/002_add_category_id_to_portfolio_links.sql
-- (categories table must already exist — run 001 first if starting fresh)

-- 1. Add the nullable column
ALTER TABLE "portfolio_links"
    ADD COLUMN IF NOT EXISTS "category_id" TEXT;

-- 2. Backfill: match existing category string → categories.id lookup
UPDATE "portfolio_links" pl
SET "category_id" = c.id
FROM "categories" c
WHERE c.name = pl.category;

-- 3. Add the FK constraint (SET NULL keeps orphaned rows safe if a category is deleted)
ALTER TABLE "portfolio_links"
    ADD CONSTRAINT "portfolio_links_category_id_fkey"
    FOREIGN KEY ("category_id")
    REFERENCES "categories"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
