import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import DynamicShowcaseBanner from "./DynamicShowcaseBanner";

const slides = [
    {
        id: 0,
        badge: "🔥 New Arrivals",
        headline: "Elevate Your",
        highlight: "Men's Style",
        sub: "Premium shirts, hoodies, jeans & footwear — crafted for the modern man.",
        cta: "Shop Men's Fashion",
        link: "/shop/men",
        image: "/men_banner.webp",
        gradient: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 60%, #F1F5F9 100%)",
        accentClass: "text-blue-600",
        ctaClass: "bg-black hover:bg-zinc-900 text-white shadow-zinc-950/10",
        chipClass: "bg-blue-50 text-blue-800 border-blue-100",
        stat1: "500+ styles",
        stat2: "Premium quality",
        stat3: "Free shipping",
    },
    {
        id: 1,
        badge: "✨ Trending Now",
        headline: "Women's",
        highlight: "Trending Fashion",
        sub: "Dresses, tops, ethnic wear & footwear for every style and every occasion.",
        cta: "Shop Women's Collection",
        link: "/shop/women",
        image: "/women_banner.webp",
        gradient: "linear-gradient(135deg, #FFFFFF 0%, #FFF1F2 60%, #FFE4E6 100%)",
        accentClass: "text-rose-500",
        ctaClass: "bg-black hover:bg-zinc-900 text-white shadow-zinc-950/10",
        chipClass: "bg-rose-50 text-rose-800 border-rose-100",
        stat1: "600+ designs",
        stat2: "Festive wear",
        stat3: "Fast delivery",
    },
    {
        id: 2,
        badge: "🎓 Student Special",
        headline: "Kids' Fun &",
        highlight: "Colorful Fashion",
        sub: "Bright, comfortable clothing and accessories for your little ones.",
        cta: "Shop Kids' Collection",
        link: "/shop/kids",
        image: "/kids_banner.webp",
        gradient: "linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 60%, #FEF3C7 100%)",
        accentClass: "text-amber-500",
        ctaClass: "bg-black hover:bg-zinc-900 text-white shadow-zinc-950/10",
        chipClass: "bg-amber-50 text-amber-800 border-amber-100",
        stat1: "300+ styles",
        stat2: "Soft fabrics",
        stat3: "Safe materials",
    },
];

const categories = ["men", "women", "kids"];

const getTitleParts = (title) => {
    if (!title) return { main: "", highlight: "" };
    const words = title.split(" ");
    if (words.length <= 1) return { main: title, highlight: "" };
    const highlight = words.pop();
    const main = words.join(" ");
    return { main, highlight };
};

const HeroBanner = () => {
    const [current, setCurrent] = useState(0);
    const [banners, setBanners] = useState({});
    const [loading, setLoading] = useState(true);

    const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
    const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

    // Fetch all banners from database on mount
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/banner`);
                if (data && Array.isArray(data)) {
                    const bannerMap = {};
                    data.forEach((b) => {
                        bannerMap[b.category] = b;
                    });
                    setBanners(bannerMap);
                }
            } catch (error) {
                console.error("Error fetching banners for homepage Hero:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Slide rotation interval: Dynamic 20s if showcase is active, 6s fallback
    useEffect(() => {
        const currentCategory = categories[current];
        const currentBanner = banners[currentCategory];
        const isDynamic = currentBanner && currentBanner.isActive;
        
        const intervalTime = isDynamic ? 10000 : 6000;
        const timer = setInterval(next, intervalTime);
        return () => clearInterval(timer);
    }, [next, current, banners]);

    const slide = slides[current];
    const categoryKey = categories[current];
    const banner = banners[categoryKey];
    const hasActiveBanner = banner && banner.isActive;

    // Map dynamic or hardcoded contents
    const displayBadge = hasActiveBanner ? banner.subtitle : slide.badge;
    const titleParts = hasActiveBanner 
        ? getTitleParts(banner.title) 
        : { main: slide.headline, highlight: slide.highlight };
    const displaySub = hasActiveBanner ? banner.description : slide.sub;
    const displayCta = hasActiveBanner ? banner.buttonText : slide.cta;
    const displayLink = hasActiveBanner ? banner.buttonLink : slide.link;

    return (
        <div
            className="relative w-full overflow-hidden border-b border-zinc-150 min-h-[580px] sm:min-h-[500px] md:h-[500px] bg-white flex items-center"
        >
            {/* Dot grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none z-10" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="relative w-full h-full flex flex-col md:flex-row items-center py-6 md:py-0"
                >
                    {/* Full slide: responsive centered layout */}
                    <div className="relative z-20 max-w-7xl mx-auto w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 px-4 sm:px-6 lg:px-8">

                        {/* Left: Text Content */}
                        <div className="w-full md:w-[45%] flex-shrink-0 flex flex-col justify-center text-center md:text-left items-center md:items-start order-2 md:order-1 mt-6 md:mt-0">
                            <div className="text-center md:text-left flex flex-col items-center md:items-start">
                                {/* Badge */}
                                <motion.span
                                    initial={{ opacity: 0, y: -12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 }}
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold mb-2.5 ${slide.chipClass}`}
                                >
                                    {displayBadge}
                                </motion.span>

                                {/* Headline */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-black leading-[1.1] tracking-tight mb-2.5"
                                >
                                    {titleParts.main}
                                    {titleParts.highlight && (
                                        <>
                                            <br />
                                            <span className={slide.accentClass}>{titleParts.highlight}</span>
                                        </>
                                    )}
                                </motion.h1>

                                {/* Sub-text */}
                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.22 }}
                                    className="text-sm lg:text-base text-zinc-500 leading-relaxed mb-4 max-w-md"
                                >
                                    {displaySub}
                                </motion.p>

                                {/* CTAs */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.34 }}
                                    className="flex items-center justify-center md:justify-start gap-3.5 flex-wrap"
                                >
                                    <Link
                                        to={displayLink}
                                        className={`${slide.ctaClass} font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2`}
                                    >
                                        {displayCta}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        to="/shop"
                                        className="text-zinc-700 hover:text-black font-semibold text-sm px-6 py-3.5 rounded-full border border-zinc-200 hover:border-zinc-300 bg-white shadow-sm transition-all duration-200"
                                    >
                                        Browse All
                                    </Link>
                                </motion.div>
                            </div>{/* end text-left */}
                        </div>{/* end left column */}

                        {/* Right: Premium Dynamic Showcase or Fallback Image */}
                        <div className="w-full md:flex-1 h-[320px] sm:h-[380px] md:h-full flex items-center justify-center overflow-visible px-4 order-1 md:order-2 relative mt-4 md:mt-0">
                            {hasActiveBanner ? (
                                <DynamicShowcaseBanner bannerData={banner} />
                            ) : (
                                <motion.img
                                    key={slide.image}
                                    src={slide.image}
                                    alt={slide.highlight}
                                    initial={{ opacity: 0, scale: 0.97, x: 30 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    style={{ maxHeight: '85%' }}
                                />
                            )}
                        </div>

                    </div>{/* end responsive centered layout */}
                </motion.div>
            </AnimatePresence>

            {/* Prev button */}
            <button
                onClick={prev}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/90 hover:bg-white text-black border border-zinc-200 shadow-sm transition-all cursor-pointer items-center justify-center"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Next button */}
            <button
                onClick={next}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/90 hover:bg-white text-black border border-zinc-200 shadow-sm transition-all cursor-pointer items-center justify-center"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

        </div>
    );
};

export default HeroBanner;
