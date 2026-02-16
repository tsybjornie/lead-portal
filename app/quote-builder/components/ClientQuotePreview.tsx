'use client';

import { useState } from 'react';
import { TRADE_PROFILES, TradeCategory } from '@/types/trades';

// ============================================================
// TYPES (matches QuoteBuilderEnhanced)
// ============================================================

type MeasurementUnit =
    | 'sqft' | 'sqm'
    | 'lm' | 'm' | 'mm'
    | 'cu.m'
    | 'pcs' | 'set' | 'lot' | 'nos' | 'unit' | 'pair' | 'panel' | 'leaf'
    | 'kg' | 'ton'
    | 'roll' | 'sheet' | 'bag' | 'litre'
    | 'day' | 'hr' | 'trip'
    | 'ls';

interface Dimensions {
    lengthFt?: number;
    widthFt?: number;
    heightFt?: number;
    area?: number;
    quantity?: number;
    unit: MeasurementUnit;
}

interface LineItem {
    id: string;
    description: string;
    dimensions: Dimensions;
    unitRate: number;
    costPrice: number;
    margin: number;
    sellingPrice: number;
    isStaircase?: boolean;
    productivityMultiplier: number;
}

interface TradeSection {
    id: string;
    category: TradeCategory;
    displayName: string;
    items: LineItem[];
    subtotalCost: number;
    subtotalSelling: number;
    overallMargin: number;
    isExpanded: boolean;
}

// ============================================================
// FONT PRESETS
// ============================================================

interface FontPreset {
    id: string;
    label: string;
    heading: string;
    body: string;
    style: string;      // CSS class additions
    description: string;
}

const FONT_PRESETS: FontPreset[] = [
    {
        id: 'gentle',
        label: 'Gentle Monster',
        heading: "'Space Grotesk', sans-serif",
        body: "'Inter', sans-serif",
        style: 'tracking-wider uppercase',
        description: 'Ultra-clean geometric, art-gallery minimal',
    },
    {
        id: 'architectural',
        label: 'Architectural',
        heading: "'Outfit', sans-serif",
        body: "'DM Sans', sans-serif",
        style: 'tracking-wide',
        description: 'Modern, precise, studio-grade',
    },
    {
        id: 'editorial',
        label: 'Editorial',
        heading: "'Playfair Display', serif",
        body: "'Source Sans 3', sans-serif",
        style: 'tracking-normal',
        description: 'Refined serif headers, elegant contrast',
    },
    {
        id: 'swiss',
        label: 'Swiss Minimal',
        heading: "'Syne', sans-serif",
        body: "'Inter', sans-serif",
        style: 'tracking-widest uppercase',
        description: 'Bold grotesque, Bauhaus-inspired',
    },
    {
        id: 'mono',
        label: 'Technical',
        heading: "'JetBrains Mono', monospace",
        body: "'IBM Plex Sans', sans-serif",
        style: 'tracking-tight',
        description: 'Engineering-precise, blueprint feel',
    },
    {
        id: 'luxury',
        label: 'Luxury Serif',
        heading: "'Cormorant Garamond', serif",
        body: "'Lato', sans-serif",
        style: 'tracking-wide',
        description: 'High-fashion serif, boutique elegance',
    },
    {
        id: 'japanese',
        label: 'Japanese Minimal',
        heading: "'Zen Kaku Gothic New', sans-serif",
        body: "'Noto Sans', sans-serif",
        style: 'tracking-widest uppercase',
        description: 'Clean shibui aesthetic, quiet refinement',
    },
    {
        id: 'warm',
        label: 'Warm Humanist',
        heading: "'Nunito', sans-serif",
        body: "'Open Sans', sans-serif",
        style: 'tracking-normal',
        description: 'Friendly, approachable, rounded forms',
    },
    {
        id: 'deco',
        label: 'Art Deco',
        heading: "'Poiret One', cursive",
        body: "'Raleway', sans-serif",
        style: 'tracking-widest uppercase',
        description: 'Gatsby-era glamour, geometric elegance',
    },
    {
        id: 'brutalist',
        label: 'Neo Brutalist',
        heading: "'Bebas Neue', sans-serif",
        body: "'Roboto', sans-serif",
        style: 'tracking-wider uppercase',
        description: 'Bold, loud, unapologetic impact',
    },
    {
        id: 'scandinavian',
        label: 'Scandinavian',
        heading: "'Poppins', sans-serif",
        body: "'Work Sans', sans-serif",
        style: 'tracking-wide',
        description: 'Nordic clean, hygge comfort, balanced',
    },
    {
        id: 'classic',
        label: 'Classic Traditional',
        heading: "'Merriweather', serif",
        body: "'Source Serif 4', serif",
        style: 'tracking-normal',
        description: 'Timeless elegance, full-serif warmth',
    },
    {
        id: 'magazine',
        label: 'Magazine',
        heading: "'Fraunces', serif",
        body: "'Commissioner', sans-serif",
        style: 'tracking-tight',
        description: 'Bold editorial, modern publication feel',
    },
    {
        id: 'corporate',
        label: 'Corporate Clean',
        heading: "'Plus Jakarta Sans', sans-serif",
        body: "'Figtree', sans-serif",
        style: 'tracking-normal',
        description: 'Professional, contemporary, boardroom-ready',
    },
    {
        id: 'handcrafted',
        label: 'Handcrafted',
        heading: "'Josefin Sans', sans-serif",
        body: "'Karla', sans-serif",
        style: 'tracking-wider uppercase',
        description: 'Artisan touch, bespoke studio character',
    },
];

