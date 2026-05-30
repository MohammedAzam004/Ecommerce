const Order = require("../models/Order");
const Product = require("../models/Products");

const placeOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            totalPrice,
            paymentMethod,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // 1. Verify requested quantities do not exceed available stock and stock does not become negative
        for (const item of orderItems) {
            const product = await Product.findById(item.product || item._id);
            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.name}`,
                });
            }
            if (product.countInStock <= 0) {
                return res.status(400).json({
                    message: `Product is out of stock: ${item.name}`,
                });
            }
            if (product.countInStock < item.qty) {
                return res.status(400).json({
                    message: `Not enough stock available for ${item.name}`,
                });
            }
        }

        // 2. If online payment, cryptographically verify Razorpay signature before confirming
        let isPaid = false;
        let paidAt = null;

        if (paymentMethod === "Online") {
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return res.status(400).json({
                    message: "Payment verification details are missing",
                });
            }

            const crypto = require("crypto");
            const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
            hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
            const generated_signature = hmac.digest("hex");

            if (generated_signature !== razorpay_signature) {
                return res.status(400).json({
                    message: "Payment verification failed. Invalid signature.",
                });
            }

            isPaid = true;
            paidAt = Date.now();
        }

        // 3. Atomically reduce countInStock for every ordered product
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product || item._id,
                { $inc: { countInStock: -item.qty } },
                { new: true }
            );
        }

        // Normalize orderItems for database mapping
        const normalizedOrderItems = orderItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item.product || item._id,
        }));

        const order = await Order.create({
            user: req.user._id,

            orderItems: normalizedOrderItems,

            shippingAddress,

            totalPrice,

            paymentMethod: paymentMethod || "COD",

            isPaid,

            paidAt,
        });

        res.status(201).json({
            message: "Order Placed Successfully",

            order,
        });
    } catch (error) {
        console.error("placeOrder error:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getAllOrders =
    async (req, res) => {
        try {
            const orders =
                await Order.find({})
                    .populate(
                        "user",
                        "name email"
                    );

            res.json(orders);
        } catch (error) {
            console.error("Error in getAllOrders:", error);
            res.status(500).json({
                message: "Server Error",
            });
        }
    };

const deliverOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found",
            });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error in deliverOrder:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found",
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error in getOrderById:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found",
            });
        }

        // Restrict cancellation to admin or owner of the order
        if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized to cancel this order",
            });
        }

        if (order.isCancelled) {
            return res.status(400).json({
                message: "Order is already cancelled",
            });
        }

        // Restrict cancellation if order is already delivered
        if (order.isDelivered) {
            return res.status(400).json({
                message: "Delivered orders cannot be cancelled",
            });
        }

        // Restore stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { countInStock: item.qty } }
            );
        }

        order.isCancelled = true;
        order.cancelledAt = Date.now();

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error in cancelOrder:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order Not Found",
            });
        }

        // Restore stock if deleting an active unfulfilled order
        if (!order.isCancelled && !order.isDelivered) {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { countInStock: item.qty } }
                );
            }
        }

        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Order Deleted Successfully",
        });
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    deliverOrder,
    getOrderById,
    cancelOrder,
    deleteOrder,
};