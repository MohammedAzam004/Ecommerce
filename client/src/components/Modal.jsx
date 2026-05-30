import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      bg: "bg-red-50",
      btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      bg: "bg-amber-50",
      btn: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500",
    },
    info: {
      icon: <Info className="h-5 w-5 text-slate-900" />,
      bg: "bg-slate-100",
      btn: "bg-slate-900 hover:bg-slate-800 focus:ring-slate-500",
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.info;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Sheet panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white w-full max-w-md rounded-3xl border border-slate-100 p-6 shadow-[0_20px_50px_-12px_rgba(0, 0, 0, 0.22)] z-10 flex flex-col gap-5 text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${currentStyle.bg}`}>
                {currentStyle.icon}
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body content */}
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            {message}
          </p>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-50 pt-4.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/50 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4.5 py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer active:scale-95 ${currentStyle.btn}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
