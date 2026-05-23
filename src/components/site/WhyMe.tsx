import { motion } from "framer-motion";

const reasons = [
    "Authentic storytelling that builds genuine trust.",
    "High-converting short-form content built for the algorithm.",
    "Trend-aware creative direction — early, never late.",
    "Aesthetic visuals with editorial polish.",
    "Warm, relatable on-camera presence.",
    "Fast turnaround without sacrificing craft.",
    "Platform-native — built for TikTok, Reels, and beyond.",
];

export function WhyMe() {
    return (
        <section className="relative py-28 px-6 bg-gradient-hero overflow-hidden">
            <div className="absolute -top-32 right-0 w-[40rem] h-[40rem] rounded-full bg-lavender/30 blur-3xl animate-float" />
            <div className="absolute -bottom-32 -left-20 w-[30rem] h-[30rem] rounded-full bg-rose/30 blur-3xl animate-float-2" />

            <div className="relative mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-mauve mb-4">
                        Why Brands Work With Me
                    </p>
                    <h2 className="font-serif text-4xl sm:text-5xl leading-tight max-w-3xl mx-auto">
                        Premium content,
                        <span className="font-display italic text-gradient">
                            {" "}
                            built to convert.
                        </span>
                    </h2>
                </motion.div>

                <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2 max-w-3xl mx-auto">
                    {reasons.map((r, i) => (
                        <motion.li
                            key={r}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="flex items-start gap-4 py-4 border-b border-foreground/10"
                        >
                            <span className="font-serif italic text-mauve/70 text-sm mt-1">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-foreground/90 leading-relaxed">{r}</span>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
