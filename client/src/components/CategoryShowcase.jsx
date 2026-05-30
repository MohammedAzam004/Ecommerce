import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProducts } from "../services/productService";

const CategoryShowcase = ({ title, dbCategory, shopLink, badge, accentColor = "#000000" }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch4 = async () => {
            try {
                const data = await getProducts("", dbCategory, "", "", "", "true", "4");
                setProducts(data.products || []);
            } catch (err) {
                console.error("CategoryShowcase fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch4();
    }, [dbCategory]);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden group">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-black text-[15px] leading-tight">{title}</h3>
                    {badge && (
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 block" style={{ color: accentColor }}>
                            {badge}
                        </span>
                    )}
                </div>
            </div>

            {/* 2×2 Product Grid */}
            <div className="px-4 pb-3 flex-1">
                {loading ? (
                    <div className="grid grid-cols-2 gap-2.5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                        {products.slice(0, 4).map((product) => (
                            <Link
                                key={product._id}
                                to={`/product/${product._id}`}
                                className="group/item flex flex-col gap-1.5"
                            >
                                <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 group-hover/item:border-slate-200 transition-all duration-200">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-contain p-3 mix-blend-multiply group-hover/item:scale-[1.06] transition-transform duration-300"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 leading-tight truncate px-0.5 group-hover/item:text-slate-800 transition-colors">
                                    {product.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer link */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 mt-auto">
                <Link
                    to={shopLink}
                    className="flex items-center justify-center gap-2 w-full bg-black hover:bg-zinc-900 text-white font-bold text-xs py-3 px-4 transition-all duration-200 group/btn"
                >
                    <span>Explore More</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
            </div>
        </div>
    );
};

export default CategoryShowcase;
