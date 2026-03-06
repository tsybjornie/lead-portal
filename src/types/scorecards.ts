/**
 * Designer Scorecard & Homeowner Workmanship Checklist
 * 
 * Two separate grading systems:
 * 1. DESIGNER SCORECARD  Auto-calculated from platform data (pro metrics)
 * 2. WORKMANSHIP CHECKLIST  Simple yes/no questions homeowners CAN answer
 * 
 * The platform catches lousy designers and bad vendors separately.
 * A great designer with a bad carpenter  good design score, bad workmanship on carpentry.
 */

import { TradeCategory } from './trades';

// ============================================================
// HOMEOWNER WORKMANSHIP CHECKLIST
// Simple yes/no visual questions  homeowners don't need reno knowledge
// ============================================================

export interface WorkmanshipQuestion {
    id: string;
    trade: TradeCategory;
    question: string;              // Plain English  no jargon
    category: 'fit' | 'finish' | 'function' | 'safety';
    weight: number;                // 1-3 importance (3 = critical)
}

export interface WorkmanshipAnswer {
    questionId: string;
    answer: boolean | null;        // true = pass, false = fail, null = not applicable
    photoUrl?: string;             // Optional evidence photo
    comment?: string;
}

export interface WorkmanshipReport {
    projectId: string;
    zone: string;
    trade: TradeCategory;
    vendorId?: string;
    vendorName?: string;
    answers: WorkmanshipAnswer[];
    overallScore: number;          // 0-100, auto-calculated from weighted answers
    submittedBy: string;           // "client" | "designer" | "inspector"
    submittedAt: string;
    photos: string[];              // General photos of the work
}

// ============================================================
// TRADE-SPECIFIC QUESTIONS (Homeowner-friendly language)
// ============================================================

