import { API_BASE_URL } from "../utils/config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, AlertCircle, CheckCircle, HelpCircle, XCircle, Upload } from "lucide-react";

const ReturnProductPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    
    // Form inputs
    const [orderIdInput, setOrderIdInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    
    // Active States
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    
    const [returnReason, setReturnReason] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
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

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
            toast.success(`✓ File "${e.target.files[0].name}" attached successfully`);
        }
    };

    const handleSubmitReturn = async (e) => {
        e.preventDefault();
        if (!selectedOrder) return;
        if (!returnReason) {
            toast.error("✗ Please select a return reason");
            return;
        }

        setIsSubmitting(true);

        const submitData = async (base64Image) => {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.post(
                    `${API_BASE_URL}/api/returns`,
                    {
                        orderId: selectedOrder._id,
                        reason: returnReason,
                        image: base64Image,
                    },
                    config
                );
                setShowSuccessModal(true);
            } catch (error) {
                console.error("Return submit error:", error);
                const errMsg = error.response?.data?.message || "Failed to submit return request.";
                toast.error("✗ " + errMsg);
            } finally {
                setIsSubmitting(false);
            }
        };

        if (uploadedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(uploadedFile);
            reader.onloadend = () => {
                submitData(reader.result);
            };
            reader.onerror = () => {
                toast.error("✗ Failed to read image file.");
                setIsSubmitting(false);
            };
        } else {
            submitData("");
        }
    };

    // Return eligibility window calculation (7 Days after delivery date)
    const checkEligibility = () => {
        if (!selectedOrder) return { eligible: false, message: "" };
        if (selectedOrder.isCancelled) return { eligible: false, message: "Order was cancelled" };
        if (!selectedOrder.isDelivered) return { eligible: false, message: "Order is not delivered yet" };
        
        const deliveryDate = new Date(selectedOrder.deliveredAt || selectedOrder.updatedAt);
        const today = new Date();
        const diffTime = Math.abs(today - deliveryDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) {
            return { eligible: true, message: `Eligible (Delivered ${diffDays} days ago)` };
        } else {
            return { eligible: false, message: `Expired (Delivered ${diffDays} days ago; 7-day return window exceeded)` };
        }
    };

    const { eligible: isEligible, message: eligibilityMessage } = checkEligibility();

    if (!localStorage.getItem("userInfo")) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl shadow-sm my-16">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mb-6">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Authentication Required</h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Please log in to your account to check return windows and submit support tickets.
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
                        Return Product Request
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 max-w-xl">
                        Verify return eligibility and file a request. Eligible items must be un-worn, in original packaging, and returned within 7 days of doorstep delivery.
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form & Selection */}
                    <div className="md:col-span-7 flex flex-col gap-6">
                        {/* Lookup Form */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2">
                                Order Lookup
                            </h3>
                            <form onSubmit={handleSearch} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="return-order-id" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</label>
                                    <input 
                                        id="return-order-id"
                                        type="text" 
                                        placeholder="Enter reference ID"
                                        value={orderIdInput}
                                        onChange={(e) => setOrderIdInput(e.target.value)}
                                        className="px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-black focus:bg-white outline-none transition-all font-semibold"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="return-email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                                    <input 
                                        id="return-email"
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
                                                o.isDelivered 
                                                    ? "text-emerald-600 bg-emerald-50 border border-emerald-100" 
                                                    : "text-amber-600 bg-amber-50 border border-amber-100"
                                            }`}>
                                                {o.isDelivered ? "Delivered" : "Pending"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details & Return Form */}
                    <div className="md:col-span-5 w-full">
                        {selectedOrder ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-6"
                            >
                                {/* Product Information Card */}
                                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2">
                                        Product Information
                                    </h3>
                                    
                                    <div className="flex flex-col gap-3">
                                        {selectedOrder.orderItems?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-50 border flex items-center justify-center p-1 shrink-0">
                                                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-slate-800 truncate leading-snug">{item.name}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Purchased Price: ₹{item.price?.toLocaleString("en-IN")}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-50 pt-4 flex flex-col gap-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Order Placed:</span>
                                            <span className="font-bold text-slate-800">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Delivery Date:</span>
                                            <span className="font-bold text-slate-800">
                                                {selectedOrder.isDelivered 
                                                    ? new Date(selectedOrder.deliveredAt || selectedOrder.updatedAt).toLocaleDateString()
                                                    : "Awaiting Delivery"
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Eligibility Status */}
                                    <div className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-semibold ${
                                        isEligible 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                            : "bg-red-50 text-red-700 border-red-100"
                                    }`}>
                                        {isEligible ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 shrink-0" />
                                                <span>{eligibilityMessage}</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 shrink-0" />
                                                <span>{eligibilityMessage || "Not Eligible for Return"}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Return Form Options */}
                                {isEligible && (
                                    <form onSubmit={handleSubmitReturn} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="return-reason" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reason for return</label>
                                            <select
                                                id="return-reason"
                                                value={returnReason}
                                                required
                                                onChange={(e) => setReturnReason(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-black text-xs font-bold bg-white cursor-pointer"
                                            >
                                                <option value="">Select a reason...</option>
                                                <option value="Wrong Size">Wrong Size</option>
                                                <option value="Damaged Product">Damaged Product</option>
                                                <option value="Defective Product">Defective Product</option>
                                                <option value="Wrong Item Received">Wrong Item Received</option>
                                                <option value="Quality Issue">Quality Issue</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {/* Image Upload Field */}
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="return-images" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Images (Optional)</label>
                                            <div className="relative border border-dashed border-slate-200 hover:border-slate-350 bg-slate-50/50 rounded-2xl p-4 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
                                                <input 
                                                    id="return-images"
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                />
                                                <Upload className="h-5 w-5 text-slate-400 group-hover:text-black mb-1.5 transition-colors" />
                                                <span className="text-[11px] font-bold text-slate-600 block">
                                                    {uploadedFile ? uploadedFile.name : "Choose File or Drag Here"}
                                                </span>
                                                <span className="text-[9px] text-slate-400 mt-0.5">Supports PNG, JPG up to 5MB</span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-black hover:bg-zinc-900 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Return Request"}
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                                <HelpCircle className="h-8 w-8 text-slate-300 stroke-[1.25] mb-3" />
                                <p className="text-slate-400 text-sm font-semibold">
                                    {searchClicked 
                                        ? "No verified order selected." 
                                        : "Search your order ID or select a recent purchase on the left to verify return eligibility."}
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
                            <h3 className="text-lg font-extrabold text-black mb-1.5">Return Filed Successfully</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                Your return request has been submitted. Our logistics team will review the request and generate a complimentary pickup details label shortly.
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

export default ReturnProductPage;
