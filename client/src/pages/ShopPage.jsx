import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    Search, SlidersHorizontal, ChevronLeft, ChevronRight, X
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { getProducts } from "../services/productService";
import { extractErrorMessage } from "../utils/errorHelper";

/* ─── Category Configuration ────────────────────────────────────────── */
const CATEGORY_MAP = {
    all: {
        label: "All Products",
        subCategories: [],
        defaultSubCat: "",
        accent: "#000000",
    },
    men: {
        label: "Men's Fashion",
        subCategories: ["Men T-Shirts", "Men Shirts", "Men Hoodies", "Men Jeans", "Men Footwear"],
        defaultSubCat: "",
        accent: "#000000",
    },
    women: {
        label: "Women's Fashion",
        subCategories: ["Women Tops", "Women Dresses", "Women Jeans", "Women Ethnic Wear", "Women Footwear"],
        defaultSubCat: "",
        accent: "#000000",
    },
    kids: {
        label: "Kids' Fashion",
        subCategories: ["Kids Boys Wear", "Kids Girls Wear", "Kids Footwear"],
        defaultSubCat: "",
        accent: "#000000",
    },
    "men-accessories": {
        label: "Men Accessories",
        subCategories: ["Men Accessories"],
        defaultSubCat: "Men Accessories",
        accent: "#000000",
    },
    "women-accessories": {
        label: "Women Accessories",
        subCategories: ["Women Accessories"],
        defaultSubCat: "Women Accessories",
        accent: "#000000",
    },
    "kids-accessories": {
        label: "Kids Accessories",
        subCategories: ["Kids Accessories"],
        defaultSubCat: "Kids Accessories",
        accent: "#000000",
    },
};

const TABS = ["all", "men", "women", "kids", "men-accessories", "women-accessories", "kids-accessories"];

const PRICE_PRESETS = [
    { label: "All Prices", min: "", max: "" },
    { label: "Under ₹500", min: "0", max: "500" },
    { label: "₹500 – ₹1,000", min: "500", max: "1000" },
    { label: "₹1,000 – ₹2,500", min: "1000", max: "2500" },
    { label: "₹2,500 – ₹5,000", min: "2500", max: "5000" },
    { label: "Above ₹5,000", min: "5000", max: "10000" },
];

/* Helper: resolve DB category name → tab key */
const getTabForDBCategory = (dbCat) => {
    for (const [key, val] of Object.entries(CATEGORY_MAP)) {
        if (val.subCategories.includes(dbCat)) return key;
    }
    return "all";
};

