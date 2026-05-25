-- Migration: add categories table
-- Run with: npx prisma db execute --file prisma/migrations/001_add_categories.sql
-- Or apply the schema with: npx prisma db push

CREATE TABLE IF NOT EXISTS "categories" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name");
