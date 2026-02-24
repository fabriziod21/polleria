import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, TrendingUp, Package, ChevronRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminTheme } from "@/context/AdminThemeContext";

export default function DashboardPage() {
  const {
    todayOrders, todaySales, averageTicket, productsSoldToday,
    salesLast7Days, ordersByCategory, orders,
  } = useAdminData();
  const { isDark } = useAdminTheme();

  const chartTooltipStyle = {
    backgroundColor: isDark ? "#18181b" : "#ffffff",
    border: `1px solid ${isDark ? "#3f3f46" : "#e5e7eb"}`,
    borderRadius: "12px",
    color: isDark ? "#fff" : "#18181b",
    fontSize: "12px",
    padding: "8px 12px",
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.1)",
  };

  const gridColor = isDark ? "#27272a" : "#f3f4f6";
  const axisColor = isDark ? "#52525b" : "#9ca3af";
  const lineColor = isDark ? "#a1a1aa" : "#71717a";
  const barColor = isDark ? "#71717a" : "#a1a1aa";
  const dotFill = isDark ? "#18181b" : "#ffffff";

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Ventas Últimos 7 Días</h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesLast7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`S/${v.toFixed(2)}`, "Ventas"]} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={lineColor}
                  strokeWidth={2.5}
                  dot={{ fill: lineColor, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: lineColor, strokeWidth: 2, fill: dotFill }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Pedidos por Categoría</h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={45} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill={barColor} radius={[6, 6, 0, 0]} name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl">
        <div className="flex items-center justify-between p-4 md:p-5 pb-0 md:pb-0">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Últimos Pedidos</h3>
          <Link to="/admin/pedidos" className="text-gray-400 text-xs font-medium hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            Ver todos <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-4 md:p-5 space-y-1">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{order.id}</span>
                  <OrderStatusBadge status={order.estado} />
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                </p>
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white ml-3 tabular-nums">
                S/{order.total.toFixed(2)}
              </span>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-600 text-sm py-6">No hay pedidos aún</p>
          )}
        </div>
      </div>
    </div>
  );
}
