import { motion } from "framer-motion";
import { Video, Box, Smartphone, Mic, Coffee, Droplets, Brush, Camera } from "lucide-react";

const services = [
    {
        icon: Video,
        title: "UGC Videos",
        text: "Native-feel short-form content tailored to your brand.",
    },
    {
        icon: Box,
        title: "Product Demonstrations",
        text: "Hero-product storytelling that drives clicks.",
    },
    {
        icon: Smartphone,
        title: "TikTok / Reels",
        text: "Trend-aware edits built for platform velocity.",
    },
    {
        icon: Mic,
        title: "Voiceover Videos",
        text: "Warm, on-brand narration with editorial pacing.",
    },
    { icon: Coffee, title: "Lifestyle Content", text: "Aspirational moments that feel lived-in." },
    { icon: Droplets, title: "Skincare Tutorials", text: "Routines that educate while they sell." },
    { icon: Brush, title: "Makeup Features", text: "Application close-ups and finished looks." },
    {
        icon: Camera,
        title: "Brand Photography",
        text: "Editorial stills for campaigns and assets.",
    },
];

export function Services() {
    return (
        <section id="services" className="relative py-28 px-6">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-mauve mb-4">Services</p>
                    <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
                        What I<span className="font-display italic text-gradient"> create.</span>
                    </h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {services.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            className="group relative rounded-3xl p-7 bg-card shadow-card hover:shadow-glow hover:-translate-y-1 transition overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-accent grid place-items-center text-primary-foreground mb-5 group-hover:scale-110 transition-transform">
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {s.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
