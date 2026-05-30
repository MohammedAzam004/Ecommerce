import { API_BASE_URL } from "../utils/config";
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../services/orderService";
import { createPaymentOrder } from "../services/paymentService";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { extractErrorMessage } from "../utils/errorHelper";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  CreditCard, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  ShoppingBag, 
  Truck,
  Building,
  Hash,
  Globe,
  Wallet
} from "lucide-react";

const CheckoutPage = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online"); // "Online" (Razorpay) vs "COD"
  const [step, setStep] = useState(1); // Step 1: Shipping, Step 2: Payment, Step 3: Review

  const { cartItems, setCartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
      return;
    }
    
    if (step !== 4) {
      if (!cartItems || cartItems.length === 0) {
        navigate("/cart");
        return;
      }
      
      const hasOutOfStock = cartItems.some((item) => !item.countInStock || item.countInStock <= 0);
      if (hasOutOfStock) {
        toast.error("✗ Some items in your cart are out of stock. Please remove them before checkout.");
        navigate("/cart");
      }
    }
  }, [navigate, cartItems, step]);

  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingFee = subtotalPrice > 999 || subtotalPrice === 0 ? 0 : 99;
  const estimatedTax = Math.floor(subtotalPrice * 0.18); // 18% GST display
  const finalTotalPrice = subtotalPrice + shippingFee;

  const isShippingValid = 
    address.trim() !== "" && 
    city.trim() !== "" && 
    postalCode.trim() !== "" && 
    country.trim() !== "";

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );

      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        totalPrice,
      };

      await placeOrder(orderData, userInfo.token);
      toast.success("✓ Order Placed Successfully via Cash on Delivery");
      setCartItems([]);
      localStorage.removeItem("cartItems");
      setStep(4);
    } catch (error) {
      console.error("Order save error:", error);
      const errMsg = extractErrorMessage(error, "Order Saving Failed.");
      toast.error("✗ " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/login");
        return;
      }

      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );

      const order = await createPaymentOrder(totalPrice);
      const { data: { key } } = await axios.get(`${API_BASE_URL}/api/payments/getkey`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Azam Ecommerce",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          setLoading(true);
          try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const totalPrice = cartItems.reduce(
              (acc, item) => acc + item.price * item.qty,
              0
            );

            const orderData = {
              orderItems: cartItems.map((item) => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item._id,
              })),
              shippingAddress: {
                address,
                city,
                postalCode,
                country,
              },
              totalPrice,
              paymentMethod: "Online",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await placeOrder(orderData, userInfo.token);
            toast.success("✓ Payment Verified & Order Placed Successfully");
            setCartItems([]);
            localStorage.removeItem("cartItems");
            setStep(4);
          } catch (error) {
            console.error("Order save error:", error);
            const errMsg = extractErrorMessage(error, "Order Saving Failed.");
            toast.error("✗ " + errMsg);
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: "#000000",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
      toast.error("✗ Payment Failed");
    }
  };

  const executeCheckout = (e) => {
    e.preventDefault();
    if (paymentMethod === "COD") {
      handlePlaceOrder();
    } else {
      handlePayment();
    }
  };

  if (loading) {
    return <Loader text="Processing your order details..." />;
  }

  // Stepper UI helper variables
  const stepTitles = ["Shipping", "Payment", "Review", "Confirmation"];
  const stepIcons = [
    <MapPin key="s1" className="h-4.5 w-4.5" />,
    <CreditCard key="s2" className="h-4.5 w-4.5" />,
    <Check key="s3" className="h-4.5 w-4.5" />,
    <ShieldCheck key="s4" className="h-4.5 w-4.5" />
  ];

  // Motion transitions
  const stepVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 100 : -100,
      transition: { duration: 0.2 }
    })
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10 bg-[#FAFAFA] min-h-[85vh] text-left">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-black">
          Checkout
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete your curated selection with our secure, compliant checkout.
        </p>
      </div>

      {/* Stepper Progress bar */}
      <div className="w-full max-w-2xl mx-auto border border-slate-100 bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between relative">
          {stepTitles.map((title, idx) => {
            const currentIdx = idx + 1;
            const isCompleted = step > currentIdx;
            const isActive = step === currentIdx;

            return (
              <div key={title} className="flex flex-col items-center flex-1 z-10 relative">
                {/* Step Circle */}
                <motion.div 
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    backgroundColor: isCompleted || isActive ? "#000000" : "#FFFFFF",
                    borderColor: isCompleted || isActive ? "#000000" : "#E2E8F0"
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs shadow-sm transition-all duration-200 ${
                    isCompleted || isActive ? "text-white" : "text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepIcons[idx]}
                </motion.div>
                <span className={`text-xs font-bold mt-2 ${isActive ? "text-black" : "text-slate-400"}`}>
                  {title}
                </span>
              </div>
            );
          })}

          {/* Stepper background line */}
          <div className="absolute top-4.5 left-[12%] right-[12%] h-0.5 bg-slate-100 z-0">
            <motion.div 
              animate={{
                width: step === 1 ? "0%" : step === 2 ? "33.3%" : step === 3 ? "66.6%" : "100%"
              }}
              className="h-full bg-black transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Dual Pane Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane: Interactive Step Forms */}
        <div className={step < 4 ? "lg:col-span-7 flex flex-col gap-6 w-full" : "lg:col-span-12 w-full"}>
          <AnimatePresence mode="wait" custom={step}>
            
            {/* Step 1: Shipping Address Form */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-6"
              >
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-black" />
                  Shipping Destination
                </h3>

                <form className="flex flex-col gap-5 text-left">
                  {/* Floating Input: Street Address */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-address" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      Street Address
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      placeholder="e.g. Suite 400, Luxury Towers, MG Road"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 placeholder-slate-350 shadow-sm"
                    />
                  </div>

                  {/* Grid fields for City & Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="checkout-city" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        City / Town
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        placeholder="e.g. Bangalore"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 placeholder-slate-350 shadow-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="checkout-postalcode" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                        Postal Code / ZIP
                      </label>
                      <input
                        id="checkout-postalcode"
                        type="text"
                        placeholder="e.g. 560001"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 placeholder-slate-350 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Floating Input: Country */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-country" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      Country / Region
                    </label>
                    <input
                      id="checkout-country"
                      type="text"
                      placeholder="e.g. India"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 placeholder-slate-350 shadow-sm"
                    />
                  </div>

                  {/* Move to next step trigger */}
                  <button
                    type="button"
                    disabled={!isShippingValid}
                    onClick={() => setStep(2)}
                    className="w-full mt-4 bg-black hover:bg-zinc-900 text-white rounded-2xl py-3.5 shadow-md flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 group active:scale-[0.98]"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Payment Choice Select Card List */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-6"
              >
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-black" />
                    Payment Gateway Options
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-900 inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                </div>

                <div className="flex flex-col gap-4 text-left">
                  {/* Card Option: Online Secure Payment */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    onClick={() => setPaymentMethod("Online")}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                      paymentMethod === "Online"
                        ? "border-black bg-slate-50/50 shadow-sm"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "Online" ? "border-slate-900" : "border-slate-300"
                    }`}>
                      {paymentMethod === "Online" && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-900 text-sm">Secure Online Cards / UPI (Razorpay)</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Lock className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Encrypted</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Complete your purchase instantly. Supports Visa, Mastercard, AMEX, UPI, NetBanking, and popular digital wallets with robust fraud defense.
                      </p>
                      
                      {/* Payment trust logo badge */}
                      <div className="flex items-center gap-2 mt-3.5 opacity-80">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Supported networks:</span>
                        <div className="h-4.5 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-600 uppercase border border-slate-200/50">Visa</div>
                        <div className="h-4.5 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-600 uppercase border border-slate-200/50">Mastercard</div>
                        <div className="h-4.5 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-600 uppercase border border-slate-200/50">UPI</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card Option: Cash on Delivery COD */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    onClick={() => setPaymentMethod("COD")}
                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                      paymentMethod === "COD"
                        ? "border-black bg-slate-50/50 shadow-sm"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "COD" ? "border-slate-900" : "border-slate-300"
                    }`}>
                      {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border px-2 py-0.5 rounded-full uppercase tracking-wider">No Card Req.</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Pay with cash upon arrival. Standard delivery charges apply. Compliant with standard delivery options.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Next step button */}
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full mt-4 bg-black hover:bg-zinc-900 text-white rounded-2xl py-3.5 shadow-md flex items-center justify-center gap-2 transition-all duration-200 group active:scale-[0.98]"
                >
                  <span>Continue to Order Review</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* Step 3: Order Review & Form Submit Page */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-6"
              >
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500 border border-emerald-100 rounded-full p-0.5 bg-emerald-50" />
                    Review Selection
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-900 inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                </div>

                <div className="flex flex-col gap-5 text-left text-sm text-slate-700">
                  {/* Delivery destination card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-xl border border-slate-200/50 mt-0.5">
                        <MapPin className="h-4.5 w-4.5 text-black" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Shipping Destination</span>
                        <strong className="text-slate-950 font-bold block text-sm leading-snug">
                          {address}
                        </strong>
                        <span className="text-xs text-slate-500 leading-normal block mt-0.5">
                          {city}, {postalCode}, {country}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-black hover:text-zinc-700 bg-white border border-slate-200/60 hover:border-slate-300 px-3 py-1.5 rounded-xl transition-all"
                    >
                      Change
                    </button>
                  </div>

                  {/* Selected Payment recap card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-xl border border-slate-200/50 mt-0.5">
                        <Wallet className="h-4.5 w-4.5 text-black" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Payment Method</span>
                        <strong className="text-slate-950 font-bold block text-sm">
                          {paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Secure Online Payment (Razorpay)"}
                        </strong>
                        <span className="text-xs text-slate-500 leading-normal block mt-0.5">
                          {paymentMethod === "COD" 
                            ? "Complete payment in cash when delivered." 
                            : "Fully secure digital payment post-order."}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-black hover:text-zinc-700 bg-white border border-slate-200/60 hover:border-slate-300 px-3 py-1.5 rounded-xl transition-all"
                    >
                      Change
                    </button>
                  </div>

                  {/* Submission and compliance info */}
                  <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      By completing your order, you agree to our standard terms of luxury service and prompt, secure deliveries. We protect your billing detail credentials with highest compliance standards.
                    </p>
                    
                    <button
                      type="button"
                      onClick={executeCheckout}
                      className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm rounded-2xl py-4 shadow-md transition-all duration-200 active:scale-[0.98] select-none cursor-pointer"
                    >
                      <Lock className="h-4 w-4 text-white" />
                      <span>
                        {paymentMethod === "COD" 
                          ? `Complete Checkout (COD: ₹${finalTotalPrice.toLocaleString("en-IN")})`
                          : `Pay and Order (₹${finalTotalPrice.toLocaleString("en-IN")})`}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation screen */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={4}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center max-w-xl mx-auto my-4 gap-6 w-full"
              >
                <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                  <Check className="h-10 w-10 stroke-[2.5]" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Order Confirmed!</h3>
                  <p className="text-sm text-slate-500 mt-2.5 leading-relaxed max-w-sm mx-auto">
                      Thank you for shopping with ShopEsy. Your purchase has been completed, and our dispatchers are packaging your selections.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full border-t border-slate-50 pt-8">
                  <Link
                    to="/myorders"
                    className="flex-1 bg-black hover:bg-zinc-900 text-white font-bold text-sm rounded-xl py-3.5 shadow-md flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 text-center"
                  >
                    <span>View My Orders</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/"
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl py-3.5 shadow-sm transition-all duration-200 active:scale-95 text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Pane: Persistent Order Summary Card */}
        {step < 4 && (
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6 w-full">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_30px_-6px_rgba(0, 0, 0, 0.10)] flex flex-col gap-6 text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-black" />
            
            <h3 className="text-base font-bold text-black border-b border-slate-50 pb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-black" />
              <span>Checkout Items</span>
            </h3>

            {/* Compact items list row display */}
            <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate hover:text-black transition-colors leading-snug">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Quantity: <strong className="text-slate-700">{item.qty}</strong> × ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="border-t border-slate-50 pt-4 flex flex-col gap-3.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Subtotal Value</span>
                <span className="text-slate-900">₹{subtotalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  Estimated GST
                  <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-200/50 px-1 py-0.1 rounded">18%</span>
                </span>
                <span className="text-slate-900">₹{estimatedTax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Standard Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Free</span>
                  ) : (
                    <span className="text-black font-bold">₹{shippingFee}</span>
                  )}
                </span>
              </div>
              
              <div className="border-t border-slate-100 mt-1.5 pt-4 flex justify-between items-end">
                <div>
                  <span className="text-[9px] font-extrabold text-black block uppercase tracking-wider mb-0.5">Grand Total</span>
                  <span className="text-xs text-slate-400 font-medium">Checkout value of items</span>
                </div>
                <span className="text-xl font-black text-black tracking-tight">
                  ₹{finalTotalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Security validation reassurance stamp */}
            <div className="border-t border-slate-50 pt-4 flex items-center justify-center gap-2 text-slate-400">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                100% Secure Checkout Secured
              </span>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default CheckoutPage;
