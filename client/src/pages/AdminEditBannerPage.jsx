import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Sparkles,
    Image as ImageIcon,
    Type,
    Link2,
    CheckCircle,
    Eye,
    EyeOff,
    Upload,
    Trash2,
    Maximize2,
    X,
    RefreshCw,
    Link as LinkIcon
} from "lucide-react";
import { API_BASE_URL } from "../utils/config";

const AdminEditBannerPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [replacingField, setReplacingField] = useState("");
    const [lightboxImage, setLightboxImage] = useState(null);
    // Track which card has the URL input open + its draft value
    const [linkInputField, setLinkInputField] = useState(""); // card key that has URL input open
    const [linkInputValue, setLinkInputValue] = useState("");

    // Store all banner documents in a dictionary
    const [banners, setBanners] = useState({}); // { men: Banner, women: Banner, kids: Banner }
    const [activeCategory, setActiveCategory] = useState("men");

    // Banner Text & Status Forms (bound to active category)
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [description, setDescription] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [buttonLink, setButtonLink] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Current category images state
    const [productImage1, setProductImage1] = useState("");
    const [productImage2, setProductImage2] = useState("");
    const [productImage3, setProductImage3] = useState("");
    const [productImage4, setProductImage4] = useState("");
    const [productImage5, setProductImage5] = useState("");
    const [modelImage, setModelImage] = useState("");

    const fetchAllBanners = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/banner`);
            if (data && Array.isArray(data)) {
                const bannerMap = {};
                data.forEach((b) => {
                    bannerMap[b.category] = b;
                });
                setBanners(bannerMap);
                populateFields(bannerMap, activeCategory);
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
            toast.error("✗ Failed to load banner configurations.");
        } finally {
            setLoading(false);
        }
    };

    const populateFields = (bannerMap, category) => {
        const b = bannerMap[category] || {};
        setTitle(b.title || "");
        setSubtitle(b.subtitle || "");
        setDescription(b.description || "");
        setButtonText(b.buttonText || "Shop Collection");
        setButtonLink(b.buttonLink || "");
        setIsActive(b.isActive !== undefined ? b.isActive : true);

        // Populate images
        setProductImage1(b.productImage1 || "");
        setProductImage2(b.productImage2 || "");
        setProductImage3(b.productImage3 || "");
        setProductImage4(b.productImage4 || "");
        setProductImage5(b.productImage5 || "");
        setModelImage(b.modelImage || "");
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.user || !userInfo.user.isAdmin) {
            navigate("/");
            return;
        }
        fetchAllBanners();
    }, [navigate]);

    // Handle tab toggle cleanly
    const handleCategoryChange = (category) => {
        // First stash current text values in state dictionary so modifications aren't lost
        const currentData = {
            ...banners[activeCategory],
            title,
            subtitle,
            description,
            buttonText,
            buttonLink,
            isActive,
            productImage1,
            productImage2,
            productImage3,
            productImage4,
            productImage5,
            modelImage
        };

        const updatedBanners = {
            ...banners,
            [activeCategory]: currentData
        };

        setBanners(updatedBanners);
        setActiveCategory(category);
        populateFields(updatedBanners, category);
    };

    // Open file picker for replacement
    const triggerReplace = (fieldName) => {
        setReplacingField(fieldName);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Convert file to Base64 and upload immediately
    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Limit to 5MB to match return guidelines
            if (file.size > 5 * 1024 * 1024) {
                toast.error("✗ File is too large. Max allowed size is 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                await uploadImageToServer(replacingField, reader.result);
            };
            e.target.value = null; // Clear value to allow picking same image
        }
    };

    const uploadImageToServer = async (fieldName, base64Image) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setSaving(true);

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/banner/upload`,
                {
                    category: activeCategory,
                    fieldName,
                    image: base64Image
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            );

            // Update UI state
            if (fieldName === "productImage1") setProductImage1(data.url);
            else if (fieldName === "productImage2") setProductImage2(data.url);
            else if (fieldName === "productImage3") setProductImage3(data.url);
            else if (fieldName === "productImage4") setProductImage4(data.url);
            else if (fieldName === "productImage5") setProductImage5(data.url);
            else if (fieldName === "modelImage") setModelImage(data.url);

            // Update local memory dictionary
            setBanners((prev) => ({
                ...prev,
                [activeCategory]: data.banner
            }));

            toast.success(`✓ Image replaced successfully on server!`);
        } catch (error) {
            console.error("Image upload failed:", error);
            const msg = error.response?.data?.message || "Failed to upload image.";
            toast.error(`✗ ${msg}`);
        } finally {
            setSaving(false);
            setReplacingField("");
        }
    };

    // Apply a pasted URL directly to the image field (saves to DB immediately)
    const handleLinkApply = async (fieldName) => {
        const url = linkInputValue.trim();
        if (!url) { toast.error("✗ Please enter a valid image URL."); return; }
        if (!/^https?:\/\//i.test(url)) { toast.error("✗ URL must start with http:// or https://"); return; }

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setSaving(true);
        try {
            // Persist the URL directly into the banner doc via the main save endpoint
            const payload = {
                category: activeCategory,
                [fieldName]: url
            };
            await axios.post(`${API_BASE_URL}/api/banner`, payload, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });

            // Update local UI state
            if (fieldName === "productImage1") setProductImage1(url);
            else if (fieldName === "productImage2") setProductImage2(url);
            else if (fieldName === "productImage3") setProductImage3(url);
            else if (fieldName === "productImage4") setProductImage4(url);
            else if (fieldName === "productImage5") setProductImage5(url);
            else if (fieldName === "modelImage") setModelImage(url);

            setBanners((prev) => ({
                ...prev,
                [activeCategory]: { ...prev[activeCategory], [fieldName]: url }
            }));

            toast.success("✓ Image URL saved!");
            setLinkInputField("");
            setLinkInputValue("");
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to save URL.";
            toast.error(`✗ ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    // Remove image and update database instantly

    const handleRemoveImage = async (fieldName) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setSaving(true);

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/banner/remove-image`,
                {
                    category: activeCategory,
                    fieldName
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            );

            // Clear state
            if (fieldName === "productImage1") setProductImage1("");
            else if (fieldName === "productImage2") setProductImage2("");
            else if (fieldName === "productImage3") setProductImage3("");
            else if (fieldName === "productImage4") setProductImage4("");
            else if (fieldName === "productImage5") setProductImage5("");
            else if (fieldName === "modelImage") setModelImage("");

            // Sync with memory dict
            setBanners((prev) => ({
                ...prev,
                [activeCategory]: data.banner
            }));

            toast.success("✓ Image removed successfully from storage.");
        } catch (error) {
            console.error("Image removal failed:", error);
            const msg = error.response?.data?.message || "Failed to clear image.";
            toast.error(`✗ ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    // Save Text & Status alterations
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/banner`,
                {
                    category: activeCategory,
                    title,
                    subtitle,
                    description,
                    buttonText,
                    buttonLink,
                    isActive,
                    productImage1,
                    productImage2,
                    productImage3,
                    productImage4,
                    productImage5,
                    modelImage
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            );

            setBanners((prev) => ({
                ...prev,
                [activeCategory]: data.banner
            }));

            toast.success(`✓ ${activeCategory.toUpperCase()} Banner text details updated successfully!`);
        } catch (error) {
            console.error("Failed to update banner content:", error);
            toast.error("✗ Failed to publish layout details.");
        } finally {
            setSaving(false);
        }
    };

    // Construct image cards structure
    const imageCards = [
        {
            key: "productImage1", label: "Product Piece 1 (Top / Knitwear)", val: productImage1,
            ratio: "3 : 4", size: "600 × 800 px", hint: "Flat-lay product photo — white/transparent bg", ratioColor: "bg-blue-50 text-blue-700 border-blue-100"
        },
        {
            key: "productImage2", label: "Product Piece 2 (Trouser / Jeans)", val: productImage2,
            ratio: "3 : 4", size: "600 × 800 px", hint: "Flat-lay product photo — white/transparent bg", ratioColor: "bg-blue-50 text-blue-700 border-blue-100"
        },
        {
            key: "productImage3", label: "Product Piece 3 (Footwear / Boots)", val: productImage3,
            ratio: "3 : 4", size: "600 × 800 px", hint: "Flat-lay product photo — white/transparent bg", ratioColor: "bg-blue-50 text-blue-700 border-blue-100"
        },
        {
            key: "productImage4", label: "Product Piece 4 (Smart Outerwear)", val: productImage4,
            ratio: "3 : 4", size: "600 × 800 px", hint: "Flat-lay product photo — white/transparent bg", ratioColor: "bg-blue-50 text-blue-700 border-blue-100"
        },
        {
            key: "productImage5", label: "Product Piece 5 (Bag / Eyewear / Accessory)", val: productImage5,
            ratio: "3 : 4", size: "600 × 800 px", hint: "Flat-lay product photo — white/transparent bg", ratioColor: "bg-blue-50 text-blue-700 border-blue-100"
        },
        {
            key: "modelImage", label: "Final Portrait styled Model", val: modelImage, isModel: true,
            ratio: "2 : 3", size: "800 × 1200 px", hint: "Full-body portrait — shown large on the RIGHT side of banner", ratioColor: "bg-violet-50 text-violet-700 border-violet-100"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                    <RefreshCw className="h-8 w-8 text-black animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Loading Visual Labs...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8 text-left relative">

            {/* File picker input (Hidden) */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="max-w-6xl mx-auto flex flex-col gap-6">

                {/* Back Nav Link */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/admin/banner"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Showcase Overview</span>
                    </Link>
                </div>

                {/* Banner Header Info */}
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1 w-fit">
                    {[
                        { id: "men", label: "Men Collection" },
                        { id: "women", label: "Women Collection" },
                        { id: "kids", label: "Kids Collection" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleCategoryChange(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeCategory === tab.id
                                    ? "bg-black text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Central Canvas Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Panel: Content Forms */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5"
                        >
                            <div className="border-b border-slate-100 pb-4 mb-1 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                                        Showcase Copy
                                    </h2>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Configure overlay headers and redirect actions.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsActive(!isActive)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${isActive
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                            : "bg-red-50 text-red-700 border-red-100"
                                        }`}
                                >
                                    {isActive ? (
                                        <>
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="h-3.5 w-3.5" />
                                            <span>Fallback</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subtitle Badge</label>
                                    <input
                                        type="text"
                                        value={subtitle}
                                        onChange={(e) => setSubtitle(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paragraph description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all resize-none font-semibold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Button Copy</label>
                                        <input
                                            type="text"
                                            value={buttonText}
                                            onChange={(e) => setButtonText(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all font-semibold"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                            <Link2 className="h-3 w-3" /> Redirect URL
                                        </label>
                                        <input
                                            type="text"
                                            value={buttonLink}
                                            onChange={(e) => setButtonLink(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all font-semibold"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full mt-3 bg-black hover:bg-zinc-900 disabled:bg-slate-400 text-white font-bold text-xs py-3.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    <span>{saving ? "Saving Details..." : `Update ${activeCategory.toUpperCase()} Content`}</span>
                                </button>
                            </form>
                        </motion.div>

                    </div>

                    {/* Right Panel: Showcase visual cards */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-slate-600" />
                                    Showcase Visual Assets
                                </h2>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    Upload and edit the fit collage pieces and campaign portrait model. Files save statically onto local server disk.
                                </p>
                            </div>

                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                {imageCards.map((card) => {
                                    const filename = card.val ? card.val.split("/").pop() : "";
                                    const isSeeded = card.val && card.val.startsWith("http");

                                    return (
                                        <div
                                            key={card.key}
                                            className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-4 group relative hover:bg-slate-50 transition-all duration-300 hover:shadow-md hover:border-slate-200"
                                        >
                                            {/* Top Label */}
                                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-normal block">
                                                {card.label}
                                            </span>

                                            {/* Preview Thumbnail — fixed square, object-contain so any ratio fits cleanly */}
                                            <div className="w-full h-[200px] rounded-2xl bg-white border border-slate-100 overflow-hidden relative flex items-center justify-center p-3 group shadow-sm select-none">
                                                {card.val ? (
                                                    <>
                                                        <img
                                                            src={card.val.startsWith("http") ? card.val : `${API_BASE_URL}${card.val}`}
                                                            alt={card.label}
                                                            className="max-h-full max-w-full object-contain"
                                                            onError={(e) => { e.target.src = "https://placehold.co/200x200/f8fafc/a1a1aa?text=No+Image"; }}
                                                        />

                                                        {/* Hover overlay */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                                                            <button
                                                                onClick={() => setLightboxImage(card.val.startsWith("http") ? card.val : `${API_BASE_URL}${card.val}`)}
                                                                className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow transition-all cursor-pointer hover:scale-105"
                                                                title="Zoom Preview"
                                                            >
                                                                <Maximize2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-slate-300">
                                                        <ImageIcon className="h-8 w-8 stroke-[1.25]" />
                                                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Empty Slot</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Asset Specs + Ratio Guide */}
                                            <div className="flex flex-col gap-2 border-t border-slate-100/60 pt-3">

                                                {/* Ratio badge row */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${card.ratioColor}`}>
                                                        ⬜ {card.ratio}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-500 tracking-wide">
                                                        {card.size}
                                                    </span>
                                                </div>

                                                {/* Hint line */}
                                                <p className="text-[9px] text-slate-400 leading-snug font-medium">
                                                    💡 {card.hint}
                                                </p>

                                                {/* File info if uploaded */}
                                                {card.val && (
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[9px] text-slate-700 font-bold block truncate" title={filename}>
                                                            {filename}
                                                        </span>
                                                        <span className="text-[8px] text-slate-400 block tracking-wide uppercase font-extrabold">
                                                            {isSeeded ? "Cloud Asset" : "Local Disk"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action buttons row */}
                                            <div className="flex flex-col gap-2 mt-1">
                                                <div className="grid grid-cols-3 gap-2">
                                                    {/* Upload file */}
                                                    <button
                                                        type="button"
                                                        onClick={() => triggerReplace(card.key)}
                                                        disabled={saving}
                                                        className="col-span-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[10px] font-bold bg-white border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer text-slate-700 active:scale-95 disabled:opacity-50"
                                                        title="Upload file from device"
                                                    >
                                                        <Upload className="h-3.5 w-3.5" />
                                                        <span>Upload</span>
                                                    </button>

                                                    {/* Paste URL toggle */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setLinkInputField(linkInputField === card.key ? "" : card.key);
                                                            setLinkInputValue(card.val?.startsWith("http") ? card.val : "");
                                                        }}
                                                        disabled={saving}
                                                        className={`col-span-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer active:scale-95 disabled:opacity-50 ${
                                                            linkInputField === card.key
                                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                                : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                                                        }`}
                                                        title="Paste image URL"
                                                    >
                                                        <LinkIcon className="h-3.5 w-3.5" />
                                                        <span>URL</span>
                                                    </button>

                                                    {/* Remove */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(card.key)}
                                                        disabled={!card.val || saving}
                                                        className="col-span-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[10px] font-bold bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-500 transition-all cursor-pointer active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                                                        title="Remove image"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>

                                                {/* URL input — shown inline when Paste URL is active */}
                                                <AnimatePresence>
                                                    {linkInputField === card.key && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="flex gap-2 mt-1">
                                                                <input
                                                                    type="url"
                                                                    value={linkInputValue}
                                                                    onChange={(e) => setLinkInputValue(e.target.value)}
                                                                    placeholder="https://example.com/image.jpg"
                                                                    className="flex-1 text-[10px] font-medium px-3 py-2 rounded-xl border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-indigo-50 text-slate-800 placeholder-slate-400"
                                                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleLinkApply(card.key); } }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleLinkApply(card.key)}
                                                                    disabled={saving || !linkInputValue.trim()}
                                                                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                            <p className="text-[8px] text-slate-400 mt-1 font-medium">Paste a direct image URL (jpg, png, webp). Press Enter or click Apply.</p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>

                    </div>

                </div>

            </div>

            {/* Lightbox Zoom Overlay Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-white border border-white/10 shadow-2xl p-4 flex items-center justify-center"
                        >
                            <button
                                onClick={() => setLightboxImage(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white z-10 cursor-pointer shadow-sm backdrop-blur-sm"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <img
                                src={lightboxImage}
                                alt="High res zoom view"
                                className="max-w-full max-h-[75vh] object-contain rounded-2xl"
                                onError={(e) => { e.target.src = "https://placehold.co/300x400/f8fafc/a1a1aa?text=Image+Load+Error"; }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminEditBannerPage;
