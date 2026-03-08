'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── WORKERS ── */
const WORKERS = [
    { name: 'Ahmad bin Hassan', trade: 'Tiling', boss: 'Ah Seng Tiling Works', bossName: 'Lim Ah Seng', irs: 920, projects: 47, onTime: 98, defects: 1.2, years: 8, badge: 'Elite', loyalty: 4200 },
    { name: 'Rajan Kumar', trade: 'Electrical (LEW)', boss: 'PowerTech Pte Ltd', bossName: 'David Chua', irs: 845, projects: 35, onTime: 96, defects: 0.8, years: 6, badge: 'Trusted', loyalty: 2800 },
    { name: 'Ah Kow', trade: 'Plumbing', boss: 'KSK Plumbing', bossName: 'K.S. Kumar', irs: 710, projects: 22, onTime: 91, defects: 2.4, years: 4, badge: 'Established', loyalty: 1600 },
    { name: 'Phyo Min Thein', trade: 'Painting', boss: 'Ah Seng Tiling Works', bossName: 'Lim Ah Seng', irs: 480, projects: 11, onTime: 85, defects: 4.1, years: 2, badge: 'Building', loyalty: 520 },
    { name: 'Jason Ng', trade: 'Carpentry', boss: 'J&J Carpentry', bossName: 'Jason Ng Sr.', irs: 320, projects: 6, onTime: 80, defects: 5.5, years: 1, badge: 'Building', loyalty: 180 },
    { name: 'Suresh', trade: 'Air-Con', boss: 'CoolAir Services', bossName: 'Muthu', irs: 95, projects: 1, onTime: 100, defects: 0, years: 0, badge: 'New', loyalty: 50 },
];

/* ── ID FIRMS (rated by contractors + homeowners) ── */
const ID_FIRMS = [
    { name: 'Stellar Design Pte Ltd', designer: 'Rachel Lim', irs: 870, avgPay: 14, specClarity: 92, changeOrders: 1.2, hoRating: 4.8, coRating: 4.5, loyalty: 3600, flag: null },
    { name: 'Vista Interiors', designer: 'Kevin Tan', irs: 620, avgPay: 28, specClarity: 71, changeOrders: 4.1, hoRating: 4.2, coRating: 2.8, loyalty: 1400, flag: 'backstab' },
    { name: 'Luxe Living SG', designer: 'Amanda Chen', irs: 440, avgPay: 45, specClarity: 55, changeOrders: 6.3, hoRating: 3.9, coRating: 2.1, loyalty: 680, flag: 'backstab' },
    { name: 'Freshspace Studio', designer: 'Daniel Goh', irs: 780, avgPay: 12, specClarity: 88, changeOrders: 1.8, hoRating: 4.6, coRating: 4.4, loyalty: 2900, flag: null },
    { name: 'Budget Reno Works', designer: 'Sammy Low', irs: 210, avgPay: 62, specClarity: 38, changeOrders: 8.7, hoRating: 2.5, coRating: 1.6, loyalty: 80, flag: 'serial' },
];

