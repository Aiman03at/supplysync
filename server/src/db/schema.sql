CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('admin', 'manager', 'viewer')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(255) NOT NULL,
  lead_time_days    INT          NOT NULL CHECK (lead_time_days >= 0),
  reliability_score DECIMAL(4,3) NOT NULL CHECK (reliability_score BETWEEN 0 AND 1),
  contact_email     VARCHAR(255) NOT NULL,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255)  NOT NULL,
  sku         VARCHAR(100)  NOT NULL UNIQUE,
  category    VARCHAR(100)  NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  supplier_id UUID          NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warehouses (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  location     VARCHAR(255) NOT NULL,
  capacity     INT          NOT NULL CHECK (capacity > 0),
  manager_name VARCHAR(255) NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID        NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  warehouse_id  UUID        NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity      INT         NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reorder_point INT         NOT NULL DEFAULT 0 CHECK (reorder_point >= 0),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type       VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'sales')),
  status     VARCHAR(50) NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  quantity   INT         NOT NULL CHECK (quantity > 0),
  product_id UUID        NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type       VARCHAR(50) NOT NULL,
  severity   VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  message    TEXT        NOT NULL,
  resolved   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_supplier   ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_deleted    ON products(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_inventory_product   ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_orders_product      ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_product      ON alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved     ON alerts(resolved);
