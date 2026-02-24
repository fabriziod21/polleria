import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { subirImagen } from "@/lib/database";

const emptyCategory = {
  id: "",
  name: "",
  description: "",
  image: "",
  sortOrder: 0,
};

export default function CategoryFormDialog({ open, onClose, category, onSave }) {
  const [form, setForm] = useState(emptyCategory);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({ ...category, sortOrder: category.sortOrder ?? 0 });
    } else {
      setForm(emptyCategory);
    }
  }, [category, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
      sortOrder: parseInt(form.sortOrder) || 0,
    });
    onClose();
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await subirImagen(file);
      update("image", url);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      alert("Error subiendo imagen: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!category && (
            <div className="space-y-2">
              <Label className="text-gray-400">ID (slug)</Label>
              <Input
                value={form.id}
                onChange={(e) => update("id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="ej: sanguchos, hamburguesas"
              />
              <p className="text-xs text-gray-500">Se genera automáticamente si lo dejás vacío</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-400">Nombre</Label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Orden</Label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) => update("sortOrder", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white w-24"
            />
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <Label className="text-gray-400">Imagen</Label>
            <div className="flex gap-2">
              <Input
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white flex-1"
                placeholder="URL o sube una imagen"
              />
              <label
                className={`inline-flex items-center justify-center rounded-md border border-zinc-700 px-3 h-9 cursor-pointer transition-colors ${
                  uploading ? "opacity-50 cursor-wait" : "text-gray-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {form.image && (
              <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-zinc-800">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-400 hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading} className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
              {category ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
