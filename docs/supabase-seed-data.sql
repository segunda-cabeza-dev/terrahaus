-- =====================================================
-- BELTRAME WEB - SAMPLE DATA
-- =====================================================
-- This script inserts sample data to test the application
-- NOTE: Run supabase-setup-complete.sql first!
-- =====================================================

-- =====================================================
-- 1. SAMPLE CATEGORIES
-- =====================================================

INSERT INTO public.categories (slug, display_order, is_active) VALUES
('railings', 1, true),
('bbq', 2, true),
('signs', 3, true),
('copper', 4, true),
('laser-cutting', 5, true),
('glass-walls', 6, true),
('stairs', 7, true),
('mirrors', 8, true),
('furniture', 9, true),
('pergolas', 10, true),
('doors', 11, true);

-- =====================================================
-- 2. CATEGORY TRANSLATIONS
-- =====================================================

-- Railings
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 1, 'name', 'es', 'Barandillas'),
('category', 1, 'name', 'en', 'Railings'),
('category', 1, 'name', 'it', 'Ringhiere'),
('category', 1, 'description', 'es', 'Barandillas de hierro forjado a medida'),
('category', 1, 'description', 'en', 'Custom wrought iron railings'),
('category', 1, 'description', 'it', 'Ringhiere in ferro battuto su misura');

-- BBQ
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 2, 'name', 'es', 'Barbacoas'),
('category', 2, 'name', 'en', 'BBQ'),
('category', 2, 'name', 'it', 'Barbecue'),
('category', 2, 'description', 'es', 'Barbacoas de hierro para exteriores'),
('category', 2, 'description', 'en', 'Iron BBQ for outdoors'),
('category', 2, 'description', 'it', 'Barbecue in ferro per esterni');

-- Signs
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 3, 'name', 'es', 'Carteles'),
('category', 3, 'name', 'en', 'Signs'),
('category', 3, 'name', 'it', 'Insegne'),
('category', 3, 'description', 'es', 'Carteles metálicos personalizados'),
('category', 3, 'description', 'en', 'Custom metal signs'),
('category', 3, 'description', 'it', 'Insegne metalliche personalizzate');

-- Copper
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 4, 'name', 'es', 'Cobre'),
('category', 4, 'name', 'en', 'Copper'),
('category', 4, 'name', 'it', 'Rame'),
('category', 4, 'description', 'es', 'Trabajos en cobre'),
('category', 4, 'description', 'en', 'Copper work'),
('category', 4, 'description', 'it', 'Lavori in rame');

-- Laser Cutting
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 5, 'name', 'es', 'Corte Láser'),
('category', 5, 'name', 'en', 'Laser Cutting'),
('category', 5, 'name', 'it', 'Taglio Laser'),
('category', 5, 'description', 'es', 'Precisión con corte láser'),
('category', 5, 'description', 'en', 'Laser cutting precision'),
('category', 5, 'description', 'it', 'Precisione con taglio laser');

-- Glass Walls
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 6, 'name', 'es', 'Cristaleras'),
('category', 6, 'name', 'en', 'Glass Walls'),
('category', 6, 'name', 'it', 'Vetrate'),
('category', 6, 'description', 'es', 'Cristaleras y cerramientos metálicos'),
('category', 6, 'description', 'en', 'Metal glass walls and enclosures'),
('category', 6, 'description', 'it', 'Vetrate e chiusure metalliche');

-- Stairs
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 7, 'name', 'es', 'Escaleras'),
('category', 7, 'name', 'en', 'Stairs'),
('category', 7, 'name', 'it', 'Scale'),
('category', 7, 'description', 'es', 'Escaleras metálicas'),
('category', 7, 'description', 'en', 'Metal stairs'),
('category', 7, 'description', 'it', 'Scale metalliche');

-- Mirrors
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 8, 'name', 'es', 'Espejos'),
('category', 8, 'name', 'en', 'Mirrors'),
('category', 8, 'name', 'it', 'Specchi'),
('category', 8, 'description', 'es', 'Espejos con marcos metálicos'),
('category', 8, 'description', 'en', 'Mirrors with metal frames'),
('category', 8, 'description', 'it', 'Specchi con cornici metalliche');

-- Furniture
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 9, 'name', 'es', 'Muebles'),
('category', 9, 'name', 'en', 'Furniture'),
('category', 9, 'name', 'it', 'Mobili'),
('category', 9, 'description', 'es', 'Muebles de hierro y madera'),
('category', 9, 'description', 'en', 'Iron and wood furniture'),
('category', 9, 'description', 'it', 'Mobili in ferro e legno');

