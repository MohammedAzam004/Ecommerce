import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  Headphones, 
  Award,
  Sparkles,
  Heart,
  TrendingUp,
  Eye,
  ArrowRight
} from "lucide-react";

const AboutPage = () => {
  // Animation presets
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      desc: "Each item is crafted from high-end fabrics, designed to withstand time and trends.",
      color: "text-blue-600",
      bg: "bg-blue-50/50"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Get your signature selections delivered to your doorstep with complimentary priority shipping.",
      color: "text-rose-500",
      bg: "bg-rose-50/50"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      desc: "Shop with peace of mind using our fully encrypted payment gateway integrations.",
      color: "text-emerald-500",
      bg: "bg-emerald-50/50"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "Not fully satisfied? Benefit from our hassle-free, complimentary 7-day return policy.",
      color: "text-amber-500",
      bg: "bg-amber-50/50"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Our dedicated shopper concierge team is always available to assist with your catalog styling.",
      color: "text-purple-500",
      bg: "bg-purple-50/50"
    },
    {
      icon: ShieldCheck,
      title: "Verified Products",
      desc: "Authenticity certified. Every piece is sourced directly from certified manufacturers.",
      color: "text-teal-500",
      bg: "bg-teal-50/50"
    }
  ];

  const stats = [
    { value: "90+", label: "Premium Products" },
    { value: "1,000+", label: "Happy Customers" },
    { value: "500+", label: "Orders Delivered" },
    { value: "99%", label: "Satisfaction Rate" }
  ];

  const values = [
    { title: "Customer First", desc: "Your wardrobe experience shapes our priority." },
    { title: "Innovation", desc: "Pioneering digital-first fashion curation." },
    { title: "Trust", desc: "Guaranteed authentic materials and ethical sourcing." },
    { title: "Quality", desc: "No compromises on tailoring and premium fabrics." },
    { title: "Transparency", desc: "Honest pricing and direct-to-consumer supply chains." }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800">
      {/* ── 1. Hero Section ── */}
      <section className="relative overflow-hidden py-20 border-b border-zinc-150 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-extrabold uppercase tracking-widest rounded-none mb-6"
          >
            <Sparkles className="h-3 w-3" /> Established 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-black leading-tight tracking-tight mb-4"
          >
            About ShopEsy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-500 font-semibold tracking-wide uppercase mb-6 max-w-2xl"
          >
            Bespoke Fashion Curation For The Modern Soul
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-8"
          >
            We bridge the gap between high-end editorial aesthetics and everyday wardrobe essentials. Discover premium tailored pieces designed to inspire confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/shop"
              className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 text-white font-bold text-sm px-8 py-4 rounded-none shadow-md transition-all active:scale-[0.98]"
            >
              <span>Shop Collections</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Our Story Section ── */}
      <section className="py-20 border-b border-zinc-150 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Text (7 Columns) */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="lg:col-span-7 text-left flex flex-col gap-6"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Our Heritage</span>
              <h2 className="text-3xl sm:text-4xl font-black text-black leading-tight tracking-tight">
                Redefining the Fashion Commerce Landscape
              </h2>
              <div className="h-1 w-12 bg-black" />
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                ShopEsy was established with a singular, clear ambition: to make luxury fashion curation accessible and direct-to-consumer. We realized that finding modern, tailored, and durable essentials often came with compromise—either in tailoring quality or markup values.
              </p>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Our founders set out to build a platform that focuses exclusively on craftsmanship, minimalist materials, and sleek digital experiences. We curate collections directly from verified tailors and design studios, ensuring premium quality control and swift delivery.
              </p>
            </motion.div>

            {/* Showcase Image (5 Columns) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 h-[320px] sm:h-[400px] border border-slate-200 overflow-hidden flex items-center justify-center bg-zinc-50 relative group"
            >
              <img 
                src="/about_showcase.webp" 
                alt="ShopEsy Studio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 3 & 4. Mission & Vision Section ── */}
      <section className="py-20 border-b border-zinc-150 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white border border-slate-250/60 p-8 sm:p-10 shadow-sm flex flex-col gap-4 text-left"
            >
              <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0 mb-2">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight">Our Mission</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To inspire personal confidence and celebrate individuality by tailoring premium-quality essentials. We are committed to democratic pricing, material authenticity, and ethical production workflows.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white border border-slate-250/60 p-8 sm:p-10 shadow-sm flex flex-col gap-4 text-left"
            >
              <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-none shrink-0 mb-2">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight">Our Vision</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                To build a premier global catalog destination for contemporary wardrobes. We envision a fashion ecosystem that is fully transparent, deeply sustainable, and driven by digital tailored innovation.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 5. Why Choose ShopEsy ── */}
      <section className="py-20 border-b border-zinc-150 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Why ShopEsy</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black mt-2 tracking-tight">The Curation Advantage</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={fadeIn}
                  whileHover={{ y: -4 }}
                  className="bg-slate-50 border border-slate-200/80 p-6 flex flex-col gap-4 text-left transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-none ${item.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-wider">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── 6. Statistics Section ── */}
      <section className="py-16 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center text-center gap-1.5"
              >
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">{stat.value}</span>
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Core Values Section ── */}
      <section className="py-20 border-b border-zinc-150 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Our Core Principles</span>
            <h2 className="text-3xl sm:text-4xl font-black text-black mt-2 tracking-tight">Values That Guide Us</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-5 gap-5"
          >
            {values.map((val, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200/90 p-5 shadow-sm text-left flex flex-col gap-2.5 transition-all duration-300"
              >
                <div className="text-slate-400 text-xs font-bold font-mono">0{idx + 1}</div>
                <h3 className="text-sm font-bold text-black tracking-tight">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-normal">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 8. CTA Section ── */}
      <section className="py-20 bg-gradient-to-r from-zinc-950 to-neutral-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1.5px,transparent_1.5px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Ready To Upgrade Your Style?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mb-8">
            Browse our curated collections of shirts, dresses, cap sets, backpacks, caprices, and accessories. Elevate your catalog wardrobe today.
          </p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold text-sm px-8 py-4 rounded-none shadow-lg transition-all active:scale-[0.98]"
          >
            <span>Shop Curation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
