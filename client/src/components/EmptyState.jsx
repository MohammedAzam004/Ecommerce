import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ShoppingBag, Package, Users, Search, AlertCircle } from "lucide-react";

const EmptyState = ({
    title,
    message,
    icon = "default",
    buttonText,
    buttonLink,
    onButtonClick,
}) => {
    const renderIcon = () => {
        const iconClass = "w-8 h-8 text-slate-800";

        switch (icon) {
            case "cart":
                return <ShoppingCart className={iconClass} />;
            case "orders":
                return <ShoppingBag className={iconClass} />;
            case "products":
                return <Package className={iconClass} />;
            case "users":
                return <Users className={iconClass} />;
            case "search":
                return <Search className={iconClass} />;
            default:
                return <AlertCircle className={iconClass} />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-center p-12 max-w-lg mx-auto my-10 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0, 0, 0, 0.06)]"
        >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                {renderIcon()}
            </div>

            <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-2">
                {title}
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-xs">
                {message}
            </p>

            {buttonText && (
                buttonLink ? (
                    <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}>
                        <Link
                            to={buttonLink}
                            className="inline-flex items-center justify-center px-5 py-3 font-bold text-[10px] tracking-widest uppercase text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            {buttonText}
                        </Link>
                    </motion.div>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ y: -1 }}
                        onClick={onButtonClick}
                        className="inline-flex items-center justify-center px-5 py-3 font-bold text-[10px] tracking-widest uppercase text-white bg-slate-900 hover:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {buttonText}
                    </motion.button>
                )
            )}
        </motion.div>
    );
};

export default EmptyState;
