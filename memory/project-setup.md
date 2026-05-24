---
name: project-setup
description: Tech stack, Prisma 7 config, admin panel auth, and portfolio DB architecture
metadata:
  type: project
---

TanStack Start (SSR) + React 19 + Tailwind v4 + Supabase PostgreSQL via Prisma 7.

**Prisma 7 uses a new config API** — no `url`/`directUrl` in `schema.prisma`. Instead:
- `prisma.config.ts` at root handles CLI (db push, migrate)
- Runtime uses `PrismaPg` adapter from `@prisma/adapter-pg`
- `createServerFn` uses `.inputValidator(zod)` not `.validator(zod)`

Admin panel at `/admin` uses stateless HMAC auth — token = SHA-256(username:password). Stored in localStorage, verified server-side via `verifyTokenFn`. No third-party auth.

Portfolio links stored in `portfolio_links` table (Supabase). Portfolio component fetches client-side via `getPortfolioLinksFn`. Cards show platform gradient (Instagram pink/TikTok dark), click opens embed modal (Instagram blockquote + embed.js, TikTok iframe `/embed/v2/VIDEO_ID`).

**Why:** User wanted dynamic portfolio via DB instead of static local images, personal site so no third-party auth.

**How to apply:** When touching DB layer, use `@prisma/adapter-pg` pattern. When using server functions, use `.inputValidator()`.
