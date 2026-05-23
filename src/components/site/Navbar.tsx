import { useEffect, useState } from "react";

const links = [
    { href: "#about", label: "About" },
    { href: "#stats", label: "Stats" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#brands", label: "Brands" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
                scrolled ? "py-3" : "py-6"
            }`}
        >
            <div
                className={`mx-auto max-w-6xl px-6 flex items-center justify-between rounded-full transition-all duration-500 ${
                    scrolled ? "glass shadow-card py-3 px-6" : ""
                }`}
            >
                <a href="#top" className="font-serif text-xl tracking-tight">
                    Rafiya<span className="text-gradient italic"> Syed</span>
                </a>
                <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
                <a
                    href="#contact"
                    className="hidden md:inline-flex items-center rounded-full bg-foreground text-background text-sm px-5 py-2.5 hover:opacity-90 transition"
                >
                    Collaborate
                </a>
            </div>
        </header>
    );
}
