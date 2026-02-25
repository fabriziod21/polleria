import { useState, useMemo, useRef, useEffect } from "react";
import { Plus, Minus, Trash2, Search, UserPlus, ShoppingCart, UtensilsCrossed, X, CheckCircle2, AlertCircle, Pencil, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useMenu } from "@/context/MenuContext";
import { crearPedido } from "@/lib/database";

// ─── Buscador de clientes con dropdown ───
function ClientSearch({ clients, selectedClient, onSelect, onNewClient }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.dni.includes(q)
    ).slice(0, 5);
  }, [clients, query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (selectedClient) {
    return (
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 rounded-xl p-2.5">
        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
            {selectedClient.name.charAt(0)}{selectedClient.lastName?.charAt(0) || ""}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{selectedClient.name} {selectedClient.lastName}</p>
          <p className="text-[10px] text-gray-500">{selectedClient.dni ? `DNI: ${selectedClient.dni}` : selectedClient.phone || "Sin DNI"}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-zinc-900 dark:hover:text-white" onClick={() => onSelect(null)}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <Input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => query.trim() && setOpen(true)}
        placeholder="Buscar cliente por nombre o DNI..."
        className="pl-9 bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm"
      />
      {open && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
          {results.length > 0 ? (
            results.map((c) => (
              <button
                key={c.id}
                onClick={() => { onSelect(c); setQuery(""); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{c.name.charAt(0)}{c.lastName?.charAt(0) || ""}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-zinc-900 dark:text-white truncate">{c.name} {c.lastName}</p>
                  <p className="text-[10px] text-gray-500">{c.dni ? `DNI: ${c.dni}` : ""} {c.phone ? `· ${c.phone}` : ""}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-sm text-gray-500">Sin resultados</div>
          )}
          <button
            onClick={() => { onNewClient(); setQuery(""); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 border-t border-gray-200 dark:border-zinc-800 text-sm text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Crear nuevo cliente
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Dialog rápido para crear cliente desde el POS ───
function QuickClientDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", lastName: "", dni: "", phone: "" });

  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setForm({ name: "", lastName: "", dni: "", phone: "" });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-gray-500 dark:text-gray-400 text-xs">Nombre</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-500 dark:text-gray-400 text-xs">Apellido</Label>
              <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-gray-500 dark:text-gray-400 text-xs">DNI</Label>
              <Input value={form.dni} onChange={(e) => update("dni", e.target.value.replace(/[^0-9]/g, ""))} className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white" maxLength={8} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-500 dark:text-gray-400 text-xs">Teléfono</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^0-9+\s-]/g, ""))} className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white" type="tel" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-500 dark:text-gray-400">Cancelar</Button>
            <Button type="submit" className="flex-1 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold">Crear</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Página POS ───
export default function POSPage() {
  const { products, clients, addClient, refreshOrders } = useAdminData();
  const { adminUser } = useAdminAuth();
  const { categorias, salsas, extras, bebidas } = useMenu();
  const auditUser = adminUser ? `${adminUser.nombre || ""} ${adminUser.apellido || ""}`.trim() || adminUser.email : null;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [cart, setCart] = useState([]);
  const [tipoPedido, setTipoPedido] = useState("local");
  const [direccion, setDireccion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [quickClientOpen, setQuickClientOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const activeProducts = useMemo(
    () => products.filter((p) => p.active !== false && p.visible !== false),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = activeProducts;
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categoryId === selectedCategory);
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeProducts, selectedCategory, productSearch]);

  const getCategoryName = (id) => categorias.find((c) => c.id === id)?.name || id;

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(() => Math.round((total / 1.18) * 100) / 100, [total]);
  const igv = useMemo(() => Math.round((total - subtotal) * 100) / 100, [total, subtotal]);
  const descuentoTotal = useMemo(
    () => cart.reduce((sum, item) => {
      const desc = (item.originalPrice - item.unitPrice) * item.quantity;
      return sum + Math.max(desc, 0);
    }, 0),
    [cart]
  );

  const [editingPrice, setEditingPrice] = useState(null);
  const [editPriceValue, setEditPriceValue] = useState("");

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        originalPrice: product.price,
        unitPrice: product.price,
        quantity: 1,
        salsas: [],
        extras: [],
        bebidas: [],
      }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const startEditPrice = (item) => {
    setEditingPrice(item.productId);
    setEditPriceValue(item.unitPrice.toFixed(2));
  };

  const confirmEditPrice = (productId) => {
    const newPrice = parseFloat(editPriceValue);
    if (!isNaN(newPrice) && newPrice >= 0) {
      setCart((prev) =>
        prev.map((i) => i.productId === productId ? { ...i, unitPrice: Math.round(newPrice * 100) / 100 } : i)
      );
    }
    setEditingPrice(null);
  };

  const handleQuickClientSave = async (data) => {
    const created = await addClient(data);
    setSelectedClient(created);
  };

  const handleGenerateOrder = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    try {
      const pedidoId = `ORD-${Date.now()}`;
      const pedido = {
        id: pedidoId,
        tipo_pedido: tipoPedido,
        usuario_id: selectedClient?.id || null,
        telefono: selectedClient?.phone || null,
        direccion: tipoPedido === "delivery" ? direccion.trim() : null,
        comentarios: comentarios.trim() || null,
        total,
      };
      const items = cart.map((item) => ({
        producto_id: item.productId,
        nombre_producto: item.name,
        cantidad: item.quantity,
        precio_unitario: item.unitPrice,
        precio_original: item.originalPrice,
        salsas_seleccionadas: item.salsas || [],
        extras_seleccionados: item.extras || [],
        bebidas_seleccionadas: item.bebidas || [],
      }));

      await crearPedido(pedido, items, auditUser);
      await refreshOrders();

      const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
      setOrderResult({
        success: true,
        orderId: pedidoId,
        total,
        subtotal,
        igv,
        descuentoTotal,
        clientName: selectedClient ? `${selectedClient.name} ${selectedClient.lastName}`.trim() : null,
        itemCount,
      });

      // Reset
      setCart([]);
      setSelectedClient(null);
      setDireccion("");
      setComentarios("");
      setTipoPedido("local");
    } catch (err) {
      console.error("Error generando pedido:", err);
      setOrderResult({ success: false, error: err.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-5rem)]">
      {/* Columna izquierda: Catálogo */}
      <div className="flex-1 space-y-4">
        {/* Search + Category filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="pl-9 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white"
                  : "bg-white dark:bg-zinc-900 text-gray-500 hover:text-zinc-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800/60"
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white"
                    : "bg-white dark:bg-zinc-900 text-gray-500 hover:text-zinc-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800/60"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <UtensilsCrossed className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">Sin productos</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredProducts.map((product) => {
              const inCart = cart.find((i) => i.productId === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group w-full flex items-center gap-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-xl p-2.5 hover:border-gray-300 dark:hover:border-zinc-700/60 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-gray-300 dark:text-zinc-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{getCategoryName(product.categoryId)}</p>
                  </div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums flex-shrink-0">S/{product.price.toFixed(2)}</span>
                  {inCart && (
                    <div className="w-6 h-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {inCart.quantity}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Columna derecha: Carrito / Nota de venta */}
      <div className="lg:w-96 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800/60">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-gray-400" />
            Nota de Venta
          </h3>

          {/* Client search */}
          <ClientSearch
            clients={clients}
            selectedClient={selectedClient}
            onSelect={setSelectedClient}
            onNewClient={() => setQuickClientOpen(true)}
          />
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-600">
              <ShoppingCart className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs">Agrega productos al carrito</p>
            </div>
          ) : (
            cart.map((item) => {
              const hasDiscount = item.unitPrice < item.originalPrice;
              return (
                <div key={item.productId} className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900 dark:text-white truncate">{item.name}</p>
                      <div className="flex items-center gap-1.5">
                        {editingPrice === item.productId ? (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs text-gray-500">S/</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editPriceValue}
                              onChange={(e) => setEditPriceValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") confirmEditPrice(item.productId);
                                if (e.key === "Escape") setEditingPrice(null);
                              }}
                              onBlur={() => confirmEditPrice(item.productId)}
                              autoFocus
                              className="w-16 h-5 text-xs bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded px-1 text-zinc-900 dark:text-white tabular-nums"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditPrice(item)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors mt-0.5 group"
                          >
                            {hasDiscount && (
                              <span className="line-through text-gray-400">S/{item.originalPrice.toFixed(2)}</span>
                            )}
                            <span className={hasDiscount ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                              S/{item.unitPrice.toFixed(2)} c/u
                            </span>
                            <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg"
                        onClick={() => updateQuantity(item.productId, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-bold text-zinc-900 dark:text-white w-6 text-center tabular-nums">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg"
                        onClick={() => updateQuantity(item.productId, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white tabular-nums w-16 text-right">
                        S/{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-600/10 rounded-lg"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {hasDiscount && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        Descuento: -S/{((item.originalPrice - item.unitPrice) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer: tipo, dirección, total, botón */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800/60 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-gray-500 text-[10px] uppercase">Tipo pedido</Label>
              <Select value={tipoPedido} onValueChange={setTipoPedido}>
                <SelectTrigger className="h-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                  <SelectItem value="local" className="text-zinc-900 dark:text-white text-xs">Local</SelectItem>
                  <SelectItem value="delivery" className="text-zinc-900 dark:text-white text-xs">Delivery</SelectItem>
                  <SelectItem value="pickup" className="text-zinc-900 dark:text-white text-xs">Recojo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {tipoPedido === "delivery" && (
              <div className="space-y-1">
                <Label className="text-gray-500 text-[10px] uppercase">Dirección</Label>
                <Input
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="h-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs"
                  placeholder="Dirección de entrega"
                />
              </div>
            )}
          </div>

          <Input
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs"
            placeholder="Comentarios (opcional)"
          />

          {/* Desglose IGV */}
          <div className="space-y-1.5 py-2 border-t border-gray-200 dark:border-zinc-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Subtotal (sin IGV)</span>
              <span className="text-xs text-gray-600 dark:text-gray-300 tabular-nums">S/{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">IGV (18%)</span>
              <span className="text-xs text-gray-600 dark:text-gray-300 tabular-nums">S/{igv.toFixed(2)}</span>
            </div>
            {descuentoTotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-600 dark:text-amber-400">Descuento aplicado</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 tabular-nums">-S/{descuentoTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1.5 border-t border-gray-200 dark:border-zinc-800/60">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-zinc-900 dark:text-white tabular-nums">S/{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleGenerateOrder}
            disabled={cart.length === 0 || processing}
            className="w-full bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-bold rounded-xl h-11 disabled:opacity-50"
          >
            {processing ? "Procesando..." : "Generar Nota de Venta"}
          </Button>
        </div>
      </div>

      <QuickClientDialog
        open={quickClientOpen}
        onClose={() => setQuickClientOpen(false)}
        onSave={handleQuickClientSave}
      />

      {/* Resultado de nota de venta */}
      <Dialog open={!!orderResult} onOpenChange={(v) => !v && setOrderResult(null)}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-sm">
          {orderResult?.success ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Nota de Venta Generada</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">El pedido fue registrado exitosamente</p>
              <div className="w-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Pedido</span>
                  <span className="text-zinc-900 dark:text-white font-mono text-xs">{orderResult.orderId}</span>
                </div>
                {orderResult.clientName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Cliente</span>
                    <span className="text-zinc-900 dark:text-white">{orderResult.clientName}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Items</span>
                  <span className="text-zinc-900 dark:text-white">{orderResult.itemCount} producto{orderResult.itemCount !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-600 dark:text-gray-300">S/{orderResult.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">IGV (18%)</span>
                  <span className="text-gray-600 dark:text-gray-300">S/{orderResult.igv?.toFixed(2)}</span>
                </div>
                {orderResult.descuentoTotal > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-600 dark:text-amber-400">Descuento</span>
                    <span className="text-amber-600 dark:text-amber-400">-S/{orderResult.descuentoTotal?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-zinc-700">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Total</span>
                  <span className="text-zinc-900 dark:text-white font-bold text-base">S/{orderResult.total?.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={() => setOrderResult(null)}
                className="mt-5 w-full bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold rounded-xl"
              >
                Aceptar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Error</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No se pudo generar la nota de venta</p>
              <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2 w-full">{orderResult?.error}</p>
              <Button
                onClick={() => setOrderResult(null)}
                className="mt-5 w-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl"
              >
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
