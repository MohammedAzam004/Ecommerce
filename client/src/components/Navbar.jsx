import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingBag, Search, User, LogOut, Package, ShieldCheck, Menu, X, ChevronDown, XCircle, RotateCcw, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { cartItems } = useContext(CartContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
    );

    const handleLogout = () => {
        localStorage.removeItem("userInfo");

        window.location.reload();
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate("/");
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
            <div className="w-full px-4 md:px-6">
                <div className="flex justify-between h-16 items-center gap-4">

                    {/* Brand Logo */}
                    <div className="flex-shrink-0 flex items-center ml-2">
                        <Link to="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
                            <div className="bg-black p-2 rounded-xl text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-300">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-black">
                                ShopEsy
                            </span>
                        </Link>
                    </div>

                    {/* Integrated Search Bar - Stripe Style */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="hidden md:flex flex-1 max-w-md relative items-center group"
                    >
                        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for essentials..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-50 border border-slate-200 focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all duration-200 text-black placeholder:text-slate-400"
                        />
                    </form>

                    {/* Right Menu Links */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-black px-4 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 active:scale-95">
                            Home
                        </Link>

                        <Link to="/shop" className="text-sm font-semibold text-slate-600 hover:text-black px-4 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 active:scale-95">
                            Shop
                        </Link>

                        <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-black px-4 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 active:scale-95">
                            About Us
                        </Link>

                        <Link to="/support" className="text-sm font-semibold text-slate-600 hover:text-black px-4 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 active:scale-95">
                            Support Center
                        </Link>

                        {/* Cart Link with Animated Badge */}
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-black px-4 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 active:scale-95"
                        >
                            <span>Cart</span>
                            {cartItems.length > 0 ? (
                                <motion.span
                                    key={cartItems.length}
                                    initial={{ scale: 0.6 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    className="flex items-center justify-center bg-black text-white text-[10px] font-bold h-5 min-w-5 px-1.5 rounded-full shadow-sm shadow-black/20"
                                >
                                    {cartItems.length}
                                </motion.span>
                            ) : (
                                <span className="text-slate-400 text-xs">(0)</span>
                            )}
                        </Link>

                        {/* Account Menu */}
                        {userInfo ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 hover:text-black pl-2 pr-4 py-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 active:scale-95 focus:outline-none cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-full bg-slate-100 text-black font-bold flex items-center justify-center text-xs border border-slate-200 uppercase">
                                        {userInfo.user?.name ? userInfo.user.name[0] : "U"}
                                    </div>
                                    <span>{userInfo.user?.name?.split(" ")[0]}</span>
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu Sheet */}
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setDropdownOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white border border-slate-100 p-2 shadow-[0_12px_30px_-4px_rgba(0, 0, 0, 0.15)] ring-1 ring-slate-900/5 z-20 text-left"
                                            >
                                                <div className="px-3.5 py-2.5 border-b border-slate-100 text-left">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Signed in as</p>
                                                    <p className="text-sm font-bold text-black truncate mt-0.5">{userInfo.user?.name}</p>
                                                </div>

                                                <Link
                                                    to="/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 mt-1.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-black hover:bg-slate-50 transition-all"
                                                >
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    <span>Profile Details</span>
                                                </Link>

                                                <Link
                                                    to="/myorders"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-black hover:bg-slate-50 transition-all"
                                                >
                                                    <Package className="h-4 w-4 text-slate-400" />
                                                    <span>My Orders</span>
                                                </Link>

                                                <Link
                                                    to="/order-status"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-black hover:bg-slate-50 transition-all"
                                                >
                                                    <Compass className="h-4 w-4 text-slate-400" />
                                                    <span>Order Status</span>
                                                </Link>

                                                <Link
                                                    to="/cancel-order"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-black hover:bg-slate-50 transition-all"
                                                >
                                                    <XCircle className="h-4 w-4 text-slate-400" />
                                                    <span>Cancel Order</span>
                                                </Link>

                                                <Link
                                                    to="/return-product"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-black hover:bg-slate-50 transition-all"
                                                >
                                                    <RotateCcw className="h-4 w-4 text-slate-400" />
                                                    <span>Return Product</span>
                                                </Link>

                                                {userInfo.user?.isAdmin && (
                                                    <Link
                                                        to="/admin/dashboard"
                                                        onClick={() => setDropdownOpen(false)}
                                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-black hover:bg-zinc-100 transition-all"
                                                    >
                                                        <ShieldCheck className="h-4 w-4 text-black" />
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 mt-1.5 rounded-xl text-sm font-semibold text-[#EF4444] hover:bg-red-50 transition-all cursor-pointer text-left"
                                                >
                                                    <LogOut className="h-4 w-4 text-[#EF4444]" />
                                                    <span>Log out</span>
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-black px-4 py-2 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 active:scale-95">
                                    Login
                                </Link>
                                <Link to="/register" className="text-sm font-semibold text-white bg-black hover:bg-zinc-900 rounded-xl px-4 py-2 shadow-sm transition-all duration-200 active:scale-95">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Action Icon */}
                    <div className="flex md:hidden items-center gap-3">
                        {/* Mobile Cart Trigger */}
                        <Link to="/cart" className="relative p-2 text-slate-500 hover:text-black transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="text-slate-500 hover:text-black p-2 rounded-xl focus:outline-none"
                        >
                            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="absolute top-16 left-0 right-0 z-50 md:hidden overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-6 space-y-4 shadow-xl"
                    >

                        {/* Mobile Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search essentials..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full bg-slate-50 border border-slate-200 outline-none focus:border-black"
                            />
                        </form>

                        <Link
                            to="/"
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                        >
                            Home
                        </Link>

                        <Link
                            to="/shop"
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                        >
                            Shop
                        </Link>

                        <Link
                            to="/about"
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                        >
                            About Us
                        </Link>

                        <Link
                            to="/support"
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                        >
                            Support Center
                        </Link>

                        {userInfo ? (
                            <div className="pt-3 border-t border-slate-100 space-y-1.5">
                                <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Welcome, <span className="text-black font-bold">{userInfo.user?.name}</span>
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                                >
                                    <User className="h-5 w-5 text-slate-400" />
                                    <span>Profile Details</span>
                                </Link>
                                <Link
                                    to="/myorders"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                                >
                                    <Package className="h-5 w-5 text-slate-400" />
                                    <span>My Orders</span>
                                </Link>

                                <Link
                                    to="/order-status"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                                >
                                    <Compass className="h-5 w-5 text-slate-400" />
                                    <span>Order Status</span>
                                </Link>

                                <Link
                                    to="/cancel-order"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                                >
                                    <XCircle className="h-5 w-5 text-slate-400" />
                                    <span>Cancel Order</span>
                                </Link>

                                <Link
                                    to="/return-product"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:text-black hover:bg-slate-50 transition-all"
                                >
                                    <RotateCcw className="h-5 w-5 text-slate-400" />
                                    <span>Return Product</span>
                                </Link>

                                {userInfo.user?.isAdmin && (
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-base font-bold text-black hover:bg-zinc-100 transition-all"
                                    >
                                        <ShieldCheck className="h-5 w-5 text-black" />
                                        <span>Admin Panel</span>
                                    </Link>
                                )}

                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 mt-2 rounded-xl text-base font-semibold text-[#EF4444] hover:bg-red-50 transition-all text-left"
                                >
                                    <LogOut className="h-5 w-5 text-[#EF4444]" />
                                    <span>Log out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-center px-4 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-center px-4 py-2.5 rounded-xl text-base font-semibold text-white bg-black hover:bg-zinc-900 transition-all"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

