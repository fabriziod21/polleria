import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, Home, UtensilsCrossed, Sandwich, Settings, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { restaurantInfo } from "@/data/menu";

const navLinks = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/menu", label: "Menú", icon: UtensilsCrossed },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // En la página de menú siempre sólido
  const isMenuPage = location.pathname === "/menu";
  const solid = scrolled || isMenuPage || mobileOpen;

  return (
    <>
      {/* Top info bar - solo desktop, se oculta al scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-[51] hidden md:block transition-all duration-300 ${
          solid ? "h-0 opacity-0 overflow-hidden" : "h-8 opacity-100"
        }`}
      >
        <div className="h-full bg-red-700/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between text-white/90 text-[11px]">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                {restaurantInfo.address}
              </span>
              <span className="w-px h-3 bg-white/30" />
              <span>{restaurantInfo.hours}</span>
            </div>
            <a
              href={`tel:${restaurantInfo.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
            >
              <Phone className="w-3 h-3" />
              {restaurantInfo.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          solid
            ? "top-0 bg-zinc-950/95 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
            : "md:top-8 top-0 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 md:h-[68px] flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className={`absolute inset-0 rounded-xl blur-lg transition-all duration-300 ${
                  solid ? "bg-red-600/0" : "bg-red-600/20"
                }`} />
                <div className="relative w-9 h-9 rounded-xl bg-red-600/15 flex items-center justify-center">
                  <Sandwich className="w-5 h-5 text-red-500 group-hover:text-red-400 transition-colors" />
                </div>
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-lg tracking-tight">Mary</span>
                <span className="text-red-500/70 text-[9px] font-semibold tracking-[0.2em] uppercase">Sanguchería</span>
              </div>
            </Link>

            {/* Desktop Nav - centro */}
            <nav className="hidden md:flex items-center gap-0.5 bg-white/[0.04] rounded-full px-1.5 py-1 border border-white/[0.06]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} className="relative">
                    <div
                      className={`flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 bg-red-600/20 border border-red-500/30 rounded-full -z-10"
                        transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-1.5">
              {/* Teléfono - solo desktop */}
              <a
                href={`tel:${restaurantInfo.phone}`}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200 mr-1"
              >
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span className="font-medium">{restaurantInfo.phone}</span>
              </a>

              {/* Admin */}
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full text-gray-500 hover:text-red-400 hover:bg-red-600/10 transition-all"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative w-9 h-9 rounded-full text-white hover:bg-white/10 transition-all"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5"
                  >
                    <Badge className="bg-red-600 text-white text-[9px] px-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-zinc-950 font-bold">
                      {totalItems}
                    </Badge>
                  </motion.div>
                )}
              </Button>

              {/* Mobile Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden w-9 h-9 rounded-full text-white hover:bg-white/10"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-white/[0.06]"
            >
              <div className="bg-zinc-950/98 backdrop-blur-xl">
                <nav className="flex flex-col p-4 gap-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                        <div
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all ${
                            isActive
                              ? "bg-red-600/15 text-red-400 border border-red-500/20"
                              : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isActive ? "bg-red-600/20" : "bg-white/[0.06]"
                          }`}>
                            <link.icon className="w-4 h-4" />
                          </div>
                          {link.label}
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
                          )}
                        </div>
                      </Link>
                    );
                  })}

                  <div className="h-px bg-white/[0.06] my-2" />

                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      Admin Panel
                    </div>
                  </Link>

                  {/* Info en mobile menu */}
                  <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                    <a
                      href={`tel:${restaurantInfo.phone}`}
                      className="flex items-center gap-2.5 text-[12px] text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-500/70" />
                      {restaurantInfo.phone}
                    </a>
                    <div className="flex items-center gap-2.5 text-[12px] text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-red-500/50" />
                      {restaurantInfo.address}
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
