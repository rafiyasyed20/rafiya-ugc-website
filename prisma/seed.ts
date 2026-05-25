import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const INITIAL_CATEGORIES = [
    "Makeup",
    "Skincare",
    "Lifestyle",
    "Product Demo",
    "Voiceover",
    "B-Roll",
];

const INITIAL_STATS = [
    { label: "Instagram Followers", value: "4,300" },
    { label: "TikTok Followers", value: "2,000" },
    { label: "Engagement Rate", value: "70%" },
    { label: "Monthly Reach", value: "1.2M" },
    { label: "Avg. Views", value: "30K" },
    { label: "Brand Collabs", value: "90+" },
];

async function main() {
    console.log("Seeding categories…");
    for (const [i, name] of INITIAL_CATEGORIES.entries()) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name, sortOrder: i * 10 },
        });
    }
    console.log(`Done — seeded ${INITIAL_CATEGORIES.length} categories.`);

    console.log("Seeding stats…");
    const existingStatCount = await prisma.stat.count();
    if (existingStatCount === 0) {
        for (const [i, stat] of INITIAL_STATS.entries()) {
            await prisma.stat.create({ data: { ...stat, sortOrder: i * 10 } });
        }
        console.log(`Done — seeded ${INITIAL_STATS.length} stats.`);
    } else {
        console.log(`Skipped — ${existingStatCount} stats already exist.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
