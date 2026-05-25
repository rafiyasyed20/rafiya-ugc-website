import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import { getPortfolioLinksFn, getCategoriesFn, type PortfolioItem } from "@/lib/admin-fns";

// Module-level state so embed.js is only fetched once per page load
let igScriptState: "idle" | "loading" | "loaded" = "idle";
const igScriptCallbacks: (() => void)[] = [];

function ensureInstagramEmbedJs(onReady: () => void) {
    const w = window as Window & { instgrm?: { Embeds: { process: () => void } } };
    if (w.instgrm) {
        onReady();
        return;
    }
    igScriptCallbacks.push(onReady);
    if (igScriptState !== "idle") return;
    igScriptState = "loading";

    const existing = document.getElementById("ig-embed-js");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "ig-embed-js";
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => {
        igScriptState = "loaded";
        const pending = igScriptCallbacks.splice(0);
        pending.forEach((cb) => cb());
    };
    document.body.appendChild(script);
}

export function Portfolio() {
    const [active, setActive] = useState("All");
    const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
    const [links, setLinks] = useState<PortfolioItem[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [categoryNames, setCategoryNames] = useState<string[]>([]);

    useEffect(() => {
        getPortfolioLinksFn()
            .then((data: PortfolioItem[]) => setLinks(Array.isArray(data) ? data : []))
            .catch(() => setLinks([]))
            .finally(() => setLoaded(true));

        getCategoriesFn()
            .then((data) => setCategoryNames((data as { name: string }[]).map((c) => c.name)))
            .catch(() => setCategoryNames([]));
    }, []);

    const filters = ["All", ...categoryNames];

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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start"
                    >
                        <AnimatePresence>
                            {filtered.map((item, i) =>
                                item.platform === "instagram" ? (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.04 }}
                                        className="break-inside-avoid"
                                    >
                                        <InstagramEmbed url={item.url} />
                                    </motion.div>
                                ) : (
                                    <PortfolioCard
                                        key={item.id}
                                        item={item}
                                        index={i}
                                        onClick={() => setLightbox(item)}
                                    />
                                )
                            )}
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
                isTikTok
                    ? "bg-gradient-to-br from-[#010101] via-[#1a1a2e] to-[#16213e]"
                    : "bg-gradient-to-br from-foreground/10 to-foreground/5"
            }`}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                {isTikTok && <TikTokIcon className="w-10 h-10 mb-4" />}
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">{item.category}</p>
                <p className="font-serif text-lg text-center leading-snug">{item.title}</p>
            </div>

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end justify-center pb-6">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {isTikTok ? "Watch video" : "View content"}
                </span>
            </div>
        </motion.div>
    );
}

function ViewModal({ link, onClose }: { link: PortfolioItem; onClose: () => void }) {
    const isTikTok = link.platform === "tiktok";
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

                {!isTikTok && (
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

function instagramCanonicalUrl(raw: string): string {
    // /reel/SHORTCODE/ URLs must stay as reels — Instagram's embed.js uses the path
    // to decide whether to render an inline video player or a static post embed.
    // Stripping to /p/ would break inline playback and cause stretched thumbnails.
    const reelCode = raw.match(/\/reel\/([A-Za-z0-9_-]+)/)?.[1];
    if (reelCode) return `https://www.instagram.com/reel/${reelCode}/`;

    // Regular posts: strip username prefix so embed.js gets a clean /p/SHORTCODE/ URL
    const postCode = raw.match(/\/p\/([A-Za-z0-9_-]+)/)?.[1];
    return postCode ? `https://www.instagram.com/p/${postCode}/` : raw;
}

// Instagram's profile-header row height varies: ~56 px for photos, ~60 px for reels.
// We hide it via overflow:hidden on a wrapper + a matching negative marginTop on the
// inner element. This is iframe-safe (unlike clipPath which creates a compositing
// layer that distorts video thumbnails). The wrapper naturally shrinks by IG_CLIP_PX
// so no extra margin is needed to reclaim layout space.
const IG_CLIP_PX = 60;

function InstagramEmbed({ url }: { url: string }) {
    const innerRef = useRef<HTMLDivElement>(null);
    const canonical = instagramCanonicalUrl(url);
    const embedHref = `${canonical}?utm_source=ig_embed&amp;utm_campaign=loading`;

    useEffect(() => {
        const inner = innerRef.current;
        if (!inner) return;

        inner.innerHTML = `<blockquote
            class="instagram-media"
            data-instgrm-permalink="${embedHref}"
            data-instgrm-version="14"
            style="background:#FFF;border:0;border-radius:3px;box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15);margin:0;padding:0;width:100%;">
        </blockquote>`;

        ensureInstagramEmbedJs(() => {
            const w = window as Window & { instgrm?: { Embeds: { process: () => void } } };
            w.instgrm?.Embeds.process();
        });

        return () => {
            if (inner) inner.innerHTML = "";
        };
    }, [canonical, embedHref]);

    return (
        <div className="ig-embed-container">
            <div ref={innerRef} style={{ marginTop: `-${IG_CLIP_PX}px` }} />
        </div>
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
