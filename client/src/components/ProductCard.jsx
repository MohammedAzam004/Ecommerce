import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
    // Generate star icons based on rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />);
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(
                    <div key={i} className="relative inline-block">
                        <Star className="h-3.5 w-3.5 text-slate-200 fill-slate-200" />
                        <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} className="h-3.5 w-3.5 text-slate-200 fill-slate-200" />);
            }
        }
        return stars;
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full relative text-left"
        >
            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 z-10">
                {product.countInStock === 0 ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-100 uppercase tracking-wider">
                        Out of Stock
                    </span>
                ) : product.countInStock <= 5 ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider animate-pulse">
                        Only {product.countInStock} Left
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                        In Stock
                    </span>
                )}
            </div>

            {/* Product Image - Full width at top */}
            <div className="relative aspect-[4/3] sm:aspect-square w-full bg-white overflow-hidden flex items-center justify-center border-b border-slate-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-6 mix-blend-multiply group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" />
            </div>

            <div className="p-4 flex flex-col flex-grow">

                {/* Category tag */}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    {product.category || "Lifestyle"}
                </span>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-black transition-colors duration-200 line-clamp-2 mb-2 min-h-[44px]">
                    <Link to={`/product/${product._id}`}>
                        {product.name}
                    </Link>
                </h3>

                {/* Rating & Brand details */}
                <div className="flex items-center gap-1 mb-2.5">
                    <div className="flex items-center">
                        {renderStars(product.rating || 0)}
                    </div>
                    <span className="text-[11px] text-slate-400 ml-1 font-bold">
                        ({product.rating?.toFixed(1) || "0.0"})
                    </span>
                </div>
            </div>

            <div className="px-4 pb-4 mt-auto">
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    {/* Price */}
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Price</span>
                        <span className="text-lg font-black text-slate-900">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                    </div>

                    {/* View Details button */}
                    <Link
                        to={`/product/${product._id}`}
                        className="inline-flex items-center justify-center gap-1.5 bg-black text-white font-bold text-xs rounded-lg px-4 py-2 hover:bg-zinc-800 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 group/btn"
                    >
                        <span>View</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;