const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    try {
        // Check token exists
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Get user data
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } else {
            res.status(401).json({
                message: "Not Authorized",
            });
        }
    } catch (error) {
        res.status(401).json({
            message: "Token Failed",
        });
    }
};

module.exports = protect;