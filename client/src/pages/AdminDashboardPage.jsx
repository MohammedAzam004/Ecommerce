import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { extractErrorMessage } from "../utils/errorHelper";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  ArrowLeft,
  Settings,
  RotateCcw,
  ImagePlay
} from "lucide-react";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const fetchStats = useCallback(async (token) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      const errMsg = extractErrorMessage(error, "Failed to load admin dashboard statistics");
      toast.error("✗ " + errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.user || !userInfo.user.isAdmin) {
      navigate("/");
    } else {
      Promise.resolve().then(() => {
        fetchStats(userInfo.token);
      });
    }
  }, [navigate, fetchStats]);

  if (loading) {
    return <Loader text="Loading analytical metrics..." />;
  }

  const sidebarLinks = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { title: "Products", path: "/admin/products", icon: <Package className="h-4 w-4" /> },
    { title: "Orders", path: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" /> },
    { title: "Returns", path: "/admin/returns", icon: <RotateCcw className="h-4 w-4" /> },
    { title: "Users", path: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { title: "Banners", path: "/admin/banner", icon: <ImagePlay className="h-4 w-4" /> },
  ];

  // Motion variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  // Mobile Drawer Sidebar Menu Component
  const MobileDrawer = () => (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          />
          {/* Slide out drawer panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 p-6 flex flex-col gap-6 lg:hidden shadow-xl text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <span className="font-extrabold text-black flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-black" />
                Control Center
              </span>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-xl border hover:bg-slate-50 text-slate-400 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.title}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive 
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-auto border-t border-slate-50 pt-4">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-black hover:bg-zinc-100 rounded-2xl transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Shop</span>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh] text-left relative"
    >
      <MobileDrawer />

      {/* Grid Container split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar (Left Pane) */}
        <div className="lg:col-span-3 hidden lg:flex flex-col gap-6 bg-white border border-slate-100 p-5 rounded-3xl shadow-[0_4px_25px_-6px_rgba(0, 0, 0, 0.06)]">
          <span className="font-extrabold text-black flex items-center gap-2 border-b border-slate-50 pb-3.5 px-2">
            <ShieldCheck className="h-5 w-5 text-black" />
            Control Center
          </span>

          <div className="flex flex-col gap-1.5">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.title}
                  to={link.path}
                  className={`flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-xs font-extrabold transition-all relative ${
                    isActive 
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.icon}
                  <span>{link.title}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeBar"
                      className="absolute right-2.5 w-1 h-4 bg-black rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-50 pt-4.5 mt-2 px-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-xs font-bold text-slate-500 hover:text-black transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to Shop</span>
            </Link>
          </div>
        </div>

        {/* Main Panel Analytics Content (Right Pane) */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          
          {/* Top Title Headers & Menu Toggles */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-black flex items-center gap-2">
                <Settings className="h-7 w-7 text-slate-600 animate-spin-slow" />
                Administrative Panel
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor system metrics, review commercial volumes, and edit catalogs.
              </p>
            </div>
            
            {/* Hamburger trigger for mobile sidebar */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {stats && (
            <div className="flex flex-col gap-6">
              
              {/* Vercel-Style Dark Revenue Card */}
              <motion.div
                variants={cardVariants}
                className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_40px_-4px_rgba(0, 0, 0, 0.22)] relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-500/10 via-transparent to-transparent opacity-60" />
                
                <div className="flex-1 relative z-10 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block mb-1">
                    Gross Volume Sales
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                    ₹{stats.totalRevenue.toLocaleString("en-IN")}
                  </h2>
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/20">
                      <TrendingUp className="h-3 w-3" />
                      +14.8% Growth
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
                  </div>
                </div>
                
                {/* Decorative trendline visual */}
                <div className="h-16 w-32 flex items-end justify-between shrink-0 opacity-60 hidden sm:flex">
                  {[20, 35, 25, 45, 38, 60, 50, 75].map((val, idx) => (
                    <div 
                      key={idx} 
                      className="w-2 bg-gradient-to-t from-zinc-500 to-zinc-300 rounded-t"
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Stripe-Style 3-Column Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Products Stat */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-3xl border border-slate-100/90 p-5 shadow-[0_4px_20px_-4px_rgba(0, 0, 0, 0.06)] flex items-center justify-between hover:shadow-md hover:border-slate-200/50 transition-all duration-300"
                >
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">Catalog Pieces</span>
                    <span className="text-2xl font-black text-slate-900">{stats.totalProducts}</span>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-500 rounded-2xl">
                    <Package className="h-5 w-5" />
                  </div>
                </motion.div>

                {/* Users Stat */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-3xl border border-slate-100/90 p-5 shadow-[0_4px_20px_-4px_rgba(0, 0, 0, 0.06)] flex items-center justify-between hover:shadow-md hover:border-slate-200/50 transition-all duration-300"
                >
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">Registered Users</span>
                    <span className="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
                  </div>
                  <div className="p-3 bg-zinc-100 border border-zinc-200 text-black rounded-2xl">
                    <Users className="h-5 w-5" />
                  </div>
                </motion.div>

                {/* Orders Stat */}
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-3xl border border-slate-100/90 p-5 shadow-[0_4px_20px_-4px_rgba(0, 0, 0, 0.06)] flex items-center justify-between hover:shadow-md hover:border-slate-200/50 transition-all duration-300"
                >
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">Order Invoices</span>
                    <span className="text-2xl font-black text-slate-900">{stats.totalOrders}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-2xl">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </motion.div>

              </div>

            </div>
          )}

          {/* SaaS Navigation Modules Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Manage Products Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              onClick={() => navigate("/admin/products")}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between items-start gap-4 text-left cursor-pointer group"
            >
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 text-indigo-500 rounded-2xl">
                <Package className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>Manage Products</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-medium">
                  Review catalogues, adjust warehouse stock values, upload assets, and edit product specifications.
                </p>
              </div>
            </motion.div>

            {/* Manage Orders Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              onClick={() => navigate("/admin/orders")}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between items-start gap-4 text-left cursor-pointer group"
            >
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-2xl">
                <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>Manage Orders</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-medium">
                  Supervise customer invoice fulfillments, trace logistics statuses, and manage dispatch parameters.
                </p>
              </div>
            </motion.div>

            {/* Manage Users Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              onClick={() => navigate("/admin/users")}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between items-start gap-4 text-left cursor-pointer group"
            >
              <div className="p-3.5 bg-zinc-100 border border-zinc-200 text-black rounded-2xl">
                <Users className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>Manage Users</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-medium">
                  Review accounts registry, oversee customer profiles, and manage system administrators.
                </p>
              </div>
            </motion.div>

            {/* Manage Returns Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              onClick={() => navigate("/admin/returns")}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between items-start gap-4 text-left cursor-pointer group"
            >
              <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-500 rounded-2xl">
                <RotateCcw className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>Manage Returns</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-medium">
                  Review customer return tickets, inspect proof materials, and approve/reject refund authorizations.
                </p>
              </div>
            </motion.div>

            {/* Banner Management Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -4 }}
              onClick={() => navigate("/admin/banner")}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200/50 transition-all duration-300 flex flex-col justify-between items-start gap-4 text-left cursor-pointer group"
            >
              <div className="p-3.5 bg-violet-50 border border-violet-100 text-violet-500 rounded-2xl">
                <ImagePlay className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                  <span>Banner Management</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-medium">
                  Edit homepage hero banners, replace showcase images, update text overlays, and manage banner status.
                </p>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;