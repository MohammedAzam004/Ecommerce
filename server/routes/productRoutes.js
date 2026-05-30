const express = require("express");
const protect = require(
    "../middleware/authMiddleware"
);

const admin = require(
    "../middleware/adminMiddleware"
);
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    createProductReview,
    deleteProduct,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
    "/:id/reviews",
    protect,
    createProductReview
);

router.post(
    "/",
    protect,
    admin,
    createProduct
);

router.put(
    "/:id",
    protect,
    admin,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteProduct
);

module.exports = router;