-- Pergolas
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 10, 'name', 'es', 'Pérgolas'),
('category', 10, 'name', 'en', 'Pergolas'),
('category', 10, 'name', 'it', 'Pergole'),
('category', 10, 'description', 'es', 'Pérgolas metálicas'),
('category', 10, 'description', 'en', 'Metal pergolas'),
('category', 10, 'description', 'it', 'Pergole metalliche');

-- Doors
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('category', 11, 'name', 'es', 'Puertas'),
('category', 11, 'name', 'en', 'Doors'),
('category', 11, 'name', 'it', 'Porte'),
('category', 11, 'description', 'es', 'Puertas metálicas a medida'),
('category', 11, 'description', 'en', 'Custom metal doors'),
('category', 11, 'description', 'it', 'Porte metalliche su misura');

-- =====================================================
-- 3. SAMPLE PROJECTS
-- =====================================================

-- Railings Projects
INSERT INTO public.projects (category_id, slug, display_order, is_active) VALUES
(1, 'modern-handrail', 1, true),
(1, 'stair-railing', 2, true),
(1, 'terrace-railing', 3, true);

-- Railings Project Translations
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('project', 1, 'name', 'es', 'Pasamanos Moderno'),
('project', 1, 'name', 'en', 'Modern Handrail'),
('project', 1, 'name', 'it', 'Corrimano Moderno'),
('project', 1, 'description', 'es', 'Pasamanos de hierro negro con diseño minimalista'),
('project', 1, 'description', 'en', 'Black iron handrail with minimalist design'),
('project', 1, 'description', 'it', 'Corrimano in ferro nero con design minimalista'),

('project', 2, 'name', 'es', 'Barandilla en Escalera'),
('project', 2, 'name', 'en', 'Stair Railing'),
('project', 2, 'name', 'it', 'Ringhiera per Scale'),
('project', 2, 'description', 'es', 'Barandilla elegante para escalera interior'),
('project', 2, 'description', 'en', 'Elegant railing for interior stairs'),
('project', 2, 'description', 'it', 'Ringhiera elegante per scale interne'),

('project', 3, 'name', 'es', 'Barandilla de Terraza'),
('project', 3, 'name', 'en', 'Terrace Railing'),
('project', 3, 'name', 'it', 'Ringhiera per Terrazzo'),
('project', 3, 'description', 'es', 'Barandilla exterior resistente a la intemperie'),
('project', 3, 'description', 'en', 'Weather-resistant outdoor railing'),
('project', 3, 'description', 'it', 'Ringhiera esterna resistente alle intemperie');

-- BBQ Projects
INSERT INTO public.projects (category_id, slug, display_order, is_active) VALUES
(2, 'rustic-bbq', 1, true),
(2, 'bbq-with-hood', 2, true);

INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('project', 4, 'name', 'es', 'Barbacoa Rústica'),
('project', 4, 'name', 'en', 'Rustic BBQ'),
('project', 4, 'name', 'it', 'Barbecue Rustico'),
('project', 4, 'description', 'es', 'Barbacoa de hierro con acabado rústico'),
('project', 4, 'description', 'en', 'Iron BBQ with rustic finish'),
('project', 4, 'description', 'it', 'Barbecue in ferro con finitura rustica'),

('project', 5, 'name', 'es', 'Barbacoa con Campana'),
('project', 5, 'name', 'en', 'BBQ with Hood'),
('project', 5, 'name', 'it', 'Barbecue con Cappa'),
('project', 5, 'description', 'es', 'Barbacoa de acero inoxidable con campana extractora'),
('project', 5, 'description', 'en', 'Stainless steel BBQ with extractor hood'),
('project', 5, 'description', 'it', 'Barbecue in acciaio inox con cappa aspirante');

-- Furniture Projects
INSERT INTO public.projects (category_id, slug, display_order, is_active) VALUES
(9, 'industrial-table', 1, true),
(9, 'modular-shelving', 2, true);

INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('project', 6, 'name', 'es', 'Mesa Industrial'),
('project', 6, 'name', 'en', 'Industrial Table'),
('project', 6, 'name', 'it', 'Tavolo Industriale'),
('project', 6, 'description', 'es', 'Mesa de comedor con estructura de hierro y tapa de madera'),
('project', 6, 'description', 'en', 'Dining table with iron structure and wooden top'),
('project', 6, 'description', 'it', 'Tavolo da pranzo con struttura in ferro e piano in legno'),

('project', 7, 'name', 'es', 'Estantería Modular'),
('project', 7, 'name', 'en', 'Modular Shelving'),
('project', 7, 'name', 'it', 'Scaffalatura Modulare'),
('project', 7, 'description', 'es', 'Sistema de estanterías de hierro negro'),
('project', 7, 'description', 'en', 'Black iron shelving system'),
('project', 7, 'description', 'it', 'Sistema di scaffalature in ferro nero');

