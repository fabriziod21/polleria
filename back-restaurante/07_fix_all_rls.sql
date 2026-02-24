-- ============================================
-- FIX COMPLETO: Como usamos login custom (no Supabase Auth),
-- el rol siempre es "anon". Hay que permitir todas las
-- operaciones al rol anon.
-- ============================================

-- Eliminar políticas admin anteriores que usan 'authenticated'
DROP POLICY IF EXISTS "categorias_admin_todo" ON categorias;
DROP POLICY IF EXISTS "productos_admin_todo" ON productos;
DROP POLICY IF EXISTS "salsas_admin_todo" ON salsas;
DROP POLICY IF EXISTS "extras_admin_todo" ON extras;
DROP POLICY IF EXISTS "bebidas_admin_todo" ON bebidas;
DROP POLICY IF EXISTS "pedidos_admin_lectura" ON pedidos;
DROP POLICY IF EXISTS "pedidos_admin_actualizar" ON pedidos;
DROP POLICY IF EXISTS "pedido_detalle_admin_lectura" ON pedido_detalle;
DROP POLICY IF EXISTS "finanzas_admin_todo" ON finanzas;
DROP POLICY IF EXISTS "usuarios_admin_todo" ON usuarios;

-- Eliminar también las de lectura pública para recrear todo limpio
DROP POLICY IF EXISTS "categorias_lectura_publica" ON categorias;
DROP POLICY IF EXISTS "productos_lectura_publica" ON productos;
DROP POLICY IF EXISTS "salsas_lectura_publica" ON salsas;
DROP POLICY IF EXISTS "extras_lectura_publica" ON extras;
DROP POLICY IF EXISTS "bebidas_lectura_publica" ON bebidas;
DROP POLICY IF EXISTS "usuarios_lectura_login" ON usuarios;
DROP POLICY IF EXISTS "tipo_usuario_lectura_publica" ON tipo_usuario;
DROP POLICY IF EXISTS "pedidos_insertar_publico" ON pedidos;
DROP POLICY IF EXISTS "pedido_detalle_insertar_publico" ON pedido_detalle;

-- Storage
DROP POLICY IF EXISTS "imagenes_lectura_publica" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_subir" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_actualizar" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_eliminar" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_admin_subir" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_admin_actualizar" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_admin_eliminar" ON storage.objects;

-- ============================================
-- NUEVAS POLÍTICAS: Todo accesible para anon
-- (la seguridad del admin se maneja en el frontend)
-- ============================================

-- Categorías: lectura filtrada + escritura total
CREATE POLICY "categorias_select" ON categorias FOR SELECT TO anon USING (estado_registro = 1);
CREATE POLICY "categorias_insert" ON categorias FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "categorias_update" ON categorias FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "categorias_delete" ON categorias FOR DELETE TO anon USING (TRUE);

-- Productos: lectura filtrada + escritura total
CREATE POLICY "productos_select" ON productos FOR SELECT TO anon USING (estado_registro = 1);
CREATE POLICY "productos_insert" ON productos FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "productos_update" ON productos FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "productos_delete" ON productos FOR DELETE TO anon USING (TRUE);

-- Salsas
CREATE POLICY "salsas_select" ON salsas FOR SELECT TO anon USING (estado_registro = 1);
CREATE POLICY "salsas_insert" ON salsas FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "salsas_update" ON salsas FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);

-- Extras
CREATE POLICY "extras_select" ON extras FOR SELECT TO anon USING (estado_registro = 1);
CREATE POLICY "extras_insert" ON extras FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "extras_update" ON extras FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);

-- Bebidas
CREATE POLICY "bebidas_select" ON bebidas FOR SELECT TO anon USING (estado_registro = 1);
CREATE POLICY "bebidas_insert" ON bebidas FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "bebidas_update" ON bebidas FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);

-- Usuarios y tipo_usuario
CREATE POLICY "usuarios_select" ON usuarios FOR SELECT TO anon USING (estado_registro = 1);
CREATE POLICY "usuarios_insert" ON usuarios FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "usuarios_update" ON usuarios FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "tipo_usuario_select" ON tipo_usuario FOR SELECT TO anon USING (estado_registro = 1);

-- Pedidos: lectura y escritura total
CREATE POLICY "pedidos_select" ON pedidos FOR SELECT TO anon USING (TRUE);
CREATE POLICY "pedidos_insert" ON pedidos FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "pedidos_update" ON pedidos FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);

-- Pedido detalle
CREATE POLICY "pedido_detalle_select" ON pedido_detalle FOR SELECT TO anon USING (TRUE);
CREATE POLICY "pedido_detalle_insert" ON pedido_detalle FOR INSERT TO anon WITH CHECK (TRUE);

-- Finanzas
CREATE POLICY "finanzas_select" ON finanzas FOR SELECT TO anon USING (estado_registro = 1);
CREATE POLICY "finanzas_insert" ON finanzas FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "finanzas_update" ON finanzas FOR UPDATE TO anon USING (TRUE) WITH CHECK (TRUE);

-- Storage: imágenes
CREATE POLICY "storage_select" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'imagenes-productos');
CREATE POLICY "storage_insert" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'imagenes-productos');
CREATE POLICY "storage_update" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'imagenes-productos');
CREATE POLICY "storage_delete" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'imagenes-productos');
