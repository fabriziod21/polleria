import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MenuProvider } from "@/context/MenuContext";
import { CartProvider } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { AdminDataProvider } from "@/context/AdminDataContext";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import PedidosPage from "@/pages/admin/PedidosPage";
import ProductosPage from "@/pages/admin/ProductosPage";
import CategoriasPage from "@/pages/admin/CategoriasPage";
import FinanzasPage from "@/pages/admin/FinanzasPage";

function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
      <CartProvider>
        <AdminAuthProvider>
          <AdminDataProvider>
            <Routes>
              {/* Public */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
              </Route>

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Admin Protected */}
              <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<DashboardPage />} />
                  <Route path="/admin/pedidos" element={<PedidosPage />} />
                  <Route path="/admin/categorias" element={<CategoriasPage />} />
                  <Route path="/admin/productos" element={<ProductosPage />} />
                  <Route path="/admin/finanzas" element={<FinanzasPage />} />
                </Route>
              </Route>
            </Routes>
          </AdminDataProvider>
        </AdminAuthProvider>
      </CartProvider>
      </MenuProvider>
    </BrowserRouter>
  );
}

export default App;
