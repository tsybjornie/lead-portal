// ============================================================
// PROJECT ASSETS  Synced from Roof to Client Dashboard
// ============================================================

export type AssetCategory = 'layout' | 'renders' | 'elevations' | 'materials' | 'documents';

export interface AssetComment {
    id: string;
    text: string;
    author: 'client' | 'designer';
    timestamp: string;
}

export interface ProjectAsset {
    id: string;
    category: AssetCategory;
    title: string;
    description?: string;
    thumbnailUrl?: string;       // Image URL or placeholder
    fileUrl?: string;            // Full-res or PDF link
    zone?: string;               // e.g. "Living Room", "Kitchen"
    status: 'pending' | 'approved' | 'flagged';
    comments: AssetComment[];
    uploadedBy: string;          // Designer name
    uploadedAt: string;          // ISO date
    source: 'Roof' | 'upload' | 'manual';
    fileSize?: number;           // bytes
    mimeType?: string;           // e.g. 'image/jpeg', 'application/pdf'
}

export interface ProjectAssets {
    shareCode: string;
    projectId: string;
    assets: ProjectAsset[];
    lastSyncedAt: string;
}

// ============================================================
// SAMPLE DATA  Demo assets for a 4-Room HDB project
// ============================================================
export const SAMPLE_PROJECT_ASSETS: ProjectAsset[] = [
    // Layout
    {
        id: 'asset-layout-01',
        category: 'layout',
        title: 'Proposed Floor Plan',
        description: 'Furniture layout with spatial flow planning. Living, dining, kitchen integrated open concept.',
        zone: 'Overall',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-01T10:00:00Z',
        source: 'Roof',
    },
    {
        id: 'asset-layout-02',
        category: 'layout',
        title: 'Electrical Point Layout',
        description: 'Power points, switches, data points. Includes USB charging locations.',
        zone: 'Overall',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-01T10:30:00Z',
        source: 'Roof',
    },
    // Renders
    {
        id: 'asset-render-01',
        category: 'renders',
        title: 'Living Room  View A',
        description: 'Main perspective from entrance. Shows TV console, sofa arrangement, and feature wall.',
        zone: 'Living Room',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-02T14:00:00Z',
        source: 'Roof',
    },
    {
        id: 'asset-render-02',
        category: 'renders',
        title: 'Kitchen  Island View',
        description: 'Open concept kitchen with island counter. Integrated hood, induction cooktop.',
        zone: 'Kitchen',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-02T14:30:00Z',
        source: 'Roof',
    },
    {
        id: 'asset-render-03',
        category: 'renders',
        title: 'Master Bedroom',
        description: 'Wardrobe wall with built-in vanity. Bedhead feature with concealed lighting.',
        zone: 'Master Bedroom',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-02T15:00:00Z',
        source: 'Roof',
    },
    // Elevations
    {
        id: 'asset-elev-01',
        category: 'elevations',
        title: 'Living Room  TV Console Elevation',
        description: 'Full height feature wall with concealed storage. Dimensions and material callouts.',
        zone: 'Living Room',
        status: 'pending',
        comments: [],
        uploadedBy: 'James Teo',
        uploadedAt: '2026-03-02T16:00:00Z',
        source: 'Roof',
    },
    {
        id: 'asset-elev-02',
        category: 'elevations',
        title: 'Kitchen  Cabinet Elevation',
        description: 'Upper and lower cabinet layout. Includes appliance cutouts and plumbing rough-in.',
        zone: 'Kitchen',
        status: 'pending',
        comments: [],
        uploadedBy: 'James Teo',
        uploadedAt: '2026-03-02T16:30:00Z',
        source: 'Roof',
    },
    // Materials
    {
        id: 'asset-mat-01',
        category: 'materials',
        title: 'Floor Tile  Carrara Look',
        description: '600x600mm porcelain. Matte finish, non-slip R10 rating.',
        zone: 'Living + Kitchen',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-01T11:00:00Z',
        source: 'Roof',
    },
    {
        id: 'asset-mat-02',
        category: 'materials',
        title: 'Laminate  Walnut Veneer',
        description: 'Anti-fingerprint laminate for all carpentry surfaces. 0.8mm HPL.',
        zone: 'All Rooms',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-01T11:15:00Z',
        source: 'Roof',
    },
    {
        id: 'asset-mat-03',
        category: 'materials',
        title: 'Paint  Dulux White on White',
        description: 'Ceiling and walls. Low VOC, washable finish.',
        zone: 'All Rooms',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-01T11:30:00Z',
        source: 'Roof',
    },
    // Documents
    {
        id: 'asset-doc-01',
        category: 'documents',
        title: 'Site Condition Report',
        description: 'Photos and notes from site visit. Existing condition of walls, floors, ceiling.',
        zone: 'Overall',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-02-28T09:00:00Z',
        source: 'Roof',
    },
    {
        id: 'asset-doc-02',
        category: 'documents',
        title: 'HDB Renovation Permit',
        description: 'Submitted to HDB. Processing ~3 working days.',
        zone: 'Overall',
        status: 'pending',
        comments: [],
        uploadedBy: 'Sarah Lin',
        uploadedAt: '2026-03-01T08:00:00Z',
        source: 'Roof',
    },
];