// ============================================================
// GLOSSARY
// ============================================================

const GLOSSARY: { term: string; definition: string }[] = [
    { term: 'Hacking', definition: 'Controlled demolition of existing tiles, walls, or floor finishes. Creates debris that requires disposal.' },
    { term: 'Screeding', definition: 'Applying a cement-sand layer to level the floor surface before tiling. Typically 20-30mm thick.' },
    { term: 'Waterproofing', definition: 'Liquid membrane coating applied to bathroom/wet area floors and walls to prevent water seepage to lower floors.' },
    { term: 'Carcass', definition: 'The structural body of a cabinet, made from plywood or particle board. Doors and drawers are separate.' },
    { term: 'Laminate', definition: 'Decorative surface finish for cabinets. Comes in various textures and colours. Not the same as natural wood veneer.' },
    { term: 'Quartz countertop', definition: 'Engineered stone slab made from crushed quartz + resin. Non-porous, low-maintenance. Priced by linear metre.' },
    { term: 'Soft-close hinges', definition: 'Cabinet door hinges with a built-in damper that prevents slamming. Carpenter-supplied by default — brand is not selectable.' },
    { term: 'Overlay tiling', definition: 'Installing new tiles directly over existing tiles without hacking. Saves labour but adds floor height (~10mm).' },
    { term: 'Trunking', definition: 'Casing that conceals air-con piping. Can be built into false ceiling or run along walls as boxed-up conduit.' },
    { term: 'BTO', definition: 'Build-To-Order. New HDB flats sold by the government before construction. Raw units require full renovation.' },
    { term: 'Variation Order (VO)', definition: 'Any work that deviates from the original quotation scope. Must be approved in writing before proceeding.' },
    { term: 'Defect liability period', definition: 'Post-handover window (typically 1 year) during which the contractor is obligated to fix defects at no additional cost.' },
    { term: 'False ceiling', definition: 'A secondary ceiling hung below the actual slab. Used to conceal wiring, piping, and air-con trunking. Usually gypsum board.' },
    { term: 'Power point', definition: 'An electrical outlet/socket. Counted as individual points in the quotation for pricing purposes.' },
    { term: 'Powder coating', definition: 'Electrostatic paint finish applied to metal surfaces. More durable than liquid paint. Common for grilles and gates.' },
    { term: 'LEW', definition: 'Licensed Electrical Worker. Must be engaged for any DB box upgrade, full rewiring, or capacity increase. Required by EMA/SP Group.' },
    { term: 'SLD', definition: 'Single Line Diagram. Electrical schematic of the entire unit, submitted to SP Group by a LEW for approval before major electrical work.' },
    { term: 'HPL', definition: 'High Pressure Laminate. Durable decorative surface (e.g. Formica, Lamitak) pressed onto cabinet doors. Industry standard for quality finishes.' },
    { term: 'Melamine (LPL)', definition: 'Low Pressure Laminate. Thin decorative paper fused directly onto particle board. Budget option — not the same as HPL.' },
    { term: 'Edge banding', definition: 'Thin strip (PVC, ABS, or laser-bonded) applied to exposed plywood/MDF edges to seal and finish them. Quality varies widely.' },
    { term: 'Fire-rated door (FRD)', definition: 'SCDF-mandated 1-hour fire-rated main door for HDB units. Must be self-closing. Replaced for aesthetic reasons but must meet specs.' },
];

