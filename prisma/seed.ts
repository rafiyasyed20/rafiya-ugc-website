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
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
