import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, FolderOpen, Package, Beef, DollarSign, Users, ShoppingCart, ExternalLink, LogOut, Sandwich } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/categorias", label: "Categorías", icon: FolderOpen },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/complementos", label: "Complementos", icon: Beef },
  { to: "/admin/finanzas", label: "Finanzas", icon: DollarSign },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/pos", label: "POS", icon: ShoppingCart },
];

export default function AdminSidebar({ onNavigate }) {
  const location = useLocation();
  const { logout } = useAdminAuth();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800/60">
      {/* Brand */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
          <Sandwich className="w-5 h-5 text-zinc-900 dark:text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-zinc-900 dark:text-white font-bold text-lg tracking-tight">Mary</span>
          <span className="text-gray-500 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</span>
        </div>
      </div>

      <div className="mx-4 h-px bg-gradient-to-r from-gray-200 dark:from-zinc-800 via-gray-300/50 dark:via-zinc-700/50 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                isActive ? "bg-zinc-900/10 dark:bg-white/10" : "bg-gray-100 dark:bg-zinc-800/50 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700/50"
              }`}>
                <item.icon className={`w-4 h-4 ${isActive ? "text-zinc-900 dark:text-white" : ""}`} />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 h-px bg-gradient-to-r from-gray-200 dark:from-zinc-800 via-gray-300/50 dark:via-zinc-700/50 to-transparent" />

      {/* Bottom */}
      <div className="p-3 space-y-0.5">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-500 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800/50">
            <ExternalLink className="w-4 h-4" />
          </div>
          Volver a la tienda
        </Link>
        <button
          onClick={() => { logout(); onNavigate?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-500 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-all duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800/50">
            <LogOut className="w-4 h-4" />
          </div>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
