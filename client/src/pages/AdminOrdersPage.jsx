import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  ArrowLeft,
  SlidersHorizontal,
  Calendar,
  Wallet,
  Trash2,
  XCircle
} from "lucide-react";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [deliverId, setDeliverId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = useCallback(async (token) => {
    setLoading(true);
    try {
      const data = await axios.get(`${API_BASE_URL}/api/orders/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      setOrders([]);
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
        fetchOrders(userInfo.token);
      });
    }
  }, [navigate, fetchOrders]);

  const confirmDelivery = (id) => {
    setDeliverId(id);
    setModalOpen(true);
  };

  const deliverHandler = async () => {
    if (!deliverId) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        `${API_BASE_URL}/api/orders/${deliverId}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success("✓ Order Marked Delivered");
      setModalOpen(false);
      fetchOrders(userInfo.token);
    } catch (error) {
      console.error("Delivery update failed:", error);
      toast.error("✗ Update Failed");
    }
  };

  const confirmCancel = (id) => {
    setSelectedOrderId(id);
    setCancelModalOpen(true);
  };

  const cancelHandler = async () => {
    if (!selectedOrderId) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        `${API_BASE_URL}/api/orders/${selectedOrderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success("✓ Order Cancelled Successfully");
      setCancelModalOpen(false);
      fetchOrders(userInfo.token);
    } catch (error) {
      console.error("Order cancel failed:", error);
      toast.error("✗ Cancel Failed");
    }
  };

  const confirmDelete = (id) => {
    setSelectedOrderId(id);
    setDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    if (!selectedOrderId) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.delete(
        `${API_BASE_URL}/api/orders/${selectedOrderId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      toast.success("✓ Order Deleted Successfully");
      setDeleteModalOpen(false);
      fetchOrders(userInfo.token);
    } catch (error) {
      console.error("Order delete failed:", error);
      toast.error("✗ Delete Failed");
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 bg-[#FAFAFA] min-h-[85vh] text-left"
    >
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={deliverHandler}
        title="Confirm Shipment Delivery"
        message="Are you absolutely sure you want to mark this customer order as fully Dispatched and Delivered to their destination doorstep?"
        type="info"
        confirmText="Confirm Delivery"
      />

      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={cancelHandler}
        title="Confirm Order Cancellation"
        message="Are you sure you want to cancel this order? This will restore the product stock levels."
        type="warning"
        confirmText="Cancel Order"
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={deleteHandler}
        title="Delete Order Record"
        message="Are you absolutely sure you want to delete this order? This action is permanent and cannot be undone."
        type="danger"
        confirmText="Delete Order"
      />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6 gap-4">
        <div className="text-left">
          <Link 
            to="/admin/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black mb-3 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-black flex items-center gap-2.5">
            <ShoppingBag className="h-7 w-7 text-slate-600" />
            Customer Invoices
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervise purchase status parameters, update logistics timelines, and manage customer shipments.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4.5 shadow-[0_4px_20px_-6px_rgba(0, 0, 0, 0.06)] flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-black focus:bg-white text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 self-end sm:self-center shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span>Showing {filteredOrders.length} of {orders.length} Invoices</span>
        </div>
      </div>

      {loading ? (
        /* Loading Skeletons Tabular Grid */
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-50 bg-slate-50/50 hidden md:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Total Price</div>
            <div className="col-span-2">Fulfillment</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          <div className="flex flex-col animate-pulse">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="p-5 border-b border-slate-50 md:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3"><div className="h-4 bg-slate-100 rounded w-24" /></div>
                <div className="col-span-3"><div className="h-4 bg-slate-100 rounded w-32" /></div>
                <div className="col-span-2"><div className="h-4 bg-slate-100 rounded w-16" /></div>
                <div className="col-span-2"><div className="h-3 bg-slate-50 rounded w-20" /></div>
                <div className="col-span-2 flex justify-center"><div className="w-20 h-8 bg-slate-100 rounded-lg" /></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty states */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-lg mx-auto bg-white border border-dashed border-slate-200/80 rounded-3xl shadow-sm my-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-black/5 rounded-full blur-xl scale-150 animate-pulse" />
            <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
              <ShoppingBag className="h-9 w-9 text-slate-400 stroke-[1.25]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black mb-2.5">
            No Orders Found
          </h2>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
            {searchTerm 
              ? "We couldn't find any order invoices matching your search parameters. Try refining your keywords." 
              : "There are currently no customer order records in the system database."
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        /* Responsive Table Showcase */
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_4px_25px_-6px_rgba(0, 0, 0, 0.06)]">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left text-sm text-slate-700 min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Customer Name</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Total Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280] text-center">Billing</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280] text-center">Logistics</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order._id}
                    className="hover:bg-slate-50/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500 align-middle">
                      <Link to={`/order/${order._id}`} className="hover:text-black transition-colors">{order._id}</Link>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900 text-sm align-middle">
                      {order.user ? (
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 leading-snug">{order.user.name}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{order.user.email}</span>
                        </div>
                      ) : (
                        <span className="text-[#EF4444] font-bold text-xs italic bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Deleted Account</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-extrabold text-slate-900 align-middle">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-center align-middle text-xs">
                      {order.isPaid ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Unpaid
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center align-middle text-xs">
                      {order.isCancelled ? (
                        <div className="flex flex-col items-center">
                          <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Cancelled
                          </span>
                          {order.cancelledAt && (
                            <span className="text-[9px] text-slate-400 mt-1 font-semibold flex items-center gap-0.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.cancelledAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : order.isDelivered ? (
                        <div className="flex flex-col items-center">
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Delivered
                          </span>
                          <span className="text-[9px] text-slate-400 mt-1 font-semibold flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center align-middle text-xs">
                      <div className="flex items-center justify-center gap-2">
                        {!order.isDelivered && !order.isCancelled && (
                          <button
                            onClick={() => confirmDelivery(order._id)}
                            className="inline-flex items-center justify-center gap-1.5 bg-black hover:bg-zinc-900 text-white text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
                          >
                            <Truck className="h-3.5 w-3.5 text-white" />
                            <span>Ship</span>
                          </button>
                        )}
                        {!order.isDelivered && !order.isCancelled && (
                          <button
                            onClick={() => confirmCancel(order._id)}
                            className="inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
                          >
                            <XCircle className="h-3.5 w-3.5 text-white" />
                            <span>Cancel</span>
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(order._id)}
                          className="inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrdersPage;