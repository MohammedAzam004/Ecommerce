import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Trash2, 
  ArrowLeft,
  SlidersHorizontal,
  ShieldCheck,
  UserCheck
} from "lucide-react";

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = useCallback(async (token) => {
    setLoading(true);
    try {
      const data = await axios.get(`${API_BASE_URL}/api/users/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
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
        fetchUsers(userInfo.token);
      });
    }
  }, [navigate, fetchUsers]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const deleteHandler = async () => {
    if (!deleteId) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const data = await axios.delete(`${API_BASE_URL}/api/users/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success("✓ " + (data.data.message || "User Deleted Successfully"));
      fetchUsers(userInfo.token);
    } catch (error) {
      console.error("Delete user failed:", error);
      const errMsg = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Failed to delete user.";
      toast.error("✗ " + errMsg);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        onConfirm={deleteHandler}
        title="Delete User Account"
        message="Are you absolutely sure you want to permanently delete this user account from the system database? This action is high risk and cannot be undone."
        type="danger"
        confirmText="Permanently Delete"
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
            <Users className="h-7 w-7 text-slate-600" />
            Users Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Oversee registered client profiles, verify credential tags, and manage account statuses.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4.5 shadow-[0_4px_20px_-6px_rgba(0, 0, 0, 0.06)] flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-black focus:bg-white text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 self-end sm:self-center shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span>Showing {filteredUsers.length} of {users.length} Registered Accounts</span>
        </div>
      </div>

      {loading ? (
        /* Loading Skeletons Tabular Grid */
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-50 bg-slate-50/50 hidden md:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-3">User ID</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Email Address</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          <div className="flex flex-col animate-pulse">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="p-5 border-b border-slate-50 md:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3"><div className="h-4 bg-slate-100 rounded w-24" /></div>
                <div className="col-span-3"><div className="h-4 bg-slate-100 rounded w-32" /></div>
                <div className="col-span-4"><div className="h-4 bg-slate-100 rounded w-48" /></div>
                <div className="col-span-2 flex justify-center"><div className="w-16 h-8 bg-slate-100 rounded-lg" /></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        /* Empty states */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-lg mx-auto bg-white border border-dashed border-slate-200/80 rounded-3xl shadow-sm my-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-black/5 rounded-full blur-xl scale-150 animate-pulse" />
            <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
              <Users className="h-9 w-9 text-slate-400 stroke-[1.25]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black mb-2.5">
            No Users Found
          </h2>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
            {searchTerm 
              ? "We couldn't find any registered accounts matching your search queries. Try refining your spelling." 
              : "There are currently no registered users in the database."
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
            <table className="w-full border-collapse text-left text-sm text-slate-700 min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Account ID</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Name Details</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Email Address</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280] text-center">Credential Type</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user._id}
                    className="hover:bg-slate-50/30 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500 align-middle">
                      {user._id}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900 text-sm align-middle flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-xs text-slate-600 select-none">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 leading-snug">{user.name}</span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium align-middle">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-center align-middle text-xs">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <ShieldCheck className="h-3 w-3" />
                          System Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <UserCheck className="h-3 w-3" />
                          Customer
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center align-middle text-xs">
                      {user.isAdmin ? (
                        <span className="text-slate-400 font-bold text-[10px] uppercase bg-slate-50 border px-2.5 py-0.5 rounded-full tracking-wider">
                          Protected
                        </span>
                      ) : (
                        <button
                          onClick={() => confirmDelete(user._id)}
                          className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                          title="Delete User Account"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
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

export default AdminUsersPage;
