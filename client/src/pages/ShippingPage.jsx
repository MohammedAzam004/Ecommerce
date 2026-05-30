import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    Truck, 
    CheckCircle2, 
    Box, 
    Clock, 
    MapPin, 
    Globe, 
    Mail, 
    ArrowRight, 
    ShieldCheck, 
    AlertCircle, 
    Loader 
} from "lucide-react";

const ShippingPage = () => {
    const lastUpdated = "May 26, 2026";

    const processingCards = [
        {
            title: "Order Confirmation",
            description: "Receive a secure email receipt copy immediately post-checkout to verify item and billing parameters.",
            icon: CheckCircle2
        },
        {
            title: "Processing Time",
            description: "Orders undergo inventory packaging and quality inspections at our design hubs within 1-2 business days.",
            icon: Loader
        },
        {
            title: "Shipment Dispatch",
            description: "Once verified, packages are carefully sealed and handed over to our premium courier carrier networks.",
            icon: Box
        },
        {
            title: "Tracking Update",
            description: "A tracking number and link are dispatched via email and SMS as soon as transit commences.",
            icon: Clock
        }
    ];

    const timelineCards = [
        {
            title: "Metro Cities",
            duration: "2 - 4 Business Days",
            description: "Fast-track delivery routes covering major business zones, tier-1 capitals, and surrounding cities.",
            icon: MapPin
        },
        {
            title: "Other Cities",
            duration: "3 - 7 Business Days",
            description: "Standard distribution networks covering tier-2/tier-3 cities and major state districts.",
            icon: MapPin
        },
        {
            title: "Remote Areas",
            duration: "5 - 10 Business Days",
            description: "Specialized logistics dispatches to remote areas, mountainous districts, and island codes.",
            icon: MapPin
        }
    ];

    const delayItems = [
        {
            title: "Severe Weather",
            description: "Heavy rainfalls, cyclones, storm warnings, or visibility issues blocking air/road transport.",
            icon: AlertCircle
        },
        {
            title: "Public Holidays",
            description: "National festivities, local state holidays, or carrier sorting center closure dispatches.",
            icon: Clock
        },
        {
            title: "Logistics Issues",
            description: "Courier congestion periods (e.g. major holiday sales) or sorting hub structural delays.",
            icon: Truck
        },
        {
            title: "Natural Disruptions",
            description: "Unexpected environmental shifts, public infrastructure blocks, or state-ordered transport checks.",
            icon: AlertCircle
        }
    ];

    const trackingSteps = [
        { title: "Order Placed", desc: "Purchase confirmation recorded" },
        { title: "Processed", desc: "Inspection checks and packing complete" },
        { title: "Shipped", desc: "In transit with premium courier carrier" },
        { title: "Out For Delivery", desc: "Local courier dispatched to address" },
        { title: "Delivered", desc: "Verified delivery sign-off complete" }
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
                        <Truck className="h-3 w-3" /> ShopEsy Logistics
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4"
                    >
                        Shipping Policy
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-6"
                    >
                        Fast, Reliable & Secure Delivery
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

            {/* ── 2. Shipping Overview Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Distribution Overview</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Shipping Commitment</h2>
                    </div>
                    <p className="mt-6 text-sm sm:text-base text-slate-500 leading-relaxed">
                        ShopEsy is committed to delivering your premium orders in pristine condition. We partner with the nation's leading shipping carriers (including Blue Dart, Delhivery, and DHL) to guarantee fast, secure, and reliable shipping. Every package undergoes meticulous quality control checks before sealing.
                    </p>
                </div>
            </section>

            {/* ── 3. Order Processing Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Logistics Phases</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Order Processing</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {processingCards.map((card, idx) => {
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

            {/* ── 4. Delivery Timeline Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Transit Standards</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Delivery Timelines</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {timelineCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div key={card.title} className="bg-slate-50 border border-slate-200 p-8 flex flex-col gap-4 text-left">
                                    <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-1">{card.title}</h3>
                                        <span className="text-sm font-black text-slate-950 block mb-2">{card.duration}</span>
                                        <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. Shipping Charges Section ── */}
            <section className="py-16 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Cost Parameters</span>
                    <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Shipping Charges</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 w-full max-w-2xl">
                        <div className="bg-zinc-950 text-white p-8 border border-neutral-800 shadow-xl flex flex-col items-center">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Orders Above ₹999</span>
                            <span className="text-5xl font-black text-white tracking-tight mb-4">FREE</span>
                            <p className="text-[11px] text-zinc-500 leading-normal">
                                Complimentary shipping automatically applies to all dispatches totaling ₹999 or more.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Orders Below ₹999</span>
                            <span className="text-5xl font-black text-slate-950 tracking-tight mb-4">₹99</span>
                            <p className="text-[11px] text-slate-400 leading-normal">
                                A flat rate of ₹99 shipping coordinates fee applies to dispatches below ₹999.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. Order Tracking Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Visual Flow</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Order Tracking Stages</h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 max-w-4xl mx-auto">
                        {trackingSteps.map((step, idx) => (
                            <div key={step.title} className="flex flex-col items-center md:items-start text-center md:text-left flex-1 relative w-full">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs shrink-0">
                                        {idx + 1}
                                    </div>
                                    {idx < 4 && (
                                        <ArrowRight className="hidden md:block h-4 w-4 text-slate-350" />
                                    )}
                                </div>
                                <div className="mt-2.5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">{step.title}</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-[150px] mx-auto md:mx-0">{step.desc}</p>
                                </div>
                                {idx < 4 && (
                                    <div className="block md:hidden h-8 w-0.5 bg-slate-200 my-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. Delivery Delays Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Exceptions</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Delivery Delays</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {delayItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="bg-white border border-slate-200 p-6 flex flex-col gap-3 text-left">
                                    <div className="w-8 h-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
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

            {/* ── 8. Failed Delivery Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Failed Attempts</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Failed Delivery</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        Our shipping partners make up to three attempts to deliver your package before marking it return-to-origin (RTO). Please ensure that you provide accurate contact details and a telephone number so carriers can schedule delivery times. If an item returns to origin, our refund teams will contact you.
                    </p>
                </div>
            </section>

            {/* ── 9. Supported Locations Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Logistics Coverage</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Supported Locations</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        ShopEsy supports delivery to over 20,000 PIN codes across the country, covering all major states and union territories. Real-time delivery availability checks are performed on the product details page using your location coordinate details.
                    </p>
                </div>
            </section>

            {/* ── 10. International Shipping Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Global Coverage</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">International Shipping</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        Currently, ShopEsy processes checkouts and ships items domestic to the country borders only. We do not support international billing coordinates or global shipping operations at this time. We plan to introduce international shipping channels in the near future.
                    </p>
                </div>
            </section>

            {/* ── 11. Contact Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Support Handlers</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Contact Shipping Desk</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                        <div className="bg-white border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
                            <Mail className="h-6 w-6 text-black mb-3" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Shipping Log Resolves</h4>
                            <a href="mailto:shipping@shopeasy.com" className="text-xs font-semibold text-slate-500 hover:text-black transition-colors">
                                shipping@shopeasy.com
                            </a>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
                            <Mail className="h-6 w-6 text-black mb-3" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Concierge Support</h4>
                            <a href="mailto:support@shopeasy.com" className="text-xs font-semibold text-slate-500 hover:text-black transition-colors">
                                support@shopeasy.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 12. CTA Section ── */}
            <section className="py-20 bg-gradient-to-r from-zinc-950 to-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                        Need Help Tracking Your Order?
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mb-8">
                        If your package has left our hubs, check transit history and details directly using our customer orders log.
                    </p>
                    <Link 
                        to="/myorders"
                        className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm px-8 py-4 rounded-none shadow-lg transition-all active:scale-[0.98]"
                    >
                        <span>Track My Order</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ShippingPage;
