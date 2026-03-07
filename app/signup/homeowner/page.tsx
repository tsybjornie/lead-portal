'use client';

import Link from 'next/link';
import { useState } from 'react';

const SG_PROPERTIES = [
    'HDB 2-Room Flexi',
    'HDB 3-Room',
    'HDB 4-Room',
    'HDB 5-Room',
    'HDB 3Gen (Multi-Gen)',
    'HDB Executive (EA)',
    'HDB Executive Maisonette (EM)',
    'HDB 5-Room Maisonette',
    'HDB DBSS',
    'HDB Jumbo',
    'Executive Condo (EC)',
    'Condo — Studio',
    'Condo — 1 Bedroom',
    'Condo — 2 Bedroom',
    'Condo — 3 Bedroom',
    'Condo — Penthouse / Loft',
    'Landed — Terrace',
    'Landed — Semi-D',
    'Landed — Bungalow / GCB',
    'Shophouse',
];
const MY_PROPERTIES = [
    'Flat / Apartment',
    'Condo / Serviced Residence — Studio',
    'Condo / Serviced Residence — 1-3 Bed',
    'Condo / Serviced Residence — Penthouse',
    'Townhouse',
    'Terrace (Single Storey)',
    'Terrace (Double Storey)',
    'Semi-D',
    'Bungalow',
    'Villa',
    'Shophouse',
    'Shop-Office (SOHO/SOFO)',
];
const BUDGET_RENO = ['Not needed', 'Below $10k', '$10k – $25k', '$25k – $50k', '$50k – $80k', '$80k – $150k', 'Above $150k'];
const BUDGET_ME = ['Not needed', 'Below $3k', '$3k – $8k', '$8k – $15k', '$15k – $30k', 'Above $30k'];
const BUDGET_FFE = ['Not needed', 'Below $5k', '$5k – $15k', '$15k – $30k', '$30k – $60k', 'Above $60k'];
const BUDGET_TOTAL = ['Below $30k', '$30k – $50k', '$50k – $80k', '$80k – $120k', '$120k – $200k', '$200k – $500k', 'Above $500k'];
const STYLES = ['Wabi-Sabi', 'Bauhaus', 'De Stijl', 'Brutalism', 'Art Nouveau', 'Peranakan', 'Hygge', 'Art Deco', 'Luxury', 'Not sure — help me decide'];
const CULTURAL_NEEDS = [
    '风水 Feng Shui (Chinese geomancy)',
    'Vastu Shastra (Indian orientation)',
    'Islamic / Halal (qibla, wudu, prayer room)',
    '神台 Altar placement (Buddhist / Taoist)',
    'Prayer / Meditation room',
    'Pantang Larang (Malay / Chinese taboos)',
    'Wheelchair / Universal Design',
    'None of the above',
];
const TIMELINES = ['ASAP (keys received)', 'Within 3 months', '3–6 months', '6–12 months', 'Just exploring'];
const PROJECT_REASONS = [
    'New renovation (moving in)',
    'Resale / pre-owned refresh',
    'Reinstatement (fire, flood, structural)',
    'Insurance claim / loss adjuster involved',
    'Addition & alteration (A&A)',
    'Partial upgrade (kitchen / bathroom only)',
    'Just exploring options',
];
const OCCUPANTS = ['Couple', 'Child (young)', 'Child (teen)', 'Elderly parent', 'Helper / maid', 'Work from home', 'Guest room', 'Pets', 'Wheelchair user', 'Storage / utility', 'Empty'];
const ROOM_LAYOUTS: Record<string, string[]> = {
    // ── SG HDB Flats (single level) ──
    'HDB 2-Room Flexi': ['Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Bomb Shelter'],
    'HDB 3-Room': ['Master Bedroom', 'Bedroom 2', 'Living Room', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Bomb Shelter'],
    'HDB 4-Room': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Living Room', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Bomb Shelter', 'Service Yard'],
    'HDB 5-Room': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Study / Bedroom 4', 'Living Room', 'Dining', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Bomb Shelter', 'Service Yard'],
    'HDB 3Gen (Multi-Gen)': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Bedroom 4 (elderly)', 'Living Room', 'Dining', 'Kitchen', 'Bathroom 1 (master)', 'Bathroom 2 (elderly)', 'Bathroom 3 (common)', 'Bomb Shelter', 'Service Yard'],
    'HDB Executive (EA)': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Study / Bedroom 4', 'Living Room', 'Dining', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Balcony', 'Bomb Shelter', 'Service Yard'],
    // ── SG HDB Maisonettes (2-level!) ──
    'HDB Executive Maisonette (EM)': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Service Yard', 'L2 — Master Bedroom', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Study / Bedroom 4', 'L2 — Bathroom 1', 'L2 — Bathroom 2'],
    'HDB 5-Room Maisonette': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Service Yard', 'L2 — Master Bedroom', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bathroom 1', 'L2 — Bathroom 2'],
    // ── SG HDB Special Types (single level) ──
    'HDB DBSS': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Study', 'Living Room', 'Dining', 'Kitchen (enclosed)', 'Bathroom 1', 'Bathroom 2', 'Bathroom 3', 'Bomb Shelter', 'Service Yard'],
    'HDB Jumbo': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Bedroom 4', 'Bedroom 5', 'Living Room', 'Dining', 'Kitchen 1', 'Kitchen 2', 'Bathroom 1', 'Bathroom 2', 'Bathroom 3', 'Service Yard 1', 'Service Yard 2'],
    // ── SG Condos ──
    'Executive Condo (EC)': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Study', 'Living Room', 'Dining', 'Kitchen (wet)', 'Kitchen (dry)', 'Bathroom 1', 'Bathroom 2', 'Bathroom 3', 'Balcony', 'Yard'],
    'Condo — Studio': ['Bedroom / Living', 'Kitchen', 'Bathroom'],
    'Condo — 1 Bedroom': ['Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Balcony'],
    'Condo — 2 Bedroom': ['Master Bedroom', 'Bedroom 2', 'Living Room', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Balcony'],
    'Condo — 3 Bedroom': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Study', 'Living Room', 'Dining', 'Kitchen (wet)', 'Kitchen (dry)', 'Bathroom 1', 'Bathroom 2', 'Bathroom 3', 'Balcony', 'Yard'],
    'Condo — Penthouse / Loft': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Balcony', 'L2 — Master Suite', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bedroom 4', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'L2 — Bathroom 3', 'Roof — Terrace'],
    // ── SG Landed (multi-level) ──
    'Landed — Terrace': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Helper Room', 'L1 — Car Porch', 'L2 — Master Bedroom', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bathroom 1', 'L2 — Bathroom 2'],
    'Landed — Semi-D': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen (wet)', 'L1 — Kitchen (dry)', 'L1 — Bathroom', 'L1 — Helper Room', 'L1 — Car Porch', 'L2 — Master Bedroom', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bedroom 4', 'L2 — Family Room', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'L2 — Bathroom 3', 'Ext — Garden'],
    'Landed — Bungalow / GCB': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen (wet)', 'L1 — Kitchen (dry)', 'L1 — Bathroom', 'L1 — Helper Room', 'L1 — Laundry', 'L1 — Car Porch', 'L2 — Master Suite', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bedroom 4', 'L2 — Family Room', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'L2 — Bathroom 3', 'L3 — Bedroom 5', 'L3 — Bedroom 6', 'L3 — Bathroom', 'Ext — Pool Area', 'Ext — Garden'],
    // ── SG Shophouse (multi-level) ──
    'Shophouse': ['L1 — Commercial / Retail', 'L1 — Back Kitchen', 'L1 — Bathroom', 'L1 — Airwell', 'L2 — Living Room', 'L2 — Dining', 'L2 — Bathroom', 'L3 — Master Bedroom', 'L3 — Bedroom 2', 'L3 — Bedroom 3', 'L3 — Bathroom', 'Roof — Terrace'],
    // ── MY Flats (single level) ──
    'Flat / Apartment': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Living Room', 'Kitchen', 'Bathroom 1', 'Bathroom 2'],
    'Condo / Serviced Residence — Studio': ['Bedroom / Living', 'Kitchen', 'Bathroom'],
    'Condo / Serviced Residence — 1-3 Bed': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Study', 'Living Room', 'Dining', 'Kitchen (wet)', 'Kitchen (dry)', 'Bathroom 1', 'Bathroom 2', 'Bathroom 3', 'Balcony'],
    'Condo / Serviced Residence — Penthouse': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Balcony', 'L2 — Master Suite', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'Roof — Terrace'],
    // ── MY Landed (multi-level) ──
    'Townhouse': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Car Porch', 'L2 — Master Bedroom', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'L3 — Bedroom 4', 'L3 — Bathroom'],
    'Terrace (Single Storey)': ['Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Living Room', 'Kitchen', 'Bathroom 1', 'Bathroom 2', 'Car Porch'],
    'Terrace (Double Storey)': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Car Porch', 'L2 — Master Bedroom', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bedroom 4', 'L2 — Bathroom 1', 'L2 — Bathroom 2'],
    'Semi-D': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen (wet)', 'L1 — Kitchen (dry)', 'L1 — Bathroom', 'L1 — Helper Room', 'L1 — Car Porch', 'L2 — Master Bedroom', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bedroom 4', 'L2 — Family Room', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'L2 — Bathroom 3', 'Ext — Garden'],
    'Bungalow': ['L1 — Living Room', 'L1 — Dining', 'L1 — Kitchen (wet)', 'L1 — Kitchen (dry)', 'L1 — Bathroom', 'L1 — Helper Room', 'L1 — Car Porch', 'L2 — Master Suite', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bedroom 4', 'L2 — Family Room', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'L2 — Bathroom 3', 'Ext — Pool Area', 'Ext — Garden'],
    'Villa': ['L1 — Grand Living', 'L1 — Formal Dining', 'L1 — Kitchen', 'L1 — Bathroom', 'L1 — Helper Room', 'L1 — Car Porch', 'L2 — Master Suite', 'L2 — Bedroom 2', 'L2 — Bedroom 3', 'L2 — Bedroom 4', 'L2 — Family Room', 'L2 — Bathroom 1', 'L2 — Bathroom 2', 'L2 — Bathroom 3', 'L3 — Bedroom 5', 'L3 — Bedroom 6', 'L3 — Bathroom', 'Ext — Pool Area', 'Ext — Garden'],
    'Shop-Office (SOHO/SOFO)': ['Work Area', 'Meeting Room', 'Pantry', 'Bathroom', 'Storage'],
};

