const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true // "men", "women", "kids"
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    productImage1: {
        type: String,
        required: false
    },
    productImage2: {
        type: String,
        required: false
    },
    productImage3: {
        type: String,
        required: false
    },
    productImage4: {
        type: String,
        required: false
    },
    productImage5: {
        type: String,
        required: false
    },
    modelImage: {
        type: String,
        required: false
    },
    buttonText: {
        type: String,
        default: "Shop Collection"
    },
    buttonLink: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Banner", bannerSchema);
