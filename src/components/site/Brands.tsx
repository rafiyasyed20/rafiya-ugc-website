import { motion } from "framer-motion";

const brandNames = [
    "GLOSSIÈRE",
    "Maison Rouge",
    "Petal & Co.",
    "Lumière",
    "Soft Studio",
    "Aura Beauty",
    "Velvet Co.",
    "Bloom Lab",
    "Saint Rose",
    "Maeve",
];

const testimonials = [
    {
        quote: "Rafiya created content that felt natural, premium, and highly engaging for our audience. The kind of UGC that converts.",
        name: "Olivia M.",
        role: "Brand Manager, Lumière",
    },
    {
        quote: "Stunning visuals, a thoughtful voice, and the fastest turnaround we've worked with. We rebooked the same week.",
        name: "Priya K.",
        role: "Founder, Petal & Co.",
    },
    {
        quote: "Her edits feel editorial yet feed-native — exactly the bridge our launch needed. Truly a dream collaborator.",
        name: "Hannah W.",
        role: "Marketing Lead, Aura Beauty",
    },
];

export function Brands() {
    return (
        <section id="brands" className="relative py-28 bg-gradient-soft overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 max-w-2xl mx-auto"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-mauve mb-4">Trusted By</p>
                    <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
                        Brands I've
                        <span className="font-display italic text-gradient"> created for.</span>
                    </h2>
                </motion.div>
            </div>

            <div className="relative w-full overflow-hidden mask-marquee">
                <div className="flex w-max animate-marquee">
                    {[...brandNames, ...brandNames].map((name, i) => (
                        <div
                            key={i}
                            className="px-10 py-6 font-serif text-2xl text-mauve/70 tracking-wide whitespace-nowrap"
                        >
                            {name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 mt-20 grid md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                    <motion.figure
                        key={t.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="glass rounded-3xl p-8 shadow-card flex flex-col"
                    >
                        <span className="font-serif text-5xl text-gradient leading-none">"</span>
                        <blockquote className="text-foreground/80 leading-relaxed mt-2 flex-1">
                            {t.quote}
                        </blockquote>
                        <figcaption className="mt-6 pt-6 border-t border-border/50">
                            <p className="font-serif text-lg">{t.name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                                {t.role}
                            </p>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </section>
    );
}
