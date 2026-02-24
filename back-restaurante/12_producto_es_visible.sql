-- ============================================
-- Agregar columna es_visible a productos
-- Controla si el producto se muestra en el menú público
-- ============================================

ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS es_visible BOOLEAN DEFAULT true;
