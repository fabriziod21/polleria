import { useLocation } from "react-router-dom";
import { Menu, Bell, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminTheme } from "@/context/AdminThemeContext";

const pageNames = {
  "/admin/dashboard": "Dashboard",
  "/admin/pedidos": "Pedidos",
  "/admin/categorias": "Categorías",
  "/admin/productos": "Productos",
  "/admin/complementos": "Complementos",
  "/admin/finanzas": "Finanzas",
  "/admin/clientes": "Clientes",
  "/admin/pos": "Punto de Venta",
};

const pageDescriptions = {
  "/admin/dashboard": "Resumen general",
  "/admin/pedidos": "Gestiona los pedidos",
  "/admin/categorias": "Organiza tu menú",
  "/admin/productos": "Administra productos",
  "/admin/complementos": "Salsas, extras y bebidas",
  "/admin/finanzas": "Control financiero",
  "/admin/clientes": "Registro de clientes",
  "/admin/pos": "Crear notas de venta",
};

export default function AdminTopbar({ onMenuToggle }) {
  const location = useLocation();
  const { todayOrders } = useAdminData();
  const { isDark, toggleTheme } = useAdminTheme();
  const pageName = pageNames[location.pathname] || "Admin";
  const pageDesc = pageDescriptions[location.pathname] || "";
  const pendingCount = todayOrders?.filter((o) => o.estado === "pendiente").length || 0;

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
          <div>
            <h1 className="text-zinc-900 dark:text-white font-bold text-lg leading-tight">{pageName}</h1>
            <p className="text-gray-500 text-xs hidden sm:block">{pageDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white text-xs font-bold">
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
