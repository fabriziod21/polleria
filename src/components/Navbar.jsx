import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Home, UtensilsCrossed, Sandwich, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/menu", label: "Menú", icon: UtensilsCrossed },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Sandwich className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-lg tracking-tight">Mary</span>
            <span className="text-red-500 text-[10px] font-medium tracking-widest uppercase">Sanguchería</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={
                    isActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Admin + Cart + Mobile Toggle */}
        <div className="flex items-center gap-1">
          <Link to="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-400 hover:bg-red-600/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-white/10"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <Badge className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-0">
                  {totalItems}
                </Badge>
              </motion.div>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/98 border-t border-red-900/30 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActive
                          ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <link.icon className="w-4 h-4 mr-3" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              <Link to="/admin" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-500 hover:text-red-400 hover:bg-red-600/10"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Admin
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
