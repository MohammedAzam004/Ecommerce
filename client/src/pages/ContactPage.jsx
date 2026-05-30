import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock, 
    ShoppingBag, 
    RotateCcw, 
    CreditCard, 
    Truck, 
    User, 
    ShieldCheck, 
    ArrowRight, 
    MessageSquare, 
    CheckCircle2, 
    Sparkles 
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { toast } from "react-toastify";

const ContactPage = () => {
    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Errors state
    const [errors, setErrors] = useState({});

    // Validate form
    const validateForm = () => {
        const formErrors = {};
        if (!name.trim()) formErrors.name = "Name is required";
        if (!email.trim()) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = "Please enter a valid email address";
        }
        if (!subject.trim()) formErrors.subject = "Subject is required";
        if (!message.trim()) formErrors.message = "Message is required";
        return formErrors;
    };

    // Form submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            toast.error("✗ Please correct the errors in the form.");
        } else {
            setErrors({});
            setSubmitted(true);
            toast.success("✓ Thank you! Your support ticket has been received.");
            // Reset form fields
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        }
    };

    // Scroll to form helper
    const scrollToForm = () => {
        const element = document.getElementById("contact-form-section");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navigate = useNavigate();

    // Active quick-help category
    const [activeQuickHelp, setActiveQuickHelp] = useState(null);

    // Navigate to Support page with the right category pre-highlighted
    const handleQuickHelpClick = (key) => {
        setActiveQuickHelp(key);
        // Navigate to support page; SupportPage will handle the category
        setTimeout(() => navigate("/support"), 180);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-800">
            {/* ── 1. Hero Section ── */}
            <section className="relative overflow-hidden py-20 border-b border-zinc-150 bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-extrabold uppercase tracking-widest rounded-none mb-6"
                    >
                        <Sparkles className="h-3 w-3" /> Dedicated Concierge
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4 animate-tracking"
                    >
                        Contact ShopEsy
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-6 max-w-2xl"
                    >
                        We Are Here To Elevate Your Wardrobe Journey
                    </motion.p>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-8"
                    >
                        Have a question about tailoring, orders, exchanges, or styling guides? Contact our expert client care concierge.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <button 
                            onClick={scrollToForm}
                            className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm px-8 py-4 rounded-none shadow-md transition-all active:scale-[0.98]"
                        >
                            <span>Contact Support</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── 2. Contact Information Cards Section ── */}
            <section className="py-16 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Email Card */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden"
                        >
                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-1">Email Support</h4>
                                <a href="mailto:support@shopesy.com" className="text-xs font-semibold text-slate-500 hover:text-black transition-colors block">
                                    support@shopesy.com
                                </a>
                                <a href="mailto:concierge@shopesy.com" className="text-xs font-semibold text-slate-400 hover:text-black transition-colors block mt-0.5">
                                    concierge@shopesy.com
                                </a>
                            </div>
                        </motion.div>

                        {/* Phone Card */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden"
                        >
                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-1">Phone Number</h4>
                                <span className="text-xs font-semibold text-slate-500 block">
                                    +1 (800) 123-4567
                                </span>
                                <span className="text-xs text-slate-400 block mt-0.5">
                                    Toll-Free Styling Line
                                </span>
                            </div>
                        </motion.div>

                        {/* Address Card */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden"
                        >
                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-1">Business Address</h4>
                                <span className="text-xs font-semibold text-slate-500 block">
                                    100 Stripe Way,
                                </span>
                                <span className="text-xs text-slate-400 block mt-0.5">
                                    San Francisco, CA 94103
                                </span>
                            </div>
                        </motion.div>

                        {/* Working Hours Card */}
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 text-left relative overflow-hidden"
                        >
                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-1">Working Hours</h4>
                                <span className="text-xs font-semibold text-slate-500 block">
                                    Mon - Fri: 9:00 AM - 6:00 PM
                                </span>
                                <span className="text-xs text-slate-400 block mt-0.5">
                                    EST Custom Service Hours
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── 3. Contact Form Section ── */}
            <section id="contact-form-section" className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Support Ticket</span>
                        <h2 className="text-3xl font-black text-black mt-2 tracking-tight">Send Us A Message</h2>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-sm text-left">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    className="flex flex-col items-center text-center py-10"
                                >
                                    <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4 stroke-[1.5]" />
                                    <h3 className="text-2xl font-bold text-black tracking-tight mb-2">Message Sent Successfully!</h3>
                                    <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                                        We have received your support request. One of our fashion concierges will review your details and reach out within 24 business hours.
                                    </p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="bg-white hover:bg-slate-50 text-black border border-zinc-200 font-bold text-xs px-6 py-3 rounded-none shadow-sm transition-all"
                                    >
                                        Send Another Message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="contact-name" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Your Name
                                            </label>
                                            <input 
                                                id="contact-name"
                                                type="text" 
                                                placeholder="e.g. John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={`w-full px-4 py-3 text-sm bg-white border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-none outline-none focus:border-black transition-all`}
                                            />
                                            {errors.name && <span className="text-[10px] font-bold text-red-500">{errors.name}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Email Address
                                            </label>
                                            <input 
                                                id="contact-email"
                                                type="email" 
                                                placeholder="e.g. name@domain.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`w-full px-4 py-3 text-sm bg-white border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-none outline-none focus:border-black transition-all`}
                                            />
                                            {errors.email && <span className="text-[10px] font-bold text-red-500">{errors.email}</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="contact-subject" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Subject
                                        </label>
                                        <input 
                                            id="contact-subject"
                                            type="text" 
                                            placeholder="How can we help you?"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className={`w-full px-4 py-3 text-sm bg-white border ${errors.subject ? 'border-red-500' : 'border-slate-200'} rounded-none outline-none focus:border-black transition-all`}
                                        />
                                        {errors.subject && <span className="text-[10px] font-bold text-red-500">{errors.subject}</span>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Message
                                        </label>
                                        <textarea 
                                            id="contact-message"
                                            rows="5"
                                            placeholder="Write your support inquiry in details..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className={`w-full px-4 py-3 text-sm bg-white border ${errors.message ? 'border-red-500' : 'border-slate-200'} rounded-none outline-none focus:border-black transition-all resize-none`}
                                        />
                                        {errors.message && <span className="text-[10px] font-bold text-red-500">{errors.message}</span>}
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full mt-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm py-4 rounded-none shadow-md transition-all active:scale-[0.98]"
                                    >
                                        Submit Ticket
                                    </button>
                                </form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ── 4. Quick Help Categories Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Self Help</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-black mt-2 tracking-tight">Quick Help Categories</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                        {[
                            { key: "orders",   Icon: ShoppingBag, label: "Orders" },
                            { key: "returns",  Icon: RotateCcw,   label: "Returns" },
                            { key: "refunds",  Icon: CreditCard,  label: "Refunds" },
                            { key: "shipping", Icon: Truck,       label: "Shipping" },
                            { key: "account",  Icon: User,        label: "Account Help" },
                            { key: "payments", Icon: ShieldCheck, label: "Payments" },
                        ].map(({ key, Icon, label }) => {
                            const isActive = activeQuickHelp === key;
                            return (
                                <motion.button
                                    key={key}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => handleQuickHelpClick(key)}
                                    className={`p-5 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-200 rounded-none border group ${
                                        isActive
                                            ? "bg-black border-black"
                                            : "bg-white border-slate-200/80 hover:border-slate-300"
                                    }`}
                                >
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-none transition-all duration-200 ${
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-50 text-slate-700 group-hover:bg-slate-950 group-hover:text-white"
                                    }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${
                                        isActive ? "text-white" : "text-black"
                                    }`}>{label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5 & 6. Location and Social Media Section ── */}
            <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Map placeholder (7 Columns) */}
                        <div className="lg:col-span-7 h-[360px] sm:h-[420px] bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col relative group">
                            {/* Outer card styled with dot matrix & locator overlay */}
                            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-lg max-w-sm">
                                    <MapPin className="h-8 w-8 text-black mb-3.5 animate-bounce" />
                                    <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-1">ShopEsy Headquarters</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                        100 Stripe Way, San Francisco, CA 94103
                                    </p>
                                    <a 
                                        href="https://maps.google.com" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-black hover:bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-none transition-all"
                                    >
                                        Open in Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Details (5 Columns) */}
                        <div className="lg:col-span-5 text-left flex flex-col gap-6">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Social Channels</span>
                            <h2 className="text-3xl font-black text-black leading-tight tracking-tight">
                                Connect With Us Across Social Media
                            </h2>
                            <div className="h-1 w-12 bg-black" />
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Join our collector community. Share your styling combinations, discover early-release updates, and engage with designers.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {/* Instagram */}
                                <a 
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-white border border-slate-200/80 hover:border-black hover:bg-slate-50 transition-all rounded-none group"
                                >
                                    <div className="p-2 bg-rose-50 text-rose-500 rounded-none group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <FaInstagram className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold text-black uppercase tracking-wider">Instagram</span>
                                </a>

                                {/* Facebook */}
                                <a 
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-white border border-slate-200/80 hover:border-black hover:bg-slate-50 transition-all rounded-none group"
                                >
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-none group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <FaFacebookF className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold text-black uppercase tracking-wider">Facebook</span>
                                </a>

                                {/* Twitter/X */}
                                <a 
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-white border border-slate-200/80 hover:border-black hover:bg-slate-50 transition-all rounded-none group"
                                >
                                    <div className="p-2 bg-zinc-100 text-black rounded-none group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <FaTwitter className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold text-black uppercase tracking-wider">Twitter / X</span>
                                </a>

                                {/* LinkedIn */}
                                <a 
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-white border border-slate-200/80 hover:border-black hover:bg-slate-50 transition-all rounded-none group"
                                >
                                    <div className="p-2 bg-sky-50 text-sky-600 rounded-none group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <FaLinkedinIn className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold text-black uppercase tracking-wider">LinkedIn</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. CTA Section ── */}
            <section className="py-20 bg-gradient-to-r from-zinc-950 to-neutral-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
                    <MessageSquare className="h-10 w-10 text-zinc-400 mb-6 stroke-[1.25]" />
                    <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                        Need Immediate Assistance?
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mb-8">
                        Our customer service concierges are online to answer live questions regarding sizing, payment verifications, and delivery trackers.
                    </p>
                    <button 
                        onClick={scrollToForm}
                        className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm px-8 py-4 rounded-none shadow-lg transition-all active:scale-[0.98]"
                    >
                        <span>Get Support</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
