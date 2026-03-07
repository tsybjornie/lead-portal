'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ═══════════════════════════════════════════════════════
   SEED DATA — simulates what the matching engine produces
   ═══════════════════════════════════════════════════════ */

const HOMEOWNER_LEADS = [
    {
        id: 'L-001',
        name: 'David Lim',
        property: '4-Room BTO',
        location: 'Tampines St 42',
        budget: 60000,
        style: 'Japandi',
        timeline: 'Nov 2026',
        cultural: ['Feng Shui'],
        rooms: 7,
        submitted: '2 hours ago',
    },
    {
        id: 'L-002',
        name: 'Sarah Tan',
        property: 'Condo 3-Bed',
        location: 'Bukit Timah',
        budget: 120000,
        style: 'Modern Luxury',
        timeline: 'Jan 2027',
        cultural: [],
        rooms: 9,
        submitted: '5 hours ago',
    },
    {
        id: 'L-003',
        name: 'Ahmad & Nurul',
        property: '5-Room HDB Resale',
        location: 'Woodlands Ring Rd',
        budget: 45000,
        style: 'Scandinavian',
        timeline: 'Sep 2026',
        cultural: ['Islamic / Halal-compliant'],
        rooms: 8,
        submitted: '1 day ago',
    },
];

const MATCH_BRIEFS = [
    {
        leadId: 'L-001',
        firm: 'Studio Jio',
        score: 87,
        winReasons: [
            '14 of last 20 projects were 4-room BTOs',
            'Avg quote for this type: $52k (client budget: $60k — headroom)',
            'Client wants Japandi — 8 portfolio shots are Japandi',
            'Client needs Feng Shui — firm has listed this as a service',
        ],
        risks: [
            'Client timeline is Nov — firm has 2 active projects in Oct',
            'Client is in Tampines — firm\'s last 5 projects were Central',
        ],
        approach: [
            'Lead with 531A Tampines project if available',
            'Quote $48-52k to win on value (budget headroom: $8-12k)',
            'Highlight Feng Shui master collaboration in pitch',
        ],
        avgDaysToClose: 4,
        closeRate: 32,
    },
    {
        leadId: 'L-001',
        firm: 'Muji Living Pte Ltd',
        score: 74,
        winReasons: [
            'Strong Japandi portfolio — awarded SIDA 2025',
            'Premium positioning matches client\'s $60k budget',
            'Excellent client reviews (4.8/5 avg)',
        ],
        risks: [
            'Avg quote for BTO is $68k — may exceed budget by $8k',
            'No Feng Shui capability listed',
            'Longer design process (avg 6 weeks vs industry 4)',
        ],
        approach: [
            'Emphasise design quality over price',
            'Consider partnering with Feng Shui consultant for this lead',
            'Show BTO-specific case studies',
        ],
        avgDaysToClose: 7,
        closeRate: 25,
    },
    {
        leadId: 'L-001',
        firm: 'Renew Design Co',
        score: 61,
        winReasons: [
            'Competitive pricing — avg quote $42k for BTOs',
            'Located in Tampines (local advantage)',
            'Fast turnaround — avg 3 weeks to first proposal',
        ],
        risks: [
            'Portfolio doesn\'t show strong Japandi aesthetic',
            'Only 2 years in operation — limited track record',
            'No cultural/Feng Shui services listed',
        ],
        approach: [
            'Compete on price and speed',
            'Source Japandi reference images for mood board',
            'Emphasise local knowledge and quick site visits',
        ],
        avgDaysToClose: 3,
        closeRate: 18,
    },
    {
        leadId: 'L-002',
        firm: 'Studio Jio',
        score: 52,
        winReasons: [
            'Reputable firm with strong online presence',
            'Some condo experience in portfolio',
        ],
        risks: [
            'Primarily HDB-focused — condo is secondary',
            'Client budget $120k — firm avg for condo is $95k (scope mismatch)',
            'Modern Luxury isn\'t firm\'s core style',
        ],
        approach: [
            'This lead is a stretch — only pitch if capacity allows',
            'Lead with your largest condo project',
        ],
        avgDaysToClose: 8,
        closeRate: 12,
    },
    {
        leadId: 'L-002',
        firm: 'Luxe Interiors',
        score: 93,
        winReasons: [
            '90% of projects are condos — this is their bread and butter',
            'Avg condo project: $115k (perfect budget fit)',
            'Modern Luxury is primary style — entire portfolio matches',
            'Bukit Timah is core coverage area — 6 projects in last year',
            'BOA registered architect on team',
        ],
        risks: [
            'Premium pricing may feel aggressive to cost-conscious clients',
        ],
        approach: [
            'This is a strong match — prioritise this lead',
            'Share Bukit Timah condo case study immediately',
            'Offer complimentary site measurement within 48hrs',
        ],
        avgDaysToClose: 5,
        closeRate: 42,
    },
    {
        leadId: 'L-003',
        firm: 'Idaman Studio',
        score: 91,
        winReasons: [
            'Halal-certified renovation practices',
            '12 HDB 5-room projects completed in 2025',
            'Scandinavian is secondary style — strong portfolio',
            'Avg quote $40k — excellent budget fit at $45k',
            'Active in Woodlands/North corridor',
        ],
        risks: [
            'Smaller team — may have capacity constraints',
        ],
        approach: [
            'Highlight Halal compliance upfront — critical differentiator',
            'Share Woodlands Crescent project as reference',
            'Fast response — this client may be price-sensitive',
        ],
        avgDaysToClose: 3,
        closeRate: 38,
    },
];

