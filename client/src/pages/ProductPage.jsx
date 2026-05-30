import { useEffect, useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService.js";
import ReviewForm from "../components/ReviewForm";
import { CartContext } from "../context/CartContext";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { extractErrorMessage } from "../utils/errorHelper";
import { Star, ShieldCheck, Truck, RotateCcw, ShoppingBag, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { cartItems, setCartItems } = useContext(CartContext);

    const fetchProduct = useCallback(async () => {
        await Promise.resolve();
        setLoading(true);
        try {
            const data = await getProductById(id);
            setProduct(data);
            
            // Fetch related products dynamically by category
            if (data && data.category) {
                const relatedData = await getProducts("", data.category, "", "", "");
                const relatedList = relatedData.products || (relatedData.data && relatedData.data.products) || [];
                // Filter out the current active product
                const filtered = relatedList.filter(item => item._id !== data._id).slice(0, 4);
                setRelatedProducts(filtered);
            }
        } catch (error) {
            console.error("Fetch product error:", error);
            const errMsg = extractErrorMessage(error, "Product Not Found");
            toast.error("✗ " + errMsg);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        Promise.resolve().then(() => {
            fetchProduct();
        });
    }, [fetchProduct]);

    if (loading) {
        return <Loader text="Retrieving product details..." />;
    }

    if (!product) {
        return (
            <EmptyState
                title="Product Not Found"
                message="We couldn't retrieve the specifications for the selected product."
                icon="default"
                buttonText="Browse Catalog"
                buttonLink="/"
            />
        );
    }

    const addToCartHandler = () => {
        if (product.countInStock === 0) {
            toast.error("✗ Product Out Of Stock");
            return;
        }

        const existItem = cartItems.find(
            (item) => item._id === product._id
        );

        if (existItem) {
            const newQty = existItem.qty + qty;
            if (newQty > product.countInStock) {
                toast.error("✗ Not Enough Stock Available");
                return;
            }
            const updatedCart = cartItems.map(
                (item) =>
                    item._id === product._id
                        ? {
                            ...item,
                            qty: newQty,
                        }
                        : item
            );

            setCartItems(updatedCart);
        } else {
            setCartItems([
                ...cartItems,
                {
                    ...product,
                    qty: qty,
                },
            ]);
        }

        toast.success("✓ Product Added Successfully");
    };

    const buyNowHandler = () => {
        if (product.countInStock === 0) {
            toast.error("✗ Product Out Of Stock");
            return;
        }

        const existItem = cartItems.find(
            (item) => item._id === product._id
        );

        if (existItem) {
            const newQty = existItem.qty + qty;
            if (newQty > product.countInStock) {
                const updatedCart = cartItems.map(
                    (item) =>
                        item._id === product._id
                            ? {
                                ...item,
                                qty: product.countInStock,
                              }
                            : item
                );
                setCartItems(updatedCart);
            } else {
                const updatedCart = cartItems.map(
                    (item) =>
                        item._id === product._id
                            ? {
                                ...item,
                                qty: newQty,
                              }
                            : item
                );
                setCartItems(updatedCart);
            }
        } else {
            setCartItems([
                ...cartItems,
                {
                    ...product,
                    qty: qty,
                },
            ]);
        }
        
        navigate("/checkout");
    };

    // Render precise vector star reviews
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(
                    <div key={i} className="relative inline-block">
                        <Star className="h-4 w-4 text-slate-200 fill-slate-200" />
                        <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} className="h-4 w-4 text-slate-200 fill-slate-200" />);
            }
        }
        return stars;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-16 bg-[#FAFAFA]">
            
            {/* Split Product Main View: Image Gallery left, Buy panel right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* 1. Large Product Gallery Image (Left Column - 55% Width on Desktop) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="relative aspect-square w-full rounded-2xl border border-slate-100 bg-white shadow-premium p-8 flex items-center justify-center overflow-hidden">
                        
                        {/* Overlay Badge */}
                        <div className="absolute top-4 left-4 z-10">
                            {product.countInStock === 0 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-100">
                                    Out of Stock
                                </span>
                            ) : product.countInStock <= 5 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-500 border border-amber-100 animate-pulse">
                                    Low Stock: {product.countInStock} Left
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-500 border border-emerald-100">
                                    In Stock
                                </span>
                            )}
                        </div>

                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-[90%] max-w-[90%] object-contain mix-blend-multiply hover:scale-[1.02] transition-transform duration-300"
                        />
                    </div>
                </div>

                {/* 2. Premium Product Information (Right Column - 45% Width on Desktop) */}
                <div className="lg:col-span-5 flex flex-col gap-6 text-left">
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full w-fit">
                            {product.category || "General"}
                        </span>
                        
                        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-black leading-tight">
                            {product.name}
                        </h1>

                        {/* Star Rating list */}
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                                {renderStars(product.rating || 0)}
                            </div>
                            <span className="text-sm font-semibold text-slate-800 ml-1">
                                {product.rating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold border-l border-slate-200 pl-2">
                                {(product.reviews || []).length} Reviews
                            </span>
                        </div>
                    </div>

                    {/* Price and Stock status block */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-4">
                        <div>
                            <span className="text-xs text-slate-400 font-semibold block">Total Price</span>
                            <span className="text-3xl font-extrabold text-black">
                                ₹{product.price.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                            {product.description}
                        </p>
                    </div>

                    {/* Shopping Buy CTA Panel */}
                    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col gap-5">
                        
                        {/* Selector elements (Quantity drop-down) */}
                        {product.countInStock > 0 && (
                            <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-4">
                                <span className="text-sm font-bold text-slate-700">Quantity</span>
                                <div className="relative">
                                    <select
                                        id="qty-select"
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        className="appearance-none pr-10 pl-4 py-2 rounded-xl border border-slate-200 focus:border-black focus:ring-4 focus:ring-black/5 text-sm text-[#111827] bg-white outline-none cursor-pointer font-bold shadow-sm"
                                    >
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons: Add to Cart & Buy Now */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={addToCartHandler}
                                disabled={product.countInStock === 0}
                                className="flex-1 py-3.5 font-bold text-sm text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag className="h-4 w-4 text-slate-500" />
                                <span>Add To Cart</span>
                            </button>
                            <button
                                onClick={buyNowHandler}
                                disabled={product.countInStock === 0}
                                className="flex-1 py-3.5 font-bold text-sm text-white bg-black hover:bg-zinc-900 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                            >
                                <span>Buy Now</span>
                            </button>
                        </div>
                    </div>

                    {/* Features list value propositions */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 shadow-sm">
                            <Truck className="h-5 w-5 text-black" />
                            <span className="text-[10px] font-bold text-slate-800">Free Shipping</span>
                        </div>
                        <div className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 shadow-sm">
                            <RotateCcw className="h-5 w-5 text-amber-500" />
                            <span className="text-[10px] font-bold text-slate-800">7-Day Return</span>
                        </div>
                        <div className="p-3 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 shadow-sm">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-800">100% Safe Pay</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* 3. Review Section Redesign */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-slate-100 pt-12 items-start text-left">
                
                {/* Reviews List Column (7/12 Width) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                            Customer Reviews
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Read reviews from verified purchasers of this item.</p>
                    </div>

                    {(product.reviews || []).length === 0 ? (
                        <div className="p-8 bg-slate-50 border border-dashed border-slate-200/80 rounded-2xl text-center">
                            <p className="text-slate-400 text-sm">No reviews yet. Be the first to share your product experience!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {(product.reviews || []).map((review) => (
                                <div
                                    key={review._id}
                                    className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 text-left"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                                            <div className="flex items-center gap-1 mt-1">
                                                {renderStars(review.rating || 0)}
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                            Verified
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Star rating selector input form Column (5/12 Width) */}
                <div className="lg:col-span-5">
                    <ReviewForm
                        productId={product._id}
                        onReviewAdded={fetchProduct}
                    />
                </div>

            </div>

            {/* 4. Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="border-t border-slate-100 pt-12 flex flex-col gap-6 text-left">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                            Related Products
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">Other luxury models within the same department.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {relatedProducts.map((item) => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductPage;