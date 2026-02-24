import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, ShoppingCart, Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { useCart } from "@/context/CartContext";

export default function ProductModal({ product, open, onClose, editingCartItem, onEditDone }) {
  const { addItem, updateItem } = useCart();
  const { salsas, extras, bebidas } = useMenu();
  const isEditing = !!editingCartItem;
  const [quantity, setQuantity] = useState(1);
  const [selectedSalsas, setSelectedSalsas] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedBebidas, setSelectedBebidas] = useState([]);
  const [showSalsas, setShowSalsas] = useState(true);
  const [showExtras, setShowExtras] = useState(true);
  const [showBebidas, setShowBebidas] = useState(true);

  // Pre-populate when editing
  useEffect(() => {
    if (editingCartItem && open) {
      setQuantity(editingCartItem.quantity);
      setSelectedSalsas(editingCartItem.selectedSalsas || []);
      setSelectedExtras(editingCartItem.selectedExtras || []);
      setSelectedBebidas(editingCartItem.selectedBebidas || []);
    }
  }, [editingCartItem, open]);

  const extrasTotal = useMemo(
    () => selectedExtras.reduce((sum, e) => sum + e.price, 0),
    [selectedExtras]
  );
  const bebidasTotal = useMemo(
    () => selectedBebidas.reduce((sum, b) => sum + b.price, 0),
    [selectedBebidas]
  );
  const unitPrice = product ? product.price + extrasTotal + bebidasTotal : 0;
  const totalPrice = unitPrice * quantity;

  const toggleSalsa = (id) => {
    setSelectedSalsas((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const toggleBebida = (bebida) => {
    setSelectedBebidas((prev) =>
      prev.find((b) => b.id === bebida.id)
        ? prev.filter((b) => b.id !== bebida.id)
        : [...prev, bebida]
    );
  };

  const handleAdd = () => {
    if (!product) return;
    if (isEditing) {
      updateItem(editingCartItem.key, product, quantity, selectedSalsas, selectedExtras, selectedBebidas);
      onEditDone?.();
    } else {
      addItem(product, quantity, selectedSalsas, selectedExtras, selectedBebidas);
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setQuantity(1);
    setSelectedSalsas([]);
    setSelectedExtras([]);
    setSelectedBebidas([]);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white p-0 max-w-lg w-[95vw] max-h-[90vh] overflow-hidden flex flex-col rounded-2xl">
        {/* Hero Image */}
        <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          <button
            onClick={resetAndClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-5 pb-4 space-y-4">
            <DialogTitle className="sr-only">{product.name}</DialogTitle>
            {/* Title & Price */}
            <div>
              <Badge className="bg-red-600 text-white border-0 mb-2">
                S/{product.price.toFixed(2)}
              </Badge>
              <h2 className="text-2xl font-black">{product.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{product.description}</p>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Salsas */}
            {product.hasSalsas && (
              <div>
                <button
                  onClick={() => setShowSalsas(!showSalsas)}
                  className="flex items-center justify-between w-full"
                >
                  <div>
                    <h3 className="font-bold text-base">Elige Tus Salsas</h3>
                    <p className="text-xs text-gray-500">Selecciona entre 1-3 opciones</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-gray-400 border-zinc-700 text-[10px]">
                      Obligatorio
                    </Badge>
                    {showSalsas ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {showSalsas && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2">
                        {salsas.map((salsa) => {
                          const selected = selectedSalsas.includes(salsa.id);
                          return (
                            <button
                              key={salsa.id}
                              onClick={() => toggleSalsa(salsa.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                selected
                                  ? "border-red-500 bg-red-600/10"
                                  : "border-zinc-800 hover:border-zinc-700"
                              }`}
                            >
                              <img
                                src={salsa.image}
                                alt={salsa.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <span className="flex-1 text-left text-sm font-medium">{salsa.name}</span>
                              {selected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                              {!selected && (
                                <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center">
                                  <Plus className="w-3 h-3 text-zinc-600" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator className="bg-zinc-800 mt-4" />
              </div>
            )}

            {/* Bebidas (acompañamiento) */}
            {product.hasBebidas && (
              <div>
                <button
                  onClick={() => setShowBebidas(!showBebidas)}
                  className="flex items-center justify-between w-full"
                >
                  <div>
                    <h3 className="font-bold text-base">Acompaña Tu Orden con</h3>
                    <p className="text-xs text-gray-500">Selecciona máximo 15 opciones</p>
                  </div>
                  {showBebidas ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {showBebidas && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2">
                        {bebidas.map((bebida) => {
                          const selected = selectedBebidas.find((b) => b.id === bebida.id);
                          return (
                            <button
                              key={bebida.id}
                              onClick={() => toggleBebida(bebida)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                selected
                                  ? "border-red-500 bg-red-600/10"
                                  : "border-zinc-800 hover:border-zinc-700"
                              }`}
                            >
                              <div className="text-left">
                                <p className="text-sm font-medium">{bebida.name}</p>
                                <p className="text-xs text-red-400 font-semibold">+ S/{bebida.price.toFixed(2)}</p>
                              </div>
                              {selected ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center">
                                  <Plus className="w-3 h-3 text-zinc-600" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator className="bg-zinc-800 mt-4" />
              </div>
            )}

            {/* Extras */}
            {product.hasExtras && (
              <div>
                <button
                  onClick={() => setShowExtras(!showExtras)}
                  className="flex items-center justify-between w-full"
                >
                  <div>
                    <h3 className="font-bold text-base">¿Quieres Agregar Un Extra con Costo?</h3>
                  </div>
                  {showExtras ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {showExtras && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2">
                        {extras.map((extra) => {
                          const selected = selectedExtras.find((e) => e.id === extra.id);
                          return (
                            <button
                              key={extra.id}
                              onClick={() => toggleExtra(extra)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                selected
                                  ? "border-red-500 bg-red-600/10"
                                  : "border-zinc-800 hover:border-zinc-700"
                              }`}
                            >
                              <img
                                src={extra.image}
                                alt={extra.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium">{extra.name}</p>
                                <p className="text-xs text-red-400 font-semibold">+ S/{extra.price.toFixed(2)}</p>
                              </div>
                              {selected ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center"
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center">
                                  <Plus className="w-3 h-3 text-zinc-600" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer - Quantity + Add to Cart */}
        <div className="border-t border-zinc-800 p-4 flex items-center gap-3 flex-shrink-0 bg-zinc-950">
          <div className="flex items-center gap-3 border border-zinc-700 rounded-full px-3 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full border border-zinc-600 flex items-center justify-center hover:border-red-500 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <Button
            onClick={handleAdd}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-6"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isEditing ? "Actualizar" : "Agregar"} S/{totalPrice.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
