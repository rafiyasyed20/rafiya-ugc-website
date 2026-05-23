export function Footer() {
    return (
        <footer className="py-10 px-6 border-t border-border/40">
            <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
                <p className="font-serif text-base">
                    Rafiya<span className="text-gradient italic"> Syed</span>
                </p>
                <p>© {new Date().getFullYear()} — Crafted in Toronto, Canada.</p>
            </div>
        </footer>
    );
}
