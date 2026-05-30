import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowRight, ShoppingBag } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="min-h-[75vh] flex items-center justify-center bg-[#FAFAFA] py-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_15px_50px_-15px_rgba(0, 0, 0, 0.15)] flex flex-col items-center text-center gap-6"
            >
                {/* Visual Graphic Representation */}
                <div className="relative mb-2">
                    <div className="absolute inset-0 bg-black/5 rounded-full blur-xl scale-150 animate-pulse" />
                    <div className="relative w-24 h-24 bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center shadow-inner">
                        <Compass className="h-10 w-10 text-slate-400 stroke-[1.25]" />
                        <div className="absolute -top-1 -right-1 bg-black text-white p-1 rounded-full shadow-md text-[10px] font-black w-6 h-6 flex items-center justify-center">
                            404
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Page Not Found
                    </h1>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                        The luxury destination or bespoke piece you are seeking does not exist or has been relocated to another gallery collection.
                    </p>
                </div>

                <Link
                    to="/"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                >
                    <span>Back to Homepage</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="border-t border-slate-100 pt-4 w-full text-center">
                    <Link
                        to="/shop"
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5"
                    >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Browse Collections</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
