-- customers.sql : εκτέλεσε στο Supabase SQL editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(255),
  floor VARCHAR(64),
  buzzer VARCHAR(64),
  address_text TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers (phone);
