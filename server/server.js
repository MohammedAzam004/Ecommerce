require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const returnRoutes = require("./routes/returnRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security: HTTP headers via Helmet ───────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
// CLIENT_URL must be set in .env — no localhost fallback in production
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Auth routes: 15 requests per 15 minutes per IP (brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP. Please try again in 15 minutes.",
    },
});

// General API limiter: 200 requests per minute per IP
const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Rate limit exceeded. Please slow down.",
    },
});

app.use("/api/", generalLimiter);
app.use("/api/auth", authLimiter);  // Stricter limiter stacked on auth

// ─── Static uploads ──────────────────────────────────────────────────────────
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/banner", require("./routes/bannerRoutes"));

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "ShopEsy API Server is running." });
});

// ─── Error Middleware ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Admin Seeding ────────────────────────────────────────────────────────────
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdminUser = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Guard: refuse to seed with no/weak admin credentials
        if (!adminEmail || !adminPassword) {
            if (process.env.NODE_ENV === "production") {
                console.error("❌ FATAL: ADMIN_EMAIL and ADMIN_PASSWORD must be set in production .env");
                process.exit(1);
            } else {
                console.warn("⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed in development.");
                return;
            }
        }

        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                name: "System Administrator",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                isAdmin: true,
            });
            console.log(`⚡ Default Admin User (${adminEmail}) seeded successfully.`);
        } else {
            if (!adminExists.isAdmin || adminExists.role !== "admin") {
                adminExists.isAdmin = true;
                adminExists.role = "admin";
                await adminExists.save();
                console.log("⚡ Existing user upgraded to Admin status.");
            }
        }
    } catch (error) {
        console.error("❌ Error seeding default admin user:", error);
    }
};

// ─── Connect DB then start server ────────────────────────────────────────────
connectDB().then(() => {
    seedAdminUser();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
    });
});
