import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
    Trash2,
    Plus,
    LogOut,
    Eye,
    EyeOff,
    Shield,
    GripVertical,
    LayoutGrid,
    Tag,
    Store,
    BarChart2,
    Pencil,
    Check,
    X,
    type LucideIcon,
} from "lucide-react";
import {
    loginFn,
    verifyTokenFn,
    getPortfolioLinksFn,
    createPortfolioLinkFn,
    deletePortfolioLinkFn,
    reorderPortfolioLinksFn,
    getCategoriesFn,
    createCategoryFn,
    deleteCategoryFn,
    getBrandsFn,
    createBrandFn,
    deleteBrandFn,
    getStatsFn,
    createStatFn,
    updateStatValueFn,
    deleteStatFn,
    type PortfolioItem,
    type CategoryItem,
    type BrandItem,
    type StatItem,
} from "@/lib/admin-fns";

const TOKEN_KEY = "admin_token";
type AdminSection = "portfolio" | "categories" | "brands" | "stats";

export const Route = createFileRoute("/admin")({
    component: AdminPage,
});

// ─── Auth shell ──────────────────────────────────────────────────────────────

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

// ─── Dashboard shell with sidebar ────────────────────────────────────────────

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
    const [section, setSection] = useState<AdminSection>("portfolio");
    const [links, setLinks] = useState<PortfolioItem[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [brands, setBrands] = useState<BrandItem[]>([]);
    const [siteStats, setSiteStats] = useState<StatItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLinks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPortfolioLinksFn();
            setLinks(data as PortfolioItem[]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        const data = await getCategoriesFn();
        setCategories(data as CategoryItem[]);
    }, []);

    const fetchBrands = useCallback(async () => {
        const data = await getBrandsFn();
        setBrands(data as BrandItem[]);
    }, []);

    const fetchStats = useCallback(async () => {
        const data = await getStatsFn();
        setSiteStats(data as StatItem[]);
    }, []);

    useEffect(() => {
        fetchLinks();
        fetchCategories();
        fetchBrands();
        fetchStats();
    }, [fetchLinks, fetchCategories, fetchBrands, fetchStats]);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 border-r border-border flex flex-col h-screen sticky top-0">
                <div className="px-5 py-5 border-b border-border">
                    <p className="font-semibold text-sm">rafiya.</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Content Manager</p>
                </div>

                <nav className="p-3 flex-1 space-y-0.5 overflow-y-auto">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1">
                        Content
                    </p>
                    <NavItem
                        icon={LayoutGrid}
                        label="Portfolio"
                        active={section === "portfolio"}
                        onClick={() => setSection("portfolio")}
                    />
                    <NavItem
                        icon={Tag}
                        label="Categories"
                        active={section === "categories"}
                        onClick={() => setSection("categories")}
                    />
                    <NavItem
                        icon={Store}
                        label="Brands"
                        active={section === "brands"}
                        onClick={() => setSection("brands")}
                    />
                    <NavItem
                        icon={BarChart2}
                        label="Stats"
                        active={section === "stats"}
                        onClick={() => setSection("stats")}
                    />
                </nav>

                <div className="p-3 border-t border-border">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Content area */}
            <main className="flex-1 overflow-y-auto min-h-screen">
                {section === "portfolio" && (
                    <PortfolioSection
                        token={token}
                        links={links}
                        setLinks={setLinks}
                        categories={categories}
                        loading={loading}
                        fetchLinks={fetchLinks}
                    />
                )}
                {section === "categories" && (
                    <CategoriesSection
                        token={token}
                        categories={categories}
                        setCategories={setCategories}
                        links={links}
                        fetchCategories={fetchCategories}
                    />
                )}
                {section === "brands" && (
                    <BrandsSection
                        token={token}
                        brands={brands}
                        setBrands={setBrands}
                        fetchBrands={fetchBrands}
                    />
                )}
                {section === "stats" && (
                    <StatsSection
                        token={token}
                        siteStats={siteStats}
                        setSiteStats={setSiteStats}
                        fetchStats={fetchStats}
                    />
                )}
            </main>
        </div>
    );
}

