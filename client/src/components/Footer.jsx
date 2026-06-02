import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin, Shield, Send, ShieldCheck, Lock, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

const Footer = () => {
    const [showSafePaymentModal, setShowSafePaymentModal] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        toast.success("🎉 Thank you for subscribing to our newsletter!");
    };

    return (
        <footer className="bg-[#000000] text-zinc-400 border-t border-neutral-900 mt-auto text-left">
            {/* Top Grid Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    
                    {/* Brand & About Section */}
                    <div className="flex flex-col gap-5 lg:col-span-2">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-white p-2 rounded-xl text-black shadow-md shadow-zinc-950/5">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">ShopEsy</span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                            Your premium destination for tech, fashion, books, and lifestyle essentials. Discover handpicked high-quality products, fast delivery, and secure checkouts.
                        </p>
                        
                        {/* Social Icons - Premium Dark Icons */}
                        <div className="flex items-center gap-3 mt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black border border-zinc-800 transition-all hover:-translate-y-0.5 duration-200">
                                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black border border-zinc-800 transition-all hover:-translate-y-0.5 duration-200">
                                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2.5 rounded-xl bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black border border-zinc-800 transition-all hover:-translate-y-0.5 duration-200">
                                <svg className="h-4.5 w-4.5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Categories */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Shop Categories</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/shop" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop/men" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Men's Fashion
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop/women" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Women's Fashion
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop/kids" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Kids' Fashion
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop/men-accessories" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Men Accessories
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop/women-accessories" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Women Accessories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/myorders" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Order Tracking
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund-policy" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping-policy" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li 
                                onClick={() => setShowSafePaymentModal(true)} 
                                className="flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-white cursor-pointer"
                            >
                                <Shield className="h-4 w-4 text-emerald-500" />
                                <span>100% Safe Payments</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Get in Touch</h4>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2.5 text-sm">
                                    <MapPin className="h-4 w-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                                    <span>100 Stripe Way, San Francisco, CA 94103</span>
                                </li>
                                <li className="flex items-center gap-2.5 text-sm">
                                    <Mail className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                                    <a href="mailto:support@shopesy.com" className="hover:text-white transition-colors">
                                        support@shopesy.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-2.5 text-sm">
                                    <Phone className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                                    <span>+1 (800) 123-4567</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Newsletter Box (Visual Polish Addition) */}
                <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="max-w-md">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Subscribe to our newsletter</h4>
                        <p className="text-xs text-zinc-500 mt-1">Get the latest updates on new collections and exclusive promotions.</p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto max-w-sm">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            required
                            className="px-4 py-2.5 text-sm rounded-xl bg-zinc-950 border border-zinc-800 focus:border-white focus:ring-4 focus:ring-white/5 outline-none text-white placeholder-zinc-650 w-full transition-all"
                        />
                        <button
                            type="submit"
                            className="bg-white hover:bg-zinc-200 text-black font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                        >
                            <span>Join</span>
                            <Send className="h-3.5 w-3.5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#09090b] border-t border-neutral-900 py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-zinc-500">
                        &copy; {new Date().getFullYear()} ShopEsy Inc. All rights reserved. Made for MohammedAzam004.
                    </p>
                    {/* Payment Indicators */}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest select-none">
                        <span className="px-2.5 py-1 rounded bg-[#000000] border border-neutral-900 shadow-sm">Visa</span>
                        <span className="px-2.5 py-1 rounded bg-[#000000] border border-neutral-900 shadow-sm">Mastercard</span>
                        <span className="px-2.5 py-1 rounded bg-[#000000] border border-neutral-900 shadow-sm">Razorpay</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showSafePaymentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-6 text-left relative overflow-hidden"
                        >
                            <button 
                                onClick={() => setShowSafePaymentModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-black p-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border-none"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center rounded-2xl">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-black">100% Safe Payments</h3>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secured & Certified</p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                Your payment security is our top priority. ShopEsy partners with industry-leading financial networks and gateways to ensure all transactions are fully encrypted.
                            </p>

                            <div className="flex flex-col gap-3 mb-5">
                                <div className="flex items-start gap-2.5 text-xs">
                                    <Lock className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <strong className="text-slate-800 block font-bold">256-bit SSL Encryption</strong>
                                        <span className="text-slate-400 text-[11px]">All communication between your browser and our servers is cryptographically secured.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs">
                                    <Shield className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <strong className="text-slate-800 block font-bold">PCI-DSS Conformance</strong>
                                        <span className="text-slate-400 text-[11px]">We never store your complete card details on our local database.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 text-xs">
                                    <ShieldCheck className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <strong className="text-slate-800 block font-bold">Razorpay Smart Gateway</strong>
                                        <span className="text-slate-400 text-[11px]">Seamless and secure checkout verifying payments via signature protocols.</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSafePaymentModal(false)}
                                className="w-full bg-black hover:bg-zinc-900 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                            >
                                Dismiss Details
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;
