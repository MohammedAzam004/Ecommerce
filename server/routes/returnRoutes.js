const express = require("express");
const {
    submitReturnRequest,
    getAllReturnRequests,
    updateReturnRequestStatus,
} = require("../controllers/returnController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, submitReturnRequest);
router.get("/", protect, admin, getAllReturnRequests);
router.put("/:id/status", protect, admin, updateReturnRequestStatus);

module.exports = router;
