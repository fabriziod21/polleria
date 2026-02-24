-- ============================================
-- Agregar columna teléfono a pedidos
-- ============================================

ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);
