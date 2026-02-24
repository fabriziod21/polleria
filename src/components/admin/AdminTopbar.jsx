import { useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/AdminAuthContext";

const pageNames = {
  "/admin/dashboard": "Dashboard",
  "/admin/pedidos": "Pedidos",
  "/admin/categorias": "Categorías",
  "/admin/productos": "Productos",
  "/admin/finanzas": "Finanzas",
};

export default function AdminTopbar({ onMenuToggle }) {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const pageName = pageNames[location.pathname] || "Admin";

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400 hover:text-white hover:bg-zinc-800"
            onClick={onMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-white font-semibold text-base">{pageName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 mr-2">
            <div className="w-7 h-7 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 text-xs font-bold">
              M
            </div>
            <span>Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-400 hover:bg-red-600/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
