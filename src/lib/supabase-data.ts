import { supabase } from './supabase';

// ============================================================
// PROJECTS
// ============================================================

export interface Project {
    id: string;
    designer_id: string;
    client_name: string;
    client_email?: string;
    client_phone?: string;
    property_type?: string;
    property_address?: string;
    budget_min?: number;
    budget_max?: number;
    style?: string;
    status: string; // lead, quoted, signed, active, completed
    timeline_weeks?: number;
    notes?: string;
    lead_id?: string;
    created_at: string;
    updated_at: string;
}

export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getProjects error:', error); return []; }
    return data || [];
}

export async function createProject(project: Partial<Project>): Promise<Project | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('projects')
        .insert({ ...project, designer_id: user.id })
        .select()
        .single();
    if (error) { console.error('createProject error:', error); return null; }
    return data;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) { console.error('updateProject error:', error); return null; }
    return data;
}

// ============================================================
// QUOTES
// ============================================================

export interface Quote {
    id: string;
    project_id?: string;
    designer_id: string;
    serial: string;
    status: string; // DRAFT, SENT, REVISION, SIGNED, PAID
    doc_type: string; // QO, VO
    version: number;
    sections: any[]; // Full TradeSection[] as JSON
    total: number;
    gst_rate: number;
    client_budget?: number;
    share_code?: string;
    created_at: string;
    updated_at: string;
}

export async function getQuotes(projectId?: string): Promise<Quote[]> {
    let query = supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (projectId) query = query.eq('project_id', projectId);
    const { data, error } = await query;
    if (error) { console.error('getQuotes error:', error); return []; }
    return data || [];
}

export async function saveQuote(quote: Partial<Quote>): Promise<Quote | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const payload = { ...quote, designer_id: user.id, updated_at: new Date().toISOString() };

    if (quote.id) {
        // Update existing
        const { data, error } = await supabase
            .from('quotes')
            .update(payload)
            .eq('id', quote.id)
            .select()
            .single();
        if (error) { console.error('saveQuote update error:', error); return null; }
        return data;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('quotes')
            .insert(payload)
            .select()
            .single();
        if (error) { console.error('saveQuote insert error:', error); return null; }
        return data;
    }
}

// ============================================================
// LEADS (read from homeowner_leads)
// ============================================================

export interface HomeownerLead {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
    property_type?: string;
    property_address?: string;
    budget?: string;
    timeline?: string;
    preferred_style?: string;
    notes?: string;
    created_at: string;
}

export async function getLeads(): Promise<HomeownerLead[]> {
    const { data, error } = await supabase
        .from('homeowner_leads')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getLeads error:', error); return []; }
    return data || [];
}

// Convert a lead to a project
export async function convertLeadToProject(lead: HomeownerLead): Promise<Project | null> {
    return createProject({
        client_name: lead.full_name,
        client_email: lead.email,
        client_phone: lead.phone,
        property_type: lead.property_type,
        property_address: lead.property_address,
        budget_min: lead.budget ? parseFloat(lead.budget.replace(/[^0-9.]/g, '')) : undefined,
        style: lead.preferred_style,
        status: 'lead',
        lead_id: lead.id,
        notes: lead.notes,
    });
}

// ============================================================
// PROFILE
// ============================================================

export async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    if (error) { console.error('getProfile error:', error); return null; }
    return data;
}

export async function updateProfile(updates: Record<string, any>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
    if (error) { console.error('updateProfile error:', error); return null; }
    return data;
}
