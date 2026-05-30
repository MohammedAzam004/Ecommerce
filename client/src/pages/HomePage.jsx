import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shirt, Sparkles, Star, Watch, Gem, Package } from "lucide-react";
import { getProducts } from "../services/productService";
import HeroBanner from "../components/HeroBanner";
import CategoryShowcase from "../components/CategoryShowcase";
import ProductCard from "../components/ProductCard";

/* ─── Category icon cards config ────────────────────────────────────── */
const CATEGORY_ICONS = [
    {
        label: "Men's Fashion",
        link: "/shop/men",
        icon: Shirt,
        gradient: "from-blue-600 to-indigo-700",
        hoverGlow: "hover:shadow-blue-400/30",
        iconBg: "bg-white/20",
        iconColor: "text-white",
    },
    {
        label: "Women's Fashion",
        link: "/shop/women",
        icon: Sparkles,
        gradient: "from-rose-500 to-pink-600",
        hoverGlow: "hover:shadow-rose-400/30",
        iconBg: "bg-white/20",
        iconColor: "text-white",
    },
    {
        label: "Kids' Fashion",
        link: "/shop/kids",
        icon: Star,
        gradient: "from-amber-400 to-orange-500",
        hoverGlow: "hover:shadow-amber-400/30",
        iconBg: "bg-white/20",
        iconColor: "text-white",
    },
    {
        label: "Men Accessories",
        link: "/shop/men-accessories",
        icon: Watch,
        gradient: "from-slate-700 to-slate-900",
        hoverGlow: "hover:shadow-slate-500/30",
        iconBg: "bg-white/20",
        iconColor: "text-white",
    },
    {
        label: "Women Accessories",
        link: "/shop/women-accessories",
        icon: Gem,
        gradient: "from-purple-500 to-violet-700",
        hoverGlow: "hover:shadow-purple-400/30",
        iconBg: "bg-white/20",
        iconColor: "text-white",
    },
    {
        label: "Kids Accessories",
        link: "/shop/kids-accessories",
        icon: Package,
        gradient: "from-emerald-500 to-teal-600",
        hoverGlow: "hover:shadow-emerald-400/30",
        iconBg: "bg-white/20",
        iconColor: "text-white",
    },
];

/* ─── Showcase blocks config ─────────────────────────────────────────── */
const SHOWCASES = [
    { title: "Men's Fashion", dbCategory: "Men T-Shirts", shopLink: "/shop/men", badge: "New arrivals", accentColor: "#000000" },
    { title: "Women's Fashion", dbCategory: "Women Dresses", shopLink: "/shop/women", badge: "Trending now", accentColor: "#000000" },
    { title: "Kids' Fashion", dbCategory: "Kids Boys Wear", shopLink: "/shop/kids", badge: "Student picks", accentColor: "#000000" },
    { title: "Men Accessories", dbCategory: "Men Accessories", shopLink: "/shop/men-accessories", badge: "Style essentials", accentColor: "#000000" },
    { title: "Women Accessories", dbCategory: "Women Accessories", shopLink: "/shop/women-accessories", badge: "Handpicked", accentColor: "#000000" },
    { title: "Kids Accessories", dbCategory: "Kids Accessories", shopLink: "/shop/kids-accessories", badge: "Fun & colourful", accentColor: "#000000" },
];

/* ─── Mini skeleton for trending row ────────────────────────────────── */
const TrendingSkeletonCard = () => (
    <div className="bg-white rounded-xl border border-slate-100 p-3 flex flex-col gap-2 shadow-sm w-44 shrink-0">
        <div className="aspect-square bg-slate-100 rounded-lg animate-pulse w-full" />
        <div className="h-2 w-24 bg-slate-100 rounded animate-pulse" />
        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
    </div>
);

/* ─── Newsletter section ─────────────────────────────────────────────── */
const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            alert("🎉 Thank you for subscribing to ShopEsy updates!");
            setEmail("");
        }
    };
    return (
        <section className="bg-black rounded-3xl overflow-hidden relative mx-4 sm:mx-6 lg:mx-0 my-12">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-zinc-500/5 rounded-full blur-3xl" />
            <div className="relative z-10 px-8 py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left max-w-md">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Newsletter</span>
                    <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-3">
                        Stay ahead of the <span className="text-zinc-300">trends</span>
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Get exclusive deals, new collection alerts, and early access to seasonal sales — right in your inbox.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2 w-full lg:w-auto max-w-sm">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-4 py-3 text-sm rounded-xl bg-zinc-900 border border-zinc-800 focus:border-white focus:ring-4 focus:ring-white/5 outline-none text-white placeholder-zinc-600 transition-all"
                    />
                    <button
                        type="submit"
                        className="bg-white hover:bg-zinc-200 text-black font-bold text-sm px-6 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition-all shrink-0 cursor-pointer active:scale-95"
                    >
                        Join
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </form>
            </div>
        </section>
    );
};

