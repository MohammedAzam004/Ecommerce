import { API_BASE_URL } from "../utils/config";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  Calendar, 
  User, 
  Mail, 
  Wallet,
  Check,
  Download
} from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDownloadInvoice = () => {
    if (!order) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("✗ Pop-up blocked! Please allow pop-ups to print invoice.");
      return;
    }
    
    const subtotalPrice = order.totalPrice;
    const estimatedTax = Math.floor(subtotalPrice * 0.18);
    const shippingFee = subtotalPrice > 999 ? 0 : 99;

    const invoiceHTML = `
      <html>
      <head>
        <title>Invoice - ShopEsy Order ${order._id}</title>
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #111827;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.05em;
            color: #000;
          }
          .title {
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #475569;
          }
          .details-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          .section-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #94a3b8;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 6px;
            margin-bottom: 10px;
          }
          .detail-text {
            font-size: 13px;
            line-height: 1.6;
            color: #334155;
          }
          .bold {
            font-weight: 700;
            color: #0f172a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          th {
            background-color: #f8fafc;
            border-bottom: 1px solid #cbd5e1;
            padding: 12px 16px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #475569;
            text-align: left;
          }
          td {
            padding: 16px;
            font-size: 13px;
            border-bottom: 1px solid #f1f5f9;
          }
          .text-right {
            text-align: right;
          }
          .summary-table {
            width: 320px;
            margin-left: auto;
            margin-bottom: 0;
          }
          .summary-table td {
            padding: 8px 16px;
            border: none;
          }
          .total-row {
            border-top: 1px solid #e2e8f0;
            font-size: 16px;
            font-weight: 800;
          }
          .footer {
            text-align: center;
            margin-top: 60px;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
          }
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SHOPESY</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Premium Curated Fashion Boutique</div>
          </div>
          <div class="text-right">
            <div class="title">Tax Invoice</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Invoice #: ${order._id}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
        
        <div class="details-grid">
          <div>
            <div class="section-title">Shipping Address</div>
            <div class="detail-text">
              <span class="bold">${order.user ? order.user.name : "Guest Customer"}</span><br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}<br>
              Email: ${order.user ? order.user.email : ""}
            </div>
          </div>
          <div>
            <div class="section-title">Billing & Payment Details</div>
            <div class="detail-text">
              Payment Method: <span class="bold">${order.paymentMethod || "Secure Gateway"}</span><br>
              Status: <span class="bold" style="color: ${order.isPaid ? '#10b981' : '#ef4444'}">${order.isPaid ? 'PAID' : 'UNPAID'}</span><br>
              Fulfillment: <span class="bold">${order.isDelivered ? 'DELIVERED' : 'PENDING'}</span>
            </div>
          </div>
        </div>
        
        <div class="section-title">Order Items</div>
        <table>
          <thead>
            <tr>
              <th>Item Details</th>
              <th class="text-right" style="width: 120px;">Price</th>
              <th class="text-right" style="width: 80px;">Qty</th>
              <th class="text-right" style="width: 140px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems.map(item => `
              <tr>
                <td><span class="bold">${item.name}</span></td>
                <td class="text-right">₹${item.price.toLocaleString("en-IN")}</td>
                <td class="text-right">${item.qty}</td>
                <td class="text-right">₹${(item.qty * item.price).toLocaleString("en-IN")}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <table class="summary-table">
          <tbody>
            <tr>
              <td class="text-right" style="color: #64748b;">Subtotal</td>
              <td class="text-right bold">₹${subtotalPrice.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td class="text-right" style="color: #64748b;">Estimated GST (18%)</td>
              <td class="text-right bold">₹${estimatedTax.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td class="text-right" style="color: #64748b;">Shipping Fee</td>
              <td class="text-right bold">${shippingFee === 0 ? "FREE" : "₹" + shippingFee}</td>
            </tr>
            <tr class="total-row">
              <td class="text-right">Total Amount</td>
              <td class="text-right">₹${subtotalPrice.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          Thank you for shopping at ShopEsy! For support, please contact support@shopesy.com
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const fetchOrder = useCallback(async (token) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("✗ Failed to retrieve order details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
    } else {
      Promise.resolve().then(() => {
        fetchOrder(userInfo.token);
      });
    }
  }, [navigate, fetchOrder]);

  if (loading) {
    return <Loader text="Retrieving order details..." />;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl shadow-sm my-8">
        <h2 className="text-2xl font-bold text-black">Order Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">
          We couldn't retrieve the requested order invoices. It may have been archived, removed, or is inaccessible.
        </p>
        <Link 
          to="/myorders" 
          className="mt-6 bg-black hover:bg-zinc-900 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  // Visual Timeline Stepper Helper Values
  const orderPlacedDate = new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' });
  const isPaid = order.isPaid;
  const isDelivered = order.isDelivered;

  // Pricing calculations
  const subtotalPrice = order.totalPrice;
  const shippingFee = subtotalPrice > 999 ? 0 : 99; // Same fallback logic
  const estimatedTax = Math.floor(subtotalPrice * 0.18); // GST representation
  
  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8 bg-[#FAFAFA] min-h-[85vh] text-left"
    >
      {/* Header Back Link & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6 gap-4">
        <div className="text-left">
          <Link 
            to="/myorders" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-black mb-3 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Orders List
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-black">
            Order Invoice details
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span>Reference ID:</span> 
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border">{order._id}</span>
          </p>
        </div>
        <button
          onClick={handleDownloadInvoice}
          className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer self-start md:self-end"
        >
          <Download className="h-4 w-4 text-white" />
          <span>Download Invoice</span>
        </button>
      </div>

      {/* Premium Horizontal Status Timeline Tracker */}
      <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Delivery Timeline Status
        </h3>
        
        <div className="flex items-center justify-between relative max-w-4xl mx-auto w-full px-4 sm:px-8 py-4">
          {/* Node 1: Order Placed */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-black mt-2 text-center">Order Placed</span>
            <span className="text-[10px] text-slate-400 mt-0.5 text-center">{orderPlacedDate}</span>
          </div>

          {/* Node 2: Payment Confirmed */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isPaid ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-600 border border-amber-200"
            }`}>
              {isPaid ? <Check className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
            </div>
            <span className={`text-[11px] font-bold mt-2 text-center ${isPaid ? "text-black" : "text-slate-400"}`}>Payment Confirmed</span>
            <span className="text-[10px] text-slate-400 mt-0.5 text-center">
              {isPaid ? (order.paidAt ? new Date(order.paidAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : "Cleared") : "Pending"}
            </span>
          </div>

          {/* Node 3: Processing */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isPaid ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}>
              {isPaid ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </div>
            <span className={`text-[11px] font-bold mt-2 text-center ${isPaid ? "text-black" : "text-slate-400"}`}>Processing</span>
            <span className="text-[10px] text-slate-400 mt-0.5 text-center">{isPaid ? "In Progress" : "Awaiting Pay"}</span>
          </div>

          {/* Node 4: Shipped */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isDelivered ? "bg-emerald-500 text-white" : isPaid ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}>
              {isDelivered ? <Check className="h-4 w-4" /> : isPaid ? <Check className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
            </div>
            <span className={`text-[11px] font-bold mt-2 text-center ${isPaid ? "text-black" : "text-slate-400"}`}>Shipped</span>
            <span className="text-[10px] text-slate-400 mt-0.5 text-center">{isDelivered ? "Finished" : isPaid ? "In Transit" : "Awaiting Pay"}</span>
          </div>

          {/* Node 5: Delivered */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isDelivered ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}>
              {isDelivered ? <Check className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </div>
            <span className={`text-[11px] font-bold mt-2 text-center ${isDelivered ? "text-black" : "text-slate-400"}`}>Delivered</span>
            <span className="text-[10px] text-slate-400 mt-0.5 text-center">
              {isDelivered ? (order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : "Finished") : "Pending"}
            </span>
          </div>

          {/* Stepper background connections */}
          <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-slate-100 z-0">
            <motion.div 
              initial={{ width: 0 }}
              animate={{
                width: isDelivered ? "100%" : isPaid ? "75%" : "0%"
              }}
              className="h-full bg-emerald-500 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* 2-Column Split Invoices Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Sheets & Ordered Items */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          
          {/* Shipping Address Recap Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <MapPin className="h-4 w-4 text-black" />
              Shipping Destination Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-medium">Customer Full Name</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {order.user ? order.user.name : "Guest Buyer"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-medium">Email Address</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {order.user ? order.user.email : "Guest Email"}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2 mt-1">
                <span className="text-slate-400 font-medium">Complete Shipping Address</span>
                <span className="font-bold text-black leading-relaxed text-sm">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment Status Recap Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Fulfillment Verification
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {/* Payment state */}
              <div className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center justify-between text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-400 font-medium">Billing status</span>
                  <span className="font-extrabold text-slate-900">
                    {isPaid ? "Payment Verified" : "Billing Pending"}
                  </span>
                </div>
                {isPaid ? (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Unpaid
                  </span>
                )}
              </div>

              {/* Delivery state */}
              <div className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100/60 flex items-center justify-between text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-400 font-medium">Logistics status</span>
                  <span className="font-extrabold text-slate-900">
                    {isDelivered ? "Delivered to Doorstep" : "In Transit / Processing"}
                  </span>
                </div>
                {isDelivered ? (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Delivered
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Items List Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <ShoppingBag className="h-4 w-4 text-black" />
              Ordered Pieces Showcase
            </h3>

            <div className="flex flex-col gap-4">
              {order.orderItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-4 py-2 ${
                    idx < order.orderItems.length - 1 ? "border-b border-slate-50 pb-4" : ""
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate hover:text-black transition-colors leading-snug">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Quantity: <strong className="text-slate-700">{item.qty}</strong> × ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 shrink-0 pr-1">
                    ₹{(item.qty * item.price).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Invoice Summary Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6 w-full">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_30px_-6px_rgba(0, 0, 0, 0.10)] flex flex-col gap-6 text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            <h3 className="text-base font-bold text-black border-b border-slate-50 pb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-black" />
              <span>Invoice Receipt</span>
            </h3>

            {/* Price Calculations items */}
            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Subtotal Value</span>
                <span className="text-slate-900">₹{subtotalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  Estimated GST
                  <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-200/50 px-1 py-0.1 rounded">18%</span>
                </span>
                <span className="text-slate-900">₹{estimatedTax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Standard Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Free</span>
                  ) : (
                    <span className="text-black font-bold">₹{shippingFee}</span>
                  )}
                </span>
              </div>
              
              <div className="border-t border-slate-100 mt-2.5 pt-4 flex justify-between items-end">
                <div>
                  <span className="text-[9px] font-extrabold text-black block uppercase tracking-wider mb-0.5">Total Value Paid</span>
                  <span className="text-xs text-slate-400 font-medium">Billed sum details</span>
                </div>
                <span className="text-xl font-black text-black tracking-tight">
                  ₹{subtotalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Placed logistics data stamp block */}
            <div className="border-t border-slate-50 pt-4 flex flex-col gap-2.5 text-xs text-slate-500 leading-normal">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Placed On:
                </span>
                <span className="font-bold text-slate-800">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5" />
                  Method:
                </span>
                <span className="font-bold text-slate-800">
                  {order.paymentMethod || "Secure Gateway"}
                </span>
              </div>
            </div>

            {/* Reassurance Seal */}
            <div className="border-t border-slate-50 pt-4 flex items-center justify-center gap-2 text-slate-400">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                100% Verified Compliant Order
              </span>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default OrderDetailsPage;
