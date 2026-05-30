import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    FileText, 
    CheckCircle2, 
    Package, 
    Clock, 
    ArrowRight, 
    ShieldCheck, 
    UserCheck, 
    CreditCard, 
    Truck, 
    Info, 
    Lock, 
    Scale, 
    RefreshCw, 
    AlertTriangle 
} from "lucide-react";

const TermsPage = () => {
    const lastUpdated = "May 26, 2026";

    const orderCards = [
        {
            title: "Order Placement",
            description: "Submit product selection, sizing parameters, and delivery destinations through our digital shop checkout steps.",
            icon: Package
        },
        {
            title: "Order Confirmation",
            description: "Receive a transaction summary email immediately. Note that this confirm card signifies receipt, not dispatch approval.",
            icon: CheckCircle2
        },
        {
            title: "Order Cancellation",
            description: "Modify or cancel your pending order logs directly inside the profile dashboard within the first 60 minutes of payment.",
            icon: RefreshCw
        },
        {
            title: "Order Processing",
            description: "Logistics checkouts, authenticity inspections, packaging dispatches, and carrier transit handover inside our studios.",
            icon: Clock
        }
    ];

    const prohibitedItems = [
        {
            title: "Fraud & Deception",
            description: "Engaging in payment manipulation, unauthorized card checks, identity theft, or promo code exploitation schemes.",
            icon: AlertTriangle
        },
        {
            title: "Unauthorized Access",
            description: "Attempting to bypass portal firewalls, hijack database queries, run brute-force logins, or scan systems.",
            icon: Lock
        },
        {
            title: "Abusive Behavior",
            description: "Submitting malicious customer support requests, harassing brand staff, or posting defamatory review notes.",
            icon: AlertTriangle
        },
        {
            title: "False Information",
            description: "Registering user accounts under fabricated email accounts, false shipping names, or fake contact details.",
            icon: Info
        },
        {
            title: "Security Violations",
            description: "Injecting scripts, tracking code, server scrapers, or viruses to disrupt ShopEsy system infrastructures.",
            icon: ShieldCheck
        }
    ];

    const ipAssets = [
        "Brand Logos: Official ShopEsy typography, graphics, symbols, and navigation badges.",
        "Product Images: Studio lifestyle photography, models catalog assets, and graphic renders.",
        "Creative Designs: Page UI components, styling sheets, HSL colors configurations, and font pairings.",
        "Source Code: React logic scripts, API endpoints schemas, and proprietary backend parameters.",
        "Brand Assets: Trademarks, editorial slogans, newsletters formats, and support ticket guides."
    ];

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
                        <FileText className="h-3 w-3" /> ShopEsy Regulations
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4"
                    >
                        Terms & Conditions
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-6"
                    >
                        Please Read Carefully
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white border border-slate-200 px-3.5 py-1.5 uppercase tracking-wider rounded-none shadow-sm"
                    >
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Last Updated: {lastUpdated}</span>
                    </motion.div>
                </div>
            </section>

            {/* ── 2. Acceptance of Terms Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Acceptance of Terms</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Terms Acceptance</h2>
                    </div>
                    <p className="mt-6 text-sm sm:text-base text-slate-500 leading-relaxed">
                        By accessing, browsing, registering an account, or placing orders on the ShopEsy e-commerce portal, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions in full. If you do not accept these terms, you must discontinue using our services immediately.
                    </p>
                </div>
            </section>

            {/* ── 3. User Accounts Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Profile Regulations</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">User Accounts</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 p-6 flex flex-col gap-3 shadow-sm">
                            <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-black font-bold text-xs">A</div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Accurate Information</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                You must provide exact, complete, and current details during account signup and shipping configurations.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 flex flex-col gap-3 shadow-sm">
                            <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-black font-bold text-xs">B</div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Password Security</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                You are solely responsible for keeping your login password confidential and ensuring secure profile checkouts.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 flex flex-col gap-3 shadow-sm">
                            <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-black font-bold text-xs">C</div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Account Responsibility</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                You accept full liability for all actions, transaction checkouts, reviews, or logs initiated under your profile username.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. Product Information Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Catalog Accuracy</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Product Information</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        We strive to display product images, description parameters, fabric metrics, pricing details, and size coordinates as accurately as possible. However, ShopEsy does not warrant that product descriptions, graphics, pricing values, or stock availability indications are 100% complete, error-free, or current. Colors and textures may vary slightly depending on digital monitors.
                    </p>
                </div>
            </section>

            {/* ── 5. Orders & Purchases Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Fulfillment Phases</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Orders & Purchases</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {orderCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <motion.div 
                                    key={card.title}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/60 backdrop-blur-md border border-slate-200 p-6 flex flex-col gap-4 text-left shadow-sm transition-all duration-300"
                                >
                                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-none text-slate-700">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-1">{card.title}</h3>
                                        <p className="text-[11px] text-slate-400 leading-normal">{card.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 6. Pricing & Payments Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Financial Conditions</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Pricing & Payments</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        All prices listed on ShopEsy are denominated in Indian Rupees (INR) unless indicated otherwise, and exclude applicable shipping charges or promo code discounts. We reserve the right to modify pricing variables, discount tags, or stock limits at any time without notice. Payments must be authorized through our security gateways prior to order packaging.
                    </p>
                </div>
            </section>

            {/* ── 7. Shipping & Delivery Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Transit Parameters</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Shipping & Delivery</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        ShopEsy ships to eligible postal ZIP codes domestic to the country coordinates. Estimated transit timelines are 3 to 5 business days for standard delivery, but actual delivery dates may be delayed due to courier constraints, weather conditions, or local holidays. Risk of loss passes to the purchaser upon courier handover.
                    </p>
                </div>
            </section>

            {/* ── 8. Returns & Refunds Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Reversal Conditions</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Returns & Refunds</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        We support a 7-day return policy on unused, unwashed, and original-packaged wardrobe products. You can log return requests directly from the profile dashboard. Verification of item quality happens at our studio hubs, and approved refunds will reflect on your original payment mechanism within 5-7 business days.
                    </p>
                </div>
            </section>

            {/* ── 9. Intellectual Property Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Creative Rights</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Intellectual Property</h2>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-4">
                        {ipAssets.map((asset, idx) => {
                            const [name, desc] = asset.split(": ");
                            return (
                                <div key={idx} className="flex gap-3.5 items-start">
                                    <div className="w-1.5 h-1.5 bg-black flex-shrink-0 mt-2" />
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-0.5">{name}</h4>
                                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">{desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 10. Prohibited Activities Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Compliance Restrictions</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Prohibited Activities</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                        {prohibitedItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="bg-slate-50 border border-slate-200 p-6 flex flex-col gap-3 text-left">
                                    <div className="w-8 h-8 bg-red-50 text-red-500 border border-red-100 flex items-center justify-center">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">{item.title}</h4>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 11. Limitation of Liability Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Liability Limits</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Limitation of Liability</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        To the maximum extent permitted by applicable law, ShopEsy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from (a) your use or inability to use the site; (b) any unauthorized access; or (c) product defects beyond direct replacement value values.
                    </p>
                </div>
            </section>

            {/* ── 12. Changes To Terms Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Adjustments</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Changes To Terms</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        We reserve the right to revise or update these Terms & Conditions at any time. When we make updates, the "Last Updated" date at the top of this page will be revised. Your continued use of the ShopEsy portal following the posting of modifications indicates acceptance of the updated terms.
                    </p>
                </div>
            </section>

            {/* ── 13. Contact Information Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Legal Coordinates</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Contact Information</h2>
                    </div>

                    <div className="bg-white border border-slate-200 p-8 max-w-xl mx-auto text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-none mb-4">
                            <Scale className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-1">Legal Affairs Desk</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
                            For legal notices, compliance queries, licensing details, or questions regarding these terms, contact our support team email directly.
                        </p>
                        
                        <a 
                            href="mailto:legal@shopesy.com" 
                            className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white text-xs font-bold px-6 py-3 border border-slate-200 hover:border-slate-300 transition-colors uppercase tracking-wider rounded-none"
                        >
                            <span>legal@shopesy.com</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer notice */}
            <footer className="py-8 bg-zinc-900 text-zinc-500 text-center text-xs border-t border-zinc-800">
                <div className="max-w-4xl mx-auto px-4">
                    <p className="leading-relaxed uppercase tracking-wider text-[9px] font-bold text-zinc-600 mb-1">ShopEsy Compliance Panel</p>
                    <p className="leading-normal">
                        © 2026 ShopEsy Inc. All operations are governed under standard domestic trade regulations.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default TermsPage;
