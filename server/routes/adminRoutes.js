const express = require("express");
const { getAdminStats } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/stats", protect, admin, getAdminStats);

module.exports = router;
