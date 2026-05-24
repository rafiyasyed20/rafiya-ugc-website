import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, LogOut, Eye, EyeOff, Shield } from "lucide-react";
import {
    loginFn,
    verifyTokenFn,
    getPortfolioLinksFn,
    createPortfolioLinkFn,
    deletePortfolioLinkFn,
} from "@/lib/admin-fns";
import type { PortfolioLink } from "@prisma/client";

const CATEGORIES = [
    "Makeup",
    "Skincare",
    "Lifestyle",
    "Product Demo",
    "Voiceover",
    "B-Roll",
];

const TOKEN_KEY = "admin_token";

export const Route = createFileRoute("/admin")({
    component: AdminPage,
});

function AdminPage() {
    const [token, setToken] = useState<string | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(TOKEN_KEY);
        if (!stored) {
            setChecking(false);
            return;
        }
        verifyTokenFn({ data: { token: stored } })
            .then(({ valid }) => {
                if (valid) setToken(stored);
                else localStorage.removeItem(TOKEN_KEY);
            })
            .catch(() => localStorage.removeItem(TOKEN_KEY))
            .finally(() => setChecking(false));
    }, []);

    const handleLogin = (t: string) => {
        localStorage.setItem(TOKEN_KEY, t);
        setToken(t);
    };

    const handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
        );
    }

    if (!token) return <LoginForm onLogin={handleLogin} />;

    return <Dashboard token={token} onLogout={handleLogout} />;
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { token } = await loginFn({ data: { username, password } });
            onLogin(token);
        } catch {
            setError("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-foreground/5 border border-foreground/10 items-center justify-center mb-4">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-semibold">Admin Portal</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sign in to manage portfolio content
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full px-3 py-2 pr-10 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
    const [links, setLinks] = useState<PortfolioLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");

    const [form, setForm] = useState({
        url: "",
        title: "",
        category: CATEGORIES[0],
        tall: false,
        sortOrder: 0,
    });

    const fetchLinks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPortfolioLinksFn();
            setLinks(data as PortfolioLink[]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const detectPlatform = (url: string) => {
        if (url.includes("instagram.com")) return "instagram";
        if (url.includes("tiktok.com")) return "tiktok";
        return "other";
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await createPortfolioLinkFn({ data: { ...form, token } });
            setForm({ url: "", title: "", category: CATEGORIES[0], tall: false, sortOrder: 0 });
            await fetchLinks();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add link");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this link?")) return;
        try {
            await deletePortfolioLinkFn({ data: { token, id } });
            setLinks((prev) => prev.filter((l) => l.id !== id));
        } catch {
            alert("Failed to delete");
        }
    };

    const filtered = filter === "All" ? links : links.filter((l) => l.category === filter);
    const allCategories = ["All", ...Array.from(new Set(links.map((l) => l.category)))];

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="font-semibold">Admin Dashboard</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {links.length} portfolio link{links.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </button>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                        Add Portfolio Link
                    </h2>
                    <form
                        onSubmit={handleAdd}
                        className="rounded-2xl border border-border p-5 space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2 space-y-1">
                                <label className="text-sm font-medium">URL</label>
                                <input
                                    type="url"
                                    placeholder="https://www.instagram.com/p/..."
                                    value={form.url}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, url: e.target.value }))
                                    }
                                    required
                                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                />
                                {form.url && (
                                    <p className="text-xs text-muted-foreground">
                                        Platform:{" "}
                                        <span className="font-medium">
                                            {detectPlatform(form.url)}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    placeholder="Glow Routine Edit"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, title: e.target.value }))
                                    }
                                    required
                                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, category: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium">Sort Order</label>
                                <input
                                    type="number"
                                    value={form.sortOrder}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            sortOrder: parseInt(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={form.tall}
                                    onClick={() => setForm((f) => ({ ...f, tall: !f.tall }))}
                                    className={`relative w-10 h-6 rounded-full transition-colors ${form.tall ? "bg-foreground" : "bg-input"}`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.tall ? "translate-x-4" : ""}`}
                                    />
                                </button>
                                <label className="text-sm">
                                    Tall card{" "}
                                    <span className="text-muted-foreground">(3:4 ratio)</span>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            {submitting ? "Adding…" : "Add link"}
                        </button>
                    </form>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Portfolio Links
                        </h2>
                        <div className="flex gap-2 flex-wrap justify-end">
                            {allCategories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setFilter(c)}
                                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                                        filter === c
                                            ? "bg-foreground text-background"
                                            : "border border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                            No links yet. Add your first portfolio link above.
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {filtered.map((link) => (
                                <li
                                    key={link.id}
                                    className="flex items-start gap-3 rounded-2xl border border-border p-4"
                                >
                                    <PlatformBadge platform={link.platform} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-sm">{link.title}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-foreground/5 text-xs">
                                                {link.category}
                                            </span>
                                            {link.tall && (
                                                <span className="px-2 py-0.5 rounded-full bg-foreground/5 text-xs text-muted-foreground">
                                                    tall
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted-foreground hover:text-foreground truncate block mt-0.5 max-w-xs"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                                        aria-label="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}

function PlatformBadge({ platform }: { platform: string }) {
    if (platform === "instagram") {
        return (
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center">
                <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            </span>
        );
    }
    if (platform === "tiktok") {
        return (
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.75a4.85 4.85 0 01-1.02-.06z" />
                </svg>
            </span>
        );
    }
    return (
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center text-xs font-medium">
            ?
        </span>
    );
}
