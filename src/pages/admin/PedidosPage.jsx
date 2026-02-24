import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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

export default function PedidosPage() {
  const { orders, updateOrderStatus } = useAdminData();
  const [filter, setFilter] = useState("todos");

  const filtered = useMemo(
    () => (filter === "todos" ? orders : orders.filter((o) => o.estado === filter)),
    [orders, filter]
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-zinc-900 border border-zinc-800">
          {statusTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Desktop Table */}
      <Card className="bg-zinc-900 border-zinc-800 hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-gray-500">ID</TableHead>
                <TableHead className="text-gray-500">Fecha</TableHead>
                <TableHead className="text-gray-500">Items</TableHead>
                <TableHead className="text-gray-500 text-right">Total</TableHead>
                <TableHead className="text-gray-500">Estado</TableHead>
                <TableHead className="text-gray-500">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id} className="border-zinc-800">
                  <TableCell className="font-medium text-white text-sm">{order.id}</TableCell>
                  <TableCell className="text-gray-400 text-sm">{formatDate(order.fecha)}</TableCell>
                  <TableCell className="text-gray-400 text-sm max-w-[200px] truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-400 text-sm">
                    S/{order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.estado} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.estado}
                      onValueChange={(val) => updateOrderStatus(order.id, val)}
                    >
                      <SelectTrigger className="w-32 h-8 bg-zinc-800 border-zinc-700 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s} className="text-white text-xs capitalize">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((order) => (
          <Card key={order.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{order.id}</span>
                <OrderStatusBadge status={order.estado} />
              </div>
              <p className="text-xs text-gray-500">{formatDate(order.fecha)}</p>
              <p className="text-sm text-gray-400">
                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="font-bold text-red-400">S/{order.total.toFixed(2)}</span>
                <Select
                  value={order.estado}
                  onValueChange={(val) => updateOrderStatus(order.id, val)}
                >
                  <SelectTrigger className="w-32 h-8 bg-zinc-800 border-zinc-700 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s} className="text-white text-xs capitalize">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">No hay pedidos con este estado</div>
      )}
    </div>
  );
}
