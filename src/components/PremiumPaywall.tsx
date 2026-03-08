'use client';

import React from 'react';
import { useSubscription, PLANS, SubscriptionTier } from '@/context/SubscriptionContext';

// ============================================================
// PREMIUM PAYWALL — Beautiful pricing gate for Material Encyclopedia
// Shows when user tries to access locked features
// ============================================================

const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

export default function PremiumPaywall({ onClose, requiredTier = 'pro' }: { onClose?: () => void; requiredTier?: SubscriptionTier }) {
    const { upgradeTo, tier: currentTier, setDemoTier } = useSubscription();

    const tierOrder: SubscriptionTier[] = ['free', 'pro', 'studio'];
    const currentIndex = tierOrder.indexOf(currentTier);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: f, padding: 20,
        }}>
            <div style={{
                background: '#fff', borderRadius: 16, maxWidth: 900, width: '100%',
                maxHeight: '90vh', overflowY: 'auto', position: 'relative',
            }}>
                {/* Close button */}
                {onClose && (
                    <button onClick={onClose} style={{
                        position: 'absolute', top: 16, right: 16, width: 32, height: 32,
                        borderRadius: '50%', border: '1px solid #E9E9E7', background: '#fff',
                        cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#6B6A67',
                    }}>×</button>
                )}

                {/* Header */}
                <div style={{ padding: '40px 40px 0', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block', fontSize: 9, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.15em',
                        padding: '4px 12px', borderRadius: 20,
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        color: '#fff', marginBottom: 12,
                    }}>Premium</div>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#37352F', margin: '8px 0 0', letterSpacing: '-0.02em' }}>
                        Unlock the World&apos;s Most Complete<br />Material Encyclopedia
                    </h2>
                    <p style={{ fontSize: 14, color: '#9B9A97', margin: '12px 0 0', lineHeight: 1.6, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
                        500+ materials, 80+ world motifs, supplier pricing, logistics data, and designer markup calculators.
                        Built for interior designers who want unfair advantage.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div style={{ padding: '32px 40px 40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {PLANS.map((plan, idx) => {
                        const isCurrentPlan = plan.tier === currentTier;
                        const isRecommended = plan.tier === 'pro';
                        const isUpgrade = tierOrder.indexOf(plan.tier) > currentIndex;
                        const isDowngrade = tierOrder.indexOf(plan.tier) < currentIndex;

                        return (
                            <div key={plan.id} style={{
                                border: isRecommended ? '2px solid #37352F' : '1px solid #E9E9E7',
                                borderRadius: 12, padding: 24, position: 'relative',
                                background: isCurrentPlan ? '#FAFAF9' : '#fff',
                            }}>
                                {isRecommended && (
                                    <div style={{
                                        position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                                        fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                                        padding: '3px 12px', borderRadius: 10, background: '#37352F', color: '#fff',
                                    }}>Most Popular</div>
                                )}

                                {/* Plan name */}
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                                    {plan.name}
                                </div>

                                {/* Price */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                                    <span style={{ fontSize: 36, fontWeight: 800, color: '#37352F', letterSpacing: '-0.03em' }}>
                                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                    </span>
                                    {plan.price > 0 && (
                                        <span style={{ fontSize: 12, color: '#9B9A97' }}>/month</span>
                                    )}
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => {
                                        if (isCurrentPlan || isDowngrade) return;
                                        // Try Stripe first, fallback to demo
                                        upgradeTo(plan.tier);
                                        // Also set demo tier for immediate feedback
                                        setDemoTier(plan.tier);
                                        if (onClose) onClose();
                                    }}
                                    disabled={isCurrentPlan || isDowngrade}
                                    style={{
                                        width: '100%', padding: '10px 16px', fontSize: 12, fontWeight: 700,
                                        borderRadius: 8, border: 'none', cursor: (isCurrentPlan || isDowngrade) ? 'default' : 'pointer',
                                        background: isCurrentPlan ? '#F7F6F3' : isRecommended ? '#37352F' : isUpgrade ? '#37352F' : '#F7F6F3',
                                        color: isCurrentPlan ? '#9B9A97' : isRecommended || isUpgrade ? '#fff' : '#9B9A97',
                                        marginBottom: 20, transition: 'opacity 0.15s',
                                        opacity: isDowngrade ? 0.5 : 1,
                                    }}
                                >
                                    {isCurrentPlan ? 'Current Plan' : isDowngrade ? 'Downgrade' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
                                </button>

                                {/* Features */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {plan.features.map((feature, fi) => (
                                        <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#37352F' }}>
                                            <span style={{ color: '#22C55E', fontSize: 14, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>✓</span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trust bar */}
                <div style={{ padding: '0 40px 32px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 10, color: '#9B9A97' }}>
                        <span>🔒 Secured by Stripe</span>
                        <span>↩️ Cancel anytime</span>
                        <span>⚡ Instant access</span>
                        <span>💳 No setup fee</span>
                    </div>
                </div>

                {/* Dev/Demo toggle */}
                <div style={{ padding: '0 40px 24px', textAlign: 'center', borderTop: '1px solid #F3F3F2', paddingTop: 16 }}>
                    <div style={{ fontSize: 9, color: '#D4D4D4', marginBottom: 8 }}>Demo Mode — Click to test access tiers</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                        {(['free', 'pro', 'studio'] as SubscriptionTier[]).map(t => (
                            <button key={t} onClick={() => { setDemoTier(t); if (onClose) onClose(); }} style={{
                                padding: '4px 12px', fontSize: 10, fontWeight: 600, borderRadius: 4,
                                border: '1px solid #E9E9E7', background: currentTier === t ? '#37352F' : '#fff',
                                color: currentTier === t ? '#fff' : '#9B9A97', cursor: 'pointer',
                            }}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── LOCK OVERLAY — Shows on gated content sections ──

export function LockedOverlay({ feature, requiredTier = 'pro' }: { feature: string; requiredTier?: SubscriptionTier }) {
    const [showPaywall, setShowPaywall] = React.useState(false);

    return (
        <>
            <div style={{
                position: 'relative', borderRadius: 10, overflow: 'hidden',
                border: '1px solid #E9E9E7', background: '#FAFAF9', padding: 32,
                textAlign: 'center', cursor: 'pointer',
            }} onClick={() => setShowPaywall(true)}>
                {/* Blurred preview */}
                <div style={{ filter: 'blur(6px)', opacity: 0.3, pointerEvents: 'none', marginBottom: 16 }}>
                    <div style={{ height: 60, background: 'linear-gradient(135deg, #F59E0B22, #3B82F622)', borderRadius: 8, marginBottom: 8 }} />
                    <div style={{ height: 40, background: '#F3F3F2', borderRadius: 8, marginBottom: 8 }} />
                    <div style={{ height: 40, background: '#F3F3F2', borderRadius: 8 }} />
                </div>

                {/* Lock icon */}
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, marginBottom: 12, boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                    }}>🔒</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F', marginBottom: 4 }}>{feature}</div>
                    <div style={{ fontSize: 11, color: '#9B9A97' }}>
                        Upgrade to {requiredTier === 'studio' ? 'Studio' : 'Professional'} to unlock
                    </div>
                    <button style={{
                        marginTop: 12, padding: '8px 20px', fontSize: 11, fontWeight: 700,
                        background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
                    }}>
                        View Plans
                    </button>
                </div>
            </div>

            {showPaywall && (
                <PremiumPaywall onClose={() => setShowPaywall(false)} requiredTier={requiredTier} />
            )}
        </>
    );
}
