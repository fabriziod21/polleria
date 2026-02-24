-- ============================================
-- Agregar columnas JSONB para selección específica
-- de salsas, extras y bebidas por producto
-- ============================================

-- Paso 0: Agregar imagen a bebidas (no existía)
ALTER TABLE bebidas ADD COLUMN IF NOT EXISTS imagen TEXT;

-- Paso 1: Agregar columnas JSONB
ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS salsas_ids jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS extras_ids jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS bebidas_ids jsonb DEFAULT '[]'::jsonb;

-- Paso 2: Migrar datos existentes
-- Productos con tiene_salsas=true reciben TODOS los IDs de salsas activas
UPDATE productos
SET salsas_ids = (
  SELECT COALESCE(jsonb_agg(s.id), '[]'::jsonb)
  FROM salsas s
  WHERE s.estado_registro = 1
)
WHERE tiene_salsas = true AND (salsas_ids IS NULL OR salsas_ids = '[]'::jsonb);

UPDATE productos
SET extras_ids = (
  SELECT COALESCE(jsonb_agg(e.id), '[]'::jsonb)
  FROM extras e
  WHERE e.estado_registro = 1
)
WHERE tiene_extras = true AND (extras_ids IS NULL OR extras_ids = '[]'::jsonb);

UPDATE productos
SET bebidas_ids = (
  SELECT COALESCE(jsonb_agg(b.id), '[]'::jsonb)
  FROM bebidas b
  WHERE b.estado_registro = 1
)
WHERE tiene_bebidas = true AND (bebidas_ids IS NULL OR bebidas_ids = '[]'::jsonb);
