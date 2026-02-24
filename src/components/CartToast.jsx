import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartToast() {
  const { lastAddedItem, setLastAddedItem, setIsOpen } = useCart();

  useEffect(() => {
    if (!lastAddedItem) return;
    const timer = setTimeout(() => setLastAddedItem(null), 3000);
    return () => clearTimeout(timer);
  }, [lastAddedItem, setLastAddedItem]);

  return (
    <AnimatePresence>
      {lastAddedItem && (
        <motion.div
          key={lastAddedItem.timestamp}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-sm"
        >
          <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-3 shadow-2xl shadow-black/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {lastAddedItem.name}
              </p>
              <p className="text-gray-400 text-xs">Agregado al carrito</p>
            </div>
            <button
              onClick={() => {
                setLastAddedItem(null);
                setIsOpen(true);
              }}
              className="text-red-400 text-xs font-bold whitespace-nowrap hover:text-red-300 transition-colors px-2 py-1"
            >
              Ver carrito
            </button>
            <button
              onClick={() => setLastAddedItem(null)}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
