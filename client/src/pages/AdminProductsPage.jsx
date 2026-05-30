import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { 
  Package, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowLeft,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const MAIN_CATEGORIES = [
  "All",
  "Men",
  "Women",
  "Kids",
  "Men Accessories",
  "Women Accessories",
  "Kids Accessories"
];

const SUBCATEGORIES = {
  All: [],
  Men: ["All", "T-Shirts", "Shirts", "Hoodies", "Jeans", "Footwear"],
  Women: ["All", "Tops", "Dresses", "Jeans", "Ethnic Wear", "Footwear"],
  Kids: ["All", "Boys Wear", "Girls Wear", "Footwear"],
  "Men Accessories": ["All", "Watches", "Wallets", "Belts", "Sunglasses", "Bags"],
  "Women Accessories": ["All", "Handbags", "Watches", "Jewelry", "Sunglasses", "Hair Accessories"],
  "Kids Accessories": ["All", "Backpack", "Water Bottle", "Smart Watch", "Cap", "Sunglasses"]
};

const getProductCategoryInfo = (product) => {
  const dbCat = product.category || "";
  const name = (product.name || "").toLowerCase();

  // Men Main Category
  if (dbCat === "Men T-Shirts") return { main: "Men", sub: "T-Shirts" };
  if (dbCat === "Men Shirts") return { main: "Men", sub: "Shirts" };
  if (dbCat === "Men Hoodies") return { main: "Men", sub: "Hoodies" };
  if (dbCat === "Men Jeans") return { main: "Men", sub: "Jeans" };
  if (dbCat === "Men Footwear") return { main: "Men", sub: "Footwear" };

  // Women Main Category
  if (dbCat === "Women Tops") return { main: "Women", sub: "Tops" };
  if (dbCat === "Women Dresses") return { main: "Women", sub: "Dresses" };
  if (dbCat === "Women Jeans") return { main: "Women", sub: "Jeans" };
  if (dbCat === "Women Ethnic Wear") return { main: "Women", sub: "Ethnic Wear" };
  if (dbCat === "Women Footwear") return { main: "Women", sub: "Footwear" };

  // Kids Main Category
  if (dbCat === "Kids Boys Wear") return { main: "Kids", sub: "Boys Wear" };
  if (dbCat === "Kids Girls Wear") return { main: "Kids", sub: "Girls Wear" };
  if (dbCat === "Kids Footwear") return { main: "Kids", sub: "Footwear" };

  // Men Accessories Main Category
  if (dbCat === "Men Accessories") {
    if (name.includes("watch")) return { main: "Men Accessories", sub: "Watches" };
    if (name.includes("wallet")) return { main: "Men Accessories", sub: "Wallets" };
    if (name.includes("belt")) return { main: "Men Accessories", sub: "Belts" };
    if (name.includes("sunglass")) return { main: "Men Accessories", sub: "Sunglasses" };
    if (name.includes("bag") || name.includes("backpack") || name.includes("duffel")) return { main: "Men Accessories", sub: "Bags" };
    return { main: "Men Accessories", sub: "Bags" };
  }

  // Women Accessories Main Category
  if (dbCat === "Women Accessories") {
    if (name.includes("bag") || name.includes("tote") || name.includes("crossbody")) return { main: "Women Accessories", sub: "Handbags" };
    if (name.includes("watch")) return { main: "Women Accessories", sub: "Watches" };
    if (name.includes("necklace") || name.includes("bracelet") || name.includes("jewelry")) return { main: "Women Accessories", sub: "Jewelry" };
    if (name.includes("sunglass") || name.includes("shades")) return { main: "Women Accessories", sub: "Sunglasses" };
    if (name.includes("hair") || name.includes("scrunchie") || name.includes("clip")) return { main: "Women Accessories", sub: "Hair Accessories" };
    return { main: "Women Accessories", sub: "Handbags" };
  }

  // Kids Accessories Main Category
  if (dbCat === "Kids Accessories") {
    if (name.includes("backpack") || name.includes("bag")) return { main: "Kids Accessories", sub: "Backpack" };
    if (name.includes("bottle") || name.includes("water")) return { main: "Kids Accessories", sub: "Water Bottle" };
    if (name.includes("watch")) return { main: "Kids Accessories", sub: "Smart Watch" };
    if (name.includes("cap")) return { main: "Kids Accessories", sub: "Cap" };
    if (name.includes("sunglass")) return { main: "Kids Accessories", sub: "Sunglasses" };
    return { main: "Kids Accessories", sub: "Backpack" };
  }

  // Fallback
  return { main: "Other", sub: dbCat || "Other" };
};

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem("adminSearchTerm") || "");
  
  // Tab and pagination states
  const [activeMainCat, setActiveMainCat] = useState(() => sessionStorage.getItem("adminActiveMainCat") || "All");
  const [activeSubCat, setActiveSubCat] = useState(() => sessionStorage.getItem("adminActiveSubCat") || "All");
  const [currentPage, setCurrentPage] = useState(() => Number(sessionStorage.getItem("adminCurrentPage")) || 1);
  const itemsPerPage = 10;

  useEffect(() => {
    sessionStorage.setItem("adminSearchTerm", searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem("adminActiveMainCat", activeMainCat);
  }, [activeMainCat]);

  useEffect(() => {
    sessionStorage.setItem("adminActiveSubCat", activeSubCat);
  }, [activeSubCat]);

  useEffect(() => {
    sessionStorage.setItem("adminCurrentPage", currentPage.toString());
  }, [currentPage]);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await axios.get(`${API_BASE_URL}/api/products?all=true`);
      const resData = data.data;
      if (resData && Array.isArray(resData.products)) {
        setProducts(resData.products);
      } else if (Array.isArray(resData)) {
        setProducts(resData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
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
        fetchProducts();
      });
    }
  }, [navigate, fetchProducts]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const deleteHandler = async () => {
    if (!deleteId) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.delete(`${API_BASE_URL}/api/products/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      toast.success("✓ Product Deleted Successfully");
      fetchProducts();
    } catch (error) {
      console.error("Delete product failed:", error);
      toast.error("✗ Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const { main, sub } = getProductCategoryInfo(product);
    
    // Main Category Filter
    if (activeMainCat !== "All" && main !== activeMainCat) {
      return false;
    }
    
    // Subcategory Filter
    if (activeSubCat !== "All" && sub !== activeSubCat) {
      return false;
    }
    
    // Search Term Filter
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(search) ||
      (product.category && product.category.toLowerCase().includes(search)) ||
      sub.toLowerCase().includes(search);
      
    return matchesSearch;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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
        title="Delete Product"
        message="Are you absolutely sure you want to permanently remove this product from the inventory catalog? This action cannot be undone."
        type="danger"
        confirmText="Delete Product"
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
            <Package className="h-7 w-7 text-slate-600" />
            Catalog Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview, search, edit product listings, adjust stock limits, or create new catalog products.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/addproduct")}
          className="inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm rounded-2xl py-3.5 px-6 shadow-md transition-all duration-200 active:scale-[0.98] select-none cursor-pointer shrink-0 animate-pulse-slow"
        >
          <Plus className="h-4 w-4 text-white" />
          <span>Add Catalog Product</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4.5 shadow-[0_4px_20px_-6px_rgba(0, 0, 0, 0.06)] flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-200 focus:border-black focus:bg-white text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 self-end sm:self-center shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span>Showing {totalItems > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Products</span>
        </div>
      </div>

      {/* Main Categories Navigation Bar */}
      <div className="flex flex-col gap-4 bg-white rounded-3xl border border-slate-100 p-5 shadow-[0_4px_20px_-6px_rgba(0, 0, 0, 0.06)]">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 text-left">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {MAIN_CATEGORIES.map((cat) => {
              const isActive = activeMainCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveMainCat(cat);
                    setActiveSubCat("All");
                    setCurrentPage(1);
                  }}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
                    isActive
                      ? "bg-black border-black text-white shadow-md shadow-slate-900/10"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subcategories (Dynamic Tabs) */}
        {activeMainCat !== "All" && SUBCATEGORIES[activeMainCat] && SUBCATEGORIES[activeMainCat].length > 0 && (
          <div className="border-t border-slate-50 pt-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 text-left">Subcategories of {activeMainCat}</h3>
            <div className="flex flex-wrap gap-2">
              {SUBCATEGORIES[activeMainCat].map((sub) => {
                const isActive = activeSubCat === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => {
                      setActiveSubCat(sub);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none border ${
                      isActive
                        ? "bg-black border-black text-white"
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        /* Loading Skeletons Tabular Grid */
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-50 bg-slate-50/50 hidden md:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-5">Product Details</div>
            <div className="col-span-3">Unit Price</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          <div className="flex flex-col animate-pulse">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="p-5 border-b border-slate-50 md:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-50 rounded w-1/3" />
                  </div>
                </div>
                <div className="col-span-3 mt-3 md:mt-0"><div className="h-4 bg-slate-100 rounded w-24" /></div>
                <div className="col-span-2 mt-2 md:mt-0"><div className="h-3 bg-slate-50 rounded w-16" /></div>
                <div className="col-span-2 mt-4 md:mt-0 flex justify-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                  <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : totalItems === 0 ? (
        /* Empty states */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-lg mx-auto bg-white border border-dashed border-slate-200/80 rounded-3xl shadow-sm my-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-black/5 rounded-full blur-xl scale-150 animate-pulse" />
            <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
              <Package className="h-9 w-9 text-slate-400 stroke-[1.25]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black mb-2.5">
            No Products Found
          </h2>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-8">
            {searchTerm 
              ? "We couldn't find any products matching your search criteria. Try refining your keywords or query." 
              : "There are currently no products registered under this category."
            }
          </p>
          {searchTerm ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Clear Search Query
            </button>
          ) : (
            <Link
              to="/admin/addproduct"
              className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              Add Catalog Product
            </Link>
          )}
        </div>
      ) : (
        /* Responsive Table Showcase */
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_4px_25px_-6px_rgba(0, 0, 0, 0.06)]">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left text-sm text-slate-700 min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Product details</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Stock status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B7280] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedProducts.map((product) => {
                  const hasStock = product.countInStock && product.countInStock > 0;
                  const isLowStock = product.countInStock && product.countInStock <= 5;
                  
                  return (
                    <tr 
                      key={product._id}
                      className="hover:bg-slate-50/30 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 text-sm align-middle flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-slate-900 truncate hover:text-black transition-colors leading-snug">{product.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase">ID: {product._id.slice(-6)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-extrabold text-slate-900 align-middle">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 font-bold align-middle">
                        <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full">
                          {product.category || "Curated"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs align-middle">
                        {product.countInStock ? (
                          isLowStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                              Only {product.countInStock} Left
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                              In Stock ({product.countInStock})
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EF4444] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/editproduct/${product._id}`)}
                            className="p-2 text-slate-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all cursor-pointer border border-transparent hover:border-zinc-200"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => confirmDelete(product._id)}
                            className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                  const isActive = currentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8.5 h-8.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
                        isActive
                          ? "bg-black border-black text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminProductsPage;