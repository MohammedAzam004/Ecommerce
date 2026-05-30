const Product = require("../models/Products");
const User = require("../models/User");
const Order = require("../models/Order");

const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({});
        const totalUsers = await User.countDocuments({});
        const totalOrders = await Order.countDocuments({});
        
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.status(200).json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        console.error("Error in getAdminStats:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = { getAdminStats };
