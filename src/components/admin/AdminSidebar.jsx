import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Package, DollarSign, ExternalLink, LogOut, Sandwich } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAdminAuth } from "@/context/AdminAuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/finanzas", label: "Finanzas", icon: DollarSign },
];

export default function AdminSidebar({ onNavigate }) {
  const location = useLocation();
  const { logout } = useAdminAuth();

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      {/* Brand */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center">
          <Sandwich className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-bold text-base">Mary</span>
          <span className="text-red-500 text-[10px] font-medium tracking-wider">ADMIN PANEL</span>
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-red-600/15 text-red-400 border-l-2 border-red-500 ml-0"
                  : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-zinc-800" />

      {/* Bottom */}
      <div className="p-3 space-y-1">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-zinc-800/50 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Volver a la tienda
        </Link>
        <button
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-600/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
