import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    Search, 
    ShoppingBag, 
    RotateCcw, 
    CreditCard, 
    Truck, 
    ShieldCheck, 
    User, 
    Info, 
    HelpCircle, 
    ChevronDown, 
    Mail, 
    Phone, 
    ArrowRight, 
    Lock, 
    MapPin, 
    LifeBuoy, 
    Cpu 
} from "lucide-react";
import { toast } from "react-toastify";

const SupportPage = () => {
    // Search query state
    const [searchQuery, setSearchQuery] = useState("");

    // Accordion FAQ states (tracks index of expanded FAQ)
    const [expandedFaq, setExpandedFaq] = useState(null);

    // Active support category
    const [activeCategory, setActiveCategory] = useState(null);

    // Initial FAQ data
    const faqs = [
        {
            question: "Where is my order?",
            answer: "Once your order ships, we will send you an email confirmation with your carrier details and tracking number. You can also view this details on the My Orders tab in your collector profile."
        },
        {
            question: "How do I return a product?",
            answer: "We support a complimentary 7-day return policy for verified un-worn wardrobe items. Initiate your return via the My Orders panel or reach out to our concierge support."
        },
        {
            question: "How do refunds work?",
            answer: "Once we receive your returned order package at our San Francisco studio hubs, we verify item authenticity. Approved refunds are credited to your original payment mechanism within 3-5 business days."
        },
        {
            question: "How do I cancel an order?",
            answer: "Orders are processed swiftly. You may cancel your purchase within 60 minutes of payment from your My Orders dashboard. Beyond this timeframe, we can only process your request as a standard return."
        },
        {
            question: "Payment failed. What should I do?",
            answer: "Please verify that your billing credentials, ZIP codes, and banking authentication screens match exactly. Alternatively, you can use our instant UPI payment options or reach out to your credit card company."
        },
        {
            question: "How can I update my address?",
            answer: "You can configure your default shipping coordinates from the Profile Details page. For active order shipments that have not left our hubs, contact our support line immediately to update delivery logistics."
        }
    ];

    // Filter FAQs based on search
    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Toggle FAQ accordion handler
    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    // Generic support card click feedback
    const handleSupportAction = (actionName) => {
        if (actionName === "Track Order") {
            toast.info("✓ Redirecting to My Orders page...");
            window.location.href = "/myorders";
        } else if (actionName === "Update Profile" || actionName === "Manage Addresses") {
            toast.info("✓ Opening Profile Details page...");
            window.location.href = "/profile";
        } else {
            toast.info(`Info: Directing to "${actionName}" workflows. Please confirm identity details.`);
        }
    };

    // Category card click — highlight card, filter FAQs, scroll to FAQ section
    const handleCategoryClick = (keyword, categoryKey) => {
        setActiveCategory(categoryKey);
        setSearchQuery(keyword);
        setExpandedFaq(null);
        setTimeout(() => {
            const el = document.getElementById("faq-section");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-800">
            {/* ── 1. Hero Section ── */}
            <section className="relative overflow-hidden py-24 border-b border-zinc-150 bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-extrabold uppercase tracking-widest rounded-none mb-6"
                    >
                        <LifeBuoy className="h-3 w-3" /> ShopEsy Help Desk
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4"
                    >
                        Customer Support Center
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-8"
                    >
                        How Can We Help You Today?
                    </motion.p>
                    
                    {/* Support Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-xl relative flex items-center group shadow-md"
                    >
                        <Search className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-black transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search help articles, orders guides, refunds policy..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 text-sm bg-white border border-slate-200 rounded-none outline-none focus:border-black transition-all"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ── 2. Support Categories Grid ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Help Topics</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Explore Categories</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { key: "orders",   keyword: "order",   Icon: ShoppingBag, label: "Orders",           desc: "Track purchases, modify details, and cancel logs." },
                            { key: "returns",  keyword: "return",  Icon: RotateCcw,   label: "Returns",          desc: "Wardrobe exchanges and packaging policies." },
                            { key: "refunds",  keyword: "refund",  Icon: CreditCard,  label: "Refunds",          desc: "Processing timelines and banking conditions." },
                            { key: "shipping", keyword: "shipping",Icon: Truck,       label: "Shipping",         desc: "Priority delivery tracking and global options." },
                            { key: "payments", keyword: "payment", Icon: ShieldCheck, label: "Payments",         desc: "Gateway verification, UPI payments, and invoices." },
                            { key: "account",  keyword: "address", Icon: User,        label: "Account Help",     desc: "Credential management and profile settings." },
                            { key: "product",  keyword: "fabric",  Icon: Info,        label: "Product Info",     desc: "Sizing guidelines, fabric details, and care." },
                            { key: "technical",keyword: "failed",  Icon: Cpu,         label: "Technical Issues", desc: "Browser login concerns, layout issues, or gateway fails." },
                        ].map(({ key, keyword, Icon, label, desc }) => {
                            const isActive = activeCategory === key;
                            return (
                                <motion.div
                                    key={key}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleCategoryClick(keyword, key)}
                                    className={`rounded-3xl border p-6 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden cursor-pointer group transition-all duration-200 ${
                                        isActive
                                            ? "bg-black border-black text-white"
                                            : "bg-white border-slate-100 hover:border-slate-200"
                                    }`}
                                >
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-none transition-all duration-300 ${
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-50 text-slate-700 group-hover:bg-black group-hover:text-white"
                                    }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                                            isActive ? "text-white" : "text-black"
                                        }`}>{label}</h4>
                                        <p className={`text-[11px] leading-normal ${
                                            isActive ? "text-white/70" : "text-slate-400"
                                        }`}>{desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 3. Popular Help Topics Accordion Section ── */}
            <section id="faq-section" className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">FAQ Directory</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Popular Help Topics</h2>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-4 text-left">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 font-semibold text-sm">
                                No matching support topics found. Please search again or email support.
                            </div>
                        ) : (
                            filteredFaqs.map((faq, idx) => {
                                const isExpanded = expandedFaq === idx;
                                return (
                                    <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                        <button 
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full flex items-center justify-between text-left py-3 font-bold text-black hover:text-slate-600 transition-colors focus:outline-none"
                                        >
                                            <span className="text-sm sm:text-base">{faq.question}</span>
                                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1 pb-2">
                                                        {faq.answer}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* ── 4, 5 & 6. Quick Support Sections (Orders, Account, Payments) ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
                    
                    {/* 4. Order Support */}
                    <div>
                        <h3 className="text-lg font-black text-black uppercase tracking-wider mb-6 text-left border-l-4 border-black pl-3">Order Support</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: "Track Order", path: "/myorders" },
                                { name: "Cancel Order", path: "/cancel-order" },
                                { name: "Return Product", path: "/return-product" },
                                { name: "Order Status", path: "/order-status" }
                            ].map((item) => (
                                <Link 
                                    key={item.name}
                                    to={item.path}
                                    className="bg-white border border-slate-200/80 p-4 font-bold text-xs uppercase tracking-wider text-black hover:bg-slate-50 transition-all rounded-none text-left flex items-center justify-between border-solid"
                                >
                                    <span>{item.name}</span>
                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 5. Account Support */}
                    <div>
                        <h3 className="text-lg font-black text-black uppercase tracking-wider mb-6 text-left border-l-4 border-black pl-3">Account Support</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {["Reset Password", "Update Profile", "Change Email", "Manage Addresses"].map((action) => (
                                <button 
                                    key={action}
                                    onClick={() => handleSupportAction(action)}
                                    className="bg-white border border-slate-200/80 p-4 font-bold text-xs uppercase tracking-wider text-black hover:bg-slate-50 transition-all rounded-none text-left flex items-center justify-between"
                                >
                                    <span>{action}</span>
                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 6. Payment Support */}
                    <div>
                        <h3 className="text-lg font-black text-black uppercase tracking-wider mb-6 text-left border-l-4 border-black pl-3">Payment Support</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {["UPI", "Credit Card", "Debit Card", "Wallet Payments", "Refund Status"].map((action) => (
                                <button 
                                    key={action}
                                    onClick={() => handleSupportAction(action)}
                                    className="bg-white border border-slate-200/80 p-4 font-bold text-xs uppercase tracking-wider text-black hover:bg-slate-50 transition-all rounded-none text-left flex items-center justify-between"
                                >
                                    <span>{action}</span>
                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ── 7. Contact Support Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Direct Contact</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Concierge Care</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {/* Email Support */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden">
                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-1">Email Support</h4>
                                <a href="mailto:support@shopesy.com" className="text-xs font-semibold text-slate-500 hover:text-black transition-colors block">
                                    support@shopesy.com
                                </a>
                            </div>
                        </div>

                        {/* Phone Support */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden">
                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-1">Phone Support</h4>
                                <span className="text-xs font-semibold text-slate-500 block">
                                    +1 (800) 123-4567
                                </span>
                            </div>
                        </div>

                        {/* Live Chat */}
                        <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-6 flex flex-col gap-4 text-left relative overflow-hidden">
                            <div className="w-10 h-10 bg-slate-200 text-slate-400 flex items-center justify-center rounded-none shrink-0">
                                <HelpCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Live Chat</h4>
                                <span className="text-xs font-semibold text-slate-400 block">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 8. Emergency Help CTA Section ── */}
            <section className="py-20 bg-gradient-to-r from-zinc-950 to-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                        Need Immediate Assistance?
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mb-8">
                        Our ticket queues are active. Open a priority styling or fulfillment ticket to get direct help within 24 business hours.
                    </p>
                    <Link 
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm px-8 py-4 rounded-none shadow-lg transition-all active:scale-[0.98]"
                    >
                        <span>Get Help Now</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default SupportPage;
