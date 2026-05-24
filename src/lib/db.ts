import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Lazy singleton — creates the client on first use so env vars are always loaded
let _client: PrismaClient | undefined;

export function getDb(): PrismaClient {
    if (_client) return _client;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error(
            "DATABASE_URL is not set. Add it to .env.local and restart the dev server.",
        );
    }

    const adapter = new PrismaPg({ connectionString });
    _client = new PrismaClient({ adapter });
    return _client;
}
