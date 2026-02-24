import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, TrendingUp, Package, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useAdminData } from "@/context/AdminDataContext";

const chartTooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "12px",
};

export default function DashboardPage() {
  const {
    todayOrders, todaySales, averageTicket, productsSoldToday,
    salesLast7Days, ordersByCategory, orders,
  } = useAdminData();

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas Hoy"
          value={`S/${todaySales.toFixed(2)}`}
          icon={DollarSign}
          description={`${todayOrders.length} pedidos`}
        />
        <StatCard
          title="Pedidos Hoy"
          value={todayOrders.length}
          icon={ShoppingCart}
        />
        <StatCard
          title="Ticket Promedio"
          value={`S/${averageTicket.toFixed(2)}`}
          icon={TrendingUp}
        />
        <StatCard
          title="Productos Vendidos"
          value={productsSoldToday}
          icon={Package}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Line Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Ventas Últimos 7 Días</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesLast7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`S/${v.toFixed(2)}`, "Ventas"]} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ fill: "#dc2626", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Category Bar Chart */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Pedidos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} angle={-20} textAnchor="end" height={50} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-400">Últimos Pedidos</CardTitle>
          <Link to="/admin/pedidos" className="text-red-400 text-xs hover:text-red-300 flex items-center gap-1">
            Ver todos <ChevronRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{order.id}</span>
                    <OrderStatusBadge status={order.estado} />
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </p>
                </div>
                <span className="text-sm font-bold text-red-400 ml-3">
                  S/{order.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
