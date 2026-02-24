import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag, Sandwich } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { restaurantInfo } from "@/data/menu";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const getItemTotal = (item) => {
    const extrasPrice = item.selectedExtras.reduce((s, e) => s + e.price, 0);
    const bebidasPrice = item.selectedBebidas.reduce((s, b) => s + b.price, 0);
    return (item.product.price + extrasPrice + bebidasPrice) * item.quantity;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-zinc-950 border-l border-red-900/30 text-white w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            Tu Pedido
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
            <ShoppingBag className="w-16 h-16 opacity-30" />
            <p className="text-lg">Tu carrito está vacío</p>
            <p className="text-sm">Agrega algo delicioso del menú</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="mb-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                        {item.selectedExtras.length > 0 && (
                          <p className="text-[11px] text-gray-400 truncate">
                            + {item.selectedExtras.map((e) => e.name).join(", ")}
                          </p>
                        )}
                        {item.selectedBebidas.length > 0 && (
                          <p className="text-[11px] text-gray-400 truncate">
                            + {item.selectedBebidas.map((b) => b.name).join(", ")}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center hover:border-red-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-red-400 font-bold text-sm">
                            S/{getItemTotal(item).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-gray-500 hover:text-red-500 transition-colors self-start mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Separator className="mt-4 bg-zinc-800" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-zinc-800 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <Sandwich className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Total de Pedido</p>
                  <p className="text-xl font-bold text-red-400">S/{totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-base"
                onClick={() => {
                  const message = items
                    .map(
                      (item) =>
                        `${item.quantity}x ${item.product.name} - S/${getItemTotal(item).toFixed(2)}`
                    )
                    .join("\n");
                  const text = `🥪 *Nuevo Pedido - Sanguchería Mary*\n\n${message}\n\n*Total: S/${totalPrice.toFixed(2)}*`;
                  window.open(
                    `https://wa.me/${restaurantInfo.phone.replace("+", "")}?text=${encodeURIComponent(text)}`,
                    "_blank"
                  );
                }}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Realizar Pedido
              </Button>

              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-red-400 hover:bg-red-600/10"
                onClick={clearCart}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
