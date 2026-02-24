import { useState, useMemo } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import StatCard from "@/components/admin/StatCard";
import FinanceEntryDialog from "@/components/admin/FinanceEntryDialog";
import { useAdminData } from "@/context/AdminDataContext";

const PIE_COLORS = ["#dc2626", "#2563eb", "#16a34a", "#eab308"];

const chartTooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "12px",
};

export default function FinanzasPage() {
  const { finances, addFinanceEntry, deleteFinanceEntry, financeSummary } = useAdminData();
  const [dialogOpen, setDialogOpen] = useState(false);

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
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Entradas"
          value={`S/${financeSummary.totalEntradas.toFixed(2)}`}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Salidas"
          value={`S/${financeSummary.totalSalidas.toFixed(2)}`}
          icon={TrendingDown}
        />
        <StatCard
          title="Balance"
          value={`S/${financeSummary.balance.toFixed(2)}`}
          icon={DollarSign}
          description={financeSummary.balance >= 0 ? "Positivo" : "Negativo"}
        />
      </div>

      {/* Chart + Add Button */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={11}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => `S/${v.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 flex flex-col items-center justify-center p-8 text-center">
          <DollarSign className="w-12 h-12 text-red-500/30 mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Registrar Movimiento</h3>
          <p className="text-gray-500 text-sm mb-4">Agrega entradas (ventas) o salidas (gastos)</p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Registro
          </Button>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-400">Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-gray-500">Fecha</TableHead>
                  <TableHead className="text-gray-500">Tipo</TableHead>
                  <TableHead className="text-gray-500">Categoría</TableHead>
                  <TableHead className="text-gray-500">Descripción</TableHead>
                  <TableHead className="text-gray-500 text-right">Monto</TableHead>
                  <TableHead className="text-gray-500 w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {finances.map((entry) => (
                  <TableRow key={entry.id} className="border-zinc-800">
                    <TableCell className="text-sm text-gray-400">{formatDate(entry.fecha)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          entry.tipo === "entrada"
                            ? "bg-green-500/20 text-green-400 border-green-500/30 border text-[11px]"
                            : "bg-red-500/20 text-red-400 border-red-500/30 border text-[11px]"
                        }
                      >
                        {entry.tipo === "entrada" ? "Entrada" : "Salida"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-400 capitalize">{entry.categoria}</TableCell>
                    <TableCell className="text-sm text-white">{entry.descripcion}</TableCell>
                    <TableCell
                      className={`text-right font-bold text-sm ${
                        entry.tipo === "entrada" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {entry.tipo === "entrada" ? "+" : "-"}S/{entry.monto.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-600/10"
                        onClick={() => deleteFinanceEntry(entry.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="md:hidden p-3 space-y-3">
            {finances.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge
                      className={
                        entry.tipo === "entrada"
                          ? "bg-green-500/20 text-green-400 border-green-500/30 border text-[10px]"
                          : "bg-red-500/20 text-red-400 border-red-500/30 border text-[10px]"
                      }
                    >
                      {entry.tipo === "entrada" ? "Entrada" : "Salida"}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatDate(entry.fecha)}</span>
                  </div>
                  <p className="text-sm text-white truncate">{entry.descripcion}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span
                    className={`text-sm font-bold ${
                      entry.tipo === "entrada" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {entry.tipo === "entrada" ? "+" : "-"}S/{entry.monto.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-600 hover:text-red-400"
                    onClick={() => deleteFinanceEntry(entry.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <FinanceEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={addFinanceEntry}
      />
    </div>
  );
}
