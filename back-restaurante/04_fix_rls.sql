-- ============================================
-- FIX: Verificar y recrear políticas RLS
-- ============================================

-- Primero, eliminar todas las políticas existentes para empezar limpio
DROP POLICY IF EXISTS "categorias_lectura_publica" ON categorias;
DROP POLICY IF EXISTS "categorias_admin_todo" ON categorias;
DROP POLICY IF EXISTS "productos_lectura_publica" ON productos;
DROP POLICY IF EXISTS "productos_admin_todo" ON productos;
DROP POLICY IF EXISTS "salsas_lectura_publica" ON salsas;
DROP POLICY IF EXISTS "salsas_admin_todo" ON salsas;
DROP POLICY IF EXISTS "extras_lectura_publica" ON extras;
DROP POLICY IF EXISTS "extras_admin_todo" ON extras;
DROP POLICY IF EXISTS "bebidas_lectura_publica" ON bebidas;
DROP POLICY IF EXISTS "bebidas_admin_todo" ON bebidas;
DROP POLICY IF EXISTS "pedidos_insertar_publico" ON pedidos;
DROP POLICY IF EXISTS "pedidos_admin_lectura" ON pedidos;
DROP POLICY IF EXISTS "pedidos_admin_actualizar" ON pedidos;
DROP POLICY IF EXISTS "pedido_detalle_insertar_publico" ON pedido_detalle;
DROP POLICY IF EXISTS "pedido_detalle_admin_lectura" ON pedido_detalle;
DROP POLICY IF EXISTS "finanzas_admin_todo" ON finanzas;
DROP POLICY IF EXISTS "usuarios_admin_todo" ON usuarios;
DROP POLICY IF EXISTS "usuarios_lectura_login" ON usuarios;
DROP POLICY IF EXISTS "tipo_usuario_admin_lectura" ON tipo_usuario;
DROP POLICY IF EXISTS "tipo_usuario_lectura_publica" ON tipo_usuario;

-- Asegurar RLS habilitado
ALTER TABLE tipo_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE salsas ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE bebidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_detalle ENABLE ROW LEVEL SECURITY;
ALTER TABLE finanzas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- LECTURA PUBLICA (para anon - el menú y login)
-- ============================================
CREATE POLICY "categorias_lectura_publica" ON categorias
  FOR SELECT TO anon, authenticated
  USING (estado_registro = 1);

CREATE POLICY "productos_lectura_publica" ON productos
  FOR SELECT TO anon, authenticated
  USING (estado_registro = 1);

CREATE POLICY "salsas_lectura_publica" ON salsas
  FOR SELECT TO anon, authenticated
  USING (estado_registro = 1);

CREATE POLICY "extras_lectura_publica" ON extras
  FOR SELECT TO anon, authenticated
  USING (estado_registro = 1);

CREATE POLICY "bebidas_lectura_publica" ON bebidas
  FOR SELECT TO anon, authenticated
  USING (estado_registro = 1);

-- Login: permitir leer usuarios (anon necesita esto para login)
CREATE POLICY "usuarios_lectura_login" ON usuarios
  FOR SELECT TO anon, authenticated
  USING (estado_registro = 1);

-- Tipo usuario: lectura pública para join en login
CREATE POLICY "tipo_usuario_lectura_publica" ON tipo_usuario
  FOR SELECT TO anon, authenticated
  USING (estado_registro = 1);

-- ============================================
-- INSERCIÓN PUBLICA (clientes crean pedidos)
-- ============================================
CREATE POLICY "pedidos_insertar_publico" ON pedidos
  FOR INSERT TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "pedido_detalle_insertar_publico" ON pedido_detalle
  FOR INSERT TO anon, authenticated
  WITH CHECK (TRUE);

-- ============================================
-- ADMIN: CRUD completo (authenticated)
-- ============================================
CREATE POLICY "categorias_admin_todo" ON categorias
  FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "productos_admin_todo" ON productos
  FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "salsas_admin_todo" ON salsas
  FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "extras_admin_todo" ON extras
  FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "bebidas_admin_todo" ON bebidas
  FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "pedidos_admin_lectura" ON pedidos
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "pedidos_admin_actualizar" ON pedidos
  FOR UPDATE TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "pedido_detalle_admin_lectura" ON pedido_detalle
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "finanzas_admin_todo" ON finanzas
  FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "usuarios_admin_todo" ON usuarios
  FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);
