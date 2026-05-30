import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Search,
    Package,
    Truck,
    RotateCcw,
    CreditCard,
    User,
    Sparkles,
    ShieldCheck,
    ChevronDown,
    ArrowRight,
    HelpCircle,
    LifeBuoy,
    MessageSquare
} from "lucide-react";

const FAQPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    // Tracks the expanded state by storing "category-index"
    const [expandedItem, setExpandedItem] = useState(null);

    const categories = [
        { id: "Orders", label: "Orders", icon: Package, description: "Tracking, modifications, cancellations." },
        { id: "Shipping", label: "Shipping", icon: Truck, description: "Delivery times, express delivery, international." },
        { id: "Returns", label: "Returns", icon: RotateCcw, description: "Initiating returns, collection schedules." },
        { id: "Refunds", label: "Refunds", icon: CreditCard, description: "Refund timelines, credit checks." },
        { id: "Payments", label: "Payments", icon: CreditCard, description: "Payment modes, secure checkout, failures." },
        { id: "Account", label: "Account", icon: User, description: "Credentials, address books, profile logs." },
        { id: "Products", label: "Products", icon: Sparkles, description: "Sizing guides, authenticity, restocks." },
        { id: "Security", label: "Security", icon: ShieldCheck, description: "Data encryption, privacy policies, safety." }
    ];

    const faqData = [
        {
            category: "Orders",
            title: "Orders",
            items: [
                {
                    q: "How do I place an order?",
                    a: "Placing an order is simple. Browse our collections, select your items, add them to your cart, and proceed to our secure checkout. Follow the prompts to enter your delivery address and choose a payment method."
                },
                {
                    q: "Can I cancel my order?",
                    a: "Yes. You can cancel your order within 60 minutes of placing it directly from your 'My Orders' dashboard. After 60 minutes, the order is forwarded to our logistics hubs and can only be processed as a standard return."
                },
                {
                    q: "How do I track my order?",
                    a: "As soon as your shipment leaves our hub, we will email you a tracking number and link. You can also view real-time tracking details under the 'My Orders' tab on your profile page."
                },
                {
                    q: "Can I modify my order?",
                    a: "In order to process shipments as quickly as possible, we cannot modify the contents of an order once placed. If you need to make changes, please cancel the order within the 60-minute window and place a new one."
                }
            ]
        },
        {
            category: "Shipping",
            title: "Shipping",
            items: [
                {
                    q: "What is the estimated delivery time?",
                    a: "Standard shipping typically takes 3 to 5 business days, depending on your location. Delivery updates and precise estimates will be provided during checkout."
                },
                {
                    q: "Do you offer express shipping?",
                    a: "Yes, express shipping options (1-2 business days) are available at checkout for eligible postal codes."
                },
                {
                    q: "How does shipment tracking work?",
                    a: "Once your package is handed over to our delivery partner, a tracking link is activated. You can track transit history in the 'My Orders' screen or via the carrier's portal."
                },
                {
                    q: "Do you support international shipping?",
                    a: "Currently, ShopEsy ships within the country only. We are actively working on expanding to international destinations soon."
                }
            ]
        },
        {
            category: "Returns & Refunds",
            // Handles both "Returns" and "Refunds" selections
            categories: ["Returns", "Refunds"],
            title: "Returns & Refunds",
            items: [
                {
                    q: "What is the return process?",
                    a: "To initiate a return, go to 'My Orders', select the item you wish to return, choose a reason, and submit the request. We will schedule a courier pickup for your package."
                },
                {
                    q: "What is the refund timeline?",
                    a: "Once your returned items are received and inspected at our quality center, refunds are initiated. The amount will reflect in your account within 5-7 business days."
                },
                {
                    q: "What is the return eligibility?",
                    a: "Items must be returned within 7 days of delivery, unused, unwashed, and in their original packaging with all brand tags intact."
                },
                {
                    q: "What if I receive a damaged product?",
                    a: "We inspect all items before shipping, but if you receive a damaged product, please contact support with photos of the product and packaging within 24 hours of delivery."
                }
            ]
        },
        {
            category: "Payments",
            title: "Payments",
            items: [
                {
                    q: "Which payment methods do you accept?",
                    a: "We accept all major Credit/Debit cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and select digital wallets."
                },
                {
                    q: "Are my payment transactions secure?",
                    a: "Absolutely. All transactions are fully encrypted using AES-256 protocols and processed through secure, PCI-DSS compliant payment gateways."
                },
                {
                    q: "What should I do if my payment fails?",
                    a: "If a transaction fails but funds are debited, the amount is usually credited back to your account automatically within 24-48 hours. Please check your credentials and try again."
                },
                {
                    q: "Can I use multiple payment options?",
                    a: "You can choose one primary payment method per transaction. For security reasons, we do not support split payments across multiple methods."
                }
            ]
        },
        {
            category: "Account",
            title: "Account",
            items: [
                {
                    q: "How do I create an account?",
                    a: "Click on the Account/User icon in the header, click 'Register', fill in your details (name, email, password), and your premium account is ready immediately."
                },
                {
                    q: "How do I reset my password?",
                    a: "Click 'Forgot Password' on the login page and enter your registered email. We will send you a secure link to reset your credentials."
                },
                {
                    q: "How do I update my profile details?",
                    a: "Log in, navigate to your Profile page, and edit your profile parameters such as name, contact number, or default email."
                },
                {
                    q: "How do I manage my delivery addresses?",
                    a: "You can add, edit, or delete shipping addresses in the 'Manage Addresses' section inside your user Profile dashboard."
                }
            ]
        },
        {
            category: "Products",
            title: "Products",
            items: [
                {
                    q: "Is there a size guide available?",
                    a: "Yes, every fashion product page features a detailed size chart button showing measurements in inches and centimeters to help you find your size."
                },
                {
                    q: "Are all products authentic?",
                    a: "Every item sold on ShopEsy is 100% authentic, sourced directly from the original brands and certified distributors."
                },
                {
                    q: "How do I check stock availability?",
                    a: "Real-time stock status is updated on each product page. It shows if an item is 'In Stock', 'Only X Left', or 'Out of Stock'."
                },
                {
                    q: "Can I get notified when items are restocked?",
                    a: "Yes, on out-of-stock items, click the 'Notify Me' button to receive an email alert as soon as the product returns to inventory."
                }
            ]
        },
        {
            category: "Security",
            title: "Security",
            items: [
                {
                    q: "Is my personal data safe?",
                    a: "Yes, we use industry-standard security protocols and AES-256 encryption. We never share your personal information with third parties without your consent."
                },
                {
                    q: "How do you handle credit card details?",
                    a: "We do not store credit card details on our servers. All transactions are securely processed by authorized payment providers under strict compliance checks."
                },
                {
                    q: "What is your privacy policy?",
                    a: "Your privacy is our priority. We only use your information to fulfill orders, handle returns, and improve your shopping experience. We comply fully with data privacy laws."
                },
                {
                    q: "Are customer reviews verified?",
                    a: "Yes, all reviews are submitted by verified purchasers to ensure absolute transparency and authenticity."
                }
            ]
        }
    ];

    // Filter logic: category select + search query
    const filteredSections = faqData
        .map((sec) => {
            // Check if this section fits the selected category
            const matchesCategory =
                selectedCategory === "All" ||
                sec.category === selectedCategory ||
                (sec.categories && sec.categories.includes(selectedCategory));

            if (!matchesCategory) return null;

            // Filter items in this section by search query
            const filteredItems = sec.items.filter(
                (item) =>
                    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.a.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return {
                ...sec,
                items: filteredItems
            };
        })
        .filter(Boolean);

    const toggleItem = (key) => {
        setExpandedItem(expandedItem === key ? null : key);
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
                        <LifeBuoy className="h-3 w-3" /> ShopEsy FAQ Desk
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-8"
                    >
                        Find Answers Instantly
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
                            placeholder="Search FAQ keywords, return processes, shipping options..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setExpandedItem(null); // Reset expand on search
                            }}
                            className="w-full pl-12 pr-4 py-4 text-sm bg-white border border-slate-200 rounded-none outline-none focus:border-black transition-all"
                        />
                    </motion.div>
                </div>
            </section>

            {/* ── 2. FAQ Categories Grid ── */}
            <section className="py-16 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Quick Filters</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Browse by Category</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {categories.map((cat) => {
                            const IconComponent = cat.icon;
                            const isSelected = selectedCategory === cat.id;

                            return (
                                <motion.div
                                    key={cat.id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => {
                                        setSelectedCategory(isSelected ? "All" : cat.id);
                                        setExpandedItem(null);
                                    }}
                                    className={`p-6 border text-left flex flex-col gap-4 relative overflow-hidden cursor-pointer transition-all duration-300 ${
                                        isSelected
                                            ? "bg-black border-black text-white shadow-lg"
                                            : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm"
                                    }`}
                                >
                                    <div
                                        className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 ${
                                            isSelected ? "bg-zinc-800 text-white" : "bg-slate-50 text-slate-700"
                                        }`}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider mb-1">
                                            {cat.label}
                                        </h4>
                                        <p
                                            className={`text-[11px] leading-normal transition-colors duration-300 ${
                                                isSelected ? "text-zinc-300" : "text-slate-400"
                                            }`}
                                        >
                                            {cat.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {selectedCategory !== "All" && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setExpandedItem(null);
                                }}
                                className="text-xs font-extrabold text-black border-b-2 border-black pb-0.5 hover:text-slate-600 hover:border-slate-600 transition-colors uppercase tracking-wider"
                            >
                                Reset Filter & Show All FAQs
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── 3. FAQ Accordion Sections ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredSections.length === 0 ? (
                        <div className="bg-white rounded-none border border-slate-200 p-12 text-center shadow-sm">
                            <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                            <h3 className="font-bold text-black text-base uppercase tracking-wider mb-1">No Matching FAQs Found</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                We couldn't find any questions matching your criteria. Try searching for other keywords, checking other categories, or contact support directly.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            {filteredSections.map((section) => (
                                <div key={section.category} className="text-left">
                                    <h3 className="text-lg font-black text-black uppercase tracking-wider mb-5 border-l-4 border-black pl-3">
                                        {section.title}
                                    </h3>
                                    <div className="bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col gap-4">
                                        {section.items.map((item, idx) => {
                                            const itemKey = `${section.category}-${idx}`;
                                            const isExpanded = expandedItem === itemKey;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(itemKey)}
                                                        className="w-full flex items-center justify-between text-left py-3 font-bold text-black hover:text-slate-600 transition-colors focus:outline-none"
                                                    >
                                                        <span className="text-sm sm:text-base leading-snug">{item.q}</span>
                                                        <ChevronDown
                                                            className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                                                                isExpanded ? "rotate-180" : ""
                                                            }`}
                                                        />
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
                                                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1.5 pb-2">
                                                                    {item.a}
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── 4. CTA Section ── */}
            <section className="py-20 bg-gradient-to-r from-zinc-950 to-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                        Didn't Find Your Answer?
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mb-8">
                        Our customer service team is standing by to assist you with order status, tracking, account management, and returns.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm px-8 py-4 rounded-none shadow-lg transition-all active:scale-[0.98]"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>Contact Support</span>
                        </Link>
                        <Link
                            to="/support"
                            className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 text-white font-bold text-sm px-8 py-4 rounded-none shadow-lg transition-all active:scale-[0.98]"
                        >
                            <LifeBuoy className="h-4 w-4" />
                            <span>Visit Help Center</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
