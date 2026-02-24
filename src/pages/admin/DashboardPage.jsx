import { useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, TrendingUp, Package, ChevronRight, FolderOpen, Beef, CircleCheck, Circle, ChevronDown, Lightbulb, X } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminTheme } from "@/context/AdminThemeContext";
import { useMenu } from "@/context/MenuContext";

export default function DashboardPage() {
  const {
    todayOrders, todaySales, averageTicket, productsSoldToday,
    salesLast7Days, ordersByCategory, orders, products,
  } = useAdminData();
  const { isDark } = useAdminTheme();
  const { categorias, salsas, extras, bebidas } = useMenu();
  const [guideOpen, setGuideOpen] = useState(true);
  const [expandedStep, setExpandedStep] = useState(null);

  const hasCategorias = categorias.length > 0;
  const hasProducts = products.length > 0;
  const hasComplementos = salsas.length > 0 || extras.length > 0 || bebidas.length > 0;
  const hasOrders = orders.length > 0;

  const steps = [
    {
      num: 1,
      title: "Crea tus categorías",
      done: hasCategorias,
      to: "/admin/categorias",
      description: "Las categorías organizan tu menú. Por ejemplo: \"Pollos\", \"Combos\", \"Bebidas\". Es lo primero que debes crear.",
    },
    {
      num: 2,
      title: "Agrega tus productos",
      done: hasProducts,
      to: "/admin/productos",
      description: "Crea los productos de tu carta y asígnalos a una categoría. Agrega nombre, precio, imagen y descripción.",
    },
    {
      num: 3,
      title: "Configura complementos",
      done: hasComplementos,
      optional: true,
      to: "/admin/complementos",
      description: "Los complementos son extras que el cliente puede agregar a un producto: salsas, snacks, bebidas. Luego los asocias a cada producto.",
    },
    {
      num: 4,
      title: "Recibe tu primer pedido",
      done: hasOrders,
      to: "/admin/pedidos",
      description: "Cuando un cliente haga un pedido desde la tienda, aparecerá aquí. También puedes crear pedidos desde el Punto de Venta.",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;

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
  const lineColor = isDark ? "#f87171" : "#dc2626";
  const barColor = isDark ? "#f87171" : "#dc2626";
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

      {/* Guide */}
      {guideOpen && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-5 pb-0 md:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600/10 dark:bg-red-600/15 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Primeros pasos</h3>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">{completedCount} de {steps.length} completados</p>
              </div>
            </div>
            <button onClick={() => setGuideOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 md:px-5 pt-3">
            <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 dark:bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 md:p-5 space-y-1">
            {steps.map((step) => (
              <div key={step.num}>
                <button
                  onClick={() => setExpandedStep(expandedStep === step.num ? null : step.num)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    expandedStep === step.num ? "bg-gray-50 dark:bg-zinc-800/40" : "hover:bg-gray-50 dark:hover:bg-zinc-800/30"
                  }`}
                >
                  {step.done ? (
                    <CircleCheck className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-zinc-600 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-medium ${step.done ? "text-gray-400 dark:text-zinc-500 line-through" : "text-zinc-900 dark:text-white"}`}>
                        {step.title}
                      </span>
                      {step.optional && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 font-medium">Opcional</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expandedStep === step.num ? "rotate-180" : ""}`} />
                </button>

                {expandedStep === step.num && (
                  <div className="ml-11 mr-3 pb-2 pt-1">
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mb-2.5">{step.description}</p>
                    {!step.done && (
                      <Link
                        to={step.to}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        Ir a {step.title.toLowerCase().replace("crea tus ", "").replace("agrega tus ", "").replace("configura ", "").replace("recibe tu primer ", "")}
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
          <Link to="/admin/pedidos" className="text-red-600/70 dark:text-red-400/70 text-xs font-medium hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 transition-colors">
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
