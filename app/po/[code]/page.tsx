'use client';
import { useState } from 'react';
import { Check, X, MessageSquare, Download, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';

// ============================================================
// VENDOR PO VIEW — Magic Link Page
// Accessible without login via /po/[code]
// ============================================================

// Simulated PO data (will come from DB via code lookup)
const SAMPLE_PO = {
    code: 'PO-2026-0412',
    project: 'Lim Residence',
    trade: 'Carpentry',
    status: 'sent' as 'sent' | 'accepted' | 'rejected' | 'completed',
    siteAddress: 'Blk 312A Punggol Walk #08-123, S(821312)',
    vendor: 'Hock Seng Carpentry',
    designerFirm: 'Arc Studio',
    designerName: 'Sarah Tan',
    designerPhone: '+65 9123 4567',
    createdAt: '5 Mar 2026',
    specs: [
        {
            category: 'Panel & Material', fields: [
                { label: 'Panel material', value: 'Plywood (Marine Grade)' },
                { label: 'Grade', value: 'MR (Moisture Resistant)' },
                { label: 'Laminate brand', value: 'Formica' },
                { label: 'Laminate code', value: 'F2253 Aged Ash' },
                { label: 'Laminate finish', value: 'Matte' },
            ]
        },
        {
            category: 'Kitchen', fields: [
                { label: 'Kitchen system', value: 'Floor-standing with wall cabinet' },
                { label: 'Drawer system', value: 'Blum Tandembox Antaro' },
                { label: 'Soft-close', value: 'Yes' },
                { label: 'Handle type', value: 'J-channel (handleless)' },
                { label: 'Kickboard', value: 'Aluminium (waterproof)' },
            ]
        },
        {
            category: 'Wardrobe', fields: [
                { label: 'Wardrobe type', value: 'Sliding door' },
                { label: 'Internal layout', value: 'Long hang + short hang + shelves + drawers' },
            ]
        },
        {
            category: 'Cross-Trade Coordination', fields: [
                { label: 'Concealed or exposed', value: 'All concealed' },
                { label: 'Wire management', value: 'TV cables behind TV feature wall, HDMI run from projector to cabinet' },
            ]
        },
    ],
};

export default function VendorPOPage() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [poStatus, setPoStatus] = useState(SAMPLE_PO.status);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

    const toggleCat = (cat: string) => {
        setExpanded(prev => ({ ...prev, [cat]: prev[cat] === undefined ? false : !prev[cat] }));
    };

    const statusConfig = {
        sent: { label: 'Awaiting Response', color: '#3B82F6', bg: '#EFF6FF' },
        accepted: { label: 'Accepted', color: '#22C55E', bg: '#F0FDF4' },
        rejected: { label: 'Declined', color: '#EF4444', bg: '#FEF2F2' },
        completed: { label: 'Completed', color: '#8B5CF6', bg: '#F5F3FF' },
    };

    const sc = statusConfig[poStatus];

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            {/* Brand Header */}
            <header style={{
                padding: '16px 32px', borderBottom: '1px solid #E9E9E7',
                background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#37352F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>R</span>
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F', letterSpacing: '-0.02em' }}>Roof</div>
                        <div style={{ fontSize: 9, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Purchase Order</div>
                    </div>
                </div>
                <button style={{
                    padding: '6px 14px', fontSize: 11, fontWeight: 600, border: '1px solid #E9E9E7',
                    borderRadius: 6, cursor: 'pointer', fontFamily: f, background: 'white', color: '#37352F',
                    display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    <Download style={{ width: 12, height: 12 }} /> Download PDF
                </button>
            </header>

            <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
                {/* PO Header */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#37352F', margin: '0 0 4px', letterSpacing: '-0.03em' }}>
                                {SAMPLE_PO.code}
                            </h1>
                            <p style={{ fontSize: 13, color: '#6B6A67', margin: 0 }}>
                                {SAMPLE_PO.trade} — {SAMPLE_PO.project}
                            </p>
                        </div>
                        <span style={{
                            padding: '4px 12px', fontSize: 11, fontWeight: 700, borderRadius: 20,
                            background: sc.bg, color: sc.color,
                        }}>
                            {sc.label}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
                        background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20,
                    }}>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Site Address</div>
                            <div style={{ fontSize: 13, color: '#37352F', fontWeight: 500 }}>{SAMPLE_PO.siteAddress}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Design Firm</div>
                            <div style={{ fontSize: 13, color: '#37352F', fontWeight: 500 }}>{SAMPLE_PO.designerFirm}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Designer</div>
                            <div style={{ fontSize: 13, color: '#37352F', fontWeight: 500 }}>{SAMPLE_PO.designerName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Contact</div>
                            <div style={{ fontSize: 13, color: '#37352F', fontWeight: 500 }}>{SAMPLE_PO.designerPhone}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Issued</div>
                            <div style={{ fontSize: 13, color: '#37352F', fontWeight: 500 }}>{SAMPLE_PO.createdAt}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Vendor</div>
                            <div style={{ fontSize: 13, color: '#37352F', fontWeight: 500 }}>{SAMPLE_PO.vendor}</div>
                        </div>
                    </div>
                </div>

                {/* Spec Categories */}
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Site Instructions</h2>
                    {SAMPLE_PO.specs.map(specCat => {
                        const isExpanded = expanded[specCat.category] !== false;
                        return (
                            <div key={specCat.category} style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', marginBottom: 8, overflow: 'hidden' }}>
                                <button onClick={() => toggleCat(specCat.category)} style={{
                                    width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'none', border: 'none', cursor: 'pointer', fontFamily: f,
                                }}>
                                    {isExpanded ? <ChevronDown style={{ width: 14, height: 14, color: '#9B9A97' }} /> : <ChevronRight style={{ width: 14, height: 14, color: '#9B9A97' }} />}
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>{specCat.category}</span>
                                    <span style={{ fontSize: 9, fontWeight: 600, color: '#9B9A97', background: '#F7F6F3', padding: '1px 6px', borderRadius: 4 }}>
                                        {specCat.fields.length} items
                                    </span>
                                </button>
                                {isExpanded && (
                                    <div style={{ padding: '0 20px 16px' }}>
                                        {specCat.fields.map(field => (
                                            <div key={field.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F5F5F4' }}>
                                                <span style={{ fontSize: 12, color: '#6B6A67' }}>{field.label}</span>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{field.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                {poStatus === 'sent' && !showRejectReason && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                        <button
                            onClick={() => { setPoStatus('accepted'); setShowRegistration(true); }}
                            style={{
                                flex: 1, padding: '14px 20px', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 10,
                                cursor: 'pointer', fontFamily: f, background: '#37352F', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                        >
                            <Check style={{ width: 16, height: 16 }} /> Accept PO
                        </button>
                        <button
                            onClick={() => setShowRejectReason(true)}
                            style={{
                                padding: '14px 20px', fontSize: 14, fontWeight: 600, border: '1px solid #E9E9E7', borderRadius: 10,
                                cursor: 'pointer', fontFamily: f, background: 'white', color: '#6B6A67',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                        >
                            <X style={{ width: 16, height: 16 }} /> Decline
                        </button>
                        <button style={{
                            padding: '14px 20px', fontSize: 14, fontWeight: 600, border: '1px solid #E9E9E7', borderRadius: 10,
                            cursor: 'pointer', fontFamily: f, background: 'white', color: '#6B6A67',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            <MessageSquare style={{ width: 16, height: 16 }} /> Message
                        </button>
                    </div>
                )}

                {/* Reject Reason */}
                {showRejectReason && poStatus === 'sent' && (
                    <div style={{ background: 'white', borderRadius: 10, border: '1px solid #E9E9E7', padding: 20, marginBottom: 24 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 12px' }}>Reason for declining</h3>
                        <textarea
                            placeholder="e.g. Fully booked for March, pricing not agreed, need more details..."
                            rows={3}
                            style={{ width: '100%', padding: '10px 12px', fontSize: 12, border: '1px solid #E9E9E7', borderRadius: 6, fontFamily: f, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button
                                onClick={() => { setPoStatus('rejected'); setShowRejectReason(false); }}
                                style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: f, background: '#EF4444', color: 'white' }}
                            >
                                Confirm Decline
                            </button>
                            <button
                                onClick={() => setShowRejectReason(false)}
                                style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, border: '1px solid #E9E9E7', borderRadius: 6, cursor: 'pointer', fontFamily: f, background: 'white', color: '#6B6A67' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Accepted Status */}
                {poStatus === 'accepted' && (
                    <div style={{ background: '#F0FDF4', borderRadius: 10, border: '1px solid #BBF7D0', padding: 20, marginBottom: 24, textAlign: 'center' }}>
                        <Check style={{ width: 24, height: 24, color: '#22C55E', margin: '0 auto 8px' }} />
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#166534', margin: '0 0 4px' }}>PO Accepted</h3>
                        <p style={{ fontSize: 12, color: '#15803D', margin: 0 }}>The designer has been notified. They will contact you to arrange site access.</p>
                    </div>
                )}

                {/* Rejected Status */}
                {poStatus === 'rejected' && (
                    <div style={{ background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA', padding: 20, marginBottom: 24, textAlign: 'center' }}>
                        <X style={{ width: 24, height: 24, color: '#EF4444', margin: '0 auto 8px' }} />
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#991B1B', margin: '0 0 4px' }}>PO Declined</h3>
                        <p style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>The designer has been notified of your response.</p>
                    </div>
                )}

                {/* Registration CTA — The Trojan Horse */}
                {showRegistration && (
                    <div style={{
                        background: 'linear-gradient(135deg, #37352F 0%, #524F47 100%)',
                        borderRadius: 14, padding: 28, marginBottom: 24, color: 'white',
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                            Want more jobs like this?
                        </h3>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 20px', lineHeight: 1.5 }}>
                            Join Roof's vendor network — get matched with designers looking for {SAMPLE_PO.trade.toLowerCase()} tradesmen. Free to join.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                            <input
                                type="text"
                                defaultValue={SAMPLE_PO.vendor}
                                placeholder="Business name"
                                style={{ width: '100%', padding: '10px 14px', fontSize: 13, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontFamily: f, outline: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }}
                            />
                            <input
                                type="tel"
                                placeholder="WhatsApp number"
                                style={{ width: '100%', padding: '10px 14px', fontSize: 13, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontFamily: f, outline: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }}
                            />
                            <input
                                type="email"
                                placeholder="Email (optional)"
                                style={{ width: '100%', padding: '10px 14px', fontSize: 13, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontFamily: f, outline: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }}
                            />
                        </div>

                        <button style={{
                            width: '100%', padding: '14px', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 10,
                            cursor: 'pointer', fontFamily: f, background: 'white', color: '#37352F',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            Join Vendor Network <ArrowRight style={{ width: 14, height: 14 }} />
                        </button>

                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '12px 0 0', textAlign: 'center' }}>
                            No subscription · No commission · Get matched to quality projects
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #E9E9E7' }}>
                    <p style={{ fontSize: 10, color: '#D4D3D0', margin: 0 }}>
                        Powered by Roof — The Operating System for Renovations
                    </p>
                </div>
            </div>
        </div>
    );
}
