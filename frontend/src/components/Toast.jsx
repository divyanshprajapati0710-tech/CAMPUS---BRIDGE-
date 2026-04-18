import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getStyles = (type) => {
    switch (type) {
      case "success": return { bg: "bg-green-50 border-green-200", icon: "✅", text: "text-green-800" };
      case "error": return { bg: "bg-red-50 border-red-200", icon: "❌", text: "text-red-800" };
      case "info": return { bg: "bg-navy-100 border-navy-200", icon: "ℹ️", text: "text-navy-800" };
      case "warning": return { bg: "bg-amber-50 border-amber-200", icon: "⚠️", text: "text-amber-800" };
      default: return { bg: "bg-green-50 border-green-200", icon: "✅", text: "text-green-800" };
    }
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 80, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 80, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-[360px] cursor-pointer ${styles.bg}`}
                onClick={() => removeToast(toast.id)}
              >
                <span className="text-lg">{styles.icon}</span>
                <p className={`text-sm font-medium flex-1 ${styles.text}`}>{toast.message}</p>
                <motion.button
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
                {/* Progress bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 rounded-b-xl bg-current opacity-30"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3.5, ease: "linear" }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}