import { motion } from "framer-motion";
import { Heart, Camera, Sparkles } from "lucide-react";

const cards = [
    { icon: Camera, title: "Editorial Eye", text: "Composed, intentional, and on-brand visuals." },
    { icon: Heart, title: "Authentic Voice", text: "Relatable storytelling that builds trust." },
    { icon: Sparkles, title: "Trend Aware", text: "Native to TikTok and Reels formats." },
];

export function About() {
    return (
        <section id="about" className="relative py-28 px-6">
            <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-mauve mb-6">About</p>
                    <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
                        Hi, I'm Rafiya —<br />
                        <span className="font-display italic text-gradient">
                            a storyteller in soft focus.
                        </span>
                    </h2>
                    <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                        A Toronto-based UGC creator focused on beauty, skincare, and lifestyle
                        storytelling. I create aesthetic, relatable, and engaging short-form content
                        designed to help brands build trust and connect with modern audiences.
                    </p>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Every piece is crafted with editorial care - color, composition, and cadence
                        working together to feel native to the feed and impossible to scroll past.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-8">
                    {cards.map((c, i) => (
                        <motion.div
                            key={c.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className={`glass rounded-3xl p-7 shadow-card hover:shadow-soft transition ${
                                i === 0 ? "sm:translate-y-3" : ""
                            } ${i === 2 ? "sm:col-span-2" : ""}`}
                        >
                            <div className="w-11 h-11 rounded-2xl bg-gradient-accent grid place-items-center text-primary-foreground mb-4">
                                <c.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-xl mb-1.5">{c.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {c.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
