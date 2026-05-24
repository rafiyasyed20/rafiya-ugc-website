import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import portrait from "@/assets/rafiya-hero.png";

export function Hero() {
    return (
        <section
            id="top"
            className="relative min-h-screen overflow-hidden bg-gradient-hero pt-32 pb-20"
        >
            {/* floating blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-[28rem] h-[28rem] rounded-full bg-rose/40 blur-3xl animate-float" />
                <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-lavender/50 blur-3xl animate-float-2" />
                <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full bg-peach/50 blur-3xl animate-float" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center">
                <motion.div
                    className="lg:col-span-7 space-y-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs tracking-[0.2em] uppercase text-mauve">
                        <Sparkles className="w-3.5 h-3.5" />
                        UGC Creator · Beauty & Lifestyle
                    </div>

                    <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">
                        Creating beauty content that brands actually
                        <span className="font-display italic text-gradient"> remember.</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                        I'm Rafiya — a Toronto-based UGC creator crafting aesthetic, high-converting
                        short-form content for beauty, skincare and lifestyle brands ready to stop
                        the scroll.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <a
                            href="#portfolio"
                            className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm hover:opacity-90 transition"
                        >
                            View Portfolio
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm shadow-card hover:shadow-soft transition"
                        >
                            Let's Collaborate
                        </a>
                    </div>

                    <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Toronto, Canada
                        </span>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline">Makeup · Skincare · Lifestyle</span>
                    </div>
                </motion.div>

                <motion.div
                    className="lg:col-span-5 relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-glow">
                        <img
                            src={portrait}
                            alt="Portrait of Rafiya Syed, UGC creator in Toronto"
                            width={1024}
                            height={1280}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-rose/20 via-transparent to-transparent" />
                    </div>
                    <div className="absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-4 shadow-card">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            Available for
                        </p>
                        <p className="font-serif text-lg">Brand Collaborations</p>
                    </div>
                    <div className="absolute -top-4 -right-4 glass rounded-full w-20 h-20 grid place-items-center shadow-card">
                        <div className="text-center">
                            <p className="font-serif text-xl leading-none">90+</p>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                Brands
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>Scroll</span>
                <div className="w-px h-10 bg-foreground/30 animate-scroll-hint" />
            </div>
        </section>
    );
}
