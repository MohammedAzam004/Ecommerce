import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { ArrowLeft, Package, DollarSign, Image, Tag, Clipboard, Layers, Minus, Plus } from "lucide-react";

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchProduct = useCallback(async () => {
        setLoading(true);
        try {
            const data = await axios.get(
                `${API_BASE_URL}/api/products/${id}`
            );

            setName(data.data.name || "");
            setPrice(data.data.price || "");
            setImage(data.data.image || "");
            setCategory(data.data.category || "");
            setDescription(data.data.description || "");
            setCountInStock(data.data.countInStock || "");
        } catch (error) {
            console.error("Error fetching product details:", error);
            toast.error("✗ Error fetching product details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const userInfo = JSON.parse(
            localStorage.getItem("userInfo")
        );

        if (!userInfo || !userInfo.user || !userInfo.user.isAdmin) {
            navigate("/");
        } else {
            Promise.resolve().then(() => {
                fetchProduct();
            });
        }
    }, [navigate, fetchProduct]);

    const updateHandler = async (e) => {
        e.preventDefault();

        try {
            const userInfo = JSON.parse(
                localStorage.getItem("userInfo")
            );

            await axios.put(
                `${API_BASE_URL}/api/products/${id}`,
                {
                    name,
                    price: Number(price),
                    image,
                    category,
                    description,
                    countInStock: Number(countInStock),
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            toast.success("✓ Stock Updated Successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error("Update product failed:", error);
            toast.error("✗ Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8 text-left">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
                
                {/* Back Link Nav */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/admin/products"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Catalog</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_-6px_rgba(0, 0, 0, 0.10)]"
                >
                    <div className="border-b border-slate-100 pb-5 mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                            Edit Product Specifications
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Modify inventory units, public details, or prices for ID: <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">{id}</span>
                        </p>
                    </div>

                    {loading ? (
                        <Loader text="Loading product specifications..." />
                    ) : (
                        <form onSubmit={updateHandler} className="flex flex-col gap-5">
                            
                            {/* 1. Name Input */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Product Name
                                </label>
                                <div className="relative flex items-center">
                                    <Package className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Minimalist Titanium Chrono"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900"
                                    />
                                </div>
                            </div>

                            {/* 2. Grid for Price & Stock */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Price (₹)
                                    </label>
                                    <div className="relative flex items-center">
                                        <DollarSign className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Count In Stock
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <div className="relative flex items-center gap-2">
                                            <motion.button
                                                type="button"
                                                whileTap={{ scale: 0.94 }}
                                                onClick={() => setCountInStock(prev => Math.max(0, Number(prev) - 1))}
                                                className="flex items-center justify-center w-11 h-11 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-colors"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </motion.button>
                                            
                                            <div className="relative flex-1">
                                                <Layers className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                                <input
                                                    type="number"
                                                    value={countInStock}
                                                    onChange={(e) => setCountInStock(e.target.value)}
                                                    required
                                                    className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl text-center focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900"
                                                />
                                            </div>

                                            <motion.button
                                                type="button"
                                                whileTap={{ scale: 0.94 }}
                                                onClick={() => setCountInStock(prev => Number(prev) + 1)}
                                                className="flex items-center justify-center w-11 h-11 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </motion.button>
                                        </div>
                                        
                                        {/* Incremental presets */}
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setCountInStock(prev => Math.max(0, Number(prev) - 5))}
                                                className="flex-1 py-1.5 text-[10px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100/50 rounded-lg transition-colors cursor-pointer justify-center"
                                            >
                                                -5 Units
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCountInStock(prev => Number(prev) + 5)}
                                                className="flex-1 py-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/50 rounded-lg transition-colors cursor-pointer justify-center"
                                            >
                                                +5 Units
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Grid for Image & Category */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Image URL
                                    </label>
                                    <div className="relative flex items-center">
                                        <Image className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="https://images.unsplash.com/..."
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Category
                                    </label>
                                    <div className="relative flex items-center">
                                        <Tag className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Electronics, Clothing"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Description textarea */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Description
                                </label>
                                <div className="relative flex">
                                    <Clipboard className="absolute left-4 top-4 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <textarea
                                        placeholder="Detail the materials, sizing information, or origin of this luxury piece..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows="5"
                                        className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.98 }}
                                className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                Save Product Changes
                            </motion.button>

                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default EditProductPage;

