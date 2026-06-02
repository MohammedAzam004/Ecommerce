const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

// Load environment variables from .env
dotenv.config();

// ==========================================
// CONFIGURATION: Load Admin details from environment variables
// ==========================================
const ADMIN_NAME = process.env.ADMIN_NAME || "Administrator";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminsecurepassword";
// ==========================================

const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("❌ Error: MONGO_URI is not defined in your server/.env file.");
            process.exit(1);
        }

        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB successfully.");

        // Check if user already exists
        const userExists = await User.findOne({ email: ADMIN_EMAIL });

        if (userExists) {
            console.log(`\n🔄 User with email "${ADMIN_EMAIL}" already exists.`);
            console.log("🛠️ Upgrading this existing user to Administrator...");
            
            userExists.isAdmin = true;
            userExists.role = "admin";
            
            // Optional: Update password if you want to reset it
            // const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            // userExists.password = hashedPassword;

            await userExists.save();
            console.log(`\n🎉 SUCCESS: "${ADMIN_EMAIL}" has been upgraded to Admin!`);
        } else {
            console.log(`\n📝 User with email "${ADMIN_EMAIL}" does not exist.`);
            console.log("✨ Creating a brand new Administrator account...");
            
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
            
            await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                isAdmin: true,
                role: "admin"
            });
            console.log(`\n🎉 SUCCESS: New Admin account successfully created with email "${ADMIN_EMAIL}"!`);
        }

        await mongoose.connection.close();
        console.log("🔌 Database connection closed cleanly.\n");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error running seed script:", error);
        process.exit(1);
    }
};

seedAdmin();