/* ═══════════════════════════════════════════════════════════════════ */
const HomePage = () => {
    const [marqueeProducts, setMarqueeProducts] = useState([]);
    const [marqueeLoading, setMarqueeLoading] = useState(true);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(true);

    /* Fetch marquee products */
    useEffect(() => {
        const fetchMarquee = async () => {
            try {
                const data = await getProducts("", "", "", "", "", "true", "12");
                setMarqueeProducts(data.products || []);
            } catch (err) {
                console.error("Marquee fetch error:", err);
            } finally {
                setMarqueeLoading(false);
            }
        };
        fetchMarquee();
    }, []);

    /* Fetch trending products */
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = await getProducts("", "", "", "", "", "true", "10");
                setTrendingProducts(data.products || []);
            } catch (err) {
                console.error("Trending fetch error:", err);
            } finally {
                setTrendingLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA]">

            {/* ── 1. Hero Banner ── */}
            <HeroBanner />


            {/* ── 2. Scrolling Marquee ── */}
            <div className="relative w-[100vw] ml-[calc(-50vw+50%)] mt-6 mb-6 overflow-hidden flex flex-col gap-1 py-4 border-y border-zinc-100 bg-zinc-50/50 flex-shrink-0 [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]">
                {marqueeLoading ? (
                    <div className="flex gap-6 px-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-3 shadow-sm w-56 flex items-center gap-3 shrink-0 border border-slate-100/60">
                                <div className="w-14 h-14 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                    <div className="h-2 w-16 bg-slate-100 rounded animate-pulse" />
                                    <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
                                    <div className="h-2 w-20 bg-slate-100 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex animate-marquee-slow gap-6 w-max">
                        {[...marqueeProducts, ...marqueeProducts, ...marqueeProducts, ...marqueeProducts].map((item, idx) => (
                            <div
                                key={`${item._id}-${idx}`}
                                className="group relative bg-white rounded-xl p-3 shadow-sm w-56 flex items-center gap-3 text-left shrink-0 select-none cursor-default overflow-hidden border border-slate-100/60"
                            >
                                <div className="w-14 h-14 rounded-lg bg-slate-50 flex items-center justify-center p-1.5 shrink-0 border border-slate-100 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">{item.category}</span>
                                    <h4 className="font-bold text-slate-900 text-sm truncate mb-0.5">{item.name}</h4>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-black text-slate-900">₹{item.price?.toLocaleString("en-IN") ?? "—"}</span>
                                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                        <span className="text-[9px] font-bold text-emerald-600 uppercase">In Stock</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── 3. Shop By Category icons ── */}
                <section className="pb-12 pt-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tight">Shop By Category</h2>
                            <p className="text-sm text-slate-400 mt-1">Browse our handpicked fashion collections</p>
                        </div>
                        <Link
                            to="/shop"
                            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-black hover:text-zinc-700 transition-colors"
                        >
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CATEGORY_ICONS.map((cat, i) => {
                            const Icon = cat.icon;
                            return (
                                <motion.div
                                    key={cat.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <Link
                                        to={cat.link}
                                        className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.gradient} hover:shadow-xl ${cat.hoverGlow} transition-all duration-300 hover:-translate-y-1 active:scale-95 select-none`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center`}>
                                            <Icon className={`h-5 w-5 ${cat.iconColor}`} />
                                        </div>
                                        <span className="text-xs font-bold text-white/90 text-center leading-tight">{cat.label}</span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ── 4. Trending Now ── */}
                <section className="py-10 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tight">🔥 Trending Now</h2>
                            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                                <span>Freshly picked, updated daily</span>
                                <span className="inline-flex items-center text-[9px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider sm:hidden">
                                    Swipe →
                                </span>
                            </p>
                        </div>
                        <Link
                            to="/shop"
                            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-black hover:text-zinc-700 transition-colors"
                        >
                            See All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pt-2 pb-5 trending-scroll-row -mx-4 px-4 sm:mx-0 sm:px-0">
                        {trendingLoading
                            ? [1, 2, 3, 4, 5, 6, 7].map((i) => <TrendingSkeletonCard key={i} />)
                            : trendingProducts.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="group flex flex-col gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-44 shrink-0 overflow-hidden"
                                >
                                    <div className="aspect-square w-full bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="px-3 pb-3 flex flex-col gap-0.5">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{product.name}</p>
                                        <span className="text-sm font-black text-black">₹{product.price?.toLocaleString("en-IN")}</span>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </section>

                {/* ── 5. Category Showcase Blocks ── */}
                <section className="py-10 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tight">Featured Collections</h2>
                            <p className="text-sm text-slate-400 mt-1">Curated picks from every category</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SHOWCASES.map((showcase, idx) => (
                            <motion.div
                                key={showcase.dbCategory}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.55, delay: idx * 0.08, ease: "easeOut" }}
                            >
                                <CategoryShowcase
                                    title={showcase.title}
                                    dbCategory={showcase.dbCategory}
                                    shopLink={showcase.shopLink}
                                    badge={showcase.badge}
                                    accentColor={showcase.accentColor}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── 6. Newsletter ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <NewsletterSection />
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;