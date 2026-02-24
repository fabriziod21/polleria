import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, Sun, Moon, Search, LayoutDashboard, ClipboardList, FolderOpen, Package, Beef, Users, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminTheme } from "@/context/AdminThemeContext";

const modules = [
  { to: "/admin/dashboard", label: "Dashboard", description: "Resumen general", icon: LayoutDashboard, section: "Principal" },
  { to: "/admin/pedidos", label: "Pedidos", description: "Gestiona los pedidos", icon: ClipboardList, section: "Principal" },
  { to: "/admin/pos", label: "Punto de Venta", description: "Crear notas de venta", icon: ShoppingCart, section: "Principal" },
  { to: "/admin/categorias", label: "Categorías", description: "Organiza tu menú", icon: FolderOpen, section: "Catálogo" },
  { to: "/admin/productos", label: "Productos", description: "Administra productos", icon: Package, section: "Catálogo" },
  { to: "/admin/complementos", label: "Complementos", description: "Salsas, extras y bebidas", icon: Beef, section: "Catálogo" },
  { to: "/admin/clientes", label: "Clientes", description: "Registro de clientes", icon: Users, section: "Gestión" },
];

export default function AdminTopbar({ onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { todayOrders } = useAdminData();
  const { isDark, toggleTheme } = useAdminTheme();
  const pendingCount = todayOrders?.filter((o) => o.estado === "pendiente").length || 0;

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const filtered = query.trim()
    ? modules.filter((m) =>
        m.label.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.section.toLowerCase().includes(query.toLowerCase())
      )
    : modules;

  function handleSelect(mod) {
    navigate(mod.to);
    setSearchOpen(false);
    setQuery("");
  }

  // Close on click outside
  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSearchOpen(false);
        setQuery("");
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [searchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800/60">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl"
            onClick={onMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative" ref={containerRef}>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl sm:hidden"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Desktop search bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 text-gray-400 dark:text-zinc-500 text-xs hover:border-gray-300 dark:hover:border-zinc-700 transition-colors cursor-text w-52"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar módulo...</span>
              <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500">Ctrl+K</kbd>
            </button>

            {/* Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl shadow-xl dark:shadow-black/40 overflow-hidden z-50">
                <div className="p-2 border-b border-gray-100 dark:border-zinc-800/60">
                  <div className="flex items-center gap-2 px-2">
                    <Search className="w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar módulo..."
                      className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 outline-none py-1.5"
                    />
                  </div>
                </div>
                <div className="p-1.5 max-h-72 overflow-y-auto">
                  {filtered.length === 0 && (
                    <p className="text-center text-gray-400 dark:text-zinc-600 text-xs py-4">Sin resultados</p>
                  )}
                  {filtered.map((mod) => {
                    const isCurrentPage = location.pathname === mod.to;
                    return (
                      <button
                        key={mod.to}
                        onClick={() => handleSelect(mod)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isCurrentPage
                            ? "bg-red-600/10 dark:bg-red-600/15"
                            : "hover:bg-gray-100 dark:hover:bg-zinc-800/60"
                        }`}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                          isCurrentPage
                            ? "bg-red-600/15 dark:bg-red-600/20"
                            : "bg-gray-100 dark:bg-zinc-800/50"
                        }`}>
                          <mod.icon className={`w-4 h-4 ${
                            isCurrentPage ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-zinc-400"
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13px] font-medium truncate ${
                            isCurrentPage ? "text-red-700 dark:text-red-400" : "text-zinc-900 dark:text-white"
                          }`}>
                            {mod.label}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">{mod.description}</p>
                        </div>
                        <span className="ml-auto text-[10px] text-gray-400 dark:text-zinc-600 shrink-0">{mod.section}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Notification bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </Button>

          {/* User avatar */}
          <div className="hidden sm:flex items-center gap-2.5 ml-1 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <div className="leading-none">
              <p className="text-zinc-900 dark:text-white text-xs font-medium">Admin</p>
              <p className="text-gray-500 text-[10px]">Sanguchería Mary</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
