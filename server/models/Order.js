const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [
            {
                name: String,

                qty: Number,

                image: String,

                price: Number,

                product: {
                    type:
                        mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
            },
        ],

        shippingAddress: {
            address: String,

            city: String,

            postalCode: String,

            country: String,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },

        paymentMethod: {
            type: String,
            required: true,
            default: "COD",
        },

        paidAt: {
            type: Date,
        },

        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },

        deliveredAt: {
            type: Date,
        },

        isCancelled: {
            type: Boolean,
            required: true,
            default: false,
        },

        cancelledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model("Order", orderSchema);