/* ── COMPLAINTS ── */
const COMPLAINTS = [
    { id: 'CMP-0041', from: 'Lin Wei (Homeowner)', fromType: 'ho', target: 'Luxe Living SG', category: 'Late handover', severity: 'High', status: 'Investigating', date: '2 Mar 2026', loyalty_impact: -120, desc: 'Project was 6 weeks late. Designer promised March handover, still incomplete. No updates unless I chase.' },
    { id: 'CMP-0042', from: 'Ahmad bin Hassan', fromType: 'contractor', fromIrs: 920, target: 'Luxe Living SG', category: 'Late payment', severity: 'High', status: 'Verified', date: '28 Feb 2026', loyalty_impact: -200, desc: 'Invoice from Nov still unpaid. 3 months overdue. Always say "processing" but nothing comes.' },
    { id: 'CMP-0043', from: 'Rajan Kumar', fromType: 'contractor', fromIrs: 845, target: 'Vista Interiors', category: 'Unclear specs', severity: 'Medium', status: 'Verified', date: '25 Feb 2026', loyalty_impact: -80, desc: 'Electrical plan had wrong load calculations. Had to redo DB box after ceiling was closed. Who pays?' },
    { id: 'CMP-0044', from: 'Jason Ng', fromType: 'contractor', fromIrs: 320, target: 'Stellar Design Pte Ltd', category: 'Unfair blame', severity: 'Low', status: 'Dismissed', date: '20 Feb 2026', loyalty_impact: 0, desc: 'Rachel blamed me for warped panel but her spec said use 9mm when 18mm was needed.', dismissed_reason: 'Filer IRS too low (320). Spec review confirmed 18mm was optional. Complaint credibility: 32%.' },
    { id: 'CMP-0045', from: 'Sarah Tan (Homeowner)', fromType: 'ho', target: 'Budget Reno Works', category: 'Ghost designer', severity: 'Critical', status: 'Escalated', date: '1 Mar 2026', loyalty_impact: -500, desc: 'Paid 50% deposit ($18,000). Designer MIA for 3 weeks. No reply WhatsApp, phone off. Site untouched.' },
    { id: 'CMP-0046', from: 'Phyo Min Thein', fromType: 'contractor', fromIrs: 480, target: 'Vista Interiors', category: 'Spec change abuse', severity: 'Medium', status: 'Investigating', date: '3 Mar 2026', loyalty_impact: -60, desc: 'Kevin changed paint color 3 times after I already bought materials. Says "client request" but client told me she never asked.' },
];

/* ── LOYALTY DROPS LOG ── */
const LOYALTY_DROPS = [
    { target: 'Luxe Living SG', event: 'Late payment (verified)', points: -200, date: '28 Feb', source: 'Contractor complaint CMP-0042' },
    { target: 'Luxe Living SG', event: 'Late handover (investigating)', points: -120, date: '2 Mar', source: 'Homeowner complaint CMP-0041' },
    { target: 'Vista Interiors', event: 'Unclear specs (verified)', points: -80, date: '25 Feb', source: 'Contractor complaint CMP-0043' },
    { target: 'Vista Interiors', event: 'Backstab flag triggered', points: -150, date: '3 Mar', source: 'HO rates 4.2★ but contractors rate 2.8★ — discrepancy > 1.0' },
    { target: 'Budget Reno Works', event: 'Ghost designer (escalated)', points: -500, date: '1 Mar', source: 'Homeowner complaint CMP-0045' },
    { target: 'Budget Reno Works', event: 'Serial offender flag', points: -300, date: '1 Mar', source: '3+ critical complaints in 90 days' },
    { target: 'Jason Ng', event: 'False complaint filed', points: -40, date: '22 Feb', source: 'CMP-0044 dismissed — gossip penalty' },
];

/* ── COLORS ── */
const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Elite': { bg: '#F5F3FF', text: '#7C3AED', border: '#8B5CF6' },
    'Trusted': { bg: '#EFF6FF', text: '#2563EB', border: '#3B82F6' },
    'Established': { bg: '#ECFDF5', text: '#059669', border: '#10B981' },
    'Building': { bg: '#FFFBEB', text: '#D97706', border: '#F59E0B' },
    'New': { bg: '#F9FAFB', text: '#9B9A97', border: '#E9E9E7' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    'Verified': { bg: '#DCFCE7', text: '#166534' },
    'Investigating': { bg: '#FEF3C7', text: '#92400E' },
    'Escalated': { bg: '#FEE2E2', text: '#991B1B' },
    'Dismissed': { bg: '#F3F4F6', text: '#6B7280' },
};

function irsColor(s: number) { return s >= 800 ? '#7C3AED' : s >= 500 ? '#2563EB' : s >= 300 ? '#059669' : s >= 100 ? '#D97706' : '#9B9A97'; }
function irsBar(s: number) { return Math.min(100, (s / 1000) * 100); }

