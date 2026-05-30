const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        image: {
            type: String, // Stored as base64 string or URL
        },
        status: {
            type: String,
            required: true,
            default: "Pending", // "Pending", "Approved", "Rejected"
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
