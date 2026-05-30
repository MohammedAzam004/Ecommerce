const express = require("express");
const { getAllUsers, deleteUser, updateUserProfile } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// GET /api/users/admin
router.get("/admin", protect, admin, getAllUsers);

// PUT /api/users/profile
router.put("/profile", protect, updateUserProfile);

// DELETE /api/users/:id
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