export default function HomeownerSignup() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', country: '', property: '', address: '', budgetReno: '', budgetME: '', budgetFFE: '', budgetTotal: '', style: '', timeline: '', notes: '', rooms: {} as Record<string, string>, reason: '', cultural: [] as string[] });
    const [honeypot, setHoneypot] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const f = "'Inter', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, sans-serif";
    const mono = "'JetBrains Mono', 'SF Mono', 'Consolas', monospace";

    const propertyTypes = form.country === 'MY' ? MY_PROPERTIES : SG_PROPERTIES;
    const currentRooms = ROOM_LAYOUTS[form.property] || [];

    const setRoomOccupant = (room: string, occupant: string) => {
        setForm(p => ({ ...p, rooms: { ...p.rooms, [room]: occupant } }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.phone) return;
        setIsSubmitting(true);
        setMessage('');
        try {
            const res = await fetch('/api/submit/homeowner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: form.name,
                    email: form.email,
                    phone: form.phone,
                    country: form.country,
                    property_type: form.property,
                    property_address: form.address,
                    project_reason: form.reason,
                    budget_renovation: form.budgetReno,
                    budget_me: form.budgetME,
                    budget_ffe: form.budgetFFE,
                    budget_total: form.budgetTotal,
                    timeline: form.timeline,
                    preferred_style: form.style,
                    rooms: form.rooms,
                    cultural_requirements: form.cultural,
                    notes: form.notes,
                    _website: honeypot,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Something went wrong.');
                setMessageType('error');
            } else {
                setMessage('Submitted! We will match you with 3 designers within 24 hours.');
                setMessageType('success');
                setForm({ name: '', email: '', phone: '', password: '', country: '', property: '', address: '', budgetReno: '', budgetME: '', budgetFFE: '', budgetTotal: '', style: '', timeline: '', notes: '', rooms: {}, reason: '', cultural: [] });
            }
        } catch {
            setMessage('Connection error. Please try again.');
            setMessageType('error');
        }
        setIsSubmitting(false);
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', fontSize: 13, fontFamily: f,
        border: '1px solid rgba(0,0,0,0.15)', borderRadius: 6,
        background: 'transparent', color: '#111', outline: 'none',
        transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
    };
    const labelStyle = {
        fontFamily: mono, fontSize: 9, fontWeight: 600 as const,
        color: 'rgba(0,0,0,0.55)', letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        display: 'block' as const, marginBottom: 8,
    };
    const selectStyle = {
        ...inputStyle, cursor: 'pointer' as const, appearance: 'none' as const,
        color: 'rgba(0,0,0,0.5)',
    };
    const chipStyle = (active: boolean) => ({
        fontSize: 11, padding: '6px 14px', borderRadius: 20, cursor: 'pointer' as const,
        border: `1px solid ${active ? '#111' : 'rgba(0,0,0,0.12)'}`,
        background: active ? '#111' : 'transparent',
        color: active ? '#fff' : 'rgba(0,0,0,0.6)', fontWeight: active ? 600 : 400 as const,
        transition: 'all 0.15s', fontFamily: f, display: 'inline-block' as const,
    });

    return (
        <div style={{ fontFamily: f, background: '#fafafa', minHeight: '100vh', color: '#111' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            <style>{`
                input:focus, select:focus, textarea:focus { border-color: rgba(0,0,0,0.5) !important; }
                input::placeholder, textarea::placeholder { color: rgba(0,0,0,0.3); }
            `}</style>

            {/* ═══════ TOP BAR ═══════ */}
            <nav style={{
                padding: '0 48px', height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Link href="/landing" style={{
                        fontFamily: mono, fontSize: 11, fontWeight: 500,
                        color: 'rgba(0,0,0,0.5)', letterSpacing: '0.14em',
                        textTransform: 'uppercase' as const, textDecoration: 'none',
                    }}>ROOF</Link>
                    <span style={{ color: 'rgba(0,0,0,0.12)' }}>/</span>
                    <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>HOMEOWNER</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/signup/homeowner/taste" style={{
                        fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', textDecoration: 'none',
                    }}>🎨 Take Taste Quiz</Link>
                    <Link href="/login" style={{
                        fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', textDecoration: 'none',
                    }}>Log in</Link>
                </div>
            </nav>

            {/* Honeypot */}
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>

            {/* ═══════ CONTENT ═══════ */}
            <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 48px 80px' }}>
                <div style={{
                    fontFamily: mono, fontSize: 10, fontWeight: 500,
                    color: 'rgba(0,0,0,0.45)', letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const, marginBottom: 24,
                }}>HOMEOWNER MATCHING</div>

                <h1 style={{
                    fontSize: 32, fontWeight: 300, letterSpacing: '-0.03em',
                    margin: '0 0 8px', color: '#111',
                }}>
                    Find your<br />
                    <span style={{ color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>designer.</span>
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', margin: '0 0 48px', lineHeight: 1.6 }}>
                    Tell us about your project and we&apos;ll match you with 3 designers in 24 hours.
                </p>

                {/* YOUR DETAILS */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>YOUR DETAILS</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="David Lim" />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input style={inputStyle} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+65 9xxx xxxx" />
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="david@email.com" />
                    </div>
                    <div>
                        <label style={labelStyle}>Password</label>
                        <input style={inputStyle} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" />
                        <p style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 6, lineHeight: 1.4 }}>
                            Create an account to track your project, chat with designers, and review quotes.
                        </p>
                    </div>
                </div>

                {/* PROJECT DETAILS */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>PROJECT DETAILS</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>Country</label>
                            <select style={{ ...selectStyle, color: form.country ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value, property: '' }))}>
                                <option value="">Select country</option>
                                <option value="SG">🇸🇬 Singapore</option>
                                <option value="MY">🇲🇾 Malaysia</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Property Type</label>
                            <select style={{ ...selectStyle, color: form.property ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.property} onChange={e => setForm(p => ({ ...p, property: e.target.value, rooms: {} }))}>
                                <option value="">{form.country ? 'Select type' : 'Select country first'}</option>
                                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Property Address or Postal Code</label>
                        <input style={inputStyle} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder={form.country === 'MY' ? 'e.g. 47301 Petaling Jaya' : 'e.g. 520456 or Block 456 Tampines St 42'} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>What kind of project is this?</label>
                        <select style={{ ...selectStyle, color: form.reason ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}>
                            <option value="">Select project type</option>
                            {PROJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>硬装 Hard Deco (Reno Works)</label>
                            <select style={{ ...selectStyle, color: form.budgetReno ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.budgetReno} onChange={e => setForm(p => ({ ...p, budgetReno: e.target.value }))}>
                                <option value="">Hacking, tiling, carpentry, paint</option>
                                {BUDGET_RENO.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>M&E (Electrical & Plumbing)</label>
                            <select style={{ ...selectStyle, color: form.budgetME ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.budgetME} onChange={e => setForm(p => ({ ...p, budgetME: e.target.value }))}>
                                <option value="">Wiring, aircon, plumbing</option>
                                {BUDGET_ME.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={labelStyle}>软装 Soft Deco (FF&E)</label>
                            <select style={{ ...selectStyle, color: form.budgetFFE ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.budgetFFE} onChange={e => setForm(p => ({ ...p, budgetFFE: e.target.value }))}>
                                <option value="">Sofa, bed, fridge, curtains</option>
                                {BUDGET_FFE.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Total Budget (overall cap)</label>
                            <select style={{ ...selectStyle, color: form.budgetTotal ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.budgetTotal} onChange={e => setForm(p => ({ ...p, budgetTotal: e.target.value }))}>
                                <option value="">Total all-in</option>
                                {BUDGET_TOTAL.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Timeline</label>
                        <select style={{ ...selectStyle, color: form.timeline ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}>
                            <option value="">When do you need?</option>
                            {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {/* ROOM-BY-ROOM ALLOCATION */}
                {currentRooms.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                        <div style={{
                            fontFamily: mono, fontSize: 9, fontWeight: 500,
                            color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                            textTransform: 'uppercase' as const, marginBottom: 20,
                            paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                        }}>ROOM ALLOCATION</div>

                        <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', margin: '0 0 16px', lineHeight: 1.5 }}>
                            Tell us who uses each room — this helps your designer plan for privacy, safety, and accessibility.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {currentRooms.map(room => (
                                <div key={room} style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center',
                                    padding: '8px 12px', borderRadius: 6,
                                    background: form.rooms[room] && form.rooms[room] !== 'Empty' ? 'rgba(0,0,0,0.02)' : 'transparent',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                }}>
                                    <span style={{ fontSize: 12, color: '#111', fontWeight: 500 }}>{room}</span>
                                    <select
                                        style={{ ...selectStyle, fontSize: 11, padding: '6px 10px', color: form.rooms[room] ? '#111' : 'rgba(0,0,0,0.3)' }}
                                        value={form.rooms[room] || ''}
                                        onChange={e => setRoomOccupant(room, e.target.value)}
                                    >
                                        <option value="">Who uses this?</option>
                                        {OCCUPANTS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PREFERENCES */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        fontFamily: mono, fontSize: 9, fontWeight: 500,
                        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.12em',
                        textTransform: 'uppercase' as const, marginBottom: 20,
                        paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}>PREFERENCES</div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Preferred Style</label>
                        <select style={{ ...selectStyle, color: form.style ? '#111' : 'rgba(0,0,0,0.3)' }} value={form.style} onChange={e => setForm(p => ({ ...p, style: e.target.value }))}>
                            <option value="">What&apos;s your vibe?</option>
                            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={labelStyle}>Cultural / Religious Requirements</label>
                        <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', margin: '0 0 10px', lineHeight: 1.4 }}>
                            These affect layout, orientation, and room placement. Select all that apply.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {CULTURAL_NEEDS.map(c => {
                                const active = form.cultural.includes(c);
                                return (
                                    <button key={c} type="button" style={chipStyle(active)} onClick={() => {
                                        setForm(p => ({
                                            ...p,
                                            cultural: active ? p.cultural.filter(x => x !== c) : [...p.cultural, c],
                                        }));
                                    }}>{c}</button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Anything else we should know?</label>
                        <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' as const }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="E.g. Must have home office, prefer open kitchen, need extra storage..." />
                    </div>
                </div>

                {/* SUBMIT */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !form.name || !form.phone}
                    style={{
                        width: '100%', padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: f,
                        color: '#fff', background: isSubmitting ? 'rgba(0,0,0,0.3)' : '#111',
                        border: 'none', borderRadius: 6,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Get My 3 Matches →'}
                </button>

                {message && (
                    <div style={{
                        marginTop: 16, padding: '10px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                        background: messageType === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.06)',
                        color: messageType === 'success' ? '#059669' : 'rgba(220,38,38,0.8)',
                        border: `1px solid ${messageType === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.1)'}`,
                    }}>{message}</div>
                )}

                <p style={{
                    fontFamily: mono, fontSize: 9, color: 'rgba(0,0,0,0.4)', textAlign: 'center',
                    marginTop: 16, letterSpacing: '0.03em',
                }}>
                    100% Free · No obligations · Matches within 24 hours
                </p>
            </div>

            {/* ═══════ FOOTER ═══════ */}
            <footer style={{
                padding: '28px 48px', borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em' }}>
                    © 2026 ROOF · SINGAPORE
                </span>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Landing', href: '/landing' },
                        { label: 'Platform', href: '/hub' },
                    ].map(link => (
                        <Link key={link.label} href={link.href}
                            style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.35)'}
                        >{link.label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
