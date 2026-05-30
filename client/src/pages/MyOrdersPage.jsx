import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { 
  Package, 
  Calendar, 
  ChevronRight, 
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  TrendingUp
} from "lucide-react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async (token) => {
    setLoading(true);
    try {
      const data = await getMyOrders(token);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
    } else {
      Promise.resolve().then(() => {
        fetchOrders(userInfo.token);
      });
    }
  }, [navigate, fetchOrders]);

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 bg-[#FAFAFA] min-h-[80vh] text-left"
    >
      {/* Header and Back Button */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black mb-3 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Shop
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-black">
          My Orders
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review the status of your bespoke purchases, trace fulfillment timelines, and manage invoices.
        </p>
      </div>

      {loading ? (
        <Loader text="Retrieving your orders list..." />
      ) : orders.length === 0 ? (
        /* Elevated Premium Empty State Layout */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-lg mx-auto bg-white border border-dashed border-slate-200/80 rounded-3xl shadow-sm my-8"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-black/5 rounded-full blur-xl scale-150 animate-pulse" />
            <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
              <ShoppingBag className="h-9 w-9 text-slate-400 stroke-[1.25]" />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-1 -right-1 bg-black text-white p-1 rounded-full shadow-md"
              >
                <Sparkles className="h-3 w-3" />
              </motion.div>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-black mb-2.5">
            No Orders Yet
          </h2>
          
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
            You haven't placed any orders yet. Start exploring our exclusive, hand-crafted collections to place your first order.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/15 transition-all duration-200 active:scale-[0.98]"
          >
            <span>Browse Products</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        /* Premium Responsive Order Cards Container */
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ y: -2 }}
              className="group bg-white rounded-3xl border border-slate-100/90 p-5 shadow-[0_4px_20px_-4px_rgba(0, 0, 0, 0.08)] hover:shadow-[0_12px_30px_-6px_rgba(0, 0, 0, 0.12)] hover:border-slate-200/60 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 text-left relative overflow-hidden"
            >
              {/* Highlight stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-black transition-colors duration-300" />
              
              <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-zinc-100 group-hover:text-black transition-all shrink-0">
                  <Package className="h-6 w-6 stroke-[1.5]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Order ID</span>
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-150">{order._id}</span>
                  </div>
                  
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug tracking-tight mt-2 flex items-center gap-2">
                    <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-400 font-semibold">({order.orderItems ? order.orderItems.length : 0} {order.orderItems?.length === 1 ? 'item' : 'items'})</span>
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Status capsules and Manage action */}
              <div className="flex flex-row items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {/* Paid Badge */}
                  {order.isPaid ? (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      Unpaid
                    </span>
                  )}

                  {/* Delivery Status Badge */}
                  {order.isDelivered ? (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Delivered
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Pending
                    </span>
                  )}
                </div>

                <Link
                  to={`/order/${order._id}`}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-black hover:text-white border border-slate-200/60 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm shrink-0 cursor-pointer active:scale-95 group/btn"
                >
                  <span>Manage</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                </Link>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyOrdersPage;