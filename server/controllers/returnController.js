const ReturnRequest = require("../models/ReturnRequest");
const Order = require("../models/Order");

// @desc    Submit a return request
// @route   POST /api/returns
// @access  Private
const submitReturnRequest = async (req, res) => {
    try {
        const { orderId, reason, image } = req.body;

        if (!orderId || !reason) {
            return res.status(400).json({ message: "Order ID and reason are required" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order Not Found" });
        }

        // Verify ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to return products from this order" });
        }

        // Verify if order is delivered
        if (!order.isDelivered) {
            return res.status(400).json({ message: "Order must be delivered before returning items" });
        }

        // Verify if order is already cancelled
        if (order.isCancelled) {
            return res.status(400).json({ message: "Cancelled orders cannot be returned" });
        }

        // Check if there's already a return request for this order
        const existingRequest = await ReturnRequest.findOne({ order: orderId });
        if (existingRequest) {
            return res.status(400).json({ message: "A return request has already been filed for this order" });
        }

        // Create return request
        const returnRequest = await ReturnRequest.create({
            order: orderId,
            user: req.user._id,
            reason,
            image,
        });

        res.status(201).json({
            message: "Return request submitted successfully",
            returnRequest,
        });
    } catch (error) {
        console.error("submitReturnRequest error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all return requests (Admin)
// @route   GET /api/returns
// @access  Private/Admin
const getAllReturnRequests = async (req, res) => {
    try {
        const returnRequests = await ReturnRequest.find({})
            .populate("user", "name email")
            .populate("order", "_id totalPrice createdAt isDelivered deliveredAt");
        res.status(200).json(returnRequests);
    } catch (error) {
        console.error("getAllReturnRequests error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update return request status (Admin)
// @route   PUT /api/returns/:id/status
// @access  Private/Admin
const updateReturnRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const returnRequest = await ReturnRequest.findById(req.params.id);
        if (!returnRequest) {
            return res.status(404).json({ message: "Return Request Not Found" });
        }

        returnRequest.status = status;
        const updatedRequest = await returnRequest.save();

        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error("updateReturnRequestStatus error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    submitReturnRequest,
    getAllReturnRequests,
    updateReturnRequestStatus,
};