-- =====================================================
-- 4. SAMPLE PRODUCTS
-- =====================================================

INSERT INTO public.products (category_id, slug, price, is_featured, is_active, display_order) VALUES
(9, 'industrial-coffee-table', 450.00, true, true, 1),
(9, 'loft-shelving', 650.00, true, true, 2),
(1, 'custom-railing', 120.00, false, true, 3),
(8, 'large-round-mirror', 280.00, true, true, 4);

-- Product Translations
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('product', 1, 'name', 'es', 'Mesa de Centro Industrial'),
('product', 1, 'name', 'en', 'Industrial Coffee Table'),
('product', 1, 'name', 'it', 'Tavolino Industriale'),
('product', 1, 'description', 'es', 'Mesa de centro con estructura de hierro negro mate y tapa de madera recuperada. Dimensiones: 120x60x45cm'),
('product', 1, 'description', 'en', 'Coffee table with matte black iron structure and reclaimed wood top. Dimensions: 120x60x45cm'),
('product', 1, 'description', 'it', 'Tavolino con struttura in ferro nero opaco e piano in legno recuperato. Dimensioni: 120x60x45cm'),

('product', 2, 'name', 'es', 'Estantería Loft'),
('product', 2, 'name', 'en', 'Loft Shelving'),
('product', 2, 'name', 'it', 'Scaffalatura Loft'),
('product', 2, 'description', 'es', 'Sistema de estanterías estilo loft con 5 baldas de madera y estructura de hierro. Dimensiones: 180x100x30cm'),
('product', 2, 'description', 'en', 'Loft style shelving system with 5 wooden shelves and iron structure. Dimensions: 180x100x30cm'),
('product', 2, 'description', 'it', 'Sistema scaffalature stile loft con 5 ripiani in legno e struttura in ferro. Dimensioni: 180x100x30cm'),

('product', 3, 'name', 'es', 'Barandilla Personalizada'),
('product', 3, 'name', 'en', 'Custom Railing'),
('product', 3, 'name', 'it', 'Ringhiera Personalizzata'),
('product', 3, 'description', 'es', 'Barandilla de hierro forjado hecha a medida. Precio por metro lineal. Instalación incluida.'),
('product', 3, 'description', 'en', 'Custom wrought iron railing. Price per linear meter. Installation included.'),
('product', 3, 'description', 'it', 'Ringhiera in ferro battuto su misura. Prezzo al metro lineare. Installazione inclusa.'),

('product', 4, 'name', 'es', 'Espejo Redondo Grande'),
('product', 4, 'name', 'en', 'Large Round Mirror'),
('product', 4, 'name', 'it', 'Specchio Rotondo Grande'),
('product', 4, 'description', 'es', 'Espejo circular de 80cm de diámetro con marco de hierro negro. Perfecto para recibidor o baño.'),
('product', 4, 'description', 'en', 'Circular mirror 80cm diameter with black iron frame. Perfect for hallway or bathroom.'),
('product', 4, 'description', 'it', 'Specchio circolare diametro 80cm con cornice in ferro nero. Perfetto per ingresso o bagno.');

-- =====================================================
-- 5. SITE CONTENT
-- =====================================================

INSERT INTO public.site_content (section, key, value, content_type) VALUES
('home', 'hero-image', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200', 'image'),
('home', 'company-logo', '/assets/logo.png', 'image'),
('contact', 'address', 'Calle Principal 123, Ibiza, España', 'text'),
('contact', 'phone', '+34 971 123 456', 'text'),
('contact', 'email', 'info@beltrame.com', 'text');

-- Site Content Translations
INSERT INTO public.translations (entity_type, entity_id, field_name, language_code, value) VALUES
('site_content', 1, 'value', 'es', 'Beltrame - Herrería Artesanal'),
('site_content', 1, 'value', 'en', 'Beltrame - Artisan Metalwork'),
('site_content', 1, 'value', 'it', 'Beltrame - Ferreria Artigianale'),

('site_content', 2, 'value', 'es', 'Transformando el hierro en obras de arte desde 1995'),
('site_content', 2, 'value', 'en', 'Transforming iron into works of art since 1995'),
('site_content', 2, 'value', 'it', 'Trasformando il ferro in opere d''arte dal 1995');

-- =====================================================
-- 6. WHATSAPP CONFIGURATION
-- =====================================================

UPDATE public.whatsapp_config 
SET 
    phone_number = '+34971123456',
    default_message = 'Hello, I would like more information about your metalwork services.',
    is_active = true
WHERE id = 1;

-- =====================================================
-- END OF SAMPLE DATA
-- =====================================================
-- You can now start the application and see the sample data!
-- =====================================================
