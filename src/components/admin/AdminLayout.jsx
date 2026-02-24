import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Sandwich, Heart } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext";

function AdminLayoutInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useAdminTheme();

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <AdminSidebar />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800">
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main */}
        <div className="lg:pl-64 min-h-screen flex flex-col">
          <AdminTopbar onMenuToggle={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="mt-auto">
            <Separator className="bg-gray-200 dark:bg-zinc-800/60" />
            <div className="px-4 md:px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800/80 flex items-center justify-center">
                    <Sandwich className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
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