export const WORKMANSHIP_QUESTIONS: WorkmanshipQuestion[] = [
    // --- CARPENTRY ---
    { id: 'carp-01', trade: 'carpentry', question: 'Do all cabinet doors close flush without gaps?', category: 'fit', weight: 3 },
    { id: 'carp-02', trade: 'carpentry', question: 'Do drawers slide smoothly and close softly?', category: 'function', weight: 3 },
    { id: 'carp-03', trade: 'carpentry', question: 'Is the laminate/surface even with no bubbles or peeling?', category: 'finish', weight: 2 },
    { id: 'carp-04', trade: 'carpentry', question: 'Are there any visible gaps between cabinet and wall?', category: 'fit', weight: 2 },
    { id: 'carp-05', trade: 'carpentry', question: 'Is the colour/material what was agreed upon?', category: 'finish', weight: 3 },
    { id: 'carp-06', trade: 'carpentry', question: 'Are all handles and knobs secure and aligned?', category: 'function', weight: 1 },

    // --- MASONRY / TILING ---
    { id: 'tile-01', trade: 'masonry', question: 'Are the tiles level  no lippage you can feel when walking?', category: 'fit', weight: 3 },
    { id: 'tile-02', trade: 'masonry', question: 'Are the grout lines even and consistent?', category: 'finish', weight: 2 },
    { id: 'tile-03', trade: 'masonry', question: 'Do any tiles sound hollow when you knock on them?', category: 'function', weight: 3 },
    { id: 'tile-04', trade: 'masonry', question: 'Are the tile edges at doorways/corners neatly trimmed?', category: 'finish', weight: 2 },
    { id: 'tile-05', trade: 'masonry', question: 'Does the tile pattern match the approved design?', category: 'finish', weight: 2 },

    // --- PAINTING ---
    { id: 'paint-01', trade: 'painting', question: 'Is the paint colour even across the whole wall?', category: 'finish', weight: 3 },
    { id: 'paint-02', trade: 'painting', question: 'Are there any drips, runs, or brush marks?', category: 'finish', weight: 2 },
    { id: 'paint-03', trade: 'painting', question: 'Are the edges clean where wall meets ceiling/trim?', category: 'fit', weight: 2 },
    { id: 'paint-04', trade: 'painting', question: 'Is the correct colour used (compared to swatch)?', category: 'finish', weight: 3 },

    // --- PLUMBING ---
    { id: 'plumb-01', trade: 'plumbing', question: 'Does the tap drip after being fully closed?', category: 'function', weight: 3 },
    { id: 'plumb-02', trade: 'plumbing', question: 'Does water drain quickly without pooling?', category: 'function', weight: 3 },
    { id: 'plumb-03', trade: 'plumbing', question: 'Is the water pressure satisfactory for shower/taps?', category: 'function', weight: 2 },
    { id: 'plumb-04', trade: 'plumbing', question: 'Are all fixtures secure and not wobbly?', category: 'fit', weight: 2 },
    { id: 'plumb-05', trade: 'plumbing', question: 'Is the toilet flush working properly?', category: 'function', weight: 3 },

    // --- ELECTRICAL ---
    { id: 'elec-01', trade: 'electrical', question: 'Are all power points and switches working?', category: 'function', weight: 3 },
    { id: 'elec-02', trade: 'electrical', question: 'Are switches and sockets level and properly aligned?', category: 'fit', weight: 2 },
    { id: 'elec-03', trade: 'electrical', question: 'Are switches/sockets where you expected them to be?', category: 'function', weight: 3 },
    { id: 'elec-04', trade: 'electrical', question: 'Are all lights working and the correct colour temperature?', category: 'function', weight: 2 },
    { id: 'elec-05', trade: 'electrical', question: 'Is there any exposed wiring or loose fittings?', category: 'safety', weight: 3 },

    // --- CEILING ---
    { id: 'ceil-01', trade: 'ceiling', question: 'Is the ceiling surface smooth with no visible joints?', category: 'finish', weight: 2 },
    { id: 'ceil-02', trade: 'ceiling', question: 'Are the ceiling edges sharp and straight?', category: 'fit', weight: 2 },
    { id: 'ceil-03', trade: 'ceiling', question: 'Are all downlights/fixtures properly recessed?', category: 'fit', weight: 2 },

    // --- GLASS ---
    { id: 'glass-01', trade: 'glassworks', question: 'Are the glass panels clean with no scratches?', category: 'finish', weight: 2 },
    { id: 'glass-02', trade: 'glassworks', question: 'Does the shower screen door close securely?', category: 'function', weight: 3 },
    { id: 'glass-03', trade: 'glassworks', question: 'Are glass edges smooth (no sharp spots)?', category: 'safety', weight: 3 },

    // --- WATERPROOFING ---
    { id: 'wp-01', trade: 'waterproofing', question: 'Is there any water seeping outside the bathroom?', category: 'function', weight: 3 },
    { id: 'wp-02', trade: 'waterproofing', question: 'Does the bathroom floor drain without pooling?', category: 'function', weight: 3 },

    // --- METALWORKS ---
    { id: 'metal-01', trade: 'metalworks', question: 'Are railings secure  no wobbling when pushed?', category: 'safety', weight: 3 },
    { id: 'metal-02', trade: 'metalworks', question: 'Is the metal finish even with no rust spots?', category: 'finish', weight: 2 },

    // --- AIRCON ---
    { id: 'ac-01', trade: 'aircon', question: 'Does the aircon cool the room adequately?', category: 'function', weight: 3 },
    { id: 'ac-02', trade: 'aircon', question: 'Is the trunking neatly installed and aligned?', category: 'fit', weight: 1 },
    { id: 'ac-03', trade: 'aircon', question: 'Is there any water dripping from the unit or trunking?', category: 'function', weight: 3 },
];

// ============================================================
// DESIGNER SCORECARD  Auto-calculated from platform data
// ============================================================

export interface DesignerScorecard {
    designerId: string;
    designerName: string;

    // From Roof (elevation data)
    elevationCompleteness: number;       // 0-100: % of elements with full specs
    totalElevationsProduced: number;

    // From Roof (quote accuracy)
    specAccuracy: number;                // 0-100: % of specs that didn't cause change orders
    budgetAccuracy: number;              // 0-100: quote vs actual spend
    totalProjectsQuoted: number;

