/**
 * Photoshoot Types  Professional Photography for Reveal
 * 
 * After project handover, designers coordinate professional
 * photoshoots for portfolio content and client memories.
 */

export type PhotoshootStatus =
    | 'not_scheduled'   // Project not yet ready
    | 'pending_handover' // Waiting for handover to complete
    | 'scheduling'      // Coordinating date with photographer
    | 'confirmed'       // Date locked in
    | 'completed'       // Shoot done, editing in progress
    | 'delivered';      // All deliverables sent

export interface PhotoshootPackage {
    id: string;
    name: string;
    description: string;
    photoCount: number;
    videoTour: boolean;
    editingDays: number;
    price: number;
}

export interface PhotoshootDeliverable {
    id: string;
    type: 'photo' | 'video';
    zone: string;
    title: string;
    thumbnailUrl?: string;
    downloadUrl?: string;
    deliveredAt?: string;
}

export interface PhotoshootBooking {
    id: string;
    status: PhotoshootStatus;
    packageId: string;
    packageName: string;
    photographer?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    zones: string[];
    clientPermission: boolean;  // Permission to use in portfolio
    deliverables: PhotoshootDeliverable[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// PACKAGES
// ============================================================
export const PHOTOSHOOT_PACKAGES: PhotoshootPackage[] = [
    {
        id: 'standard',
        name: 'Standard',
        description: '20 professionally edited photos covering all zones',
        photoCount: 20,
        videoTour: false,
        editingDays: 5,
        price: 350,
    },
    {
        id: 'premium',
        name: 'Premium',
        description: '40 edited photos + 1 cinematic video tour',
        photoCount: 40,
        videoTour: true,
        editingDays: 7,
        price: 680,
    },
    {
        id: 'editorial',
        name: 'Editorial',
        description: '60 magazine-grade photos + video tour + drone exterior',
        photoCount: 60,
        videoTour: true,
        editingDays: 10,
        price: 1200,
    },
];

// ============================================================
// PHOTOGRAPHERS (sample)
// ============================================================
export const PHOTOGRAPHERS = [
    { id: 'ph-1', name: 'Marcus Lim', specialty: 'Interior & Architecture', rating: 4.9 },
    { id: 'ph-2', name: 'Rachel Ng', specialty: 'Lifestyle & Residential', rating: 4.8 },
    { id: 'ph-3', name: 'Studio Noire', specialty: 'Commercial & Editorial', rating: 4.7 },
];

// ============================================================
// HELPERS
// ============================================================
export function createPhotoshootBooking(packageId: string = 'standard'): PhotoshootBooking {
    const pkg = PHOTOSHOOT_PACKAGES.find(p => p.id === packageId) || PHOTOSHOOT_PACKAGES[0];
    return {
        id: `shoot_${Date.now()}`,
        status: 'pending_handover',
        packageId: pkg.id,
        packageName: pkg.name,
        zones: [],
        clientPermission: true,
        deliverables: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}
