const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        console.log("👉 Tip: Make sure your current IP address is whitelisted in your MongoDB Atlas Network Access console!");
    }
};

module.exports = connectDB;



