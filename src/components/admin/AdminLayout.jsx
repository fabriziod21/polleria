import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Sandwich, Heart, LayoutDashboard, ClipboardList, FolderOpen, Package, Beef, Users, ShoppingCart } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext";

const pageHeaders = {
  "/admin/dashboard": { title: "Dashboard", description: "Resumen general de tu negocio", icon: LayoutDashboard },
  "/admin/pedidos": { title: "Pedidos", description: "Gestiona los pedidos de tus clientes", icon: ClipboardList },
  "/admin/pos": { title: "Punto de Venta", description: "Crear notas de venta rápidas", icon: ShoppingCart },
  "/admin/categorias": { title: "Categorías", description: "Organiza las categorías de tu menú", icon: FolderOpen },
  "/admin/productos": { title: "Productos", description: "Administra los productos de tu carta", icon: Package },
  "/admin/complementos": { title: "Complementos", description: "Salsas, extras y bebidas para tus productos", icon: Beef },
  "/admin/clientes": { title: "Clientes", description: "Registro y gestión de clientes", icon: Users },
};

function AdminLayoutInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useAdminTheme();
  const location = useLocation();
  const header = pageHeaders[location.pathname];

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - collapsible push on mobile, fixed on desktop */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Main */}
        <div className="min-h-screen flex flex-col lg:pl-64">
          <AdminTopbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 p-4 md:p-6">
            {header && (
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 dark:bg-red-600/15 flex items-center justify-center shrink-0">
                  <header.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{header.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{header.description}</p>
                </div>
              </div>
            )}
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="mt-auto">
            <Separator className="bg-gray-200 dark:bg-zinc-800/60" />
            <div className="px-4 md:px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600/10 dark:bg-red-600/15 flex items-center justify-center">
                    <Sandwich className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600">
                    <span className="font-medium text-gray-500">Sangucheria Mary</span>
                    <span className="text-gray-300 dark:text-zinc-700">|</span>
                    <span>Panel de Administracion</span>
                  </div>
                </div>

                {/* Center / Info */}
                <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-700">
                  <span>Hecho con</span>
                  <Heart className="w-3 h-3 text-red-500/60 fill-red-500/60" />
                  <span>en Peru</span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-700">
                  <span>&copy; {new Date().getFullYear()} Todos los derechos reservados</span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800/80 text-gray-500 dark:text-gray-600 font-mono text-[10px]">v1.0.0</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner />
    </AdminThemeProvider>
  );
}
