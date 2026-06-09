-- Seed data for SupplySync — safe to re-run (ON CONFLICT DO NOTHING)

-- ─── suppliers ───────────────────────────────────────────────────────────────
INSERT INTO suppliers (id, name, lead_time_days, reliability_score, contact_email) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'AsiaTech Components',    14, 0.920, 'procurement@asiatech.example.com'),
  ('a1000000-0000-0000-0000-000000000002', 'EuroMed Industrial',     21, 0.875, 'orders@euromed.example.com'),
  ('a1000000-0000-0000-0000-000000000003', 'Gulf Logistics Partners', 7, 0.960, 'supply@gulf-lp.example.com')
ON CONFLICT (id) DO NOTHING;

-- ─── products ────────────────────────────────────────────────────────────────
INSERT INTO products (id, name, sku, category, unit_price, supplier_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Industrial Pressure Sensor', 'SEN-PR-1042', 'Sensors',      149.99, 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000002', 'Hydraulic Control Valve',    'VAL-HC-2210', 'Valves',       389.50, 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000003', 'Conveyor Belt Motor 5kW',    'MOT-CB-5000', 'Motors',       875.00, 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000004', 'Safety Relay Module',        'REL-SF-0330', 'Electronics',   62.75, 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000005', 'Heavy-Duty Storage Rack',    'RAC-HD-8800', 'Storage',      210.00, 'a1000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- ─── warehouses ──────────────────────────────────────────────────────────────
INSERT INTO warehouses (id, name, location, capacity, manager_name) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Dubai Main Warehouse',     'Dubai, UAE',        5000, 'Khalid Al-Rashid'),
  ('c1000000-0000-0000-0000-000000000002', 'Singapore Hub',            'Singapore',         3500, 'Li Wei'),
  ('c1000000-0000-0000-0000-000000000003', 'Frankfurt Distribution',   'Frankfurt, Germany', 4200, 'Anna Müller')
ON CONFLICT (id) DO NOTHING;

-- ─── inventory ───────────────────────────────────────────────────────────────
-- quantity < reorder_point on row 5 intentionally triggers a low-stock alert
INSERT INTO inventory (product_id, warehouse_id, quantity, reorder_point) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 320, 100),
  ('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001',  85, 150),
  ('b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 210,  50),
  ('b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 540, 200),
  ('b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003',  18,  75),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 180, 100)
ON CONFLICT (product_id, warehouse_id) DO NOTHING;

-- ─── orders ──────────────────────────────────────────────────────────────────
INSERT INTO orders (id, type, status, quantity, product_id) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'purchase', 'confirmed',  500, 'b1000000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000002', 'sales',    'shipped',    120, 'b1000000-0000-0000-0000-000000000003'),
  ('d1000000-0000-0000-0000-000000000003', 'purchase', 'pending',    200, 'b1000000-0000-0000-0000-000000000002'),
  ('d1000000-0000-0000-0000-000000000004', 'sales',    'delivered',   60, 'b1000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- ─── alerts ──────────────────────────────────────────────────────────────────
INSERT INTO alerts (id, type, severity, product_id, message, resolved) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'low_stock',       'high',   'b1000000-0000-0000-0000-000000000002',
   'Hydraulic Control Valve stock (85 units) is below reorder point (150) at Dubai Main Warehouse.', FALSE),
  ('e1000000-0000-0000-0000-000000000002', 'low_stock',       'medium', 'b1000000-0000-0000-0000-000000000005',
   'Heavy-Duty Storage Rack stock (18 units) is critically below reorder point (75) at Frankfurt Distribution.', FALSE)
ON CONFLICT (id) DO NOTHING;
