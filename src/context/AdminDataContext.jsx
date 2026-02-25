import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useMenu } from "@/context/MenuContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  fetchProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  crearSalsa,
  actualizarSalsa,
  eliminarSalsa,
  crearExtra,
  actualizarExtra,
  eliminarExtra,
  crearBebida,
  actualizarBebida,
  eliminarBebida,
  fetchPedidos,
  actualizarEstadoPedido,
  actualizarPedidoCliente,
  fetchFinanzas,
  crearFinanza,
  eliminarFinanza,
  fetchClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "@/lib/database";

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  const { categorias, setCategorias, salsas, setSalsas, extras, setExtras, bebidas, setBebidas } = useMenu();
  const { adminUser } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [finances, setFinances] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nombre del admin para auditoría
  const auditUser = adminUser ? `${adminUser.nombre || ""} ${adminUser.apellido || ""}`.trim() || adminUser.email : null;

  // Cargar datos al montar
  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        const [prods, ords, fins, clis] = await Promise.all([
          fetchProductosAdmin(),
          fetchPedidos().catch(() => []),
          fetchFinanzas().catch(() => []),
          fetchClientes().catch(() => []),
        ]);

        // Mapear productos de BD a formato frontend
        setProducts(prods.map((p) => {
          const salsasIds = p.salsas_ids || [];
          const extrasIds = p.extras_ids || [];
          const bebidasIds = p.bebidas_ids || [];
          return {
            id: p.id,
            categoryId: p.categoria_id,
            name: p.nombre,
            description: p.descripcion,
            price: Number(p.precio),
            image: p.imagen,
            salsasIds,
            extrasIds,
            bebidasIds,
            hasSalsas: salsasIds.length > 0,
            hasExtras: extrasIds.length > 0,
            hasBebidas: bebidasIds.length > 0,
            active: p.activo,
            visible: p.es_visible !== false,
          };
        }));

        // Mapear pedidos
        setOrders(ords.map((o) => ({
          id: o.id,
          fecha: o.fecha_registro,
          tipoPedido: o.tipo_pedido,
          telefono: o.telefono || null,
          clientId: o.usuario_id || null,
          direccion: o.direccion,
          comentarios: o.comentarios,
          total: Number(o.total),
          subtotal: Number(o.subtotal || 0),
          igv: Number(o.igv || 0),
          descuentoTotal: Number(o.descuento_total || 0),
          estado: o.estado,
          items: (o.pedido_detalle || []).map((d) => ({
            id: d.id,
            productId: d.producto_id,
            name: d.nombre_producto,
            quantity: d.cantidad,
            unitPrice: Number(d.precio_unitario),
            originalPrice: d.precio_original != null ? Number(d.precio_original) : Number(d.precio_unitario),
            descuento: Number(d.descuento || 0),
            subtotalItem: Number(d.subtotal_item || 0),
            igvItem: Number(d.igv_item || 0),
          })),
        })));

        // Mapear finanzas
        setFinances(fins.map((f) => ({
          id: f.id,
          fecha: f.fecha,
          tipo: f.tipo,
          categoria: f.categoria,
          descripcion: f.descripcion,
          monto: Number(f.monto),
        })));

        // Mapear clientes
        setClients(clis.map((c) => ({
          id: c.id,
          name: c.nombre,
          lastName: c.apellido || "",
          dni: c.dni || "",
          email: c.email || "",
          phone: c.telefono || "",
          address: c.direccion || "",
        })));
      } catch (err) {
        console.error("Error cargando datos admin:", err);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  // Categories CRUD
  const addCategory = useCallback(async (category) => {
    const dbCat = {
      id: category.id,
      nombre: category.name,
      descripcion: category.description || "",
      imagen: category.image || "",
      orden: category.sortOrder || 0,
    };
    const created = await crearCategoria(dbCat, auditUser);
    setCategorias((prev) => [...prev, {
      id: created.id,
      name: created.nombre,
      description: created.descripcion,
      image: created.imagen,
      sortOrder: created.orden,
    }]);
  }, [setCategorias, auditUser]);

  const updateCategory = useCallback(async (id, data) => {
    const dbData = {};
    if (data.name !== undefined) dbData.nombre = data.name;
    if (data.description !== undefined) dbData.descripcion = data.description;
    if (data.image !== undefined) dbData.imagen = data.image;
    if (data.sortOrder !== undefined) dbData.orden = data.sortOrder;

    const updated = await actualizarCategoria(id, dbData, auditUser);
    setCategorias((prev) =>
      prev.map((c) => c.id === id ? {
        id: updated.id,
        name: updated.nombre,
        description: updated.descripcion,
        image: updated.imagen,
        sortOrder: updated.orden,
      } : c)
    );
  }, [setCategorias, auditUser]);

  const deleteCategory = useCallback(async (id) => {
    await eliminarCategoria(id, auditUser);
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  }, [setCategorias, auditUser]);

  // Salsas CRUD
  const addSalsa = useCallback(async (salsa) => {
    const created = await crearSalsa(salsa, auditUser);
    setSalsas((prev) => [...prev, { id: created.id, name: created.nombre, image: created.imagen }]);
  }, [setSalsas, auditUser]);

  const updateSalsa = useCallback(async (id, datos) => {
    const updated = await actualizarSalsa(id, datos, auditUser);
    setSalsas((prev) => prev.map((s) => s.id === id ? { id: updated.id, name: updated.nombre, image: updated.imagen } : s));
  }, [setSalsas, auditUser]);

  const deleteSalsa = useCallback(async (id) => {
    await eliminarSalsa(id, auditUser);
    setSalsas((prev) => prev.filter((s) => s.id !== id));
  }, [setSalsas, auditUser]);

  // Extras CRUD
  const addExtra = useCallback(async (extra) => {
    const created = await crearExtra(extra, auditUser);
    setExtras((prev) => [...prev, { id: created.id, name: created.nombre, price: Number(created.precio), image: created.imagen }]);
  }, [setExtras, auditUser]);

  const updateExtra = useCallback(async (id, datos) => {
    const updated = await actualizarExtra(id, datos, auditUser);
    setExtras((prev) => prev.map((e) => e.id === id ? { id: updated.id, name: updated.nombre, price: Number(updated.precio), image: updated.imagen } : e));
  }, [setExtras, auditUser]);

  const deleteExtra = useCallback(async (id) => {
    await eliminarExtra(id, auditUser);
    setExtras((prev) => prev.filter((e) => e.id !== id));
  }, [setExtras, auditUser]);

  // Bebidas CRUD
  const addBebida = useCallback(async (bebida) => {
    const created = await crearBebida(bebida, auditUser);
    setBebidas((prev) => [...prev, { id: created.id, name: created.nombre, price: Number(created.precio), image: created.imagen }]);
  }, [setBebidas, auditUser]);

  const updateBebida = useCallback(async (id, datos) => {
    const updated = await actualizarBebida(id, datos, auditUser);
    setBebidas((prev) => prev.map((b) => b.id === id ? { id: updated.id, name: updated.nombre, price: Number(updated.precio), image: updated.imagen } : b));
  }, [setBebidas, auditUser]);

  const deleteBebida = useCallback(async (id) => {
    await eliminarBebida(id, auditUser);
    setBebidas((prev) => prev.filter((b) => b.id !== id));
  }, [setBebidas, auditUser]);

  // Products CRUD
  const addProduct = useCallback(async (product) => {
    const dbProduct = {
      categoria_id: product.categoryId,
      nombre: product.name,
      descripcion: product.description,
      precio: parseFloat(product.price) || 0,
      imagen: product.image,
      salsas_ids: product.salsasIds || [],
      extras_ids: product.extrasIds || [],
      bebidas_ids: product.bebidasIds || [],
      es_visible: product.visible !== false,
    };
    const created = await crearProducto(dbProduct, auditUser);
    const salsasIds = created.salsas_ids || [];
    const extrasIds = created.extras_ids || [];
    const bebidasIds = created.bebidas_ids || [];
    setProducts((prev) => [...prev, {
      id: created.id,
      categoryId: created.categoria_id,
      name: created.nombre,
      description: created.descripcion,
      price: Number(created.precio),
      image: created.imagen,
      salsasIds,
      extrasIds,
      bebidasIds,
      hasSalsas: salsasIds.length > 0,
      hasExtras: extrasIds.length > 0,
      hasBebidas: bebidasIds.length > 0,
      active: created.activo,
      visible: created.es_visible !== false,
    }]);
  }, [auditUser]);

  const updateProduct = useCallback(async (id, data) => {
    const dbData = {};
    if (data.categoryId !== undefined) dbData.categoria_id = data.categoryId;
    if (data.name !== undefined) dbData.nombre = data.name;
    if (data.description !== undefined) dbData.descripcion = data.description;
    if (data.price !== undefined) dbData.precio = parseFloat(data.price) || 0;
    if (data.image !== undefined) dbData.imagen = data.image;
    if (data.salsasIds !== undefined) dbData.salsas_ids = data.salsasIds;
    if (data.extrasIds !== undefined) dbData.extras_ids = data.extrasIds;
    if (data.bebidasIds !== undefined) dbData.bebidas_ids = data.bebidasIds;
    if (data.visible !== undefined) dbData.es_visible = data.visible;

    const updated = await actualizarProducto(id, dbData, auditUser);
    const salsasIds = updated.salsas_ids || [];
    const extrasIds = updated.extras_ids || [];
    const bebidasIds = updated.bebidas_ids || [];
    setProducts((prev) =>
      prev.map((p) => p.id === id ? {
        id: updated.id,
        categoryId: updated.categoria_id,
        name: updated.nombre,
        description: updated.descripcion,
        price: Number(updated.precio),
        image: updated.imagen,
        salsasIds,
        extrasIds,
        bebidasIds,
        hasSalsas: salsasIds.length > 0,
        hasExtras: extrasIds.length > 0,
        hasBebidas: bebidasIds.length > 0,
        active: updated.activo,
        visible: updated.es_visible !== false,
      } : p)
    );
  }, [auditUser]);

  const deleteProduct = useCallback(async (id) => {
    await eliminarProducto(id, auditUser);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, [auditUser]);

  const toggleProductVisibility = useCallback(async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newVisible = !product.visible;
    await actualizarProducto(id, { es_visible: newVisible }, auditUser);
    setProducts((prev) =>
      prev.map((p) => p.id === id ? { ...p, visible: newVisible } : p)
    );
  }, [products, auditUser]);

  // Orders
  const updateOrderStatus = useCallback(async (id, estado) => {
    await actualizarEstadoPedido(id, estado, auditUser);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, estado } : o))
    );
  }, [auditUser]);

  const refreshOrders = useCallback(async () => {
    const ords = await fetchPedidos();
    setOrders(ords.map((o) => ({
      id: o.id,
      fecha: o.fecha_registro,
      tipoPedido: o.tipo_pedido,
      telefono: o.telefono || null,
      clientId: o.usuario_id || null,
      direccion: o.direccion,
      comentarios: o.comentarios,
      total: Number(o.total),
      subtotal: Number(o.subtotal || 0),
      igv: Number(o.igv || 0),
      descuentoTotal: Number(o.descuento_total || 0),
      estado: o.estado,
      items: (o.pedido_detalle || []).map((d) => ({
        id: d.id,
        productId: d.producto_id,
        name: d.nombre_producto,
        quantity: d.cantidad,
        unitPrice: Number(d.precio_unitario),
        originalPrice: d.precio_original != null ? Number(d.precio_original) : Number(d.precio_unitario),
        descuento: Number(d.descuento || 0),
        subtotalItem: Number(d.subtotal_item || 0),
        igvItem: Number(d.igv_item || 0),
      })),
    })));
  }, []);

  // Finances
  const addFinanceEntry = useCallback(async (entry) => {
    const dbEntry = {
      id: `FIN-${Date.now()}`,
      fecha: entry.fecha,
      tipo: entry.tipo,
      categoria: entry.categoria,
      descripcion: entry.descripcion,
      monto: parseFloat(entry.monto) || 0,
    };
    const created = await crearFinanza(dbEntry, auditUser);
    setFinances((prev) => [{
      id: created.id,
      fecha: created.fecha,
      tipo: created.tipo,
      categoria: created.categoria,
      descripcion: created.descripcion,
      monto: Number(created.monto),
    }, ...prev]);
  }, [auditUser]);

  const deleteFinanceEntry = useCallback(async (id) => {
    await eliminarFinanza(id, auditUser);
    setFinances((prev) => prev.filter((f) => f.id !== id));
  }, [auditUser]);

  // Clients CRUD
  const mapClient = (c) => ({
    id: c.id,
    name: c.nombre,
    lastName: c.apellido || "",
    dni: c.dni || "",
    email: c.email || "",
    phone: c.telefono || "",
    address: c.direccion || "",
  });

  const addClient = useCallback(async (client) => {
    const dbClient = {
      nombre: client.name,
      apellido: client.lastName || "",
      dni: client.dni || "",
      email: client.email || "",
      telefono: client.phone || "",
      direccion: client.address || "",
    };
    const created = await crearCliente(dbClient, auditUser);
    const mapped = mapClient(created);
    setClients((prev) => [...prev, mapped]);
    return mapped;
  }, [auditUser]);

  const updateClient = useCallback(async (id, data) => {
    const dbData = {};
    if (data.name !== undefined) dbData.nombre = data.name;
    if (data.lastName !== undefined) dbData.apellido = data.lastName;
    if (data.dni !== undefined) dbData.dni = data.dni;
    if (data.email !== undefined) dbData.email = data.email;
    if (data.phone !== undefined) dbData.telefono = data.phone;
    if (data.address !== undefined) dbData.direccion = data.address;

    const updated = await actualizarCliente(id, dbData, auditUser);
    setClients((prev) => prev.map((c) => c.id === id ? mapClient(updated) : c));
  }, [auditUser]);

  const deleteClient = useCallback(async (id) => {
    await eliminarCliente(id, auditUser);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, [auditUser]);

  const assignClientToOrder = useCallback(async (orderId, clientId) => {
    await actualizarPedidoCliente(orderId, clientId, auditUser);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, clientId } : o));
  }, [auditUser]);

  // Helper: fecha en zona horaria Lima (UTC-5)
  const toLimaDateStr = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-CA", { timeZone: "America/Lima" }); // formato YYYY-MM-DD
  };

  // Computed values
  const today = toLimaDateStr(new Date().toISOString());

  const todayOrders = useMemo(
    () => orders.filter((o) => o.fecha && toLimaDateStr(o.fecha) === today),
    [orders, today]
  );

  const todaySales = useMemo(
    () => todayOrders.reduce((sum, o) => sum + o.total, 0),
    [todayOrders]
  );

  const averageTicket = useMemo(
    () => (todayOrders.length > 0 ? todaySales / todayOrders.length : 0),
    [todaySales, todayOrders]
  );

  const productsSoldToday = useMemo(
    () =>
      todayOrders.reduce(
        (sum, o) => sum + (o.items || []).reduce((s, i) => s + i.quantity, 0),
        0
      ),
    [todayOrders]
  );

  const salesLast7Days = useMemo(() => {
    const days = [];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toLimaDateStr(d.toISOString());
      const total = orders
        .filter((o) => o.fecha && toLimaDateStr(o.fecha) === key)
        .reduce((sum, o) => sum + o.total, 0);
      days.push({
        day: dayNames[d.getDay()],
        date: key,
        total: Math.round(total * 100) / 100,
      });
    }
    return days;
  }, [orders]);

  const ordersByCategory = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const cat = categorias.find((c) => c.id === product.categoryId);
          const name = cat ? cat.name : "Otros";
          counts[name] = (counts[name] || 0) + item.quantity;
        }
      });
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [orders, products, categorias]);

  const financeSummary = useMemo(() => {
    const totalEntradas = finances
      .filter((f) => f.tipo === "entrada")
      .reduce((sum, f) => sum + f.monto, 0);
    const totalSalidas = finances
      .filter((f) => f.tipo === "salida")
      .reduce((sum, f) => sum + f.monto, 0);
    return {
      totalEntradas: Math.round(totalEntradas * 100) / 100,
      totalSalidas: Math.round(totalSalidas * 100) / 100,
      balance: Math.round((totalEntradas - totalSalidas) * 100) / 100,
    };
  }, [finances]);

  return (
    <AdminDataContext.Provider
      value={{
        addCategory, updateCategory, deleteCategory,
        addSalsa, updateSalsa, deleteSalsa,
        addExtra, updateExtra, deleteExtra,
        addBebida, updateBebida, deleteBebida,
        products, addProduct, updateProduct, deleteProduct, toggleProductVisibility,
        orders, updateOrderStatus, refreshOrders, assignClientToOrder,
        finances, addFinanceEntry, deleteFinanceEntry,
        clients, addClient, updateClient, deleteClient,
        todayOrders, todaySales, averageTicket, productsSoldToday,
        salesLast7Days, ordersByCategory, financeSummary,
        loading,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminDataContext);
