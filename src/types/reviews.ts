/**
 * Reviews & Quality Types
 * 
 * Customer feedback, vendor workmanship quality, and defect tracking
 */

// ============================================================
// CUSTOMER REVIEWS
// ============================================================

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface CustomerReview {
    id: string;
    projectId: string;
    projectName: string;
    clientId: string;
    clientName: string;
    designerId: string;
    designerName: string;

    // Ratings (1-5)
    overallRating: ReviewRating;
    designRating: ReviewRating;
    workmanshipRating: ReviewRating;
    communicationRating: ReviewRating;
    timelinessRating: ReviewRating;
    valueRating: ReviewRating;

    // Feedback
    testimonial?: string;
    wouldRecommend: boolean;

    // Metadata
    submittedAt: string;
    isPublic: boolean;           // Can be used for marketing
    followUpRequired: boolean;   // Flag for negative reviews
}

// ============================================================
// VENDOR WORKMANSHIP
// ============================================================

export type WorkmanshipGrade = 'excellent' | 'good' | 'acceptable' | 'poor' | 'rejected';
export type DefectSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'disputed';

export interface VendorWorkmanshipReview {
    id: string;
    vendorId: string;
    vendorName: string;
    projectId: string;
    projectName: string;
    tradeCategory: string;       // e.g., 'carpentry', 'electrical'

    // Assessment
    grade: WorkmanshipGrade;
    qualityScore: number;        // 0-100

    // Specifics
    punctuality: ReviewRating;   // On-time delivery
    cleanliness: ReviewRating;   // Site cleanliness
    compliance: ReviewRating;    // Followed specs
    responsiveness: ReviewRating; // Issue resolution speed

    // Notes
    notes?: string;
    photos?: string[];           // Before/after or issue photos

    // Metadata
    reviewedBy: string;          // Designer/PM who reviewed
    reviewedAt: string;
}

export interface DefectReport {
    id: string;
    vendorId: string;
    vendorName: string;
    projectId: string;
    projectName: string;

    // Defect Details
    category: string;            // e.g., 'finish', 'alignment', 'material', 'function'
    description: string;
    location: string;            // Where in the project
    severity: DefectSeverity;

    // Evidence
    photos: string[];
    discoveredAt: string;
    discoveredBy: string;

    // Resolution
    status: DefectStatus;
    assignedTo?: string;
    estimatedResolutionDate?: string;
    resolvedAt?: string;
    resolutionNotes?: string;
    costToRectify?: number;
    chargedToVendor: boolean;

    // Impact
    delayedProject: boolean;
    delayDays?: number;
    affectedClaim?: string;      // If it delayed a progress claim
}

// ============================================================
// VENDOR QUALITY SUMMARY
// ============================================================

export interface VendorQualitySummary {
    vendorId: string;
    vendorName: string;
    tradeCategories: string[];

    // Aggregate Scores
    overallScore: number;        // 0-100
    totalProjects: number;
    activeProjects: number;

    // Breakdown
    qualityScores: {
        workmanship: number;
        punctuality: number;
        cleanliness: number;
        compliance: number;
        responsiveness: number;
    };

    // Defect Stats
    defects: {
        total: number;
        open: number;
        resolved: number;
        avgResolutionDays: number;
    };

    // Trend
    trend: 'improving' | 'stable' | 'declining';
    lastReviewDate: string;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getGradeColor(grade: WorkmanshipGrade): string {
    switch (grade) {
        case 'excellent': return 'text-green-600 bg-green-50';
        case 'good': return 'text-blue-600 bg-blue-50';
        case 'acceptable': return 'text-amber-600 bg-amber-50';
        case 'poor': return 'text-orange-600 bg-orange-50';
        case 'rejected': return 'text-red-600 bg-red-50';
    }
}

export function getSeverityColor(severity: DefectSeverity): string {
    switch (severity) {
        case 'minor': return 'text-gray-600 bg-gray-100';
        case 'moderate': return 'text-amber-600 bg-amber-50';
        case 'major': return 'text-orange-600 bg-orange-50';
        case 'critical': return 'text-red-600 bg-red-50';
    }
}

export function getStatusColor(status: DefectStatus): string {
    switch (status) {
        case 'open': return 'text-red-600 bg-red-50';
        case 'in_progress': return 'text-amber-600 bg-amber-50';
        case 'resolved': return 'text-green-600 bg-green-50';
        case 'disputed': return 'text-purple-600 bg-purple-50';
    }
}

export function calculateAverageRating(review: CustomerReview): number {
    const ratings = [
        review.overallRating,
        review.designRating,
        review.workmanshipRating,
        review.communicationRating,
        review.timelinessRating,
        review.valueRating,
    ];
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

export function getRatingStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}
