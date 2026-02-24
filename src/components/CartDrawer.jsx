import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, ShoppingBag, Pencil, Truck, Store, UtensilsCrossed, MapPin, MessageSquare } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { restaurantInfo, salsas } from "@/data/menu";

const orderTypes = [
  { value: "delivery", label: "Delivery", icon: Truck },
  { value: "pickup", label: "Recoger", icon: Store },
  { value: "dinein", label: "En salon", icon: UtensilsCrossed },
];

const tipoLabels = {
  delivery: "Delivery (envio a domicilio)",
  pickup: "Recoger en tienda",
  dinein: "Comer en salon",
};

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart, setEditingItem } = useCart();
  const [tipoPedido, setTipoPedido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  const handleDelete = useCallback((key) => {
    if (confirmingDelete === key) {
      removeItem(key);
      setConfirmingDelete(null);
    } else {
      setConfirmingDelete(key);
      setTimeout(() => setConfirmingDelete((prev) => prev === key ? null : prev), 3000);
    }
  }, [confirmingDelete, removeItem]);

  const getItemTotal = (item) => {
    const extrasPrice = item.selectedExtras.reduce((s, e) => s + e.price, 0);
    const bebidasPrice = item.selectedBebidas.reduce((s, b) => s + b.price, 0);
    return (item.product.price + extrasPrice + bebidasPrice) * item.quantity;
  };

  const handleSendOrder = () => {
    const productLines = items
      .map((item) => {
        let line = `- ${item.quantity}x ${item.product.name} - S/${getItemTotal(item).toFixed(2)}`;
        if (item.selectedSalsas.length > 0) {
          const salsaNames = item.selectedSalsas
            .map((id) => salsas.find((s) => s.id === id)?.name || id)
            .join(", ");
          line += `\n  Salsas: ${salsaNames}`;
        }
        if (item.selectedExtras.length > 0) {
          line += `\n  Extras: ${item.selectedExtras.map((e) => e.name).join(", ")}`;
        }
        if (item.selectedBebidas.length > 0) {
          line += `\n  Bebidas: ${item.selectedBebidas.map((b) => b.name).join(", ")}`;
        }
        return line;
      })
      .join("\n");

    let message = `🥪 *Nuevo Pedido - Sanguchería Mary*\n\n`;
    message += `📋 *Tipo:* ${tipoLabels[tipoPedido]}\n`;
    if (tipoPedido === "delivery" && direccion.trim()) {
      message += `📍 *Dirección:* ${direccion.trim()}\n`;
    }
    if (comentarios.trim()) {
      message += `💬 *Nota:* ${comentarios.trim()}\n`;
    }
    message += `\n🛒 *Productos:*\n${productLines}\n\n`;
    message += `💰 *Total: S/${totalPrice.toFixed(2)}*`;

    window.open(
      `https://wa.me/${restaurantInfo.phone.replace("+", "")}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleClearCart = () => {
    clearCart();
    setTipoPedido("");
    setDireccion("");
    setComentarios("");
  };

  const canSend = tipoPedido && (tipoPedido !== "delivery" || direccion.trim());

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
            <p className="text-lg">Tu carrito esta vacio</p>
            <p className="text-sm">Agrega algo delicioso del menu</p>
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
                        {item.selectedSalsas.length > 0 && (
                          <p className="text-[11px] text-gray-400 truncate">
                            Salsas: {item.selectedSalsas.map((id) => salsas.find((s) => s.id === id)?.name || id).join(", ")}
                          </p>
                        )}
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
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-600 transition-all text-xs"
                      >
                        <Pencil className="w-3 h-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs ${
                          confirmingDelete === item.key
                            ? "border-red-500 bg-red-600/20 text-red-400"
                            : "border-zinc-800 text-gray-400 hover:text-red-400 hover:border-red-500/30"
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                        {confirmingDelete === item.key ? "Confirmar" : "Eliminar"}
                      </button>
                    </div>
                    <Separator className="mt-4 bg-zinc-800" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            {/* Footer - Checkout */}
            <div className="border-t border-zinc-800 p-4 space-y-3 overflow-y-auto max-h-[55vh]">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Total</span>
                <span className="text-xl font-bold text-red-400">S/{totalPrice.toFixed(2)}</span>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Tipo de Pedido */}
              <div className="space-y-2">
                <Label className="text-white text-xs font-semibold uppercase tracking-wide">
                  Tipo de pedido *
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {orderTypes.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTipoPedido(option.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                        tipoPedido === option.value
                          ? "border-red-500 bg-red-600/10 text-red-400"
                          : "border-zinc-800 text-gray-400 hover:border-zinc-700"
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direccion - Solo para delivery */}
              <AnimatePresence>
                {tipoPedido === "delivery" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-1">
                      <Label className="text-white text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Direccion de entrega *
                      </Label>
                      <Input
                        placeholder="Ej: Av. La Merced 456, Carhuaz"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600 focus:border-red-500/50"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comentarios */}
              <div className="space-y-2">
                <Label className="text-white text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Comentarios (opcional)
                </Label>
                <Textarea
                  placeholder="Instrucciones especiales, sin cebolla, etc."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  rows={2}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600 focus:border-red-500/50 resize-none min-h-15"
                />
              </div>

              {/* Enviar Pedido */}
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canSend}
                onClick={handleSendOrder}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Enviar Pedido por WhatsApp
              </Button>

              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-red-400 hover:bg-red-600/10"
                onClick={handleClearCart}
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
