'use client';

import React, { useState, useMemo } from 'react';
import RoofNav from '@/components/RoofNav';
import { useRole } from '@/components/RoleContext';
import type { RoleId } from '@/components/RoleContext';
import { PAINT_BRANDS, PAINT_FINISHES, VERNACULAR_ARCHITECTURE, ADDITIONAL_ARCHITECTURE, PEDIGREE_FURNITURE, CRAFT_HERITAGE, LIGHTING_DESIGNS } from '@/data/materialEncyclopedia';
import type { PaintEntry, ArchitectureStyle, FurnitureEntry, CraftEntry, LightingEntry } from '@/data/materialEncyclopedia';

// ============================================================
// SEQUENCE — Interior Design Studio Operating System
// Design DNA | Material Library | Client Brief | Drawings | FF&E
// ============================================================

type Section = 'dna' | 'materials' | 'suppliers' | 'sketchup' | 'brief' | 'survey' | 'drawings' | 'boards' | 'client-deck' | 'tradesman-pack' | 'issues' | 'checklists';
type EncyclopediaTab = 'all' | 'paint' | 'architecture' | 'furniture' | 'craft' | 'lighting';

const SECTIONS: { id: Section; label: string; group: string }[] = [
    { id: 'dna', label: 'Design DNA', group: 'Design System' },
    { id: 'materials', label: 'Material Library', group: 'Design System' },
    { id: 'suppliers', label: 'Suppliers', group: 'Design System' },
    { id: 'sketchup', label: 'SketchUp', group: 'Design System' },
    { id: 'brief', label: 'Client Brief', group: 'Project Hub' },
    { id: 'survey', label: 'Site Survey', group: 'Project Hub' },
    { id: 'drawings', label: 'Drawings', group: 'Project Hub' },
    { id: 'boards', label: 'Design Boards', group: 'Project Hub' },
    { id: 'client-deck', label: 'Client Deck', group: 'Delivery' },
    { id: 'tradesman-pack', label: 'Tradesman Pack', group: 'Delivery' },
    { id: 'issues', label: 'Issue Tracker', group: 'Execution' },
    { id: 'checklists', label: 'Site Checklists', group: 'Execution' },
];

// ── Role-based section visibility ──
const ROLE_SECTIONS: Record<RoleId, Section[]> = {
    designer: ['dna', 'materials', 'suppliers', 'sketchup', 'brief', 'survey', 'drawings', 'boards', 'client-deck', 'tradesman-pack', 'issues', 'checklists'],
    firm_owner: ['dna', 'materials', 'suppliers', 'sketchup', 'brief', 'survey', 'drawings', 'boards', 'client-deck', 'tradesman-pack', 'issues', 'checklists'],
    drafter: ['dna', 'materials', 'sketchup', 'brief', 'drawings', 'boards', 'issues'],
    contractor: ['suppliers', 'survey', 'drawings', 'tradesman-pack', 'issues', 'checklists'],
    admin: ['dna', 'materials', 'suppliers', 'sketchup', 'brief', 'survey', 'drawings', 'boards', 'client-deck', 'tradesman-pack', 'issues', 'checklists'],
};

// ── Demo Data ──

const DNA_CARDS = [
    { id: 1, category: 'Lighting', title: 'Warm Residential Rule', rule: 'Always use 2700K-3000K warm white for residential living spaces. Never use cool white (4000K+) in bedrooms or living areas.', tags: ['Living Room', 'Bedroom', 'Dining'], good: 'Warm 2700K', bad: 'Cool 4000K' },
    { id: 2, category: 'Materials', title: 'Wet Zone Flooring', rule: 'Never use glossy or polished tiles in wet zones. Always specify slip-rated (R10+) matte finishes for bathrooms and kitchens.', tags: ['Bathroom', 'Kitchen', 'Balcony'], good: 'Matte R10', bad: 'Glossy' },
    { id: 3, category: 'Layout', title: 'Grout Line Alignment', rule: 'Floor tile grout lines must align with wall tile grout lines at junctions. Mark on floor before tiling begins.', tags: ['Tiling', 'Quality Control'], good: 'Aligned', bad: 'Random' },
    { id: 4, category: 'Forbidden', title: 'Banned Materials', rule: 'Never specify: Glossy laminate, Chrome hardware, LED strips without diffuser channels, Exposed wiring in living spaces.', tags: ['All'], good: '', bad: '', forbidden: true },
    { id: 5, category: 'Biophilia', title: 'Greenery Standards', rule: 'For minimalist projects, use fine-leaf evergreens only. No large-leaf tropicals (monstera, fiddle leaf) in Japandi or Scandinavian schemes.', tags: ['Styling', 'Japandi'], good: 'Asparagus Fern', bad: 'Monstera' },
    { id: 6, category: 'Lighting', title: 'Approved Fixture Brands', rule: 'Specify only from approved luxury lighting partners. Budget alternatives require Director approval.', tags: ['Luxury', 'All Rooms'], good: '', bad: '', brands: ['Flos', 'Tom Dixon', 'Moooi', 'Artemide', 'Louis Poulsen'] },
    { id: 7, category: 'Colors', title: 'Corridor Width Standard', rule: 'Minimum corridor width: 900mm for primary paths, 750mm for secondary. Never squeeze below 750mm.', tags: ['Space Planning', 'Ergonomics'], good: '900mm Primary', bad: '650mm' },
    { id: 8, category: 'Styling', title: 'Accessories and Props', rule: 'Ceramics must have matte, non-uniform textures. Metals must be brushed or aged. No shiny or mass-produced accessories.', tags: ['Styling', 'Photography'], good: 'Artisan Ceramic', bad: 'Mass-Produced' },
];

