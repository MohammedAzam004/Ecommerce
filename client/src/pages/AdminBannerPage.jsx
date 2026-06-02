import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Image, Type, Link2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../utils/config";

const AdminBannerPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // All banners configuration map
    const [banners, setBanners] = useState({}); // { men: Banner, women: Banner, kids: Banner }

    // Active category tab: "men", "women", "kids"
    const [activeCategory, setActiveCategory] = useState("men");

    // Form inputs state (binds to the active tab)
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [productImage1, setProductImage1] = useState("");
    const [productImage2, setProductImage2] = useState("");
    const [productImage3, setProductImage3] = useState("");
    const [productImage4, setProductImage4] = useState("");
    const [productImage5, setProductImage5] = useState("");
    const [modelImage, setModelImage] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [buttonLink, setButtonLink] = useState("");
    const [isActive, setIsActive] = useState(true);

    const fetchAllBanners = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/banner`);
            if (data && Array.isArray(data)) {
                const bannerMap = {};
                data.forEach((b) => {
                    bannerMap[b.category] = b;
                });
                setBanners(bannerMap);

                // Populate initial Men values
                populateFields(bannerMap, activeCategory);
            }
        } catch (error) {
            console.error("Error fetching banner configurations:", error);
            toast.error("✗ Failed to load banner configurations.");
        } finally {
            setLoading(false);
        }
    };

    const populateFields = (bannerMap, category) => {
        const activeBanner = bannerMap[category] || {};
        setTitle(activeBanner.title || "");
        setSubtitle(activeBanner.subtitle || "");
        setDescription(activeBanner.description || "");
        setProductImage1(activeBanner.productImage1 || "");
        setProductImage2(activeBanner.productImage2 || "");
        setProductImage3(activeBanner.productImage3 || "");
        setProductImage4(activeBanner.productImage4 || "");
        setProductImage5(activeBanner.productImage5 || "");
        setModelImage(activeBanner.modelImage || "");
        setButtonText(activeBanner.buttonText || "Shop Collection");
        setButtonLink(activeBanner.buttonLink || "");
        setIsActive(activeBanner.isActive !== undefined ? activeBanner.isActive : true);
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo || !userInfo.user || !userInfo.user.isAdmin) {
            navigate("/");
            return;
        }

        fetchAllBanners();
    }, [navigate]);

    // Track tab changes and swap fields
    const handleCategoryTabChange = (category) => {
        // First, save current state to our local banners map to keep modifications in memory when toggling tabs
        const currentModified = {
            ...banners[activeCategory],
            title,
            subtitle,
            description,
            productImage1,
            productImage2,
            productImage3,
            productImage4,
            productImage5,
            modelImage,
            buttonText,
            buttonLink,
            isActive
        };

        const updatedMap = {
            ...banners,
            [activeCategory]: currentModified
        };
        setBanners(updatedMap);
        setActiveCategory(category);

        // Populate inputs with target category configurations
        populateFields(updatedMap, category);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            const { data } = await axios.post(
                `${API_BASE_URL}/api/banner`,
                {
                    category: activeCategory,
                    title,
                    subtitle,
                    description,
                    productImage1,
                    productImage2,
                    productImage3,
                    productImage4,
                    productImage5,
                    modelImage,
                    buttonText,
                    buttonLink,
                    isActive,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            toast.success(`✓ ${activeCategory.toUpperCase()} Banner Published Successfully!`);

            // Sync saved details back into map
            setBanners((prev) => ({
                ...prev,
                [activeCategory]: data.banner
            }));

        } catch (error) {
            console.error("Error saving banner configuration:", error);
            toast.error("✗ Failed to publish showcase configurations.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-full border-4 border-black/10 border-t-black animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Loading configurations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8 text-left">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                {/* Back Nav */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <Link
                        to="/admin/banner/edit"
                        className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-zinc-900 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span>✏ Go to Visual Edit Lab</span>
                    </Link>
                </div>

                {/* Categories Tab selector */}
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1 w-fit">
                    {[
                        { id: "men", label: "Men Collection" },
                        { id: "women", label: "Women Collection" },
                        { id: "kids", label: "Kids Collection" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleCategoryTabChange(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeCategory === tab.id
                                    ? "bg-black text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_-6px_rgba(0, 0, 0, 0.10)]"
                >
                    <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
                                <Sparkles className="h-5.5 w-5.5 text-amber-500 animate-pulse" />
                                {activeCategory.toUpperCase()} Banner Showcase
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">
                                Design and control the dynamic fashion showcase banner for the Men, Women, or Kids homepage sliders.
                            </p>
                        </div>

                        {/* Status Toggle Switch */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Banner Status</span>
                            <button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isActive
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm"
                                        : "bg-red-50 text-red-700 border-red-100"
                                    }`}
                            >
                                {isActive ? (
                                    <>
                                        <Eye className="h-4 w-4" />
                                        <span>Active on Home</span>
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="h-4 w-4" />
                                        <span>Inactive Fallback</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className="flex flex-col gap-6">

                        {/* Section A: Banner Text Info */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-4">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                                <Type className="h-4 w-4 text-slate-405" />
                                Banner Content Overlay
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Elevate Your Style"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtitle Badge</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 🔥 New Arrivals Collection"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Banner Paragraph Description</label>
                                <textarea
                                    placeholder="Detail your collection styles in a premium sentence..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows="2"
                                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Button Copy</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Shop Men's Fashion"
                                        value={buttonText}
                                        onChange={(e) => setButtonText(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                        <Link2 className="h-3 w-3" /> Redirection URL (CTA Link)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. /shop/men"
                                        value={buttonLink}
                                        onChange={(e) => setButtonLink(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section B: Sequential Product Pieces */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-4">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                                <Image className="h-4 w-4 text-slate-405" />
                                Sequential Product Pieces (Flat Lays)
                            </h3>
                            <p className="text-[10px] text-slate-455 -mt-2 leading-relaxed">
                                Paste the hosted URLs of five product flat lay items. These fly in sequentially every 3 seconds to compile the lookbook stack.
                            </p>

                            <div className="flex flex-col gap-4">
                                {[
                                    { id: 1, val: productImage1, setVal: setProductImage1, label: "Product Piece 1 (e.g. Top / Shirt / Knitwear)" },
                                    { id: 2, val: productImage2, setVal: setProductImage2, label: "Product Piece 2 (e.g. Trousers / Jeans / Joggers)" },
                                    { id: 3, val: productImage3, setVal: setProductImage3, label: "Product Piece 3 (e.g. Boots / Sneakers / Footwear)" },
                                    { id: 4, val: productImage4, setVal: setProductImage4, label: "Product Piece 4 (e.g. Smart Jacket / Blazer / Cardigan)" },
                                    { id: 5, val: productImage5, setVal: setProductImage5, label: "Product Piece 5 (e.g. Sunglasses / Handbag / Cap)" }
                                ].map((img) => (
                                    <div key={img.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm">
                                        {/* Image preview thumbnail */}
                                        <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                            {img.val ? (
                                                <img src={img.val} alt={`Preview ${img.id}`} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.target.src = "https://placehold.co/100x133/f8fafc/a1a1aa?text=Error"; }} />
                                            ) : (
                                                <Image className="h-5 w-5 text-slate-350" />
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col gap-1">
                                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">{img.label}</span>
                                            <input
                                                type="text"
                                                placeholder="https://images.unsplash.com/photo-..."
                                                value={img.val}
                                                onChange={(e) => img.setVal(e.target.value)}
                                                required
                                                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-150 rounded-lg focus:border-slate-900 focus:bg-white outline-none transition-all text-slate-800"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section C: Final Wearing Outfit Model */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-4">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1.5">
                                <Eye className="h-4.5 w-4.5 text-slate-405 animate-pulse" />
                                Final Styled Portrait Model
                            </h3>
                            <p className="text-[10px] text-slate-455 -mt-2 leading-relaxed">
                                Paste the URL of the styled human model. This takes center stage as the high-end showcase hero once all product pieces have assembled.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                {/* Large preview frame */}
                                <div className="w-24 h-32 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {modelImage ? (
                                        <img src={modelImage} alt="Model Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://placehold.co/150x200/f8fafc/a1a1aa?text=Error"; }} />
                                    ) : (
                                        <Image className="h-8 w-8 text-slate-300 animate-pulse" />
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Styled Model Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/photo-..."
                                        value={modelImage}
                                        onChange={(e) => setModelImage(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white outline-none transition-all text-slate-900"
                                    />
                                    <span className="text-[9px] font-semibold text-slate-400 leading-normal">
                                        💡 Use a high-quality vertical model portrait shot for maximum premium aesthetic feel.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit CTA */}
                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.98 }}
                            disabled={saving}
                            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-4 font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <CheckCircle className="h-4.5 w-4.5" />
                            <span>{saving ? "Publishing Configurations..." : `Publish ${activeCategory.toUpperCase()} Showcase`}</span>
                        </motion.button>

                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminBannerPage;
