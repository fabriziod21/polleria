import { useState, useMemo, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Clock, MapPin, ShoppingBag, User, UserPlus } from "lucide-react";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useAdminData } from "@/context/AdminDataContext";

const statusTabs = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "preparando", label: "Preparando" },
  { value: "listo", label: "Listo" },
  { value: "entregado", label: "Entregado" },
];

const statusOptions = ["pendiente", "preparando", "listo", "entregado"];

// Mini buscador de cliente para asignar a un pedido
function ClientAssigner({ clients, orderId, onAssign }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return clients.slice(0, 5);
    const q = query.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.dni.includes(q)
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

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-gray-500 hover:text-zinc-900 dark:hover:text-white gap-1"
        onClick={() => setOpen(true)}
      >
        <UserPlus className="w-3 h-3" />
        Asignar cliente
      </Button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre o DNI..."
          className="h-7 w-40 bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs"
          autoFocus
        />
        <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-500" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
      {results.length > 0 && (
        <div className="absolute z-50 w-52 mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => { onAssign(orderId, c.id); setOpen(false); setQuery(""); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="text-xs text-zinc-900 dark:text-white">{c.name} {c.lastName}</span>
              {c.dni && <span className="text-[10px] text-gray-500">DNI: {c.dni}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PedidosPage() {
  const { orders, updateOrderStatus, clients, assignClientToOrder } = useAdminData();
  const [filter, setFilter] = useState("todos");

  const filtered = useMemo(
    () => (filter === "todos" ? orders : orders.filter((o) => o.estado === filter)),
    [orders, filter]
  );

  const getClientName = (clientId) => {
    if (!clientId) return null;
    const client = clients.find((c) => c.id === clientId);
    if (!client) return null;
    return `${client.name} ${client.lastName}`.trim();
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {statusTabs.map((tab) => {
          const count = tab.value === "todos" ? orders.length : orders.filter((o) => o.estado === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filter === tab.value
                  ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-gray-500 hover:text-zinc-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800/60"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === tab.value ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">No hay pedidos con este estado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => {
            const clientName = getClientName(order.clientId);
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-4 hover:border-gray-300 dark:hover:border-zinc-700/60 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{order.id}</span>
                      <OrderStatusBadge status={order.estado} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(order.fecha)}
                      </span>
                      {clientName && (
                        <span className="text-xs text-zinc-900 dark:text-white flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          {clientName}
                        </span>
                      )}
                      {order.telefono && (
                        <a href={`tel:${order.telefono}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                          <Phone className="w-3 h-3" />
                          {order.telefono}
                        </a>
                      )}
                      {order.direccion && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[200px]">{order.direccion}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-base font-bold text-zinc-900 dark:text-white tabular-nums whitespace-nowrap">
                    S/{order.total.toFixed(2)}
                  </span>
                </div>

                {/* Items */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(" · ")}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    {!order.clientId && (
                      <ClientAssigner
                        clients={clients}
                        orderId={order.id}
                        onAssign={assignClientToOrder}
                      />
                    )}
                  </div>
                  <Select
                    value={order.estado}
                    onValueChange={(val) => updateOrderStatus(order.id, val)}
                  >
                    <SelectTrigger className="w-36 h-8 bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s} className="text-zinc-900 dark:text-white text-xs capitalize">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
