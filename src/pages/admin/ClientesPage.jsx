import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Users, Search, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminData } from "@/context/AdminDataContext";

function ClientFormDialog({ open, onClose, client, onSave }) {
  const [form, setForm] = useState({
    name: "", lastName: "", dni: "", phone: "", email: "", address: "",
  });

  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (client) {
        setForm({
          name: client.name,
          lastName: client.lastName,
          dni: client.dni,
          phone: client.phone,
          email: client.email,
          address: client.address,
        });
      } else {
        setForm({ name: "", lastName: "", dni: "", phone: "", email: "", address: "" });
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{client ? "Editar" : "Nuevo"} Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">Nombre</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">Apellido</Label>
              <Input
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">DNI</Label>
              <Input
                value={form.dni}
                onChange={(e) => update("dni", e.target.value.replace(/[^0-9]/g, ""))}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                maxLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400">Teléfono</Label>
              <Input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/[^0-9+\s-]/g, ""))}
                className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                type="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Email</Label>
            <Input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500 dark:text-gray-400">Dirección</Label>
            <Input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-gray-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 font-semibold">
              {client ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ClientesPage() {
  const { clients, addClient, updateClient, deleteClient } = useAdminData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.dni.includes(q) ||
        c.phone.includes(q)
    );
  }, [clients, search]);

  const handleSave = (data) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
    } else {
      addClient(data);
    }
    setEditingClient(null);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteClient(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-gray-500">{clients.length} clientes</p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI..."
              className="pl-9 w-56 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm"
            />
          </div>
          <Button
            onClick={() => { setEditingClient(null); setFormOpen(true); }}
            className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-gray-200 text-white dark:text-zinc-900 rounded-xl font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Users className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">{search ? "Sin resultados" : "No hay clientes registrados"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="group flex items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/60 rounded-2xl p-3 hover:border-gray-300 dark:hover:border-zinc-700/60 transition-colors"
            >
              {/* Avatar */}
              <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  {client.name.charAt(0).toUpperCase()}{client.lastName ? client.lastName.charAt(0).toUpperCase() : ""}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {client.name} {client.lastName}
                  </p>
                  {client.dni && (
                    <Badge className="bg-gray-100 dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700 text-[10px] flex-shrink-0">
                      DNI: {client.dni}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  {client.phone && (
                    <a href={`tel:${client.phone}`} className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                      <Phone className="w-3 h-3" />
                      {client.phone}
                    </a>
                  )}
                  {client.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {client.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg" onClick={() => handleEdit(client)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-600/10 rounded-lg" onClick={() => setDeleteConfirm(client)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ClientFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingClient(null); }}
        client={editingClient}
        onSave={handleSave}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-zinc-900 dark:text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar cliente</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Estás seguro de eliminar a <strong className="text-zinc-900 dark:text-white">{deleteConfirm?.name} {deleteConfirm?.lastName}</strong>?
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
