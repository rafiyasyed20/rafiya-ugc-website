import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Prisma CLI only reads .env by default; load .env.local for local dev
config({ path: ".env.local" });

// For schema operations (db push / migrate), Supabase requires the session-mode pooler
// (same pooler host as DATABASE_URL but port 5432 instead of 6543).
// The direct DB host (db.*.supabase.co:5432) may be firewall-blocked on many networks.
function getSessionModeUrl(): string {
    const poolerUrl = process.env.DATABASE_URL ?? "";
    return poolerUrl
        .replace(":6543/", ":5432/")
        .replace(/[?&]pgbouncer=true/g, "")
        .replace(/[?&]connection_limit=\d+/g, "")
        .replace(/\?&/, "?")
        .replace(/\?$/, "");
}

export default defineConfig({
    datasource: {
        url: getSessionModeUrl(),
    },
});
