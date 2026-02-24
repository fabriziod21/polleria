import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/menu", label: "Menú", icon: UtensilsCrossed },
];

export default function BottomNav() {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-red-900/30">
      <div className="flex items-center justify-around h-16 px-4">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                isActive ? "text-red-500" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-0 w-10 h-0.5 bg-red-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 px-4 py-1 text-gray-500 hover:text-gray-300 transition-colors relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-3"
              >
                <Badge className="bg-red-600 text-white text-[9px] px-1 py-0 min-w-[16px] h-[16px] flex items-center justify-center rounded-full border-0">
                  {totalItems}
                </Badge>
              </motion.div>
            )}
          </div>
          <span className="text-[10px] font-medium">Carrito</span>
        </button>
      </div>
    </nav>
  );
}
