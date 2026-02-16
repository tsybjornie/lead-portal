-- ============================================================
-- NUMBERS / ARC-QUOTE — Supabase Schema
-- Run this in the Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- FIRMS (the design firm using the system)
-- ────────────────────────────────────────────────────────────
CREATE TABLE firms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('SG', 'MY')),
    gst_registered BOOLEAN DEFAULT FALSE,
    gst_rate NUMERIC(4,2) DEFAULT 9,
    gst_number TEXT,
    default_margin_target NUMERIC(4,2) DEFAULT 25,
    logo_url TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    payment_schedule JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- CLIENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    property_type TEXT CHECK (property_type IN ('hdb', 'condo', 'landed', 'commercial')),
    property_address TEXT,
    notes TEXT,
    source TEXT, -- 'referral', 'website', 'social', 'walk-in'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- VENDORS / SUPPLIERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trade_category TEXT NOT NULL, -- matches TradeCategory
    jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('SG', 'MY', 'CROSS_BORDER')),
    reliability TEXT DEFAULT 'B' CHECK (reliability IN ('A', 'B', 'C', 'F')),
    
    -- Contact
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    website TEXT,
    
    -- Business details
    uen_number TEXT,           -- SG Unique Entity Number
    ssm_number TEXT,           -- MY SSM number
    payment_terms TEXT DEFAULT 'Net 30',
    credit_limit NUMERIC(12,2),
    
    -- Performance
    avg_lead_time_days INTEGER DEFAULT 14,
    defect_rate NUMERIC(4,2) DEFAULT 0,   -- percentage
    on_time_delivery NUMERIC(4,2) DEFAULT 85, -- percentage
    
    -- Notes
    specialties TEXT[],        -- e.g. ['laminate', 'solid surface', 'quartz']
    notes TEXT,
    hidden_pain_fields JSONB DEFAULT '{}'::JSONB,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendors_trade ON vendors(trade_category);
CREATE INDEX idx_vendors_jurisdiction ON vendors(jurisdiction);

-- ────────────────────────────────────────────────────────────
-- VENDOR PRICELISTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE vendor_pricelists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    
    -- Item identification
    item_code TEXT,            -- vendor's SKU or code
    category TEXT NOT NULL,    -- matches TradeCategory
    sub_category TEXT,         -- e.g. 'wall_tiling', 'base_cabinet'
    description TEXT NOT NULL, -- full item description
    
    -- Pricing
    material_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    labour_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'pcs', -- MeasurementUnit
    currency TEXT NOT NULL DEFAULT 'SGD',
    
    -- Tiers (for materials with quality grades)
    tier TEXT CHECK (tier IN ('budget', 'standard', 'premium', 'luxury')),
    brand TEXT,                -- e.g. 'Hafele', 'Blum', 'Nippon'
    model TEXT,
    
    -- Validity
    effective_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    
    -- Logistics
    min_order_qty NUMERIC(8,2) DEFAULT 1,
    lead_time_days INTEGER DEFAULT 7,
    delivery_included BOOLEAN DEFAULT FALSE,
    delivery_cost NUMERIC(8,2) DEFAULT 0,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pricelists_vendor ON vendor_pricelists(vendor_id);
CREATE INDEX idx_pricelists_category ON vendor_pricelists(category);
CREATE INDEX idx_pricelists_current ON vendor_pricelists(is_current);

-- ────────────────────────────────────────────────────────────
-- QUOTES
-- ────────────────────────────────────────────────────────────
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES firms(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    quote_number TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ESTIMATE' CHECK (status IN ('ESTIMATE', 'DRAFT', 'SENT', 'NEGOTIATING', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    
    project_name TEXT NOT NULL,
    project_address TEXT,
    property_type TEXT CHECK (property_type IN ('hdb', 'condo', 'landed', 'commercial')),
    jurisdiction TEXT DEFAULT 'SG',
    
    -- Data
    sections JSONB NOT NULL DEFAULT '[]'::JSONB,   -- TradeSection[]
    zones JSONB DEFAULT '[]'::JSONB,               -- Zone[]
    
    -- Totals
    subtotal NUMERIC(12,2) DEFAULT 0,
    gst_amount NUMERIC(12,2) DEFAULT 0,
    total NUMERIC(12,2) DEFAULT 0,
    margin NUMERIC(4,2) DEFAULT 0,
    
    -- History
    history JSONB DEFAULT '[]'::JSONB,             -- QuoteSnapshot[]
    
    -- Metadata
    valid_until DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quotes_firm ON quotes(firm_id);
CREATE INDEX idx_quotes_client ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(status);

-- ────────────────────────────────────────────────────────────
-- VARIATION ORDERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE variation_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    
    vo_number TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'INVOICED')),
    
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    
    subtotal NUMERIC(12,2) DEFAULT 0,
    gst_amount NUMERIC(12,2) DEFAULT 0,
    total NUMERIC(12,2) DEFAULT 0,
    
    original_contract_sum NUMERIC(12,2),
    revised_contract_sum NUMERIC(12,2),
    
    created_by TEXT,
    client_approval_date TIMESTAMPTZ,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- RLS POLICIES (Row Level Security)
-- ────────────────────────────────────────────────────────────
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_pricelists ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE variation_orders ENABLE ROW LEVEL SECURITY;

-- Basic policy: authenticated users can read/write their firm's data
-- (In production, add firm_id matching via auth.jwt()→firm_id claim)

CREATE POLICY "Authenticated users can manage firms"
    ON firms FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage clients"
    ON clients FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage vendors"
    ON vendors FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage pricelists"
    ON vendor_pricelists FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage quotes"
    ON quotes FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage VOs"
    ON variation_orders FOR ALL TO authenticated USING (true);

-- ────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON firms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricelists_updated_at BEFORE UPDATE ON vendor_pricelists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vos_updated_at BEFORE UPDATE ON variation_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