export default function IRSDashboard() {
    const [tab, setTab] = useState<'workers' | 'designers' | 'complaints' | 'drops'>('workers');
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    return (
        <div style={{ fontFamily: f, background: '#FAFAF9', minHeight: '100vh', padding: '40px 24px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                        <Link href="/hub" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 800 }}>R</div>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#37352F' }}>Roof</span>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#37352F', margin: 0, letterSpacing: '-0.03em' }}>IRS — Reputation Ecosystem</h1>
                            <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 4, background: '#DC2626', color: 'white', fontWeight: 700, letterSpacing: '0.05em' }}>ADMIN ONLY</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#9B9A97', margin: '4px 0 0' }}>Internal dashboard. Not visible to any users. NRIC-linked scores, flags, and complaints.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {['New', 'Building', 'Established', 'Trusted', 'Elite'].map(b => {
                            const c = BADGE_COLORS[b];
                            return <span key={b} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontWeight: 600 }}>{b}</span>;
                        })}
                    </div>
                </div>



                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'white', borderRadius: 10, padding: 4, border: '1px solid #E9E9E7' }}>
                    {[
                        { key: 'workers' as const, label: 'Workers', count: WORKERS.length },
                        { key: 'designers' as const, label: 'ID Firms', count: ID_FIRMS.length },
                        { key: 'complaints' as const, label: 'Complaints', count: COMPLAINTS.filter(c => c.status !== 'Dismissed').length },
                        { key: 'drops' as const, label: 'Loyalty Drops', count: LOYALTY_DROPS.length },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: tab === t.key ? '#37352F' : 'transparent',
                            color: tab === t.key ? 'white' : '#6B6A67',
                            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                        }}>
                            {t.label} <span style={{ fontSize: 11, opacity: 0.7 }}>({t.count})</span>
                        </button>
                    ))}
                </div>

                {/* ═══ TAB: Workers ═══ */}
                {tab === 'workers' && (
                    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.5fr 0.8fr 0.6fr 0.6fr 0.6fr 0.6fr 1fr 0.7fr 0.7fr', padding: '12px 20px', borderBottom: '1px solid #E9E9E7', background: '#FAFAF9' }}>
                            {['Worker', 'Boss / Firm', 'Trade', 'IRS', 'Jobs', 'On-Time', 'Defect', 'Score', 'Loyalty', 'Tier'].map(h => (
                                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                            ))}
                        </div>
                        {WORKERS.map((w, i) => {
                            const c = BADGE_COLORS[w.badge];
                            return (
                                <div key={w.name} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.5fr 0.8fr 0.6fr 0.6fr 0.6fr 0.6fr 1fr 0.7fr 0.7fr', padding: '14px 20px', borderBottom: i < WORKERS.length - 1 ? '1px solid #F3F3F2' : 'none', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{w.name}</div>
                                        <div style={{ fontSize: 11, color: '#9B9A97' }}>{w.years}yr on Roof</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{w.boss}</div>
                                        <div style={{ fontSize: 10, color: '#9B9A97' }}>{w.bossName}</div>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#6B6A67' }}>{w.trade}</div>
                                    <div style={{ fontSize: 15, fontWeight: 800, color: irsColor(w.irs) }}>{w.irs}</div>
                                    <div style={{ fontSize: 12, color: '#6B6A67' }}>{w.projects}</div>
                                    <div style={{ fontSize: 12, color: w.onTime >= 95 ? '#059669' : w.onTime >= 85 ? '#D97706' : '#DC2626' }}>{w.onTime}%</div>
                                    <div style={{ fontSize: 12, color: w.defects <= 2 ? '#059669' : w.defects <= 4 ? '#D97706' : '#DC2626' }}>{w.defects}%</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#F3F3F2' }}>
                                            <div style={{ width: `${irsBar(w.irs)}%`, height: '100%', borderRadius: 3, background: irsColor(w.irs) }} />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{w.loyalty.toLocaleString()} pts</div>
                                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontWeight: 600, textAlign: 'center' }}>{w.badge}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══ TAB: ID Firms ═══ */}
                {tab === 'designers' && (
                    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.7fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', padding: '12px 20px', borderBottom: '1px solid #E9E9E7', background: '#FAFAF9' }}>
                            {['ID Firm', 'IRS', 'Avg Pay (days)', 'Spec Clarity', 'Change Orders', 'HO Rating', 'Contractor Rating', 'Loyalty', 'Flag'].map(h => (
                                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                            ))}
                        </div>
                        {ID_FIRMS.map((firm, i) => (
                            <div key={firm.name} style={{ display: 'grid', gridTemplateColumns: '2fr 0.7fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr', padding: '14px 20px', borderBottom: i < ID_FIRMS.length - 1 ? '1px solid #F3F3F2' : 'none', alignItems: 'center', background: firm.flag ? '#FEF2F2' : 'transparent' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{firm.name}</div>
                                    <div style={{ fontSize: 11, color: '#9B9A97' }}>{firm.designer}</div>
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: irsColor(firm.irs) }}>{firm.irs}</div>
                                <div style={{ fontSize: 12, color: firm.avgPay <= 14 ? '#059669' : firm.avgPay <= 30 ? '#D97706' : '#DC2626', fontWeight: 600 }}>{firm.avgPay}d</div>
                                <div style={{ fontSize: 12, color: firm.specClarity >= 80 ? '#059669' : firm.specClarity >= 60 ? '#D97706' : '#DC2626' }}>{firm.specClarity}%</div>
                                <div style={{ fontSize: 12, color: firm.changeOrders <= 2 ? '#059669' : firm.changeOrders <= 5 ? '#D97706' : '#DC2626' }}>{firm.changeOrders}/proj</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{firm.hoRating}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: Math.abs(firm.hoRating - firm.coRating) > 1 ? '#DC2626' : '#37352F' }}>
                                    {firm.coRating < firm.hoRating - 1 ? '!! ' : ''}{firm.coRating}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{firm.loyalty.toLocaleString()} pts</div>
                                <div>
                                    {firm.flag === 'backstab' && (
                                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#FEE2E2', color: '#991B1B', fontWeight: 700 }}>TWO-FACED</span>
                                    )}
                                    {firm.flag === 'serial' && (
                                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#FEE2E2', color: '#991B1B', fontWeight: 700 }}>SERIAL</span>
                                    )}
                                    {!firm.flag && (
                                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#DCFCE7', color: '#166534', fontWeight: 600 }}>✓ Clean</span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Backstab explanation */}
                        <div style={{ padding: '14px 20px', background: '#FEF2F2', borderTop: '1px solid #FECACA' }}>
                            <span style={{ fontSize: 11, color: '#991B1B', fontWeight: 700 }}>TWO-FACED flag: </span>
                            <span style={{ fontSize: 11, color: '#991B1B' }}>Homeowner rating vs Contractor rating gap {'>'} 1.0 star. Nice to client&apos;s face, nightmare for workers behind the scenes.</span>
                        </div>
                    </div>
                )}

                {/* ═══ TAB: Complaints ═══ */}
                {tab === 'complaints' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {COMPLAINTS.map(c => {
                            const st = STATUS_COLORS[c.status];
                            const credibility = c.fromType === 'ho' ? 100 : Math.round(((c as any).fromIrs || 500) / 10);
                            return (
                                <div key={c.id} style={{
                                    background: c.status === 'Dismissed' ? '#F9FAFB' : 'white', borderRadius: 14,
                                    border: `1px solid ${c.status === 'Escalated' ? '#FECACA' : '#E9E9E7'}`,
                                    padding: '20px', opacity: c.status === 'Dismissed' ? 0.7 : 1,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: '#9B9A97', fontFamily: "'JetBrains Mono', monospace" }}>{c.id}</span>
                                                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: st.bg, color: st.text, fontWeight: 600 }}>{c.status}</span>
                                                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: c.severity === 'Critical' ? '#FEE2E2' : c.severity === 'High' ? '#FEF3C7' : '#F3F4F6', color: c.severity === 'Critical' ? '#991B1B' : c.severity === 'High' ? '#92400E' : '#6B7280', fontWeight: 600 }}>{c.severity}</span>
                                            </div>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: '#37352F' }}>{c.category}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 11, color: '#9B9A97' }}>{c.date}</div>
                                            {c.loyalty_impact !== 0 && (
                                                <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626' }}>{c.loyalty_impact} pts</div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Filed by</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>
                                                {c.from}
                                                {c.fromType === 'contractor' && <span style={{ fontSize: 10, color: irsColor((c as any).fromIrs), marginLeft: 6, fontWeight: 700 }}>IRS {(c as any).fromIrs}</span>}
                                            </div>
                                            {c.fromType === 'ho' && <div style={{ fontSize: 10, color: '#059669', fontWeight: 600 }}>Credibility: 100% (paying client)</div>}
                                            {c.fromType === 'contractor' && <div style={{ fontSize: 10, color: credibility >= 70 ? '#059669' : credibility >= 40 ? '#D97706' : '#DC2626', fontWeight: 600 }}>Credibility: {credibility}% (IRS-weighted)</div>}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Against</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#DC2626' }}>{c.target}</div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: 12, color: '#6B6A67', lineHeight: 1.6, padding: '12px', background: '#FAFAF9', borderRadius: 8, border: '1px solid #F3F3F2', fontStyle: 'italic' }}>
                                        &ldquo;{c.desc}&rdquo;
                                    </div>

                                    {c.status === 'Dismissed' && (c as any).dismissed_reason && (
                                        <div style={{ marginTop: 8, fontSize: 11, color: '#6B7280', padding: '8px 12px', background: '#F3F4F6', borderRadius: 6 }}>
                                            <strong>Dismissed:</strong> {(c as any).dismissed_reason}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ═══ TAB: Loyalty Drops ═══ */}
                {tab === 'drops' && (
                    <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 0.8fr 0.8fr 2fr', padding: '12px 20px', borderBottom: '1px solid #E9E9E7', background: '#FAFAF9' }}>
                            {['Target', 'Event', 'Points', 'Date', 'Source'].map(h => (
                                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                            ))}
                        </div>
                        {LOYALTY_DROPS.map((d, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 0.8fr 0.8fr 2fr', padding: '14px 20px', borderBottom: i < LOYALTY_DROPS.length - 1 ? '1px solid #F3F3F2' : 'none', alignItems: 'center' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{d.target}</div>
                                <div style={{ fontSize: 12, color: '#6B6A67' }}>{d.event}</div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: '#DC2626' }}>{d.points} pts</div>
                                <div style={{ fontSize: 11, color: '#9B9A97' }}>{d.date}</div>
                                <div style={{ fontSize: 11, color: '#6B6A67' }}>{d.source}</div>
                            </div>
                        ))}

                        {/* Summary */}
                        <div style={{ padding: '16px 20px', background: '#FAFAF9', borderTop: '1px solid #E9E9E7' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#37352F', marginBottom: 8 }}>Drop Rules</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {[
                                    { rule: 'Verified complaint', drop: '-80 to -200', note: 'Based on severity' },
                                    { rule: 'Backstab flag triggered', drop: '-150', note: 'HO vs Contractor rating gap > 1.0' },
                                    { rule: 'Ghost designer', drop: '-500', note: 'No response 7+ days' },
                                    { rule: 'Serial offender', drop: '-300', note: '3+ critical in 90 days' },
                                    { rule: 'False complaint (gossip)', drop: '-40', note: 'Filer loses points, not target' },
                                    { rule: 'Suspicious loyalty', drop: '-20', note: 'Contractor never reports obvious issues' },
                                ].map(r => (
                                    <div key={r.rule} style={{ padding: '10px', borderRadius: 8, background: 'white', border: '1px solid #F3F3F2' }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>{r.rule}</div>
                                        <div style={{ fontSize: 13, fontWeight: 800, color: '#DC2626' }}>{r.drop}</div>
                                        <div style={{ fontSize: 10, color: '#9B9A97' }}>{r.note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
