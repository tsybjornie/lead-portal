/**
 * Recommendation Log
 * Track designer recommendations and client decisions for liability protection
 */

export type RecommendationType = 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL';
export type ClientDecision = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'DEFERRED';

export interface DesignerRecommendation {
    id: string;
    projectId: string;
    quoteId?: string;

    // What is being recommended
    category: string;
    itemDescription: string;
    estimatedCost: number;

    // Recommendation details
    recommendationType: RecommendationType;
    designerNotes: string;
    designerName: string;
    createdAt: string;

    // Client response
    clientDecision: ClientDecision;
    clientReason?: string;
    clientDecisionDate?: string;

    // Risk acknowledgment (for DECLINED items)
    riskAcknowledgment?: {
        acknowledged: boolean;
        acknowledgmentText: string;
        signatureData?: string; // Base64 signature image or OTP code
        signedAt?: string;
        ipAddress?: string;
    };

    // Follow-up
    followUpDate?: string;
    followUpNotes?: string;
}

// Pre-defined risk acknowledgment texts by category
export const RISK_ACKNOWLEDGMENTS: Record<string, string> = {
    'waterproofing':
        'I understand that by declining the recommended waterproofing, I accept full responsibility for any water damage, leakage, or related issues that may occur. I acknowledge that this recommendation was made by my designer and I have chosen not to proceed despite the associated risks.',

    'electrical-upgrade':
        'I understand that by declining the recommended electrical upgrade, I accept that the existing electrical system may not support additional load. I acknowledge the fire and safety risks associated with overloaded circuits.',

    'hacking-inspection':
        'I understand that by declining the recommended concealed works inspection, any hidden defects (water pipes, wiring, structural issues) discovered during renovation may result in additional costs and timeline delays.',

    'structural':
        'I acknowledge that by declining the recommended structural assessment, I accept responsibility for any structural issues that may arise. I understand that modifications without proper assessment may affect building integrity.',

    'default':
        'I understand that by declining this recommendation from my designer, I accept the associated risks and consequences. I acknowledge that this decision is my own and I release the design firm from liability related to this specific item.'
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function createRecommendation(
    projectId: string,
    category: string,
    itemDescription: string,
    estimatedCost: number,
    recommendationType: RecommendationType,
    designerNotes: string,
    designerName: string
): DesignerRecommendation {
    return {
        id: `REC-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        projectId,
        category,
        itemDescription,
        estimatedCost,
        recommendationType,
        designerNotes,
        designerName,
        createdAt: new Date().toISOString(),
        clientDecision: 'PENDING'
    };
}

export function recordClientDecline(
    recommendation: DesignerRecommendation,
    reason: string,
    riskCategory: string = 'default'
): DesignerRecommendation {
    return {
        ...recommendation,
        clientDecision: 'DECLINED',
        clientReason: reason,
        clientDecisionDate: new Date().toISOString(),
        riskAcknowledgment: {
            acknowledged: false,
            acknowledgmentText: RISK_ACKNOWLEDGMENTS[riskCategory] || RISK_ACKNOWLEDGMENTS['default']
        }
    };
}

export function recordRiskAcknowledgment(
    recommendation: DesignerRecommendation,
    signatureData: string,
    ipAddress?: string
): DesignerRecommendation {
    if (!recommendation.riskAcknowledgment) {
        throw new Error('Cannot acknowledge risk without prior decline');
    }

    return {
        ...recommendation,
        riskAcknowledgment: {
            ...recommendation.riskAcknowledgment,
            acknowledged: true,
            signatureData,
            signedAt: new Date().toISOString(),
            ipAddress
        }
    };
}

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

const RECOMMENDATIONS_KEY = 'paddleduck_recommendations';

export function saveRecommendations(recs: DesignerRecommendation[]): boolean {
    if (typeof window === 'undefined') return false;
    try {
        localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(recs));
        return true;
    } catch (e) {
        console.error('[Recommendations] Failed to save:', e);
        return false;
    }
}

export function getRecommendations(): DesignerRecommendation[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(RECOMMENDATIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('[Recommendations] Failed to load:', e);
        return [];
    }
}

export function getRecommendationsByProject(projectId: string): DesignerRecommendation[] {
    return getRecommendations().filter(r => r.projectId === projectId);
}

export function getDeclinedRecommendations(projectId: string): DesignerRecommendation[] {
    return getRecommendationsByProject(projectId).filter(r => r.clientDecision === 'DECLINED');
}

export function getUnacknowledgedDeclines(projectId: string): DesignerRecommendation[] {
    return getDeclinedRecommendations(projectId).filter(
        r => r.riskAcknowledgment && !r.riskAcknowledgment.acknowledged
    );
}
