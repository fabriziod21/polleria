import { useState, useMemo } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import StatCard from "@/components/admin/StatCard";
import FinanceEntryDialog from "@/components/admin/FinanceEntryDialog";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminTheme } from "@/context/AdminThemeContext";

const PIE_COLORS = ["#dc2626", "#2563eb", "#16a34a", "#eab308", "#8b5cf6", "#ec4899"];

export default function FinanzasPage() {
  const { finances, addFinanceEntry, deleteFinanceEntry, financeSummary } = useAdminData();
  const { isDark } = useAdminTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  const chartTooltipStyle = {
    backgroundColor: isDark ? "#18181b" : "#ffffff",
    border: `1px solid ${isDark ? "#3f3f46" : "#e5e7eb"}`,
    borderRadius: "12px",
    color: isDark ? "#fff" : "#18181b",
    fontSize: "12px",
    padding: "8px 12px",
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.1)",
  };

  const pieData = useMemo(() => {
    const grouped = {};
    finances.forEach((f) => {
      grouped[f.categoria] = (grouped[f.categoria] || 0) + f.monto;
    });
    return Object.entries(grouped).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value * 100) / 100,
    }));
  }, [finances]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Total Entradas" value={`S/${financeSummary.totalEntradas.toFixed(2)}`} icon={TrendingUp} />
        <StatCard title="Total Salidas" value={`S/${financeSummary.totalSalidas.toFixed(2)}`} icon={TrendingDown} />
        <StatCard
          title="Balance"
          value={`S/${financeSummary.balance.toFixed(2)}`}
          icon={DollarSign}
          description={financeSummary.balance >= 0 ? "Positivo" : "Negativo"}
        />
      </div>

      {/* Chart + Add */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Distribución por Categoría</h3>
          <div className="h-56 sm:h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => `S/${v.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                Sin datos
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <DollarSign className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">Registrar Movimiento</h3>
          <p className="text-gray-500 text-sm mb-5">Agrega entradas o salidas</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 rounded-xl font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Registro
          </Button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl">
        <div className="p-4 md:p-5 pb-0 md:pb-0">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Historial de Movimientos</h3>
        </div>

        {finances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
            <Calendar className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No hay movimientos registrados</p>
          </div>
        ) : (
          <div className="p-4 md:p-5 space-y-1">
            {finances.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                {/* Type indicator */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  entry.tipo === "entrada" ? "bg-green-500/15" : "bg-red-500/15"
                }`}>
                  {entry.tipo === "entrada" ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{entry.descripcion}</p>
                    <Badge className={`text-[10px] border ${
                      entry.tipo === "entrada"
                        ? "bg-green-500/15 text-green-400 border-green-500/20"
                        : "bg-red-500/15 text-red-400 border-red-500/20"
                    }`}>
                      {entry.tipo === "entrada" ? "Entrada" : "Salida"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDate(entry.fecha)}</span>
                    <span>·</span>
                    <span className="capitalize">{entry.categoria}</span>
                  </div>
                </div>

                {/* Amount + Delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-sm font-bold tabular-nums ${
                    entry.tipo === "entrada" ? "text-green-400" : "text-red-400"
                  }`}>
                    {entry.tipo === "entrada" ? "+" : "-"}S/{entry.monto.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-600/10 rounded-lg"
                    onClick={() => deleteFinanceEntry(entry.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FinanceEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={addFinanceEntry}
      />
    </div>
  );
}
