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

export async function crearCategoria(categoria) {
  const { data, error } = await supabase
    .from("categorias")
    .insert(categoria)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarCategoria(id, datos) {
  const { data, error } = await supabase
    .from("categorias")
    .update({ ...datos, fecha_actualizacion: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarCategoria(id) {
  const { error } = await supabase
    .from("categorias")
    .update({ estado_registro: 0, fecha_actualizacion: new Date().toISOString() })
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

export async function crearProducto(producto) {
  const { data, error } = await supabase
    .from("productos")
    .insert(producto)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function actualizarProducto(id, datos) {
  const { data, error } = await supabase
    .from("productos")
    .update({ ...datos, fecha_actualizacion: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarProducto(id) {
  const { error } = await supabase
    .from("productos")
    .update({ estado_registro: 0, fecha_actualizacion: new Date().toISOString() })
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

export async function fetchExtras() {
  const { data, error } = await supabase
    .from("extras")
    .select("*")
    .eq("estado_registro", 1);
  if (error) throw error;
  return data;
}

export async function fetchBebidas() {
  const { data, error } = await supabase
    .from("bebidas")
    .select("*")
    .eq("estado_registro", 1);
  if (error) throw error;
  return data;
}

// ============================================
// PEDIDOS
// ============================================
export async function crearPedido(pedido, items) {
  // Insertar pedido
  const { data: pedidoData, error: pedidoError } = await supabase
    .from("pedidos")
    .insert(pedido)
    .select()
    .single();
  if (pedidoError) throw pedidoError;

  // Insertar detalle
  const detalles = items.map((item) => ({
    pedido_id: pedidoData.id,
    producto_id: item.producto_id,
    nombre_producto: item.nombre_producto,
    cantidad: item.cantidad,
    precio_unitario: item.precio_unitario,
    salsas_seleccionadas: item.salsas_seleccionadas || [],
    extras_seleccionados: item.extras_seleccionados || [],
    bebidas_seleccionadas: item.bebidas_seleccionadas || [],
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

export async function actualizarEstadoPedido(id, estado) {
  const { error } = await supabase
    .from("pedidos")
    .update({ estado, fecha_actualizacion: new Date().toISOString() })
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

export async function crearFinanza(finanza) {
  const { data, error } = await supabase
    .from("finanzas")
    .insert(finanza)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function eliminarFinanza(id) {
  const { error } = await supabase
    .from("finanzas")
    .update({ estado_registro: 0, fecha_actualizacion: new Date().toISOString() })
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
