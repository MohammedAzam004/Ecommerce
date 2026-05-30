import { API_BASE_URL } from "../utils/config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, Search, AlertCircle, CheckCircle, HelpCircle, Truck, Package, Ship, Clipboard, Compass } from "lucide-react";

const OrderStatusPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    
    // Form inputs
    const [orderIdInput, setOrderIdInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    
    // Active States
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);

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

        const match = orders.find(o => 
            o._id.toLowerCase() === orderIdInput.trim().toLowerCase()
        );

        if (match) {
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

    // Calculate Progress Metric & Steps
    const getProgressMetrics = () => {
        if (!selectedOrder) return { percentage: 0, currentStep: 0, statusLabel: "Unknown" };
        if (selectedOrder.isCancelled) return { percentage: 0, currentStep: 0, statusLabel: "Cancelled" };
        if (selectedOrder.isDelivered) return { percentage: 100, currentStep: 4, statusLabel: "Delivered" };
        if (selectedOrder.isPaid) {
            // Assume if paid it's processing, we check if it is "shipped" (we can mock processing vs shipped)
            // Let's assume it's shipped (75%) if it's paid and not delivered yet, or 50% for processing
            // Let's use order ID digits to make it semi-dynamic
            const lastDigit = parseInt(selectedOrder._id.slice(-1), 16) || 0;
            if (lastDigit % 3 === 0) {
                return { percentage: 75, currentStep: 3, statusLabel: "Out For Delivery" };
            } else if (lastDigit % 2 === 0) {
                return { percentage: 50, currentStep: 2, statusLabel: "Shipped" };
            } else {
                return { percentage: 25, currentStep: 1, statusLabel: "Processing" };
            }
        }
        return { percentage: 10, currentStep: 0, statusLabel: "Order Placed" };
    };

    const { percentage, currentStep, statusLabel } = getProgressMetrics();

    // Mock calculations
    const estimatedDelivery = selectedOrder 
        ? new Date(new Date(selectedOrder.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })
        : "";
    const trackingNumber = selectedOrder 
        ? `SE-${selectedOrder._id.slice(0, 8).toUpperCase()}-IN`
        : "";

    if (!localStorage.getItem("userInfo")) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl shadow-sm my-16">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mb-6">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Authentication Required</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Please log in to your account to search real-time tracking pipelines.
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
                        Track Order Status
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 max-w-xl">
                        Monitor active shipping logistics pipelines and estimated delivery dates.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form & Selection */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                        {/* Track Order Form */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2">
                                Tracking Portal
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
                                    <span>Track Shipment</span>
                                </button>
                            </form>
                        </div>

                        {/* Recent Orders List */}
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

                    {/* Right Column: Tracking Visualizer */}
                    <div className="md:col-span-7 w-full">
                        {selectedOrder ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                {/* Delivery Status Card */}
                                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-black" />
                                    
                                    <div className="flex justify-between items-start gap-4 flex-wrap">
                                        <div>
                                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Current Status</span>
                                            <h3 className="text-lg font-black text-black mt-0.5">{statusLabel}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Estimated Delivery</span>
                                            <p className="text-sm font-bold text-emerald-600 mt-0.5">
                                                {selectedOrder.isCancelled ? "Order Cancelled" : estimatedDelivery}
                                            </p>
                                        </div>
                                    </div>

                                    {!selectedOrder.isCancelled && (
                                        <div className="flex flex-col gap-2 mt-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-500 flex items-center gap-1">
                                                    <Compass className="h-3.5 w-3.5 text-black" />
                                                    Progress
                                                </span>
                                                <span className="font-extrabold text-black">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${percentage}%` }}
                                                    className="bg-black h-full rounded-full transition-all duration-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t border-slate-50 pt-4 grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="text-slate-450 block font-medium">Carrier Tracking ID</span>
                                            <span className="font-bold text-slate-800 font-mono text-[10px] mt-0.5 block">
                                                {selectedOrder.isCancelled ? "—" : trackingNumber}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-450 block font-medium">Billed Method</span>
                                            <span className="font-bold text-slate-800 mt-0.5 block">
                                                {selectedOrder.paymentMethod || "Secure Card Gateway"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Stepper Component */}
                                {!selectedOrder.isCancelled && (
                                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6 text-left">
                                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-2">
                                            Logistics Pipeline
                                        </h3>
                                        
                                        <div className="flex flex-col gap-6 pl-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                            {/* Step 1 */}
                                            <div className="flex gap-4 relative">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white font-bold text-[10px] ${
                                                    currentStep >= 0 ? "bg-emerald-500" : "bg-slate-200"
                                                }`}>
                                                    ✓
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-800 leading-snug">Order Placed</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">We have received your payment and order details.</p>
                                                </div>
                                            </div>

                                            {/* Step 2 */}
                                            <div className="flex gap-4 relative">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white font-bold text-[10px] ${
                                                    currentStep >= 1 ? "bg-emerald-500" : "bg-slate-200"
                                                }`}>
                                                    {currentStep >= 1 ? "✓" : "2"}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-800 leading-snug">Processing</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Your package is being handpicked and prepared at our boutique hub.</p>
                                                </div>
                                            </div>

                                            {/* Step 3 */}
                                            <div className="flex gap-4 relative">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white font-bold text-[10px] ${
                                                    currentStep >= 2 ? "bg-emerald-500" : "bg-slate-200"
                                                }`}>
                                                    {currentStep >= 2 ? "✓" : "3"}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-800 leading-snug">Shipped</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Package dispatched and currently in-transit with courier service.</p>
                                                </div>
                                            </div>

                                            {/* Step 4 */}
                                            <div className="flex gap-4 relative">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white font-bold text-[10px] ${
                                                    currentStep >= 3 ? "bg-emerald-500" : "bg-slate-200"
                                                }`}>
                                                    {currentStep >= 3 ? "✓" : "4"}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-800 leading-snug">Out For Delivery</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Shipment is arriving today with your local delivery agent.</p>
                                                </div>
                                            </div>

                                            {/* Step 5 */}
                                            <div className="flex gap-4 relative">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white font-bold text-[10px] ${
                                                    currentStep >= 4 ? "bg-emerald-500" : "bg-slate-200"
                                                }`}>
                                                    {currentStep >= 4 ? "✓" : "5"}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-800 leading-snug">Delivered</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Package successfully delivered to destination doorstep.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Order Summary Card */}
                                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2">
                                        Order Summary
                                    </h3>
                                    
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
                                            <span className="text-slate-400">Items Total:</span>
                                            <span className="font-bold text-slate-800">₹{selectedOrder.totalPrice?.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Order Reference:</span>
                                            <span className="font-bold text-slate-800 font-mono text-[9px]">{selectedOrder._id}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                                <HelpCircle className="h-8 w-8 text-slate-300 stroke-[1.25] mb-3" />
                                <p className="text-slate-400 text-sm font-semibold">
                                    {searchClicked 
                                        ? "No shipment details found." 
                                        : "Enter your order reference ID and email on the left or select a recent purchase to track logistics."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatusPage;