type Lead = typeof HOMEOWNER_LEADS[0];

export default function MatchBriefPage() {
    const [selectedLead, setSelectedLead] = useState<string>('L-001');
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const lead = HOMEOWNER_LEADS.find(l => l.id === selectedLead)!;
    const briefs = MATCH_BRIEFS.filter(b => b.leadId === selectedLead);

    const scoreColor = (score: number) => {
        if (score >= 80) return '#059669';
        if (score >= 60) return '#d97706';
        return '#dc2626';
    };

    const scoreBg = (score: number) => {
        if (score >= 80) return 'rgba(5,150,105,0.08)';
        if (score >= 60) return 'rgba(217,119,6,0.08)';
        return 'rgba(220,38,38,0.06)';
    };

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* Nav */}
            <nav style={{ padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/admin" style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase' as const, textDecoration: 'none' }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.15)' }}>/ </span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>MATCH INTELLIGENCE</span>
                </div>
                <Link href="/admin" style={{ fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.5)', textDecoration: 'none' }}>← Admin</Link>
            </nav>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 48px' }}>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 12 }}>WHY THIS FIRM WILL WIN</div>
                    <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 8px', color: '#111' }}>
                        Match <span style={{ color: 'rgba(0,0,0,0.2)', fontStyle: 'italic' }}>Briefs</span>
                    </h1>
                    <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', margin: 0, lineHeight: 1.6 }}>
                        AI-generated intelligence for each firm-lead pairing. Shows match score, win factors, risks, and closing strategy.
                    </p>
                </div>

                {/* Lead selector */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                    {HOMEOWNER_LEADS.map((l: Lead) => (
                        <button
                            key={l.id}
                            onClick={() => setSelectedLead(l.id)}
                            style={{
                                padding: '14px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                background: selectedLead === l.id ? '#111' : 'white',
                                color: selectedLead === l.id ? '#fff' : '#111',
                                fontFamily: f, fontSize: 12, fontWeight: 500,
                                boxShadow: selectedLead === l.id ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s', flex: 1, textAlign: 'left' as const,
                            }}
                        >
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{l.name}</div>
                            <div style={{ fontSize: 11, opacity: 0.6 }}>{l.property} · {l.location}</div>
                            <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>${(l.budget / 1000).toFixed(0)}k · {l.style} · {l.submitted}</div>
                        </button>
                    ))}
                </div>

                {/* Lead details bar */}
                <div style={{
                    background: 'white', borderRadius: 12, padding: '16px 24px', marginBottom: 24,
                    display: 'flex', gap: 32, alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 4 }}>BUDGET</div>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>${lead.budget.toLocaleString()}</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 4 }}>STYLE</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{lead.style}</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 4 }}>TIMELINE</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{lead.timeline}</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 4 }}>ROOMS</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{lead.rooms}</div>
                    </div>
                    <div style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
                    <div>
                        <div style={{ fontFamily: mono, fontSize: 8, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 4 }}>CULTURAL</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{lead.cultural.length > 0 ? lead.cultural.join(', ') : '—'}</div>
                    </div>
                </div>

                {/* Match briefs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {briefs.sort((a, b) => b.score - a.score).map((brief, idx) => (
                        <div key={idx} style={{
                            background: 'white', borderRadius: 14, padding: '28px 32px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            border: idx === 0 ? '1px solid rgba(5,150,105,0.2)' : '1px solid transparent',
                        }}>
                            {/* Header row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: 12,
                                        background: scoreBg(brief.score),
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexDirection: 'column',
                                    }}>
                                        <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor(brief.score), lineHeight: 1 }}>{brief.score}</span>
                                        <span style={{ fontSize: 7, fontWeight: 600, color: scoreColor(brief.score), opacity: 0.7, letterSpacing: '0.1em' }}>MATCH</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>{brief.firm}</div>
                                        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                                            <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>
                                                Close rate: <strong style={{ color: 'rgba(0,0,0,0.6)' }}>{brief.closeRate}%</strong>
                                            </span>
                                            <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>
                                                Avg response: <strong style={{ color: 'rgba(0,0,0,0.6)' }}>{brief.avgDaysToClose}d</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {idx === 0 && (
                                    <div style={{
                                        padding: '6px 14px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                                        background: 'rgba(5,150,105,0.08)', color: '#059669',
                                        letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                                    }}>
                                        ★ RECOMMENDED
                                    </div>
                                )}
                            </div>

                            {/* Three columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
                                {/* Win reasons */}
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: '#059669', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 10 }}>
                                        ✅ WHY THEY&apos;LL WIN
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {brief.winReasons.map((r, i) => (
                                            <div key={i} style={{
                                                fontSize: 11, color: 'rgba(0,0,0,0.6)', lineHeight: 1.5,
                                                padding: '6px 10px', background: 'rgba(5,150,105,0.04)', borderRadius: 6,
                                            }}>
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Risk factors */}
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: '#d97706', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 10 }}>
                                        ⚠️ RISK FACTORS
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {brief.risks.map((r, i) => (
                                            <div key={i} style={{
                                                fontSize: 11, color: 'rgba(0,0,0,0.6)', lineHeight: 1.5,
                                                padding: '6px 10px', background: 'rgba(217,119,6,0.04)', borderRadius: 6,
                                            }}>
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Suggested approach */}
                                <div>
                                    <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 600, color: '#4f46e5', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 10 }}>
                                        📋 SUGGESTED APPROACH
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {brief.approach.map((a, i) => (
                                            <div key={i} style={{
                                                fontSize: 11, color: 'rgba(0,0,0,0.6)', lineHeight: 1.5,
                                                padding: '6px 10px', background: 'rgba(79,70,229,0.04)', borderRadius: 6,
                                            }}>
                                                → {a}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats footer */}
                <div style={{
                    marginTop: 32, padding: '20px 24px', background: 'rgba(0,0,0,0.02)', borderRadius: 10,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
                        {briefs.length} firms matched · Highest score: {Math.max(...briefs.map(b => b.score))} · Lead {selectedLead}
                    </span>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{
                            padding: '8px 20px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', color: '#111',
                            cursor: 'pointer', fontFamily: f,
                        }}>Export PDF</button>
                        <button style={{
                            padding: '8px 20px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: '#111', border: 'none', color: '#fff',
                            cursor: 'pointer', fontFamily: f,
                        }}>Send to Firms →</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>© 2026 ROOF · MATCH INTELLIGENCE</span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[{ label: 'Admin', href: '/admin' }, { label: 'Ratings', href: '/admin/ratings' }].map(link => (
                        <Link key={link.label} href={link.href} style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
