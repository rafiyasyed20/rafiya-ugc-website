import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Play, X } from "lucide-react";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";
import p5 from "@/assets/portfolio-5.jpg";
import p6 from "@/assets/portfolio-6.jpg";

const filters = ["All", "Makeup", "Skincare", "Lifestyle", "Product Demo", "Voiceover", "B-Roll"];

const items = [
    { img: p1, title: "Glow Routine Edit", category: "Skincare", tall: true },
    { img: p2, title: "Lip Story", category: "Makeup" },
    { img: p3, title: "Morning Ritual", category: "Skincare" },
    { img: p4, title: "Lavender Notes", category: "Lifestyle", tall: true },
    { img: p5, title: "Soft Saturdays", category: "B-Roll" },
    { img: p6, title: "Bold Edit", category: "Makeup" },
    { img: p1, title: "Hydration POV", category: "Product Demo" },
    { img: p3, title: "Self-Care Voiceover", category: "Voiceover", tall: true },
];

export function Portfolio() {
    const [active, setActive] = useState("All");
    const [lightbox, setLightbox] = useState<number | null>(null);

    const filtered = active === "All" ? items : items.filter((i) => i.category === active);

    return (
        <section id="portfolio" className="relative py-28 px-6">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 max-w-2xl mx-auto"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-mauve mb-4">Portfolio</p>
                    <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
                        Selected<span className="font-display italic text-gradient"> work.</span>
                    </h2>
                    <p className="text-muted-foreground mt-5">
                        A curated edit of recent UGC, brand deliverables, and aesthetic b-roll.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActive(f)}
                            className={`px-5 py-2 rounded-full text-sm transition-all ${
                                active === f
                                    ? "bg-foreground text-background shadow-card"
                                    : "glass text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                    <AnimatePresence>
                        {filtered.map((item, i) => (
                            <motion.div
                                layout
                                key={`${item.title}-${i}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: i * 0.04 }}
                                onClick={() => setLightbox(i)}
                                className={`group relative break-inside-avoid rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-glow transition ${
                                    item.tall ? "aspect-[3/4]" : "aspect-square"
                                }`}
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 text-background">
                                    <p className="text-xs uppercase tracking-widest opacity-80">
                                        {item.category}
                                    </p>
                                    <p className="font-serif text-xl mt-1">{item.title}</p>
                                </div>
                                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass grid place-items-center opacity-0 group-hover:opacity-100 transition">
                                    <Play className="w-4 h-4 fill-current" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            <AnimatePresence>
                {lightbox !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        className="fixed inset-0 z-[60] bg-foreground/80 backdrop-blur-md grid place-items-center p-6 cursor-pointer"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={filtered[lightbox].img}
                            alt={filtered[lightbox].title}
                            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-glow"
                        />
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute top-6 right-6 w-11 h-11 rounded-full glass grid place-items-center"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
