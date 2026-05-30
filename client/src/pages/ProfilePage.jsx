import { API_BASE_URL } from "../utils/config";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { extractErrorMessage } from "../utils/errorHelper";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Camera, 
  Sparkles, 
  Award, 
  ArrowLeft, 
  Settings,
  ShoppingBag
} from "lucide-react";
import { getMyOrders } from "../services/orderService";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || null;
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      Promise.resolve().then(() => {
        setName(userInfo.user.name || "");
        setEmail(userInfo.user.email || "");
        
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders(userInfo.token);
                if (Array.isArray(data)) {
                    setOrders(data.slice(0, 3));
                }
            } catch (err) {
                console.error("Error loading orders in profile:", err);
            }
        };
        fetchOrders();
      });
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_BASE_URL}/api/users/profile`,
        { name, email, password },
        config
      );

      const updatedUserInfo = {
        token: data.token,
        user: data.user
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
      setPassword("");

      toast.success("✓ Profile Updated Successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      const errMsg = extractErrorMessage(error, "Failed to update profile.");
      toast.error("✗ " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return null;
  }

  // Visual Helper Variable for dynamic avatar initial
  const userInitial = name ? name[0].toUpperCase() : "U";
  const isAdminUser = userInfo.user.isAdmin;

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 bg-[#FAFAFA] min-h-[80vh] text-left"
    >
      {/* Page Navigation & Title */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black mb-3 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Shop
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-black flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-slate-600 animate-spin-slow" />
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your credentials, update your email, or change your secure login password.
        </p>
      </div>

      {loading && <Loader text="Updating account settings..." />}

      {/* 2-Column Split Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Premium Profile Summary Card */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_30px_-6px_rgba(0, 0, 0, 0.10)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-black" />
            
            {/* Styled Avatar Section */}
            <div className="relative mt-4 mb-4 group">
              <div className="absolute inset-0 bg-black/10 rounded-full blur-lg scale-110 group-hover:scale-125 transition-transform" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-black via-zinc-900 to-slate-700 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-md border-4 border-white select-none">
                {userInitial}
              </div>
              <div className="absolute bottom-1 right-1 bg-white border border-slate-200 p-1.5 rounded-full shadow-md text-slate-500 hover:text-black cursor-pointer hover:scale-105 transition-all">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            {/* User Details */}
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
              {name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </p>

            {/* Role Badges */}
            <div className="mt-4.5 flex flex-wrap gap-2 justify-center">
              {isAdminUser ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  System Administrator
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  <Award className="h-3 w-3" />
                  Bespoke Collector
                </span>
              )}
            </div>

            {/* Security Check Recaps */}
            <div className="w-full border-t border-slate-50 mt-6 pt-5 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 border border-slate-100/50 p-3 rounded-2xl">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                  <span>Credential Status</span>
                </span>
                <span className="font-bold text-emerald-600">Verified</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Update Settings Form Card */}
        <div className="lg:col-span-8 w-full">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_30px_-6px_rgba(0, 0, 0, 0.10)] flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <User className="h-5 w-5 text-black" />
              Account Details
            </h3>

            <form onSubmit={submitHandler} className="flex flex-col gap-5 text-left">
              
              {/* Form Input: Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="profile-name" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Alexander Mercer"
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 placeholder-slate-350 shadow-sm"
                />
              </div>

              {/* Form Input: Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="profile-email" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. alexander@mercer.com"
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 placeholder-slate-350 shadow-sm"
                />
              </div>

              {/* Form Input: New Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="profile-password" className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  New Password
                </label>
                <input
                  id="profile-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to preserve current password"
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 text-slate-900 placeholder-slate-350 shadow-sm"
                />
                <span className="text-[10px] text-slate-400 font-medium leading-relaxed pl-1">
                  For your security, pick a strong password containing at least 6 characters.
                </span>
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-black hover:bg-zinc-900 text-white rounded-2xl py-3.5 shadow-md flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed select-none cursor-pointer"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
                <span>{loading ? "Saving Changes..." : "Save Profile Details"}</span>
              </button>

            </form>
          </div>

          {/* Recent Orders section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-[0_4px_30px_-6px_rgba(0, 0, 0, 0.10)] flex flex-col gap-6 mt-8">
              <div>
                  <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-black" />
                      <span>Recent Orders</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Your latest purchases and fulfillment updates.</p>
              </div>

              {orders.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-dashed border-slate-200/80 rounded-2xl text-center">
                      <p className="text-xs text-slate-400">No orders placed yet. Check out the latest trends to get started!</p>
                      <Link to="/" className="text-xs font-bold text-black hover:underline mt-2 inline-block">Browse Collections</Link>
                  </div>
              ) : (
                  <div className="flex flex-col gap-3.5">
                      {orders.map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150/40 rounded-2xl text-xs gap-4">
                              <div className="min-w-0">
                                  <span className="font-mono text-[9px] font-bold text-slate-400 block uppercase">Order ID: {order._id}</span>
                                  <strong className="text-slate-900 block text-sm mt-0.5">₹{order.totalPrice.toLocaleString("en-IN")}</strong>
                                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                                      Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                                  </span>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                  {order.isPaid ? (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 uppercase border border-emerald-100">Paid</span>
                                  ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-500 uppercase border border-red-100">Unpaid</span>
                                  )}
                                  <Link
                                      to={`/order/${order._id}`}
                                      className="bg-white border border-slate-200 hover:bg-slate-50 text-black font-bold px-3 py-1.5 rounded-xl shadow-sm text-[11px] hover:border-slate-350 transition-all shrink-0 cursor-pointer text-center animate-none"
                                  >
                                      Details
                                  </Link>
                              </div>
                          </div>
                      ))}
                      <Link to="/myorders" className="text-xs font-bold text-black hover:text-zinc-800 text-center block py-1.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all mt-1">
                          View All My Orders
                      </Link>
                  </div>
              )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProfilePage;
