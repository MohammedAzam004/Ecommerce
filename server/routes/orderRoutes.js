const express = require("express");

const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    deliverOrder,
    getOrderById,
    cancelOrder,
    deleteOrder,
} = require("../controllers/orderController");

const protect = require(
    "../middleware/authMiddleware"
);

const admin = require(
    "../middleware/adminMiddleware"
);

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get(
    "/admin",
    protect,
    admin,
    getAllOrders
);
router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, deliverOrder);
router.put("/:id/cancel", protect, cancelOrder);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;