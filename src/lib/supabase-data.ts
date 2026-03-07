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

// ============================================================
// PROJECT FILES (Supabase Storage)
// ============================================================

export type FileCategory = 'site_scan' | 'floorplan' | 'render' | 'drawing' | 'document' | 'photo';

export interface ProjectFile {
    id: string;
    project_id: string;
    designer_id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    category: FileCategory;
    notes?: string;
    created_at: string;
    public_url?: string;
}

export async function uploadProjectFile(
    projectId: string,
    file: File,
    category: FileCategory = 'document',
    notes?: string
): Promise<ProjectFile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop() || 'bin';
    const filePath = `${user.id}/${projectId}/${category}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) { console.error('Upload error:', uploadError); return null; }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

    // Save metadata
    const { data, error } = await supabase
        .from('project_files')
        .insert({
            project_id: projectId,
            designer_id: user.id,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            category,
            notes,
        })
        .select()
        .single();

    if (error) { console.error('File metadata save error:', error); return null; }
    return { ...data, public_url: urlData.publicUrl };
}

export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

    if (error) { console.error('getProjectFiles error:', error); return []; }

    // Attach public URLs
    return (data || []).map(f => {
        const { data: urlData } = supabase.storage
            .from('project-files')
            .getPublicUrl(f.file_path);
        return { ...f, public_url: urlData.publicUrl };
    });
}

export async function deleteProjectFile(fileId: string, filePath: string): Promise<boolean> {
    // Delete from storage
    await supabase.storage.from('project-files').remove([filePath]);

    // Delete metadata
    const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

    if (error) { console.error('deleteProjectFile error:', error); return false; }
    return true;
}

// ============================================================
// PENDING SIGNUPS (admin approval)
// ============================================================

export async function getPendingSignups() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });
    if (error) { console.error('getPendingSignups error:', error); return []; }
    return data || [];
}

export async function approveSignup(profileId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .update({ approved: true, approved_at: new Date().toISOString() })
        .eq('id', profileId)
        .select()
        .single();
    if (error) { console.error('approveSignup error:', error); return null; }
    return data;
}

export async function rejectSignup(profileId: string) {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);
    if (error) { console.error('rejectSignup error:', error); return false; }
    return true;
}

