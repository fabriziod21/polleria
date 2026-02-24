import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, quantity, selectedSalsas, selectedExtras, selectedBebidas) => {
    setItems((prev) => {
      const key = `${product.id}-${selectedSalsas?.join(",")}-${selectedExtras?.map(e => e.id).join(",")}-${selectedBebidas?.map(b => b.id).join(",")}`;
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          product,
          quantity,
          selectedSalsas: selectedSalsas || [],
          selectedExtras: selectedExtras || [],
          selectedBebidas: selectedBebidas || [],
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const extrasPrice = item.selectedExtras.reduce((s, e) => s + e.price, 0);
    const bebidasPrice = item.selectedBebidas.reduce((s, b) => s + b.price, 0);
    return sum + (item.product.price + extrasPrice + bebidasPrice) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
