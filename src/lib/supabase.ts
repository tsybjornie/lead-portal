/**
 * Supabase Client
 * 
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * in your .env.local to connect to your Supabase project.
 * 
 * Until those are set, the app operates in offline/localStorage mode.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create a real client if credentials are present
export const supabase: SupabaseClient | null =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null;

export const isSupabaseConfigured = (): boolean => {
    return Boolean(supabaseUrl && supabaseAnonKey);
};

/**
 * Database types matching our schema.sql
 */
export interface DbVendor {
    id: string;
    firm_id: string;
    name: string;
    trade_category: string;
    jurisdiction: 'SG' | 'MY' | 'CROSS_BORDER';
    reliability: 'A' | 'B' | 'C' | 'F';
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    website: string | null;
    payment_terms: string;
    avg_lead_time_days: number;
    defect_rate: number;
    on_time_delivery: number;
    specialties: string[];
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbPricelistItem {
    id: string;
    vendor_id: string;
    item_code: string | null;
    category: string;
    sub_category: string | null;
    description: string;
    material_cost: number;
    labour_cost: number;
    unit: string;
    currency: string;
    tier: 'budget' | 'standard' | 'premium' | 'luxury' | null;
    brand: string | null;
    model: string | null;
    effective_date: string;
    is_current: boolean;
    min_order_qty: number;
    lead_time_days: number;
    delivery_included: boolean;
    delivery_cost: number;
    notes: string | null;
}

export interface DbQuote {
    id: string;
    firm_id: string;
    client_id: string | null;
    quote_number: string;
    version: number;
    status: 'ESTIMATE' | 'DRAFT' | 'SENT' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    project_name: string;
    project_address: string | null;
    property_type: string | null;
    jurisdiction: string;
    sections: unknown;
    zones: unknown;
    subtotal: number;
    gst_amount: number;
    total: number;
    margin: number;
    valid_until: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}
