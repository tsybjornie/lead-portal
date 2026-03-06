/**
 * ReputationEngine.ts
 * 
 * Logic for calculating Karma, processing 360-reviews, 
 * and handling "Rescue" multipliers.
 */


export interface KarmaEvent {
    type: 'POSITIVE_AUDIT' | 'TECHNICAL_DEVIATION' | 'RESCUE_SUCCESS' | 'CLIENT_Conduct_FAIL';
    impact: number;
    isRescue: boolean;
}

export const KARMA_CONFIG = {
    BASE_REWARD: 10,
    RESCUE_MULTIPLIER: 3.0,
    DEAL_BREAKER_PENALTY: -500,
    DECAY_RATE: 0.1, // Points recovered per successful task
    GOLD_THRESHOLD: 800,
    SILVER_THRESHOLD: 500
};

/**
 * Calculates the karma impact of a project event
 */
export function calculateKarmaImpact(event: KarmaEvent): number {
    let impact = event.impact;

    if (event.isRescue && impact > 0) {
        impact *= KARMA_CONFIG.RESCUE_MULTIPLIER;
    }

    return impact;
}

/**
 * Processes a 360-degree review and returns the karma change
 */
export function processReview(ratings: Record<string, number>, traits: string[]): number {
    let score = 0;

    // Sum ratings (1-5 star)
    Object.values(ratings).forEach(val => {
        score += (val - 3) * 5; // 5 stars = +10, 1 star = -10
    });

    // Apply trait penalties
    if (traits.includes('Technical Deviation')) score -= 50;
    if (traits.includes('Safety Risk')) score -= 100;
    if (traits.includes('Masterpiece Potential')) score += 50;

    return score;
}

/**
 * Determines the "Karma Tier" based on score
 */
export function getKarmaTier(score: number): 'GOLD' | 'SILVER' | 'BRONZE' | 'RISK' {
    if (score >= KARMA_CONFIG.GOLD_THRESHOLD) return 'GOLD';
    if (score >= KARMA_CONFIG.SILVER_THRESHOLD) return 'SILVER';
    if (score >= 300) return 'BRONZE';
    return 'RISK';
}