/* ─── Skeleton Card ─────────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm select-none">
        <div className="w-full aspect-square rounded-lg bg-slate-100 animate-pulse" />
        <div className="h-3 w-5/6 bg-slate-100 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
            <div className="h-5 w-16 bg-slate-100 rounded animate-pulse" />
            <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
        </div>
    </div>
);

/* ─── Main ShopPage ─────────────────────────────────────────────────── */
const ShopPage = () => {
    const params = useParams();
    const navigate = useNavigate();

    /* ── Derive initial state from URL params ── */
    const initTab = () => {
        if (params.tab && CATEGORY_MAP[params.tab]) return params.tab;
        if (params.category) return getTabForDBCategory(params.category);
        return "all";
    };
    const initSubCat = () => {
        if (params.category) return params.category;
        const t = initTab();
        return CATEGORY_MAP[t]?.defaultSubCat || "";
    };

    const [activeTab, setActiveTab] = useState(initTab);
    const [subCat, setSubCat] = useState(initSubCat);
    const [searchInput, setSearchInput] = useState(params.keyword || "");
    const [keyword, setKeyword] = useState(params.keyword || "");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [pricePreset, setPricePreset] = useState(0);
    const [sortBy, setSortBy] = useState("default");

    const getQueryPage = () => {
        const queryParams = new URLSearchParams(location.search);
        return Number(queryParams.get("page")) || Number(params.pageNumber) || 1;
    };
    const [page, setPage] = useState(getQueryPage);

    const [products, setProducts] = useState([]);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const minPrice = PRICE_PRESETS[pricePreset].min;
    const maxPrice = PRICE_PRESETS[pricePreset].max;
    // Sync state when URL params change
    useEffect(() => {
        const resolvedTab = params.tab && CATEGORY_MAP[params.tab] ? params.tab : (params.category ? getTabForDBCategory(params.category) : "all");
        const resolvedSubCat = params.category ? params.category : (CATEGORY_MAP[resolvedTab]?.defaultSubCat || "");
        const resolvedKeyword = params.keyword || "";
        const queryParams = new URLSearchParams(location.search);
        const resolvedPage = Number(queryParams.get("page")) || Number(params.pageNumber) || 1;

        setActiveTab(resolvedTab);
        setSubCat(resolvedSubCat);
        setKeyword(resolvedKeyword);
        setSearchInput(resolvedKeyword);
        setPage(resolvedPage);
    }, [params.tab, params.category, params.keyword, params.pageNumber, location.search]);

    /* ── Compute the effective category param to send to the API ──
       - Specific sub-cat selected  → send that sub-cat directly
       - "All [Tab]" (subCat empty) with a specific tab → send ALL sub-cats for that tab (comma-joined)
       - "All Products" tab          → send nothing (no filter)
    ── */
    const getEffectiveCategory = useCallback((tab, sub) => {
        if (sub) return sub;
        if (tab === "all") return "";
        const subs = CATEGORY_MAP[tab]?.subCategories || [];
        return subs.join(",");
    }, []);

    /* ── Fetch products ── */
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const effectiveCat = getEffectiveCategory(activeTab, subCat);
            const data = await getProducts(keyword, effectiveCat, minPrice, maxPrice, page);
            const list = data.products || [];
            setProducts(list);
            setPages(data.pages || 1);
        } catch (err) {
            toast.error("✗ " + extractErrorMessage(err, "Failed to load products."));
        } finally {
            setLoading(false);
        }
    }, [keyword, activeTab, subCat, minPrice, maxPrice, page, getEffectiveCategory]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    /* ── Tab change ── */
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSubCat(CATEGORY_MAP[tab]?.defaultSubCat || "");
        navigate(`/shop/${tab === "all" ? "" : tab}`.replace(/\/$/, "") || "/shop");
    };

    /* ── Sub-category chip ── */
    const handleSubCat = (cat) => {
        setSubCat((prev) => (prev === cat ? CATEGORY_MAP[activeTab]?.defaultSubCat || "" : cat));
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete("page");
        navigate({
            pathname: location.pathname,
            search: queryParams.toString()
        });
    };

    /* ── Search submit ── */
    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchInput.trim();
        if (!q) return;
        // Always search across ALL products — reset tab & subcategory filter
        setKeyword(q);
        setActiveTab("all");
        setSubCat("");
        setPage(1);
        navigate("/shop");

    };

    /* ── Page change ── */
    const handlePageChange = (p) => {
        setPage(p);
        const queryParams = new URLSearchParams(location.search);
        queryParams.set("page", p);
        navigate({
            pathname: location.pathname,
            search: queryParams.toString()
        });
    };

    /* ── Sort products client-side ── */
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "priceLowHigh") return a.price - b.price;
        if (sortBy === "priceHighLow") return b.price - a.price;
        if (sortBy === "ratingHighLow") return (b.rating || 0) - (a.rating || 0);
        return 0;
    });

    const tabConfig = CATEGORY_MAP[activeTab];
    const hasSubCats = tabConfig.subCategories.length > 1;
    const hasFilters = keyword || subCat || pricePreset !== 0;

    return (
        <div className="min-h-screen bg-[#FAFAFA]">

            {/* ── Sticky Category Tabs ── */}
            <div className="sticky top-16 z-40 bg-white border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-3">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            const cfg = CATEGORY_MAP[tab];
                            return (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap border ${isActive
                                        ? "bg-black text-white border-black shadow-sm"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    style={isActive ? {} : {}}
                                >
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Sub-category chips (for Men/Women/Kids) ── */}
            {hasSubCats && (
                <div className="bg-slate-50/80 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2.5">
                            <button
                                onClick={() => { setSubCat(""); setPage(1); }}
                                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${!subCat
                                    ? "border-slate-800 bg-slate-800 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                All {tabConfig.label}
                            </button>
                            {tabConfig.subCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleSubCat(cat)}
                                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${subCat === cat
                                        ? "text-white border-transparent shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                        }`}
                                    style={subCat === cat ? { background: tabConfig.accent, borderColor: tabConfig.accent } : {}}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main content: Sidebar + Grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Mobile Filters Toggle Button */}
                    <div className="lg:hidden w-full">
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 hover:border-slate-350 text-slate-800 font-bold text-sm py-3.5 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                            <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
                            {hasFilters && (
                                <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                            )}
                        </button>
                    </div>

                    {/* ── Sidebar ── */}
                    <aside className={`lg:col-span-3 flex flex-col gap-5 lg:sticky lg:top-36 ${showMobileFilters ? "block" : "hidden lg:flex"}`}>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-5">

                            {/* Sidebar header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    Filters
                                </h3>
                                {hasFilters && (
                                    <button
                                        onClick={() => {
                                            setKeyword("");
                                            setSearchInput("");
                                            setSubCat(CATEGORY_MAP[activeTab]?.defaultSubCat || "");
                                            setPricePreset(0);
                                            navigate({
                                                pathname: location.pathname,
                                                search: ""
                                            });
                                        }}
                                        className="text-xs font-semibold text-black hover:text-zinc-700 flex items-center gap-1 cursor-pointer"
                                    >
                                        <X className="h-3 w-3" /> Clear All
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Search</label>
                                <form onSubmit={handleSearch} className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products…"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                    />
                                </form>
                            </div>

                            {/* Price Filter */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Price Range</label>
                                <div className="flex flex-col gap-1.5">
                                    {PRICE_PRESETS.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setPricePreset(idx);
                                                const queryParams = new URLSearchParams(location.search);
                                                queryParams.delete("page");
                                                navigate({
                                                    pathname: location.pathname,
                                                    search: queryParams.toString()
                                                });
                                            }}
                                            className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${idx === pricePreset
                                                ? "bg-black text-white"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── Product Grid Area ── */}
                    <div className="lg:col-span-9 flex flex-col gap-5">


                        {/* Sort + count bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-lg font-bold text-black tracking-tight">{tabConfig.label}</h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {!loading ? `${products.length} products found` : "Loading…"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-xs font-bold text-black bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-black cursor-pointer shadow-sm"
                                >
                                    <option value="default">Relevance</option>
                                    <option value="priceLowHigh">Price: Low → High</option>
                                    <option value="priceHighLow">Price: High → Low</option>
                                    <option value="ratingHighLow">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <EmptyState
                                title="No Products Found"
                                message="Try adjusting your filters or search query."
                                icon="search"
                                buttonText="Clear Filters"
                                buttonLink="/shop"
                            />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            >
                                {sortedProducts.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {!loading && pages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-slate-100">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`h-9 w-9 rounded-xl text-xs font-bold border transition-all cursor-pointer ${p === page
                                            ? "bg-black text-white border-black shadow-sm"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(Math.min(pages, page + 1))}
                                    disabled={page === pages}
                                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
