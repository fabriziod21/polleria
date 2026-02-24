-- =============================================
-- SEED DATA - Sanguchería Mary
-- =============================================

-- Tipo de usuario
INSERT INTO tipo_usuario (id, nombre, descripcion) VALUES
  (1, 'administrador', 'Acceso total al sistema'),
  (2, 'cliente', 'Cliente del restaurante')
ON CONFLICT (id) DO NOTHING;

-- Usuario admin
INSERT INTO usuarios (id, tipo_usuario_id, nombre, apellido, email, contrasena, telefono) VALUES
  ('USR-001', 1, 'Admin', 'Mary', 'admin@sangucheriamary.com', 'mary2026', '+51946792798')
ON CONFLICT (id) DO NOTHING;

-- Categorías
INSERT INTO categorias (id, nombre, descripcion, imagen, orden) VALUES
  ('sanguchos',    'Sanguchos',       'Nuestros sanguchos artesanales', 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80', 1),
  ('hamburguesas', 'Hamburguesas',    'Hamburguesas jugosas y deliciosas', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', 2),
  ('hotdogs',      'Hot Dogs',        'Hot dogs con todos los toppings', 'https://images.unsplash.com/photo-1612392062126-2f8a0e0e0e1c?w=400&q=80', 3),
  ('combos',       'Combos',          'Combos para compartir', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', 4),
  ('bebidas_cat',  'Bebidas',         'Refrescos y bebidas', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', 5),
  ('postres',      'Postres',         'Postres caseros', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', 6),
  ('extras_cat',   'Extras',          'Acompañamientos y extras', 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80', 7),
  ('promociones',  'Promociones',     'Ofertas especiales', 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', 8)
ON CONFLICT (id) DO NOTHING;

-- Productos: Sanguchos
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, tiene_salsas, tiene_extras, tiene_bebidas) VALUES
  ('sanguchos', 'Sanguch de Pollo',         'Pollo deshilachado, lechuga, tomate y mayonesa casera', 8.00,  'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&q=80', true, true, true),
  ('sanguchos', 'Sanguch de Lomo',          'Lomo saltado con cebolla, tomate y ají',                12.00, 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=400&q=80', true, true, true),
  ('sanguchos', 'Sanguch de Chancho',       'Chancho al horno con salsa criolla',                    10.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', true, true, true),
  ('sanguchos', 'Sanguch de Chicharrón',    'Chicharrón crocante con salsa criolla y camote',        11.00, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', true, true, true),
  ('sanguchos', 'Sanguch Vegetariano',      'Palta, tomate, lechuga, queso y aceitunas',             9.00,  'https://images.unsplash.com/photo-1540914124281-342587941389?w=400&q=80', true, false, true);

-- Productos: Hamburguesas
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, tiene_salsas, tiene_extras, tiene_bebidas) VALUES
  ('hamburguesas', 'Hamburguesa Clásica',    'Carne de res, lechuga, tomate, cebolla y queso', 12.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', true, true, true),
  ('hamburguesas', 'Hamburguesa Doble',      'Doble carne, doble queso, tocino crocante',      16.00, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80', true, true, true),
  ('hamburguesas', 'Hamburguesa BBQ',        'Carne, queso cheddar, tocino y salsa BBQ',       15.00, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=80', true, true, true),
  ('hamburguesas', 'Hamburguesa de Pollo',   'Pechuga empanizada, lechuga y mayonesa',         13.00, 'https://images.unsplash.com/photo-1525164286253-04e68b9d94c6?w=400&q=80', true, true, true);

-- Productos: Hot Dogs
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, tiene_salsas, tiene_extras, tiene_bebidas) VALUES
  ('hotdogs', 'Hot Dog Clásico',    'Salchicha, ketchup, mostaza y mayonesa',          6.00,  'https://images.unsplash.com/photo-1612392062126-2f8a0e0e0e1c?w=400&q=80', true, true, true),
  ('hotdogs', 'Hot Dog Completo',   'Salchicha, papas fritas, queso y todas las salsas', 9.00, 'https://images.unsplash.com/photo-1619740455993-9d701c85eb76?w=400&q=80', true, true, true),
  ('hotdogs', 'Hot Dog Gigante',    'Salchicha XL con todos los toppings',             11.00, 'https://images.unsplash.com/photo-1613482184972-f9c1022d0928?w=400&q=80', true, true, true);

-- Productos: Combos
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, tiene_salsas, tiene_extras, tiene_bebidas) VALUES
  ('combos', 'Combo Personal',   'Sanguch + papas + gaseosa',           18.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', false, false, false),
  ('combos', 'Combo Familiar',   '4 sanguchos + papas grande + 2L gaseosa', 55.00, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', false, false, false),
  ('combos', 'Combo Pareja',     '2 hamburguesas + papas + 2 gaseosas', 35.00, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80', false, false, false);

-- Productos: Bebidas
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, tiene_salsas, tiene_extras, tiene_bebidas) VALUES
  ('bebidas_cat', 'Gaseosa Personal',   'Coca-Cola, Inca Kola, Sprite 500ml',   3.00, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', false, false, false),
  ('bebidas_cat', 'Gaseosa Familiar',   'Coca-Cola, Inca Kola 1.5L',            7.00, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', false, false, false),
  ('bebidas_cat', 'Chicha Morada',      'Chicha morada natural 1L',              5.00, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', false, false, false),
  ('bebidas_cat', 'Limonada',           'Limonada frozen o natural',             4.00, 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80', false, false, false);

-- Productos: Postres
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, tiene_salsas, tiene_extras, tiene_bebidas) VALUES
  ('postres', 'Torta de Chocolate',  'Porción de torta de chocolate casera', 6.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', false, false, false),
  ('postres', 'Tres Leches',        'Porción de tres leches',               7.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80', false, false, false);

-- Salsas (catálogo global)
INSERT INTO salsas (id, nombre, imagen) VALUES
  ('mayonesa',  'Mayonesa',       'https://images.unsplash.com/photo-1613478881427-20db0547e868?w=200&q=80'),
  ('ketchup',   'Ketchup',        'https://images.unsplash.com/photo-1613478881427-20db0547e868?w=200&q=80'),
  ('mostaza',   'Mostaza',        'https://images.unsplash.com/photo-1613478881427-20db0547e868?w=200&q=80'),
  ('aji',       'Ají',            'https://images.unsplash.com/photo-1613478881427-20db0547e868?w=200&q=80'),
  ('criolla',   'Salsa Criolla',  'https://images.unsplash.com/photo-1613478881427-20db0547e868?w=200&q=80')
ON CONFLICT (id) DO NOTHING;

-- Extras (catálogo global)
INSERT INTO extras (id, nombre, precio, imagen) VALUES
  ('papas',       'Papas Fritas',     4.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=80'),
  ('queso_extra', 'Queso Extra',      2.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=80'),
  ('tocino',      'Tocino',           3.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=80'),
  ('huevo',       'Huevo Frito',      2.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=80'),
  ('palta',       'Palta',            3.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=80'),
  ('jamonqueso',  'Jamón y Queso',    3.50, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=80')
ON CONFLICT (id) DO NOTHING;

-- Bebidas acompañamiento (catálogo global)
INSERT INTO bebidas (id, nombre, precio) VALUES
  ('gaseosa_p',   'Gaseosa Personal',   3.00),
  ('gaseosa_f',   'Gaseosa Familiar',   7.00),
  ('chicha',      'Chicha Morada',      5.00),
  ('limonada',    'Limonada',           4.00)
ON CONFLICT (id) DO NOTHING;
