import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "./db";

// Serialization-safe type: no Date fields, only JSON primitives
export type PortfolioItem = {
    id: string;
    url: string;
    platform: string;
    category: string;
    title: string;
    tall: boolean;
    sortOrder: number;
};

async function getExpectedToken(): Promise<string> {
    const username = process.env.VERCEL_ADMIN_UAERNAME ?? "";
    const password = process.env.VERCEL_ADMIN_PASSWORD ?? "";
    const data = new TextEncoder().encode(`${username}:${password}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export const loginFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({ username: z.string(), password: z.string() }))
    .handler(async ({ data }) => {
        if (
            data.username !== process.env.VERCEL_ADMIN_UAERNAME ||
            data.password !== process.env.VERCEL_ADMIN_PASSWORD
        ) {
            throw new Error("Invalid credentials");
        }
        return { token: await getExpectedToken() };
    });

export const verifyTokenFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({ token: z.string() }))
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        return { valid: data.token === expected };
    });

export const getPortfolioLinksFn = createServerFn({ method: "GET" }).handler(async () => {
    try {
        // select only primitive fields — Date fields cause serialization issues
        // across TanStack Start's server function boundary in production builds
        return await getDb().portfolioLink.findMany({
            select: {
                id: true,
                url: true,
                platform: true,
                category: true,
                title: true,
                tall: true,
                sortOrder: true,
            },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        });
    } catch {
        return [] as PortfolioItem[];
    }
});

const linkInputSchema = z.object({
    token: z.string(),
    url: z.string().min(1),
    title: z.string().min(1),
    category: z.string().min(1),
    tall: z.boolean().default(false),
    sortOrder: z.number().default(0),
});

export const createPortfolioLinkFn = createServerFn({ method: "POST" })
    .inputValidator(linkInputSchema)
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        if (data.token !== expected) throw new Error("Unauthorized");

        const { token: _token, ...linkData } = data;
        const platform = linkData.url.includes("instagram.com")
            ? "instagram"
            : linkData.url.includes("tiktok.com")
              ? "tiktok"
              : "other";

        const created = await getDb().portfolioLink.create({ data: { ...linkData, platform } });
        // return only primitive fields
        return {
            id: created.id,
            url: created.url,
            platform: created.platform,
            category: created.category,
            title: created.title,
            tall: created.tall,
            sortOrder: created.sortOrder,
        } satisfies PortfolioItem;
    });

export const deletePortfolioLinkFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({ token: z.string(), id: z.string() }))
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        if (data.token !== expected) throw new Error("Unauthorized");
        await getDb().portfolioLink.delete({ where: { id: data.id } });
        return { success: true };
    });
