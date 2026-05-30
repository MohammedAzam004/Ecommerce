const express = require("express");
const { createOrder, getKey, verifyPayment } = require("../controllers/paymentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/getkey", protect, getKey);
router.post("/verify", protect, verifyPayment);

module.exports = router;
