import { useState } from "react";
import { Plus, Pencil, Trash2, Upload, UtensilsCrossed, Coffee, Flame, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMenu } from "@/context/MenuContext";
import { useAdminData } from "@/context/AdminDataContext";
import { subirImagen } from "@/lib/database";

// ─── Form genérico para Salsa / Extra / Bebida ───
function ComplementoForm({ open, onClose, item, onSave, type }) {
  const [form, setForm] = useState({ id: "", nombre: "", precio: "", imagen: "" });
  const [uploading, setUploading] = useState(false);

  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (item) {
        setForm({
          id: item.id,
          nombre: item.name,
          precio: item.price ? String(item.price) : "",
          imagen: item.image || "",
        });
      } else {
        setForm({ id: "", nombre: "", precio: "", imagen: "" });
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: form.id || form.nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
      nombre: form.nombre,
      imagen: form.imagen || null,
    };
    if (type !== "salsa") {
      data.precio = parseFloat(form.precio) || 0;
    }
    onSave(data);
    onClose();
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await subirImagen(file);
      update("imagen", url);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      alert("Error subiendo imagen: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const titles = { salsa: "Salsa", extra: "Extra", bebida: "Bebida" };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Editar" : "Nueva"} {titles[type]}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!item && (
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">ID (slug)</Label>
              <Input
                value={form.id}
                onChange={(e) => update("id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                placeholder="ej: mayonesa, bacon-extra"
              />
              <p className="text-xs text-gray-500">Se genera automáticamente si lo dejás vacío</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Nombre</Label>
            <Input
              value={form.nombre}
              onChange={(e) => update("nombre", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              required
            />
          </div>

          {type !== "salsa" && (
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">Precio (S/)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.precio}
                onChange={(e) => update("precio", e.target.value)}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Imagen</Label>
            <div className="flex gap-3 items-start">
              {form.imagen && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-800 flex-shrink-0">
                  <img
                    src={form.imagen}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
              <div className="flex-1 flex gap-2">
                <Input
                  value={form.imagen}
                  onChange={(e) => update("imagen", e.target.value)}
                  className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white flex-1"
                  placeholder="URL o sube una imagen"
                />
                <label
                  className={`inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-zinc-700 px-3 h-9 cursor-pointer transition-colors ${
                    uploading ? "opacity-50 cursor-wait" : "text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
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
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading} className="flex-1 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold disabled:opacity-50">
              {item ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Grid de cards ───
function ComplementoGrid({ items, type, onEdit, onDelete }) {
  const showPrice = type !== "salsa";
  const placeholderIcons = { salsa: Flame, extra: UtensilsCrossed, bebida: Coffee };
  const PlaceholderIcon = placeholderIcons[type];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <PlaceholderIcon className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No hay {type === "salsa" ? "salsas" : type === "extra" ? "extras" : "bebidas"} registradas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-600 transition-all"
        >
          {/* Image */}
          <div className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlaceholderIcon className="w-10 h-10 text-gray-300 dark:text-zinc-700" />
              </div>
            )}
            {/* Overlay actions on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full"
                onClick={() => onEdit(item)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-red-600/60 backdrop-blur-sm text-white hover:bg-red-600/80 rounded-full"
                onClick={() => onDelete(item)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{item.id}</p>
            {showPrice && (
              <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">S/{item.price?.toFixed(2)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Lista (filas) ───
function ComplementoList({ items, type, onEdit, onDelete }) {
  const showPrice = type !== "salsa";
  const placeholderIcons = { salsa: Flame, extra: UtensilsCrossed, bebida: Coffee };
  const PlaceholderIcon = placeholderIcons[type];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <PlaceholderIcon className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">No hay {type === "salsa" ? "salsas" : type === "extra" ? "extras" : "bebidas"} registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="group flex items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 hover:border-gray-300 dark:hover:border-zinc-600 transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlaceholderIcon className="w-5 h-5 text-gray-300 dark:text-zinc-700" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{item.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600">{item.id}</p>
            {showPrice && (
              <p className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">S/{item.price?.toFixed(2)}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={() => onEdit(item)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-600/10" onClick={() => onDelete(item)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Página principal ───
export default function ComplementosPage() {
  const { salsas, extras, bebidas } = useMenu();
  const {
    addSalsa, updateSalsa, deleteSalsa,
    addExtra, updateExtra, deleteExtra,
    addBebida, updateBebida, deleteBebida,
  } = useAdminData();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeType, setActiveType] = useState("salsa");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const handleAdd = (type) => {
    setActiveType(type);
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item, type) => {
    setActiveType(type);
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleSave = (data) => {
    if (editingItem) {
      const { id, ...rest } = data;
      if (activeType === "salsa") updateSalsa(editingItem.id, rest);
      else if (activeType === "extra") updateExtra(editingItem.id, rest);
      else updateBebida(editingItem.id, rest);
    } else {
      if (activeType === "salsa") addSalsa(data);
      else if (activeType === "extra") addExtra(data);
      else addBebida(data);
    }
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "salsa") deleteSalsa(deleteConfirm.item.id);
    else if (deleteConfirm.type === "extra") deleteExtra(deleteConfirm.item.id);
    else deleteBebida(deleteConfirm.item.id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="salsas" className="w-full">
        <TabsList className="bg-gray-100/80 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800 p-1 h-auto">
          <TabsTrigger value="salsas" className="text-gray-500 dark:text-gray-400 data-[state=active]:bg-zinc-900/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white px-4 py-2 text-sm gap-2">
            <Flame className="w-4 h-4" />
            Salsas
            <span className="bg-gray-200 dark:bg-zinc-800 data-[state=active]:bg-white/15 text-[10px] px-1.5 py-0.5 rounded-full">{salsas.length}</span>
          </TabsTrigger>
          <TabsTrigger value="extras" className="text-gray-500 dark:text-gray-400 data-[state=active]:bg-zinc-900/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white px-4 py-2 text-sm gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Extras
            <span className="bg-gray-200 dark:bg-zinc-800 data-[state=active]:bg-white/15 text-[10px] px-1.5 py-0.5 rounded-full">{extras.length}</span>
          </TabsTrigger>
          <TabsTrigger value="bebidas" className="text-gray-500 dark:text-gray-400 data-[state=active]:bg-zinc-900/10 dark:data-[state=active]:bg-white/10 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white px-4 py-2 text-sm gap-2">
            <Coffee className="w-4 h-4" />
            Bebidas
            <span className="bg-gray-200 dark:bg-zinc-800 data-[state=active]:bg-white/15 text-[10px] px-1.5 py-0.5 rounded-full">{bebidas.length}</span>
          </TabsTrigger>
        </TabsList>

        {[
          { value: "salsas", items: salsas, type: "salsa", label: "Nueva Salsa" },
          { value: "extras", items: extras, type: "extra", label: "Nuevo Extra" },
          { value: "bebidas", items: bebidas, type: "bebida", label: "Nueva Bebida" },
        ].map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4 mt-5">
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-gray-200 dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-gray-200 dark:bg-zinc-700 text-zinc-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={() => handleAdd(tab.type)} className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            </div>
            {viewMode === "grid" ? (
              <ComplementoGrid
                items={tab.items}
                type={tab.type}
                onEdit={(item) => handleEdit(item, tab.type)}
                onDelete={(item) => setDeleteConfirm({ item, type: tab.type })}
              />
            ) : (
              <ComplementoList
                items={tab.items}
                type={tab.type}
                onEdit={(item) => handleEdit(item, tab.type)}
                onDelete={(item) => setDeleteConfirm({ item, type: tab.type })}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Form Dialog */}
      <ComplementoForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingItem(null); }}
        item={editingItem}
        onSave={handleSave}
        type={activeType}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar {deleteConfirm?.type === "salsa" ? "salsa" : deleteConfirm?.type === "extra" ? "extra" : "bebida"}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Estás seguro de eliminar <strong className="text-zinc-900 dark:text-white">{deleteConfirm?.item.name}</strong>?
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="flex-1 text-gray-500 dark:text-gray-400">
              Cancelar
            </Button>
            <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