function NavItem({
    icon: Icon,
    label,
    active,
    onClick,
}: {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            }`}
        >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
        </button>
    );
}

// ─── Portfolio section ────────────────────────────────────────────────────────

function PortfolioSection({
    token,
    links,
    setLinks,
    categories,
    loading,
    fetchLinks,
}: {
    token: string;
    links: PortfolioItem[];
    setLinks: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
    categories: CategoryItem[];
    loading: boolean;
    fetchLinks: () => Promise<void>;
}) {
    const [form, setForm] = useState({
        url: "",
        title: "",
        categoryId: "",
        tall: false,
        sortOrder: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");
    const [dragItem, setDragItem] = useState<{ id: string; category: string } | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    // Seed categoryId once categories load
    useEffect(() => {
        if (categories.length > 0) {
            setForm((f) => (f.categoryId ? f : { ...f, categoryId: categories[0].id }));
        }
    }, [categories]);

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
            setForm((f) => ({ url: "", title: "", categoryId: f.categoryId, tall: false, sortOrder: 0 }));
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

    const handleDragStart = (id: string, category: string) => setDragItem({ id, category });

    const handleDragOver = (e: React.DragEvent, targetId: string, targetCategory: string) => {
        e.preventDefault();
        if (dragItem && dragItem.category === targetCategory && targetId !== dragItem.id) {
            setDragOverId(targetId);
        }
    };

    const handleDrop = async (e: React.DragEvent, targetId: string, targetCategory: string) => {
        e.preventDefault();
        if (!dragItem || dragItem.category !== targetCategory || dragItem.id === targetId) {
            setDragItem(null);
            setDragOverId(null);
            return;
        }

        const categoryLinks = links
            .filter((l) => l.category === dragItem.category)
            .sort((a, b) => a.sortOrder - b.sortOrder);

        const fromIdx = categoryLinks.findIndex((l) => l.id === dragItem.id);
        const toIdx = categoryLinks.findIndex((l) => l.id === targetId);
        const reordered = [...categoryLinks];
        const [moved] = reordered.splice(fromIdx, 1);
        reordered.splice(toIdx, 0, moved);

        const updates = reordered.map((l, i) => ({ id: l.id, sortOrder: i * 10 }));

        setLinks((prev) => {
            const others = prev.filter((l) => l.category !== dragItem.category);
            return [...others, ...reordered.map((l, i) => ({ ...l, sortOrder: i * 10 }))];
        });
        setDragItem(null);
        setDragOverId(null);

        try {
            await reorderPortfolioLinksFn({ data: { token, items: updates } });
        } catch {
            await fetchLinks();
        }
    };

    const handleDragEnd = () => {
        setDragItem(null);
        setDragOverId(null);
    };

    const allFilterNames = ["All", ...categories.map((c) => c.name)];
    const sortedLinks = [...links].sort((a, b) => a.sortOrder - b.sortOrder);
    const filtered =
        filter === "All" ? sortedLinks : sortedLinks.filter((l) => l.category === filter);
    const grouped = filtered.reduce<Record<string, PortfolioItem[]>>((acc, link) => {
        (acc[link.category] ??= []).push(link);
        return acc;
    }, {});
    const categoryOrder = Array.from(new Set(filtered.map((l) => l.category)));

    return (
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
            {/* Page heading */}
            <div>
                <h1 className="font-semibold text-lg">Portfolio</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {links.length} link{links.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Add link form */}
            <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Add Link
                </h2>
                <form onSubmit={handleAdd} className="rounded-2xl border border-border p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1">
                            <label className="text-sm font-medium">URL</label>
                            <input
                                type="url"
                                placeholder="https://www.instagram.com/p/..."
                                value={form.url}
                                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                                required
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                            {form.url && (
                                <p className="text-xs text-muted-foreground">
                                    Platform:{" "}
                                    <span className="font-medium">{detectPlatform(form.url)}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                type="text"
                                placeholder="Glow Routine Edit"
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                required
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={form.categoryId}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, categoryId: e.target.value }))
                                }
                                required
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
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

            {/* Links list */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        All Links
                    </h2>
                    <div className="flex gap-2 flex-wrap justify-end">
                        {allFilterNames.map((name) => (
                            <button
                                key={name}
                                onClick={() => setFilter(name)}
                                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                                    filter === name
                                        ? "bg-foreground text-background"
                                        : "border border-border text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {name}
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
                    <div className="space-y-6">
                        {categoryOrder.map((category) => (
                            <div key={category}>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">
                                    {category}
                                </p>
                                <ul className="space-y-2">
                                    {grouped[category].map((link) => (
                                        <li
                                            key={link.id}
                                            draggable
                                            onDragStart={() =>
                                                handleDragStart(link.id, link.category)
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, link.id, link.category)
                                            }
                                            onDrop={(e) => handleDrop(e, link.id, link.category)}
                                            onDragEnd={handleDragEnd}
                                            className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors select-none ${
                                                dragOverId === link.id
                                                    ? "border-foreground/50 bg-foreground/5"
                                                    : "border-border"
                                            } ${dragItem?.id === link.id ? "opacity-40" : ""}`}
                                        >
                                            <button
                                                type="button"
                                                className="shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                                                aria-label="Drag to reorder"
                                            >
                                                <GripVertical className="w-4 h-4" />
                                            </button>
                                            <PlatformBadge platform={link.platform} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium text-sm">
                                                        {link.title}
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
                                                className="text-muted-foreground hover:text-red-500 transition-colors shrink-0 mt-0.5"
                                                aria-label="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

