import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import { getPortfolioLinksFn, type PortfolioItem } from "@/lib/admin-fns";

const filters = ["All", "Makeup", "Skincare", "Lifestyle", "Product Demo", "Voiceover", "B-Roll"];

export function Portfolio() {
    const [active, setActive] = useState("All");
    const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
    const [links, setLinks] = useState<PortfolioItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getPortfolioLinksFn()
            .then((data: PortfolioItem[]) => setLinks(Array.isArray(data) ? data : []))
            .catch(() => setLinks([]))
            .finally(() => setLoaded(true));
    }, []);

    const filtered = active === "All" ? links : links.filter((l) => l.category === active);

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

                {!loaded ? (
                    <div className="flex justify-center py-20">
                        <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-sm">No portfolio items yet.</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
                    >
                        <AnimatePresence>
                            {filtered.map((item, i) => (
                                <PortfolioCard
                                    key={item.id}
                                    item={item}
                                    index={i}
                                    onClick={() => setLightbox(item)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {lightbox && <ViewModal link={lightbox} onClose={() => setLightbox(null)} />}
            </AnimatePresence>
        </section>
    );
}

function PortfolioCard({
    item,
    index,
    onClick,
}: {
    item: PortfolioItem;
    index: number;
    onClick: () => void;
}) {
    const isInstagram = item.platform === "instagram";
    const isTikTok = item.platform === "tiktok";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            onClick={onClick}
            className={`group relative break-inside-avoid rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-glow transition ${
                item.tall ? "aspect-[3/4]" : "aspect-square"
            } ${
                isInstagram
                    ? "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
                    : isTikTok
                      ? "bg-gradient-to-br from-[#010101] via-[#1a1a2e] to-[#16213e]"
                      : "bg-gradient-to-br from-foreground/10 to-foreground/5"
            }`}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                {isInstagram && <InstagramIcon className="w-10 h-10 fill-white/80 mb-4" />}
                {isTikTok && <TikTokIcon className="w-10 h-10 mb-4" />}
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">{item.category}</p>
                <p className="font-serif text-lg text-center leading-snug">{item.title}</p>
            </div>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end justify-center pb-6">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {isTikTok ? "Watch video" : "View post"}
                </span>
            </div>
        </motion.div>
    );
}

function ViewModal({ link, onClose }: { link: PortfolioItem; onClose: () => void }) {
    const isTikTok = link.platform === "tiktok";
    const isInstagram = link.platform === "instagram";
    const tiktokVideoId = link.url.match(/\/video\/(\d+)/)?.[1];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-foreground/80 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="cursor-default"
            >
                {/* TikTok: actual iframe embed works fine */}
                {isTikTok && tiktokVideoId && (
                    <iframe
                        src={`https://www.tiktok.com/embed/v2/${tiktokVideoId}`}
                        width="325"
                        height="740"
                        allow="encrypted-media"
                        allowFullScreen
                        className="border-0 rounded-2xl"
                        title={link.title}
                    />
                )}

                {/* Instagram: standard blockquote embed — works on production, console errors on localhost only */}
                {isInstagram && <InstagramEmbed url={link.url} />}

                {/* Fallback for "other" platform */}
                {!isInstagram && !isTikTok && (
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full glass text-white text-sm font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View content
                    </a>
                )}

                {/* TikTok fallback if no video ID */}
                {isTikTok && !tiktokVideoId && (
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full glass text-white text-sm font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View on TikTok
                    </a>
                )}
            </motion.div>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-11 h-11 rounded-full glass grid place-items-center"
                aria-label="Close"
            >
                <X className="w-5 h-5" />
            </button>
        </motion.div>
    );
}

function InstagramEmbed({ url }: { url: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        // Set innerHTML to bypass React's vdom — embed.js rewrites this into an iframe
        container.innerHTML = `<blockquote
            class="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink="${url}?utm_source=ig_embed&utm_campaign=loading"
            data-instgrm-version="14"
            style="background:#FFF;border:0;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);margin:1px;max-width:540px;min-width:326px;padding:0;width:99.375%;">
        </blockquote>`;

        const w = window as Window & { instgrm?: { Embeds: { process: () => void } } };
        if (w.instgrm) {
            w.instgrm.Embeds.process();
        } else {
            document.getElementById("ig-embed-js")?.remove();
            const script = document.createElement("script");
            script.id = "ig-embed-js";
            script.src = "//www.instagram.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
        }

        return () => {
            if (ref.current) ref.current.innerHTML = "";
        };
    }, [url]);

    return <div ref={ref} className="max-w-135" />;
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    );
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.75a4.85 4.85 0 01-1.02-.06z"
                fill="#69C9D0"
            />
            <path
                d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.75a4.85 4.85 0 01-1.02-.06z"
                fill="#EE1D52"
                style={{ mixBlendMode: "multiply" }}
            />
        </svg>
    );
}