    // From Inspect (snag attribution)
    designerSnagRate: number;            // % of snags attributed to designer error
    totalSnags: number;

    // From Reveal (completed portfolio)
    portfolioProjects: number;           // Completed photoshoots
    clientSatisfaction: number;          // 0-5, from workmanship checklist (design-related questions)

    // Change order attribution
    changeOrdersDesignerError: number;   // Change orders caused by designer mistakes
    changeOrdersTotal: number;           // Total change orders across all projects

    // Computed
    overallScore: number;                // 0-100 weighted composite
    tier: 'emerging' | 'competent' | 'skilled' | 'expert' | 'master';

    lastUpdated: string;
}

// ============================================================
// VENDOR SCORECARD  Auto-calculated per trade vendor
// ============================================================

export interface VendorScorecard {
    vendorId: string;
    vendorName: string;
    trade: TradeCategory;

    // From Roof (project management)
    onTimeDeliveryRate: number;          // 0-100: % of tasks completed on/before deadline
    totalTasksCompleted: number;

    // From Inspect (defects)
    defectRate: number;                  // % of items with workmanship defects
    totalItemsInstalled: number;

    // From Homeowner checklist
    workmanshipScore: number;            // 0-100 from yes/no checklist
    totalReviews: number;

    // Change order attribution
    changeOrdersVendorError: number;     // Vendor-caused change orders
    acknowledgeRate: number;             // % of elevation packs acknowledged on time

    // Computed
    overallScore: number;
    reliability: 'A' | 'B' | 'C';

    lastUpdated: string;
}

// ============================================================
// SCORING HELPERS
// ============================================================

/** Calculate workmanship score from homeowner answers */
export function calculateWorkmanshipScore(answers: WorkmanshipAnswer[]): number {
    const questions = WORKMANSHIP_QUESTIONS;
    let totalWeight = 0;
    let earnedWeight = 0;

    for (const answer of answers) {
        if (answer.answer === null) continue; // Skip N/A
        const question = questions.find(q => q.id === answer.questionId);
        if (!question) continue;
        totalWeight += question.weight;
        // For negative questions (hollow tiles, dripping tap)  false = good
        const isNegativeQuestion = question.question.includes('drip') ||
            question.question.includes('hollow') ||
            question.question.includes('exposed') ||
            question.question.includes('gaps') ||
            question.question.includes('bubbles') ||
            question.question.includes('marks') ||
            question.question.includes('seeping') ||
            question.question.includes('wobbl') ||
            question.question.includes('rust');
        const pass = isNegativeQuestion ? !answer.answer : answer.answer;
        if (pass) earnedWeight += question.weight;
    }

    return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

/** Get questions for a specific trade */
export function getQuestionsForTrade(trade: TradeCategory): WorkmanshipQuestion[] {
    return WORKMANSHIP_QUESTIONS.filter(q => q.trade === trade);
}

/** Calculate designer tier from score */
export function getDesignerTier(score: number): DesignerScorecard['tier'] {
    if (score >= 95) return 'master';
    if (score >= 85) return 'expert';
    if (score >= 70) return 'skilled';
    if (score >= 50) return 'competent';
    return 'emerging';
}

/** Calculate composite designer score */
export function calculateDesignerScore(scorecard: Omit<DesignerScorecard, 'overallScore' | 'tier' | 'lastUpdated'>): { score: number; tier: DesignerScorecard['tier'] } {
    // Weights: elevation completeness (25%), spec accuracy (25%), budget accuracy (20%), client satisfaction (20%), low snag rate (10%)
    const score = Math.round(
        scorecard.elevationCompleteness * 0.25 +
        scorecard.specAccuracy * 0.25 +
        scorecard.budgetAccuracy * 0.20 +
        (scorecard.clientSatisfaction / 5 * 100) * 0.20 +
        (100 - scorecard.designerSnagRate) * 0.10
    );
    return { score, tier: getDesignerTier(score) };
}