// ─── Categories section ───────────────────────────────────────────────────────

function CategoriesSection({
    token,
    categories,
    setCategories,
    links,
    fetchCategories,
}: {
    token: string;
    categories: CategoryItem[];
    setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
    links: PortfolioItem[];
    fetchCategories: () => Promise<void>;
}) {
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categorySubmitting, setCategorySubmitting] = useState(false);
    const [rowError, setRowError] = useState<Record<string, string>>({});
    const [addError, setAddError] = useState("");

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newCategoryName.trim();
        if (!name) return;
        setCategorySubmitting(true);
        setAddError("");
        try {
            const created = await createCategoryFn({ data: { token, name } });
            setCategories((prev) => [...prev, created as CategoryItem]);
            setNewCategoryName("");
        } catch (err) {
            setAddError(err instanceof Error ? err.message : "Failed to add category");
        } finally {
            setCategorySubmitting(false);
        }
    };

    const handleDelete = async (cat: CategoryItem) => {
        // Client-side guard — use categoryId FK if available, fall back to name
        const postCount = links.filter(
            (l) => (l.categoryId ? l.categoryId === cat.id : l.category === cat.name)
        ).length;

        if (postCount > 0) {
            setRowError({
                [cat.id]: `Remove the ${postCount} post${postCount !== 1 ? "s" : ""} in "${cat.name}" first`,
            });
            return;
        }
        setRowError({});
        try {
            await deleteCategoryFn({ data: { token, id: cat.id } });
            setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        } catch (err) {
            setRowError({
                [cat.id]: err instanceof Error ? err.message : "Failed to delete",
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            {/* Page heading */}
            <div>
                <h1 className="font-semibold text-lg">Categories</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
                </p>
            </div>

            <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Manage Categories
                </h2>

                <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
                    {categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No categories yet. Add one below.
                        </p>
                    ) : (
                        categories.map((cat) => {
                            const count = links.filter(
                                (l) =>
                                    l.categoryId ? l.categoryId === cat.id : l.category === cat.name
                            ).length;
                            return (
                                <div key={cat.id}>
                                    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                                        <span className="text-sm font-medium">{cat.name}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-muted-foreground tabular-nums">
                                                {count} post{count !== 1 ? "s" : ""}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(cat)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                                aria-label={`Delete ${cat.name}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {rowError[cat.id] && (
                                        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-5 py-2 border-t border-red-100 dark:border-red-950/30">
                                            {rowError[cat.id]}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Add form */}
                <form onSubmit={handleAdd} className="flex gap-2 mt-4">
                    <input
                        type="text"
                        placeholder="New category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    />
                    <button
                        type="submit"
                        disabled={categorySubmitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        {categorySubmitting ? "Adding…" : "Add"}
                    </button>
                </form>
                {addError && (
                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg mt-2">
                        {addError}
                    </p>
                )}
            </section>
        </div>
    );
}

// ─── Brands section ──────────────────────────────────────────────────────────

function BrandsSection({
    token,
    brands,
    setBrands,
    fetchBrands,
}: {
    token: string;
    brands: BrandItem[];
    setBrands: React.Dispatch<React.SetStateAction<BrandItem[]>>;
    fetchBrands: () => Promise<void>;
}) {
    const [form, setForm] = useState({ name: "", logoUrl: "", sortOrder: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [addError, setAddError] = useState("");
    const [rowError, setRowError] = useState<Record<string, string>>({});

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = form.name.trim();
        if (!name) return;
        setSubmitting(true);
        setAddError("");
        try {
            const created = await createBrandFn({
                data: { token, name, logoUrl: form.logoUrl.trim() || "", sortOrder: form.sortOrder },
            });
            setBrands((prev) => [...prev, created as BrandItem]);
            setForm({ name: "", logoUrl: "", sortOrder: 0 });
        } catch (err) {
            setAddError(err instanceof Error ? err.message : "Failed to add brand");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (brand: BrandItem) => {
        if (!confirm(`Delete "${brand.name}"?`)) return;
        setRowError({});
        try {
            await deleteBrandFn({ data: { token, id: brand.id } });
            setBrands((prev) => prev.filter((b) => b.id !== brand.id));
        } catch (err) {
            setRowError({ [brand.id]: err instanceof Error ? err.message : "Failed to delete" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            <div>
                <h1 className="font-semibold text-lg">Brands</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {brands.length} brand{brands.length !== 1 ? "s" : ""}
                </p>
            </div>

            <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Manage Brands
                </h2>

                <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
                    {brands.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No brands yet. Add one below.
                        </p>
                    ) : (
                        brands.map((brand) => (
                            <div key={brand.id}>
                                <div className="flex items-center gap-4 px-5 py-3.5">
                                    {brand.logoUrl ? (
                                        <img
                                            src={brand.logoUrl}
                                            alt={brand.name}
                                            className="w-8 h-8 object-contain rounded"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center text-xs text-muted-foreground font-medium">
                                            {brand.name.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium flex-1">{brand.name}</span>
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        order {brand.sortOrder}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(brand)}
                                        className="text-muted-foreground hover:text-red-500 transition-colors"
                                        aria-label={`Delete ${brand.name}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {rowError[brand.id] && (
                                    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-5 py-2 border-t border-red-100 dark:border-red-950/30">
                                        {rowError[brand.id]}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleAdd} className="mt-4 rounded-2xl border border-border p-5 space-y-4">
                    <h3 className="text-sm font-medium">Add Brand</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Brand Name</label>
                            <input
                                type="text"
                                placeholder="Aura Beauty"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                required
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                Logo URL{" "}
                                <span className="text-muted-foreground font-normal">(optional)</span>
                            </label>
                            <input
                                type="url"
                                placeholder="https://example.com/logo.png"
                                value={form.logoUrl}
                                onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Sort Order</label>
                            <input
                                type="number"
                                value={form.sortOrder}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))
                                }
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                        </div>
                    </div>
                    {addError && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                            {addError}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {submitting ? "Adding…" : "Add brand"}
                    </button>
                </form>
            </section>
        </div>
    );
}

// ─── Stats section ────────────────────────────────────────────────────────────

function StatsSection({
    token,
    siteStats,
    setSiteStats,
    fetchStats: _fetchStats,
}: {
    token: string;
    siteStats: StatItem[];
    setSiteStats: React.Dispatch<React.SetStateAction<StatItem[]>>;
    fetchStats: () => Promise<void>;
}) {
    const [form, setForm] = useState({ label: "", value: "", sortOrder: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [addError, setAddError] = useState("");
    const [rowError, setRowError] = useState<Record<string, string>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [saving, setSaving] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const label = form.label.trim();
        const value = form.value.trim();
        if (!label || !value) return;
        setSubmitting(true);
        setAddError("");
        try {
            const created = await createStatFn({
                data: { token, label, value, sortOrder: form.sortOrder },
            });
            setSiteStats((prev) => [...prev, created as StatItem]);
            setForm({ label: "", value: "", sortOrder: 0 });
        } catch (err) {
            setAddError(err instanceof Error ? err.message : "Failed to add stat");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (stat: StatItem) => {
        setEditingId(stat.id);
        setEditValue(stat.value);
        setRowError({});
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    const handleSave = async (id: string) => {
        const value = editValue.trim();
        if (!value) return;
        setSaving(true);
        setRowError({});
        try {
            const updated = await updateStatValueFn({ data: { token, id, value } });
            setSiteStats((prev) =>
                prev.map((s) => (s.id === id ? (updated as StatItem) : s))
            );
            setEditingId(null);
            setEditValue("");
        } catch (err) {
            setRowError({ [id]: err instanceof Error ? err.message : "Failed to save" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (stat: StatItem) => {
        if (!confirm(`Delete "${stat.label}"?`)) return;
        setRowError({});
        try {
            await deleteStatFn({ data: { token, id: stat.id } });
            setSiteStats((prev) => prev.filter((s) => s.id !== stat.id));
        } catch (err) {
            setRowError({ [stat.id]: err instanceof Error ? err.message : "Failed to delete" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            <div>
                <h1 className="font-semibold text-lg">Stats</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {siteStats.length} stat{siteStats.length !== 1 ? "s" : ""}
                    {siteStats.length === 0 && " — site shows built-in defaults"}
                </p>
            </div>

            <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Manage Stats
                </h2>

                <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
                    {siteStats.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No stats configured. Add one below — the site will use them instead of the defaults.
                        </p>
                    ) : (
                        siteStats.map((stat) => (
                            <div key={stat.id}>
                                {editingId === stat.id ? (
                                    <div className="flex items-center gap-3 px-5 py-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium mb-1.5">{stat.label}</p>
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleSave(stat.id);
                                                    if (e.key === "Escape") cancelEdit();
                                                }}
                                                autoFocus
                                                className="w-full px-3 py-1.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => handleSave(stat.id)}
                                                disabled={saving}
                                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 disabled:opacity-50 transition-colors"
                                                aria-label="Save"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:bg-foreground/5 transition-colors"
                                                aria-label="Cancel"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 px-5 py-3.5">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{stat.label}</p>
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-mono font-semibold">{stat.value}</span>
                                                {" · "}order {stat.sortOrder}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => startEdit(stat)}
                                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                            aria-label={`Edit ${stat.label}`}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(stat)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                                            aria-label={`Delete ${stat.label}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {rowError[stat.id] && (
                                    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-5 py-2 border-t border-red-100 dark:border-red-950/30">
                                        {rowError[stat.id]}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleAdd} className="mt-4 rounded-2xl border border-border p-5 space-y-4">
                    <h3 className="text-sm font-medium">Add Stat</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1">
                            <label className="text-sm font-medium">Label</label>
                            <input
                                type="text"
                                placeholder="Instagram Followers"
                                value={form.label}
                                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                                required
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Value</label>
                            <input
                                type="text"
                                placeholder="4,300  or  70%  or  1.2M"
                                value={form.value}
                                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                                required
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Sort Order</label>
                            <input
                                type="number"
                                value={form.sortOrder}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))
                                }
                                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                        </div>
                    </div>
                    {addError && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                            {addError}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {submitting ? "Adding…" : "Add stat"}
                    </button>
                </form>
            </section>
        </div>
    );
}

// ─── Shared components ────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: string }) {
    if (platform === "instagram") {
        return (
            <span className="shrink-0 w-7 h-7 rounded-lg bg-linear-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center">
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
            <span className="shrink-0 w-7 h-7 rounded-lg bg-black flex items-center justify-center">
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
        <span className="shrink-0 w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center text-xs font-medium">
            ?
        </span>
    );
}
