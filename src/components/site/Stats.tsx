import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { getStatsFn, type StatItem } from "@/lib/admin-fns";

const DEFAULT_STATS: StatItem[] = [
    { id: "d1", label: "Instagram Followers", value: "4,300", sortOrder: 0 },
    { id: "d2", label: "TikTok Followers", value: "2,000", sortOrder: 10 },
    { id: "d3", label: "Engagement Rate", value: "70%", sortOrder: 20 },
    { id: "d4", label: "Monthly Reach", value: "1.2M", sortOrder: 30 },
    { id: "d5", label: "Avg. Views", value: "30K", sortOrder: 40 },
    { id: "d6", label: "Brand Collabs", value: "90+", sortOrder: 50 },
];

export function Stats() {
    const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);

    useEffect(() => {
        getStatsFn()
            .then((data) => {
                const items = data as StatItem[];
                if (items.length > 0) setStats(items);
            })
            .catch(() => {});
    }, []);

    return (
        <section id="stats" className="relative py-28 px-6 bg-gradient-soft">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-mauve mb-4">
                        By the Numbers
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
                        Reach that
                        <span className="font-display italic text-gradient"> resonates.</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="glass rounded-3xl p-8 text-center shadow-card hover:shadow-soft hover:-translate-y-1 transition"
                        >
                            <p className="font-serif text-5xl sm:text-6xl text-gradient">
                                {s.value}
                            </p>
                            <p className="text-sm text-muted-foreground mt-3 uppercase tracking-wider">
                                {s.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-14 flex items-center justify-center gap-4">
                    <a
                        href="https://instagram.com/rafiyasyed"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-3 glass rounded-full px-6 py-3 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition"
                    >
                        <Instagram className="w-4 h-4" />
                        <span className="text-sm">@rafiyasyed</span>
                    </a>
                    <a
                        href="https://tiktok.com/@rafiyaww"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-3 glass rounded-full px-6 py-3 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.89a4.85 4.85 0 0 1-1.84-.2Z" />
                        </svg>
                        <span className="text-sm">@rafiyaww</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
