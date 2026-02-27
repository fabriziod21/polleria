import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";
import BottomNav from "./BottomNav";
import ProductModal from "./ProductModal";
import { useCart } from "@/context/CartContext";

export default function Layout() {
  const { editingItem, setEditingItem, setIsOpen } = useCart();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="pt-16 md:pt-24 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <CartToast />

      {/* Edit modal for cart items */}
      <ProductModal
        product={editingItem?.product || null}
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        editingCartItem={editingItem}
        onEditDone={() => {
          setEditingItem(null);
          setIsOpen(true);
        }}
      />
    </div>
  );
}
