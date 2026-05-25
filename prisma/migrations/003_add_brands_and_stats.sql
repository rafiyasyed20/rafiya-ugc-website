-- Migration: add brands and stats tables
-- Run with: npx prisma db execute --file prisma/migrations/003_add_brands_and_stats.sql

CREATE TABLE IF NOT EXISTS "brands" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "logoUrl"   TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "stats" (
    "id"        TEXT NOT NULL,
    "label"     TEXT NOT NULL,
    "value"     DOUBLE PRECISION NOT NULL DEFAULT 0,
    "suffix"    TEXT NOT NULL DEFAULT '',
    "decimals"  INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);
