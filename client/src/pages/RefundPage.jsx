import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    Undo2, 
    CheckCircle2, 
    Box, 
    Receipt, 
    Calendar, 
    AlertTriangle, 
    Clock, 
    CreditCard, 
    ArrowRight, 
    ShieldCheck, 
    Smartphone, 
    Mail 
} from "lucide-react";

const RefundPage = () => {
    const lastUpdated = "May 26, 2026";

    const eligibilityCards = [
        {
            title: "Unused Product",
            description: "The product must be completely unworn, unwashed, and free from any perfumes, blemishes, or signs of wear.",
            icon: ShieldCheck
        },
        {
            title: "Original Packaging",
            description: "All original brand boxes, dust bags, designer tags, and plastic covers must be included and intact.",
            icon: Box
        },
        {
            title: "Proof Of Purchase",
            description: "A valid receipt invoice copy, purchase transaction logs, or digital order number is strictly required.",
            icon: Receipt
        },
        {
            title: "Within Return Window",
            description: "The return pickup request must be registered inside your profile dashboard within our designated window.",
            icon: Calendar
        }
    ];

    const nonReturnableCards = [
        {
            title: "Innerwear & Socks",
            description: "Due to health regulations and strict hygiene protocols, all innerwear garments, swimwear, and socks are non-returnable.",
            icon: AlertTriangle
        },
        {
            title: "Personal Care Items",
            description: "Unsealed cosmetics, perfumes, skincare formulations, hair care products, and related grooming items are final sale.",
            icon: AlertTriangle
        },
        {
            title: "Customer Damaged",
            description: "Items showing signs of accidental tears, makeup stains, cut tags, or general post-delivery damage are not eligible.",
            icon: AlertTriangle
        },
        {
            title: "Customized Products",
            description: "Monogrammed items, customized alterations, tailor-fitted clothing, or bespoke designs cannot be exchanged or returned.",
            icon: AlertTriangle
        }
    ];

    const timelineSteps = [
        { title: "Return Request", desc: "Submit return details on your My Orders page" },
        { title: "Verification", desc: "Our system reviews purchase logs eligibility" },
        { title: "Courier Pickup", desc: "Logistic carriers collect item within 24-48h" },
        { title: "Inspection", desc: "Studio specialists verify original package state" },
        { title: "Approval", desc: "Quality checks pass and refund is authorized" },
        { title: "Final Refund", desc: "Funds debited back to chosen payment mode" }
    ];

    const payTimelines = [
        { method: "UPI (GPay / PhonePe / Paytm)", time: "2 - 5 Business Days", icon: Smartphone },
        { method: "Credit Card Payments", time: "5 - 7 Business Days", icon: CreditCard },
        { method: "Debit Card Transactions", time: "5 - 7 Business Days", icon: CreditCard },
        { method: "Digital Wallets", time: "1 - 3 Business Days", icon: CreditCard }
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
                        <Undo2 className="h-3 w-3" /> ShopEsy Returns
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4"
                    >
                        Refund Policy
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-6"
                    >
                        Easy Returns & Hassle-Free Refunds
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

            {/* ── 2. Policy Overview Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Guidelines Overview</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Policy Overview</h2>
                    </div>
                    <p className="mt-6 text-sm sm:text-base text-slate-500 leading-relaxed">
                        ShopEsy is dedicated to offering a premium shopping experience. If you are not completely satisfied with your wardrobe purchase, we support simplified return processes and refund policies. We handle item collection, studio inspection checks, and refund transfers directly to make reversals as smooth as possible.
                    </p>
                </div>
            </section>

            {/* ── 3. Return Eligibility Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Acceptance Criteria</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Return Eligibility</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {eligibilityCards.map((card, idx) => {
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

            {/* ── 4. Return Window Section ── */}
            <section className="py-16 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Refund Timings</span>
                    <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Return Window</h2>
                    
                    <div className="mt-8 bg-zinc-950 text-white p-8 max-w-lg w-full border border-neutral-800 shadow-xl flex flex-col items-center">
                        <span className="text-5xl font-black text-white tracking-tight mb-2">7 Days</span>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Easy Return Policy</span>
                        <p className="text-xs text-zinc-500 leading-relaxed text-center">
                            You can register return dispatches within 7 days from physical delivery. Once the window lapses, our systems block return processing flags.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 5. Non-Returnable Items Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Strict Exclusions</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Non-Returnable Items</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nonReturnableCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <motion.div 
                                    key={card.title}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/60 backdrop-blur-md border border-slate-200 p-6 flex flex-col gap-4 text-left shadow-sm transition-all duration-300"
                                >
                                    <div className="w-10 h-10 bg-red-50 border border-red-100 flex items-center justify-center rounded-none text-red-500">
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

            {/* ── 6. Refund Process Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Step-By-Step</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Refund Process</h2>
                    </div>

                    {/* Timeline grid */}
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 max-w-5xl mx-auto">
                        {timelineSteps.map((step, idx) => (
                            <div key={step.title} className="flex flex-col items-center md:items-start text-center md:text-left flex-1 relative w-full">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs shrink-0">
                                        {idx + 1}
                                    </div>
                                    {idx < 5 && (
                                        <ArrowRight className="hidden md:block h-4 w-4 text-slate-350" />
                                    )}
                                </div>
                                <div className="mt-2.5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">{step.title}</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-[150px] mx-auto md:mx-0">{step.desc}</p>
                                </div>
                                {idx < 5 && (
                                    <div className="block md:hidden h-8 w-0.5 bg-slate-200 my-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. Refund Timeline Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Processing Windows</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Refund Timeline</h2>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-4">
                        {payTimelines.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.method} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-black">{item.method}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900">{item.time}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 8. Damaged Or Incorrect Product Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Transit Damages</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Damaged Or Incorrect Product</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        We run rigorous quality screening on every wardrobe catalog item before packaging. In the rare event that you receive a damaged or incorrect product, contact support via email with digital photos of the packaging within 24 hours of delivery. We will fast-track pick-ups and issue immediate replacements.
                    </p>
                </div>
            </section>

            {/* ── 9. Cancellation Refund Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Pre-Dispatch Refunds</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Cancellation Refund</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        If you cancel your purchase online within our standard 60-minute cancellation window (before dispatches commence), the full amount is immediately voided or refunded. Processing times for cancellation refunds map to standard gateway timelines (e.g., 2-5 days for UPI).
                    </p>
                </div>
            </section>

            {/* ── 10. Contact Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Direct Resolvers</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Contact Refund Desk</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                        <div className="bg-white border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
                            <Mail className="h-6 w-6 text-black mb-3" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Fulfillment Resolves</h4>
                            <a href="mailto:refunds@shopeasy.com" className="text-xs font-semibold text-slate-500 hover:text-black transition-colors">
                                refunds@shopeasy.com
                            </a>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
                            <Mail className="h-6 w-6 text-black mb-3" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Concierge Care</h4>
                            <a href="mailto:support@shopeasy.com" className="text-xs font-semibold text-slate-500 hover:text-black transition-colors">
                                support@shopeasy.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 11. CTA Section ── */}
            <section className="py-20 bg-gradient-to-r from-zinc-950 to-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                        Need Help With A Return?
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mb-8">
                        Our support queues are active. Open a direct request to coordinate packaging pickup schedules or track verification states.
                    </p>
                    <Link 
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm px-8 py-4 rounded-none shadow-lg transition-all active:scale-[0.98]"
                    >
                        <span>Get Refund Support</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default RefundPage;
