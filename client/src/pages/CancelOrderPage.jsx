import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, AlertCircle, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import Loader from "../components/Loader";

const CancelOrderPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    
    // Form inputs
    const [orderIdInput, setOrderIdInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    
    // Active Selected Order State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (storedUser) {
            setUserInfo(storedUser);
            fetchUserOrders(storedUser.token);
        }
    }, []);

    const fetchUserOrders = async (token) => {
        setLoadingOrders(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/orders/myorders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching user orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchClicked(true);
        
        if (!orderIdInput.trim() || !emailInput.trim()) {
            toast.error("✗ Please fill in both Order ID and Email fields");
            return;
        }

        // Try to find order in user's fetched list
        const match = orders.find(o => 
            o._id.toLowerCase() === orderIdInput.trim().toLowerCase()
        );

        if (match) {
            // Verify email matches the user email
            const userEmail = userInfo?.user?.email || "";
            if (userEmail.toLowerCase() !== emailInput.trim().toLowerCase()) {
                toast.error("✗ Order ID does not match the associated email address");
                setSelectedOrder(null);
                return;
            }
            setSelectedOrder(match);
        } else {
            setSelectedOrder(null);
            toast.error("✗ Order not found in your purchase history");
        }
    };

    const handleQuickSelect = (order) => {
        setSelectedOrder(order);
        setOrderIdInput(order._id);
        setEmailInput(userInfo?.user?.email || "");
        setSearchClicked(true);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        if (!cancelReason) {
            toast.error("✗ Please select a cancellation reason");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.put(
                `${API_BASE_URL}/api/orders/${selectedOrder._id}/cancel`,
                { reason: cancelReason },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                }
            );
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Cancellation error:", error);
            const msg = error.response?.data?.message || "Cancellation request failed";
            toast.error(`✗ ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Eligibility check logic
    const isEligible = selectedOrder && !selectedOrder.isDelivered && !selectedOrder.isCancelled;

    if (!localStorage.getItem("userInfo")) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl shadow-sm my-16">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mb-6">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Authentication Required</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Please log in to your account to check order eligibility and request cancellations.
                </p>
                <Link 
                    to="/login" 
                    className="w-full bg-black hover:bg-zinc-900 text-white font-bold text-sm py-3.5 rounded-xl transition-all"
                >
                    Log In to Account
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-800 pb-16">
            {/* Hero Section */}
            <section className="bg-white border-b border-slate-100 py-12 text-left">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link 
                        to="/support" 
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black mb-4 transition-colors group"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Support
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
                        Cancel Your Order
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 max-w-xl">
                        Submit a cancellation request for eligible orders. Orders can only be cancelled before they are shipped or delivered.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form & Selection */}
                    <div className="md:col-span-7 flex flex-col gap-6 text-left">
                        {/* Lookup Form */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2">
                                Order Lookup
                            </h3>
                            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter reference ID"
                                        value={orderIdInput}
                                        onChange={(e) => setOrderIdInput(e.target.value)}
                                        className="px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all font-semibold"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="Enter account email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        className="px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all font-semibold"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full mt-2 bg-black hover:bg-zinc-900 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                    <Search className="h-4 w-4" />
                                    <span>Verify Order</span>
                                </button>
                            </form>
                        </div>

                        {/* Quick Selection List */}
                        {orders.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2">
                                    Recent Purchases
                                </h3>
                                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                                    {orders.map((o) => (
                                        <button
                                            key={o._id}
                                            onClick={() => handleQuickSelect(o)}
                                            className={`p-3 border rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                                                selectedOrder?._id === o._id 
                                                    ? "border-black bg-slate-50/50" 
                                                    : "border-slate-100 hover:border-slate-250 bg-white"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <span className="font-mono text-[10px] font-bold text-slate-500 truncate">{o._id}</span>
                                                <span className="text-xs font-bold text-slate-800">
                                                    ₹{o.totalPrice?.toLocaleString("en-IN")} • {new Date(o.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                o.isCancelled 
                                                    ? "text-red-600 bg-red-50 border border-red-100" 
                                                    : o.isDelivered 
                                                        ? "text-slate-500 bg-slate-50 border"
                                                        : "text-emerald-600 bg-emerald-50 border border-emerald-100"
                                            }`}>
                                                {o.isCancelled ? "Cancelled" : o.isDelivered ? "Delivered" : "Active"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details & Action */}
                    <div className="md:col-span-5 w-full text-left">
                        {selectedOrder ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                {/* Order Card Details */}
                                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2">
                                        Order Details
                                    </h3>
                                    
                                    {/* Items list snippet */}
                                    <div className="flex flex-col gap-3">
                                        {selectedOrder.orderItems?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-50 border flex items-center justify-center p-1 shrink-0">
                                                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-slate-800 truncate leading-snug">{item.name}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.qty} × ₹{item.price?.toLocaleString("en-IN")}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-50 pt-4 flex flex-col gap-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Order Date:</span>
                                            <span className="font-bold text-slate-800">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Total Billed:</span>
                                            <span className="font-bold text-black">₹{selectedOrder.totalPrice?.toLocaleString("en-IN")}</span>
                                        </div>
                                    </div>

                                    {/* Eligibility Status */}
                                    <div className={`mt-2 p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-semibold ${
                                        isEligible 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                            : "bg-red-50 text-red-700 border-red-100"
                                    }`}>
                                        {isEligible ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 shrink-0" />
                                                <span>Eligible for Cancellation</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 shrink-0" />
                                                <span>
                                                    {selectedOrder.isCancelled 
                                                        ? "Already Cancelled" 
                                                        : "Not Eligible (Shipped/Delivered)"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Cancellation Reason Form */}
                                {isEligible && (
                                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reason for cancellation</label>
                                            <select
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-black text-xs font-bold bg-white cursor-pointer"
                                            >
                                                <option value="">Select a reason...</option>
                                                <option value="Ordered By Mistake">Ordered By Mistake</option>
                                                <option value="Found Better Price">Found Better Price</option>
                                                <option value="Delivery Taking Too Long">Delivery Taking Too Long</option>
                                                <option value="Changed Mind">Changed Mind</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={isSubmitting}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "Processing..." : "Cancel Order Now"}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                                <HelpCircle className="h-8 w-8 text-slate-300 stroke-[1.25] mb-3" />
                                <p className="text-slate-400 text-sm font-semibold">
                                    {searchClicked 
                                        ? "No verified order selected." 
                                        : "Search your order ID or select a recent purchase on the left to verify cancellation eligibility."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Confirmation Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-sm w-full p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 flex items-center justify-center rounded-full mx-auto mb-4">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-extrabold text-black mb-1.5">Order Cancelled</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                Your order has been successfully cancelled. A confirmation has been registered, and any payment will be refunded to your source account.
                            </p>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    navigate("/support");
                                }}
                                className="w-full bg-black hover:bg-zinc-900 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                            >
                                Back to Support
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CancelOrderPage;
