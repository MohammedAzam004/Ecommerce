import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CancelOrderPage from "./pages/CancelOrderPage";
import ReturnProductPage from "./pages/ReturnProductPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import Loader from "./components/Loader";

// Lazy-loaded components
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const RefundPage = lazy(() => import("./pages/RefundPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const EditProductPage = lazy(() => import("./pages/EditProductPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminReturnsPage = lazy(() => import("./pages/AdminReturnsPage"));
const AdminBannerPage = lazy(() => import("./pages/AdminBannerPage"));
const AdminEditBannerPage = lazy(() => import("./pages/AdminEditBannerPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);

    // Update document title based on pathname
    let title = "ShopEsy | Premium Online Shopping";
    const path = pathname.toLowerCase();
    
    if (path === "/about") title = "About Us | ShopEsy";
    else if (path === "/contact") title = "Contact Us | ShopEsy";
    else if (path === "/support") title = "Help Center | ShopEsy";
    else if (path === "/faq") title = "FAQ | ShopEsy";
    else if (path === "/privacy") title = "Privacy Policy | ShopEsy";
    else if (path === "/terms") title = "Terms & Conditions | ShopEsy";
    else if (path === "/refund-policy") title = "Refund Policy | ShopEsy";
    else if (path === "/shipping-policy") title = "Shipping Policy | ShopEsy";
    else if (path === "/cancel-order") title = "Cancel Order | ShopEsy";
    else if (path === "/return-product") title = "Return Product | ShopEsy";
    else if (path === "/order-status") title = "Order Status | ShopEsy";
    else if (path === "/shop") title = "Shop | ShopEsy";
    else if (path.startsWith("/shop/")) {
      const tab = pathname.split("/")[2];
      const tabNames = {
        men: "Men's Fashion",
        women: "Women's Fashion",
        kids: "Kids' Fashion",
        "men-accessories": "Men Accessories",
        "women-accessories": "Women Accessories",
        "kids-accessories": "Kids Accessories"
      };
      title = `${tabNames[tab] || "Shop"} | ShopEsy`;
    }
    else if (path === "/login") title = "Sign In | ShopEsy";
    else if (path === "/register") title = "Register | ShopEsy";
    else if (path.startsWith("/product/")) title = "Product Details | ShopEsy";
    else if (path === "/cart") title = "Cart | ShopEsy";
    else if (path === "/checkout") title = "Checkout | ShopEsy";
    else if (path === "/myorders") title = "My Orders | ShopEsy";
    else if (path === "/profile") title = "Profile | ShopEsy";
    else if (path.startsWith("/order/")) title = "Order Details | ShopEsy";
    else if (path === "/admin/dashboard") title = "Admin Dashboard | ShopEsy";
    else if (path === "/admin/products") title = "Admin Products | ShopEsy";
    else if (path === "/admin/addproduct") title = "Add Product | ShopEsy";
    else if (path.startsWith("/admin/editproduct/")) title = "Edit Product | ShopEsy";
    else if (path === "/admin/orders") title = "Admin Orders | ShopEsy";
    else if (path === "/admin/returns") title = "Admin Returns | ShopEsy";
    else if (path === "/admin/users") title = "Admin Users | ShopEsy";
    else if (path === "/admin/banner") title = "Admin Banners | ShopEsy";
    else if (path === "/admin/banner/edit") title = "Edit Banner | ShopEsy";
    
    document.title = title;

    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<Loader text="Loading page details..." />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPage />} />
          <Route path="/shipping-policy" element={<ShippingPage />} />

          {/* Legacy route redirects */}
          <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />

          <Route path="/cancel-order" element={<CancelOrderPage />} />
          <Route path="/return-product" element={<ReturnProductPage />} />
          <Route path="/order-status" element={<OrderStatusPage />} />

          {/* Shop page routes */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:tab" element={<ShopPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="/cart" element={<CartPage />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/addproduct" element={<AddProductPage />} />
            <Route path="/admin/editproduct/:id" element={<EditProductPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/returns" element={<AdminReturnsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/banner" element={<AdminBannerPage />} />
            <Route path="/admin/banner/edit" element={<AdminEditBannerPage />} />
          </Route>

          {/* Legacy filter routes now resolve to ShopPage */}
          <Route path="/search/:keyword" element={<ShopPage />} />
          <Route path="/category/:category" element={<ShopPage />} />
          <Route path="/price/:min/:max" element={<ShopPage />} />
          <Route path="/page/:pageNumber" element={<ShopPage />} />

          {/* 404 Fallback wildcard route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;