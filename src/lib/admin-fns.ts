import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDb } from "./db";

// Serialization-safe types: no Date fields, only JSON primitives
export type PortfolioItem = {
    id: string;
    url: string;
    platform: string;
    category: string;
    categoryId: string | null;
    title: string;
    tall: boolean;
    sortOrder: number;
};

export type CategoryItem = {
    id: string;
    name: string;
    sortOrder: number;
};

async function getExpectedToken(): Promise<string> {
    const username = process.env.ADMIN_USERNAME ?? "";
    const password = process.env.ADMIN_PASSWORD ?? "";
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
            data.username !== process.env.ADMIN_USERNAME ||
            data.password !== process.env.ADMIN_PASSWORD
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
        return await getDb().portfolioLink.findMany({
            select: {
                id: true,
                url: true,
                platform: true,
                category: true,
                categoryId: true,
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
    categoryId: z.string().min(1),
    tall: z.boolean().default(false),
    sortOrder: z.number().default(0),
});

export const createPortfolioLinkFn = createServerFn({ method: "POST" })
    .inputValidator(linkInputSchema)
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        if (data.token !== expected) throw new Error("Unauthorized");

        const { token: _token, categoryId, ...rest } = data;

        const cat = await getDb().category.findUnique({
            where: { id: categoryId },
            select: { name: true },
        });
        if (!cat) throw new Error("Category not found");

        const platform = rest.url.includes("instagram.com")
            ? "instagram"
            : rest.url.includes("tiktok.com")
              ? "tiktok"
              : "other";

        return await getDb().portfolioLink.create({
            data: { ...rest, platform, category: cat.name, categoryId },
            select: {
                id: true,
                url: true,
                platform: true,
                category: true,
                categoryId: true,
                title: true,
                tall: true,
                sortOrder: true,
            },
        });
    });

export const deletePortfolioLinkFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({ token: z.string(), id: z.string() }))
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        if (data.token !== expected) throw new Error("Unauthorized");
        await getDb().portfolioLink.delete({ where: { id: data.id } });
        return { success: true };
    });

export const getCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
    try {
        return await getDb().category.findMany({
            select: { id: true, name: true, sortOrder: true },
            orderBy: { sortOrder: "asc" },
        });
    } catch {
        return [] as CategoryItem[];
    }
});

export const createCategoryFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({ token: z.string(), name: z.string().min(1) }))
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        if (data.token !== expected) throw new Error("Unauthorized");

        const existing = await getDb().category.findUnique({ where: { name: data.name } });
        if (existing) throw new Error("A category with that name already exists");

        const count = await getDb().category.count();
        return await getDb().category.create({
            data: { name: data.name, sortOrder: count * 10 },
            select: { id: true, name: true, sortOrder: true },
        });
    });

export const deleteCategoryFn = createServerFn({ method: "POST" })
    .inputValidator(z.object({ token: z.string(), id: z.string() }))
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        if (data.token !== expected) throw new Error("Unauthorized");

        const category = await getDb().category.findUnique({ where: { id: data.id } });
        if (!category) throw new Error("Category not found");

        // Use the FK column for an accurate count
        const postCount = await getDb().portfolioLink.count({
            where: { categoryId: data.id },
        });
        if (postCount > 0) {
            throw new Error(
                `Remove the ${postCount} post${postCount !== 1 ? "s" : ""} in "${category.name}" first`
            );
        }

        await getDb().category.delete({ where: { id: data.id } });
        return { success: true };
    });

export const reorderPortfolioLinksFn = createServerFn({ method: "POST" })
    .inputValidator(
        z.object({
            token: z.string(),
            items: z.array(z.object({ id: z.string(), sortOrder: z.number() })),
        })
    )
    .handler(async ({ data }) => {
        const expected = await getExpectedToken();
        if (data.token !== expected) throw new Error("Unauthorized");
        const db = getDb();
        await db.$transaction(
            data.items.map(({ id, sortOrder }) =>
                db.portfolioLink.update({ where: { id }, data: { sortOrder } })
            )
        );
        return { success: true };
    });
