import { API_BASE_URL } from "../utils/config";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const ReviewForm = ({ productId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error("✗ You must be logged in to write a review.");
            return;
        }

        if (!comment.trim()) {
            toast.error("✗ Please enter your review comment.");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(
                `${API_BASE_URL}/api/products/${productId}/reviews`,
                {
                    rating: Number(rating),
                    comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            toast.success("✓ Review Added Successfully!");
            setComment("");
            setRating(5);
            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (error) {
            console.error("Submit review error:", error);
            const errMsg = error.response?.data?.message || "Failed to submit review.";
            toast.error("✗ " + errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!userInfo) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center"
            >
                <p className="text-sm text-slate-500 mb-4 font-medium">
                    Have you purchased this product? Share your experience with other shoppers!
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-semibold shadow-sm transition-all duration-200"
                >
                    Sign In to Write a Review
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.form
            onSubmit={submitHandler}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 border border-slate-100 rounded-3xl bg-white flex flex-col gap-5 shadow-[0_4px_25px_-6px_rgba(0, 0, 0, 0.06)]"
        >
            <div>
                <h3 className="text-base font-bold tracking-tight text-slate-950">
                    Write a Customer Review
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                    Share your authentic experience and feedback with the collector community.
                </p>
            </div>

            {/* Interactive Luxury Star Selector */}
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Your Rating
                </span>
                <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                        const isHighlighted = hoveredRating >= starValue || (!hoveredRating && rating >= starValue);
                        return (
                            <button
                                key={starValue}
                                type="button"
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoveredRating(starValue)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="p-1 focus:outline-none transition-transform active:scale-90"
                            >
                                <Star
                                    className={`h-5 w-5 stroke-[1.5] transition-colors duration-150 ${
                                        isHighlighted
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-slate-300 hover:text-slate-400"
                                    }`}
                                />
                            </button>
                        );
                    })}
                    <span className="text-xs font-semibold text-slate-500 ml-2">
                        {rating} out of 5
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="review-comment"
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                >
                    Review Details
                </label>
                <textarea
                    id="review-comment"
                    placeholder="Describe what you liked or disliked about this design..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows="4"
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 resize-none shadow-sm"
                />
            </div>

            <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center justify-center px-6 py-3 rounded-2xl text-xs font-semibold tracking-wide text-white transition-all duration-200 self-start min-w-[140px] ${
                    submitting
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 shadow-sm"
                }`}
            >
                {submitting ? "Submitting..." : "Publish Review"}
            </motion.button>
        </motion.form>
    );
};

export default ReviewForm;