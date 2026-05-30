import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { 
  RotateCcw, 
  Search, 
  ArrowLeft,
  Calendar,
  Wallet,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

const AdminReturnsPage = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Modal States
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchReturns = useCallback(async (token) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/returns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReturns(data || []);
    } catch (error) {
      console.error("Error fetching return requests:", error);
      setReturns([]);
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
        fetchReturns(userInfo.token);
      });
    }
  }, [navigate, fetchReturns]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        `${API_BASE_URL}/api/returns/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      toast.success(`✓ Return Request ${status}`);
      setApproveModalOpen(false);
      setRejectModalOpen(false);
      fetchReturns(userInfo.token);
    } catch (error) {
      console.error("Return status update failed:", error);
      toast.error("✗ Update Failed");
    }
  };

  const openApproveModal = (req) => {
    setSelectedRequest(req);
    setApproveModalOpen(true);
  };

  const openRejectModal = (req) => {
    setSelectedRequest(req);
    setRejectModalOpen(true);
  };

  const filteredReturns = returns.filter(r => 
    r._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.order?._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.user && r.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={() => handleUpdateStatus(selectedRequest?._id, "Approved")}
        title="Approve Return Request"
        message="Are you sure you want to approve this return request? A pickup instruction label will be generated for the customer."
        type="info"
        confirmText="Approve Return"
      />

      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={() => handleUpdateStatus(selectedRequest?._id, "Rejected")}
        title="Reject Return Request"
        message="Are you sure you want to reject this return request? The request will be marked as rejected."
        type="danger"
        confirmText="Reject Return"
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
          <h1 className="text-3xl font-extrabold tracking-tight text-black flex items-center gap-3">
            <RotateCcw className="h-7 w-7 text-slate-800" />
            Return Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Review customer returns, inspect uploaded proof assets, and approve or reject submissions.
          </p>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading return requests..." />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Controls: Search */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-slate-150 p-4 rounded-3xl shadow-sm">
            <div className="relative flex items-center w-full sm:max-w-xs group">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                id="returns-search"
                type="text"
                placeholder="Search by Request ID, Order ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-slate-50/50 border border-slate-200 focus:border-black focus:bg-white outline-none rounded-2xl transition-all"
              />
            </div>
            <div className="text-xs text-slate-400 font-semibold self-end sm:self-center">
              Total requests: <strong>{filteredReturns.length}</strong>
            </div>
          </div>

          {/* List display */}
          {filteredReturns.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
              <RotateCcw className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-semibold">No return requests found matching search criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                    <th className="p-4 pl-6">Customer & Date</th>
                    <th className="p-4">Order details</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4">Proof Attachment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredReturns.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Customer / Request Date */}
                      <td className="p-4 pl-6">
                        <div className="flex flex-col gap-0.5">
                          <strong className="text-slate-900 block">{req.user?.name || "Deleted User"}</strong>
                          <span className="text-slate-400 text-[10px] block">{req.user?.email || "N/A"}</span>
                          <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Order Ref & Value */}
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[10px] text-slate-400 block uppercase">Order ID: {req.order?._id || "Deleted"}</span>
                          <strong className="text-slate-900 flex items-center gap-1 mt-0.5">
                            <Wallet className="h-3 w-3 text-slate-400" />
                            ₹{req.order?.totalPrice?.toLocaleString("en-IN") || "0"}
                          </strong>
                        </div>
                      </td>

                      {/* Return Reason */}
                      <td className="p-4 max-w-xs">
                        <span className="text-slate-800 font-semibold leading-relaxed block break-words">
                          {req.reason}
                        </span>
                      </td>

                      {/* Proof Image */}
                      <td className="p-4">
                        {req.image ? (
                          <div className="relative group w-12 h-12 rounded-lg bg-slate-50 border flex items-center justify-center p-1 shrink-0 overflow-hidden cursor-pointer" onClick={() => setSelectedImage(req.image)}>
                            <img src={req.image} alt="Proof" className="max-h-full max-w-full object-contain" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="h-3 w-3" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No image provided</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border tracking-wider ${
                          req.status === "Approved" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : req.status === "Rejected"
                            ? "bg-red-50 text-red-500 border-red-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                          {req.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 pr-6 text-right">
                        {req.status === "Pending" ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openApproveModal(req)}
                              className="bg-slate-950 border border-slate-200 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-zinc-800 transition-all text-[11px] shrink-0"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(req)}
                              className="bg-white border border-slate-200 hover:bg-slate-50 text-red-500 hover:text-red-600 font-bold px-3 py-1.5 rounded-xl transition-all text-[11px] shrink-0"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Proof Image Lightbox Overlay Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-3xl max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
            <img src={selectedImage} alt="Large Proof" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <button className="absolute top-4 right-4 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/90 transition-all" onClick={() => setSelectedImage(null)}>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminReturnsPage;