// ============================================================
// HELPERS
// ============================================================

function parseDescription(desc: string): { title: string; details: string; material?: string } {
    const parts = desc.split(' — ');
    const title = parts[0] || desc;
    const body = parts.slice(1).join(' — ');
    const materialMatch = body.match(/Material:\s*([^.]+)\./);
    const material = materialMatch ? materialMatch[1].trim() : undefined;
    return { title, details: body, material };
}

function getQuantity(dims: Dimensions): number {
    if (dims.quantity && dims.quantity > 0) return dims.quantity;
    if (dims.lengthFt && dims.widthFt) return dims.lengthFt * dims.widthFt;
    if (dims.area && dims.area > 0) return dims.area;
    return 0;
}

const unitLabels: Record<MeasurementUnit, string> = {
    sqft: 'sq ft', sqm: 'sq m',
    lm: 'lin. m', m: 'm', mm: 'mm',
    'cu.m': 'cu m',
    pcs: 'pcs', nos: 'nos', unit: 'unit', set: 'set', pair: 'pair', lot: 'lot', panel: 'panel', leaf: 'leaf',
    kg: 'kg', ton: 'ton',
    roll: 'roll', sheet: 'sheet', bag: 'bag', litre: 'litre',
    day: 'day', hr: 'hr', trip: 'trip',
    ls: 'lump sum',
};

