const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Get all users
// @route   GET /api/users/admin
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot delete your own admin account",
            });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "User Deleted Successfully",
        });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();
        const token = generateToken(updatedUser._id);

        res.status(200).json({
            message: "Profile Updated Successfully",
            token,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isAdmin: updatedUser.isAdmin,
            },
        });
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    updateUserProfile,
};
