import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import { extractErrorMessage } from "../utils/errorHelper";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShoppingBag } from "lucide-react";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            if (userInfo.user && userInfo.user.isAdmin) {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser({
                email,
                password,
            });

            localStorage.setItem(
                "userInfo",
                JSON.stringify(data)
            );

            toast.success("✓ Welcome back!");
            
            if (data.user && data.user.isAdmin) {
                window.location.href = "/admin/dashboard";
            } else {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Login error:", error);
            const errMsg = extractErrorMessage(error, "Login Failed. Invalid Credentials.");
            toast.error("✗ " + errMsg);
        }
    };

    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-[#FAFAFA] py-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_15px_50px_-15px_rgba(0, 0, 0, 0.15)] flex flex-col gap-6"
            >
                <div className="text-center flex flex-col items-center">
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="bg-black p-3 rounded-2xl text-white shadow-md shadow-slate-900/10 hover:scale-105 transition-transform duration-300">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-black">
                            ShopEsy
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Sign in to account
                    </h1>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                        Access your luxury order catalog, shipping addresses, and personal collector dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                            <input
                                id="login-email"
                                type="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 placeholder-slate-300 text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                        <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                            <input
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all duration-200 placeholder-slate-300 text-slate-900"
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                    </motion.button>
                </form>

                <div className="border-t border-slate-100 pt-4 text-center">
                    <p className="text-xs text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-slate-900 hover:text-slate-800 underline underline-offset-4"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;