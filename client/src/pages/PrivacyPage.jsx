import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
    Shield, 
    User, 
    Mail, 
    Globe, 
    Lock, 
    Server, 
    CreditCard, 
    CheckCircle2, 
    ArrowRight, 
    Clock, 
    Database, 
    MapPin, 
    TrendingUp, 
    Eye 
} from "lucide-react";

const PrivacyPage = () => {
    const lastUpdated = "May 26, 2026";

    const collectCards = [
        {
            title: "Personal Information",
            description: "Full name, date of birth, gender identity details to customize and personalize your luxury brand interactions.",
            icon: User
        },
        {
            title: "Contact Information",
            description: "Email addresses, primary telephone numbers, and mobile accounts used for direct communications and order notifications.",
            icon: Mail
        },
        {
            title: "Shipping Information",
            description: "Default delivery addresses, billing coordinates, postal ZIP codes, and verification details for courier dispatches.",
            icon: MapPin
        },
        {
            title: "Account Information",
            description: "Registered credentials, cryptographically salted passwords, wishlists, preferences, and collector status logs.",
            icon: Database
        },
        {
            title: "Order Information",
            description: "Transaction history, purchased items, receipts, pricing values, size details, return history, and billing records.",
            icon: CreditCard
        },
        {
            title: "Technical Information",
            description: "IP addresses, browser client configurations, device identifiers, and operating systems gathered through system logging.",
            icon: Server
        }
    ];

    const securityCards = [
        {
            title: "Encrypted Transactions",
            description: "All sensitive checkout actions and traffic are encrypted using secure AES-256 protocols.",
            icon: Lock
        },
        {
            title: "Secure Authentication",
            description: "Multi-factor authentication options and salted hash architectures safeguard login parameters.",
            icon: Shield
        },
        {
            title: "Protected Servers",
            description: "Infrastructure databases reside behind strict firewalls and internal virtual networks.",
            icon: Server
        },
        {
            title: "Safe Payments",
            description: "PCI-DSS compliant gateways process credit cards without storing numeric digits internally.",
            icon: CreditCard
        }
    ];

    const rightsList = [
        {
            title: "Access Data",
            description: "Request a complete digital file export of all personal details and logs we hold about your profile."
        },
        {
            title: "Update Data",
            description: "Modify, correct, or update incomplete or outdated fields within your collector dashboard settings."
        },
        {
            title: "Delete Account",
            description: "Request complete cancellation of your registered login credentials and profile metadata."
        },
        {
            title: "Data Removal Requests",
            description: "Submit a formal request to purge transaction history, logs, or contact records from active databases."
        },
        {
            title: "Preference Management",
            description: "Opt-out or manage subscription alerts, newsletters, cookies configurations, and targeted brand notifications."
        }
    ];

    const useCases = [
        "Process Orders: Authenticate checkouts and process transaction invoicing swiftly.",
        "Deliver Products: Coordinate logistics dispatches with verified carrier and courier services.",
        "Customer Support: Manage service ticket resolution queues, emails, and phone channels.",
        "Improve Services: Evaluate performance logging and optimize customer experience interfaces.",
        "Notifications: Dispatch shipping tracking alerts, transactional emails, and optional promo cards.",
        "Fraud Prevention: Verify payment authorization checks and monitor threat activity logs."
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
                        <Shield className="h-3 w-3" /> ShopEsy Trust & Safety
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4"
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-6"
                    >
                        Your Privacy Matters
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

            {/* ── 2. Introduction Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Our Commitment</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Introduction</h2>
                    </div>
                    <p className="mt-6 text-sm sm:text-base text-slate-500 leading-relaxed">
                        At ShopEsy, we value the trust you place in us when sharing your personal information. We are committed to protecting your privacy and securing your personal details against unauthorized access. This Privacy Policy details the metrics we compile, how we apply the compiled insights to fulfill order obligations, the security parameters we implement, and the options you can exercise to manage your profile data.
                    </p>
                    <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
                        By accessing our shop portals, registry lines, checkout pages, and help queues, you consent to the collection and use practices outlined in this policy document.
                    </p>
                </div>
            </section>

            {/* ── 3. Information We Collect ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Compiled Metrics</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Information We Collect</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collectCards.map((card, idx) => {
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
                                        <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-1">{card.title}</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 4. How We Use Information ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Fulfillment Metrics</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">How We Use Information</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {useCases.map((useCase, idx) => {
                            const [title, desc] = useCase.split(": ");
                            return (
                                <div key={idx} className="flex gap-3 items-start bg-slate-50 border border-slate-100 p-5">
                                    <CheckCircle2 className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">{title}</h4>
                                        <p className="text-[11px] text-slate-400 leading-normal">{desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. Cookies & Tracking Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-6">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Web Technologies</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Cookies & Tracking</h2>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        ShopEsy utilizes cookie files, pixels, and basic browser local storage indicators to enhance catalog performance, verify login sessions, cache wishlist items, and identify web browser behaviors. These cookies assist us in verifying shopping cart counts and preserving visual configurations (such as layout choices or search histories).
                    </p>
                    <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
                        You can configure your browser preferences to refuse all cookies or notify you when a cookie is sent. Note that blocking essential cookies may disrupt primary checkout and account functions.
                    </p>
                </div>
            </section>

            {/* ── 6. Information Sharing Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-8">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Third-Party Disclosures</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Information Sharing</h2>
                    </div>
                    
                    {/* Key declaration box */}
                    <div className="bg-red-50/50 border border-red-100 p-6 mb-8 rounded-none">
                        <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest block mb-1">Our Core Policy</span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                            ShopEsy maintains a strict policy: **we never sell, lease, trade, or share customer personal information with external parties for advertising or monetization.**
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">1</div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Trusted Payment Providers</h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                                    We transmit secure financial transactions only to PCI-DSS compliant credit card processors and UPI gateway services (e.g., Stripe, PayPal, Razorpay) to complete orders.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">2</div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Delivery Partners</h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                                    We share shipping addresses and contact telephone numbers with trusted logistics services to handle physical distribution and courier logistics.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">3</div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Legal Compliance</h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                                    We may release required records when mandated under lawful subpoenas, judicial processes, or to safeguard property, security, and customer transaction protection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. Data Security Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Safeguards</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Data Security</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {securityCards.map((card, idx) => {
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

            {/* ── 8. Customer Rights Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className="border-l-4 border-black pl-5 mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Your Autonomy</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">Customer Rights</h2>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-5">
                        {rightsList.map((right, idx) => (
                            <div key={right.title} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-black" />
                                    {right.title}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-slate-400 leading-normal pl-3.5">
                                    {right.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 9. Contact Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Direct Inquiries</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Privacy Contact</h2>
                    </div>

                    <div className="bg-white border border-slate-200 p-8 max-w-xl mx-auto text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-none mb-4">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-1">Privacy Support Desk</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
                            For data removal requests, access logs files, preferences setups, or other privacy operations, reach our dedicated officer coordinates directly.
                        </p>
                        
                        <a 
                            href="mailto:privacy@shopesy.com" 
                            className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white text-xs font-bold px-6 py-3 border border-slate-200 hover:border-slate-300 transition-colors uppercase tracking-wider rounded-none"
                        >
                            <span>privacy@shopesy.com</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── 10. Footer Notice ── */}
            <footer className="py-8 bg-zinc-900 text-zinc-500 text-center text-xs border-t border-zinc-800">
                <div className="max-w-4xl mx-auto px-4">
                    <p className="leading-relaxed uppercase tracking-wider text-[9px] font-bold text-zinc-600 mb-1">ShopEsy Privacy Council</p>
                    <p className="leading-normal">
                        © 2026 ShopEsy Inc. All legal compliance actions and safety protocols adhere strictly to state privacy frameworks and data protection acts.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPage;