const formatPrice = (amount: number): string =>
    `S$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ============================================================
// COMPONENT
// ============================================================

interface ClientQuotePreviewProps {
    sections: TradeSection[];
    projectName?: string;
    clientName?: string;
    quoteNumber?: string;
    companyName?: string;
    companyTagline?: string;
    companyAddress?: string;
    companyEmail?: string;
}

export default function ClientQuotePreview({
    sections,
    projectName = '4-Room HDB Renovation',
    clientName = 'Homeowner',
    quoteNumber,
    companyName = 'VINTERIOR STUDIO',
    companyTagline = 'Spaces designed for the way you live.',
    companyAddress = '123 Design Street #01-01\nSingapore 123456',
    companyEmail = 'hello@arcstudio.sg',
}: ClientQuotePreviewProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [selectedFont, setSelectedFont] = useState<FontPreset>(FONT_PRESETS[0]);
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [currentPage, setCurrentPage] = useState<'cover' | 'glossary' | 'quote'>('cover');

    const toggleSection = (id: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const expandAll = () => setExpandedSections(new Set(sections.map(s => s.id)));
    const collapseAll = () => setExpandedSections(new Set());

    const grandTotal = sections.reduce((sum, s) => sum + s.subtotalSelling, 0);
    const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
    const qNum = quoteNumber || `VS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;

    // Google Fonts link — loads all 15 preset families
    const fontFamilies = [
        'Space+Grotesk:wght@400;500;600;700',
        'Inter:wght@400;500;600;700',
        'Outfit:wght@400;500;600;700',
        'DM+Sans:wght@400;500;700',
        'Playfair+Display:wght@400;600;700',
        'Source+Sans+3:wght@400;500;600',
        'Syne:wght@400;600;700;800',
        'JetBrains+Mono:wght@400;500;600',
        'IBM+Plex+Sans:wght@400;500;600',
        'Cormorant+Garamond:wght@400;500;600;700',
        'Lato:wght@400;700',
        'Zen+Kaku+Gothic+New:wght@400;500;700',
        'Noto+Sans:wght@400;500;600;700',
        'Nunito:wght@400;600;700',
        'Open+Sans:wght@400;500;600;700',
        'Poiret+One',
        'Raleway:wght@400;500;600;700',
        'Bebas+Neue',
        'Roboto:wght@400;500;700',
        'Poppins:wght@400;500;600;700',
        'Work+Sans:wght@400;500;600;700',
        'Merriweather:wght@400;700',
        'Source+Serif+4:wght@400;500;600;700',
        'Fraunces:wght@400;500;600;700',
        'Commissioner:wght@400;500;600;700',
        'Plus+Jakarta+Sans:wght@400;500;600;700',
        'Figtree:wght@400;500;600;700',
        'Josefin+Sans:wght@400;500;600;700',
        'Karla:wght@400;500;700',
    ];
    const fontLink = `https://fonts.googleapis.com/css2?${fontFamilies.map(f => `family=${f}`).join('&')}&display=swap`;

    return (
        <>
            {/* Load Google Fonts */}
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link rel="stylesheet" href={fontLink} />

            <div style={{ fontFamily: selectedFont.body }}>
                {/* ── TOOLBAR (not printed) ── */}
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <div className="flex items-center gap-2">
                        {(['cover', 'glossary', 'quote'] as const).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {page === 'cover' ? '📄 Cover' : page === 'glossary' ? '📖 Glossary' : '📊 Quote'}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFontPicker(!showFontPicker)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-400 transition-colors flex items-center gap-2"
                        >
                            <span className="text-xs">Aa</span>
                            <span>{selectedFont.label}</span>
                            <span className="text-gray-400">▼</span>
                        </button>
                        {showFontPicker && (
                            <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden max-h-[480px] overflow-y-auto">
                                <div className="p-3 border-b border-gray-100">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Font Style</p>
                                </div>
                                {FONT_PRESETS.map(fp => (
                                    <button
                                        key={fp.id}
                                        onClick={() => { setSelectedFont(fp); setShowFontPicker(false); }}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedFont.id === fp.id ? 'bg-gray-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-base font-semibold text-gray-800"
                                                style={{ fontFamily: fp.heading }}
                                            >
                                                {fp.label}
                                            </span>
                                            {selectedFont.id === fp.id && <span className="text-blue-500">✓</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">{fp.description}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ══════════════════════════════════════ */}
                {/* COVER PAGE                             */}
                {/* ══════════════════════════════════════ */}
                {currentPage === 'cover' && (
                    <div className="min-h-[700px] flex flex-col justify-between py-16 px-12 border border-gray-200 rounded-lg">
                        {/* Top — company */}
                        <div>
                            <h1
                                className={`text-4xl font-bold text-gray-900 ${selectedFont.style}`}
                                style={{ fontFamily: selectedFont.heading }}
                            >
                                {companyName}
                            </h1>
                            <p className="text-lg text-gray-400 mt-3 max-w-md" style={{ fontFamily: selectedFont.body }}>
                                {companyTagline}
                            </p>
                        </div>

                        {/* Middle — quote info */}
                        <div className="space-y-8">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-[0.25em] mb-2" style={{ fontFamily: selectedFont.heading }}>
                                    Quotation
                                </p>
                                <h2
                                    className={`text-3xl font-semibold text-gray-800 ${selectedFont.style}`}
                                    style={{ fontFamily: selectedFont.heading }}
                                >
                                    {projectName}
                                </h2>
                            </div>
                            <div className="grid grid-cols-3 gap-8 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-[0.15em] mb-1">Prepared for</p>
                                    <p className="font-medium text-gray-800">{clientName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-[0.15em] mb-1">Reference</p>
                                    <p className="font-medium text-gray-800 font-mono">{qNum}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-[0.15em] mb-1">Date</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="h-px bg-gray-200" />
                            <div className="grid grid-cols-3 gap-8">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900">{sections.length}</p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Trade categories</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Line items</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900">{formatPrice(grandTotal)}</p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Total</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom — spacer (address removed per request) */}
                        <div />
                    </div>
                )}

                {/* ══════════════════════════════════════ */}
                {/* GLOSSARY PAGE                          */}
                {/* ══════════════════════════════════════ */}
                {currentPage === 'glossary' && (
                    <div className="border border-gray-200 rounded-lg px-12 py-10">
                        <h2
                            className={`text-2xl font-bold text-gray-900 mb-2 ${selectedFont.style}`}
                            style={{ fontFamily: selectedFont.heading }}
                        >
                            Glossary of Terms
                        </h2>
                        <p className="text-sm text-gray-400 mb-8">
                            Common renovation terminology used in this quotation.
                        </p>
                        <div className="grid grid-cols-1 gap-0">
                            {GLOSSARY.map((g, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-6 py-3.5 ${i < GLOSSARY.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <dt
                                        className="w-44 shrink-0 font-semibold text-sm text-gray-800"
                                        style={{ fontFamily: selectedFont.heading }}
                                    >
                                        {g.term}
                                    </dt>
                                    <dd className="text-sm text-gray-500 leading-relaxed">
                                        {g.definition}
                                    </dd>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════ */}
                {/* QUOTE PAGE                             */}
                {/* ══════════════════════════════════════ */}
                {currentPage === 'quote' && (
                    <div>
                        {/* Header bar */}
                        <div className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
                            <div>
                                <h2
                                    className={`text-2xl font-bold text-gray-900 ${selectedFont.style}`}
                                    style={{ fontFamily: selectedFont.heading }}
                                >
                                    Detailed Quotation
                                </h2>
                                <p className="text-xs text-gray-400 mt-1 font-mono">{qNum}</p>
                            </div>
                            <div className="flex gap-2 print:hidden">
                                <button onClick={expandAll} className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50">
                                    Expand All
                                </button>
                                <button onClick={collapseAll} className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-50">
                                    Collapse All
                                </button>
                            </div>
                        </div>

                        {/* Trade sections */}
                        <div className="space-y-3">
                            {sections.map((section, sIdx) => {
                                const isExpanded = expandedSections.has(section.id);
                                return (
                                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 font-mono w-6">
                                                    {String(sIdx + 1).padStart(2, '0')}
                                                </span>
                                                <div>
                                                    <h3
                                                        className="font-bold text-gray-900"
                                                        style={{ fontFamily: selectedFont.heading }}
                                                    >
                                                        {section.displayName}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {section.items.length} item{section.items.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-gray-900 text-lg">
                                                    {formatPrice(section.subtotalSelling)}
                                                </span>
                                                <span className="text-gray-400 text-sm print:hidden">
                                                    {isExpanded ? '▲' : '▼'}
                                                </span>
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="border-t border-gray-200">
                                                {section.items.map((item, iIdx) => {
                                                    const parsed = parseDescription(item.description);
                                                    const qty = getQuantity(item.dimensions);
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={`px-5 py-4 ${iIdx < section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                        >
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start gap-2">
                                                                        <span className="text-xs text-gray-400 font-mono mt-0.5 shrink-0">
                                                                            {sIdx + 1}.{iIdx + 1}
                                                                        </span>
                                                                        <div className="min-w-0">
                                                                            <h4 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: selectedFont.heading }}>
                                                                                {parsed.title}
                                                                            </h4>
                                                                            {parsed.details && (
                                                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                                                    {parsed.details}
                                                                                </p>
                                                                            )}
                                                                            {parsed.material && (
                                                                                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                                                                    🏷️ {parsed.material}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="shrink-0 text-right">
                                                                    <div className="font-semibold text-gray-900 text-sm">
                                                                        {formatPrice(item.sellingPrice)}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                                        {qty > 0 && `${qty} ${unitLabels[item.dimensions.unit]}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                                                    <span className="text-xs text-gray-400 uppercase tracking-widest">Section Subtotal</span>
                                                    <span className="font-bold text-gray-900">{formatPrice(section.subtotalSelling)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Grand total */}
                        <div className="mt-8 border-t-2 border-gray-900 pt-6">
                            <div className="flex justify-end">
                                <div className="w-72">
                                    <div className="flex justify-between py-3 border-t border-gray-200">
                                        <span className="text-lg font-bold text-gray-900" style={{ fontFamily: selectedFont.heading }}>
                                            Total
                                        </span>
                                        <span className="text-2xl font-black text-gray-900">{formatPrice(grandTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily: selectedFont.heading }}>
                                Terms & Conditions
                            </h3>
                            <div className="text-xs text-gray-500 space-y-1 leading-relaxed">
                                <p>1. This quotation is valid for <strong>14 days</strong> from the date above.</p>
                                <p>2. Payment terms: 40% upon confirmation, 50% mid-project, 10% upon handover.</p>
                                <p>3. All prices are in Singapore Dollars (SGD) and inclusive of labour unless stated otherwise.</p>
                                <p>4. Any additional works not covered in this quotation will be charged separately with prior approval.</p>
                                <p>5. Warranty: 1 year on workmanship, manufacturer&apos;s warranty on materials and appliances.</p>
                            </div>
                        </div>

                        {/* Acceptance */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: selectedFont.heading }}>Client Acceptance</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="border-b-2 border-gray-300 pb-2 mb-2 h-12" />
                                    <p className="text-xs text-gray-400">Client Signature & Date</p>
                                </div>
                                <div>
                                    <div className="border-b-2 border-gray-300 pb-2 mb-2 h-12" />
                                    <p className="text-xs text-gray-400">Company Representative & Date</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
