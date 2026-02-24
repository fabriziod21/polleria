-- ============================================
-- SEED: Categorías, Productos, Salsas, Extras, Bebidas
-- ============================================

-- Categorías
INSERT INTO categorias (id, nombre, descripcion, imagen, orden) VALUES
('sanguchos', 'Sanguchos Clásicos', 'Nuestros clásicos sanguchos peruanos', 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&q=80', 1),
('hamburguesas', 'Hamburguesas', 'Hamburguesas artesanales jugosas', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', 2),
('hotdogs', 'Hot Dogs', 'Hot dogs con todos los toppings', 'https://images.unsplash.com/photo-1612392062126-2af528ef5f19?w=600&q=80', 3),
('combos', 'Ricos Combos', 'Combos con papas y bebida', 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80', 4),
('wraps', 'Wraps & Enrollados', 'Wraps frescos y enrollados', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80', 5),
('complementos', 'Complementos', 'Papas fritas, nuggets y más', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80', 6),
('bebidas_cat', 'Bebidas', 'Refrescos, jugos y milkshakes', 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&q=80', 7),
('postres', 'Postres', 'Para el toque dulce final', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', 8)
ON CONFLICT (id) DO NOTHING;

-- Productos
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, tiene_salsas, tiene_extras, tiene_bebidas) VALUES
('sanguchos', 'Sanguche de Chicharrón', 'Chicharrón crocante con sarsa criolla, camote frito y ají en pan francés.', 12.00, 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&q=80', TRUE, TRUE, FALSE),
('sanguchos', 'Sanguche de Pollo', 'Pechuga de pollo deshilachado con lechuga, tomate, palta y mayonesa casera.', 10.00, 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=600&q=80', TRUE, TRUE, FALSE),
('sanguchos', 'Sanguche de Lomo', 'Lomo fino saltado con cebolla, tomate, ají amarillo y papas al hilo.', 15.00, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80', TRUE, TRUE, FALSE),
('sanguchos', 'Sanguche de Asado', 'Carne de asado con zarza criolla, mayonesa y ají en pan ciabatta.', 13.00, 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=600&q=80', TRUE, TRUE, FALSE),
('hamburguesas', 'Cubana X3', 'Hamburguesa de carne de res, queso edam, huevo frito, plátano, papas al hilo, tomate, lechuga y salsas.', 20.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', TRUE, TRUE, TRUE),
('hamburguesas', 'Clásica Doble', 'Doble carne de res, queso cheddar derretido, lechuga, tomate y salsa especial de la casa.', 18.00, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80', TRUE, TRUE, TRUE),
('hamburguesas', 'BBQ Crispy', 'Pollo crispy, bacon crocante, queso, cebolla caramelizada y salsa BBQ ahumada.', 19.00, 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&q=80', TRUE, TRUE, TRUE),
('hamburguesas', 'Mary Especial', 'Triple carne, queso cheddar y suizo, bacon, huevo, jalapeño y salsa Mary.', 25.00, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80', TRUE, TRUE, TRUE),
('hotdogs', 'Hot Dog Clásico', 'Salchicha ahumada con ketchup, mostaza, mayonesa y papas al hilo.', 8.00, 'https://images.unsplash.com/photo-1612392062126-2af528ef5f19?w=600&q=80', TRUE, TRUE, FALSE),
('hotdogs', 'Hot Dog Completo', 'Salchicha jumbo con queso derretido, jalapeños, bacon, cebolla crispy y salsas.', 12.00, 'https://images.unsplash.com/photo-1619740455993-9d701c8bb4f0?w=600&q=80', TRUE, TRUE, TRUE),
('hotdogs', 'Hot Dog Mary', 'Salchicha ahumada doble, queso cheddar, guacamole, tocino y salsa picante.', 14.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80', TRUE, TRUE, TRUE),
('combos', 'Combo Personal', 'Hamburguesa clásica + papas fritas + gaseosa 500ml.', 22.00, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80', TRUE, TRUE, TRUE),
('combos', 'Combo Dúo', '2 hamburguesas clásicas + papas familiares + 2 gaseosas.', 40.00, 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=600&q=80', TRUE, TRUE, TRUE),
('combos', 'Combo Familiar', '4 hamburguesas + papas XXL + 4 gaseosas + nuggets de regalo.', 75.00, 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=600&q=80', TRUE, TRUE, TRUE),
('wraps', 'Wrap de Pollo', 'Tortilla de harina con pollo grillado, lechuga, tomate, queso y aderezo ranch.', 14.00, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80', TRUE, TRUE, FALSE),
('wraps', 'Wrap BBQ', 'Tortilla con carne desmechada, queso cheddar, cebolla crispy y salsa BBQ.', 16.00, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80', TRUE, TRUE, FALSE),
('complementos', 'Papas Fritas', 'Porción generosa de papas fritas crocantes con sal.', 8.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80', TRUE, FALSE, FALSE),
('complementos', 'Nuggets x8', '8 nuggets de pollo crocantes con salsa a elegir.', 12.00, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80', TRUE, FALSE, FALSE),
('complementos', 'Aros de Cebolla', 'Aros de cebolla empanizados y crocantes con dip especial.', 10.00, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80', TRUE, FALSE, FALSE),
('bebidas_cat', 'Inca Kola 500ml', 'Inca Kola Sabor Original 500 ml.', 4.90, 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&q=80', FALSE, FALSE, FALSE),
('bebidas_cat', 'Coca-Cola 500ml', 'Coca-Cola Sabor Original 500 ml.', 4.90, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80', FALSE, FALSE, FALSE),
('bebidas_cat', 'Milkshake de Fresa', 'Milkshake cremoso de fresa con crema batida.', 10.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80', FALSE, FALSE, FALSE),
('bebidas_cat', 'Limonada Frozen', 'Limonada frozen refrescante con hierbabuena.', 8.00, 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=600&q=80', FALSE, FALSE, FALSE),
('postres', 'Brownie con Helado', 'Brownie de chocolate tibio con helado de vainilla y salsa de chocolate.', 12.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', FALSE, FALSE, FALSE),
('postres', 'Churros con Chocolate', '6 churros crocantes con salsa de chocolate belga.', 10.00, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80', FALSE, FALSE, FALSE);

-- Salsas
INSERT INTO salsas (id, nombre, imagen) VALUES
('mayonesa', 'Mayonesa', 'https://images.unsplash.com/photo-1613478881426-dffdbba66b80?w=100&q=80'),
('mostaza', 'Mostaza', 'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=100&q=80'),
('ketchup', 'Ketchup', 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=100&q=80'),
('aji', 'Ají', 'https://images.unsplash.com/photo-1583227122027-d2d25e4b4da6?w=100&q=80'),
('bbq', 'BBQ', 'https://images.unsplash.com/photo-1585325701165-351af987f5e3?w=100&q=80')
ON CONFLICT (id) DO NOTHING;

-- Extras
INSERT INTO extras (id, nombre, precio, imagen) VALUES
('huevo-frito', 'Huevo Frito', 2.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&q=80'),
('bacon', 'Bacon Extra', 3.00, 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=100&q=80'),
('queso-extra', 'Queso Extra', 2.50, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&q=80'),
('palta', 'Palta / Guacamole', 3.00, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100&q=80'),
('papas-extra', 'Papas Fritas Extra', 5.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&q=80'),
('jalapeno', 'Jalapeños', 1.50, 'https://images.unsplash.com/photo-1583227122027-d2d25e4b4da6?w=100&q=80')
ON CONFLICT (id) DO NOTHING;

-- Bebidas (catálogo para acompañar pedidos)
INSERT INTO bebidas (id, nombre, precio) VALUES
('inca-kola', 'Inca Kola Sabor Original 500 ml', 4.90),
('coca-cola', 'Coca-Cola Sabor Original 500 ml', 4.90),
('pepsi', 'Pepsi Sabor Original 500 ml', 4.90),
('agua', 'Agua Mineral 500 ml', 2.50)
ON CONFLICT (id) DO NOTHING;
