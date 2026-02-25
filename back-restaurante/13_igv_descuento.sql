-- ============================================
-- MIGRACIÓN: IGV (18%) + Descuento por producto
-- Los precios ya incluyen IGV. Solo se desglosa.
-- ============================================

-- PEDIDOS: campos de totales desglosados
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2) DEFAULT 0;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS igv NUMERIC(10,2) DEFAULT 0;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS descuento_total NUMERIC(10,2) DEFAULT 0;

-- PEDIDO_DETALLE: precio original (catálogo) + descuento + desglose por línea
ALTER TABLE pedido_detalle ADD COLUMN IF NOT EXISTS precio_original NUMERIC(10,2);
ALTER TABLE pedido_detalle ADD COLUMN IF NOT EXISTS descuento NUMERIC(10,2) DEFAULT 0;
ALTER TABLE pedido_detalle ADD COLUMN IF NOT EXISTS subtotal_item NUMERIC(10,2);
ALTER TABLE pedido_detalle ADD COLUMN IF NOT EXISTS igv_item NUMERIC(10,2);

-- No se necesitan nuevas políticas RLS: las columnas nuevas
-- heredan las políticas existentes de la tabla (07_fix_all_rls.sql).
