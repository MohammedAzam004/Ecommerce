const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        console.error("👉 Tip: Check your MONGO_URI and ensure your IP is whitelisted in MongoDB Atlas.");
        process.exit(1); // Crash the process so PM2 / Docker can restart it cleanly
    }
};

module.exports = connectDB;



