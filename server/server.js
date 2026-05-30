require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require(
    "./routes/orderRoutes"
);
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const returnRoutes = require("./routes/returnRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");


const app = express();

const PORT = process.env.PORT || 5000;


const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedAdminUser = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@shop.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        const adminExists = await User.findOne({ email: adminEmail });
        
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                name: "System Administrator",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                isAdmin: true
            });
            console.log(`⚡ Default Admin User (${adminEmail}) successfully seeded!`);
        } else {
            if (!adminExists.isAdmin || adminExists.role !== "admin") {
                adminExists.isAdmin = true;
                adminExists.role = "admin";
                await adminExists.save();
                console.log("⚡ Existing admin user verified & updated to Admin status.");
            }
        }
    } catch (error) {
        console.error("❌ Error seeding default admin user:", error);
    }
};

connectDB().then(() => {
    seedAdminUser();
});

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/returns", returnRoutes);


app.get("/", (req, res) => {
    res.send("Backend Server Running");
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

