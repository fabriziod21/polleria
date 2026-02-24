import { useState, useMemo, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Download, FileSpreadsheet, FileText, FileDown, UtensilsCrossed, LayoutGrid, List, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import { useAdminData } from "@/context/AdminDataContext";
import { useMenu } from "@/context/MenuContext";
import { exportCSV, exportExcel, exportPDF } from "@/lib/exportUtils";

const exportColumns = [
  { label: "Nombre", getValue: (r) => r.name, width: 25 },
  { label: "Categoría", getValue: (r) => r._categoryName || "", width: 20 },
  { label: "Descripción", getValue: (r) => r.description || "", width: 35 },
  { label: "Precio (S/)", getValue: (r) => r.price?.toFixed(2) || "0.00", width: 12 },
  { label: "Visible", getValue: (r) => r.visible ? "Sí" : "No", width: 8 },
];

export default function ProductosPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductVisibility } = useAdminData();
  const { categorias } = useMenu();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const exportRef = useRef(null);

  const getCategoryName = (id) => categorias.find((c) => c.id === id)?.name || id;

  // Close export dropdown on outside click
  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  const filtered = useMemo(() => {
    if (categoryFilter === "todos") return products;
    return products.filter((p) => p.categoryId === categoryFilter);
  }, [products, categoryFilter]);

  const handleSave = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleExport = (format) => {
    setExportOpen(false);
    const enriched = products.map((p) => ({ ...p, _categoryName: getCategoryName(p.categoryId) }));
    const fileName = "productos";
    const title = "Lista de Productos";
    if (format === "csv") exportCSV(enriched, exportColumns, fileName);
    else if (format === "excel") exportExcel(enriched, exportColumns, fileName);
    else if (format === "pdf") exportPDF(enriched, exportColumns, fileName, title);
  };

  return (
    <div className="space-y-5">
      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[{ id: "todos", name: "Todos" }, ...categorias].map((cat) => {
          const count = cat.id === "todos" ? products.length : products.filter((p) => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-gray-400 hover:text-zinc-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800/60"
              }`}
            >
              {cat.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                categoryFilter === cat.id ? "bg-zinc-900/10 dark:bg-white/10 text-zinc-900 dark:text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-600"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{filtered.length} productos</p>
        <div className="flex items-center gap-2">
          {/* View toggle */}
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

          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <Button
              variant="outline"
              onClick={() => setExportOpen(!exportOpen)}
              className="border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            {exportOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 text-green-400" />
                  CSV
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <FileDown className="w-4 h-4 text-orange-400" />
                  PDF
                </button>
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <UtensilsCrossed className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">No hay productos {categoryFilter !== "todos" ? "en esta categoría" : "registrados"}</p>
        </div>
      ) : viewMode === "list" ? (
        /* List View */
        <div className="space-y-2">
          {filtered.map((product) => (
            <div
              key={product.id}
              className={`group flex items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 hover:border-gray-300 dark:hover:border-zinc-600 transition-all ${
                !product.visible ? "opacity-50" : ""
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-gray-300 dark:text-zinc-700" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{product.name}</p>
                  <Badge className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-zinc-700 text-[10px] flex-shrink-0">
                    {getCategoryName(product.categoryId)}
                  </Badge>
                  {!product.visible && (
                    <Badge className="bg-gray-100 dark:bg-zinc-800 text-yellow-500 border-gray-200 dark:border-zinc-700 text-[10px] flex-shrink-0">
                      Oculto
                    </Badge>
                  )}
                </div>
                {product.description && (
                  <p className="text-xs text-gray-500 truncate">{product.description}</p>
                )}
                <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">S/{product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 hover:bg-gray-100 dark:hover:bg-zinc-800 ${product.visible ? "text-green-400 hover:text-green-300" : "text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"}`}
                  onClick={() => toggleProductVisibility(product.id)}
                  title={product.visible ? "Visible en menú" : "Oculto del menú"}
                >
                  {product.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" onClick={() => handleEdit(product)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-600/10" onClick={() => setDeleteConfirm(product)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className={`group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-600 transition-all ${
                !product.visible ? "opacity-50" : ""
              }`}
            >
              <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="w-10 h-10 text-gray-300 dark:text-zinc-700" />
                  </div>
                )}
                {/* Visibility badge */}
                {!product.visible && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black/60 text-yellow-500 border-none text-[10px] backdrop-blur-sm">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Oculto
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 backdrop-blur-sm rounded-full ${product.visible ? "bg-green-600/40 text-white hover:bg-green-600/60" : "bg-white/20 text-white hover:bg-white/30"}`}
                    onClick={() => toggleProductVisibility(product.id)}
                  >
                    {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full" onClick={() => handleEdit(product)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 bg-red-600/60 backdrop-blur-sm text-white hover:bg-red-600/80 rounded-full" onClick={() => setDeleteConfirm(product)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <Badge className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-zinc-700 text-[10px] mb-1.5">
                  {getCategoryName(product.categoryId)}
                </Badge>
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{product.name}</p>
                {product.description && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{product.description}</p>
                )}
                <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1.5">S/{product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Estás seguro de eliminar <strong className="text-zinc-900 dark:text-white">{deleteConfirm?.name}</strong>? Esta acción no se puede deshacer.
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
