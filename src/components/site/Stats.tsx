import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";

const stats = [
    { value: 84, suffix: "K", label: "Instagram Followers" },
    { value: 120, suffix: "K", label: "TikTok Followers" },
    { value: 7.8, suffix: "%", label: "Engagement Rate", decimals: 1 },
    { value: 2.4, suffix: "M", label: "Monthly Reach", decimals: 1 },
    { value: 65, suffix: "K", label: "Avg. Views" },
    { value: 90, suffix: "+", label: "Brand Collabs" },
];

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => v.toFixed(decimals));

    useEffect(() => {
        if (inView) {
            const controls = animate(count, to, { duration: 1.8, ease: "easeOut" });
            return controls.stop;
        }
    }, [inView, to, count]);

    useEffect(
        () =>
            rounded.on("change", (v) => {
                if (ref.current) ref.current.textContent = v;
            }),
        [rounded],
    );

    return <span ref={ref}>0</span>;
}

export function Stats() {
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
                            key={s.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="glass rounded-3xl p-8 text-center shadow-card hover:shadow-soft hover:-translate-y-1 transition"
                        >
                            <p className="font-serif text-5xl sm:text-6xl text-gradient">
                                <Counter to={s.value} decimals={s.decimals ?? 0} />
                                {s.suffix}
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
