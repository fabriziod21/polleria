import { supabase } from "./supabase";

// ============================================
// CATEGORÍAS
// ============================================
export async function fetchCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("estado_registro", 1)
    .order("orden");
  if (error) throw error;
  return data;
}

export async function crearCategoria(categoria, usuario) {
  const { data, error } = await supabase
    .from("categorias")
    .insert({ ...categoria, usuario_registro: usuario || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarCategoria(id, datos, usuario) {
  const { data, error } = await supabase
    .from("categorias")
    .update({ ...datos, usuario_actualizacion: usuario || null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarCategoria(id, usuario) {
  const { error } = await supabase
    .from("categorias")
    .update({ estado_registro: 0, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// PRODUCTOS
// ============================================
export async function fetchProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("estado_registro", 1)
    .eq("activo", true)
    .eq("es_visible", true)
    .order("id");
  if (error) throw error;
  return data;
}

export async function fetchProductosPorCategoria(categoriaId) {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("categoria_id", categoriaId)
    .eq("estado_registro", 1)
    .eq("activo", true)
    .order("id");
  if (error) throw error;
  return data;
}

// Admin: todos los productos (incluyendo inactivos)
export async function fetchProductosAdmin() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("estado_registro", 1)
    .order("id");
  if (error) throw error;
  return data;
}

export async function crearProducto(producto, usuario) {
  const { data, error } = await supabase
    .from("productos")
    .insert({ ...producto, usuario_registro: usuario || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarProducto(id, datos, usuario) {
  const { data, error } = await supabase
    .from("productos")
    .update({ ...datos, usuario_actualizacion: usuario || null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarProducto(id, usuario) {
  const { error } = await supabase
    .from("productos")
    .update({ estado_registro: 0, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// SALSAS, EXTRAS, BEBIDAS (catálogos)
// ============================================
export async function fetchSalsas() {
  const { data, error } = await supabase
    .from("salsas")
    .select("*")
    .eq("estado_registro", 1);
  if (error) throw error;
  return data;
}

export async function crearSalsa(salsa, usuario) {
  const { data, error } = await supabase
    .from("salsas")
    .insert({ ...salsa, usuario_registro: usuario || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarSalsa(id, datos, usuario) {
  const { data, error } = await supabase
    .from("salsas")
    .update({ ...datos, usuario_actualizacion: usuario || null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarSalsa(id, usuario) {
  const { error } = await supabase
    .from("salsas")
    .update({ estado_registro: 0, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchExtras() {
  const { data, error } = await supabase
    .from("extras")
    .select("*")
    .eq("estado_registro", 1);
  if (error) throw error;
  return data;
}

export async function crearExtra(extra, usuario) {
  const { data, error } = await supabase
    .from("extras")
    .insert({ ...extra, usuario_registro: usuario || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarExtra(id, datos, usuario) {
  const { data, error } = await supabase
    .from("extras")
    .update({ ...datos, usuario_actualizacion: usuario || null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarExtra(id, usuario) {
  const { error } = await supabase
    .from("extras")
    .update({ estado_registro: 0, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchBebidas() {
  const { data, error } = await supabase
    .from("bebidas")
    .select("*")
    .eq("estado_registro", 1);
  if (error) throw error;
  return data;
}

export async function crearBebida(bebida, usuario) {
  const { data, error } = await supabase
    .from("bebidas")
    .insert({ ...bebida, usuario_registro: usuario || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarBebida(id, datos, usuario) {
  const { data, error } = await supabase
    .from("bebidas")
    .update({ ...datos, usuario_actualizacion: usuario || null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarBebida(id, usuario) {
  const { error } = await supabase
    .from("bebidas")
    .update({ estado_registro: 0, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// PEDIDOS
// ============================================
export async function crearPedido(pedido, items, usuario) {
  // Calcular IGV y descuentos por item
  const detallesCalc = items.map((item) => {
    const precioOriginal = item.precio_original ?? item.precio_unitario;
    const precioUnitario = item.precio_unitario;
    const cantidad = item.cantidad;
    const totalItem = precioUnitario * cantidad;
    const subtotalItem = Math.round((totalItem / 1.18) * 100) / 100;
    const igvItem = Math.round((totalItem - subtotalItem) * 100) / 100;
    const descuento = Math.round((precioOriginal - precioUnitario) * cantidad * 100) / 100;
    return { ...item, precioOriginal, subtotalItem, igvItem, descuento: Math.max(descuento, 0) };
  });

  // Totales del pedido
  const totalPedido = pedido.total;
  const subtotalPedido = Math.round((totalPedido / 1.18) * 100) / 100;
  const igvPedido = Math.round((totalPedido - subtotalPedido) * 100) / 100;
  const descuentoTotal = detallesCalc.reduce((s, d) => s + d.descuento, 0);

  // Insertar pedido
  const { data: pedidoData, error: pedidoError } = await supabase
    .from("pedidos")
    .insert({
      ...pedido,
      subtotal: subtotalPedido,
      igv: igvPedido,
      descuento_total: Math.round(descuentoTotal * 100) / 100,
      usuario_registro: usuario || null,
    })
    .select()
    .single();
  if (pedidoError) throw pedidoError;

  // Insertar detalle
  const detalles = detallesCalc.map((item) => ({
    pedido_id: pedidoData.id,
    producto_id: item.producto_id,
    nombre_producto: item.nombre_producto,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
    precio_original: item.precioOriginal,
    descuento: item.descuento,
    subtotal_item: item.subtotalItem,
    igv_item: item.igvItem,
    salsas_seleccionadas: item.salsas_seleccionadas || [],
    extras_seleccionados: item.extras_seleccionados || [],
    bebidas_seleccionadas: item.bebidas_seleccionadas || [],
    usuario_registro: usuario || null,
  }));

  const { error: detalleError } = await supabase
    .from("pedido_detalle")
    .insert(detalles);
  if (detalleError) throw detalleError;

  return pedidoData;
}

export async function fetchPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select(`
      *,
      pedido_detalle (*)
    `)
    .eq("estado_registro", 1)
    .order("fecha_registro", { ascending: false });
  if (error) throw error;
  return data;
}

export async function actualizarEstadoPedido(id, estado, usuario) {
  const { error } = await supabase
    .from("pedidos")
    .update({ estado, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// FINANZAS
// ============================================
export async function fetchFinanzas() {
  const { data, error } = await supabase
    .from("finanzas")
    .select("*")
    .eq("estado_registro", 1)
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data;
}

export async function crearFinanza(finanza, usuario) {
  const { data, error } = await supabase
    .from("finanzas")
    .insert({ ...finanza, usuario_registro: usuario || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarFinanza(id, usuario) {
  const { error } = await supabase
    .from("finanzas")
    .update({ estado_registro: 0, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

// ============================================
// STORAGE: Subir imagen
// ============================================
export async function subirImagen(file) {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("imagenes-productos")
    .upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage
    .from("imagenes-productos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// ============================================
// CLIENTES (usuarios con tipo_usuario_id = 2)
// ============================================
export async function fetchClientes() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("tipo_usuario_id", 2)
    .eq("estado_registro", 1)
    .order("id");
  if (error) throw error;
  return data;
}

export async function crearCliente(cliente, usuario) {
  const { data, error } = await supabase
    .from("usuarios")
    .insert({ ...cliente, tipo_usuario_id: 2, usuario_registro: usuario || null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarCliente(id, datos, usuario) {
  const { data, error } = await supabase
    .from("usuarios")
    .update({ ...datos, usuario_actualizacion: usuario || null })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarCliente(id, usuario) {
  const { error } = await supabase
    .from("usuarios")
    .update({ estado_registro: 0, usuario_actualizacion: usuario || null })
    .eq("id", id);
  if (error) throw error;
}

export async function actualizarPedidoCliente(pedidoId, clienteId, usuario) {
  const { error } = await supabase
    .from("pedidos")
    .update({ usuario_id: clienteId, usuario_actualizacion: usuario || null })
    .eq("id", pedidoId);
  if (error) throw error;
}

// ============================================
// AUTH: Login admin con tabla usuarios
// ============================================
export async function loginAdmin(email, contrasena) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*, tipo_usuario:tipo_usuario_id(nombre)")
    .eq("email", email)
    .eq("contrasena", contrasena)
    .eq("estado_registro", 1)
    .maybeSingle();

  if (error || !data) return null;
  if (data.tipo_usuario?.nombre !== "administrador") return null;
  return data;
}
