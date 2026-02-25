import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FinanceEntryDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    fecha: new Date().toLocaleDateString("en-CA", { timeZone: "America/Lima" }),
    tipo: "entrada",
    categoria: "ventas",
    descripcion: "",
    monto: "",
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      monto: parseFloat(form.monto) || 0,
    });
    setForm({
      fecha: new Date().toLocaleDateString("en-CA", { timeZone: "America/Lima" }),
      tipo: "entrada",
      categoria: "ventas",
      descripcion: "",
      monto: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Registro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">Fecha</Label>
              <Input
                type="date"
                value={form.fecha}
                onChange={(e) => update("fecha", e.target.value)}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => update("tipo", v)}>
                <SelectTrigger className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                  <SelectItem value="entrada" className="text-zinc-900 dark:text-white">Entrada</SelectItem>
                  <SelectItem value="salida" className="text-zinc-900 dark:text-white">Salida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Categoría</Label>
            <Select value={form.categoria} onValueChange={(v) => update("categoria", v)}>
              <SelectTrigger className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                <SelectItem value="ventas" className="text-zinc-900 dark:text-white">Ventas</SelectItem>
                <SelectItem value="compras" className="text-zinc-900 dark:text-white">Compras</SelectItem>
                <SelectItem value="servicios" className="text-zinc-900 dark:text-white">Servicios</SelectItem>
                <SelectItem value="otros" className="text-zinc-900 dark:text-white">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={(e) => update("descripcion", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              placeholder="Detalle del registro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Monto (S/)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.monto}
              onChange={(e) => update("monto", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold">
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