const MATERIALS = [
    { id: 1, name: 'Marine Plywood 18mm', grade: 'E0/E1', supplier: 'SinLec Hardware', rate: '$85/sheet', lead: '3 days', cat: 'Carpentry', img: 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400&h=200&fit=crop' },
    { id: 2, name: 'Blum Tandembox', grade: 'Premium', supplier: 'Hafele SG', rate: '$45/set', lead: '7 days', cat: 'Hardware', img: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&h=200&fit=crop' },
    { id: 3, name: 'Spanish Porcelain 600x600', grade: 'Grade A', supplier: 'Hafary', rate: '$8.50/pc', lead: '14 days', cat: 'Tiling', img: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=200&fit=crop' },
    { id: 4, name: 'Benjamin Moore Regal', grade: 'Premium', supplier: 'Colour Works', rate: '$85/gal', lead: '2 days', cat: 'Paint', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=200&fit=crop' },
    { id: 5, name: 'Hansgrohe Talis M54', grade: 'Premium', supplier: 'TBM Singapore', rate: '$380/pc', lead: '10 days', cat: 'Sanitary', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=200&fit=crop' },
    { id: 6, name: 'Egger Laminate H3309', grade: 'ST28', supplier: 'EDL SG', rate: '$12/sqft', lead: '5 days', cat: 'Carpentry', img: 'https://images.unsplash.com/photo-1567225591450-06036b3392a6?w=400&h=200&fit=crop' },
    { id: 7, name: 'Smeg FAB28', grade: 'Retro', supplier: 'Kitchen Culture', rate: '$2,400/pc', lead: '21 days', cat: 'Appliance', img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=200&fit=crop' },
    { id: 8, name: 'Duravit ME by Starck WC', grade: 'Premium', supplier: 'TBM Singapore', rate: '$650/pc', lead: '14 days', cat: 'Sanitary', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=200&fit=crop' },
];

const SUPPLIERS = [
    { name: 'Hafary', trade: 'Tiles & Stone', rating: 4.8, projects: 12, contact: '+65 6762 9891' },
    { name: 'SinLec Hardware', trade: 'Carpentry Supplies', rating: 4.6, projects: 8, contact: '+65 6289 9011' },
    { name: 'Hafele Singapore', trade: 'Hardware & Fittings', rating: 4.9, projects: 15, contact: '+65 6572 9898' },
    { name: 'TBM Singapore', trade: 'Sanitary & Fittings', rating: 4.7, projects: 10, contact: '+65 6282 0222' },
    { name: 'Kitchen Culture', trade: 'Appliances', rating: 4.5, projects: 6, contact: '+65 6734 5678' },
];

const BRIEF = {
    project: 'Holland V Condo', address: '28 Holland Village Way #12-05',
    type: 'Condominium (1,200 sqft)', timeline: '12 weeks',
    occupants: '2 Adults, 1 Child (6yo)', style: 'Warm Minimalism / Japandi',
    counter: '920mm (optimized for 168cm primary user)',
    budget: {
        total: '$80,000 - $100,000',
        hard: [
            { label: 'Hacking & Demolition', amount: '$3,500' },
            { label: 'Masonry & Tiling', amount: '$8,200' },
            { label: 'Plumbing', amount: '$4,800' },
            { label: 'Electrical', amount: '$5,500' },
            { label: 'Carpentry (Built-in)', amount: '$22,000' },
            { label: 'Painting & Finishing', amount: '$3,200' },
            { label: 'Ceiling & Partition', amount: '$2,800' },
        ],
        soft: [
            { label: 'Design Fee', amount: '$8,000' },
            { label: 'FF&E (Furniture)', amount: '$15,000' },
            { label: 'Lighting & Fixtures', amount: '$4,500' },
            { label: 'Window Treatments', amount: '$2,200' },
            { label: 'Permits & Submissions', amount: '$800' },
        ],
        hardTotal: '$50,000',
        softTotal: '$30,500',
    },
    priorities: ['Open-concept living/dining', 'Hidden storage throughout', 'Kid-safe materials', 'Natural light maximization'],
    lifestyle: ['Work from home 3 days/week', 'Frequent entertaining (6-8 pax)', 'Morning yoga in living room', 'Child uses Bedroom 2'],
};

const SURVEY = [
    { room: 'Living Room', dims: '5.2m x 4.1m', area: '21.32 sqm (230 sqft)', ceiling: '2.74m' },
    { room: 'Master Bedroom', dims: '4.0m x 3.5m', area: '14.00 sqm (151 sqft)', ceiling: '2.74m' },
    { room: 'Kitchen', dims: '3.2m x 2.8m', area: '8.96 sqm (96 sqft)', ceiling: '2.74m' },
    { room: 'Bedroom 2', dims: '3.0m x 3.0m', area: '9.00 sqm (97 sqft)', ceiling: '2.74m' },
    { room: 'Master Bathroom', dims: '2.4m x 1.8m', area: '4.32 sqm (47 sqft)', ceiling: '2.40m' },
];

const DRAWINGS = [
    { ref: 'DWG-001', title: 'Proposed Floor Plan', zone: 'Whole Unit', status: 'approved' as const, date: '2026-02-28' },
    { ref: 'DWG-002', title: 'Electrical Point Layout', zone: 'Whole Unit', status: 'pending' as const, date: '2026-03-01' },
    { ref: 'DWG-003', title: 'Kitchen Elevation A', zone: 'Kitchen', status: 'approved' as const, date: '2026-03-02' },
    { ref: 'DWG-004', title: 'Kitchen Layout Plan', zone: 'Kitchen', status: 'approved' as const, date: '2026-03-02' },
    { ref: 'DWG-005', title: 'Master Bath Elevation', zone: 'Master Bath', status: 'pending' as const, date: '2026-03-03' },
    { ref: 'DWG-006', title: 'Carpentry Details', zone: 'Whole Unit', status: 'draft' as const, date: '2026-03-05' },
];

const ISSUES = [
    { id: 'ISS-001', title: 'Uneven wall in master bath', severity: 'high' as const, zone: 'Master Bath', status: 'open' as const },
    { id: 'ISS-002', title: 'Water stain near AC unit', severity: 'high' as const, zone: 'Living Room', status: 'open' as const },
    { id: 'ISS-003', title: 'Confirm concealed beam location', severity: 'medium' as const, zone: 'Kitchen', status: 'resolved' as const },
    { id: 'ISS-004', title: 'Floor trap alignment check', severity: 'low' as const, zone: 'Bathroom 2', status: 'open' as const },
];

const CHECKLISTS = [
    { name: 'Pre-Renovation', items: 8, done: 8 },
    { name: 'Hacking Completion', items: 6, done: 6 },
    { name: 'Electrical First Fix', items: 10, done: 7 },
    { name: 'Plumbing First Fix', items: 8, done: 4 },
    { name: 'Tiling Sign-off', items: 12, done: 0 },
    { name: 'Carpentry Final', items: 15, done: 0 },
];

// ============================================================
// STYLES
// ============================================================

const f = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const mono = "'JetBrains Mono', 'SF Mono', monospace";

const catColors: Record<string, string> = {
    Lighting: '#F59E0B', Materials: '#3B82F6', Layout: '#8B5CF6', Colors: '#10B981',
    Forbidden: '#EF4444', Biophilia: '#22C55E', Styling: '#EC4899',
};

// ============================================================
// COMPONENT
// ============================================================

export default function SequencePage() {
    const [active, setActive] = useState<Section>('dna');
    const [dnaFilter, setDnaFilter] = useState('All');
    const [encTab, setEncTab] = useState<EncyclopediaTab>('all');
    const [encSearch, setEncSearch] = useState('');
    const [tradesmanLang, setTradesmanLang] = useState('en');
    const { activeRole } = useRole();

    // Filter sections by role
    const allowedSections = ROLE_SECTIONS[activeRole] || ROLE_SECTIONS.designer;
    const visibleSections = SECTIONS.filter(s => allowedSections.includes(s.id));

    // ── Encyclopedia filtering ──
    const encQ = encSearch.toLowerCase();
    const allArch = useMemo(() => [...VERNACULAR_ARCHITECTURE, ...ADDITIONAL_ARCHITECTURE], []);
    const filteredPaints = useMemo(() => PAINT_BRANDS.filter(p =>
        !encQ || p.name.toLowerCase().includes(encQ) || p.brand?.toLowerCase().includes(encQ) || p.type.toLowerCase().includes(encQ) || p.characteristics.toLowerCase().includes(encQ) || p.tropicalNotes?.toLowerCase().includes(encQ)
    ), [encQ]);
    const filteredArch = useMemo(() => allArch.filter(a =>
        !encQ || a.name.toLowerCase().includes(encQ) || a.origin.toLowerCase().includes(encQ) || a.region.toLowerCase().includes(encQ) || a.characteristics.toLowerCase().includes(encQ) || a.materials?.toLowerCase().includes(encQ) || a.roofType?.toLowerCase().includes(encQ)
    ), [encQ, allArch]);
    const filteredFurniture = useMemo(() => PEDIGREE_FURNITURE.filter(fu =>
        !encQ || fu.name.toLowerCase().includes(encQ) || fu.designer.toLowerCase().includes(encQ) || fu.style.toLowerCase().includes(encQ) || fu.materials.toLowerCase().includes(encQ) || fu.significance.toLowerCase().includes(encQ)
    ), [encQ]);
    const filteredCraft = useMemo(() => CRAFT_HERITAGE.filter(c =>
        !encQ || c.name.toLowerCase().includes(encQ) || c.category.toLowerCase().includes(encQ) || c.origin.toLowerCase().includes(encQ) || c.materials.toLowerCase().includes(encQ) || c.construction.toLowerCase().includes(encQ)
    ), [encQ]);
    const filteredLighting = useMemo(() => LIGHTING_DESIGNS.filter(l =>
        !encQ || l.name.toLowerCase().includes(encQ) || l.designer.toLowerCase().includes(encQ) || l.designerCountry.toLowerCase().includes(encQ) || l.manufacturer.toLowerCase().includes(encQ) || l.category.toLowerCase().includes(encQ) || l.materials.toLowerCase().includes(encQ) || l.significance.toLowerCase().includes(encQ)
    ), [encQ]);
    const encTotalResults = (encTab === 'all' || encTab === 'paint' ? filteredPaints.length : 0)
        + (encTab === 'all' || encTab === 'architecture' ? filteredArch.length : 0)
        + (encTab === 'all' || encTab === 'furniture' ? filteredFurniture.length : 0)
        + (encTab === 'all' || encTab === 'craft' ? filteredCraft.length : 0)
        + (encTab === 'all' || encTab === 'lighting' ? filteredLighting.length : 0);
    const tropicalStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const craftStatusColors: Record<string, { bg: string; color: string; icon: string }> = {
        thriving: { bg: '#F0FDF4', color: '#16A34A', icon: '🟢' },
        active: { bg: '#EFF6FF', color: '#2563EB', icon: '🔵' },
        declining: { bg: '#FEF9C3', color: '#CA8A04', icon: '🟡' },
        endangered: { bg: '#FEF2F2', color: '#DC2626', icon: '🔴' },
        rare: { bg: '#FDF4FF', color: '#9333EA', icon: '🟣' },
        'near-extinct': { bg: '#1F2937', color: '#F87171', icon: '⚫' },
    };

    const groups = ['Design System', 'Project Hub', 'Delivery', 'Execution'];
    const visibleGroups = groups.filter(g => visibleSections.some(s => s.group === g));

    const filteredDNA = dnaFilter === 'All'
        ? DNA_CARDS
        : DNA_CARDS.filter(c => c.category === dnaFilter);

    return (
        <div style={{ fontFamily: f, minHeight: '100vh', background: '#FAFAF9' }}>
            <RoofNav />

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 48px)' }}>
                {/* ── Sidebar ── */}
                <aside style={{
                    width: 220, borderRight: '1px solid #E9E9E7', background: '#fff',
                    padding: '20px 0', flexShrink: 0, position: 'sticky', top: 48, height: 'calc(100vh - 48px)', overflowY: 'auto',
                }}>
                    <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #F3F3F2' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#37352F', letterSpacing: '-0.01em' }}>Sequence</div>
                        <div style={{ fontSize: 10, color: '#9B9A97', marginTop: 2 }}>Design Studio OS</div>
                    </div>

                    <nav style={{ padding: '12px 8px' }}>
                        {visibleGroups.map(group => (
                            <div key={group} style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', marginBottom: 2 }}>
                                    {group}
                                </div>
                                {visibleSections.filter(s => s.group === group).map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActive(s.id)}
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'left',
                                            padding: '6px 8px', fontSize: 12, fontWeight: active === s.id ? 600 : 400,
                                            color: active === s.id ? '#37352F' : '#6B6A67',
                                            background: active === s.id ? '#F7F6F3' : 'transparent',
                                            border: 'none', borderRadius: 4, cursor: 'pointer',
                                            fontFamily: f, transition: 'all 0.1s',
                                        }}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </nav>

                    {/* User */}
                    <div style={{ padding: '16px', borderTop: '1px solid #F3F3F2', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#37352F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>JC</div>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: '#37352F' }}>Jessica Chen</div>
                                <div style={{ fontSize: 9, color: '#9B9A97' }}>Senior Designer</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>

                    {/* ═══ DESIGN DNA ═══ */}
                    {active === 'dna' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>Design DNA Cards</h2>
                                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>Your studio's taste, codified into executable rules</p>
                                </div>
                                <button style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                    + Add DNA Card
                                </button>
                            </div>

                            {/* Filters */}
                            <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
                                {['All', 'Lighting', 'Materials', 'Layout', 'Colors', 'Forbidden', 'Biophilia', 'Styling'].map(f => (
                                    <button key={f} onClick={() => setDnaFilter(f)} style={{
                                        padding: '5px 12px', fontSize: 11, fontWeight: dnaFilter === f ? 700 : 400,
                                        background: dnaFilter === f ? '#37352F' : '#F7F6F3',
                                        color: dnaFilter === f ? '#fff' : '#6B6A67',
                                        border: 'none', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                                    }}>{f}</button>
                                ))}
                            </div>

                            {/* Cards Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                                {filteredDNA.map(card => (
                                    <div key={card.id} style={{
                                        background: '#fff', border: card.forbidden ? '1px solid #FECACA' : '1px solid #E9E9E7',
                                        borderRadius: 10, padding: 20, transition: 'box-shadow 0.15s',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                                                padding: '3px 8px', borderRadius: 4,
                                                background: card.forbidden ? '#FEF2F2' : 'rgba(55,53,47,0.06)',
                                                color: catColors[card.category] || '#37352F',
                                            }}>{card.category}</span>
                                        </div>
                                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 8px' }}>{card.title}</h3>
                                        <p style={{ fontSize: 12, color: '#6B6A67', lineHeight: 1.6, margin: '0 0 12px' }}>{card.rule}</p>

                                        {card.brands && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                                                {card.brands.map(b => (
                                                    <span key={b} style={{ padding: '4px 10px', background: '#F7F6F3', borderRadius: 4, fontSize: 11, fontWeight: 500, color: '#37352F' }}>{b}</span>
                                                ))}
                                            </div>
                                        )}

                                        {card.good && card.bad && (
                                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                                <div style={{ flex: 1, borderRadius: 6, overflow: 'hidden' }}>
                                                    <div style={{ height: 60, background: 'linear-gradient(135deg, #4ADE80, #22C55E)' }} />
                                                    <div style={{ fontSize: 9, fontWeight: 600, textAlign: 'center', padding: 4, color: '#22C55E' }}>{card.good}</div>
                                                </div>
                                                <div style={{ flex: 1, borderRadius: 6, overflow: 'hidden' }}>
                                                    <div style={{ height: 60, background: 'linear-gradient(135deg, #FB7185, #EF4444)' }} />
                                                    <div style={{ fontSize: 9, fontWeight: 600, textAlign: 'center', padding: 4, color: '#EF4444' }}>{card.bad}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                            {card.tags.map(t => (
                                                <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: '#F7F6F3', borderRadius: 10, color: '#9B9A97', fontWeight: 500 }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ MATERIAL LIBRARY — ENCYCLOPEDIA BROWSER ═══ */}
                    {active === 'materials' && (
                        <div>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>Material Encyclopedia</h2>
                                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>
                                        {PAINT_BRANDS.length} paints · {allArch.length} architecture styles · {PEDIGREE_FURNITURE.length} iconic furniture · {CRAFT_HERITAGE.length} craft traditions · {LIGHTING_DESIGNS.length} lighting designs
                                    </p>
                                </div>
                            </div>

                            {/* Search */}
                            <div style={{ marginBottom: 16 }}>
                                <input
                                    type="text" placeholder="Search across all encyclopedias... (e.g. 'tropical', 'Eames', 'zellige', 'Japanese')"
                                    value={encSearch} onChange={e => setEncSearch(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 16px', fontSize: 13, border: '1px solid #E9E9E7',
                                        borderRadius: 8, outline: 'none', fontFamily: f, background: '#fff', boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                                {([
                                    { id: 'all' as EncyclopediaTab, label: 'All', count: PAINT_BRANDS.length + allArch.length + PEDIGREE_FURNITURE.length + CRAFT_HERITAGE.length + LIGHTING_DESIGNS.length },
                                    { id: 'paint' as EncyclopediaTab, label: '🎨 Paint', count: PAINT_BRANDS.length },
                                    { id: 'architecture' as EncyclopediaTab, label: '🏛️ Architecture', count: allArch.length },
                                    { id: 'furniture' as EncyclopediaTab, label: '🪑 Furniture', count: PEDIGREE_FURNITURE.length },
                                    { id: 'craft' as EncyclopediaTab, label: '🔨 Craft Heritage', count: CRAFT_HERITAGE.length },
                                    { id: 'lighting' as EncyclopediaTab, label: '💡 Lighting', count: LIGHTING_DESIGNS.length },
                                ]).map(tab => (
                                    <button key={tab.id} onClick={() => setEncTab(tab.id)} style={{
                                        padding: '6px 14px', fontSize: 11, fontWeight: encTab === tab.id ? 700 : 400,
                                        background: encTab === tab.id ? '#37352F' : '#F7F6F3',
                                        color: encTab === tab.id ? '#fff' : '#6B6A67',
                                        border: 'none', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                                    }}>
                                        {tab.label} <span style={{ opacity: 0.7, fontSize: 10 }}>({tab.count})</span>
                                    </button>
                                ))}
                            </div>

                            {/* Results Count */}
                            {encQ && <div style={{ fontSize: 11, color: '#9B9A97', marginBottom: 12 }}>{encTotalResults} results for &ldquo;{encSearch}&rdquo;</div>}

                            {/* ═══ PAINT SECTION ═══ */}
                            {(encTab === 'all' || encTab === 'paint') && filteredPaints.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F3F2' }}>
                                        <div style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(135deg, #F97316, #EA580C)' }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>🎨 Paint Encyclopedia</span>
                                        <span style={{ fontSize: 10, fontWeight: 500, color: '#9B9A97' }}>{filteredPaints.length} paints</span>
                                    </div>

                                    {/* Paint Finish Guide */}
                                    {!encQ && encTab === 'paint' && (
                                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>🌡️ TROPICAL FINISH GUIDE — Best finish for SG/MY humidity</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>
                                                {PAINT_FINISHES.map(pf => (
                                                    <div key={pf.name} style={{ background: '#fff', borderRadius: 6, padding: '8px 10px', border: '1px solid #FEF3C7' }}>
                                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#37352F' }}>{pf.name}</div>
                                                        <div style={{ fontSize: 9, color: '#92400E', fontWeight: 600 }}>Sheen: {pf.sheen}</div>
                                                        <div style={{ fontSize: 9, color: '#6B6A67', marginTop: 2 }}>{pf.tropicalAdvice}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                                        {filteredPaints.slice(0, encTab === 'all' ? 6 : undefined).map((p, i) => (
                                            <div key={`${p.name}-${i}`} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 16, transition: 'box-shadow 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                    <div>
                                                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, background: '#FEF3C7', color: '#92400E' }}>{p.type}</span>
                                                    </div>
                                                    <div style={{ fontSize: 14, color: p.tropicalRating >= 4 ? '#22C55E' : p.tropicalRating >= 3 ? '#F59E0B' : '#EF4444', lineHeight: 1, letterSpacing: 1 }} title={`Tropical Rating: ${p.tropicalRating}/5`}>
                                                        {tropicalStars(p.tropicalRating)}
                                                    </div>
                                                </div>
                                                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 4px' }}>{p.name}</h3>
                                                <div style={{ fontSize: 10, color: '#9B9A97', marginBottom: 6 }}>{p.brand} · {p.brandCountry}</div>
                                                <p style={{ fontSize: 11, color: '#6B6A67', lineHeight: 1.5, margin: '0 0 8px' }}>{p.characteristics}</p>
                                                {p.tropicalNotes && <div style={{ fontSize: 10, color: p.tropicalRating >= 4 ? '#16A34A' : '#CA8A04', background: p.tropicalRating >= 4 ? '#F0FDF4' : '#FFFBEB', padding: '4px 8px', borderRadius: 4, marginBottom: 8 }}>🌴 {p.tropicalNotes}</div>}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #F3F3F2', fontSize: 10 }}>
                                                    <span style={{ fontFamily: mono, fontWeight: 700, color: '#37352F' }}>{p.priceRange}</span>
                                                    {p.finish && <span style={{ color: '#9B9A97' }}>{p.finish}</span>}
                                                    {p.vocLevel && <span style={{ padding: '2px 6px', borderRadius: 3, background: p.vocLevel.includes('Zero') ? '#F0FDF4' : '#F7F6F3', color: p.vocLevel.includes('Zero') ? '#16A34A' : '#6B6A67', fontWeight: 600 }}>{p.vocLevel}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {encTab === 'all' && filteredPaints.length > 6 && (
                                        <button onClick={() => setEncTab('paint')} style={{ marginTop: 8, fontSize: 11, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all {filteredPaints.length} paints →</button>
                                    )}
                                </div>
                            )}

                            {/* ═══ ARCHITECTURE SECTION ═══ */}
                            {(encTab === 'all' || encTab === 'architecture') && filteredArch.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F3F2' }}>
                                        <div style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>🏛️ World Architecture</span>
                                        <span style={{ fontSize: 10, fontWeight: 500, color: '#9B9A97' }}>{filteredArch.length} styles</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                                        {filteredArch.slice(0, encTab === 'all' ? 6 : undefined).map((a, i) => (
                                            <div key={`${a.name}-${i}`} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 16, transition: 'box-shadow 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, background: '#EDE9FE', color: '#7C3AED' }}>{a.region}</span>
                                                </div>
                                                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 2px' }}>{a.name}</h3>
                                                {a.localName && <div style={{ fontSize: 10, color: '#9B9A97', marginBottom: 4, fontStyle: 'italic' }}>{a.localName}</div>}
                                                <div style={{ fontSize: 10, color: '#8B5CF6', fontWeight: 600, marginBottom: 6 }}>⌂ {a.roofType}</div>
                                                <p style={{ fontSize: 11, color: '#6B6A67', lineHeight: 1.5, margin: '0 0 8px' }}>{a.characteristics}</p>
                                                <div style={{ fontSize: 10, color: '#37352F', background: '#F7F6F3', padding: '6px 8px', borderRadius: 4, marginBottom: 6 }}>
                                                    <strong>Materials:</strong> {a.materials}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F3F3F2', fontSize: 10 }}>
                                                    <span style={{ color: '#9B9A97' }}>{a.origin}</span>
                                                    {a.modernUse && <span style={{ color: '#6B6A67', fontWeight: 500 }}>→ {a.modernUse}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {encTab === 'all' && filteredArch.length > 6 && (
                                        <button onClick={() => setEncTab('architecture')} style={{ marginTop: 8, fontSize: 11, color: '#8B5CF6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all {filteredArch.length} architecture styles →</button>
                                    )}
                                </div>
                            )}

                            {/* ═══ PEDIGREE FURNITURE SECTION ═══ */}
                            {(encTab === 'all' || encTab === 'furniture') && filteredFurniture.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F3F2' }}>
                                        <div style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(135deg, #F59E0B, #D97706)' }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>🪑 Pedigree Furniture</span>
                                        <span style={{ fontSize: 10, fontWeight: 500, color: '#9B9A97' }}>{filteredFurniture.length} iconic pieces</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 12 }}>
                                        {filteredFurniture.slice(0, encTab === 'all' ? 4 : undefined).map((fur, i) => (
                                            <div key={`${fur.name}-${i}`} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 16, transition: 'box-shadow 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, background: '#FEF3C7', color: '#92400E' }}>{fur.style}</span>
                                                    <span style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', fontFamily: mono }}>{fur.designYear}</span>
                                                </div>
                                                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 2px' }}>{fur.name}</h3>
                                                <div style={{ fontSize: 11, color: '#6B6A67', marginBottom: 6 }}>{fur.designer} · {fur.category}</div>
                                                <p style={{ fontSize: 11, color: '#6B6A67', lineHeight: 1.5, margin: '0 0 6px' }}>{fur.materials}</p>
                                                <div style={{ fontSize: 10, color: '#37352F', background: '#F7F6F3', padding: '6px 8px', borderRadius: 4, marginBottom: 6, lineHeight: 1.5 }}>
                                                    <strong>Construction:</strong> {fur.construction}
                                                </div>
                                                <div style={{ fontSize: 10, fontStyle: 'italic', color: '#8B5CF6', marginBottom: 8, lineHeight: 1.4 }}>
                                                    &ldquo;{fur.significance}&rdquo;
                                                </div>
                                                {fur.authentication && (
                                                    <div style={{ fontSize: 10, background: '#FEF2F2', padding: '6px 8px', borderRadius: 4, color: '#991B1B', marginBottom: 8, lineHeight: 1.4 }}>
                                                        🔍 <strong>Authentication:</strong> {fur.authentication}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #F3F3F2', fontSize: 10 }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#16A34A' }}>✓ Authentic: {fur.authenticPrice}</div>
                                                        {fur.reproductionPrice && <div style={{ color: '#9B9A97' }}>Reproduction: {fur.reproductionPrice}</div>}
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: 9, color: '#9B9A97' }}>Authorized by</div>
                                                        <div style={{ fontWeight: 700, color: '#37352F' }}>{fur.currentManufacturer.split('(')[0].trim()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {encTab === 'all' && filteredFurniture.length > 4 && (
                                        <button onClick={() => setEncTab('furniture')} style={{ marginTop: 8, fontSize: 11, color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all {filteredFurniture.length} iconic pieces →</button>
                                    )}
                                </div>
                            )}

                            {/* ═══ CRAFT HERITAGE SECTION ═══ */}
                            {(encTab === 'all' || encTab === 'craft') && filteredCraft.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #F3F3F2' }}>
                                        <div style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(135deg, #10B981, #059669)' }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>🔨 Craft Heritage</span>
                                        <span style={{ fontSize: 10, fontWeight: 500, color: '#9B9A97' }}>{filteredCraft.length} craft traditions</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 12 }}>
                                        {filteredCraft.slice(0, encTab === 'all' ? 4 : undefined).map((c, i) => {
                                            const st = craftStatusColors[c.craftStatus] || craftStatusColors.active;
                                            return (
                                                <div key={`${c.name}-${i}`} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 16, transition: 'box-shadow 0.15s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 4, background: '#ECFDF5', color: '#065F46' }}>{c.category}</span>
                                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: st.bg, color: st.color }}>
                                                            {st.icon} {c.craftStatus.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 2px' }}>{c.name}</h3>
                                                    <div style={{ fontSize: 10, color: '#9B9A97', marginBottom: 6 }}>{c.origin} · {c.region}</div>
                                                    <p style={{ fontSize: 11, color: '#6B6A67', lineHeight: 1.5, margin: '0 0 6px' }}>{c.construction}</p>
                                                    {c.woodType && (
                                                        <div style={{ fontSize: 10, background: '#FEF3C7', padding: '4px 8px', borderRadius: 4, marginBottom: 6, color: '#92400E' }}>
                                                            🪵 <strong>Wood:</strong> {c.woodType}
                                                        </div>
                                                    )}
                                                    {c.craftsmenNotes && (
                                                        <div style={{ fontSize: 10, background: st.bg, padding: '6px 8px', borderRadius: 4, color: st.color, marginBottom: 8, lineHeight: 1.4 }}>
                                                            👤 {c.craftsmenNotes}
                                                        </div>
                                                    )}
                                                    {c.craftsmenLocation && (
                                                        <div style={{ fontSize: 10, color: '#6B6A67', marginBottom: 6 }}>📍 <strong>Find them:</strong> {c.craftsmenLocation}</div>
                                                    )}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #F3F3F2', fontSize: 10 }}>
                                                        <span style={{ fontFamily: mono, fontWeight: 700, color: '#37352F' }}>{c.priceRange}</span>
                                                        {c.leadTime && <span style={{ color: '#9B9A97' }}>⏱ {c.leadTime}</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {encTab === 'all' && filteredCraft.length > 4 && (
                                        <button onClick={() => setEncTab('craft')} style={{ marginTop: 8, fontSize: 11, color: '#059669', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all {filteredCraft.length} craft traditions →</button>
                                    )}
                                </div>
                            )}

                            {/* ── LIGHTING DESIGNS ── */}
                            {(encTab === 'all' || encTab === 'lighting') && filteredLighting.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                        <div style={{ width: 3, height: 20, background: '#F59E0B', borderRadius: 2 }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#37352F' }}>💡 Lighting Design</span>
                                        <span style={{ fontSize: 11, color: '#9B9A97' }}>{filteredLighting.length} designs</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                                        {(encTab === 'all' ? filteredLighting.slice(0, 4) : filteredLighting).map((l, i) => {
                                            const countryFlag = l.designerCountry.includes('Denmark') ? '🇩🇰' : l.designerCountry.includes('Italy') ? '🇮🇹' : l.designerCountry.includes('Germany') ? '🇩🇪' : l.designerCountry.includes('UK') || l.designerCountry.includes('United Kingdom') ? '🇬🇧' : l.designerCountry.includes('Japan') ? '🇯🇵' : l.designerCountry.includes('France') ? '🇫🇷' : l.designerCountry.includes('USA') ? '🇺🇸' : l.designerCountry.includes('Sweden') ? '🇸🇪' : l.designerCountry.includes('Netherlands') ? '🇳🇱' : l.designerCountry.includes('Finland') ? '🇫🇮' : l.designerCountry.includes('China') ? '🇨🇳' : l.designerCountry.includes('India') ? '🇮🇳' : l.designerCountry.includes('Morocco') ? '🇲🇦' : l.designerCountry.includes('Turkey') ? '🇹🇷' : l.designerCountry.includes('Korea') ? '🇰🇷' : l.designerCountry.includes('Spain') ? '🇪🇸' : l.designerCountry.includes('Cyprus') ? '🇨🇾' : '🌍';
                                            return (
                                                <div key={i} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 8, padding: 16 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: 4 }}>{l.category}</span>
                                                        <span style={{ fontSize: 18 }}>{countryFlag}</span>
                                                    </div>
                                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: '0 0 4px' }}>{l.name}</h4>
                                                    <div style={{ fontSize: 10, color: '#6B6A67', marginBottom: 8 }}>
                                                        {l.designer} · {l.manufacturer}{l.designYear > 0 ? ` · ${l.designYear}` : ''}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: '#37352F', lineHeight: 1.5, marginBottom: 10 }}>{l.construction}</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                                                        {l.lightSource && <span style={{ fontSize: 9, padding: '2px 6px', background: '#FEF3C7', borderRadius: 4, color: '#92400E' }}>⚡ {l.lightSource}</span>}
                                                        {l.colorTemp && <span style={{ fontSize: 9, padding: '2px 6px', background: '#FEF9C3', borderRadius: 4, color: '#854D0E' }}>🌡 {l.colorTemp}</span>}
                                                        {l.ipRating && <span style={{ fontSize: 9, padding: '2px 6px', background: '#EFF6FF', borderRadius: 4, color: '#1E40AF' }}>🛡 {l.ipRating}</span>}
                                                    </div>
                                                    {l.tropicalNotes && (
                                                        <div style={{ fontSize: 10, background: '#ECFDF5', padding: '6px 8px', borderRadius: 4, color: '#065F46', marginBottom: 8, lineHeight: 1.4 }}>
                                                            🌴 {l.tropicalNotes}
                                                        </div>
                                                    )}
                                                    <div style={{ fontSize: 10, color: '#6B6A67', marginBottom: 8, fontStyle: 'italic' }}>{l.significance}</div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #F3F3F2', fontSize: 10 }}>
                                                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#37352F' }}>{l.authenticPrice}</span>
                                                        <span style={{ color: l.inProduction ? '#16A34A' : '#DC2626', fontWeight: 600 }}>{l.inProduction ? '✓ In Production' : '✗ Discontinued'}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {encTab === 'all' && filteredLighting.length > 4 && (
                                        <button onClick={() => setEncTab('lighting')} style={{ marginTop: 8, fontSize: 11, color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all {filteredLighting.length} lighting designs →</button>
                                    )}
                                </div>
                            )}

                            {encTotalResults === 0 && (
                                <div style={{ textAlign: 'center', padding: 40, color: '#9B9A97' }}>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>No results for &ldquo;{encSearch}&rdquo;</div>
                                    <div style={{ fontSize: 11, marginTop: 4 }}>Try a different search term</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ SUPPLIERS ═══ */}
                    {active === 'suppliers' && (
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: '0 0 20px' }}>Suppliers</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                                {SUPPLIERS.map(s => (
                                    <div key={s.name} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 20 }}>
                                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#37352F', margin: '0 0 4px' }}>{s.name}</h3>
                                        <p style={{ fontSize: 11, color: '#9B9A97', margin: '0 0 12px' }}>{s.trade}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                            <span style={{ color: '#F59E0B', fontWeight: 700 }}>{s.rating} rating</span>
                                            <span style={{ color: '#9B9A97' }}>{s.projects} projects</span>
                                        </div>
                                        <div style={{ fontSize: 10, color: '#6B6A67', marginTop: 8, fontFamily: mono }}>{s.contact}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ CLIENT BRIEF ═══ */}
                    {active === 'brief' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>Client Brief</h2>
                                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>Project requirements and client preferences</p>
                                </div>
                                <button style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Edit Brief</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {/* Left: Project Overview */}
                                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 20 }}>
                                    <h3 style={{ fontSize: 12, fontWeight: 700, color: '#37352F', margin: '0 0 12px' }}>Project Overview</h3>
                                    {Object.entries({ Project: BRIEF.project, Address: BRIEF.address, Type: BRIEF.type, Timeline: BRIEF.timeline, Occupants: BRIEF.occupants, Style: BRIEF.style, 'Counter Height': BRIEF.counter }).map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F3F3F2', fontSize: 12 }}>
                                            <span style={{ color: '#9B9A97', fontWeight: 500 }}>{k}</span>
                                            <span style={{ color: '#37352F', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Right: Budget Breakdown */}
                                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#37352F', margin: 0 }}>Budget Breakdown</h3>
                                        <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: '#37352F' }}>{BRIEF.budget.total}</span>
                                    </div>

                                    {/* Hard Costs */}
                                    <div style={{ marginBottom: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #E9E9E7' }}>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hard Costs (Construction)</span>
                                            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: '#EF4444' }}>{BRIEF.budget.hardTotal}</span>
                                        </div>
                                        {BRIEF.budget.hard.map(item => (
                                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F3F3F2', fontSize: 11 }}>
                                                <span style={{ color: '#6B6A67' }}>{item.label}</span>
                                                <span style={{ fontFamily: mono, color: '#37352F', fontWeight: 600 }}>{item.amount}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Soft Costs */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #E9E9E7' }}>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Soft Costs (Design & FF&E)</span>
                                            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: '#3B82F6' }}>{BRIEF.budget.softTotal}</span>
                                        </div>
                                        {BRIEF.budget.soft.map(item => (
                                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F3F3F2', fontSize: 11 }}>
                                                <span style={{ color: '#6B6A67' }}>{item.label}</span>
                                                <span style={{ fontFamily: mono, color: '#37352F', fontWeight: 600 }}>{item.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Priorities + Lifestyle */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 20 }}>
                                    <h3 style={{ fontSize: 12, fontWeight: 700, color: '#37352F', margin: '0 0 12px' }}>Design Priorities</h3>
                                    {BRIEF.priorities.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, color: '#37352F' }}>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', width: 20 }}>{String(i + 1).padStart(2, '0')}</span>
                                            {p}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 20 }}>
                                    <h3 style={{ fontSize: 12, fontWeight: 700, color: '#37352F', margin: '0 0 12px' }}>Lifestyle Notes</h3>
                                    {BRIEF.lifestyle.map((l, i) => (
                                        <div key={i} style={{ padding: '6px 0', fontSize: 12, color: '#6B6A67', borderBottom: '1px solid #F3F3F2' }}>{l}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ SITE SURVEY ═══ */}
                    {active === 'survey' && (
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: '0 0 20px' }}>Site Survey</h2>
                            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                    <thead>
                                        <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                            {['Room', 'Dimensions', 'Floor Area', 'Ceiling Height'].map(h => (
                                                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SURVEY.map(r => (
                                            <tr key={r.room} style={{ borderBottom: '1px solid #F3F3F2' }}>
                                                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#37352F' }}>{r.room}</td>
                                                <td style={{ padding: '12px 14px', fontFamily: mono, color: '#6B6A67' }}>{r.dims}</td>
                                                <td style={{ padding: '12px 14px', color: '#37352F', fontWeight: 600 }}>{r.area}</td>
                                                <td style={{ padding: '12px 14px', fontFamily: mono, color: '#9B9A97' }}>{r.ceiling}</td>
                                            </tr>
                                        ))}
                                        <tr style={{ background: '#FAFAF9' }}>
                                            <td style={{ padding: '12px 14px', fontWeight: 800, color: '#37352F' }}>Total</td>
                                            <td style={{ padding: '12px 14px' }} />
                                            <td style={{ padding: '12px 14px', fontWeight: 800, color: '#37352F' }}>111.48 sqm (1,200 sqft)</td>
                                            <td style={{ padding: '12px 14px' }} />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ═══ DRAWINGS — KANBAN BOARD ═══ */}
                    {active === 'drawings' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>Drawing Board</h2>
                                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>Assign drawings to drafters, track progress by status</p>
                                </div>
                                <button style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>+ Upload Drawing</button>
                            </div>

                            {/* Kanban Columns */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'start' }}>
                                {[
                                    {
                                        col: 'Draft', color: '#9B9A97', bg: '#F7F6F3', cards: [
                                            { ref: 'DWG-006', title: 'Carpentry Details', zone: 'Whole Unit', cat: 'Detail', priority: 'medium', drafter: null, designer: 'Jessica Chen', date: '5 Mar' },
                                            { ref: 'DWG-008', title: 'Bedroom 2 Layout', zone: 'Bedroom 2', cat: 'Floor Plan', priority: 'low', drafter: null, designer: 'Jessica Chen', date: '7 Mar' },
                                            { ref: 'DWG-009', title: 'Balcony Waterproofing', zone: 'Balcony', cat: 'Detail', priority: 'medium', drafter: null, designer: 'Jessica Chen', date: '7 Mar' },
                                        ]
                                    },
                                    {
                                        col: 'In Review', color: '#F59E0B', bg: '#FFFBEB', cards: [
                                            { ref: 'DWG-002', title: 'Electrical Point Layout', zone: 'Whole Unit', cat: 'M&E', priority: 'high', drafter: 'Alex Teo', designer: 'Jessica Chen', date: '1 Mar' },
                                            { ref: 'DWG-005', title: 'Master Bath Elevation', zone: 'Master Bath', cat: 'Elevation', priority: 'high', drafter: 'Alex Teo', designer: 'Jessica Chen', date: '3 Mar' },
                                            { ref: 'DWG-007', title: 'AC Piping Route', zone: 'Whole Unit', cat: 'M&E', priority: 'medium', drafter: 'Ahmad (Freelance)', designer: 'Jessica Chen', date: '6 Mar' },
                                        ]
                                    },
                                    {
                                        col: 'Approved', color: '#22C55E', bg: '#F0FDF4', cards: [
                                            { ref: 'DWG-001', title: 'Proposed Floor Plan', zone: 'Whole Unit', cat: 'Floor Plan', priority: 'high', drafter: 'Alex Teo', designer: 'Jessica Chen', date: '28 Feb' },
                                            { ref: 'DWG-003', title: 'Kitchen Elevation A', zone: 'Kitchen', cat: 'Elevation', priority: 'high', drafter: 'Alex Teo', designer: 'Jessica Chen', date: '2 Mar' },
                                            { ref: 'DWG-004', title: 'Kitchen Layout Plan', zone: 'Kitchen', cat: 'Floor Plan', priority: 'medium', drafter: 'Alex Teo', designer: 'Jessica Chen', date: '2 Mar' },
                                        ]
                                    },
                                ].map(column => (
                                    <div key={column.col} style={{ background: column.bg, borderRadius: 10, padding: 12, minHeight: 400 }}>
                                        {/* Column Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: column.color }} />
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#37352F' }}>{column.col}</span>
                                                <span style={{ fontSize: 10, fontWeight: 600, color: '#9B9A97', background: 'rgba(0,0,0,0.05)', padding: '1px 6px', borderRadius: 10 }}>{column.cards.length}</span>
                                            </div>
                                            {column.col === 'Draft' && (
                                                <button style={{ fontSize: 16, fontWeight: 400, color: '#9B9A97', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>+</button>
                                            )}
                                        </div>

                                        {/* Cards */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {column.cards.map(card => {
                                                const catColors: Record<string, { bg: string; color: string }> = {
                                                    'Floor Plan': { bg: '#EFF6FF', color: '#2563EB' },
                                                    'Elevation': { bg: '#F5F3FF', color: '#7C3AED' },
                                                    'Detail': { bg: '#FFF7ED', color: '#C2410C' },
                                                    'M&E': { bg: '#ECFDF5', color: '#059669' },
                                                };
                                                const cat = catColors[card.cat] || { bg: '#F3F4F6', color: '#374151' };
                                                return (
                                                    <div key={card.ref} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 8, padding: 12, cursor: 'grab' }}>
                                                        {/* Top row: ref + priority */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                            <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, color: '#9B9A97' }}>{card.ref}</span>
                                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: card.priority === 'high' ? '#EF4444' : card.priority === 'medium' ? '#F59E0B' : '#D4D4D4' }} />
                                                        </div>

                                                        {/* Title */}
                                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F', marginBottom: 6 }}>{card.title}</div>

                                                        {/* Tags: zone + category */}
                                                        <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                                                            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: '#F7F6F3', color: '#9B9A97', fontWeight: 500 }}>{card.zone}</span>
                                                            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: cat.bg, color: cat.color, fontWeight: 600 }}>{card.cat}</span>
                                                        </div>

                                                        {/* Footer: drafter assignment + date */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            {card.drafter ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#37352F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 700 }}>
                                                                        {card.drafter.split(' ').map(w => w[0]).join('')}
                                                                    </div>
                                                                    <span style={{ fontSize: 9, color: '#6B6A67' }}>{card.drafter}</span>
                                                                </div>
                                                            ) : (
                                                                <button style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 3, border: '1px dashed #D4D4D4', background: 'transparent', color: '#9B9A97', cursor: 'pointer' }}>
                                                                    Assign Drafter
                                                                </button>
                                                            )}
                                                            <span style={{ fontSize: 9, color: '#D4D4D4' }}>{card.date}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ DESIGN BOARDS ═══ */}
                    {active === 'boards' && (
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: '0 0 20px' }}>Design Boards</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                                {['Living Room Concept', 'Kitchen Palette', 'Master Suite', 'Bathroom Material', 'Kid Room Theme'].map((board, i) => (
                                    <div key={board} style={{
                                        background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                                    }}>
                                        <div style={{ height: 140, background: `linear-gradient(135deg, hsl(${i * 40 + 20}, 30%, 85%), hsl(${i * 40 + 60}, 25%, 75%))` }} />
                                        <div style={{ padding: '12px 16px' }}>
                                            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: 0 }}>{board}</h3>
                                            <p style={{ fontSize: 10, color: '#9B9A97', margin: '4px 0 0' }}>{3 + i} materials selected</p>
                                        </div>
                                    </div>
                                ))}
                                <div style={{
                                    border: '2px dashed #E9E9E7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#9B9A97', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 180,
                                }}>+ New Board</div>
                            </div>
                        </div>
                    )}
                    {/* ═══ SKETCHUP ═══ */}
                    {active === 'sketchup' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>SketchUp Integration</h2>
                                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>Upload .skp files, auto-extract BOQ, map materials</p>
                                </div>
                            </div>

                            {/* Upload Zone */}
                            <div style={{
                                border: '2px dashed #E9E9E7', borderRadius: 10, padding: 40, textAlign: 'center',
                                marginBottom: 24, cursor: 'pointer', background: '#FAFAF9',
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>&#8593;</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#37352F', marginBottom: 4 }}>Drop .skp file here</div>
                                <div style={{ fontSize: 11, color: '#9B9A97' }}>or click to browse. Max 50MB.</div>
                            </div>

                            {/* Demo: Extracted BOQ */}
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#37352F', margin: '0 0 12px' }}>Extracted BOQ</h3>
                                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #E9E9E7', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                        <thead>
                                            <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                                {['Item', 'Category', 'Dims', 'Qty', 'Unit Price', 'Total'].map(h => (
                                                    <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Item' || h === 'Category' || h === 'Dims' ? 'left' : 'right', fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { item: 'Kitchen Cabinet (Upper)', cat: 'Carpentry', dims: '3200×600×900mm', qty: 1, price: 4200 },
                                                { item: 'Kitchen Cabinet (Lower)', cat: 'Carpentry', dims: '3200×600×850mm', qty: 1, price: 5800 },
                                                { item: 'Wardrobe (Master BR)', cat: 'Carpentry', dims: '2400×600×2400mm', qty: 1, price: 3600 },
                                                { item: 'TV Console + Feature Wall', cat: 'Carpentry', dims: '3000×400×2100mm', qty: 1, price: 4500 },
                                                { item: 'Floor Tiles (Living)', cat: 'Tiling', dims: '600×600 Porcelain', qty: 42, price: 18 },
                                                { item: 'Whole Unit Painting', cat: 'Painting', dims: '3-coat', qty: 1, price: 2200 },
                                            ].map(r => (
                                                <tr key={r.item} style={{ borderBottom: '1px solid #F3F3F2' }}>
                                                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#37352F' }}>{r.item}</td>
                                                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: '#F7F6F3', color: '#6B6A67' }}>{r.cat}</span></td>
                                                    <td style={{ padding: '10px 12px', fontFamily: mono, fontSize: 11, color: '#9B9A97' }}>{r.dims}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#37352F' }}>{r.qty}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: mono, color: '#6B6A67' }}>${r.price.toLocaleString()}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: mono, fontWeight: 700, color: '#37352F' }}>${(r.qty * r.price).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Model Versions */}
                            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#37352F', margin: '0 0 12px' }}>Model Versions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {[
                                    { v: 'V3', date: '7 Mar 2026', label: 'Final — client approved', size: '24.6 MB', status: 'approved' },
                                    { v: 'V2', date: '3 Mar 2026', label: 'Revised layout', size: '22.1 MB', status: 'superseded' },
                                    { v: 'V1', date: '28 Feb 2026', label: 'Initial concept', size: '18.4 MB', status: 'superseded' },
                                ].map(ver => (
                                    <div key={ver.v} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: '#37352F' }}>{ver.v}</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{ver.label}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: 10, color: '#9B9A97' }}>{ver.size}</span>
                                            <span style={{ fontSize: 10, color: '#9B9A97' }}>{ver.date}</span>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 10,
                                                background: ver.status === 'approved' ? '#F0FDF4' : '#F7F6F3',
                                                color: ver.status === 'approved' ? '#22C55E' : '#9B9A97',
                                            }}>{ver.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ CLIENT DECK ═══ */}
                    {active === 'client-deck' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>Client Deck</h2>
                                    <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>Material presentation for client sign-off</p>
                                </div>
                                <button style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                    Generate PDF
                                </button>
                            </div>

                            {/* Project Header Card */}
                            <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, padding: 24, marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Prepared For</div>
                                        <div style={{ fontSize: 18, fontWeight: 700, color: '#37352F' }}>Mr & Mrs Lim</div>
                                        <div style={{ fontSize: 12, color: '#6B6A67', marginTop: 2 }}>Holland V Condo · HVC-2024-012</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Presented By</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#37352F' }}>Arc Studios</div>
                                        <div style={{ fontSize: 11, color: '#9B9A97' }}>8 March 2026</div>
                                    </div>
                                </div>
                            </div>

                            {/* Room-by-Room Selections */}
                            {[
                                {
                                    room: 'Living Room', items: [
                                        { name: 'Floor — Spanish Porcelain 600×600', spec: 'Hafary · Grey Limestone', price: '$8.50/pc', status: 'approved' },
                                        { name: 'Feature Wall — Wood Veneer Panels', spec: 'Decowood · American Walnut', price: '$28/sqft', status: 'approved' },
                                        { name: 'Lighting — Flos IC Ceiling', spec: 'Flos · Chrome 200mm', price: '$680/pc', status: 'pending' },
                                        { name: 'Sofa — Ligne Roset Togo', spec: '3-seater · Alcantara Charcoal', price: '$8,200', status: 'approved' },
                                    ]
                                },
                                {
                                    room: 'Kitchen', items: [
                                        { name: 'Countertop — Caesarstone Quartz', spec: 'Qi Quartz · Calacatta Nuvo', price: '$28/sqft', status: 'approved' },
                                        { name: 'Backsplash — Subway Tile 75×150', spec: 'Hafary · Gloss White', price: '$4.20/pc', status: 'approved' },
                                        { name: 'Cabinet Hardware — Blum Tandembox', spec: 'Hafele · Soft-close 500mm', price: '$45/set', status: 'approved' },
                                        { name: 'Tap — Hansgrohe Talis M54', spec: 'Pull-out spray · Matte Black', price: '$380', status: 'pending' },
                                    ]
                                },
                                {
                                    room: 'Master Bedroom', items: [
                                        { name: 'Wardrobe — Full-height built-in', spec: 'Marine Plywood + Egger Laminate', price: '$3,600', status: 'approved' },
                                        { name: 'Bedside Pendant — Tom Dixon Beat', spec: 'Brass · Wide', price: '$520/pc', status: 'pending' },
                                        { name: 'Flooring — SPC Vinyl Plank', spec: 'Inovar · Warm Oak 1220×180mm', price: '$6.80/sqft', status: 'approved' },
                                    ]
                                },
                                {
                                    room: 'Bathrooms', items: [
                                        { name: 'Floor — Anti-slip Ceramic 300×300', spec: 'Hafary · Stone Grey R10', price: '$5.50/pc', status: 'approved' },
                                        { name: 'WC — Duravit ME by Starck', spec: 'Wall-hung · Rimless', price: '$650', status: 'approved' },
                                        { name: 'Rain Shower — Grohe Tempesta', spec: '250mm · Chrome', price: '$420/set', status: 'approved' },
                                    ]
                                },
                            ].map(room => (
                                <div key={room.room} style={{ marginBottom: 16 }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #F3F3F2' }}>
                                        {room.room}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {room.items.map(item => (
                                            <div key={item.name} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#37352F' }}>{item.name}</div>
                                                    <div style={{ fontSize: 11, color: '#9B9A97', marginTop: 2 }}>{item.spec}</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: '#37352F' }}>{item.price}</span>
                                                    <span style={{
                                                        fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 10,
                                                        background: item.status === 'approved' ? '#F0FDF4' : '#FEF9C3',
                                                        color: item.status === 'approved' ? '#22C55E' : '#F59E0B',
                                                    }}>{item.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Approval Footer */}
                            <div style={{ background: '#FAFAF9', border: '1px solid #E9E9E7', borderRadius: 10, padding: 20, textAlign: 'center', marginTop: 8 }}>
                                <div style={{ fontSize: 11, color: '#9B9A97', marginBottom: 8 }}>14 of 16 items approved</div>
                                <div style={{ height: 4, background: '#F5F5F4', borderRadius: 2, overflow: 'hidden', maxWidth: 300, margin: '0 auto 12px' }}>
                                    <div style={{ height: '100%', width: '87.5%', background: '#22C55E', borderRadius: 2 }} />
                                </div>
                                <button style={{ padding: '10px 24px', fontSize: 12, fontWeight: 700, background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                    Send to Client for Sign-off
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ═══ TRADESMAN PACK ═══ */}
                    {active === 'tradesman-pack' && (() => {
                        // Translation dictionary for tradesman-facing labels
                        const translations: Record<string, Record<string, string>> = {
                            en: {
                                title: 'Tradesman Pack', subtitle: 'Contractor-facing spec sheets per trade',
                                printAll: 'Print All Packs', item: 'Item', dimensions: 'Dimensions',
                                materialSpec: 'Material / Spec', qty: 'Qty', notes: 'Notes',
                                contact: 'Contact', trade: 'Trade',
                            },
                            zh: {
                                title: '工匠资料包', subtitle: '按工种划分的施工规格表',
                                printAll: '打印所有资料包', item: '项目', dimensions: '尺寸',
                                materialSpec: '材料 / 规格', qty: '数量', notes: '备注',
                                contact: '联系方式', trade: '工种',
                            },
                            ms: {
                                title: 'Pek Tukang', subtitle: 'Helaian spesifikasi mengikut tred',
                                printAll: 'Cetak Semua', item: 'Item', dimensions: 'Dimensi',
                                materialSpec: 'Bahan / Spesifikasi', qty: 'Kuantiti', notes: 'Nota',
                                contact: 'Hubungi', trade: 'Tred',
                            },
                            ta: {
                                title: 'தொழிலாளர் தொகுப்பு', subtitle: 'ஒவ்வொரு தொழிலுக்கான விவரக்குறிப்பு',
                                printAll: 'அனைத்தையும் அச்சிடு', item: 'பொருள்', dimensions: 'அளவுகள்',
                                materialSpec: 'பொருள் / விவரம்', qty: 'எண்ணிக்கை', notes: 'குறிப்புகள்',
                                contact: 'தொடர்பு', trade: 'தொழில்',
                            },
                            vi: {
                                title: 'Gói Thợ', subtitle: 'Bảng thông số kỹ thuật theo nghề',
                                printAll: 'In Tất Cả', item: 'Hạng mục', dimensions: 'Kích thước',
                                materialSpec: 'Vật liệu / Quy cách', qty: 'SL', notes: 'Ghi chú',
                                contact: 'Liên hệ', trade: 'Nghề',
                            },
                            my: {
                                title: 'လက်သမားအထုပ်', subtitle: 'အလုပ်အကိုင်အလိုက် စာရွက်စာတမ်း',
                                printAll: 'အားလုံးပုံနှိပ်ရန်', item: 'အမျိုးအစား', dimensions: 'အတိုင်းအတာ',
                                materialSpec: 'ပစ္စည်း / အသေးစိတ်', qty: 'အရေအတွက်', notes: 'မှတ်ချက်',
                                contact: 'ဆက်သွယ်ရန်', trade: 'အလုပ်',
                            },
                            bn: {
                                title: 'কারিগর প্যাক', subtitle: 'ট্রেড অনুযায়ী স্পেসিফিকেশন শীট',
                                printAll: 'সব প্রিন্ট করুন', item: 'আইটেম', dimensions: 'মাত্রা',
                                materialSpec: 'উপাদান / স্পেক', qty: 'পরিমাণ', notes: 'নোট',
                                contact: 'যোগাযোগ', trade: 'ট্রেড',
                            },
                        };
                        const langOptions = [
                            { code: 'en', label: 'English', flag: '🇬🇧' },
                            { code: 'zh', label: '中文', flag: '🇨🇳' },
                            { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
                            { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
                            { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
                            { code: 'my', label: 'မြန်မာ', flag: '🇲🇲' },
                            { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
                        ];
                        const t = translations[tradesmanLang] || translations.en;

                        return (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <div>
                                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: 0 }}>{t.title}</h2>
                                        <p style={{ fontSize: 12, color: '#9B9A97', margin: '4px 0 0' }}>{t.subtitle}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {/* Language Switcher */}
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                value={tradesmanLang}
                                                onChange={e => setTradesmanLang(e.target.value)}
                                                style={{
                                                    appearance: 'none', padding: '6px 28px 6px 10px', fontSize: 12,
                                                    fontWeight: 600, border: '1px solid #E9E9E7', borderRadius: 6,
                                                    background: '#fff', cursor: 'pointer', fontFamily: f, color: '#37352F',
                                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M3 5l3 3 3-3\' fill=\'none\' stroke=\'%239B9A97\' stroke-width=\'1.5\'/%3E%3C/svg%3E")',
                                                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
                                                }}
                                            >
                                                {langOptions.map(l => (
                                                    <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, background: '#37352F', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                            {t.printAll}
                                        </button>
                                    </div>
                                </div>

                                {/* Language Notice */}
                                {tradesmanLang !== 'en' && (
                                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '8px 14px', marginBottom: 16, fontSize: 11, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span>🌐</span>
                                        <span>Labels translated to <strong>{langOptions.find(l => l.code === tradesmanLang)?.label}</strong>. Technical specs (dimensions, material codes) remain in English for accuracy.</span>
                                    </div>
                                )}

                                {/* Trade-by-Trade Spec Sheets */}
                                {[
                                    {
                                        trade: 'Carpentry', vendor: 'Hock Seng Carpentry', contact: '+65 9123 4567', items: [
                                            { item: 'Kitchen Upper Cabinet', dims: '3200 × 600 × 900mm', material: 'Marine Plywood 18mm + Egger Laminate H3309', qty: '1 lot', notes: 'Blum hinges, soft-close. Include 40mm lighting pelmet.' },
                                            { item: 'Kitchen Lower Cabinet', dims: '3200 × 600 × 850mm', material: 'Marine Plywood 18mm + Quartz Top 20mm', qty: '1 lot', notes: 'Blum Tandembox drawers ×4. Cutout for sink 840×480mm.' },
                                            { item: 'Master Wardrobe', dims: '2400 × 600 × 2400mm', material: 'Marine Plywood 18mm + Veneer (American Walnut)', qty: '1 lot', notes: 'Full-height. Include LED strip channel top of hanging rail.' },
                                            { item: 'TV Console + Feature Wall', dims: '3000 × 400 × 2100mm', material: 'Marine Plywood 18mm + Laminate', qty: '1 lot', notes: 'Concealed wiring channels for TV mount. 3× power points behind.' },
                                            { item: 'Shoe Cabinet', dims: '1200 × 350 × 1000mm', material: 'Marine Plywood 18mm + Laminate', qty: '1 lot', notes: 'Ventilation holes. 5 adjustable shelves.' },
                                        ]
                                    },
                                    {
                                        trade: 'Tiling', vendor: 'Ah Heng Tiling Works', contact: '+65 8765 4321', items: [
                                            { item: 'Living/Dining Floor', dims: '600×600 Porcelain', material: 'Hafary Spanish Porcelain (Grey Limestone)', qty: '42 sqm', notes: 'R10 slip rating. Grout: Mapei Keracolor FF (Grey). Align grout lines at wall junction.' },
                                            { item: 'Kitchen Floor + Wall', dims: '300×600 Ceramic', material: 'Hafary Ceramic (White Matte)', qty: '28 sqm', notes: 'Half-bond pattern. Separate grout color for floor (dark grey) vs wall (white).' },
                                            { item: 'Bathrooms ×2', dims: '300×300 Anti-slip', material: 'Hafary Anti-slip Ceramic (Stone Grey)', qty: '18 sqm', notes: 'R10+ required. Floor trap alignment per drawing DWG-005. Waterproofing: Mapei Mapelastic.' },
                                        ]
                                    },
                                    {
                                        trade: 'Electrical', vendor: 'KH Electrical Services', contact: '+65 9876 5432', items: [
                                            { item: 'Additional Power Points', dims: '13A Switched (Schneider AvatarOn)', material: 'Schneider AvatarOn White', qty: '12 pts', notes: 'Positions per DWG-002. Kitchen: 6 pts above counter at 1100mm.' },
                                            { item: 'Lighting Points', dims: 'LED Downlight Recessed', material: 'Philips LED 9W 3000K', qty: '18 pts', notes: '2700K in bedrooms. 3000K in living/kitchen/bath. Dimmer switch for living room.' },
                                            { item: 'Feature Wall Wiring', dims: 'Concealed conduit', material: 'PVC conduit + HDMI/Power', qty: '1 lot', notes: 'TV mount point: 1200mm from floor. 3× 13A points + 1× HDMI behind TV.' },
                                        ]
                                    },
                                    {
                                        trade: 'Painting', vendor: 'ColorPro Painting', contact: '+65 8234 5678', items: [
                                            { item: 'Whole Unit Painting', dims: '3-coat system', material: 'Nippon Odourless All-in-1 (White)', qty: '1 lot', notes: '1 coat primer + 2 coats topcoat. Ceiling: Nippon Spotless White. Feature wall: Dulux Ambiance Linen White.' },
                                        ]
                                    },
                                ].map(trade => (
                                    <div key={trade.trade} style={{ marginBottom: 20 }}>
                                        <div style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, overflow: 'hidden' }}>
                                            {/* Trade Header */}
                                            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#37352F' }}>{trade.trade}</span>
                                                    <span style={{ fontSize: 11, color: '#9B9A97', marginLeft: 12 }}>{trade.vendor}</span>
                                                </div>
                                                <span style={{ fontFamily: mono, fontSize: 10, color: '#9B9A97' }}>{t.contact}: {trade.contact}</span>
                                            </div>

                                            {/* Items Table */}
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                                <thead>
                                                    <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #E9E9E7' }}>
                                                        {[t.item, t.dimensions, t.materialSpec, t.qty, t.notes].map(h => (
                                                            <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 8, fontWeight: 700, color: '#9B9A97', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {trade.items.map(item => (
                                                        <tr key={item.item} style={{ borderBottom: '1px solid #F3F3F2' }}>
                                                            <td style={{ padding: '10px 14px', fontWeight: 600, color: '#37352F' }}>{item.item}</td>
                                                            <td style={{ padding: '10px 14px', fontFamily: mono, fontSize: 10, color: '#6B6A67' }}>{item.dims}</td>
                                                            <td style={{ padding: '10px 14px', color: '#6B6A67', maxWidth: 200 }}>{item.material}</td>
                                                            <td style={{ padding: '10px 14px', fontWeight: 600, color: '#37352F', whiteSpace: 'nowrap' }}>{item.qty}</td>
                                                            <td style={{ padding: '10px 14px', fontSize: 10, color: '#9B9A97', maxWidth: 220 }}>{item.notes}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    {/* ═══ ISSUE TRACKER ═══ */}
                    {active === 'issues' && (
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: '0 0 20px' }}>Issue Tracker</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {ISSUES.map(iss => (
                                    <div key={iss.id} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: '#9B9A97' }}>{iss.id}</span>
                                            <span style={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                background: iss.severity === 'high' ? '#EF4444' : iss.severity === 'medium' ? '#F59E0B' : '#9B9A97',
                                            }} />
                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#37352F' }}>{iss.title}</span>
                                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: '#F7F6F3', color: '#9B9A97' }}>{iss.zone}</span>
                                        </div>
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 10,
                                            background: iss.status === 'open' ? '#FEF2F2' : '#F0FDF4',
                                            color: iss.status === 'open' ? '#EF4444' : '#22C55E',
                                        }}>{iss.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ SITE CHECKLISTS ═══ */}
                    {active === 'checklists' && (
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#37352F', margin: '0 0 20px' }}>Site Checklists</h2>
                            {[
                                {
                                    name: 'Pre-Renovation', milestones: [
                                        { task: 'HDB renovation permit submitted', done: true },
                                        { task: 'Neighbour notification (3 days)', done: true },
                                        { task: 'Key collection from management', done: true },
                                        { task: 'Site protection (floors, doors)', done: true },
                                        { task: 'Temporary power setup', done: true },
                                        { task: 'Waste disposal chute booking', done: true },
                                        { task: 'Photo documentation (before)', done: true },
                                        { task: 'Material staging area set up', done: true },
                                    ]
                                },
                                {
                                    name: 'Hacking & Demolition', milestones: [
                                        { task: 'Existing tiles removed (living/kitchen)', done: true },
                                        { task: 'Existing cabinets removed', done: true },
                                        { task: 'Bathroom fixtures removed ×2', done: true },
                                        { task: 'Wall hacking for open-concept', done: true },
                                        { task: 'Debris disposal completed', done: true },
                                        { task: 'Post-hack inspection passed', done: true },
                                    ]
                                },
                                {
                                    name: 'Electrical First Fix', milestones: [
                                        { task: 'DB board relocated per plan', done: true },
                                        { task: 'Living room points wired (6 pts)', done: true },
                                        { task: 'Kitchen points wired (8 pts)', done: true },
                                        { task: 'Master bedroom points (4 pts)', done: true },
                                        { task: 'Bedroom 2 points (3 pts)', done: false },
                                        { task: 'Bathroom fan + heater wiring ×2', done: false },
                                        { task: 'Feature wall conduit for TV mount', done: true },
                                        { task: 'Lighting circuit test — passed', done: true },
                                        { task: 'Power circuit test — passed', done: true },
                                        { task: 'Cover plates installed', done: false },
                                    ]
                                },
                                {
                                    name: 'Plumbing First Fix', milestones: [
                                        { task: 'Hot/cold water lines re-routed', done: true },
                                        { task: 'Kitchen sink point relocated', done: true },
                                        { task: 'Master bath shower mixer installed', done: true },
                                        { task: 'Common bath shower mixer installed', done: true },
                                        { task: 'Pressure test — 24hr hold', done: false },
                                        { task: 'Floor trap positions confirmed', done: false },
                                        { task: 'Leak check sign-off', done: false },
                                        { task: 'Water heater point confirmed', done: false },
                                    ]
                                },
                                {
                                    name: 'Tiling Sign-off', milestones: [
                                        { task: 'Living room floor tiles laid', done: false },
                                        { task: 'Kitchen floor + wall tiles laid', done: false },
                                        { task: 'Master bath floor + wall tiles', done: false },
                                        { task: 'Common bath floor + wall tiles', done: false },
                                        { task: 'Grout lines inspection', done: false },
                                        { task: 'Tile alignment check', done: false },
                                        { task: 'Waterproofing test (48hr flood)', done: false },
                                        { task: 'Epoxy grouting (wet zones)', done: false },
                                        { task: 'Cut tile edges inspection', done: false },
                                        { task: 'Balcony tiles + slope check', done: false },
                                        { task: 'Threshold strip installed', done: false },
                                        { task: 'Final clean + seal', done: false },
                                    ]
                                },
                                {
                                    name: 'Carpentry Final', milestones: [
                                        { task: 'Kitchen upper cabinet installed', done: false },
                                        { task: 'Kitchen lower cabinet installed', done: false },
                                        { task: 'Quartz countertop templated & cut', done: false },
                                        { task: 'Master wardrobe installed', done: false },
                                        { task: 'TV console + feature wall installed', done: false },
                                        { task: 'Shoe cabinet installed', done: false },
                                        { task: 'Door alignment & hardware check', done: false },
                                        { task: 'Soft-close mechanisms tested', done: false },
                                        { task: 'Edge banding inspection', done: false },
                                        { task: 'Final carpentry defect list', done: false },
                                        { task: 'Client walkthrough — carpentry', done: false },
                                        { task: 'Touch-up & handover', done: false },
                                        { task: 'Handles & pulls installed', done: false },
                                        { task: 'LED strip lighting tested', done: false },
                                        { task: 'Ventilation grilles installed', done: false },
                                    ]
                                },
                            ].map(checklist => {
                                const done = checklist.milestones.filter(m => m.done).length;
                                const total = checklist.milestones.length;
                                const pct = Math.round((done / total) * 100);
                                return (
                                    <div key={checklist.name} style={{ background: '#fff', border: '1px solid #E9E9E7', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
                                        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F3F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#37352F', margin: 0 }}>{checklist.name}</h3>
                                                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: pct === 100 ? '#22C55E' : pct > 0 ? '#3B82F6' : '#9B9A97' }}>{done}/{total}</span>
                                            </div>
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 10,
                                                background: pct === 100 ? '#F0FDF4' : pct > 0 ? '#EFF6FF' : '#F7F6F3',
                                                color: pct === 100 ? '#22C55E' : pct > 0 ? '#3B82F6' : '#9B9A97',
                                            }}>{pct === 100 ? 'Complete' : pct > 0 ? 'In Progress' : 'Not Started'}</span>
                                        </div>
                                        <div style={{ padding: '8px 20px 12px' }}>
                                            {checklist.milestones.map((m, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: i < checklist.milestones.length - 1 ? '1px solid #FAFAF9' : 'none' }}>
                                                    <div style={{
                                                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                                                        border: m.done ? 'none' : '1.5px solid #D4D3D0',
                                                        background: m.done ? '#22C55E' : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        {m.done && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                                                    </div>
                                                    <span style={{ fontSize: 11, color: m.done ? '#9B9A97' : '#37352F', textDecoration: m.done ? 'line-through' : 'none' }}>{m.task}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
