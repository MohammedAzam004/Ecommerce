import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Lock, 
  ShoppingBag, 
  Sparkles, 
  Percent, 
  ShieldCheck, 
  ArrowLeft, 
  Truck,
  TrendingUp
} from "lucide-react";

const CartPage = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const hasOutOfStockItem = cartItems.some((item) => !item.countInStock || item.countInStock <= 0);

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/shop");
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item._id !== id
    );
    setCartItems(updatedCart);
    toast.success("✓ Item Removed From Cart");
  };

  const updateQtyHandler = (id, newQty) => {
    const item = cartItems.find((x) => x._id === id);
    if (newQty < 1) return;
    if (item.countInStock && newQty > item.countInStock) {
        toast.error(`✗ Only ${item.countInStock} items available in stock.`);
        return;
    }
    const updatedCart = cartItems.map(
        (x) => x._id === id ? { ...x, qty: newQty } : x
    );
    setCartItems(updatedCart);
  };

  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingFee = subtotalPrice > 999 || subtotalPrice === 0 ? 0 : 99;
  const estimatedTax = Math.floor(subtotalPrice * 0.18); // 18% GST included or shown for info
  const finalTotalPrice = subtotalPrice + shippingFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode) return;
    const code = promoCode.toUpperCase().trim();
    if (code === "LUXURY10" || code === "WELCOME10") {
      setAppliedPromo(code);
      toast.success(`✓ Code "${code}" active! 10% Cashpoint Credits will be applied post-order.`);
      setPromoCode("");
    } else {
      toast.error("✗ Invalid promotional code");
    }
  };

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min((subtotalPrice / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = freeShippingThreshold - subtotalPrice;

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.25 } }
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.1, type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 bg-[#FAFAFA] min-h-[80vh]"
    >
      {/* Header and Back Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6 gap-4">
        <div className="text-left">
          <a 
            href="#"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black mb-3 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Boutique
          </a>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Shopping Bag
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            {cartItems.length === 0 
              ? "Your premium selection is currently empty." 
              : `You have selected ${cartItems.length} curated ${cartItems.length === 1 ? 'masterpiece' : 'masterpieces'}.`
            }
          </p>
        </div>

        {/* Free Shipping Indicator (Premium feature) */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm w-full md:w-80 text-left flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-black" />
                {shippingFee === 0 ? "Free Shipping Unlocked!" : "Standard Shipping"}
              </span>
              <span className="font-bold text-slate-400">
                {shippingFee === 0 ? "100%" : `₹${subtotalPrice} / ₹${freeShippingThreshold}`}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-black h-full rounded-full"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {shippingFee === 0 ? (
                <span className="text-emerald-600 font-semibold">Your luxury essentials ship complimentary.</span>
              ) : (
                <span>Add <strong className="text-black">₹{amountToFreeShipping.toLocaleString("en-IN")}</strong> more for complimentary delivery.</span>
              )}
            </p>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Elevated Premium Empty State Layout */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-lg mx-auto bg-white border border-dashed border-slate-200/80 rounded-3xl shadow-sm my-8"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-black/5 rounded-full blur-xl scale-150 animate-pulse" />
            <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
              <ShoppingBag className="h-9 w-9 text-slate-400 stroke-[1.25]" />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-1 -right-1 bg-black text-white p-1 rounded-full shadow-md"
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-black mb-2.5">
            Your Cart is Empty
          </h2>
          
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
            Experience our premium craftsmanship. Explore our exclusive catalog of bespoke collections and find your next signature piece.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/15 transition-all duration-200 active:scale-[0.98]"
          >
            <span>Explore Collections</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Premium Curation Suggestions */}
          <div className="w-full border-t border-slate-100 mt-12 pt-8 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-4">
              <TrendingUp className="h-3.5 w-3.5 text-black" />
              Trending Curated Categories
            </span>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/shop/men" 
                className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl transition-all duration-200 group text-xs font-bold text-black flex justify-between items-center"
              >
                <span>Men's Fashion</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link 
                to="/shop/women" 
                className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl transition-all duration-200 group text-xs font-bold text-black flex justify-between items-center"
              >
                <span>Women's Fashion</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Premium 2-Column Split Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Item Details
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 hidden sm:block">
                Subtotal
              </span>
            </div>

            <motion.div layout className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => {
                  const isLowStock = item.countInStock && item.countInStock <= 5;
                  
                  return (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="group bg-white rounded-3xl border border-slate-100/90 p-5 shadow-[0_4px_20px_-4px_rgba(0, 0, 0, 0.08)] hover:shadow-[0_12px_30px_-6px_rgba(0, 0, 0, 0.12)] hover:border-slate-200/60 transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-4 text-left relative overflow-hidden"
                    >
                      {/* Interactive visual stripe bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-black transition-colors duration-300" />

                      {/* Product Thumbnail & Details Info */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 flex-1 w-full">
                        <Link 
                          to={`/product/${item._id}`}
                          className="w-32 sm:w-40 h-32 sm:h-40 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 flex-shrink-0 group-hover:shadow-inner transition-shadow relative overflow-hidden"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
      
                        <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-center">
                          <h3 className="font-bold text-slate-900 text-base leading-snug tracking-tight hover:text-black transition-colors">
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                          </h3>
                          
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full">
                              {item.category || "Curated"}
                            </span>
                            
                            {/* Visual Stock Badge */}
                            {item.countInStock ? (
                              isLowStock ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Only {item.countInStock} Left
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  In Stock
                                </span>
                              )
                             ) : (
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EF4444] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full w-max">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  Out of Stock
                                </span>
                                <span className="text-red-500 text-[10px] font-bold">
                                  Please remove this item to checkout
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
      
                      {/* Price, Quantity and Actions Block */}
                      <div className="flex flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0">
                        
                        {/* Price Breakdown */}
                        <div className="text-left sm:text-right flex flex-col justify-center">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Unit Price</span>
                          <span className="text-sm font-bold text-slate-700">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                        </div>
      
                        {/* Quantity Controls (Framer Motion Enhanced) */}
                        <div className="flex items-center bg-slate-50 border border-slate-200 p-2 rounded-2xl shadow-sm">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQtyHandler(item._id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-14 h-14 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                            title="Decrease quantity"
                          >
                            <Minus className="h-7 w-7 stroke-[4]" />
                          </motion.button>
                          
                          <span className="text-xl font-black text-black w-14 text-center select-none">
                            {item.qty}
                          </span>
                          
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQtyHandler(item._id, item.qty + 1)}
                            disabled={item.countInStock && item.qty >= item.countInStock}
                            className="w-14 h-14 rounded-xl bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                            title="Increase quantity"
                          >
                            <Plus className="h-7 w-7 stroke-[4]" />
                          </motion.button>
                        </div>

                        {/* Calculated Subtotal per Item (Visual polish) */}
                        <div className="text-right hidden sm:flex flex-col justify-center min-w-[70px]">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-black block mb-0.5">Subtotal</span>
                          <span className="text-sm font-extrabold text-black">
                            ₹{(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                        </div>
      
                        {/* Trash Action */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeFromCart(item._id)}
                          className="p-2.5 text-slate-400 hover:text-[#EF4444] hover:bg-red-50/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                          title="Remove item"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Right Column: Sticky Summary Panel */}
          <motion.div 
            variants={sidebarVariants}
            className="lg:col-span-4 lg:sticky lg:top-24 z-10 self-start w-full"
          >
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_30px_-6px_rgba(0, 0, 0, 0.10)] flex flex-col gap-6 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-black" />

              <h3 className="text-base font-bold text-black border-b border-slate-50 pb-4 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-black" />
                <span>Order Summary</span>
              </h3>
      
              {/* Itemized pricing block */}
              <div className="flex flex-col gap-3.5">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Bag Subtotal</span>
                  <span className="text-black font-bold">₹{subtotalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    Estimated GST
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200/50 px-1.5 py-0.2 rounded">18%</span>
                  </span>
                  <span className="text-slate-900 font-semibold">₹{estimatedTax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Delivery Charges</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold text-xs bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Free</span>
                    ) : (
                      <span className="text-black font-bold">₹{shippingFee}</span>
                    )}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center text-sm font-medium text-emerald-600 bg-emerald-50/50 border border-emerald-100 rounded-xl px-3 py-2">
                    <span className="flex items-center gap-1 text-xs font-bold">
                      <Percent className="h-3.5 w-3.5" />
                      Promo Activated ({appliedPromo})
                    </span>
                    <span className="text-xs font-extrabold">10% Cash Credit</span>
                  </div>
                )}

                <div className="border-t border-slate-100 mt-2.5 pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] font-extrabold text-black block uppercase tracking-widest mb-0.5">Total Value</span>
                    <span className="text-xs font-bold text-slate-400">Order Subtotal + Delivery</span>
                  </div>
                  <span className="text-2xl font-black text-black tracking-tight">
                    ₹{finalTotalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="border-t border-slate-50 pt-4 flex flex-col gap-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. LUXURY10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-xs font-semibold focus:border-black outline-none transition-all placeholder:text-slate-400 shadow-none uppercase"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    Apply
                  </motion.button>
                </div>
              </form>
      
              {/* Checkout CTA */}
              <div className="flex flex-col gap-3.5 mt-2">
                {hasOutOfStockItem ? (
                  <button
                    type="button"
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-400 border border-slate-200 font-bold text-sm rounded-2xl py-4 select-none cursor-not-allowed"
                  >
                    <Lock className="h-4 w-4 text-slate-400" />
                    <span>Proceed to Checkout (Out of Stock Items)</span>
                  </button>
                ) : (
                  <Link
                    to="/checkout"
                    className="group w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm rounded-2xl py-4 shadow-md shadow-slate-950/10 transition-all duration-200 active:scale-[0.98] select-none cursor-pointer"
                  >
                    <Lock className="h-4 w-4 text-white" />
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                
                <a
                  href="#"
                  onClick={handleBack}
                  className="text-center text-xs font-bold text-slate-400 hover:text-black py-1 transition-colors flex items-center justify-center gap-1.5 group"
                >
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  Continue Shopping
                </a>
              </div>

              {/* Secure checkout assurance */}
              <div className="border-t border-slate-50 pt-4 flex items-center justify-center gap-2.5 text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Guaranteed Secure Checkout
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;