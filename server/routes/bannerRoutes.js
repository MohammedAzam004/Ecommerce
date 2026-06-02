const express = require("express");
const { 
    getActiveBanner, 
    saveBanner,
    uploadBannerImage,
    removeBannerImage
} = require("../controllers/bannerController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.route("/")
    .get(getActiveBanner)
    .post(protect, admin, saveBanner);

router.post("/upload", protect, admin, uploadBannerImage);
router.post("/remove-image", protect, admin, removeBannerImage);

module.exports = router;
