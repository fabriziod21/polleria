-- Fix: Permitir upload de imágenes con anon key
-- (nuestro login es custom, no usa Supabase Auth)

-- Eliminar políticas restrictivas anteriores
DROP POLICY IF EXISTS "imagenes_admin_subir" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_admin_actualizar" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_admin_eliminar" ON storage.objects;
DROP POLICY IF EXISTS "imagenes_lectura_publica" ON storage.objects;

-- Lectura pública (para mostrar imágenes en el menú)
CREATE POLICY "imagenes_lectura_publica" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'imagenes-productos');

-- Permitir subir imágenes (anon porque no usamos Supabase Auth)
CREATE POLICY "imagenes_subir" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'imagenes-productos');

-- Permitir actualizar
CREATE POLICY "imagenes_actualizar" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'imagenes-productos');

-- Permitir eliminar
CREATE POLICY "imagenes_eliminar" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'imagenes-productos');
